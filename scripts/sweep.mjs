// The PvP pool's budget check (#33): jrpg-battle's loadout sweep (its #373)
// over every god. For each, every set the pools allow (one item from each
// slot's pool, 81 sets) is worn by that god in a bot-vs-bot mirror match
// against the same line-up wearing nothing, the line-up being the god's
// team in data/checks.json. It prints each option's win rate for each god,
// averaged over the sets that hold it, and which option is best for whom.
//   node scripts/sweep.mjs [matches per set]       (default 60)
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/sweep.mjs
//
// The pool's rule (the owner, on #33): no option is the best for every god,
// and every option is the best for at least one; so the best choice in each
// slot depends on the god. It exits 1 when a slot breaks that rule. Seeds
// are fixed, so the numbers are exact; ROSTER.md has the last run's.
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildContent } from './build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = resolve(process.env.JRPG_BATTLE ?? join(ROOT, '..', 'jrpg-battle'));
const runs = Number(process.argv[2] ?? 60);

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const load = (path) => import(pathToFileURL(join(ENGINE, path)).href);
const { assembleContent, buildConfig, validateConfig } = await load('src/engine/content.js');
const { readContent } = await load('scripts/content.js');
const { sweepLoadouts } = await load('scripts/sweep-loadouts.js');

// As a deployment loads the setting: the engine's core rules, this world over them.
const { content: setting } = buildContent(ROOT);
const config = validateConfig(buildConfig(assembleContent({ core: readContent(join(ENGINE, 'src', 'content')).core, setting })));
const { teams } = read(join(ROOT, 'data', 'checks.json'));
const name = (id) => config.items[id]?.name ?? id;
const pct = (n) => `${Math.round(n * 100)}%`.padStart(4);

console.log(`The PvP pool on each god: ${runs} bot-vs-bot mirror matches a set, against the god's team (data/checks.json) wearing nothing\n`);
/** By slot, by option: the gods it is best for. */
const best = {};
for (const god of Object.keys(setting.heroes)) {
  const party = teams.find((team) => team.includes(god));
  if (!party) throw new Error(`data/checks.json has no team with ${god}: the sweep needs one.`);
  const r = sweepLoadouts(config, { heroId: god, party, runs });
  const cells = r.options.map(({ slot, items }) => {
    const top = items.reduce((a, b) => (b.rate > a.rate ? b : a));
    ((best[slot] ??= Object.fromEntries(items.map((i) => [i.item, []])))[top.item]).push(god);
    return items.map((i) => `${name(i.item)} ${pct(i.rate)}`).join(', ');
  });
  console.log(`${config.heroes[god].name} (bare ${pct(r.baseline).trim()})`);
  r.options.forEach(({ slot }, i) => console.log(`  ${slot.padEnd(7)} ${cells[i]}`));
}

console.log('\nBest option in each slot, by god:');
const broken = [];
for (const [slot, by] of Object.entries(best)) {
  console.log(`  ${slot}: ${Object.entries(by).map(([item, gods]) => `${name(item)} (${gods.length ? gods.map((g) => config.heroes[g].name).join(', ') : 'none'})`).join('; ')}`);
  const never = Object.entries(by).filter(([, gods]) => !gods.length).map(([item]) => name(item));
  const always = Object.entries(by).filter(([, gods]) => gods.length === Object.keys(setting.heroes).length).map(([item]) => name(item));
  if (never.length) broken.push(`${slot}: ${never.join(', ')} is never the best`);
  if (always.length) broken.push(`${slot}: ${always.join(', ')} is the best for every god`);
}
if (broken.length) {
  console.log(`\nThe pool breaks its rule: ${broken.join('; ')}.`);
  process.exit(1);
}
console.log('\nEvery option is the best for some god, and none for all.');
