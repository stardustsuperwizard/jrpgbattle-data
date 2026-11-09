# The Descent

The jrpgbattle campaign's dungeon (jrpg-battle#305; this repository's #18), in `content/setting/dungeon.json`: what is in it. How a campaign works (floors, stretches, wipes, the town, the enchanter, how loot rolls) is the engine's `core/campaign.json`, and the two core numbers this world changes are in `content/setting/house-rules.json` (jrpg-battle decision 0050). It needs jrpg-battle 0.10.0 or later (tag `v0.10.1`; percentage bonuses on gear; strength by stretch came in 0.9.0 and the shop's stock by floor in 0.8.0). The content format is unchanged; the engine reads every block below as optional, and plays an older `dungeon.json` without them.

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

- **Strength by stretch** (`statGrowth` as entries by floor, jrpg-battle decision 0044): each stretch holds its monsters at one strength and the next steps up, so a stretch is learned and then left behind, and its first floor is the hard one.

  | Floors | Stretch | Monsters' stats, times their content | Their XP and gold, times their content |
  |---|---|---|---|
  | 1–5 | The Sacred Grove | 1.6 | 1.2 |
  | 6–10 | The Labyrinth | 3.2 | 1.7 |
  | 11–15 | The Stymphalian Marsh | 4.8 | 2.2 |
  | 16–20 | The Underworld | 6.4 | 2.7 |
  | 21–25 | Tartarus | 8.2 | 3.2 |
  | 26 on | The Endless Abyss | 8.8, then 0.3 more a floor | 3.5, then 0.1 more a floor |

  Before (roster 0.8.0 and earlier) monsters grew 0.3 of their content a floor from floor 1, so floor 25 was 8.2 and every floor a little harder than the last; Tartarus keeps that 8.2 for its whole stretch.
- **Level cap:** heroes now go up to level 25 (the house rule `rules.maxLevel` in `house-rules.json`; the engine's core says 10).
- **Waves:** the waves the party chooses set each floor's strength and pay. Three is the content's own; one is harder and pays more, five easier and paying less (`waveScaling`, jrpg-battle decision 0033).
- **Bosses:** a boss comes at 45% of its content stats (`bossShare`), times its stretch's strength.

The endless floors past 25 grow on their own, from a step above Tartarus.

## Loot, the town and the enchanter

- **Slots:** each hero wears one weapon, one armour, one pair of boots and one charm (`slots`, `gearSlots` 4); every item names its `slot`.
- **The shop's gear comes by stretch** (`shop.items` as stock entries, jrpg-battle decision 0043). Each stretch brings a new tier on sale before its first floor, and what came in stays. Each item upgrades the one below it of its slot: buying it over that one costs the difference.

  | On sale from | Tier | Weapon (ATK) | Armour (DEF) | Boots (SPD) | Charm (max HP) | Each |
  |---|---|---|---|---|---|---|
  | Floor 1 | Grove | 🗡️ Iron Dagger (+10) | 🦺 Leather Vest (+12) | 👟 Light Boots (+4) | 💗 Vigor Charm (+150) | 150 |
  | Floor 6 | Labyrinth | ⚔️ War Blade (+25) | 🛡️ Plate Mail (+30) | 🪽 Wind Boots (+10) | ❤️ Giant Belt (+400) | 400 |
  | Floor 11 | Marsh | 🔱 Bronze Spear (+25, +4%) | 🥉 Bronze Cuirass (+30, +4%) | 🩴 Courier's Sandals (+11) | 🐍 Asclepian Amulet (+400, +4%) | 1,000 |
  | Floor 16 | Underworld | 🌙 Adamant Harpe (+25, +7%) | 🏛️ Hoplite Panoply (+30, +7%) | 🕊️ Winged Sandals (+12) | 🟠 Amber of the Heliades (+400, +7%) | 1,800 |
  | Floor 21 | Tartarus | ⚡ Cyclopean Blade (+25, +10%) | 💎 Adamant Mail (+30, +10%) | 🌬️ Sandals of Zephyrus (+13) | 🍯 Phial of Ambrosia (+400, +10%) | 3,000 |

  The upper tiers add little power for a lot of gold, on purpose: they are where a deep party's gold goes, and too much power there made the Descent trivial (below). Their weapons, armour and charms keep the Labyrinth tier's flat bonus and add a percentage of the hero's own stat (jrpg-battle decision 0045), so they keep pace as heroes level instead of fading; the boots stay flat, because a share of speed moves turn order more than any other stat.
- **Loot:** cleared floors drop one item, and boss floors two more. The base item comes from the shop's tiers: the Grove tier from floor 1, then each stretch's tier and the one below it (the Grove and Labyrinth tiers from floor 6, the Labyrinth and Marsh tiers from floor 11, and so on to the Underworld and Tartarus tiers from floor 21). It drops as Common (no bonus), Magic (one) or Rare (two). The bonuses are ATK, DEF, max HP or SPD, and grow with depth. The stash holds 12 and sells at a quarter of an item's worth, so selling deep loot doesn't undo the gold sink.
- **The town:** the Exit, the Stash and the Shop from the start; the Enchanter after floor 10; Retire after floor 25.
- **The enchanter:** an item may have up to four bonuses.
  - Adding one costs 60 gold and 60 more per bonus, and works 90% → 45% of the time, wiping every bonus up to 20%.
  - Rerolling one costs 40 and 20 more per bonus.
- **Wipes:** a wipe costs a fifth of the party's gold and stands it back up at half HP.
- **Retiring:** each hero passes on one item as an Heirloom, half again as strong.

The town, the enchanter, wipes and retiring started as jrpg-battle 0.7.0's own, the same as its content.

## The numbers

The bot plays every turn and shops between floors, three waves a floor, at most 80 floors started per campaign. Measured with jrpg-battle 0.10.0's `simulate-campaign.js` and `simulate-run.js` on this repository's built content (below).

| Team | Campaigns that cleared the Descent | Wipes per campaign | Where they wipe | Run: floors cleared, median (p10–p90) | Gold at the end of a campaign |
|---|---|---|---|---|---|
| Athena, Zeus, Apollo, Artemis | 50 of 50 | 0.3 | A few entering the Labyrinth and Tartarus; most at Typhon | 32 (24–36) | 5,224 |
| Hephaestus, Poseidon, Aphrodite, Hermes | 50 of 50 | 1.2 | A few entering the Labyrinth, the Marsh and Tartarus; most at Typhon | 24 (15–31) | 4,817 |
| Ares, Hades, Apollo, Zeus | 50 of 50 | 5.2 | Entering the Labyrinth, the Marsh and Tartarus; most at Typhon | 16.5 (5–24) | 3,835 |

Measured on jrpg-battle 0.10.0. With roster 0.9.0's flat-only deep tiers, the same teams wiped 0.4, 1.8 and 8.1 times and the weakest team's runs cleared a median of 12 floors; the percentages help most where heroes are strongest by level and weakest by gear. Runs have no town to come back to, so a weak team's run still often ends at the Marsh's first floors. With strength by stretch (roster 0.9.0) the weakest team's runs fell from a median of 24 to 12. With roster 0.8.0's growth of 0.3 a floor, the same teams wiped 0.3, 1.1 and 8.5 times, almost all at Typhon. Roster 0.7.0, whose loot stopped at the Labyrinth tier and sold at half worth, ended with 3,510, 3,366 and 2,931 gold and wiped 0.2, 1.4 and 8.4 times; the bot sells its loot, so deeper loot at half worth brought the gold back up to 6,900–13,900 before the sell share fell to a quarter. Before the gear by stretch (roster 0.6.0, the shop's eight items on sale from floor 1), the same teams wiped 0.9, 3.5 and 16.8 times a campaign, their runs cleared a median of 26, 24 and 24 floors, and they ended with 37,212, 25,394 and 8,761 gold. Before that (statGrowth 0.5, level cap 10), Athena, Zeus, Apollo and Artemis cleared floor 11–12 at best in 60 tries, and runs ended around floor 9.

**Where the gold goes.** A cleared campaign used to end with 9,000 to 37,000 gold, because the shop's eight items were bought out early. Now each stretch brings dearer gear, and the bot spends nearly everything: 3,700 to 5,400 gold is left at the end. It never enchants, so a player has the enchanter as well. The first try at the upper tiers gave them their price in power (up to +115 ATK); the Descent then had no wipes at all and runs went to floor 44, so the tiers were cut to small steps.

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

- **Uniques with names from myth:** loot is a base item with rolled bonuses; the engine has no named uniques.
- **Loot worn by the bot:** the bot sells every item it finds, so the numbers above measure deep loot's gold, not its power. A player who wears a Rare Cyclopean Blade is stronger than the bot ever is.
