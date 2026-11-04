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

## Numbers (pack 0.3.0 on jrpg-battle v0.3.0, 300 seeded battles per line)

`npm run check` in this repository, against jrpg-battle `v0.3.0`; the core party wins PvE 80.0% and splits the PvP mirror 51.7%. The numbers are identical to the ones measured on `v0.1.0`, `v0.1.2` and `v0.2.0`: the pack and the engine rules are unchanged (`v0.2.0` reshaped how matches are built, decision 0022, and `v0.3.0` moved to dated formats, decision 0023, but neither changed the rules). The pack is unchanged since its first numbers; they moved because `v0.1.0`'s bot holds shared SP for a teammate's due heal (jrpg-battle#256). Each champion stands in for the core hero with the closest job (`data/checks.json`).

| Champion | In for | PvE win | vs core | PvP win vs core team |
|---|---|---|---|---|
| Hermes | Vex | 67.3% | −12.7 | 34.0% |
| Artemis | Vex | 95.3% | +15.3 | 16.3% |
| Apollo | Seren | 50.3% | −29.7 | 20.3% |
| Ares | Aria | 31.7% | −48.3 | **98.0%** |
| Aphrodite | Seren | 49.3% | −30.7 | 78.3% |
| Zeus | Pyra | 100.0% | +20.0 | 54.7% |
| Athena | Aria | 83.0% | +3.0 | 52.0% |
| Poseidon | Pyra | 99.7% | +19.7 | 68.7% |
| Hades | Pyra | 77.7% | −2.3 | 56.3% |
| Hephaestus | Aria | 73.7% | −6.3 | 49.3% |

### How to read them

- **PvE mostly measures element match against one boss.** All the core party's losses come on wave 3, a single 11,400 HP golem weak only to lightning and ice, and monsters resist every element they aren't weak to. Ice and lightning gods (Zeus, Poseidon, Artemis) shred it; physical and fire gods are resisted. PvE numbers will mean more once there are more waves and bosses.
- **PvP still depends on turn order, but no longer on the bot's SP greed.** Heroes have no weaknesses, so elements don't matter in PvP; turn order within a team does. Before jrpg-battle `v0.1.0`, Athena with Aria's exact stats won 53% at speed 98 but 11% at 100–101: acting just before Seren (99), the bot spent the team's last SP on Aegis and left Seren none for Mend. `v0.1.0`'s bot holds the last SP for a teammate's due heal (jrpg-battle#256), and the same sweep now runs 45% (94), 53% (97–98), 58–59% (100–101) and 69–70% (103–105). The remaining step sits at Pyra's speed (102): acting before her puts Aegis up ahead of the enemy's opening area attack. That's ordinary turn order, so a champion's PvP number still depends on where it lands among its teammates, and tuning one number against one team stays fragile.
- **The bot plays the champion, and its rules shape the numbers.** It casts an ally skill only when someone is under 55% HP, a party-wide skill only when nobody is shielded, and a blast skill only with two or more enemies standing. A champion whose skill the bot rarely casts tests weak.

### Known issues to fix next

- **Ares** (98% PvP, 32% PvE): Taunt on a 1,400 HP bruiser at speed 108 dominates PvP, while his physical damage is resisted by the boss.
- **Apollo** (20% PvP): a faster Seren with a similar kit loses badly; probably speed order again (110 lands between Pyra and Vex).
- **Artemis** (16% PvP) and **Hermes** (34%): both replace Vex, the fastest core hero, and lose his place at the top of the order.
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

**On a deployment that loads the pack** (the Mega Fighters site, or a jrpg-battle checkout with the pack copied in as README's "Deploying" says), the gods are ordinary heroes: pick them in the PvP team pick, or put them in the PvE party from the tuning panel (**T**).

**On a deployment that doesn't load it,** run `npm run check`, open the tuning panel, paste `dist/tuning-import.json` into its settings box and press **Import**. The gods then appear in the party slot menus, in PvE and in an online match's settings.
