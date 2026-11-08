# mega_fighters-champions

The champion roster for Mega Fighters: content files for the [jrpg-battle](https://github.com/stardustsuperwizard/jrpg-battle) engine, which a deployment copies over the engine's own. The first wave is ten Greek gods; see [ROSTER.md](ROSTER.md).

**Private for now.** Both the data and the lore are unlicensed (all rights reserved) until the roster opens. The plan is a Creative Commons licence for the data with the lore held back ([jrpg-battle#248](https://github.com/stardustsuperwizard/jrpg-battle/issues/248)).

## Layout

| Path | What it is |
|---|---|
| `content/` | The files a deployment overwrites in jrpg-battle's `src/content/` (its decision 0030), each replacing the engine's file of the same name. Only these three: the engine's other files (rules, statuses, elements, monsters, items, waves, modes, dungeon) stay as they are. |
| `content/manifest.json` | `formatVersion` (the jrpg-battle content format the files are written in), `name`, `version` (the roster's own) and `licences: { data, lore }`. It replaces the engine's manifest, so a deployment's matches name the roster's version. |
| `content/heroes.json` | Champions, in the shape of jrpg-battle's `src/content/heroes.json`. They replace the engine's heroes, so only the champions are picked. |
| `content/abilities.json` | Their abilities, in the shape of `src/content/abilities.json`. Each champion has exactly one basic, one skill and one ultimate. |
| `data/checks.json` | Settings for the check script only: the core party it measures against, which core hero each champion stands in for, and sample teams. Not content. |
| `lore/` | One file per champion: sources and story, with `manifest.json` naming the lore format. jrpg-battle never loads it; the Mega Fighters site reads it as the base layer under its own lore, which wins (see `lore/README.md`). |
| `scripts/check.mjs` | Validates the files with the engine and measures each champion. |

Champion and ability ids must not reuse jrpg-battle's (`aria`, `slash`, …). A deployment's overwrite wouldn't mind, but the check measures each champion beside the engine's heroes and refuses a clash.

## Deploying

Copy the files over a jrpg-battle checkout's content:

```sh
cp content/*.json ../jrpg-battle/src/content/
```

The server, the page and `build:site` then run on the champions with the engine's rules, statuses, elements, monsters, waves, modes and dungeon, and content versions read the roster's `version` (`0.4.0`). Changing the files interrupts online matches running on that deploy. Bump `version` in the manifest on every change.

## Checking

Needs Node 22 or later and a jrpg-battle checkout beside this one (or `JRPG_BATTLE=/path/to/jrpg-battle`), in the roster's content format; the release in `engine.json` is what CI uses:

```sh
git -C ../jrpg-battle checkout v0.6.0   # the tag CI checks against
npm run check              # 300 battles per line
npm run check -- 1000      # more battles, steadier numbers
```

It reads the engine's content with jrpg-battle's own reader, puts these files where a deployment would and runs its boundary check and validation, both as a deployment loads them and with the engine's heroes kept beside the champions so each can be measured against the hero it stands in for. It reports any speed shared with another hero, writes `dist/tuning-import.json` (paste it into the game's tuning panel to play the champions), and prints each champion's PvE and PvP win rates against the core party. ROSTER.md explains how to read them.

**Compatibility is the format, not a release number** (jrpg-battle decision 0023). The manifest's `formatVersion` names the content format the files are written in, and they work with every jrpg-battle release that reads that format. The engine refuses any other format by name. An engine release that keeps the format needs nothing here: no roster release, and the site moves its engine pin alone. When jrpg-battle moves the content format, the files move with it in one PR and the roster releases. `engine.json` (`{ "tag": "v0.6.0" }`) only names the release CI checks against; bump it to measure on a newer engine, and update ROSTER.md if the numbers move.

## CI

`.github/workflows/check.yml` runs `npm run check -- 300` on every pull request and on every push to `main`. It checks out jrpg-battle at `engine.json`'s tag into `jrpg-battle/` using the repository secret **`ENGINE_READ_TOKEN`** (a fine-grained token with read-only Contents access, since jrpg-battle is private), without leaving the token in that checkout's git config. Files the engine refuses (an unknown file or field, an id the engine already uses, another content format) fail the run.

## Releasing

The site (`stardustsuperwizard/mega_fighters`) pins a release tag of this repository, never a branch.

1. Bump `version` in `content/manifest.json` (semver; the `package.json` version follows it) in the PR that changes the roster.
2. Merge it, with CI green.
3. On GitHub, **Releases → Draft a new release**: create the tag `vX.Y.Z` (the manifest's version, with a `v`) on `main`, and name the champions added or changed in the notes. Publishing creates the tag.
4. Move the site's pin in `mega_fighters`'s `versions.json` to the new tag. **That deploy interrupts live online matches**, as any content change does.

