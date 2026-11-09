# Roster: first wave, the Olympians

Ten Greek gods built only from jrpg-battle's building blocks: damage, heal, shield, status, cleanse and remove_status effects; jrpg-battle's statuses burn, shock, bleed, freeze, ATK Up, DEF Down and Taunt; and its four elements. The statuses and elements are still the engine's own, copied into this repository's `content/` with the rest of its content, so new ones are a file each in `content/statuses/` or `content/elements/`. Every champion has its own speed, different from each other and from the core heroes (Aria 96, Seren 99, Pyra 102, Vex 120), so mixed teams tie on speed far less than the mirror match does.

| Champion | Role | Element (for now) | Spd | HP | ATK | DEF | Skill | Ultimate |
|---|---|---|---|---|---|---|---|---|
| 🪽 Hermes | Messenger: SP battery | Lightning | 124 | 980 | 135 | 65 | Winged Sandals: single + Shock | Psychopomp: all, 60% Shock |
| 🏹 Artemis | Huntress: single target | Ice | 116 | 1000 | 155 | 65 | Silver Arrow: heavy single + Bleed | The Hunt: massive single |
| ☀️ Apollo | Sun Healer | Fire | 110 | 1100 | 110 | 80 | Healing Light: heal one + cleanse | Chariot of the Sun: all + Burn, heal all, ATK Up all |
| 🗡️ Ares | War God: bruiser | Physical | 108 | 1400 | 140 | 95 | Bloodlust: single + Taunt | Rout: heavy blast + Bleed |
| 🌹 Aphrodite | Enchantress: SP battery, party heal | Ice | 106 | 1050 | 110 | 75 | Embrace: heal all 12% + ATK Up all | Born of the Foam: all, 40% Freeze, heal all |
| ⚡ Zeus | Sky King: area damage | Lightning | 104 | 1000 | 160 | 65 | Thunderbolt: blast, 60% Shock | King of Olympus: heavy all + Shock |
| 🦉 Athena | Strategist: tank | Physical | 98 | 1450 | 115 | 120 | Aegis: shield all + Taunt | Owl's Gambit: heavy single, ATK Up all |
| 🔱 Poseidon | Sea King: area control | Ice | 97 | 1150 | 145 | 80 | Tidal Wave: all, 25% Freeze | Earthshaker: heavy all + DEF Down |
| 💀 Hades | Underworld King: damage over time | Fire | 94 | 1150 | 145 | 75 | Grasp of the Dead: single + Burn + DEF Down | Realm of the Dead: all + 3-turn Burn |
| 🔨 Hephaestus | Smith: armor tank | Fire | 88 | 1550 | 130 | 110 | Forge Armor: heavy shield all | Molten Hammer: massive single + Burn |

Hermes and Aphrodite's basic attacks gain 2 SP instead of 1, so they pay for their teammates' skills.

**Elements are provisional.** With only physical, fire, ice and lightning, several gods are approximations: Poseidon and Aphrodite are "ice" for water, Hades "fire" for the Phlegethon. Elements are content here now, one file each in `content/elements/`; the intended ones are: Poseidon and Aphrodite water, Hades dark, Apollo light, Hermes wind, Zeus lightning, Hephaestus fire.

## Numbers (roster 0.4.0 on jrpg-battle 0.6.0, 300 seeded battles per line)

`npm run check` in this repository, against jrpg-battle 0.6.0; the core party wins PvE 83.3% and splits the PvP mirror 50.0%. The champions are unchanged since 0.3.0; the numbers moved with the engine. In 0.6.0 taunt pulls every attacker's single-target attacks, players' and the bot's as well as monsters' (jrpg-battle decision 0028); before, it only drew monsters, so in PvP Ares's and Athena's taunts did nothing. A frozen golem also keeps its wind-up now instead of losing it (decision 0027). Each champion stands in for the core hero with the closest job (`data/checks.json`).

| Champion | In for | PvE win | vs core | PvP win vs core team |
|---|---|---|---|---|
| Hermes | Vex | 71.0% | −12.3 | 34.3% |
| Artemis | Vex | 98.7% | +15.3 | 10.7% |
| Apollo | Seren | 51.3% | −32.0 | 63.7% |
| Ares | Aria | 23.3% | −60.0 | 59.0% |
| Aphrodite | Seren | 53.7% | −29.7 | **88.3%** |
| Zeus | Pyra | 99.7% | +16.3 | 53.3% |
| Athena | Aria | 89.3% | +6.0 | 47.3% |
| Poseidon | Pyra | 99.3% | +16.0 | 68.3% |
| Hades | Pyra | 70.7% | −12.7 | 40.3% |
| Hephaestus | Aria | 73.0% | −10.3 | 41.3% |

All-champion teams: Athena, Zeus, Apollo, Artemis win PvE 94.0% and PvP 65.0% against the core team; Hephaestus, Poseidon, Aphrodite, Hermes 93.3% and 4.3%; Ares, Hades, Apollo, Zeus 0.0% and 51.3%.

### How to read them

- **PvE mostly measures element match against one boss.** All the core party's losses come on wave 3, a single 11,400 HP golem weak only to lightning and ice, and monsters resist every element they aren't weak to. Ice and lightning gods (Zeus, Poseidon, Artemis) shred it; physical and fire gods are resisted. PvE numbers will mean more once there are more waves and bosses.
- **PvP still depends on turn order, but no longer on the bot's SP greed.** Heroes have no weaknesses, so elements don't matter in PvP; turn order within a team does. Before jrpg-battle `v0.1.0`, Athena with Aria's exact stats won 53% at speed 98 but 11% at 100–101: acting just before Seren (99), the bot spent the team's last SP on Aegis and left Seren none for Mend. `v0.1.0`'s bot holds the last SP for a teammate's due heal (jrpg-battle#256), and the same sweep now runs 45% (94), 53% (97–98), 58–59% (100–101) and 69–70% (103–105). The remaining step sits at Pyra's speed (102): acting before her puts Aegis up ahead of the enemy's opening area attack. That's ordinary turn order, so a champion's PvP number still depends on where it lands among its teammates, and tuning one number against one team stays fragile.
- **The bot plays the champion, and its rules shape the numbers.** It casts an ally skill only when someone is under 55% HP, a party-wide skill only when nobody is shielded, and a blast skill only with two or more enemies standing. A champion whose skill the bot rarely casts tests weak.

### Known issues to fix next

- **Aphrodite** (88% PvP): the strongest PvP champion now. A party heal and ATK Up for everyone each turn, behind a taunting Aria who draws the core team's single-target hits, outlasts it.
- **Ares** (59% PvP, 23% PvE): no longer dominant. His 98% PvP on 0.3.0 wasn't his taunt, which did nothing in PvP then; with taunt working on both sides, the core team's Aria draws his hits too. His physical damage is still resisted by the PvE boss.
- **Artemis** (11% PvP) and **Hermes** (34%): both replace Vex, the fastest core hero, and lose his place at the top of the order.
- **A team without a real healer loses PvE outright** (Ares, Hades, Apollo, Zeus: 0%, since Apollo heals only one ally per skill). The second wave needs more healers.

## Monsters

The dungeon's monsters (`content/enemies/`), by the stretch of the Descent they first appear in; [DUNGEON.md](DUNGEON.md) has the whole map. The first five are jrpg-battle's own; roster 0.5.0 added ten from Greek myth, two of them stronger recolours of others (the Drakon of the Dracaena, the Myrmidon of the Hoplite), and the Minotaur; roster 0.6.0 adds a boss for each of the last three stretches.

| Monster | From floor | Element | Weak to | Role |
|---|---|---|---|---|
| 🦠 Slime | 1 | Physical | Fire, lightning | Corrode: lowers a hero's DEF |
| 👺 Goblin | 1 | Physical | Ice, physical | Hits hard, sometimes harder |
| 🐺 Dire Wolf | 1 | Physical | Fire, ice | Fast; Howl raises its ATK |
| 🧌 Goblin Shaman | 3 | Lightning | Physical, lightning | Healer; shocks |
| 🐗 Erymanthian Boar | 3 | Physical | Fire, lightning | Stampede: a heavy gore that may bleed |
| 🦅 Harpy | 6 | Lightning | Ice, physical | Fastest monster; Storm Shriek hits the whole party, may shock |
| 💀 Spartoi | 6 | Physical | Physical, fire | The sown men: Phalanx shields itself and taunts |
| 🐍 Dracaena | 6 | Physical | Fire, ice | Venom Fang may cause bleeding; Constrict lowers DEF |
| 🔥 Phoenix | 11 | Fire | Ice, physical | Healer; burns |
| 🦎 Drakon | 11 | Fire | Ice, physical | The Dracaena's fire kin: burning fangs, Fire Breath on three heroes |
| 🛡️ Hoplite | 11 | Physical | Lightning, ice | Shield Wall shields every monster on its side |
| 👻 Shade | 16 | Ice | Fire, lightning | Grave Chill may freeze; its Lament lowers the party's DEF |
| 🧙 Necromancer | 16 | Ice | Fire, physical | Grave Bolt may freeze; Withering Curse hits the party and lowers DEF |
| ⚔️ Myrmidon | 16 | Physical | Lightning, fire | The Hoplite's red-armoured elite: Battle Cry raises every monster's ATK for a turn |
| 🗿 Ancient Golem | boss, 1–5 | Physical | Lightning, ice | Charger, every 3rd action: Cataclysm on the party |
| 🐂 Minotaur | boss, 6–10 | Physical | Fire, lightning | Charger, every 4th action: Labyrinth Rampage on the party; Horn Gore bleeds |
| 🐉 Lernaean Hydra | boss, 11–15 | Physical | Fire, ice | Charger, every 4th action: Venom Torrent on the party, may bleed; Venom Bite bleeds |
| 🐕 Cerberus | boss, 16–20 | Fire | Ice, lightning | Charger, every 4th action: Triple Inferno on the party, may burn; Hellfire Bite burns |
| 🌪️ Typhon | boss, 21–25 (the final boss) | Lightning | Ice, physical | Charger, every 3rd action: Wrath of the Titans on the party, may shock; Storm Fist shocks |

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
