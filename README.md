# mega_fighters-champions

The champion roster for Mega Fighters: a content pack for the [jrpg-battle](https://github.com/stardustsuperwizard/jrpg-battle) engine. The first wave is ten Greek gods; see [ROSTER.md](ROSTER.md).

**Private for now.** Both the data and the lore are unlicensed (all rights reserved) until the roster opens. The plan is a Creative Commons licence for the data with the lore held back ([jrpg-battle#248](https://github.com/stardustsuperwizard/jrpg-battle/issues/248)).

## Layout

| Path | What it is |
|---|---|
| `packs/mega_fighters-champions/` | The pack: a jrpg-battle content pack folder (its decisions 0016, 0019, 0025 and 0029), exactly as a deployment loads it. It holds these seven files and nothing else. |
| `…/manifest.json` | `formatVersion` (the jrpg-battle content format the files are written in), `id` (the folder's name), `name`, `version` (the pack's own content) and `licences: { data, lore }`. |
| `…/statuses.json` | Statuses the pack adds, in the shape of the default pack's `statuses.json`. Empty for now: the first wave uses the default statuses. |
| `…/elements.json` | Elements the pack adds, in the shape of the default pack's `elements.json`. Empty for now: the first wave uses the four core elements. |
| `…/heroes.json` | Champions, in the shape of the default pack's `heroes.json`. |
| `…/abilities.json` | Their abilities, in the shape of the default pack's `abilities.json`. Each champion has exactly one basic, one skill and one ultimate. |
| `…/enemies.json`, `…/items.json` | Enemies and gear the pack adds: none yet, `{}`. jrpg-battle needs every file because the page can't list a folder. |
| `data/checks.json` | Settings for the check script only: the core party it measures against, which core hero each champion stands in for, and sample teams. Not pack content. |
| `lore/` | One file per champion: sources and story, with `manifest.json` naming the lore format. jrpg-battle never loads it; the Mega Fighters site reads it as the base layer under its own lore, which wins (see `lore/README.md`). |
| `scripts/check.mjs` | Validates the pack with the engine and measures each champion. |

A pack only adds: ids must not reuse ids another listed pack defines, such as the default pack's (`aria`, `slash`, `fire`, `burn`, …). jrpg-battle refuses them, so a pack never silently replaces a balance hero.

## Deploying

Copy the pack folder into a jrpg-battle checkout and list it in the index:

```sh
mkdir -p ../jrpg-battle/src/content/packs   # jrpg-battle ships the folder with its default pack in it; -p keeps this safe either way
cp -r packs/mega_fighters-champions ../jrpg-battle/src/content/packs/
echo '[{ "id": "default", "without": ["heroes"] }, "mega_fighters-champions"]' > ../jrpg-battle/src/content/packs.json
```

The index keeps the engine's default pack, which brings the rules, statuses, elements, monsters, waves, modes and dungeon the pack relies on, and leaves out its four heroes so only the champions are picked (jrpg-battle decision 0025); list plain `"default"` to keep them too. The server, the page and `build:site` then load it, and content versions read `default@1.1.0-heroes+mega_fighters-champions@0.4.0`. Adding or upgrading the pack interrupts online matches running on that deploy. Bump `version` in the manifest on every change to the pack.

## Checking

Needs Node 22 or later and a jrpg-battle checkout beside this one (or `JRPG_BATTLE=/path/to/jrpg-battle`), in the pack's content format; the release in `engine.json` is what CI uses:

```sh
git -C ../jrpg-battle checkout v0.6.0   # the tag CI checks against
npm run check              # 300 battles per line
npm run check -- 1000      # more battles, steadier numbers
```

It loads the pack the way a deployment does, through jrpg-battle's own pack reader, boundary check and validation, reports any speed shared with another hero, writes `dist/tuning-import.json` (paste it into the game's tuning panel to play the champions), and prints each champion's PvE and PvP win rates against the core party. ROSTER.md explains how to read them.

**Compatibility is the format, not a release number** (jrpg-battle decision 0023). The manifest's `formatVersion` names the content format the pack is written in, and the pack works with every jrpg-battle release that reads that format. The engine refuses any other format by name. An engine release that keeps the format needs nothing here: no pack release, and the site moves its engine pin alone. When jrpg-battle moves the content format, the pack's files move with it in one PR and the pack releases. `engine.json` (`{ "tag": "v0.6.0" }`) only names the release CI checks against; bump it to measure on a newer engine, and update ROSTER.md if the numbers move.

## CI

`.github/workflows/check.yml` runs `npm run check -- 300` on every pull request and on every push to `main`. It checks out jrpg-battle at `engine.json`'s tag into `jrpg-battle/` using the repository secret **`ENGINE_READ_TOKEN`** (a fine-grained token with read-only Contents access, since jrpg-battle is private), without leaving the token in that checkout's git config. A pack that the engine refuses (an id the default pack already defines, a missing file, an unknown field, another content format) fails the run.

## Releasing

The site (`stardustsuperwizard/mega_fighters`) pins a release tag of this repository, never a branch.

1. Bump `version` in `packs/mega_fighters-champions/manifest.json` (semver; the `package.json` version follows it) in the PR that changes the pack.
2. Merge it, with CI green.
3. On GitHub, **Releases → Draft a new release**: create the tag `vX.Y.Z` (the manifest's version, with a `v`) on `main`, and name the champions added or changed in the notes. Publishing creates the tag.
4. Move the site's pin in `mega_fighters`'s `versions.json` to the new tag. **That deploy interrupts live online matches**, as any content change does.

