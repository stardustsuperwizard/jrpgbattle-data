// The speed report: how much each god's PvP rests on its exact speed. Each
// god is played at its speed and at steps either side of it, in the core
// party against the core team with everyone in loadouts, as `npm run
// check`'s loadout column plays, nothing changed but that one god's speed.
// A smooth slope is a god whose speed helps it as speed should; a jump of
// many points across one step is a turn-order cliff, where the god passes
// or falls behind someone in the order, and a number tuned beside one is
// fragile (ROSTER.md, "Speed is the biggest lever in a loadout").
//   node scripts/speed.mjs [matches per step] [god ...] [--range 10] [--step 2]
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/speed.mjs
// It prints each god's win rate at each step and the biggest jump between
// neighbouring steps, and lists the core heroes' speeds (each with its
// boots in its loadout) to read the cliffs against.
import { checks, geared, measuringContent, share, withSpeed } from './measure.mjs';

const args = process.argv.slice(2);
const take = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i >= 0 ? Number(args.splice(i, 2)[1]) : fallback;
};
const range = take('--range', 10);
const step = take('--step', 2);
const [runsArg, ...only] = args;
const runs = Number(runsArg ?? 300);

const { world, config } = measuringContent();
const { coreParty, standsInFor, coreLoadouts = {} } = checks;
const gods = only.length ? only : Object.keys(world.heroes);
for (const god of gods) if (!world.heroes[god]) throw new Error(`No god "${god}" in the roster.`);
const pct = (n) => `${Math.round(n * 100)}%`.padStart(4);
const offsets = [];
for (let d = -range; d <= range; d += step) offsets.push(d);

// The core heroes' speeds as they play: Wind Boots are the only item that changes speed.
const bootSpeed = (id) => config.items[coreLoadouts[id]?.boots]?.stats?.spd ?? 0;
console.log(`Core team speeds in their loadouts: ${coreParty.map((id) => `${config.heroes[id].name} ${config.heroes[id].spd + bootSpeed(id)}`).join(', ')}`);
console.log(`${runs} matches a step, the god in the core party against the core team, everyone in loadouts. Speed is the god's base; its boots add their own.\n`);
console.log(`${'God'.padEnd(12)}${offsets.map((d) => (d === 0 ? '  base' : `${d > 0 ? '+' : ''}${d}`.padStart(6))).join('')}   biggest jump`);
for (const god of gods) {
  const base = config.heroes[god].spd;
  const party = coreParty.map((id) => (id === standsInFor[god] ? god : id));
  const rates = offsets.map((d) => share(geared(withSpeed(config, god, base + d), party, coreParty, runs)));
  const jumps = rates.slice(1).map((r, i) => ({ at: base + offsets[i], to: base + offsets[i + 1], by: r - rates[i] }));
  const cliff = jumps.reduce((a, b) => (Math.abs(b.by) > Math.abs(a.by) ? b : a));
  console.log(`${config.heroes[god].name.padEnd(12)}${rates.map((r) => pct(r).padStart(6)).join('')}   ${cliff.by >= 0 ? '+' : ''}${Math.round(cliff.by * 100)} from ${cliff.at} to ${cliff.to}`);
}
