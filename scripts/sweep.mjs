// The PvP pool's budget check (#33): jrpg-battle's loadout sweep (its #373)
// over every god. For each, every set the pools allow (one item from each
// slot's pool, 108 sets) is worn by that god in the core party, in place of
// the core hero it stands in for, against the core team, every other hero on
// both teams in its own loadout, as `npm run check`'s loadout column plays
// (jrpg-battle 0.61.0's --against and --wearing). It prints each option's
// win rate for each god, averaged over the sets that hold it, with its
// margin, and which option is best for whom: an option within the leader's
// margin ties for best, and a leader with no option within its margin is the
// clear best.
//   node scripts/sweep.mjs [matches per set]       (default 60)
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/sweep.mjs
//
// The pool's rule (the owner, on #33): no option is the best for every god,
// and every option is the best for at least one; so the best choice in each
// slot depends on the god. Against a team in its loadouts the options often
// land within their margins of each other, so a tie counts as the best for
// "at least one", and only a clear best counts for "every god": options
// that tie for everyone are a slot in balance, not one that dominates. It
// exits 1 when a slot breaks that rule. Seeds
// are fixed, so the numbers are exact; ROSTER.md has the last run's.
import { allLoadouts, checks, load, measuringContent } from './measure.mjs';

const runs = Number(process.argv[2] ?? 60);
const { sweepLoadouts } = await load('scripts/sweep-loadouts.js');

const { world, config } = measuringContent();
const { coreParty, standsInFor } = checks;
const wearing = allLoadouts(config);
const name = (id) => config.items[id]?.name ?? id;
const pct = (n) => `${Math.round(n * 100)}%`.padStart(4);
const gods = Object.keys(world.heroes);

console.log(`The PvP pool on each god: ${runs} bot-vs-bot matches a set, the god in the core party against the core team, everyone else in its loadout\n`);
/** By slot, by option: the gods it is best for, or ties for; and those it is clearly best for. */
const best = {};
const clear = {};
for (const god of gods) {
  const slot = standsInFor[god];
  if (!coreParty.includes(slot)) throw new Error(`data/checks.json has ${god} stand in for "${slot}", who isn't in the core party.`);
  const party = coreParty.map((id) => (id === slot ? god : id));
  const r = sweepLoadouts(config, { heroId: god, party, runs, against: coreParty, wearing });
  const cells = r.options.map(({ slot: slotId, items }) => {
    const top = items.reduce((a, b) => (b.rate > a.rate ? b : a));
    const tied = items.filter((i) => top.rate - i.rate <= top.margin);
    const by = (best[slotId] ??= Object.fromEntries(items.map((i) => [i.item, []])));
    for (const i of tied) by[i.item].push(god);
    const clearly = (clear[slotId] ??= Object.fromEntries(items.map((i) => [i.item, []])));
    if (tied.length === 1) clearly[top.item].push(god);
    return items.map((i) => `${name(i.item)} ${pct(i.rate)}${tied.includes(i) ? '*' : ''}`).join(', ');
  });
  console.log(`${config.heroes[god].name} (in its own loadout ${pct(r.baseline).trim()})`);
  r.options.forEach(({ slot: slotId }, i) => console.log(`  ${slotId.padEnd(7)} ${cells[i]}`));
}
console.log('\n* the best, or within its margin of it (about 95% of its matches).');

console.log('\nBest option in each slot, by god (ties count for each; ! marks a clear best):');
const broken = [];
for (const [slot, by] of Object.entries(best)) {
  const mark = (item, g) => `${config.heroes[g].name}${clear[slot][item].includes(g) ? '!' : ''}`;
  console.log(`  ${slot}: ${Object.entries(by).map(([item, list]) => `${name(item)} (${list.length ? list.map((g) => mark(item, g)).join(', ') : 'none'})`).join('; ')}`);
  const never = Object.entries(by).filter(([, list]) => !list.length).map(([item]) => name(item));
  const always = Object.entries(clear[slot]).filter(([, list]) => list.length === gods.length).map(([item]) => name(item));
  if (never.length) broken.push(`${slot}: ${never.join(', ')} is never the best`);
  if (always.length) broken.push(`${slot}: ${always.join(', ')} is clearly the best for every god`);
}
if (broken.length) {
  console.log(`\nThe pool breaks its rule: ${broken.join('; ')}.`);
  process.exit(1);
}
console.log('\nEvery option is the best for some god, and none for all.');
