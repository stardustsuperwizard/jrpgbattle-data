# The setting

The legends of Olympus and their world, as a **setting** for the jrpg-battle engine (its decision 0050): the champions and their abilities, the monsters, the items, the practice waves, and what is in the dungeon. The rulebook is the engine's own `src/content/core/`; this folder replaces its `src/content/setting/` whole when a site builds.

The layout mirrors the engine's setting folder, with the kinds keyed by id broken out one file per entry (see the repository README): `manifest.json`, `heroes/`, `abilities/`, `enemies/`, `items/`, `waves.json`, `dungeon.json` and `house-rules.json`.

**`dungeon.json` is what is *in* the dungeon**: the monster pools and bosses by floor, the stretches' themes, how many monsters a wave holds, how monsters grow by floor, the shop's stock and consumables, and which items drop. How a campaign *works* (floors, stretches, wipes, waypoints, gear slots, the town, the enchanter's odds, how loot rolls) is the engine's `core/campaign.json`; a key that belongs there is refused by name when the engine assembles the two.

**`house-rules.json` is the short list of core values this world changes**, by the engine config's own paths. Today:

| House rule | This world | The engine's core | Why |
|---|---|---|---|
| `rules.maxLevel` | 25 | 10 | A hero levels once a floor through the Descent's 25 floors (DUNGEON.md). |
| `dungeon.campaign.loot.sellShare` | 0.25 | 0.5 | Loot sells for a quarter of its price, so the shop stays the place to spend. |

Every path must name something the engine's core has, of the same kind; a typo is refused. Anything else about how the game plays is the engine's to change, for every site.
