# The world

The gods of Olympus and their world, as a **world** for the jrpg-battle engine's `jrpgbattle` ruleset (its decision 0086): the champions and their abilities, the monsters, the items, the practice waves, the modes, and what is in the dungeon and how its campaign works. How the game resolves is the ruleset's own rules (the engine's `src/rulesets/jrpgbattle/rules/`); this folder replaces the engine's `src/world/` whole when a site builds.

The layout mirrors the engine's world folder, with the kinds keyed by id broken out one file per entry (see the repository README): `manifest.json`, `world.json`, `heroes/`, `abilities/`, `enemies/`, `items/`, `slots.json`, `waves.json`, `dungeon.json`, `campaign.json`, `modes.json` and `elements.json`.

**`world.json` names the ruleset this world plays, its world format and the features it enables.** Today the levels feature, with a level cap of 25 where the ruleset's example world has 10: a hero levels once a floor through the Descent's 25 floors (DUNGEON.md).

**`dungeon.json` is what is *in* the dungeon**: the monster pools and bosses by floor, the stretches' themes, how many monsters a wave holds, how monsters grow by floor, the shop's stock and consumables, and which items drop. **`campaign.json` is how a campaign works** (floors, stretches, wipes, gear slots, the town, the enchanter's odds, how loot rolls): the engine's example world's, but loot sells for a quarter of its price (`campaign.loot.sellShare` 0.25, the example's 0.5), so the shop stays the place to spend. A key in the wrong one of the two is refused by name when the engine assembles them.

**`modes.json` and `elements.json`** are the engine's example world's as they are: the modes a site offers, and the elements' names, icons and colours.

Anything else about how the game plays is the ruleset's to change, for every world on it.
