# jrpgbattle-data

All of jrpgbattle's content for the [jrpg-battle](https://github.com/stardustsuperwizard/jrpg-battle) engine: its champions and their abilities, and the rules, statuses, elements, monsters, items, waves, modes and dungeon they play on. It is kept one file per entry, served as a static API, and built into the content files a deployment drops over the engine's own, replacing all of them. The first wave is ten Greek gods; see [ROSTER.md](ROSTER.md).

**Private for now.** Both the data and the lore are unlicensed (all rights reserved) until the roster opens. The plan is a Creative Commons licence for the data with the lore held back ([jrpg-battle#248](https://github.com/stardustsuperwizard/jrpg-battle/issues/248)). The static API is public once Pages is on (see [Static API](#static-api)); the lore is never published.

## Layout

| Path | What it is |
|---|---|
| `content/manifest.json` | `formatVersion` (the jrpg-battle content format the files are written in), `name`, `version` (the roster's own) and `licences: { data, lore }`. |
| `content/heroes/index.json` | The champions' ids in roster order, the order jrpg-battle's pick screen lists them. A champion's file isn't built until it is listed here. |
| `content/heroes/<id>.json` | One champion, in the shape of an entry of jrpg-battle's `src/content/heroes.json`; its `id` is its file name. |
| `content/abilities/<id>.json` | One ability, in the shape of an entry of `src/content/abilities.json`. Each champion has exactly one basic, one skill and one ultimate. Abilities have no index: they come in the order the champions use them. |
| `content/statuses/`, `content/elements/`, `content/enemies/`, `content/items/` | One file per status, element, monster and item, in the shape of an entry of the engine's file of that name, each folder with an `index.json` listing its ids in order. Statuses and elements are keyed by their file name alone; monsters and items also carry it as `id`. |
| `content/rules.json`, `content/waves.json`, `content/modes.json`, `content/dungeon.json` | The global rules, the waves, each mode's teams and the dungeon, single files as the engine has them. |
| `scripts/build.mjs` | `npm run build`: the sources into `dist/src/content/` and `dist/api/`. Plain Node, no dependencies, no engine needed. |
| `scripts/check.mjs` | `npm run check`: builds, validates the result with the engine and measures each champion. |
| `tests/` | `npm test`: the build's own tests. |
| `data/checks.json` | Settings for the check only: the core party it measures against, which core hero each champion stands in for, and sample teams. Not content. |
| `lore/` | One file per champion: sources and story, with `manifest.json` naming the lore format. Neither built nor published; the jrpgbattle site reads it as the base layer under its own lore, which wins (see `lore/README.md`). |

Ids are lowercase letters, digits and `_`. Champion and ability ids must not reuse jrpg-battle's (`aria`, `slash`, …): a deployment wouldn't mind, but the check measures each champion beside the engine's heroes and refuses a clash.

**This repository owns all the content.** The rules, statuses, elements, monsters, items, waves, modes and dungeon started as copies of jrpg-battle 0.6.0's, and a release replaces the engine's with these, so a change to the engine's own content no longer reaches the site by itself. `npm run check` says which of these files differ from the engine checkout's, to make that a choice rather than drift.

### Adding a champion

1. Write `content/heroes/<id>.json` and its three `content/abilities/<id>.json` files.
2. Add the id to `content/heroes/index.json` where it belongs in the roster.
3. Bump `version` in `content/manifest.json`, and `package.json`'s with it.
4. `npm test && npm run check`, and update ROSTER.md with its numbers.

## Building

```sh
npm run build          # into dist/
```

| Output | What it is |
|---|---|
| `dist/src/content/<name>.json` | Every one of jrpg-battle's content files (its decision 0030): manifest, rules, statuses, elements, heroes, abilities, enemies, items, waves, modes and dungeon, each kind in its index order and abilities in the order the heroes use them. Dropped over a jrpg-battle checkout, they replace all of its content. |
| `dist/api/` | The static API, below. |

The build refuses sources that don't fit together, naming every problem: a missing file or folder, a listed entry with no file, a file its index doesn't list, an `id` that isn't its file name, an ability a champion uses that has no file. An ability no champion uses is built after the rest and reported. Whether the content follows the game's rules is the engine's to say, in `npm run check`.

## Static API

The API on GitHub Pages serves a release, never `main`. Each release carries `jrpgbattle-api-vX.Y.Z.zip`, the API's files as they are served. When the release workflow succeeds, `.github/workflows/pages.yml` downloads the latest release's API zip and deploys it, once publishing is switched on; until then its job is skipped and nothing is published. To switch it on:

1. Turn Pages on: **Settings → Pages → Source: GitHub Actions**.
2. Add the repository variable **`PUBLISH_API`** with the value `true`: **Settings → Secrets and variables → Actions → Variables**.
3. Run the `pages` workflow once from the Actions tab to publish the latest release, or publish a new release.

To serve another release again, as a rollback, run `pages` from the Actions tab with its tag. A Pages site is public even when the repository is private, and on a private repository Pages needs a paid GitHub plan. Setting `PUBLISH_API` back to anything else stops publishing; the last deploy stays up until Pages is turned off.

| Path | What it is |
|---|---|
| `index.json` | `name`, `version` and `formatVersion` from the manifest, each kind's ids in order, and the paths of the combined files. Start here. |
| `manifest.json`, `rules.json`, `waves.json`, `modes.json`, `dungeon.json` | The single files. |
| `<kind>/index.json` | Each kind's ids, in order: `statuses`, `elements`, `heroes`, `abilities`, `enemies`, `items`. |
| `<kind>/<id>.json` | One entry, as in the sources. |
| `content/<name>.json` | Every combined content file, the same as a release's. |

The API's `index.json` names the release it serves (`version`). A deployment that needs a fixed version takes that release's zips rather than the API.

## Deploying

Each release carries `jrpgbattle-content-vX.Y.Z.zip`, which holds every content file, `src/content/<name>.json`, at the paths they take in jrpg-battle. Unzip it at the root of a jrpg-battle checkout, before building the site or starting the server:

```sh
unzip -o jrpgbattle-content-v0.4.0.zip -d ../jrpg-battle
```

From a local build, `cp -r dist/src ../jrpg-battle/` does the same. The server, the page and `build:site` then run on this repository's content alone, and content versions read its `version`. Changing the files interrupts online matches running on that deploy.

## Checking

Needs Node 22 or later and a jrpg-battle checkout beside this one (or `JRPG_BATTLE=/path/to/jrpg-battle`), in the roster's content format; the release in `engine.json` is what CI uses:

```sh
git -C ../jrpg-battle checkout v0.6.0   # the tag CI checks against
npm run check              # 300 battles per line
npm run check -- 1000      # more battles, steadier numbers
```

It builds the sources, reads the engine's content with jrpg-battle's own reader, puts the built files where a deployment would and runs its boundary check and validation, both as a deployment loads them and with the engine's heroes kept beside the champions so each can be measured against the hero it stands in for. It reports any speed shared with another hero, writes `dist/tuning-import.json` (paste it into the game's tuning panel to play the champions), and prints each champion's PvE and PvP win rates against the core party. ROSTER.md explains how to read them.

**Compatibility is the format, not a release number** (jrpg-battle decision 0023). The manifest's `formatVersion` names the content format the files are written in, and they work with every jrpg-battle release that reads that format. The engine refuses any other format by name. An engine release that keeps the format needs nothing here: no roster release, and the site moves its engine pin alone. When jrpg-battle moves the content format, the files move with it in one PR and the roster releases. `engine.json` (`{ "tag": "v0.6.0" }`) only names the release CI checks against; bump it to measure on a newer engine, and update ROSTER.md if the numbers move.

## CI

`.github/workflows/check.yml` runs `npm test`, `npm run build` and `npm run check -- 300` on every pull request and on every push to `main`. It checks out jrpg-battle at `engine.json`'s tag into `jrpg-battle/` using the repository secret **`ENGINE_READ_TOKEN`** (a fine-grained token with read-only Contents access, since jrpg-battle is private), without leaving the token in that checkout's git config. Sources the build refuses, or built files the engine refuses (an unknown field, an id the engine already uses, another content format), fail the run.

## Releasing

The jrpgbattle site (`stardustsuperwizard/jrpgbattle-client-premium`) pins a release tag of this repository, never a branch.

1. Bump `version` in `content/manifest.json` (semver; the `package.json` version follows it) in the PR that changes the roster.
2. Merge it, with CI green.
3. On GitHub, **Releases → Draft a new release**: create the tag `vX.Y.Z` (the manifest's version, with a `v`) on `main`, and name the champions added or changed in the notes. Publishing creates the tag.
4. `.github/workflows/release.yml` then checks that the tag matches the manifest, runs the same tests and check as CI, and attaches `jrpgbattle-content-vX.Y.Z.zip` and `jrpgbattle-api-vX.Y.Z.zip`. If it fails, the release has no zips: fix the cause and re-run the workflow. Once it succeeds, `pages` publishes the new release's API (when `PUBLISH_API` is `true`).
5. Move the site's pin in its `versions.json` to the new tag. **That deploy interrupts live online matches**, as any content change does.
