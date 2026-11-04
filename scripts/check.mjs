// Checks the pack against a jrpg-battle checkout and measures each champion.
//   node scripts/check.mjs [runs]                 (default 300 battles per line)
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/check.mjs
//
// The pack folder, packs/<id>/, is a jrpg-battle content pack as decision
// 0016 defines it: a deployment copies it to src/content/packs/<id>/ and
// lists the id in src/content/packs.json. The check loads it exactly that
// way, through jrpg-battle's own pack reader, boundary check and merge, so
// a pack that passes here is one the server and the page accept.
//
// It also writes dist/tuning-import.json, the pack as tuning-panel settings,
// so the champions can be tried on a deployment that doesn't load the pack.
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = resolve(process.env.JRPG_BATTLE ?? join(ROOT, '..', 'jrpg-battle'));
const runs = Number(process.argv[2] ?? 300);

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const load = (path) => import(pathToFileURL(join(ENGINE, path)).href);
const { buildConfig, validateConfig, createMatch } = await load('src/engine/content.js');
const { simulate, simulatePvp } = await load('src/engine/simulate.js');
const { readPacks, shippedContent } = await load('scripts/content.js');
const { checkBoundaries } = await load('scripts/check-boundaries.js');

// The one pack folder this repository holds; its name is the pack's id.
const [PACK_ID, ...others] = readdirSync(join(ROOT, 'packs'));
if (!PACK_ID || others.length) throw new Error('packs/ must hold exactly one pack folder.');
const PACK_DIR = join(ROOT, 'packs', PACK_ID);

// The engine release the pack is checked against (engine.json), the release
// its manifest says it was built for (`core`), and the checkout actually in
// use must all agree: CI checks out the pinned tag, but a local run against a
// newer engine would otherwise pass on rules the site won't deploy.
const { tag: ENGINE_TAG } = read(join(ROOT, 'engine.json'));
if (typeof ENGINE_TAG !== 'string' || !/^v\d+\.\d+\.\d+$/.test(ENGINE_TAG)) {
  throw new Error(`engine.json's tag must be a release tag like "v0.1.0", not ${JSON.stringify(ENGINE_TAG)}.`);
}
const { core: BUILT_FOR } = read(join(PACK_DIR, 'manifest.json'));
if (BUILT_FOR !== ENGINE_TAG.slice(1)) {
  throw new Error(`engine.json pins ${ENGINE_TAG}, but packs/${PACK_ID}/manifest.json says core "${BUILT_FOR}". They must name the same release.`);
}
const { version: ENGINE_VERSION } = read(join(ENGINE, 'package.json'));
if (ENGINE_VERSION !== BUILT_FOR) {
  throw new Error(`The jrpg-battle checkout at ${ENGINE} is version ${ENGINE_VERSION}, but the pack is pinned to ${ENGINE_TAG}. Check it out first: git -C ${ENGINE} checkout ${ENGINE_TAG}`);
}

// Where a deployment puts the folder: its files must pass jrpg-battle's check:boundaries.
const asDeployed = [
  { path: 'src/content/packs.json', source: JSON.stringify([PACK_ID]) },
  ...readdirSync(PACK_DIR).map((name) => ({ path: `src/content/packs/${PACK_ID}/${name}`, source: readFileSync(join(PACK_DIR, name), 'utf8') })),
];
const violations = checkBoundaries(asDeployed);
if (violations.length) throw new Error(violations.map((v) => `${v.file}: ${v.reason}`).join('\n'));

// A content folder with only the index and this pack, read by the deployment's reader.
const contentDir = mkdtempSync(join(tmpdir(), 'pack-check-'));
let packs;
try {
  writeFileSync(join(contentDir, 'packs.json'), JSON.stringify([PACK_ID]));
  mkdirSync(join(contentDir, 'packs'));
  symlinkSync(PACK_DIR, join(contentDir, 'packs', PACK_ID), 'dir');
  packs = readPacks(contentDir);
} finally {
  rmSync(contentDir, { recursive: true, force: true });
}
const [pack] = packs;
const { manifest, elements, heroes, abilities } = pack;

// composeContent refuses any id core already defines, so a pack never replaces a balance hero.
const core = buildConfig(shippedContent([]));
const config = validateConfig(buildConfig(shippedContent(packs)));

const tuning = { elements, heroes, abilities };
mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'tuning-import.json'), `${JSON.stringify(tuning, null, 2)}\n`);

const speeds = new Map();
for (const hero of Object.values(config.heroes)) speeds.set(hero.spd, [...(speeds.get(hero.spd) ?? []), hero.name]);
const tiedSpeeds = [...speeds].filter(([, names]) => names.length > 1);

const pct = (n) => `${(n * 100).toFixed(1)}%`.padStart(6);
const pad = (text, width) => String(text).padEnd(width);
// Every hero team on the bot, as the engine's simulators play them: a person can't sit at a simulator.
const pve = (party) => simulate((seed) => createMatch({ ...config, party }, { mode: 'pve', seed, controllers: { party: 'bot:default' } }), runs);
const controllers = { blue: 'bot:default', red: 'bot:default' };
const pvp = (blue, red) => {
  const modes = structuredClone(config.modes);
  modes.pvp.teams[0].champions = blue;
  modes.pvp.teams[1].champions = red;
  return simulatePvp((seed) => createMatch({ ...config, modes }, { mode: 'pvp', seed, controllers }), runs);
};

// Each champion stands in for the core hero whose job is closest, so the
// numbers compare like with like: Aria the tank, Pyra area damage, Seren
// support, Vex single-target damage. Which is which lives in data/checks.json.
// PvE also rewards matching the waves' weaknesses (the wave-3 golem is weak
// only to lightning and ice), so PvP, where heroes have no weaknesses, is the
// fairer read of raw strength.
const { standsInFor: STANDS_IN_FOR, teams: ROSTER_TEAMS } = read(join(ROOT, 'data', 'checks.json'));

console.log(`${manifest.name} ${manifest.version}: ${Object.keys(heroes).length} champions, ${Object.keys(abilities).length} abilities, ${Object.keys(elements).length} new elements; loads as ${config.contentVersion}`);
console.log(`Engine: ${ENGINE} (${ENGINE_TAG})`);
console.log(tiedSpeeds.length ? `Shared speeds: ${tiedSpeeds.map(([spd, names]) => `${spd} (${names.join(', ')})`).join('; ')}` : 'Every hero, core and pack, has its own speed.');
console.log(`Wrote dist/tuning-import.json\n`);

const baseline = pve(core.party);
const mirror = pvp(core.party, core.party);
console.log(`${runs} battles per line. Core party: PvE win ${pct(baseline.winRate)}; PvP mirror blue ${pct(mirror.wins.blue / mirror.runs)}\n`);
console.log(`${pad('Champion', 18)}${pad('spd', 5)}${pad('in for', 8)}${pad('PvE win', 9)}${pad('vs core', 9)}PvP win vs core team`);
for (const [id, hero] of Object.entries(heroes)) {
  const slot = STANDS_IN_FOR[id];
  const party = core.party.map((h) => (h === slot ? id : h));
  const p = pve(party);
  const v = pvp(party, core.party);
  const delta = ((p.winRate - baseline.winRate) * 100).toFixed(1);
  console.log(`${pad(hero.name, 18)}${pad(hero.spd, 5)}${pad(slot ?? '?', 8)}${pad(pct(p.winRate), 9)}${pad(`${delta >= 0 ? '+' : ''}${delta}`, 9)}${pct(v.wins.blue / v.runs)}`);
}

console.log('\nAll-champion teams');
for (const team of ROSTER_TEAMS) {
  const p = pve(team);
  const v = pvp(team, core.party);
  console.log(`  ${team.map((id) => heroes[id].name).join(', ')}: PvE win ${pct(p.winRate)}, PvP win vs core team ${pct(v.wins.blue / v.runs)}`);
}
