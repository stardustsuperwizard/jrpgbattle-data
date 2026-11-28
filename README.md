# jrpgbattle-data

jrpgbattle's **world** for the [jrpg-battle](https://github.com/stardustsuperwizard/jrpg-battle) engine's `jrpgbattle` ruleset (its decision 0086): its champions and their abilities, and the monsters, items, waves, modes and dungeon they play in, by the ruleset's own rules, with the ruleset's features this world enables (the levels feature, with its own level cap) and how its campaign works. It is kept one file per entry, served as a static API, and built into the world files a deployment drops over the engine's `src/world/`, replacing its example world whole. The roster is sixteen Greek gods; see [ROSTER.md](ROSTER.md).

**Public, not yet licensed.** The repository is public, but the data is unlicensed (all rights reserved) until the roster opens; the plan is a Creative Commons licence ([jrpg-battle#248](https://github.com/stardustsuperwizard/jrpg-battle/issues/248)). The static API is at <https://api.jrpgbattle.com/>, with its documentation on the front page (see [Static API](#static-api)). **No lore here:** the champions' stories are the owner's and stay private, so they moved to the jrpgbattle site's own `lore/` when this repository went public (2026-11-10); never add them back.

## Layout

| Path | What it is |
|---|---|
| `content/world/` | The world's sources, mirroring the engine's `src/world/`; its [README](content/world/README.md) says what is a world's and what is the ruleset's. |
| `content/world/world.json` | The ruleset the world plays (`jrpgbattle`), that ruleset's world format (`formatVersion`, a date), and the features it enables with their values: the levels feature, `maxLevel` 25. |
| `content/world/manifest.json` | `name`, `version` (the roster's own) and `licences: { data, lore }`. |
| `content/world/heroes/index.json` | The champions' ids in roster order, the order jrpg-battle's pick screen lists them. A champion's file isn't built until it is listed here. |
| `content/world/heroes/<id>.json` | One champion, in the shape of an entry of a jrpg-battle world's `heroes.json`; its `id` is its file name. |
| `content/world/abilities/<id>.json` | One ability, in the shape of an entry of `abilities.json`. Each champion has exactly one basic, one skill and one ultimate. Abilities have no index: they come in the order the champions use them. |
| `content/world/enemies/`, `content/world/items/` | One file per monster and item, in the shape of an entry of the engine's file of that name, each folder with an `index.json` listing its ids in order; each carries its file name as `id`. |
| `content/world/slots.json` | The slots a hero wears items in (weapon, armour, boots, charm), each with the `pool` a PvP pick chooses from by item tier (jrpg-battle decision 0058): tier 2, the Labyrinth's sidegrades. See [DUNGEON.md](DUNGEON.md). |
| `content/world/waves.json`, `content/world/dungeon.json`, `content/world/campaign.json` | The practice waves, what is in the dungeon (the pools, bosses, themes, the shop, the drops): see [DUNGEON.md](DUNGEON.md), and how a campaign works in this world: the engine's example's, with loot selling for a quarter of its price (`campaign.loot.sellShare` 0.25). |
| `content/world/modes.json`, `content/world/elements.json` | The world's modes and elements, as the engine's example world has them. |
| `content/world/formations.json` | The formations a team may stand in (jrpg-battle decision 0103): each its lines of line-up slots, front to back, and the cover each line gives the units behind it. Two for a team of four, from roster 0.29.0: the Square (the default) and the Guarded Square, the Striker and the Controller swapped (ROSTER.md, "Formations"). |
| `scripts/build.mjs` | `npm run build`: the sources into `dist/src/world/` and `dist/api/`. Plain Node, no dependencies, no engine needed. |
| `scripts/check.mjs` | `npm run check`: builds, validates the result with the engine and its schemas, checks `schemas/` is the engine's, and writes `dist/tuning-import.json`. It checks the roster works, not that it is balanced: win rates are [jrpgbattle-balance](https://github.com/stardustsuperwizard/jrpgbattle-balance)'s. |
| `scripts/openapi.mjs` | The API's OpenAPI description, which the build writes from the same content as the files. |
| `schemas/` | The jrpgbattle world format's JSON Schemas, copied from the jrpg-battle release in `engine.json` (its `src/rulesets/jrpgbattle/schemas/`, decisions 0053, 0086) by `npm run schemas` (`scripts/schemas.mjs`). The API publishes them. Never edit them here: `npm run check` fails when they differ from the engine's. |
| `tests/` | `npm test`: the build's own tests. |

Ids are lowercase letters, digits and `_`. Champion and ability ids must not reuse jrpg-battle's (`aria`, `slash`, …): a deployment wouldn't mind, but jrpgbattle-balance measures each champion beside the engine's heroes, so the check refuses a clash.

**Balance lives in [jrpgbattle-balance](https://github.com/stardustsuperwizard/jrpgbattle-balance)** (from 2026-11-26): each god's win rates, the PvP gear pool's rule, speed and turn order, and the history of each balance pass. It measures this repository's releases and opens an issue here when a number should change; the change itself is made here, as a content release.

**This repository owns the world, not the rules.** The rules (combat, the battle clock, statuses, damage types) are the jrpgbattle ruleset's (the engine's `src/rulesets/jrpgbattle/rules/`), the same for every world on it, and a change there reaches this site with the next engine release. What a world decides is in its own files: the features it enables in `world.json` (here a level cap of 25, where the ruleset's example world has 10), and how its campaign works in `campaign.json` (here loot sells for 0.25 of its price, where the example's sells for 0.5); `npm run check` prints each beside the example world's value. (Until 2026-11-17 these two numbers were house rules over the engine's core.)

### Adding a champion

1. Write `content/world/heroes/<id>.json` and its three `content/world/abilities/<id>.json` files. Every champion says its `reach`, `"melee"` or `"ranged"` (jrpg-battle decision 0052): how it fights, which a site uses to draw it before its art exists. No rule reads it. A champion that sits between two classes may also say `tags`, labels beside its class such as `["bruiser"]` (jrpg-battle decision 0100); no rule reads those either.
2. Add the id to `content/world/heroes/index.json` where it belongs in the roster.
3. Bump `version` in `content/world/manifest.json`, and `package.json`'s with it.
4. `npm test && npm run check`, and add the champion to ROSTER.md. Its numbers are measured in jrpgbattle-balance once the release is out.

### Adding a monster

1. Write `content/world/enemies/<id>.json` (its `reach` as a champion's, its `skills` inline, with `weight`s for the default AI, or `"ai": "healer"` or `"charger"` with the tagged skills those need) and add the id to `content/world/enemies/index.json`.
2. Put it in the dungeon: a pool in `content/world/dungeon.json` (`from` a floor), or a stretch's `bosses` (entries `{ from, bosses }` by floor), and its row in DUNGEON.md's map. Practice's fixed `waves.json` is what jrpgbattle-balance measures the champions on, so changing it moves every PvE number there.
3. Bump the version as for a champion, `npm test && npm run check`, and add it to ROSTER.md's monsters.
4. The site draws it with an enemy recipe of its own (jrpgbattle-client-premium's `art/enemies/`); until then it shows the site's default unit, chosen by its `reach`.

## Building

```sh
npm run build          # into dist/
```

| Output | What it is |
|---|---|
| `dist/src/world/<name>.json` | A jrpg-battle world (its decision 0086): manifest, world, heroes, abilities, enemies, items, slots, waves, dungeon, campaign, modes, elements and formations, each kind in its index order and abilities in the order the heroes use them. Dropped over a jrpg-battle checkout's `src/world/`, they replace its example world. |
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
- **`ruleset` and `formatVersion`:** the jrpg-battle ruleset the world plays and its world format the entries are written in (its decisions 0023, 0086), from `world.json`. Entries are the sources as they are, so a new world format changes them inside `v1`; read `formatVersion` before reading entries.
- **`version`:** the roster release being served. Pages serves one release, the latest, so this moves with every release.

Pages serves one build, so when a `/v2/` comes the build writes both until `/v1/` is retired, and the root index lists both. A client that needs a fixed roster takes that release's API or content zip rather than the live API.

| Path, under `/v1/` | What it is |
|---|---|
| `index.json` | `api` (`v1`), `name` and `version` from the manifest, `ruleset` and `formatVersion` from `world.json`, each kind's ids in order, the paths of the combined files, and of `openapi.json` and `schemas/`. Start here. |
| `openapi.json` | The OpenAPI 3.1 description of every path below, each response described by a schema in `schemas/`. |
| `schemas/<name>.schema.json` | The world format's JSON Schemas, as the ruleset in the engine release in `engine.json` wrote them: one per world file, an entry's shape a `$defs` of its file's (`heroes.schema.json#/$defs/hero`), and `common.schema.json`. A schema checks a file's shape; the engine checks the rest (an id naming something that exists) when it loads. |
| `manifest.json`, `world.json`, `slots.json`, `waves.json`, `dungeon.json`, `campaign.json`, `modes.json`, `elements.json`, `formations.json` | The single files. |
| `<kind>/index.json` | Each kind's ids, in order: `heroes`, `abilities`, `enemies`, `items`. |
| `<kind>/<id>.json` | One entry, as in the sources. |
| `content/<name>.json` | Every combined content file, the same as a release's. |

## Deploying

Each release carries `jrpgbattle-content-vX.Y.Z.zip`, which holds every world file, `src/world/<name>.json`, at the paths they take in jrpg-battle. Unzip it at the root of a jrpg-battle checkout, before building the site or starting the server:

```sh
unzip -o jrpgbattle-content-v0.4.0.zip -d ../jrpg-battle
```

From a local build, `cp -r dist/src ../jrpg-battle/` does the same. The server, the page and `build:site` then run on this repository's content alone, and content versions read its `version`. Changing the files interrupts online matches running on that deploy.

## Checking

Needs Node 22 or later and a jrpg-battle checkout beside this one (or `JRPG_BATTLE=/path/to/jrpg-battle`) holding the ruleset `world.json` names, in its world format; the release in `engine.json` is what CI uses:

```sh
git -C ../jrpg-battle checkout "$(node -p "require('./engine.json').tag")"  # the tag CI checks against
npm run check
```

It builds the sources, reads the engine's example world and deployment files with jrpg-battle's own reader, puts the built files where a deployment would and runs its boundary check and validation as a deployment loads them, checks the world against the format's schemas, refuses a champion or ability id the engine's own heroes use, and writes `dist/tuning-import.json` (paste it into the game's tuning panel to play the champions). It plays no battles: the champions' win rates, against the core team and the roster, bare and in loadouts, are jrpgbattle-balance's `npm run roster`.

**Compatibility is the ruleset and its world format, not a release number** (jrpg-battle decisions 0023, 0086). `world.json` names the ruleset the files play and its world format, and they work with every jrpg-battle release whose ruleset reads that format. The engine refuses another ruleset or format by name. An engine release that keeps the format needs nothing here: no roster release, and the site moves its engine pin alone. When the ruleset moves its world format, the files move with it in one PR and the roster releases. `engine.json` names the release CI checks against and the schemas come from; bump it to check against a newer engine and run `npm run schemas` with that release checked out; jrpgbattle-balance moves its own pins to measure it.

## CI

`.github/workflows/check.yml` runs `npm test`, `npm run build` and `npm run check -- 300` on every pull request and on every push to `main`. It checks out jrpg-battle at `engine.json`'s tag into `jrpg-battle/` using the repository secret **`ENGINE_READ_TOKEN`** (a fine-grained token with read-only Contents access, since jrpg-battle is private), without leaving the token in that checkout's git config. Sources the build refuses, or built files the engine refuses (an unknown field, an id the engine already uses, another ruleset or world format), fail the run.

## Releasing

The jrpgbattle site (`stardustsuperwizard/jrpgbattle-client-premium`) pins a release tag of this repository, never a branch.

1. Bump `version` in `content/world/manifest.json` (semver; the `package.json` version follows it) in the PR that changes the roster.
2. Merge it, with CI green.
3. On GitHub, **Releases → Draft a new release**: create the tag `vX.Y.Z` (the manifest's version, with a `v`) on `main`, and name the champions added or changed in the notes. Publishing creates the tag.
4. `.github/workflows/release.yml` then checks that the tag matches the manifest, runs the same tests and check as CI, and attaches `jrpgbattle-content-vX.Y.Z.zip` and `jrpgbattle-api-vX.Y.Z.zip`. If it fails, the release has no zips: fix the cause on `main`, then run `release` from the Actions tab with the tag (re-running the failed run would use the workflow as it was at the tag). Once it succeeds, `pages` publishes the new release's API (when `PUBLISH_API` is `true`).
5. Move the site's pin in its `versions.json` to the new tag. **That deploy interrupts live online matches**, as any content change does.
