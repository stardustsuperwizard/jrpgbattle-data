# The Descent

The jrpgbattle campaign's dungeon (jrpg-battle#305; this repository's #18), in `content/dungeon.json`. It needs jrpg-battle 0.7.0 or later. The content format is unchanged; the engine reads every block below as optional, and plays an older `dungeon.json` without them.

## The map

25 floors in five stretches of five, each with its own theme, monsters and boss on its last floor. The theme is a name the site picks its scene and music by (`floor_start`'s `theme`). Past floor 25, once Typhon has fallen, the way down goes on.

| Floors | Theme (`id`) | Monsters | Boss |
|---|---|---|---|
| 1–5 | The Sacred Grove (`grove`) | Slime, Goblin, Dire Wolf; from 3, the Goblin Shaman and the Erymanthian Boar | 🗿 Ancient Golem |
| 6–10 | The Labyrinth (`labyrinth`) | Goblin, Goblin Shaman, Erymanthian Boar, Spartoi, Dracaena, Harpy | 🐂 Minotaur |
| 11–15 | The Stymphalian Marsh (`marsh`) | Harpy, Dracaena, Phoenix, Drakon, Hoplite | 🐉 Lernaean Hydra |
| 16–20 | The Underworld (`underworld`) | Shade, Necromancer, Spartoi, Myrmidon, Hoplite | 🐕 Cerberus |
| 21–25 | Tartarus (`tartarus`) | Shade, Necromancer, Myrmidon, Drakon, Phoenix, Hoplite | 🌪️ Typhon, the final boss |
| 26 on | The Endless Abyss (`abyss`) | Every monster from the Dire Wolf on | Any of the five |

Each stretch keeps one healer among its monsters (the Shaman, then the Phoenix) except the Underworld, where the Necromancer's curses take its place.

## How hard it gets

- **Growth:** monsters grow 30% of their content stats a floor (`statGrowth` 0.3; it was 0.5). At 0.5, floor 13's monsters had seven times their stats, and every team walled at floors 11–13 with its heroes at the level cap.
- **Level cap:** heroes now go up to level 25 (`maxLevel` in `rules.json`; it was 10).
- **Waves:** the waves the party chooses set each floor's strength and pay. Three is the content's own; one is harder and pays more, five easier and paying less (`waveScaling`, jrpg-battle decision 0033).
- **Bosses:** a boss comes at 45% of its content stats (`bossShare`), times the floor's growth.

The engine has one growth for the whole dungeon, so the endless floors grow on as the Descent does. #18 asked for monsters fixed by stretch (`statGrowth` 0) with their own growth after floor 25. That needs a per-stretch strength in the engine, which it doesn't have yet.

## Loot, the town and the enchanter

- **Slots:** each hero wears one weapon, one armour, one pair of boots and one charm (`slots`, `gearSlots` 4); every item names its `slot`. The shop's dearer items upgrade their cheaper parts: the War Blade over the Iron Dagger, the Giant Belt over the Vigor Charm.
- **Loot:** cleared floors drop one item, and boss floors two more. The four cheaper items drop from floor 1 and all eight from floor 6, as Common (no bonus), Magic (one) or Rare (two). The bonuses are ATK, DEF, max HP or SPD, and grow with depth. The stash holds 12 and sells at half worth.
- **The town:** the Exit, the Stash and the Shop from the start; the Enchanter after floor 10; Retire after floor 25.
- **The enchanter:** an item may have up to four bonuses.
  - Adding one costs 60 gold and 60 more per bonus, and works 90% → 45% of the time, wiping every bonus up to 20%.
  - Rerolling one costs 40 and 20 more per bonus.
- **Wipes:** a wipe costs a fifth of the party's gold and stands it back up at half HP.
- **Retiring:** each hero passes on one item as an Heirloom, half again as strong.

These started as jrpg-battle 0.7.0's own, the same as its content.

## The numbers

The bot plays every turn and shops between floors, three waves a floor, at most 80 floors started per campaign. Measured with jrpg-battle 0.7.0's `simulate-campaign.js` and `simulate-run.js` on this repository's built content (below).

| Team | Campaigns that cleared the Descent | Wipes per campaign | Where they wipe | Run: floors cleared, median (p10–p90) |
|---|---|---|---|---|
| Athena, Zeus, Apollo, Artemis | 50 of 50 | 0.9 | Almost all at Typhon (floor 25) | 26 (24–32) |
| Hephaestus, Poseidon, Aphrodite, Hermes | 50 of 50 | 3.5 | A few in the Marsh and Underworld; most at Typhon | 24 (21–27) |
| Ares, Hades, Apollo, Zeus | 49 of 50 | 16.8 | The Marsh and Hydra, then Typhon many times | 24 (11–24) |

Before (statGrowth 0.5, level cap 10), Athena, Zeus, Apollo and Artemis cleared floor 11–12 at best in 60 tries, and runs ended around floor 9.

**Gold piles up.** A party that clears the Descent ends with 9,000 to 37,000 gold, because the shop's eight items are bought out early and the bot never enchants. The enchanter is the sink for now. Shop stock that grows with depth is jrpg-battle#295.

### Measuring

Build, then run the engine's simulators on a copy of a jrpg-battle checkout with this content over its own:

```sh
npm run build
cp -r ../jrpg-battle /tmp/descent && cp -r dist/src /tmp/descent/
cd /tmp/descent
node scripts/simulate-campaign.js 50 --party athena,zeus,apollo,artemis --attempts 80
node scripts/simulate-run.js 200 --party athena,zeus,apollo,artemis
```

## Not yet (#18)

- **Monsters fixed by stretch**, and the endless floors' own growth: both need the engine (above).
- **Uniques with names from myth:** loot is a base item with rolled bonuses; the engine has no named uniques.
- **Shop stock by stretch:** jrpg-battle#295.
- **Art:** the site draws the Hydra, Cerberus and Typhon as emoji until jrpgbattle-client-premium has their enemy recipes. It also has scenes for none of the themes yet, only its garden.
