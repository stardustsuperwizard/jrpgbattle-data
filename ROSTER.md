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
| 💀 Hades | Striker | Underworld King | Magic | 94 | 1150 | 109 | 145 | 64 | 86 |
| 🌸 Persephone | Controller | Queen of Two Realms | Magic | 92 | 1100 | 113 | 150 | 61 | 83 |
| 🔥 Hestia | Guardian | Hearth Keeper | Magic | 90 | 1500 | 90 | 120 | 98 | 132 |
| 🔨 Hephaestus | Guardian | Smith | Physical | 88 | 1550 | 130 | 98 | 126 | 94 |

The sixteen share the character group **Gods of Olympus** (every hero has a `characterGroup`, the title of its set).

## Four classes

Roster 0.24.0 settles the roles on four classes, after the four roles of 4th-edition D&D: one of each makes a team of four. Each god has one, a label for now (jrpg-battle decision 0054; whether a class should carry rules is jrpg-battle#363).

| Class | D&D's role | Its job | Gods |
|---|---|---|---|
| Guardian | Defender | Takes the hits: Taunt, shields, Guard | Hera, Athena, Hestia, Hephaestus |
| Striker | Striker | Damage, most of it on one target | Nike, Artemis, Ares, Zeus, Hades |
| Support | Leader | Heals, buffs and SP | Hermes, Apollo, Aphrodite, Demeter |
| Controller | Controller | Shapes the fight: Freeze, Slow, Confuse, Sunder | Dionysus, Poseidon, Persephone, and Hades with his summons |

**Picks:** the bot's pick takes one god of each class before a second of any (jrpg-battle's `botPick`). With four classes and teams of four, every bot team is one god from each.

**Tags:** a god that sits between classes will also have a tag beside its class, through `tags` (jrpg-battle 0.59.0, its decision 0100). The one tag so far is **bruiser,** partly tank and partly damage: Ares (Striker) and Athena (Guardian).

The tags arrive with the engine release that carries them.

## The kits (roster 0.24.0)

Roster 0.24.0 reworks 14 gods' three abilities so that each does a job of its own, with the new statuses and penetration, instead of the same few statuses at bigger sizes. Hermes and Hades keep their old kits for now: Hades until the engine can summon, Hermes until his support kit is tuned. Hermes stays a Support, with a support kit of his own: tempo for his team. Hades gains a summon of minions and moves from Striker to Controller: his minions shape the fight rather than deal its damage. With him, the sixteen divide four to a class.

| God | Its job | Basic | Skill | Ultimate |
|---|---|---|---|---|
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
| 🔱 Poseidon | The tides | Trident Jab: single, ignores 15% MAG RES | Tidal Wave: all, 40% Slow 2 turns | Earthshaker: heavy all, 50% Sunder 2 turns |
| 🌸 Persephone | The seasons | Frost Bloom: single · in spring, Blossom | Winter’s Descent: blast, 35% Freeze · in spring, First Flowers: heal one 20% + 60, all 8% | Spring’s Return: all, 30% Freeze, heal all 15%, to spring · in spring, Pomegranate Seed: all + RES Down, back below |
| 🔥 Hestia | The hearth | Hearth Ember: single, heal self 3% | Sacred Flame: shield all, cleanse all, Taunt 1 turn, Retaliate 1 turn | Eternal Flame: all + Burn, heal all 10% |
| 🔨 Hephaestus | The armour breaker | Hammer Blow: single, 30% Sunder | Forge Armor: heavy shield all | Molten Hammer: massive single, ignores 40 PHYS RES, Sunder, Burn |
| 🪽 Hermes | *Old kit, until his support kit* | Caduceus Tap: single, 2 SP | Winged Sandals: single + Shock | Psychopomp: all, 60% Shock |
| 💀 Hades | *Old kit, until summoning; then a Controller* | Soul Lash: single | Grasp of the Dead: single + Burn + RES Down | Realm of the Dead: all + 3-turn Burn |

**Owners:** each status has one or two, so it says whose kit it is.
- ATK Up: Nike's team and Aphrodite's.
- Haste: Nike's.
- Exposed: Artemis's prey and Ares's rout.
- Weaken: Dionysus's revel and Demeter's famine.
- Guard: Athena's whole team and Demeter's one ally.
- Slow: Poseidon's tide.
- Sunder: Poseidon's earthquake and Hephaestus's hammer.
- Confuse: Dionysus and Aphrodite.
- Taunt: the Guardians, and Ares.

Persephone's kit is unchanged: her forms already give her a job of her own.

**SP batteries:** Hermes and Aphrodite's basic attacks gain 2 SP instead of 1, so they pay for their teammates' skills.

**Two layers on an attack** (jrpg-battle decisions 0055 to 0057). The **damage type**, physical or magic, is what an attack is: each type has its own attack stat and resistance (below). The **element**, set on a skill, is the kind of force it is: fire, water, earth, wind, lightning, ice, dark or metal. An element only chooses a client's animation and sound for now, so a skill with none plays its damage type's default; Zeus's lightning is a magic hit of lightning, Hephaestus's Molten Hammer a physical hit of fire. Later an element can become its own lever for builds. What follows is the damage types. Every god and monster has a PHYS ATK and a MAG ATK instead of ATK, and a PHYS RES and a MAG RES instead of DEF. A hit is driven by the attack of its element and lowered by the resistance of the same: `physical` is PHYS ATK against PHYS RES, `magic` is MAG ATK against MAG RES. Each god has a **main attack**, of its own damage type, and an **off attack**, of the other (roster 0.21.0): the main attack is its old ATK, and the off attack three quarters of it, rounded, in its base stats and its growth alike, so Zeus has 160 MAG ATK and 120 PHYS ATK. No god has a skill of the other damage type, so the off attack drives only what reads it: a damage-over-time status of the other type (Burn and Shock are magic, Bleed physical), and later a hybrid skill or one that scales from both attacks (jrpg-battle#365). Two gods apply one: Hermes's Shocks and Hephaestus's Burn. Their skills carry their own `dotRatio` (0.8 for Hermes's Shocks over the core's 0.6, 0.66 for Molten Hammer's Burn over 0.5), which keeps their ticks where they were at the lower attack, so the split moves no battle. A monster's two attacks still equal its old ATK. There are no weaknesses. A god fights with body and weapon (Physical: Hermes, Nike, Artemis, Dionysus, Ares, Hera, Athena, Hephaestus) or with divine power (Magic: Apollo, Aphrodite, Zeus, Demeter, Poseidon, Hades, Persephone, Hestia); the water, dark, light and wind the myths ask for are no longer approximated with ice or fire. Each god's resistances are the old DEF, 15% higher against their own damage type and 15% lower against the other, so a physical bruiser is harder to hit physically than magically. A world may still add elements, each resisted by one of the two stats.



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
| 💀 Hades | Mage Staff | Mystic Robe | Wind Boots | Giant Belt | A magic striker who lasts: his burns need him standing |
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

**The budget check** (`npm run sweep`, jrpg-battle's loadout sweep over the gods): each god wears every one of the 108 sets in turn, 60 bot-vs-bot mirror matches a set against its team (`data/checks.json`) wearing nothing. No option is the best for every god, and every option is the best for at least one; the sweep fails otherwise. The best option in each slot, roster 0.24.0 on jrpg-battle 0.58.0:

| Slot | Best for |
|---|---|
| Weapon | War Blade: Hermes, Apollo, Aphrodite, Demeter, Persephone, Hestia · Battle Axe: Nike, Dionysus, Ares, Hera, Athena · Mage Staff: Zeus, Poseidon, Hades · Hunting Spear: Artemis, Hephaestus |
| Armour | Plate Mail: Hermes, Artemis, Dionysus, Aphrodite · Mystic Robe: Apollo, Ares, Zeus, Demeter, Hera, Poseidon, Hades, Persephone · Brigandine: Nike, Athena, Hestia, Hephaestus |
| Boots | Wind Boots: Nike, Artemis, Apollo, Demeter, Hera, Poseidon, Hades, Hestia, Hephaestus · Iron Greaves: Ares, Aphrodite, Athena · War Boots: Hermes, Dionysus, Zeus, Persephone |
| Charm | Giant Belt: Artemis, Ares, Aphrodite, Poseidon, Hades · War Charm: Hermes, Nike, Dionysus, Apollo, Zeus, Demeter, Persephone, Hestia · Ward Charm: Hera, Athena, Hephaestus |

**The sweep and the defaults disagree on boots.** The sweep's opponents wear nothing, so there is less resistance to cut through and nothing to race on speed. It rates Wind Boots best for Hera and Poseidon, but against a team in its loadouts (`npm run check`'s last column) Hera wins 93% in them and 57% in Iron Greaves, and Poseidon 23% in them and 72% in War Boots. The defaults follow the check, where the other team wears gear.

**Speed is the biggest lever in a loadout.** In the loadout column a god's boots move it far more than any number in its kit, by where the extra speed puts it among its teammates' turns: Demeter in Wind Boots acts before Pyra (102) instead of just after her, which takes her from 22% to 51% on boots alone (below).

## Numbers (roster 0.24.0 on jrpg-battle 0.58.0, 1,000 seeded battles per line)

`npm run check -- 1000` in this repository, against jrpg-battle 0.58.0: the core party wins PvE 75.5% and splits the PvP mirror 49.4%, and 50.0% in loadouts. Each champion stands in for the core hero with the closest job (`data/checks.json`).

| Champion | Class | In for | PvE win | vs core | PvP bare | PvP in loadouts |
|---|---|---|---|---|---|---|
| Hermes | Support | Vex | 72.2% | −3.3 | 85.9% | 68.9% |
| Nike | Striker | Vex | 94.1% | +18.6 | 60.2% | 46.2% |
| Artemis | Striker | Vex | 91.2% | +15.7 | 49.9% | 45.6% |
| Dionysus | Controller | Vex | 77.5% | +2.0 | 54.7% | 59.9% |
| Apollo | Support | Seren | 68.6% | −6.9 | 55.2% | 50.2% |
| Ares | Striker | Aria | 82.8% | +7.3 | 46.4% | 63.1% |
| Aphrodite | Support | Seren | 67.8% | −7.7 | 60.2% | 56.2% |
| Zeus | Striker | Pyra | 78.1% | +2.6 | 60.6% | 52.2% |
| Demeter | Support | Seren | 97.6% | +22.1 | 22.1% | 64.4% |
| Hera | Guardian | Aria | 85.3% | +9.8 | 61.3% | 57.1% |
| Athena | Guardian | Aria | 85.5% | +10.0 | 49.0% | 47.3% |
| Poseidon | Controller | Pyra | 90.9% | +15.4 | 58.9% | 71.7% |
| Hades | Striker | Pyra | 86.8% | +11.3 | 31.2% | 35.6% |
| Persephone | Controller | Pyra | 86.0% | +10.5 | 83.5% | 56.0% |
| Hestia | Guardian | Aria | 68.5% | −7.0 | 73.2% | 73.3% |
| Hephaestus | Guardian | Aria | 71.5% | −4.0 | 48.9% | 47.5% |

All-champion teams, PvE, then PvP against the core team bare and in loadouts:

| Team | PvE | PvP bare | PvP in loadouts |
|---|---|---|---|
| Athena, Zeus, Apollo, Artemis | 94.6% | 75.3% | 71.0% |
| Hephaestus, Poseidon, Aphrodite, Hermes | 85.4% | 4.3% | 15.5% |
| Ares, Hades, Apollo, Zeus | 48.7% | 29.9% | 37.9% |
| Hera, Persephone, Demeter, Nike | 100.0% | 73.2% | 61.6% |
| Hestia, Dionysus, Demeter, Persephone | 98.8% | 59.6% | 73.6% |

### How the roster 0.24.0 pass was balanced: PvP first

**PvP first, then PvE.**
- **The order:** the gods are balanced for PvP, and PvE's monsters are to be fitted to the finished roster after. This is how most games with both modes do it: a god is in both, a monster only in PvE, and a PvP imbalance is someone else's loss.
- **The targets:** every reworked god between 45% and 75% PvP against the core team in loadouts, and at least 60% PvE. PvE is a floor, not a band: a god strong in practice PvE is fine.
- **Measured on:** the practice waves, unchanged since roster 0.23.0, so the PvE numbers stay comparable. The monsters' own pass comes later, on the campaign simulator.

**The loadout column is new** (`npm run check`'s last).
- **What it is:** a real match is played in loadouts, so every hero wears one. Each god wears its default. Each core hero wears the default of the god nearest its job: Aria Athena's, Pyra Zeus's, Seren Apollo's, Vex Artemis's (`coreLoadouts` in `data/checks.json`).
- **Why it's fair:** the gear is the same pool and budget on both sides; the core mirror in loadouts splits 50.0%.
- **Why it's needed:** the bare column, where nobody wears anything, misses what boots do. Demeter wins 22.1% bare, 51.3% in Wind Boots alone and 64.4% in her full default loadout.

**What tuning found:**
- **Ares needs his Taunt.** Without it he won 87–90% in PvP however far his damage was cut; Taunt is what keeps the fight on him.
- **Weaken is strong.** It is the one debuff that lowers the enemy's damage, so each of its two owners puts it on an ultimate only.
- **Demeter's weakness was her place in the turn order,** not her kit. At speed 101 she acts just after Pyra (102); in her own Wind Boots she acts well before. Every heal cut from her kit took her PvP down about as much as her PvE.
- **Persephone keeps her own numbers.** Against the bare column she seemed too strong (84%); in loadouts she is 56%.

All-champion teams with Hermes or Hades in them are still weak: those two are balanced with their new kits.

**Before roster 0.24.0:** roster 0.23.0 gives exactly the same numbers on jrpg-battle 0.58.0 as on 0.55.1. Those were 300 battles a line, the bare column only, with core PvE at 75.3%. PvP against the core team was:
- Nike 39.0%, Artemis 36.0%, Ares 50.7%, Zeus 60.7%
- Dionysus 77.0%, Poseidon 76.0%, Persephone 84.0%
- Apollo 61.3%, Aphrodite 49.0%, Demeter 14.3%
- Hera 87.3%, Athena 52.0%, Hestia 80.7%, Hephaestus 47.0%

Five were outside 45–75% then; none of the 14 is now, in loadouts.

### How to read them

- **The PvP-in-loadouts column is the one the gods are balanced on.** The bare column is a check on the kits alone, and the old numbers below were measured that way.
- **The bot aims by resistance.** It sends each hit at the foe it hurts most, counting the foe's RES Down, Sunder, Curse, its own penetration and the skill's damage type (jrpg-battle 0.55.1, its decision 0096), so a team focuses on whoever its debuffer weakened. Guard and Exposed change damage taken, not resistance, so the bot's aim doesn't count them.
- **PvE turns on one wave.** All the core party's losses come on wave 3, a single golem that resists physical damage (173 / 33), so Sunder and magic damage score high in practice PvE.
- **PvP depends on turn order.** Speed boots decide more than any number in a kit (above, "Speed is the biggest lever in a loadout"). A champion's PvP number depends on where it lands among its teammates, so tuning one number against one team stays fragile.
- **The bot plays the champion, and its rules shape the numbers.** It casts an ally skill only when someone is under 55% HP, a party-wide skill only when nobody is shielded, and a blast skill only with two or more enemies standing. A champion whose skill the bot rarely casts tests weak.

### Known issues to fix next

- **Hermes and Hades** keep their old kits, and their numbers are their old kits': Hermes strong (68.9% in loadouts), Hades weak (35.6%). Hermes's support kit needs nothing new from the engine; Hades's needs summoning.
- **The sweep and the check disagree on speed boots** (above): the sweep's opponents wear nothing. A sweep against opponents in their loadouts needs jrpg-battle's sweep to offer it.
- **The practice waves reward Sunder and magic damage,** through their one golem. Nike, Artemis, Poseidon and Demeter are over 90% PvE. That is for the monsters' pass, after the roster.
- **Turn order and speed** deserve a pass of their own: a god's boots can move it by 35 points.

## History

### Roster 0.19.0 to 0.21.0

These describe the kits as they were then; the roster 0.24.0 kits above replace them.

**Roster 0.19.0 adds six** (Hera, Hestia, Dionysus, Nike, Demeter, Persephone), bringing each of its four classes to four (roster 0.21.0 merged two of them, above). Demeter is the third healer. Her skill targets one ally, with a smaller heal for the rest, because the bot holds back a party-wide skill while anyone is shielded and saves SP only for single-target heals (jrpg-battle's `src/engine/autoplay.js`); a party-only heal tested at 46% PvE. Hestia is the first magic Guardian, Nike the third ranged god and Persephone the first to use ice.

**Fuller kits (roster 0.20.0, jrpg-battle 0.26.0 and its decision 0061).** Four of the six use the engine's newest building blocks:

- **Hera** raises the fallen: Peacock's Gaze revives every fallen ally with 20% of its max HP (a `revive` effect; 30%, with a 10% heal for all, until roster 0.21.0).
- **Dionysus** drives his foes mad: Bacchic Revel has a 30% chance to Confuse each enemy for 2 turns, so its single-target skills may land on anyone else, its own side included (the core's `confuse`; 50% until roster 0.21.0).
- **Persephone** changes with the seasons. She starts as Queen of the Dead, her own form: frost, Freeze and control. Spring's Return brings her up as the **Maiden of Spring** (her `forms`), with Blossom, the healing First Flowers and Pomegranate Seed, which hits every enemy, lowers their RES and takes her back below. Her max energy is 100 (120 until roster 0.21.0), so she changes season more often: at 120 she spent most of a PvP match on one side or the other.
- **Hestia**'s hearth fire burns whoever strikes its keeper: Sacred Flame gives her Retaliate for 1 turn (2 until roster 0.21.0), lasting until the end of her next turn, hitting back at each blow for 40% of her MAG ATK (the core's `retaliate`).

**Three classes (roster 0.21.0).** Roster 0.21.0 folds the Casters into the Strikers: Zeus, Poseidon, Hades and Persephone deal magic damage, and that is their damage type's to say, not a class's. That leaves Guardians Athena, Hephaestus, Hera, Hestia; Strikers Artemis, Ares, Dionysus, Nike, Zeus, Poseidon, Hades, Persephone; Supports Hermes, Apollo, Aphrodite, Demeter. Over 1,000 bot-against-bot matches on the gods alone, the bot's blind pick fields two Strikers in 62% of its teams, two Guardians in 19% and two Supports in 19%, and the draft much the same; every team still has a Guardian, a Striker and a Support. The teams with two Supports win 64% of their matches, those with two Guardians 34% (41% drafted), and those with two Strikers 51%.

### The roster 0.23.0 pass: monsters lean one way

Until now the two damage types hardly mattered against monsters: the widest gap between a monster's PHYS and MAG RES was worth about 11% of damage, and none resisted magic more than physical. Roster 0.23.0 makes twelve monsters lean hard one way (see Monsters below), so hitting each with the right damage type does about 1.6 times the damage of the wrong one, a little less for the frailest. Each keeps its old average: against a party dealing half physical and half magic damage, it takes what it took before. Zeus's King of Olympus and Artemis's The Hunt pierce resistance (30% and 40%, jrpg-battle 0.55.0's penetration), and the PvP weapon pool gains the Hunting Spear.

**What moved.** The practice waves now end on a golem that resists physical damage (173 / 33) after a shaman that resists magic (0 / 100). The golem fights alone, so there is no softer target to choose, and the core party deals more physical damage than magic: the core party's PvE win fell from 82.3% to 75.3%, and every champion's PvE number moved with it (Hephaestus −9.4, Ares −9.0, Athena −6.7, Apollo −5.6, and Nike +0.7, the only one up). The `vs core` column is against the new 75.3%. Against the mixed waves, the bot already sends each god at the monster its damage type suits. On jrpg-battle 0.55.0, PvP moved only where the two ultimates pierce (Zeus 62.3% → 63.3%, Artemis 15.7% → 16.3%).

**The bot's aim (jrpg-battle 0.55.1, its decision 0096).** The hero bot now aims by how much of a hit gets through, counting RES Down and penetration, so a team follows its debuffer onto the weakened foe. PvE is unchanged to the decimal: the practice waves leave it no different choice. PvP moved a lot, every number in the table above being on 0.55.1: Hermes 39.7% → 85.3%, Hera 66.3% → 87.3%, Persephone 57.0% → 84.0%, Artemis 16.3% → 36.0%, Ares 22.0% → 50.7%, and down, Aphrodite 91.0% → 49.0%, Demeter 44.3% → 14.3%, Apollo 68.3% → 61.3%. The core party's mirror moved from 48.3% to 53.3%.

Roster 0.22.0's numbers, on jrpg-battle 0.49.0 and 0.55.0 alike, were roster 0.21.0's below: core party PvE 82.3%.

### The roster 0.21.0 balance pass

Three changes, in this order (jrpgbattle-data#37):

1. **A main attack and an off attack** for every god (above, "Two layers on an attack"). It moves no line: the only gods whose damage reads the off attack, Hermes and Hephaestus, keep their ticks with a `dotRatio` of their own.
2. **No more Casters** (above, "Three classes"). The check plays fixed line-ups, so this moves none of its lines; it moves the bot's picks.
3. **The four fuller kits of roster 0.20.0, tuned**, each with the one or two changes that moved it most for the least taken from its kit:

| God | Change | PvE win | PvP win vs core team |
|---|---|---|---|
| Hera | Peacock's Gaze drops its 10% heal for all, and revives at 20% instead of 30% | 98.3% → 88.7% | 76.0% → 66.3% |
| Dionysus | Bacchic Revel: 30% Confuse instead of 50%, damage 1.8 instead of 2.2, no ATK Up for all | 76.3% → 74.3% | 73.0% → 62.0% |
| Persephone | Max energy 100 instead of 120, so she changes season more often | 91.0% → 90.3% | 37.0% → 57.0% |
| Hestia | Sacred Flame's Retaliate lasts 1 turn instead of 2 | 81.0% → 78.7% | 73.0% → 67.3% |

What the variants showed, for the next pass:

- **Hera**'s PvP strength isn't one effect. Peacock's Gaze without its heal, or without its revive, or without the heal and RES Down, or with a third less damage, all land between 64% and 68%; dropping Queen's Ward's heal as well takes her to 61%, but to 71% PvE. She is a tank with a taunt and one of the three highest HPs, and the taunting Guardians test strong against the core team (Athena 54%, Hestia without Retaliate 65%).
- **Dionysus**'s Confuse was worth little: 25% instead of 50% moved him by a point. His 73% came from everything at once, each piece worth 2 to 6 points; the ATK Up for all and the damage were the biggest.
- **Hestia**'s Taunt is what makes her: without it she falls to 46% PvP and 55% PvE. Retaliate was worth about 8 points of PvP; a lower share (25%, a house rule on the core's `retaliate`) did less than the shorter duration, so the core's 40% stays.
- **Persephone** was weak because she was slow to come back. Her energy has a step: 105 or 110 change nothing, 100 is the point where her ultimate comes a turn sooner. A freeze chance of 50% on Winter's Descent, or harder-hitting ultimates, each moved her PvP 5 to 7 points.

**On the gods alone**, the bot's own picks played against each other (1,000 seeded matches, blind and drafted, default AI, no loadouts), the four moved into the pack: Dionysus from 70% to 57% of his matches won (drafted 74% to 57%), Hera 64% to 53% (68% to 54%), Hestia 60% to 54% (64% to 59%) and Persephone 56% to 60% (58% to 57%). Hephaestus is now the clear outlier, at 31% (25% drafted).

The Hestia, Dionysus, Demeter and Persephone team still beats the core team 84.0% of the time: each of its four is in range on its own, and together they bring the roster's most healing (Demeter, Persephone's spring and Hestia's own) behind a taunt. The next pass could look at it as a team.


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
| Hades (his rework) | Summon minions: a `summon` effect that adds AI-controlled units to his side, their stats a share of his, falling with him | The lord of the dead's shades; designed with the owner, next after the tags |
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
