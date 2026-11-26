// What the check, the sweep and the speed report measure with: the world as
// a deployment loads it, with jrpg-battle's own heroes beside the champions
// so each can stand in for the core hero nearest its job, and the matches
// they play. Each god wears its default loadout and each core hero the one
// data/checks.json gives it, since a real match is played in loadouts and the
// gods are balanced PvP-first on them (ROSTER.md, "How the roster 0.24.0 pass
// was balanced").
//   JRPG_BATTLE=/path/to/jrpg-battle (default ../jrpg-battle)
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildContent } from './build.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ENGINE = resolve(process.env.JRPG_BATTLE ?? join(ROOT, '..', 'jrpg-battle'));

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
export const load = (path) => import(pathToFileURL(join(ENGINE, path)).href);

const { assembleContent, buildConfig, validateConfig, createMatch } = await load('src/engine/content.js');
const { simulate, simulatePvp } = await load('src/engine/simulate.js');
const { readContent, ruleset } = await load('scripts/content.js');
const { botPick, completePicks, pickSeed } = await load('src/engine/picks.js');

export { ruleset };

/** The settings data/checks.json holds for measuring: the core party, who stands in for whom, the core heroes' loadouts, sample teams. */
export const checks = read(join(ROOT, 'data', 'checks.json'));

/**
 * The world as a deployment loads it (`roster`), and the config the
 * measurements play: the same, with the engine's heroes and abilities beside
 * the champions. Throws when a champion reuses one of the engine's ids.
 */
export function measuringContent() {
  const { content: world } = buildContent(ROOT);
  const engine = readContent();
  const roster = assembleContent({ world, deployment: engine.deployment }, ruleset);
  validateConfig(buildConfig(roster, ruleset));
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
  return { world, engine, roster, config };
}

/** What a hero wears in a match measured in loadouts: a god its default, a core hero the one data/checks.json gives it, else nothing. */
export const wearingOf = (config) => (id) => ({ ...(config.heroes[id]?.defaultLoadout ?? checks.coreLoadouts?.[id] ?? {}) });

/** Every hero's loadout, by id: the file the engine's sweep takes as `wearing`. */
export const allLoadouts = (config) => Object.fromEntries(Object.keys(config.heroes).map((id) => [id, wearingOf(config)(id)]).filter(([, l]) => Object.keys(l).length));

const controllers = { blue: 'bot:default', red: 'bot:default' };

/** A PvP match on `config` with each team's line-up given, in loadouts where `loadouts` is given. */
export const pvpMatch = (config, seed, blue, red, loadouts) =>
  createMatch(config, { mode: 'pvp', seed, controllers, ...(loadouts ? { loadouts } : {}), picks: completePicks(config, { seed, mode: 'pvp', picks: { blue, red } }) });

/** The PvE party on the bot, against the world's practice waves. */
export const pve = (config, party, runs) => simulate((seed) => createMatch(config, { mode: 'pve', seed, party, controllers: { party: 'bot:default' } }), runs);

/** PvP between two line-ups with nobody wearing anything: the first team's results. */
export const pvp = (config, blue, red, runs) => simulatePvp((seed) => pvpMatch(config, seed, blue, red), runs);

/** PvP between two line-ups with every hero in its loadout. */
export const geared = (config, blue, red, runs) => {
  const wearing = wearingOf(config);
  return simulatePvp((seed) => pvpMatch(config, seed, blue, red, { blue: blue.map(wearing), red: red.map(wearing) }), runs);
};

/** The first team's share of the matches. */
export const share = (result) => (result.wins.blue ?? 0) / result.runs;

/**
 * A team for `god` from the champions alone, as the bot's blind pick makes
 * one (one of each class first), with `god` in place of whoever shares its
 * class, or else of the last. Seeded, so each seed's team is fixed.
 */
export function rosterTeam(config, gods, god, seed) {
  const team = botPick(config, 'pvp', 'blue', seed, { from: gods.filter((id) => id !== god) });
  const cls = config.heroes[god].class;
  const at = team.findIndex((id) => config.heroes[id].class === cls);
  return team.with(at >= 0 ? at : team.length - 1, god);
}

/**
 * `god` against the roster itself: in each seeded match it plays in a team
 * the bot's pick makes around it, against a team the bot's pick makes from
 * every champion, everyone in loadouts. Its win rate, measured against no
 * one team's speeds, so a turn-order cliff against the core team averages
 * out here (ROSTER.md, "Speed is the biggest lever in a loadout").
 */
export function vsRoster(config, gods, god, runs) {
  const wearing = wearingOf(config);
  return simulatePvp((seed) => {
    const blue = rosterTeam(config, gods, god, pickSeed(seed, 0));
    const red = botPick(config, 'pvp', 'red', pickSeed(seed, 1), { from: gods });
    return pvpMatch(config, seed, blue, red, { blue: blue.map(wearing), red: red.map(wearing) });
  }, runs);
}

/** The config with `god` at speed `spd`, nothing else changed: for the speed report. */
export const withSpeed = (config, god, spd) => ({ ...config, heroes: { ...config.heroes, [god]: { ...config.heroes[god], spd } } });
