# The Descent

The jrpgbattle campaign's dungeon (jrpg-battle#305; this repository's #18), in `content/dungeon.json`. It needs jrpg-battle 0.8.0 or later (the shop's stock by floor). The content format is unchanged; the engine reads every block below as optional, and plays an older `dungeon.json` without them.

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

- **Slots:** each hero wears one weapon, one armour, one pair of boots and one charm (`slots`, `gearSlots` 4); every item names its `slot`.
- **The shop's gear comes by stretch** (`shop.items` as stock entries, jrpg-battle decision 0043). Each stretch brings a new tier on sale before its first floor, and what came in stays. Each item upgrades the one below it of its slot: buying it over that one costs the difference.

  | On sale from | Tier | Weapon (ATK) | Armour (DEF) | Boots (SPD) | Charm (max HP) | Each |
  |---|---|---|---|---|---|---|
  | Floor 1 | Grove | 🗡️ Iron Dagger (+10) | 🦺 Leather Vest (+12) | 👟 Light Boots (+4) | 💗 Vigor Charm (+150) | 150 |
  | Floor 6 | Labyrinth | ⚔️ War Blade (+25) | 🛡️ Plate Mail (+30) | 🪽 Wind Boots (+10) | ❤️ Giant Belt (+400) | 400 |
  | Floor 11 | Marsh | 🔱 Bronze Spear (+32) | 🥉 Bronze Cuirass (+38) | 🩴 Courier's Sandals (+11) | 🐍 Asclepian Amulet (+500) | 1,000 |
  | Floor 16 | Underworld | 🌙 Adamant Harpe (+40) | 🏛️ Hoplite Panoply (+46) | 🕊️ Winged Sandals (+12) | 🟠 Amber of the Heliades (+600) | 1,800 |
  | Floor 21 | Tartarus | ⚡ Cyclopean Blade (+48) | 💎 Adamant Mail (+55) | 🌬️ Sandals of Zephyrus (+13) | 🍯 Phial of Ambrosia (+720) | 3,000 |

  The upper tiers add little power for a lot of gold, on purpose: they are where a deep party's gold goes, and too much power there made the Descent trivial (below).
- **Loot:** cleared floors drop one item, and boss floors two more. The four cheaper items drop from floor 1 and all eight from floor 6, as Common (no bonus), Magic (one) or Rare (two). The bonuses are ATK, DEF, max HP or SPD, and grow with depth. The stash holds 12 and sells at half worth.
- **The town:** the Exit, the Stash and the Shop from the start; the Enchanter after floor 10; Retire after floor 25.
- **The enchanter:** an item may have up to four bonuses.
  - Adding one costs 60 gold and 60 more per bonus, and works 90% → 45% of the time, wiping every bonus up to 20%.
  - Rerolling one costs 40 and 20 more per bonus.
- **Wipes:** a wipe costs a fifth of the party's gold and stands it back up at half HP.
- **Retiring:** each hero passes on one item as an Heirloom, half again as strong.

The town, the enchanter, wipes and retiring started as jrpg-battle 0.7.0's own, the same as its content.

## The numbers

The bot plays every turn and shops between floors, three waves a floor, at most 80 floors started per campaign. Measured with jrpg-battle 0.8.0's `simulate-campaign.js` and `simulate-run.js` on this repository's built content (below).

| Team | Campaigns that cleared the Descent | Wipes per campaign | Where they wipe | Run: floors cleared, median (p10–p90) | Gold at the end of a campaign |
|---|---|---|---|---|---|
| Athena, Zeus, Apollo, Artemis | 50 of 50 | 0.2 | Only at Typhon (floor 25) | 31.5 (24–36) | 3,510 |
| Hephaestus, Poseidon, Aphrodite, Hermes | 50 of 50 | 1.4 | One each in the Underworld and Tartarus; the rest at Typhon | 24 (24–33) | 3,366 |
| Ares, Hades, Apollo, Zeus | 50 of 50 | 8.4 | A few on the way down; almost all at Typhon | 24 (14–24) | 2,931 |

Measured on jrpg-battle 0.8.0. Before the gear by stretch (roster 0.6.0, the shop's eight items on sale from floor 1), the same teams wiped 0.9, 3.5 and 16.8 times a campaign, their runs cleared a median of 26, 24 and 24 floors, and they ended with 37,212, 25,394 and 8,761 gold. Before that (statGrowth 0.5, level cap 10), Athena, Zeus, Apollo and Artemis cleared floor 11–12 at best in 60 tries, and runs ended around floor 9.

**Where the gold goes.** A cleared campaign used to end with 9,000 to 37,000 gold, because the shop's eight items were bought out early. Now each stretch brings dearer gear, and the bot spends nearly everything: about 3,000 gold is left at the end. It never enchants, so a player has the enchanter as well. The first try at the upper tiers gave them their price in power (up to +115 ATK); the Descent then had no wipes at all and runs went to floor 44, so the tiers were cut to small steps.

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
- **Loot from the upper tiers:** floors still drop only the Grove and Labyrinth tiers as base items. Adding the deeper tiers to the loot table would add power the shop's numbers don't account for, so it waits for its own measuring.
