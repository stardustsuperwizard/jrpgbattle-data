# jrpgbattle-data

jrpgbattle's **setting** for the [jrpg-battle](https://github.com/stardustsuperwizard/jrpg-battle) engine (its decision 0050): its champions and their abilities, and the monsters, items, waves and dungeon they play in, by the engine's own core rules, with a short list of **house rules** where this world changes a core number. It is kept one file per entry, served as a static API, and built into the setting files a deployment drops over the engine's `src/content/setting/`, replacing its default world whole. The first wave is ten Greek gods; see [ROSTER.md](ROSTER.md).

**Public, not yet licensed.** The repository is public, but the data is unlicensed (all rights reserved) until the roster opens; the plan is a Creative Commons licence ([jrpg-battle#248](https://github.com/stardustsuperwizard/jrpg-battle/issues/248)). The static API is at <https://api.jrpgbattle.com/>, with its documentation on the front page (see [Static API](#static-api)). **No lore here:** the champions' stories are the owner's and stay private, so they moved to the jrpgbattle site's own `lore/` when this repository went public (2026-11-10); never add them back.

## Layout

| Path | What it is |
|---|---|
| `content/setting/` | The setting's sources, mirroring the engine's `src/content/setting/`; its [README](content/setting/README.md) says what is a setting's and what is the engine's. |
| `content/setting/manifest.json` | `formatVersion` (the jrpg-battle content format the files are written in), `name`, `version` (the roster's own) and `licences: { data, lore }`. |
| `content/setting/heroes/index.json` | The champions' ids in roster order, the order jrpg-battle's pick screen lists them. A champion's file isn't built until it is listed here. |
| `content/setting/heroes/<id>.json` | One champion, in the shape of an entry of jrpg-battle's `setting/heroes.json`; its `id` is its file name. |
| `content/setting/abilities/<id>.json` | One ability, in the shape of an entry of `setting/abilities.json`. Each champion has exactly one basic, one skill and one ultimate. Abilities have no index: they come in the order the champions use them. |
| `content/setting/enemies/`, `content/setting/items/` | One file per monster and item, in the shape of an entry of the engine's file of that name, each folder with an `index.json` listing its ids in order; each carries its file name as `id`. |
| `content/setting/slots.json` | The slots a hero wears items in (weapon, armour, boots, charm), each with the `pool` a PvP pick chooses from by item tier (jrpg-battle decision 0058): tier 2, the Labyrinth's sidegrades. See [DUNGEON.md](DUNGEON.md). |
| `content/setting/waves.json`, `content/setting/dungeon.json` | The practice waves, and what is in the dungeon (the pools, bosses, themes, the shop, the drops): see [DUNGEON.md](DUNGEON.md). How a campaign works is the engine's `core/campaign.json`. |
| `content/setting/house-rules.json` | The core numbers this world changes, by the engine config's paths: the level cap and the loot sell share. The engine refuses anything its core lacks. |
| `scripts/build.mjs` | `npm run build`: the sources into `dist/src/content/setting/` and `dist/api/`. Plain Node, no dependencies, no engine needed. |
| `scripts/check.mjs` | `npm run check`: builds, validates the result with the engine and its schemas, checks `schemas/` is the engine's, and measures each champion. |
| `scripts/openapi.mjs` | The API's OpenAPI description, which the build writes from the same content as the files. |
| `schemas/` | The content format's JSON Schemas, copied from the jrpg-battle release in `engine.json` (its `docs/content-format/`, decision 0053) by `npm run schemas` (`scripts/schemas.mjs`). The API publishes them. Never edit them here: `npm run check` fails when they differ from the engine's. |
| `tests/` | `npm test`: the build's own tests. |
| `data/checks.json` | Settings for the check only: the core party it measures against, which core hero each champion stands in for, and sample teams. Not content. |

Ids are lowercase letters, digits and `_`. Champion and ability ids must not reuse jrpg-battle's (`aria`, `slash`, …): a deployment wouldn't mind, but the check measures each champion beside the engine's heroes and refuses a clash.

**This repository owns the world, not the rules.** The rules (combat, levels, timers, statuses, elements, modes, how a campaign works) are the engine's `src/content/core/`, the same for every site, and a change there reaches this site with the next engine release. Where this world plays by a different number, the number is a house rule in `content/setting/house-rules.json`, which `npm run check` prints beside the engine's own value. (Until 2026-11-09 this repository copied every engine file, rules included; the copies had drifted in exactly those two numbers.)

### Adding a champion

1. Write `content/setting/heroes/<id>.json` and its three `content/setting/abilities/<id>.json` files. Every champion says its `reach`, `"melee"` or `"ranged"` (jrpg-battle decision 0052): how it fights, which a site uses to draw it before its art exists. No rule reads it.
2. Add the id to `content/setting/heroes/index.json` where it belongs in the roster.
3. Bump `version` in `content/setting/manifest.json`, and `package.json`'s with it.
4. `npm test && npm run check`, and update ROSTER.md with its numbers.

### Adding a monster

1. Write `content/setting/enemies/<id>.json` (its `reach` as a champion's, its `skills` inline, with `weight`s for the default AI, or `"ai": "healer"` or `"charger"` with the tagged skills those need) and add the id to `content/setting/enemies/index.json`.
2. Put it in the dungeon: a pool in `content/setting/dungeon.json` (`from` a floor), or a stretch's `bosses` (entries `{ from, bosses }` by floor), and its row in DUNGEON.md's map. Practice's fixed `waves.json` is what `npm run check` measures the champions on, so changing it moves every number in ROSTER.md.
3. Bump the version as for a champion, `npm test && npm run check`, and add it to ROSTER.md's monsters.
4. The site draws it with an enemy recipe of its own (jrpgbattle-client-premium's `art/enemies/`); until then it shows the site's default unit, chosen by its `reach`.

## Building

```sh
npm run build          # into dist/
```

| Output | What it is |
|---|---|
| `dist/src/content/setting/<name>.json` | jrpg-battle's setting files (its decision 0050): manifest, heroes, abilities, enemies, items, slots, waves, dungeon and house-rules, each kind in its index order and abilities in the order the heroes use them. Dropped over a jrpg-battle checkout's `src/content/setting/`, they replace its default world. |
| `dist/api/` | The static API, below. |

The build refuses sources that don't fit together, naming every problem: a missing file or folder, a listed entry with no file, a file its index doesn't list, an `id` that isn't its file name, an ability a champion uses that has no file. An ability no champion uses is built after the rest and reported. Whether the content follows the game's rules is the engine's to say, in `npm run check`.

## Static API

The API on GitHub Pages serves a release, never `main`. Each release carries `jrpgbattle-api-vX.Y.Z.zip`, the API's files as they are served. When the release workflow succeeds, `.github/workflows/pages.yml` downloads the latest release's API zip and deploys it, once publishing is switched on; until then its job is skipped and nothing is published. To switch it on:

1. Turn Pages on: **Settings → Pages → Source: GitHub Actions**.
2. Add the repository variable **`PUBLISH_API`** with the value `true`: **Settings → Secrets and variables → Actions → Variables**.
3. Make sure the latest release has its zips. If its `release` run failed, run `release` from the Actions tab with its tag: that attaches them with the workflow as it is on `main`, and `pages` follows it.
4. Otherwise run the `pages` workflow once from the Actions tab to publish the latest release, or publish a new release.

To serve another release again, as a rollback, run `pages` from the Actions tab with its tag. Setting `PUBLISH_API` back to anything else stops publishing; the last deploy stays up until Pages is turned off.

The API is then at `https://api.jrpgbattle.com/v1/`, starting with `v1/index.json`. The site's front page, `https://api.jrpgbattle.com/`, is its documentation: the OpenAPI description, browsable with Swagger UI, where each path can be tried. Pages answers any origin (`Access-Control-Allow-Origin: *`), so a page on another site can fetch it.

**The domain** is set in **Settings → Pages → Custom domain** (`api.jrpgbattle.com`, with Enforce HTTPS), not in a `CNAME` file: a deploy from Actions keeps it. Its DNS is a `CNAME` record `api` → `stardustsuperwizard.github.io` in the `jrpgbattle.com` zone at DigitalOcean, beside the TXT record that verifies the domain for the owner's GitHub account (`_github-pages-challenge-stardustsuperwizard`). The old address, `stardustsuperwizard.github.io/jrpgbattle-data/`, redirects to it.

### Versions

The API is versioned by path: everything is under `/v1/`. The root holds only what outlives a version: `index.html`, the docs page, and `index.json`, which lists the versions (`{ "name", "docs": "index.html", "versions": { "v1": { "index": "v1/index.json", "openapi": "v1/openapi.json" } } }`). `API_VERSION` in `scripts/build.mjs` names it. Three numbers, three meanings:

- **`v1`, the API version:** the paths and the shape of the indexes. Moving, renaming or removing a path, or changing an index's shape, is a new version, `/v2/`; adding a path or a field to an index is not.
- **`formatVersion`:** the jrpg-battle content format the entries are written in (its decision 0023). Entries are the sources as they are, so a new content format changes them inside `v1`; read `formatVersion` before reading entries.
- **`version`:** the roster release being served. Pages serves one release, the latest, so this moves with every release.

Pages serves one build, so when a `/v2/` comes the build writes both until `/v1/` is retired, and the root index lists both. A client that needs a fixed roster takes that release's API or content zip rather than the live API.

| Path, under `/v1/` | What it is |
|---|---|
| `index.json` | `api` (`v1`), `name`, `version` and `formatVersion` from the manifest, each kind's ids in order, the paths of the combined files, and of `openapi.json` and `schemas/`. Start here. |
| `openapi.json` | The OpenAPI 3.1 description of every path below, each response described by a schema in `schemas/`. |
| `schemas/<name>.schema.json` | The content format's JSON Schemas, as the engine release in `engine.json` wrote them: one per setting file, an entry's shape a `$defs` of its file's (`heroes.schema.json#/$defs/hero`), and `common.schema.json`. A schema checks a file's shape; the engine checks the rest (an id naming something that exists) when it loads. |
| `manifest.json`, `slots.json`, `waves.json`, `dungeon.json`, `house-rules.json` | The single files. |
| `<kind>/index.json` | Each kind's ids, in order: `heroes`, `abilities`, `enemies`, `items`. |
| `<kind>/<id>.json` | One entry, as in the sources. |
| `content/<name>.json` | Every combined content file, the same as a release's. |

## Deploying

Each release carries `jrpgbattle-content-vX.Y.Z.zip`, which holds every content file, `src/content/<name>.json`, at the paths they take in jrpg-battle. Unzip it at the root of a jrpg-battle checkout, before building the site or starting the server:

```sh
unzip -o jrpgbattle-content-v0.4.0.zip -d ../jrpg-battle
```

From a local build, `cp -r dist/src ../jrpg-battle/` does the same. The server, the page and `build:site` then run on this repository's content alone, and content versions read its `version`. Changing the files interrupts online matches running on that deploy.

## Checking

Needs Node 22 or later and a jrpg-battle checkout beside this one (or `JRPG_BATTLE=/path/to/jrpg-battle`), in the roster's content format; the release in `engine.json` is what CI uses:

```sh
git -C ../jrpg-battle checkout v0.17.0  # the tag CI checks against
npm run check              # 300 battles per line
npm run check -- 1000      # more battles, steadier numbers
```

It builds the sources, reads the engine's content with jrpg-battle's own reader, puts the built files where a deployment would and runs its boundary check and validation, both as a deployment loads them and with the engine's heroes kept beside the champions so each can be measured against the hero it stands in for. It reports any speed shared with another hero, writes `dist/tuning-import.json` (paste it into the game's tuning panel to play the champions), and prints each champion's PvE and PvP win rates against the core party. ROSTER.md explains how to read them.

**Compatibility is the format, not a release number** (jrpg-battle decision 0023). The manifest's `formatVersion` names the content format the files are written in, and they work with every jrpg-battle release that reads that format. The engine refuses any other format by name. An engine release that keeps the format needs nothing here: no roster release, and the site moves its engine pin alone. When jrpg-battle moves the content format, the files move with it in one PR and the roster releases. `engine.json` (`{ "tag": "v0.17.0" }`) names the release CI checks against and the schemas come from; bump it to measure on a newer engine, run `npm run schemas` with that release checked out, and update ROSTER.md if the numbers move.

## CI

`.github/workflows/check.yml` runs `npm test`, `npm run build` and `npm run check -- 300` on every pull request and on every push to `main`. It checks out jrpg-battle at `engine.json`'s tag into `jrpg-battle/` using the repository secret **`ENGINE_READ_TOKEN`** (a fine-grained token with read-only Contents access, since jrpg-battle is private), without leaving the token in that checkout's git config. Sources the build refuses, or built files the engine refuses (an unknown field, an id the engine already uses, another content format), fail the run.

## Releasing

The jrpgbattle site (`stardustsuperwizard/jrpgbattle-client-premium`) pins a release tag of this repository, never a branch.

1. Bump `version` in `content/setting/manifest.json` (semver; the `package.json` version follows it) in the PR that changes the roster.
2. Merge it, with CI green.
3. On GitHub, **Releases → Draft a new release**: create the tag `vX.Y.Z` (the manifest's version, with a `v`) on `main`, and name the champions added or changed in the notes. Publishing creates the tag.
4. `.github/workflows/release.yml` then checks that the tag matches the manifest, runs the same tests and check as CI, and attaches `jrpgbattle-content-vX.Y.Z.zip` and `jrpgbattle-api-vX.Y.Z.zip`. If it fails, the release has no zips: fix the cause on `main`, then run `release` from the Actions tab with the tag (re-running the failed run would use the workflow as it was at the tag). Once it succeeds, `pages` publishes the new release's API (when `PUBLISH_API` is `true`).
5. Move the site's pin in its `versions.json` to the new tag. **That deploy interrupts live online matches**, as any content change does.
