// Checks the roster against a jrpg-battle checkout and measures each champion.
//   node scripts/check.mjs [runs]                 (default 300 battles per line)
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/check.mjs
//
// content/ holds the content files a deployment overwrites in jrpg-battle's
// src/content/ (its decision 0030): the roster's manifest, heroes and
// abilities, each replacing the engine's file of that name. The check reads
// the engine's content with its own reader, puts these files where a
// deployment would and runs jrpg-battle's boundary check and validation, so
// files that pass here are files the server and the page accept. To measure
// each champion beside the engine's heroes, it keeps those heroes and their
// abilities next to the roster's, which a deployment's overwrite would drop.
//
// It also writes dist/tuning-import.json, the roster as tuning-panel settings,
// so the champions can be tried on a deployment that doesn't load them.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = resolve(process.env.JRPG_BATTLE ?? join(ROOT, '..', 'jrpg-battle'));
const runs = Number(process.argv[2] ?? 300);

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const load = (path) => import(pathToFileURL(join(ENGINE, path)).href);
const { buildConfig, validateConfig, createMatch, CONTENT_FILES } = await load('src/engine/content.js');
const { simulate, simulatePvp } = await load('src/engine/simulate.js');
const { readContent } = await load('scripts/content.js');
const { checkBoundaries } = await load('scripts/check-boundaries.js');
const { completePicks } = await load('src/engine/picks.js');

// engine.json names the jrpg-battle release CI checks against. The roster
// works with any engine whose content format matches its manifest's
// formatVersion (jrpg-battle decision 0023); buildConfig below refuses
// another format by name, so no release numbers have to agree.
const { tag: ENGINE_TAG } = read(join(ROOT, 'engine.json'));
if (typeof ENGINE_TAG !== 'string' || !/^v\d+\.\d+\.\d+$/.test(ENGINE_TAG)) {
  throw new Error(`engine.json's tag must be a release tag like "v0.1.0", not ${JSON.stringify(ENGINE_TAG)}.`);
}
const { version: ENGINE_VERSION } = read(join(ENGINE, 'package.json'));

// The files this repository overwrites: each must be one of the engine's content files.
const CONTENT_DIR = join(ROOT, 'content');
const files = readdirSync(CONTENT_DIR).map((name) => name.replace(/\.json$/, ''));
const unknown = files.filter((name) => !CONTENT_FILES.includes(name));
if (unknown.length) throw new Error(`content/ may hold only jrpg-battle's content files (${CONTENT_FILES.join(', ')}); not ${unknown.join(', ')}.`);
const roster = Object.fromEntries(files.map((name) => [name, read(join(CONTENT_DIR, `${name}.json`))]));

// Where a deployment puts them: they must pass jrpg-battle's check:boundaries.
const violations = checkBoundaries(files.map((name) => ({ path: `src/content/${name}.json`, source: readFileSync(join(CONTENT_DIR, `${name}.json`), 'utf8') })));
if (violations.length) throw new Error(violations.map((v) => `${v.file}: ${v.reason}`).join('\n'));

// The engine's content with the roster's files in place, keeping the engine's heroes beside the champions.
const engine = readContent(join(ENGINE, 'src', 'content'));
for (const kind of ['heroes', 'abilities']) {
  const clash = Object.keys(roster[kind] ?? {}).filter((id) => Object.hasOwn(engine[kind], id));
  if (clash.length) throw new Error(`The roster's ${kind} reuse jrpg-battle's ids ${clash.join(', ')}, so a champion couldn't be measured beside the hero it stands in for.`);
}
const config = validateConfig(buildConfig({
  ...engine,
  ...roster,
  heroes: { ...engine.heroes, ...roster.heroes },
  abilities: { ...engine.abilities, ...roster.abilities },
}));
// And as a deployment loads them, the roster's files replacing the engine's whole.
validateConfig(buildConfig({ ...engine, ...roster }));
const { manifest, heroes, abilities } = roster;

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
const pvp = (blue, red) => simulatePvp((seed) => createMatch(config, { mode: 'pvp', seed, controllers, picks: completePicks(config, { seed, mode: 'pvp', picks: { blue, red } }) }), runs);

// Each champion stands in for the core hero whose job is closest, so the
// numbers compare like with like: Aria the tank, Pyra area damage, Seren
// support, Vex single-target damage. Which is which lives in data/checks.json.
// PvE also rewards matching the waves' weaknesses (the wave-3 golem is weak
// only to lightning and ice), so PvP, where heroes have no weaknesses, is the
// fairer read of raw strength.
const { coreParty: CORE_PARTY, standsInFor: STANDS_IN_FOR, teams: ROSTER_TEAMS } = read(join(ROOT, 'data', 'checks.json'));

console.log(`${manifest.name} ${manifest.version}: ${Object.keys(heroes).length} champions, ${Object.keys(abilities).length} abilities; loads as ${config.contentVersion}`);
console.log(`Engine: ${ENGINE} (${ENGINE_VERSION}; CI checks against ${ENGINE_TAG})`);
console.log(tiedSpeeds.length ? `Shared speeds: ${tiedSpeeds.map(([spd, names]) => `${spd} (${names.join(', ')})`).join('; ')}` : "Every hero, the engine's and the roster's, has its own speed.");
console.log(`Wrote dist/tuning-import.json\n`);

const baseline = pve(CORE_PARTY);
const mirror = pvp(CORE_PARTY, CORE_PARTY);
console.log(`${runs} battles per line. Core party: PvE win ${pct(baseline.winRate)}; PvP mirror blue ${pct(mirror.wins.blue / mirror.runs)}\n`);
console.log(`${pad('Champion', 18)}${pad('spd', 5)}${pad('in for', 8)}${pad('PvE win', 9)}${pad('vs core', 9)}PvP win vs core team`);
for (const [id, hero] of Object.entries(heroes)) {
  const slot = STANDS_IN_FOR[id];
  const party = CORE_PARTY.map((h) => (h === slot ? id : h));
  const p = pve(party);
  const v = pvp(party, CORE_PARTY);
  const delta = ((p.winRate - baseline.winRate) * 100).toFixed(1);
  console.log(`${pad(hero.name, 18)}${pad(hero.spd, 5)}${pad(slot ?? '?', 8)}${pad(pct(p.winRate), 9)}${pad(`${delta >= 0 ? '+' : ''}${delta}`, 9)}${pct(v.wins.blue / v.runs)}`);
}

console.log('\nAll-champion teams');
for (const team of ROSTER_TEAMS) {
  const p = pve(team);
  const v = pvp(team, CORE_PARTY);
  console.log(`  ${team.map((id) => heroes[id].name).join(', ')}: PvE win ${pct(p.winRate)}, PvP win vs core team ${pct(v.wins.blue / v.runs)}`);
}
