# mega_fighters-champions

The champion roster for Mega Fighters: a content pack for the [jrpg-battle](https://github.com/stardustsuperwizard/jrpg-battle) engine. The first wave is ten Greek gods; see [ROSTER.md](ROSTER.md).

**Private for now.** Both the data and the lore are unlicensed (all rights reserved) until the roster opens. The plan is a Creative Commons licence for the data with the lore held back ([jrpg-battle#248](https://github.com/stardustsuperwizard/jrpg-battle/issues/248)).

## Layout

| Path | What it is |
|---|---|
| `pack.json` | The pack manifest: id, version, the core content it was built against, each folder's licence. A draft until jrpg-battle settles the format (#248). |
| `data/heroes.json` | Champions, in the same shape as jrpg-battle's `src/content/heroes.json`. |
| `data/abilities.json` | Their abilities, in the shape of `src/content/abilities.json`. Each champion has exactly one basic, one skill and one ultimate. |
| `data/checks.json` | Settings for the check script only: which core hero each champion is compared with, and sample teams. Not pack content. |
| `lore/` | One file per champion: sources and story. Kept apart from the data so it can carry its own licence. |
| `scripts/check.mjs` | Validates the pack with the engine and measures each champion. |

Ids must not reuse core ids (`aria`, `slash`, …); the check refuses them, so a pack never silently replaces a balance hero.

## Checking

Needs Node 22 or later and a jrpg-battle checkout beside this one (or `JRPG_BATTLE=/path/to/jrpg-battle`).

```sh
npm run check              # 300 battles per line
npm run check -- 1000      # more battles, steadier numbers
```

It validates the pack against the engine, reports any speed shared with another hero, writes `dist/tuning-import.json` (paste it into the game's tuning panel to play the champions), and prints each champion's PvE and PvP win rates against the core party. ROSTER.md explains how to read them.
