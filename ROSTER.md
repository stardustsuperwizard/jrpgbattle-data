# Roster: the Olympians

Sixteen Greek gods built only from jrpg-battle's building blocks: damage, heal, shield, status, cleanse and remove_status effects; jrpg-battle's statuses burn, shock, bleed, freeze, ATK Up, RES Down and Taunt; and its two damage types, physical and magic, each with its own attack and resistance (jrpg-battle decisions 0055 and 0056). The statuses and elements are the engine's own core (jrpg-battle decisions 0050 and 0055), not this repository's. Every champion has its own speed, different from each other and from the core heroes (Aria 96, Seren 99, Pyra 102, Vex 120), so mixed teams tie on speed far less than the mirror match does.

| Champion | Class | Role | Damage type | Elements | Spd | HP | PHYS ATK | MAG ATK | PHYS RES | MAG RES | Skill | Ultimate |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🪽 Hermes | Support | Messenger: SP battery | Physical | Wind, Dark | 124 | 980 | 135 | 135 | 75 | 55 | Winged Sandals: single + Shock | Psychopomp: all, 60% Shock |
| 🏆 Nike | Striker | Winged Victory: fast breaker | Physical | Wind | 122 | 960 | 150 | 150 | 71 | 53 | Swift Victory: single, high Toughness damage, ATK Up self | Laurel of Victory: heavy blast, ATK Up all |
| 🏹 Artemis | Striker | Huntress: single target | Physical | Metal | 116 | 1000 | 155 | 155 | 75 | 55 | Silver Arrow: heavy single + Bleed | The Hunt: massive single |
| 🍇 Dionysus | Striker | Reveller: bleed and madness | Physical | – | 112 | 1150 | 150 | 150 | 81 | 60 | Maenad Frenzy: single + Bleed, ATK Up self | Bacchic Revel: all + Bleed, 50% Confuse, ATK Up all |
| ☀️ Apollo | Support | Sun Healer | Magic | Fire | 110 | 1100 | 110 | 110 | 68 | 92 | Healing Light: heal one + cleanse | Chariot of the Sun: all + Burn, heal all, ATK Up all |
| 🗡️ Ares | Striker | War God: bruiser | Physical | – | 108 | 1400 | 140 | 140 | 109 | 81 | Bloodlust: single + Taunt | Rout: heavy blast + Bleed |
| 🌹 Aphrodite | Support | Enchantress: SP battery, party heal | Magic | Water | 106 | 1050 | 110 | 110 | 64 | 86 | Embrace: heal all 12% + ATK Up all | Born of the Foam: all, 40% Freeze, heal all |
| ⚡ Zeus | Caster | Sky King: area damage | Magic | Lightning | 104 | 1000 | 160 | 160 | 55 | 75 | Thunderbolt: blast, 60% Shock | King of Olympus: heavy all + Shock |
| 🌾 Demeter | Support | Harvest Mother: healer | Magic | Earth | 101 | 1150 | 105 | 105 | 68 | 92 | Bountiful Harvest: heal one 25% + 80, heal all 10% | Barren Earth: all + RES Down, heal all 22% |
| 👑 Hera | Guardian | Queen of Heaven: tank who heals and raises | Physical | Metal | 100 | 1500 | 120 | 120 | 129 | 95 | Queen’s Ward: shield all, heal all 5%, Taunt | Peacock’s Gaze: all + RES Down, heal all 10%, revive the fallen at 30% |
| 🦉 Athena | Guardian | Strategist: tank | Physical | Metal | 98 | 1450 | 115 | 115 | 138 | 102 | Aegis: shield all + Taunt | Owl's Gambit: heavy single, ATK Up all |
| 🔱 Poseidon | Caster | Sea King: area control | Magic | Water, Earth | 97 | 1150 | 145 | 145 | 68 | 92 | Tidal Wave: all, 25% Freeze | Earthshaker: heavy all + RES Down |
| 💀 Hades | Caster | Underworld King: damage over time | Magic | Dark | 94 | 1150 | 145 | 145 | 64 | 86 | Grasp of the Dead: single + Burn + RES Down | Realm of the Dead: all + 3-turn Burn |
| 🌸 Persephone | Caster | Queen of Two Realms: freeze control, then healing | Magic | Ice, Earth, Dark | 92 | 1100 | 150 | 150 | 61 | 83 | Winter’s Descent: blast, 35% Freeze · in spring, First Flowers: heal one 20% + 60, all 8% | Spring’s Return: all, 30% Freeze, heal all 15%, to spring · in spring, Pomegranate Seed: all + RES Down, back below |
| 🔥 Hestia | Guardian | Hearth Keeper: magic tank, cleanse, hits back | Magic | Fire | 90 | 1500 | 120 | 120 | 98 | 132 | Sacred Flame: shield all, cleanse all, Taunt, Retaliate | Eternal Flame: all + Burn, heal self 25% |
| 🔨 Hephaestus | Guardian | Smith: armor tank | Physical | Metal, Fire | 88 | 1550 | 130 | 130 | 126 | 94 | Forge Armor: heavy shield all | Molten Hammer: massive single + Burn |

The sixteen share the character group **Gods of Olympus** (every hero has a `characterGroup`, the title of its set). Each god has a class, a label for now (jrpg-battle decision 0054; what a class might do is jrpg-battle#363): Guardian, Striker, Caster or Support. The bot's pick spreads a team across classes.

Hermes and Aphrodite's basic attacks gain 2 SP instead of 1, so they pay for their teammates' skills.

**Roster 0.19.0 adds six** (Hera, Hestia, Dionysus, Nike, Demeter, Persephone), bringing every class to four: Guardians Athena, Hephaestus, Hera, Hestia; Strikers Artemis, Ares, Dionysus, Nike; Casters Zeus, Poseidon, Hades, Persephone; Supports Hermes, Apollo, Aphrodite, Demeter. Demeter is the third healer. Her skill targets one ally, with a smaller heal for the rest, because the bot holds back a party-wide skill while anyone is shielded and saves SP only for single-target heals (jrpg-battle's `src/engine/autoplay.js`); a party-only heal tested at 46% PvE. Hestia is the first magic Guardian, Nike the third ranged god and Persephone the first to use ice.

**Fuller kits (roster 0.20.0, jrpg-battle 0.25.0 and its decision 0060).** Four of the six use the engine's newest building blocks:

- **Hera** raises the fallen: Peacock's Gaze revives every fallen ally with 30% of its max HP (a `revive` effect).
- **Dionysus** drives his foes mad: Bacchic Revel has a 50% chance to Confuse each enemy for 2 turns, so its single-target skills may land on anyone else, its own side included (the core's `confuse`).
- **Persephone** changes with the seasons. She starts as Queen of the Dead, her own form: frost, Freeze and control. Spring's Return brings her up as the **Maiden of Spring** (her `forms`), with Blossom, the healing First Flowers and Pomegranate Seed, which hits every enemy, lowers their RES and takes her back below.
- **Hestia**'s hearth fire burns whoever strikes its keeper: Sacred Flame gives her Retaliate for 2 turns, hitting back at each blow for 40% of her MAG ATK (the core's `retaliate`).

**Two layers on an attack** (jrpg-battle decisions 0055 to 0057). The **damage type**, physical or magic, is what an attack is: each type has its own attack stat and resistance (below). The **element**, set on a skill, is the kind of force it is: fire, water, earth, wind, lightning, ice, dark or metal. An element only chooses a client's animation and sound for now, so a skill with none plays its damage type's default; Zeus's lightning is a magic hit of lightning, Hephaestus's Molten Hammer a physical hit of fire. Later an element can become its own lever for builds. What follows is the damage types. Every god and monster has a PHYS ATK and a MAG ATK instead of ATK, and a PHYS RES and a MAG RES instead of DEF. A hit is driven by the attack of its element and lowered by the resistance of the same: `physical` is PHYS ATK against PHYS RES, `magic` is MAG ATK against MAG RES. Both attacks of every god and monster equal its old ATK for now, since no skill uses the other type yet. There are no weaknesses. A god fights with body and weapon (Physical: Hermes, Nike, Artemis, Dionysus, Ares, Hera, Athena, Hephaestus) or with divine power (Magic: Apollo, Aphrodite, Zeus, Demeter, Poseidon, Hades, Persephone, Hestia); the water, dark, light and wind the myths ask for are no longer approximated with ice or fire. Each god's resistances are the old DEF, 15% higher against their own damage type and 15% lower against the other, so a physical bruiser is harder to hit physically than magically. A world may still add elements, each resisted by one of the two stats.


## PvP gear

In PvP each god wears a **loadout**: one item in each slot, chosen from that slot's **pool** after the team pick, blind, with its own timer (jrpg-battle decisions 0058 and 0059; against the bot from jrpg-battle 0.23.0, online later). The pool is the Labyrinth's tier, three sidegrades a slot on one budget, which the campaign shop also sells from floor 6 (DUNGEON.md). The ladder above it (the Bronze Spear and up) is PvE-only, so the strongest campaign gear is never a free pick.

| Slot | Flat, for low stats | Percentage, for high stats | The third way |
|---|---|---|---|
| Weapon | ⚔️ War Blade: +25 PHYS and MAG ATK | 🪓 Battle Axe: +26% PHYS ATK | 🪄 Mage Staff: +21% MAG ATK |
| Armour | 🛡️ Plate Mail: +30 PHYS, +15 MAG RES | 🥋 Brigandine: +30% both RES | 👘 Mystic Robe: +15 PHYS, +30 MAG RES |
| Boots | 🪽 Wind Boots: +10 SPD | 🥾 Iron Greaves: +15% HP, +12% both RES | 👢 War Boots: +10% both ATK |
| Charm | ❤️ Giant Belt: +400 HP | 🔰 Ward Charm: +36% both RES | 🔥 War Charm: +15% both ATK |

**Each god's default loadout** leans into its kit, so a god is ready to play without anyone opening the loadout screen (`defaultLoadout`; the bot wears it too):

| God | Weapon | Armour | Boots | Charm | Why |
|---|---|---|---|---|---|
| ⚡ Zeus | Mage Staff | Mystic Robe | War Boots | War Charm | A caster: all-in on magic damage |
| 🔱 Poseidon | Mage Staff | Mystic Robe | Wind Boots | War Charm | A caster who controls: magic, and speed to freeze first |
| 💀 Hades | Mage Staff | Mystic Robe | Wind Boots | Giant Belt | A caster who lasts: his burns need him standing |
| 🏹 Artemis | Battle Axe | Plate Mail | War Boots | Giant Belt | A striker: her high PHYS ATK scales with percentages |
| 🗡️ Ares | Battle Axe | Brigandine | Iron Greaves | Giant Belt | A bruiser: damage on a body that takes the taunt |
| 🦉 Athena | Battle Axe | Brigandine | Iron Greaves | Giant Belt | A tank: her high resistances scale with percentages |
| 🔨 Hephaestus | Battle Axe | Brigandine | Iron Greaves | Ward Charm | The armour tank: resistance on resistance |
| ☀️ Apollo | War Blade | Mystic Robe | War Boots | War Charm | A healer who hits: flat on his low attack, magic armour |
| 🌹 Aphrodite | War Blade | Plate Mail | Wind Boots | Giant Belt | A battery: speed and staying power, to keep the SP flowing |
| 🪽 Hermes | Battle Axe | Plate Mail | Wind Boots | War Charm | The fastest god, made faster, with damage to spend his SP on |
| 👑 Hera | Battle Axe | Brigandine | Iron Greaves | Giant Belt | A tank, like Athena |
| 🔥 Hestia | Mage Staff | Brigandine | Wind Boots | Ward Charm | The magic tank: resistance, and speed to shield before the first blow |
| 🍇 Dionysus | Battle Axe | Plate Mail | Wind Boots | War Charm | A striker who wants to bleed them first |
| 🏆 Nike | Battle Axe | Plate Mail | Wind Boots | War Charm | Speed to act first, damage to break with |
| 🌾 Demeter | War Blade | Mystic Robe | Wind Boots | War Charm | A healer who acts early and hits back: flat on her low attack |
| 🌸 Persephone | Mage Staff | Mystic Robe | War Boots | War Charm | A caster: all-in on magic damage |

**The budget check** (`npm run sweep`, jrpg-battle's loadout sweep over the gods): each god wears every one of the 81 sets in turn, 60 bot-vs-bot mirror matches a set against its team (`data/checks.json`) wearing nothing. No option is the best for every god, and every option is the best for at least one; the sweep fails otherwise. The best option in each slot, roster 0.20.0 on jrpg-battle 0.25.0:

| Slot | Best for |
|---|---|
| Weapon | Battle Axe: Hermes, Nike, Artemis, Dionysus, Ares, Athena, Hephaestus · Mage Staff: Zeus, Poseidon, Hades, Persephone · War Blade: Apollo, Aphrodite, Demeter, Hera, Hestia |
| Armour | Plate Mail: Hermes, Artemis, Aphrodite, Hera, Poseidon, Persephone · Mystic Robe: Dionysus, Apollo, Ares, Zeus, Demeter, Hades · Brigandine: Nike, Athena, Hestia, Hephaestus |
| Boots | Wind Boots: Hermes, Nike, Aphrodite, Demeter, Hera, Poseidon, Hades, Hestia, Hephaestus · War Boots: Artemis, Dionysus, Apollo, Zeus, Persephone · Iron Greaves: Ares, Athena |
| Charm | Giant Belt: Artemis, Ares, Aphrodite, Hera, Athena, Hades · War Charm: Hermes, Nike, Dionysus, Apollo, Zeus, Demeter, Poseidon, Persephone, Hestia · Ward Charm: Hephaestus |

Within a slot, the options a god doesn't take are mostly within 2 to 10 points of the one it does. The outliers are speed: Wind Boots are 20 points behind the other boots on Ares and Athena, whose kits don't care when they move, and the best boots on Hermes, Poseidon and Aphrodite, whose do. Wind Boots are also 8 to 12 points ahead on Dionysus, Demeter and Hestia, so their defaults wear them. A default may give up a few points to lean into a kit (Hephaestus's Iron Greaves are 6 behind his Wind Boots, Hestia's Mage Staff 1 behind the War Blade); that is a choice a player can change.

## Numbers (roster 0.15.0 on jrpg-battle 0.19.0, 300 seeded battles per line)

`npm run check` in this repository, against jrpg-battle 0.19.0; the core party wins PvE 82.3% and splits the PvP mirror 48.3% (the engine's own simulator, which uses the engine's monsters, has 80.6% and 48.5%). The champions' resistances replaced their DEF in this release, and every hit now drains toughness, so the bosses' toughness went up to keep chargers from being broken on every hit. Each champion stands in for the core hero with the closest job (`data/checks.json`).

| Champion | In for | PvE win | vs core | PvP win vs core team |
|---|---|---|---|---|
| Hermes | Vex | 77.0% | −5.3 | 39.7% |
| Nike | Vex | 90.3% | +8.0 | 28.0% |
| Artemis | Vex | 80.3% | −2.0 | 15.7% |
| Dionysus | Vex | 76.3% | −6.0 | 73.0% |
| Apollo | Seren | 86.3% | +4.0 | 68.3% |
| Ares | Aria | 86.3% | +4.0 | 22.0% |
| Aphrodite | Seren | 52.7% | −29.7 | **91.0%** |
| Zeus | Pyra | 79.7% | −2.7 | 62.3% |
| Demeter | Seren | 96.3% | +14.0 | 44.3% |
| Hera | Aria | 98.3% | +16.0 | 76.0% |
| Athena | Aria | 87.0% | +4.7 | 54.3% |
| Poseidon | Pyra | 88.0% | +5.7 | 72.0% |
| Hades | Pyra | 90.7% | +8.3 | 20.0% |
| Persephone | Pyra | 91.0% | +8.7 | 37.0% |
| Hestia | Aria | 81.0% | −1.3 | 70.0% |
| Hephaestus | Aria | 75.7% | −6.7 | 43.7% |

All-champion teams: Athena, Zeus, Apollo, Artemis win PvE 86.0% and PvP 57.7% against the core team; Hephaestus, Poseidon, Aphrodite, Hermes 70.0% and 14.0%; Ares, Hades, Apollo, Zeus 45.3% and 55.7%; Hera, Persephone, Demeter, Nike 100.0% and 44.3%; Hestia, Dionysus, Demeter, Persephone 97.7% and 86.0%.

The six added in roster 0.19.0 have their numbers from roster 0.20.0 on jrpg-battle 0.25.0, with Hera, Dionysus, Persephone and Hestia's fuller kits: the first ten's lines above are unchanged on it. Their kits are a first pass, not tuned; balance gets its own pass later.

### How to read them

- **PvE no longer turns on one element.** All the core party's losses come on wave 3, a single golem; with no weaknesses, a champion's PvE number follows how much damage and healing it brings, not which element it was given. The team without a real healer (Ares, Hades, Apollo, Zeus) still loses more than half its PvE battles.
- **PvP still depends on turn order, but no longer on the bot's SP greed.** Heroes' resistances are close to each other, so a champion's damage type matters a little in PvP; turn order within a team matters more. Before jrpg-battle `v0.1.0`, Athena with Aria's exact stats won 53% at speed 98 but 11% at 100–101: acting just before Seren (99), the bot spent the team's last SP on Aegis and left Seren none for Mend. `v0.1.0`'s bot holds the last SP for a teammate's due heal (jrpg-battle#256), and the same sweep now runs 45% (94), 53% (97–98), 58–59% (100–101) and 69–70% (103–105). The remaining step sits at Pyra's speed (102): acting before her puts Aegis up ahead of the enemy's opening area attack. That's ordinary turn order, so a champion's PvP number still depends on where it lands among its teammates, and tuning one number against one team stays fragile.
- **The bot plays the champion, and its rules shape the numbers.** It casts an ally skill only when someone is under 55% HP, a party-wide skill only when nobody is shielded, and a blast skill only with two or more enemies standing. A champion whose skill the bot rarely casts tests weak.

### Known issues to fix next

- **Aphrodite** (88% PvP): the strongest PvP champion now. A party heal and ATK Up for everyone each turn, behind a taunting Aria who draws the core team's single-target hits, outlasts it.
- **Ares** (59% PvP, 23% PvE): no longer dominant. His 98% PvP on 0.3.0 wasn't his taunt, which did nothing in PvP then; with taunt working on both sides, the core team's Aria draws his hits too. His physical damage is still resisted by the PvE boss.
- **Artemis** (11% PvP) and **Hermes** (34%): both replace Vex, the fastest core hero, and lose his place at the top of the order.
- **A team without a real healer loses PvE outright** (Ares, Hades, Apollo, Zeus: 0%, since Apollo heals only one ally per skill). The second wave needs more healers.

## Monsters

The dungeon's monsters (`content/enemies/`), by the stretch of the Descent they first appear in; [DUNGEON.md](DUNGEON.md) has the whole map. The first five are jrpg-battle's own; roster 0.5.0 added ten from Greek myth, two of them stronger recolours of others (the Drakon of the Dracaena, the Myrmidon of the Hoplite), and the Minotaur; roster 0.6.0 adds a boss for each of the last three stretches.

| Monster | From floor | Damage type | Elements | PHYS / MAG RES | Role |
|---|---|---|---|---|---|
| 🦠 Slime | 1 | Physical | – | 34 / 24 | Corrode: lowers a hero's PHYS and MAG RES |
| 👺 Goblin | 1 | Physical | – | 40 / 40 | Hits hard, sometimes harder |
| 🐺 Dire Wolf | 1 | Physical | – | 46 / 32 | Fast; Howl raises its ATK |
| 🧌 Goblin Shaman | 3 | Magic | Lightning | 40 / 40 | Healer; shocks |
| 🐗 Erymanthian Boar | 3 | Physical | – | 57 / 40 | Stampede: a heavy gore that may bleed |
| 🦅 Harpy | 6 | Magic | Wind | 28 / 28 | Fastest monster; Storm Shriek hits the whole party, may shock |
| 💀 Spartoi | 6 | Physical | – | 72 / 72 | The sown men: Phalanx shields itself and taunts |
| 🐍 Dracaena | 6 | Physical | – | 57 / 40 | Venom Fang may cause bleeding; Constrict lowers PHYS and MAG RES |
| 🔥 Phoenix | 11 | Magic | Fire | 36 / 36 | Healer; burns |
| 🦎 Drakon | 11 | Magic | Fire | 48 / 48 | The Dracaena's fire kin: burning fangs, Fire Breath on three heroes |
| 🛡️ Hoplite | 11 | Physical | – | 109 / 76 | Shield Wall shields every monster on its side |
| 👻 Shade | 16 | Magic | Dark | 34 / 24 | Grave Chill may freeze; its Lament lowers the party's PHYS and MAG RES |
| 🧙 Necromancer | 16 | Magic | Dark | 36 / 36 | Grave Bolt may freeze; Withering Curse hits the party and lowers PHYS and MAG RES |
| ⚔️ Myrmidon | 16 | Physical | – | 80 / 56 | The Hoplite's red-armoured elite: Battle Cry raises every monster's ATK for a turn |
| 🗿 Ancient Golem | boss, 1–5 | Physical | Earth | 103 / 72 | Charger, every 3rd action: Cataclysm on the party |
| 🐂 Minotaur | boss, 6–10 | Physical | – | 92 / 64 | Charger, every 4th action: Labyrinth Rampage on the party; Horn Gore bleeds |
| 🐉 Lernaean Hydra | boss, 11–15 | Physical | Water | 98 / 68 | Charger, every 4th action: Venom Torrent on the party, may bleed; Venom Bite bleeds |
| 🐕 Cerberus | boss, 16–20 | Magic | Fire | 103 / 72 | Charger, every 4th action: Triple Inferno on the party, may burn; Hellfire Bite burns |
| 🌪️ Typhon | boss, 21–25 (the final boss) | Magic | Lightning, Wind | 80 / 80 | Charger, every 3rd action: Wrath of the Titans on the party, may shock; Storm Fist shocks |

Every monster here has art on the site. A monster added later shows the site's default unit, chosen by its `reach`, until jrpgbattle-client-premium has its recipe.

## Needs a mechanic

Gods whose myth wants something the engine can't do yet. Each is a small jrpg-battle engine idea; the roster tells it which to build first.

| Champion idea | Mechanic | Why |
|---|---|---|
| Hermes (fuller kit) | Speed up / turn advance (Haste, FFX) | The messenger acts again or hurries an ally |
| Kronos | Delay an enemy's turn (Slow) | Lord of time. A Slow that lowers speed is now a content status (`"mods": { "spdPct": -0.3 }`, decision 0029); pushing a turn back is not yet |
| Medusa | Stone (a long freeze that ends on a hit) | Petrifying gaze |
| Hydra / Heracles | Multi-hit, and a unit that grows heads when hit | The labors |
| Eros | Charm: an enemy attacks its own side for a turn | The arrows |
| Nyx | Stealth: can't be targeted for a turn | Night |
| Hades (fuller kit) | Lifesteal | Taking souls |

## Trying them in the game

**On a deployment that loads the roster** (the jrpgbattle site, or a jrpg-battle checkout with a release's content files unzipped over it as README's "Deploying" says), the gods are ordinary heroes: pick them in the PvP team pick, or put them in the PvE party from the tuning panel (**T**).

**On a deployment that doesn't load it,** run `npm run check`, open the tuning panel, paste `dist/tuning-import.json` into its settings box and press **Import**. The gods then appear in the party slot menus, in PvE and in an online match's settings.
