# Roster: first wave, the Olympians

Ten Greek gods built only from jrpg-battle's building blocks: damage, heal, shield, status, cleanse and remove_status effects; jrpg-battle's statuses burn, shock, bleed, freeze, ATK Up, RES Down and Taunt; and its two damage types, physical and magic. The statuses and elements are the engine's own core (jrpg-battle decisions 0050 and 0055), not this repository's. Every champion has its own speed, different from each other and from the core heroes (Aria 96, Seren 99, Pyra 102, Vex 120), so mixed teams tie on speed far less than the mirror match does.

| Champion | Class | Role | Element | Spd | HP | ATK | PHYS RES | MAG RES | Skill | Ultimate |
|---|---|---|---|---|---|---|---|---|---|---|
| 🪽 Hermes | Support | Messenger: SP battery | Physical | 124 | 980 | 135 | 75 | 55 | Winged Sandals: single + Shock | Psychopomp: all, 60% Shock |
| 🏹 Artemis | Striker | Huntress: single target | Physical | 116 | 1000 | 155 | 75 | 55 | Silver Arrow: heavy single + Bleed | The Hunt: massive single |
| ☀️ Apollo | Support | Sun Healer | Magic | 110 | 1100 | 110 | 68 | 92 | Healing Light: heal one + cleanse | Chariot of the Sun: all + Burn, heal all, ATK Up all |
| 🗡️ Ares | Striker | War God: bruiser | Physical | 108 | 1400 | 140 | 109 | 81 | Bloodlust: single + Taunt | Rout: heavy blast + Bleed |
| 🌹 Aphrodite | Support | Enchantress: SP battery, party heal | Magic | 106 | 1050 | 110 | 64 | 86 | Embrace: heal all 12% + ATK Up all | Born of the Foam: all, 40% Freeze, heal all |
| ⚡ Zeus | Caster | Sky King: area damage | Magic | 104 | 1000 | 160 | 55 | 75 | Thunderbolt: blast, 60% Shock | King of Olympus: heavy all + Shock |
| 🦉 Athena | Guardian | Strategist: tank | Physical | 98 | 1450 | 115 | 138 | 102 | Aegis: shield all + Taunt | Owl's Gambit: heavy single, ATK Up all |
| 🔱 Poseidon | Caster | Sea King: area control | Magic | 97 | 1150 | 145 | 68 | 92 | Tidal Wave: all, 25% Freeze | Earthshaker: heavy all + RES Down |
| 💀 Hades | Caster | Underworld King: damage over time | Magic | 94 | 1150 | 145 | 64 | 86 | Grasp of the Dead: single + Burn + RES Down | Realm of the Dead: all + 3-turn Burn |
| 🔨 Hephaestus | Guardian | Smith: armor tank | Physical | 88 | 1550 | 130 | 126 | 94 | Forge Armor: heavy shield all | Molten Hammer: massive single + Burn |

The ten share the character group **Gods of Olympus** (every hero has a `characterGroup`, the title of its set). Each god has a class, a label for now (jrpg-battle decision 0054; what a class might do is jrpg-battle#363): Guardian, Striker, Caster or Support. The bot's pick spreads a team across classes.

Hermes and Aphrodite's basic attacks gain 2 SP instead of 1, so they pay for their teammates' skills.

**Two damage types, two resistances** (jrpg-battle decision 0055). Every god and monster has a physical resistance (PHYS RES) and a magic resistance (MAG RES) instead of DEF, and a hit is lowered by the resistance that matches its element: `physical` by PHYS RES, `magic` by MAG RES. There are no weaknesses. A god fights with body and weapon (Physical: Hermes, Artemis, Ares, Athena, Hephaestus) or with divine power (Magic: Apollo, Aphrodite, Zeus, Poseidon, Hades); the water, dark, light and wind the myths ask for are no longer approximated with ice or fire. Each god's resistances are the old DEF, 15% higher against their own damage type and 15% lower against the other, so a physical bruiser is harder to hit physically than magically. A world may still add elements, each resisted by one of the two stats.


## Numbers (roster 0.15.0 on jrpg-battle 0.19.0, 300 seeded battles per line)

`npm run check` in this repository, against jrpg-battle 0.19.0; the core party wins PvE 82.3% and splits the PvP mirror 48.3% (the engine's own simulator, which uses the engine's monsters, has 80.6% and 48.5%). The champions' resistances replaced their DEF in this release, and every hit now drains toughness, so the bosses' toughness went up to keep chargers from being broken on every hit. Each champion stands in for the core hero with the closest job (`data/checks.json`).

| Champion | In for | PvE win | vs core | PvP win vs core team |
|---|---|---|---|---|
| Hermes | Vex | 77.0% | −5.3 | 39.7% |
| Artemis | Vex | 80.3% | −2.0 | 15.7% |
| Apollo | Seren | 86.3% | +4.0 | 68.3% |
| Ares | Aria | 86.3% | +4.0 | 22.0% |
| Aphrodite | Seren | 52.7% | −29.7 | **91.0%** |
| Zeus | Pyra | 79.7% | −2.7 | 62.3% |
| Athena | Aria | 87.0% | +4.7 | 54.3% |
| Poseidon | Pyra | 88.0% | +5.7 | 72.0% |
| Hades | Pyra | 90.7% | +8.3 | 20.0% |
| Hephaestus | Aria | 75.7% | −6.7 | 43.7% |

All-champion teams: Athena, Zeus, Apollo, Artemis win PvE 86.0% and PvP 57.7% against the core team; Hephaestus, Poseidon, Aphrodite, Hermes 70.0% and 14.0%; Ares, Hades, Apollo, Zeus 45.3% and 55.7%.

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

| Monster | From floor | Element | PHYS / MAG RES | Role |
|---|---|---|---|---|
| 🦠 Slime | 1 | Physical | 34 / 24 | Corrode: lowers a hero's PHYS and MAG RES |
| 👺 Goblin | 1 | Physical | 40 / 40 | Hits hard, sometimes harder |
| 🐺 Dire Wolf | 1 | Physical | 46 / 32 | Fast; Howl raises its ATK |
| 🧌 Goblin Shaman | 3 | Magic | 40 / 40 | Healer; shocks |
| 🐗 Erymanthian Boar | 3 | Physical | 57 / 40 | Stampede: a heavy gore that may bleed |
| 🦅 Harpy | 6 | Magic | 28 / 28 | Fastest monster; Storm Shriek hits the whole party, may shock |
| 💀 Spartoi | 6 | Physical | 72 / 72 | The sown men: Phalanx shields itself and taunts |
| 🐍 Dracaena | 6 | Physical | 57 / 40 | Venom Fang may cause bleeding; Constrict lowers PHYS and MAG RES |
| 🔥 Phoenix | 11 | Magic | 36 / 36 | Healer; burns |
| 🦎 Drakon | 11 | Magic | 48 / 48 | The Dracaena's fire kin: burning fangs, Fire Breath on three heroes |
| 🛡️ Hoplite | 11 | Physical | 109 / 76 | Shield Wall shields every monster on its side |
| 👻 Shade | 16 | Magic | 34 / 24 | Grave Chill may freeze; its Lament lowers the party's PHYS and MAG RES |
| 🧙 Necromancer | 16 | Magic | 36 / 36 | Grave Bolt may freeze; Withering Curse hits the party and lowers PHYS and MAG RES |
| ⚔️ Myrmidon | 16 | Physical | 80 / 56 | The Hoplite's red-armoured elite: Battle Cry raises every monster's ATK for a turn |
| 🗿 Ancient Golem | boss, 1–5 | Physical | 103 / 72 | Charger, every 3rd action: Cataclysm on the party |
| 🐂 Minotaur | boss, 6–10 | Physical | 92 / 64 | Charger, every 4th action: Labyrinth Rampage on the party; Horn Gore bleeds |
| 🐉 Lernaean Hydra | boss, 11–15 | Physical | 98 / 68 | Charger, every 4th action: Venom Torrent on the party, may bleed; Venom Bite bleeds |
| 🐕 Cerberus | boss, 16–20 | Magic | 103 / 72 | Charger, every 4th action: Triple Inferno on the party, may burn; Hellfire Bite burns |
| 🌪️ Typhon | boss, 21–25 (the final boss) | Magic | 80 / 80 | Charger, every 3rd action: Wrath of the Titans on the party, may shock; Storm Fist shocks |

Every monster here has art on the site. A monster added later shows the site's default unit, chosen by its `reach`, until jrpgbattle-client-premium has its recipe.

## Needs a mechanic

Gods whose myth wants something the engine can't do yet. Each is a small jrpg-battle engine idea; the roster tells it which to build first.

| Champion idea | Mechanic | Why |
|---|---|---|
| Hermes (fuller kit) | Speed up / turn advance (Haste, FFX) | The messenger acts again or hurries an ally |
| Kronos | Delay an enemy's turn (Slow) | Lord of time. A Slow that lowers speed is now a content status (`"mods": { "spdPct": -0.3 }`, decision 0029); pushing a turn back is not yet |
| Hera | Revive a fallen ally | Queen of the gods, protector |
| Dionysus | Confuse / random target | Madness and revelry |
| Persephone | A form that changes over the battle | Spring and the underworld |
| Medusa | Stone (a long freeze that ends on a hit) | Petrifying gaze |
| Hydra / Heracles | Multi-hit, and a unit that grows heads when hit | The labors |
| Eros | Charm: an enemy attacks its own side for a turn | The arrows |
| Nyx | Stealth: can't be targeted for a turn | Night |
| Hades (fuller kit) | Lifesteal | Taking souls |

## Trying them in the game

**On a deployment that loads the roster** (the jrpgbattle site, or a jrpg-battle checkout with a release's content files unzipped over it as README's "Deploying" says), the gods are ordinary heroes: pick them in the PvP team pick, or put them in the PvE party from the tuning panel (**T**).

**On a deployment that doesn't load it,** run `npm run check`, open the tuning panel, paste `dist/tuning-import.json` into its settings box and press **Import**. The gods then appear in the party slot menus, in PvE and in an online match's settings.
