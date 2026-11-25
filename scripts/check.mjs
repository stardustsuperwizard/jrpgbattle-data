// Checks the roster against a jrpg-battle checkout and measures each champion.
//   node scripts/check.mjs [runs]                 (default 300 battles per line)
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/check.mjs
//
// The sources in content/world/ build (scripts/build.mjs) into a jrpg-battle
// world (its decision 0086), which a deployment drops over its src/world/
// whole; the rules are the jrpgbattle ruleset's, which the world's
// world.json names, with the features it enables. The check builds the
// files, puts them where a deployment would and runs jrpg-battle's boundary
// check, assembly and validation, so files that pass here are files the
// server and the page accept. To measure each champion against the engine's
// own heroes, it adds those heroes and their abilities beside the champions,
// on this world's monsters; a deployment has the champions alone.
//
// It also writes dist/tuning-import.json, the roster as tuning-panel settings,
// so the champions can be tried on a deployment that doesn't load them.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildContent, render } from './build.mjs';
import { ENGINE_SCHEMA_DIR, SCHEMA_DIR, engineSchemas, keptSchemas } from './schemas.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = resolve(process.env.JRPG_BATTLE ?? join(ROOT, '..', 'jrpg-battle'));
const runs = Number(process.argv[2] ?? 300);

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const load = (path) => import(pathToFileURL(join(ENGINE, path)).href);
const { assembleContent, buildConfig, validateConfig, createMatch, contentLayout } = await load('src/engine/content.js');
const { simulate, simulatePvp } = await load('src/engine/simulate.js');
const { readContent, ruleset } = await load('scripts/content.js');
const { checkBoundaries } = await load('scripts/check-boundaries.js');
const { completePicks } = await load('src/engine/picks.js');
const { loadSchemas, validate } = await load('tests/helpers/schema.js');

// engine.json names the jrpg-battle release CI checks against. The roster
// works with any engine holding the ruleset its world.json names, in the
// world format it names (jrpg-battle decisions 0023, 0086); assembleContent
// below refuses another by name, so no release numbers have to agree.
const { tag: ENGINE_TAG } = read(join(ROOT, 'engine.json'));
if (typeof ENGINE_TAG !== 'string' || !/^v\d+\.\d+\.\d+$/.test(ENGINE_TAG)) {
  throw new Error(`engine.json's tag must be a release tag like "v0.1.0", not ${JSON.stringify(ENGINE_TAG)}.`);
}
const { version: ENGINE_VERSION } = read(join(ENGINE, 'package.json'));

// The files a release drops over the engine's world: exactly the ruleset's world files.
const { content: world } = buildContent(ROOT);
const files = Object.keys(world);
const worldFiles = contentLayout(ruleset).world;
if (JSON.stringify([...files].sort()) !== JSON.stringify([...worldFiles].sort())) {
  throw new Error(`The build makes ${files.join(', ')}; jrpg-battle's ${ruleset.id} world files are ${worldFiles.join(', ')}.`);
}
if (world.world.ruleset !== ruleset.id) throw new Error(`world.json names the ruleset "${world.world.ruleset}"; jrpg-battle ${ENGINE_TAG}'s world plays ${ruleset.id}.`);

// Where a deployment puts them: they must pass jrpg-battle's check:boundaries.
const violations = checkBoundaries(files.map((name) => ({ path: `src/world/${name}.json`, source: render(world[name]) })));
if (violations.length) throw new Error(violations.map((v) => `${v.file}: ${v.reason}`).join('\n'));

// As a deployment loads them: this world in place of the engine's own, beside the engine's deployment files.
const engine = readContent();
const roster = assembleContent({ world, deployment: engine.deployment }, ruleset);
validateConfig(buildConfig(roster, ruleset));

// The schemas the API publishes are the ruleset's, as it wrote them (decisions 0053, 0086), and the world fits them.
const kept = keptSchemas(ROOT);
const theirs = engineSchemas(ENGINE);
const differ = [...new Set([...Object.keys(kept), ...Object.keys(theirs)])].filter((name) => kept[name] !== theirs[name]);
if (differ.length) throw new Error(`${SCHEMA_DIR}/ differs from jrpg-battle ${ENGINE_VERSION}'s ${ENGINE_SCHEMA_DIR}/ in ${differ.join(', ')}: run npm run schemas.`);
const schemas = loadSchemas(join(ENGINE, ENGINE_SCHEMA_DIR) + '/');
const misfits = files.flatMap((name) => validate(schemas, `${name}.schema.json`, world[name]).map((p) => `${name}.json ${p}`));
if (misfits.length) throw new Error(`The world doesn't fit the ${ruleset.id} world format's schemas:\n${misfits.join('\n')}`);

// The engine's heroes beside the champions, for measuring each against the hero it stands in for.
const defaults = assembleContent(engine, ruleset);
for (const kind of ['heroes', 'abilities']) {
  const clash = Object.keys(roster[kind]).filter((id) => Object.hasOwn(defaults[kind], id));
  if (clash.length) throw new Error(`The roster's ${kind} reuse jrpg-battle's ids ${clash.join(', ')}, so a champion couldn't be measured beside the hero it stands in for.`);
}
const config = validateConfig(buildConfig({
  ...roster,
  heroes: { ...defaults.heroes, ...roster.heroes },
  abilities: { ...defaults.abilities, ...roster.abilities },
}, ruleset));
const { manifest, heroes, abilities } = world;
// Where this world plays by other numbers than the ruleset's example world: its levels feature and how its campaign works.
const leaves = (value, prefix = '') => (value && typeof value === 'object' && !Array.isArray(value) ? Object.entries(value).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k)) : [prefix]);
const at = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
const differences = ['world', 'campaign'].flatMap((file) => leaves(world[file]).filter((path) => JSON.stringify(at(world[file], path)) !== JSON.stringify(at(engine.world[file], path)))
  .map((path) => `${file}.json ${path} ${JSON.stringify(at(world[file], path))} (the example's ${JSON.stringify(at(engine.world[file], path))})`));

const tuning = { heroes, abilities };
mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'tuning-import.json'), `${JSON.stringify(tuning, null, 2)}\n`);

const speeds = new Map();
for (const hero of Object.values(config.heroes)) speeds.set(hero.spd, [...(speeds.get(hero.spd) ?? []), hero.name]);
const tiedSpeeds = [...speeds].filter(([, names]) => names.length > 1);

const pct = (n) => `${(n * 100).toFixed(1)}%`.padStart(6);
const pad = (text, width) => String(text).padEnd(width);
// Every hero team on the bot, as the engine's simulators play them: a person can't sit at a simulator.
// Content has no party (decision 0025), so each line-up is passed in: PvE's as the party, PvP's as both teams' picks.
const pve = (party) => simulate((seed) => createMatch(config, { mode: 'pve', seed, party, controllers: { party: 'bot:default' } }), runs);
const controllers = { blue: 'bot:default', red: 'bot:default' };
const pvp = (blue, red, loadouts) => simulatePvp((seed) => createMatch(config, { mode: 'pvp', seed, controllers, ...(loadouts ? { loadouts } : {}), picks: completePicks(config, { seed, mode: 'pvp', picks: { blue, red } }) }), runs);

// Each champion stands in for the core hero whose job is closest, so the
// numbers compare like with like: Aria the tank, Pyra area damage, Seren
// support, Vex single-target damage. Which is which lives in data/checks.json.
// PvE also rewards matching the waves' weaknesses (the wave-3 golem is weak
// only to lightning and ice), so PvP, where heroes have no weaknesses, is the
// fairer read of raw strength.
const { coreParty: CORE_PARTY, standsInFor: STANDS_IN_FOR, coreLoadouts: CORE_LOADOUTS, teams: ROSTER_TEAMS } = read(join(ROOT, 'data', 'checks.json'));

// PvP is balanced first (ROSTER.md, "How to read them"), and a real match is
// played in loadouts, so the last column puts every hero in one: each god its
// own default, each core hero the one data/checks.json gives it. Speed boots
// decide some kits' turn order, which the bare column can't show.
const wearing = (id) => ({ ...(heroes[id]?.defaultLoadout ?? CORE_LOADOUTS[id] ?? {}) });
const geared = (blue, red) => pvp(blue, red, { blue: blue.map(wearing), red: red.map(wearing) });

console.log(`${manifest.name} ${manifest.version}: ${Object.keys(heroes).length} champions, ${Object.keys(abilities).length} abilities; loads as ${config.contentVersion}`);
console.log(`Engine: ${ENGINE} (${ENGINE_VERSION}; CI checks against ${ENGINE_TAG})`);
console.log(differences.length ? `Where this world differs from the ${ruleset.id} example world: ${differences.join('; ')}` : `The ${ruleset.id} example world's levels and campaign as they are.`);
console.log(tiedSpeeds.length ? `Shared speeds: ${tiedSpeeds.map(([spd, names]) => `${spd} (${names.join(', ')})`).join('; ')}` : "Every hero, the engine's and the roster's, has its own speed.");
console.log(`Wrote dist/tuning-import.json\n`);

const baseline = pve(CORE_PARTY);
const mirror = pvp(CORE_PARTY, CORE_PARTY);
const mirrorGeared = geared(CORE_PARTY, CORE_PARTY);
console.log(`${runs} battles per line. Core party: PvE win ${pct(baseline.winRate)}; PvP mirror blue ${pct(mirror.wins.blue / mirror.runs)}, in loadouts ${pct(mirrorGeared.wins.blue / mirrorGeared.runs)}\n`);
console.log(`${pad('Champion', 18)}${pad('spd', 5)}${pad('in for', 8)}${pad('PvE win', 9)}${pad('vs core', 9)}${pad('PvP bare', 10)}PvP in loadouts`);
for (const [id, hero] of Object.entries(heroes)) {
  const slot = STANDS_IN_FOR[id];
  const party = CORE_PARTY.map((h) => (h === slot ? id : h));
  const p = pve(party);
  const v = pvp(party, CORE_PARTY);
  const g = geared(party, CORE_PARTY);
  const delta = ((p.winRate - baseline.winRate) * 100).toFixed(1);
  console.log(`${pad(hero.name, 18)}${pad(hero.spd, 5)}${pad(slot ?? '?', 8)}${pad(pct(p.winRate), 9)}${pad(`${delta >= 0 ? '+' : ''}${delta}`, 9)}${pad(pct(v.wins.blue / v.runs), 10)}${pct(g.wins.blue / g.runs)}`);
}

console.log('\nAll-champion teams');
for (const team of ROSTER_TEAMS) {
  const p = pve(team);
  const v = pvp(team, CORE_PARTY);
  const g = geared(team, CORE_PARTY);
  console.log(`  ${team.map((id) => heroes[id].name).join(', ')}: PvE win ${pct(p.winRate)}, PvP win vs core team ${pct(v.wins.blue / v.runs)}, in loadouts ${pct(g.wins.blue / g.runs)}`);
}
