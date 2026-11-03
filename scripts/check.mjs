// Checks the pack against a jrpg-battle checkout and measures each champion.
//   node scripts/check.mjs [runs]                 (default 300 battles per line)
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/check.mjs
// It also writes dist/tuning-import.json, the pack as tuning-panel settings,
// so the champions can be tried in the game before content packs (#248) exist.
//
// Until jrpg-battle loads packs itself, this merges the pack the way the
// tuning panel's Import does: onto the core content, adding ids only.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = resolve(process.env.JRPG_BATTLE ?? join(ROOT, '..', 'jrpg-battle'));
const runs = Number(process.argv[2] ?? 300);

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const engine = (file) => import(pathToFileURL(join(ENGINE, 'src', 'engine', file)).href);
const { buildConfig, mergeConfig, validateConfig, createBattle, createPvpMatch } = await engine('content.js');
const { simulate, simulatePvp } = await engine('simulate.js');

const CORE_FILES = ['manifest', 'rules', 'heroes', 'abilities', 'enemies', 'items', 'party', 'waves', 'modes'];
const core = buildConfig(Object.fromEntries(CORE_FILES.map((name) => [name, read(join(ENGINE, 'src', 'content', `${name}.json`))])));

const pack = read(join(ROOT, 'pack.json'));
const heroes = read(join(ROOT, 'data', 'heroes.json'));
const abilities = read(join(ROOT, 'data', 'abilities.json'));

// A pack only adds: reusing a core id would silently replace a balance hero.
const clashes = [
  ...Object.keys(heroes).filter((id) => Object.hasOwn(core.heroes, id)).map((id) => `hero "${id}"`),
  ...Object.keys(abilities).filter((id) => Object.hasOwn(core.abilities, id)).map((id) => `ability "${id}"`),
];
if (clashes.length) {
  console.error(`The pack reuses core ids: ${clashes.join(', ')}`);
  process.exit(1);
}

const tuning = { heroes, abilities };
const config = validateConfig(mergeConfig(core, tuning));
mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'tuning-import.json'), `${JSON.stringify(tuning, null, 2)}\n`);

const speeds = new Map();
for (const hero of Object.values(config.heroes)) speeds.set(hero.spd, [...(speeds.get(hero.spd) ?? []), hero.name]);
const tiedSpeeds = [...speeds].filter(([, names]) => names.length > 1);

const pct = (n) => `${(n * 100).toFixed(1)}%`.padStart(6);
const pad = (text, width) => String(text).padEnd(width);
const pve = (party) => simulate((seed) => createBattle({ ...config, party }, { seed }), runs);
const controllers = { blue: 'bot:default', red: 'bot:default' };
const pvp = (blue, red) => {
  const modes = structuredClone(config.modes);
  modes.pvp.teams[0].champions = blue;
  modes.pvp.teams[1].champions = red;
  return simulatePvp((seed) => createPvpMatch({ ...config, modes }, { seed, controllers }), runs);
};

// Each champion stands in for the core hero whose job is closest, so the
// numbers compare like with like: Aria the tank, Pyra area damage, Seren
// support, Vex single-target damage. Which is which lives in data/checks.json.
// PvE also rewards matching the waves' weaknesses (the wave-3 golem is weak
// only to lightning and ice), so PvP, where heroes have no weaknesses, is the
// fairer read of raw strength.
const { standsInFor: STANDS_IN_FOR, teams: ROSTER_TEAMS } = read(join(ROOT, 'data', 'checks.json'));

console.log(`${pack.name} ${pack.version}: ${Object.keys(heroes).length} champions, ${Object.keys(abilities).length} abilities, valid against ${core.contentVersion ? `core content ${core.contentVersion}` : 'core'}`);
console.log(`Engine: ${ENGINE}`);
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
