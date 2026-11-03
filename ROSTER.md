# Roster: first wave, the Olympians

Ten Greek gods built only from jrpg-battle's current building blocks: damage, heal, shield, status, cleanse and remove_status effects; the statuses burn, shock, bleed, freeze, ATK Up, DEF Down and Taunt; and the four elements. Every champion has its own speed, different from each other and from the core heroes (Aria 96, Seren 99, Pyra 102, Vex 120), so mixed teams tie on speed far less than the mirror match does.

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

**Elements are provisional.** With only physical, fire, ice and lightning, several gods are approximations: Poseidon and Aphrodite are "ice" for water, Hades "fire" for the Phlegethon. When jrpg-battle lets content define elements ([jrpg-battle#254](https://github.com/stardustsuperwizard/jrpg-battle/issues/254)), the intended ones are: Poseidon and Aphrodite water, Hades dark, Apollo light, Hermes wind, Zeus lightning, Hephaestus fire.

## Numbers (0.1.0, 300 seeded battles per line)

`npm run check` in this repository; the core party wins PvE 77.3% and splits the PvP mirror 51.7%. Each champion stands in for the core hero with the closest job (`data/checks.json`).

| Champion | In for | PvE win | vs core | PvP win vs core team |
|---|---|---|---|---|
| Hermes | Vex | 69.7% | −7.7 | 33.0% |
| Artemis | Vex | 95.0% | +17.7 | 19.0% |
| Apollo | Seren | 50.3% | −27.0 | 21.0% |
| Ares | Aria | 31.7% | −45.7 | **97.3%** |
| Aphrodite | Seren | 49.3% | −28.0 | 73.3% |
| Zeus | Pyra | 100.0% | +22.7 | 58.7% |
| Athena | Aria | 87.7% | +10.3 | 52.0% |
| Poseidon | Pyra | 99.7% | +22.3 | 66.3% |
| Hades | Pyra | 84.0% | +6.7 | 53.7% |
| Hephaestus | Aria | 72.3% | −5.0 | 50.7% |

### How to read them

- **PvE mostly measures element match against one boss.** All the core party's losses come on wave 3, a single 11,400 HP golem weak only to lightning and ice, and monsters resist every element they aren't weak to. Ice and lightning gods (Zeus, Poseidon, Artemis) shred it; physical and fire gods are resisted. PvE numbers will mean more once there are more waves and bosses.
- **PvP is a step function of speed, because of shared SP and the bot.** Heroes have no weaknesses, so elements don't matter in PvP, but turn order within a team does. Athena with Aria's exact stats wins 53% at speed 98, 11% at 100–101 and 70% at 103, and the cliffs sit at her teammates' speeds (Seren 99, Pyra 102). Traced on seed 1: at 98, Seren acts first and spends the team's last SP on Mend, saving a Pyra at 42%. At 100, Athena acts first, and the bot spends that SP on Aegis (an ally is under 80% and nobody is shielded), so Seren has none for Mend and Pyra dies. Whoever on a team acts first spends the shared SP, and the bot never holds the last point for a heal. A champion's PvP number therefore depends on where it lands among its teammates in the turn order, so tuning one number against one team is fragile. The fix belongs in jrpg-battle's bot (it should hold SP for a heal when an ally is low), not in this roster.
- **The bot plays the champion, and its rules shape the numbers.** It casts an ally skill only when someone is under 55% HP, a party-wide skill only when nobody is shielded, and a blast skill only with two or more enemies standing. A champion whose skill the bot rarely casts tests weak.

### Known issues to fix next

- **Ares** (97% PvP, 32% PvE): Taunt on a 1,400 HP bruiser at speed 108 dominates PvP, while his physical damage is resisted by the boss.
- **Apollo** (21% PvP): a faster Seren with a similar kit loses badly; probably speed order again (110 lands between Pyra and Vex).
- **Artemis** (19% PvP) and **Hermes** (33%): both replace Vex, the fastest core hero, and lose his place at the top of the order.
- **A team without a real healer loses PvE outright** (Ares, Hades, Apollo, Zeus: 0%, since Apollo heals only one ally per skill). The second wave needs more healers.

## Needs a mechanic

Gods whose myth wants something the engine can't do yet. Each is a small jrpg-battle engine idea; the roster tells it which to build first.

| Champion idea | Mechanic | Why |
|---|---|---|
| Hermes (fuller kit) | Speed up / turn advance (Haste, FFX) | The messenger acts again or hurries an ally |
| Kronos | Delay an enemy's turn (Slow) | Lord of time |
| Hera | Revive a fallen ally | Queen of the gods, protector |
| Dionysus | Confuse / random target | Madness and revelry |
| Persephone | A form that changes over the battle | Spring and the underworld |
| Medusa | Stone (a long freeze that ends on a hit) | Petrifying gaze |
| Hydra / Heracles | Multi-hit, and a unit that grows heads when hit | The labors |
| Eros | Charm: an enemy attacks its own side for a turn | The arrows |
| Nyx | Stealth: can't be targeted for a turn | Night |
| Hades (fuller kit) | Lifesteal | Taking souls |

## Trying them in the game

Run `npm run check`, then open the game, press **T** for the tuning panel, paste `dist/tuning-import.json` into its settings box and press **Import**. The gods appear in the party slot menus. This works in PvE locally, and in an online match's settings, until jrpg-battle loads content packs itself ([jrpg-battle#248](https://github.com/stardustsuperwizard/jrpg-battle/issues/248)).
