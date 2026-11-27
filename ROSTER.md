# Roster: the Olympians

Sixteen Greek gods built only from jrpg-battle's building blocks:
- **Effects:** damage, heal, shield, status, cleanse, revive and form.
- **Statuses:** the jrpgbattle ruleset's, which are its own and not this repository's (jrpg-battle decisions 0029, 0086). Burn, Shock and Bleed; Freeze and Confuse; ATK Up, RES Down, Taunt, Retaliate and Shield; and, from jrpg-battle 0.58.0 (its decision 0099), Sunder (PHYS RES −50%), Curse (MAG RES −50%), Weaken (both ATK −25%), Haste and Slow (SPD ±25%), Guard (damage taken −30%) and Exposed (damage taken +25%).
- **Damage types:** physical and magic, each with its own attack and resistance (decisions 0055 and 0056).
- **Penetration:** a hit may ignore flat points (`pen`) or a share (`pierce`) of its target's resistance (decision 0095).

Every champion has its own speed, different from each other and from the core heroes (Aria 96, Seren 99, Pyra 102, Vex 120), so mixed teams tie on speed far less than the mirror match does.

| Champion | Class | Role | Damage type | Spd | HP | PHYS ATK | MAG ATK | PHYS RES | MAG RES |
|---|---|---|---|---|---|---|---|---|---|
| 🪽 Hermes | Support | Messenger | Physical | 124 | 980 | 135 | 101 | 75 | 55 |
| 🏆 Nike | Striker | Winged Victory | Physical | 122 | 960 | 150 | 113 | 71 | 53 |
| 🏹 Artemis | Striker | Huntress | Physical | 116 | 1000 | 155 | 116 | 75 | 55 |
| 🍇 Dionysus | Controller | Reveller | Physical | 112 | 1150 | 150 | 113 | 81 | 60 |
| ☀️ Apollo | Support | Sun Healer | Magic | 110 | 1100 | 83 | 110 | 68 | 92 |
| 🗡️ Ares | Striker | War God | Physical | 108 | 1400 | 140 | 105 | 109 | 81 |
| 🌹 Aphrodite | Support | Enchantress | Magic | 106 | 1050 | 83 | 110 | 64 | 86 |
| ⚡ Zeus | Striker | Sky King | Magic | 104 | 1000 | 120 | 160 | 55 | 75 |
| 🌾 Demeter | Support | Harvest Mother | Magic | 101 | 1150 | 79 | 105 | 68 | 92 |
| 👑 Hera | Guardian | Queen of Heaven | Physical | 100 | 1500 | 120 | 90 | 129 | 95 |
| 🦉 Athena | Guardian | Strategist | Physical | 98 | 1450 | 115 | 86 | 138 | 102 |
| 🔱 Poseidon | Controller | Sea King | Magic | 97 | 1150 | 109 | 145 | 68 | 92 |
| 💀 Hades | Controller | Underworld King | Magic | 94 | 1150 | 109 | 145 | 64 | 86 |
| 🌸 Persephone | Controller | Queen of Two Realms | Magic | 92 | 1100 | 113 | 150 | 61 | 83 |
| 🔥 Hestia | Guardian | Hearth Keeper | Magic | 90 | 1500 | 90 | 120 | 98 | 132 |
| 🔨 Hephaestus | Guardian | Smith | Physical | 88 | 1550 | 130 | 98 | 126 | 94 |

The sixteen share the character group **Gods of Olympus** (every hero has a `characterGroup`, the title of its set).

## Four classes

Roster 0.24.0 settles the roles on four classes, after the four roles of 4th-edition D&D: one of each makes a team of four. Each god has one, a label for now (jrpg-battle decision 0054; whether a class should carry rules is jrpg-battle#363).

| Class | D&D's role | Its job | Gods |
|---|---|---|---|
| Guardian | Defender | Takes the hits: Taunt, shields, Guard | Hera, Athena (bruiser), Hestia, Hephaestus |
| Striker | Striker | Damage, most of it on one target | Nike, Artemis, Ares (bruiser), Zeus |
| Support | Leader | Heals, buffs and SP | Hermes, Apollo, Aphrodite, Demeter |
| Controller | Controller | Shapes the fight: Freeze, Slow, Confuse, Sunder, summons | Dionysus, Poseidon, Persephone, Hades |

**Picks:** the bot's pick takes one god of each class before a second of any (jrpg-battle's `botPick`). With four classes and teams of four, every bot team is one god from each.

**Tags:** a god that sits between classes has a tag beside its class, its `tags` (roster 0.25.0, on jrpg-battle 0.59.0 and its decision 0100). Like a class, a tag is a label: no rule reads it, and the bot's pick spreads on class alone. The one tag so far is **bruiser,** partly tank and partly damage: Ares (Striker) and Athena (Guardian).

## The kits (roster 0.24.0)

Roster 0.24.0 reworks 15 gods' three abilities so that each does a job of its own, with the new statuses and penetration, instead of the same few statuses at bigger sizes. Hermes stays a Support, with a support kit of his own: tempo for his team. Roster 0.26.0 reworks the sixteenth, Hades: he summons Shades (jrpg-battle 0.60.0, its decision 0101) and moves from Striker to Controller, since his minions shape the fight rather than deal its damage. The sixteen divide four to a class.

| God | Its job | Basic | Skill | Ultimate |
|---|---|---|---|---|
| 🪽 Hermes | Tempo: SP, speed, and a way past the Guardians | Caduceus Tap: single, 2 SP | Winged Sandals: heavy single, Haste all 2 turns | Psychopomp: all, strip Shield and Taunt |
| 🏆 Nike | Tempo and the team's attack | Winged Javelin: single | Swift Victory: heavy single, high Toughness damage, Haste self 2 turns | Laurel of Victory: heavy blast, ATK Up all |
| 🏹 Artemis | The hunter | Moonlit Shot: single, ignores 30% PHYS RES | Silver Arrow: heavy single, Exposed 2 turns | The Hunt: massive single, ignores 50% PHYS RES |
| 🍇 Dionysus | Madness | Thyrsus Strike: single, 35% Bleed | Maenad Frenzy: single, 60% Confuse 2 turns | Bacchic Revel: all + Bleed, Weaken 2 turns |
| ☀️ Apollo | The cleanser | Sunbeam: single, 30% Burn | Healing Light: heal one 30% + 120, cleanse | Chariot of the Sun: all + Burn, heal all 20%, cleanse all |
| 🗡️ Ares | The bruiser who punches through | Spear Thrust: single, ignores 10 PHYS RES | Bloodlust: heavy single, ignores 20 PHYS RES, Taunt 2 turns | Rout: heavy blast, Exposed 2 turns |
| 🌹 Aphrodite | SP battery and buffer | Charm: single, 2 SP | Embrace: heal all 18%, ATK Up all | Born of the Foam: all, 50% Confuse 2 turns, heal all 35% |
| ⚡ Zeus | The storm | Static Touch: single, 30% Shock | Thunderbolt: blast, ignores 15% MAG RES, 60% Shock | King of Olympus: heavy all, ignores 30% MAG RES, Shock |
| 🌾 Demeter | Sustain | Golden Sickle: single, heal all 3% | Bountiful Harvest: heal one 30% + 100, Guard it 2 turns | Barren Earth: all, Weaken 2 turns, heal all 20% |
| 👑 Hera | Raise and ward | Royal Sceptre: single, Taunt 1 turn | Queen’s Ward: shield all, heal all 5% | Peacock’s Gaze: all + RES Down, revive the fallen at 20% |
| 🦉 Athena | Damage reduction, and a strategist's strike | Spear of Wisdom: single, ignores 30% PHYS RES | Aegis: Guard all 2 turns, a light shield, Taunt | Owl’s Gambit: heavy single, high Toughness damage, RES Down 2 turns |
| 💀 Hades | The dead at his call | Soul Lash: single, 30% Curse 2 turns | Grasp of the Dead: single + Burn, call a Shade (up to 2) | Realm of the Dead: all + 3-turn Burn, call Shades up to 2 and heal those standing |
| 🔱 Poseidon | The tides | Trident Jab: single, ignores 15% MAG RES | Tidal Wave: all, 40% Slow 2 turns | Earthshaker: heavy all, 50% Sunder 2 turns |
| 🌸 Persephone | The seasons | Frost Bloom: single · in spring, Blossom | Winter’s Descent: blast, 35% Freeze · in spring, First Flowers: heal one 20% + 60, all 8% | Spring’s Return: all, 30% Freeze, heal all 15%, to spring · in spring, Pomegranate Seed: all + RES Down, back below |
| 🔥 Hestia | The hearth | Hearth Ember: single, heal self 3% | Sacred Flame: shield all, cleanse all, Taunt 1 turn, Retaliate 1 turn | Eternal Flame: all + Burn, heal all 10% |
| 🔨 Hephaestus | The armour breaker | Hammer Blow: single, 30% Sunder | Forge Armor: heavy shield all | Molten Hammer: massive single, ignores 40 PHYS RES, Sunder, Burn |

**Owners:** each status has one or two, so it says whose kit it is.
- ATK Up: Nike's team and Aphrodite's.
- Haste: Hermes's team and Nike herself.
- Exposed: Artemis's prey and Ares's rout.
- Weaken: Dionysus's revel and Demeter's famine.
- Guard: Athena's whole team and Demeter's one ally.
- Slow: Poseidon's tide.
- Sunder: Poseidon's earthquake and Hephaestus's hammer.
- Confuse: Dionysus and Aphrodite.
- Curse: Hades's lash.
- Summons: Hades's Shades, the hooded ghosts of the dungeon.
  - **Stats:** 35% of his max HP, attacks and resistances, with the Shade's own speed and skills: Grave Chill may Freeze, and its Lament lowers the foes' RES.
  - **The cap:** at most two stand; a summon at two heals them instead.
  - **Limits:** they fall with him, never keep his side in the fight, and leave when a wave starts.
- Taunt: the Guardians, and Ares; Hermes's Psychopomp strips it, and every Shield.

Persephone's kit is unchanged: her forms already give her a job of her own.

**SP batteries:** Hermes and Aphrodite's basic attacks gain 2 SP instead of 1, so they pay for their teammates' skills.

**Two layers on an attack** (jrpg-battle decisions 0055 to 0057). The **damage type**, physical or magic, is what an attack is: each type has its own attack stat and resistance (below). The **element**, set on a skill, is the kind of force it is: fire, water, earth, wind, lightning, ice, dark or metal. An element only chooses a client's animation and sound for now, so a skill with none plays its damage type's default; Zeus's lightning is a magic hit of lightning, Hephaestus's Molten Hammer a physical hit of fire. Later an element can become its own lever for builds. What follows is the damage types. Every god and monster has a PHYS ATK and a MAG ATK instead of ATK, and a PHYS RES and a MAG RES instead of DEF. A hit is driven by the attack of its element and lowered by the resistance of the same: `physical` is PHYS ATK against PHYS RES, `magic` is MAG ATK against MAG RES. Each god has a **main attack**, of its own damage type, and an **off attack**, of the other (roster 0.21.0): the main attack is its old ATK, and the off attack three quarters of it, rounded, in its base stats and its growth alike, so Zeus has 160 MAG ATK and 120 PHYS ATK. No god has a skill of the other damage type, so the off attack drives only what reads it: a damage-over-time status of the other type (Burn and Shock are magic, Bleed physical), and later a hybrid skill or one that scales from both attacks (jrpg-battle#365). One god applies one: Hephaestus, whose Molten Hammer Burns. It carries its own `dotRatio`, 0.66 over the core's 0.5, which keeps its ticks where they were at the lower attack. (Until roster 0.24.0, Hermes's Shocks did the same, at 0.8.) A monster's two attacks still equal its old ATK. There are no weaknesses. A god fights with body and weapon (Physical: Hermes, Nike, Artemis, Dionysus, Ares, Hera, Athena, Hephaestus) or with divine power (Magic: Apollo, Aphrodite, Zeus, Demeter, Poseidon, Hades, Persephone, Hestia); the water, dark, light and wind the myths ask for are no longer approximated with ice or fire. Each god's resistances are the old DEF, 15% higher against their own damage type and 15% lower against the other, so a physical bruiser is harder to hit physically than magically. A world may still add elements, each resisted by one of the two stats.



## PvP gear

In PvP each god wears a **loadout**: one item in each slot, chosen from that slot's **pool** after the team pick, blind, with its own timer (jrpg-battle decisions 0058 and 0059; against the bot from jrpg-battle 0.23.0, online later). The pool is the Labyrinth's tier, three sidegrades a slot on one budget (four for the weapon), which the campaign shop also sells from floor 6 (DUNGEON.md). The ladder above it (the Bronze Spear and up) is PvE-only, so the strongest campaign gear is never a free pick.

| Slot | Flat, for low stats | Percentage, for high stats | The third way |
|---|---|---|---|
| Weapon | ⚔️ War Blade: +25 PHYS and MAG ATK | 🪓 Battle Axe: +26% PHYS ATK | 🪄 Mage Staff: +21% MAG ATK |
| Armour | 🛡️ Plate Mail: +30 PHYS, +15 MAG RES | 🥋 Brigandine: +30% both RES | 👘 Mystic Robe: +15 PHYS, +30 MAG RES |
| Boots | 🪽 Wind Boots: +10 SPD | 🥾 Iron Greaves: +15% HP, +12% both RES | 👢 War Boots: +10% both ATK |
| Charm | ❤️ Giant Belt: +400 HP | 🔰 Ward Charm: +36% both RES | 🔥 War Charm: +15% both ATK |

**The weapon's fourth way: 🎯 Hunting Spear** (roster 0.23.0): its wearer's hits ignore 50% of the target's PHYS or MAG RES (`physPierce` and `magPierce` 50: penetration, jrpg-battle 0.55.0, its decision 0095). It is the counter-pick: against a Guardian in Brigandine it does about what the Battle Axe's +26% does, and against a lightly armoured team much less. It stacks with a skill's own penetration, so Artemis's The Hunt (50%) goes through all of a target's PHYS RES with it, and her default carries it from roster 0.24.0.

**Each god's default loadout** leans into its kit, so a god is ready to play without anyone opening the loadout screen (`defaultLoadout`; the bot wears it too):

| God | Weapon | Armour | Boots | Charm | Why |
|---|---|---|---|---|---|
| ⚡ Zeus | Mage Staff | Mystic Robe | War Boots | War Charm | A magic striker: all-in on magic damage |
| 🔱 Poseidon | Mage Staff | Mystic Robe | War Boots | War Charm | A controller: magic, and attack for the tide (Wind Boots put him at a worse place in the turn order) |
| 💀 Hades | Mage Staff | Mystic Robe | Wind Boots | Giant Belt | A controller who lasts: his burns and his Shades need him standing, and his Shades take a share of his HP |
| 🏹 Artemis | Hunting Spear | Plate Mail | Wind Boots | Giant Belt | A hunter: the spear's pierce stacks with her own, and speed to strike first |
| 🗡️ Ares | Battle Axe | Brigandine | Iron Greaves | Giant Belt | A bruiser: damage on a body that takes the taunt |
| 🦉 Athena | Battle Axe | Brigandine | Iron Greaves | Giant Belt | A tank: her high resistances scale with percentages |
| 🔨 Hephaestus | Battle Axe | Brigandine | Iron Greaves | Ward Charm | The armour tank: resistance on resistance |
| ☀️ Apollo | War Blade | Mystic Robe | War Boots | War Charm | A healer who hits: flat on his low attack, magic armour |
| 🌹 Aphrodite | War Blade | Plate Mail | Wind Boots | Giant Belt | A battery: speed and staying power, to keep the SP flowing |
| 🪽 Hermes | Battle Axe | Plate Mail | Wind Boots | War Charm | The fastest god, made faster, with damage to spend his SP on |
| 👑 Hera | Battle Axe | Brigandine | Iron Greaves | Ward Charm | A tank who raises the fallen: resistance on resistance (with Wind Boots she won 93% in loadouts) |
| 🔥 Hestia | Mage Staff | Brigandine | Wind Boots | Ward Charm | The magic tank: resistance, and speed to shield before the first blow |
| 🍇 Dionysus | Battle Axe | Plate Mail | Wind Boots | War Charm | A controller who wants to bleed and confuse them first |
| 🏆 Nike | Battle Axe | Plate Mail | Wind Boots | War Charm | Speed to act first, damage to break with |
| 🌾 Demeter | War Blade | Mystic Robe | Wind Boots | War Charm | A healer who acts early and hits back: flat on her low attack |
| 🌸 Persephone | Mage Staff | Mystic Robe | War Boots | War Charm | A controller: all-in on magic damage |

**Its numbers are in jrpgbattle-balance** (from 2026-11-26): the budget check of this pool (every option the best for some god, none for all), each god's win rates, speed and turn order, and the history of each balance pass, in its ROSTER.md. This file says who the gods are; that one what they score.

## Monsters

The dungeon's monsters (`content/enemies/`), by the stretch of the Descent they first appear in; [DUNGEON.md](DUNGEON.md) has the whole map. The first five are jrpg-battle's own; roster 0.5.0 added ten from Greek myth, two of them stronger recolours of others (the Drakon of the Dracaena, the Myrmidon of the Hoplite), and the Minotaur; roster 0.6.0 adds a boss for each of the last three stretches.

Roster 0.23.0 sorts them by what they resist. **Physical damage bounces off** the armoured and the bodiless: the Boar, Spartoi, Hoplite, Myrmidon, Shade, Golem and Minotaur. **Magic washes off** the Shaman, Phoenix, Drakon, Necromancer and Cerberus. The Slime, Goblin, Dire Wolf, Harpy, Dracaena, Hydra and Typhon resist both alike. Each stretch from the Labyrinth on mixes the two, so a party needs both damage types and does best aiming each god at the right monster.

| Monster | From floor | Damage type | Elements | PHYS / MAG RES | Role |
|---|---|---|---|---|---|
| 🦠 Slime | 1 | Physical | – | 34 / 24 | Corrode: lowers a hero's PHYS and MAG RES |
| 👺 Goblin | 1 | Physical | – | 40 / 40 | Hits hard, sometimes harder |
| 🐺 Dire Wolf | 1 | Physical | – | 46 / 32 | Fast; Howl raises its ATK |
| 🧌 Goblin Shaman | 3 | Magic | Lightning | 0 / 100 | Healer; shocks |
| 🐗 Erymanthian Boar | 3 | Physical | – | 123 / 2 | Stampede: a heavy gore that may bleed |
| 🦅 Harpy | 6 | Magic | Wind | 28 / 28 | Fastest monster; Storm Shriek hits the whole party, may shock |
| 💀 Spartoi | 6 | Physical | – | 154 / 21 | The sown men: Phalanx shields itself and taunts |
| 🐍 Dracaena | 6 | Physical | – | 57 / 40 | Venom Fang may cause bleeding; Constrict lowers PHYS and MAG RES |
| 🔥 Phoenix | 11 | Magic | Fire | 0 / 88 | Healer; burns |
| 🦎 Drakon | 11 | Magic | Fire | 2 / 122 | The Dracaena's fire kin: burning fangs, Fire Breath on three heroes |
| 🛡️ Hoplite | 11 | Physical | – | 179 / 37 | Shield Wall shields every monster on its side |
| 👻 Shade | 16 | Magic | Dark | 68 / 0 | Grave Chill may freeze; its Lament lowers the party's PHYS and MAG RES |
| 🧙 Necromancer | 16 | Magic | Dark | 0 / 88 | Grave Bolt may freeze; Withering Curse hits the party and lowers PHYS and MAG RES |
| ⚔️ Myrmidon | 16 | Physical | – | 148 / 17 | The Hoplite's red-armoured elite: Battle Cry raises every monster's ATK for a turn |
| 🗿 Ancient Golem | boss, 1–5 | Physical | Earth | 173 / 33 | Charger, every 3rd action: Cataclysm on the party |
| 🐂 Minotaur | boss, 6–10 | Physical | – | 160 / 25 | Charger, every 4th action: Labyrinth Rampage on the party; Horn Gore bleeds |
| 🐉 Lernaean Hydra | boss, 11–15 | Physical | Water | 98 / 68 | Charger, every 4th action: Venom Torrent on the party, may bleed; Venom Bite bleeds |
| 🐕 Cerberus | boss, 16–20 | Magic | Fire | 33 / 173 | Charger, every 4th action: Triple Inferno on the party, may burn; Hellfire Bite burns |
| 🌪️ Typhon | boss, 21–25 (the final boss) | Magic | Lightning, Wind | 80 / 80 | Charger, every 3rd action: Wrath of the Titans on the party, may shock; Storm Fist shocks |

Every monster here has art on the site. A monster added later shows the site's default unit, chosen by its `reach`, until jrpgbattle-client-premium has its recipe.

## Needs a mechanic

Gods whose myth wants something the engine can't do yet. Each is a small jrpg-battle engine idea; the roster tells it which to build first.

| Champion idea | Mechanic | Why |
|---|---|---|
| Hermes or Nike | Turn advance: an ally acts sooner now | The messenger hurries an ally. Haste speeds the turns after; pushing a turn forward is not yet possible |
| Kronos | Delay an enemy's turn | Lord of time. Slow lengthens the turns after; pushing a turn back is not yet possible |
| Medusa | Stone (a long freeze that ends on a hit) | Petrifying gaze |
| Hydra / Heracles | Multi-hit, and a unit that grows heads when hit | The labors |
| Eros | Charm: an enemy attacks its own side for a turn | The arrows |
| Nyx | Stealth: a status that keeps its holder from being picked by single-target attacks, ended when it strikes | Night; an assassin, if the roster wants one |
| Hades (fuller kit) | Lifesteal | Taking souls |
| An assassin's finisher | An execute: more damage the lower the target's HP | The classic assassin's burst |

## Trying them in the game

**On a deployment that loads the roster** (the jrpgbattle site, or a jrpg-battle checkout with a release's content files unzipped over it as README's "Deploying" says), the gods are ordinary heroes: pick them in the PvP team pick, or put them in the PvE party from the tuning panel (**T**).

**On a deployment that doesn't load it,** run `npm run check`, open the tuning panel, paste `dist/tuning-import.json` into its settings box and press **Import**. The gods then appear in the party slot menus, in PvE and in an online match's settings.
