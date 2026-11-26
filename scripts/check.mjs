// Checks the roster against a jrpg-battle checkout: that it builds, loads and
// fits the world format. Whether it is balanced is jrpgbattle-balance's
// question (the owner, 2026-11-26); its reports measure the champions.
//   node scripts/check.mjs
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/check.mjs
//
// The sources in content/world/ build (scripts/build.mjs) into a jrpg-battle
// world (its decision 0086), which a deployment drops over its src/world/
// whole; the rules are the jrpgbattle ruleset's, which the world's
// world.json names, with the features it enables. The check builds the
// files, puts them where a deployment would and runs jrpg-battle's boundary
// check, assembly and validation, so files that pass here are files the
// server and the page accept.
//
// It also writes dist/tuning-import.json, the roster as tuning-panel settings,
// so the champions can be tried on a deployment that doesn't load them.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildContent, render } from './build.mjs';
import { ENGINE_SCHEMA_DIR, SCHEMA_DIR, engineSchemas, keptSchemas } from './schemas.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = resolve(process.env.JRPG_BATTLE ?? join(ROOT, '..', 'jrpg-battle'));

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const load = (path) => import(pathToFileURL(join(ENGINE, path)).href);
const { assembleContent, buildConfig, validateConfig, contentLayout } = await load('src/engine/content.js');
const { readContent, ruleset } = await load('scripts/content.js');
const { checkBoundaries } = await load('scripts/check-boundaries.js');
const { loadSchemas, validate } = await load('tests/helpers/schema.js');

// engine.json names the jrpg-battle release CI checks against. The roster
// works with any engine holding the ruleset its world.json names, in the
// world format it names (jrpg-battle decisions 0023, 0086); assembleContent
// below refuses another by name, so no release numbers have to agree.
const { tag: ENGINE_TAG } = read(join(ROOT, 'engine.json'));
if (typeof ENGINE_TAG !== 'string' || !/^v\d+\.\d+\.\d+$/.test(ENGINE_TAG)) {
  throw new Error(`engine.json's tag must be a release tag like "v0.1.0", not ${JSON.stringify(ENGINE_TAG)}.`);
}
const { version: ENGINE_VERSION } = read(join(ENGINE, 'package.json'));

// The files a release drops over the engine's world: exactly the ruleset's world files.
const { content: world } = buildContent(ROOT);
const files = Object.keys(world);
const worldFiles = contentLayout(ruleset).world;
if (JSON.stringify([...files].sort()) !== JSON.stringify([...worldFiles].sort())) {
  throw new Error(`The build makes ${files.join(', ')}; jrpg-battle's ${ruleset.id} world files are ${worldFiles.join(', ')}.`);
}
if (world.world.ruleset !== ruleset.id) throw new Error(`world.json names the ruleset "${world.world.ruleset}"; jrpg-battle ${ENGINE_TAG}'s world plays ${ruleset.id}.`);

// Where a deployment puts them: they must pass jrpg-battle's check:boundaries.
const violations = checkBoundaries(files.map((name) => ({ path: `src/world/${name}.json`, source: render(world[name]) })));
if (violations.length) throw new Error(violations.map((v) => `${v.file}: ${v.reason}`).join('\n'));

// As a deployment loads them: this world in place of the engine's own, beside the engine's deployment files.
const engine = readContent();
const roster = assembleContent({ world, deployment: engine.deployment }, ruleset);
validateConfig(buildConfig(roster, ruleset));

// The schemas the API publishes are the ruleset's, as it wrote them (decisions 0053, 0086), and the world fits them.
const kept = keptSchemas(ROOT);
const theirs = engineSchemas(ENGINE);
const differ = [...new Set([...Object.keys(kept), ...Object.keys(theirs)])].filter((name) => kept[name] !== theirs[name]);
if (differ.length) throw new Error(`${SCHEMA_DIR}/ differs from jrpg-battle ${ENGINE_VERSION}'s ${ENGINE_SCHEMA_DIR}/ in ${differ.join(', ')}: run npm run schemas.`);
const schemas = loadSchemas(join(ENGINE, ENGINE_SCHEMA_DIR) + '/');
const misfits = files.flatMap((name) => validate(schemas, `${name}.schema.json`, world[name]).map((p) => `${name}.json ${p}`));
if (misfits.length) throw new Error(`The world doesn't fit the ${ruleset.id} world format's schemas:\n${misfits.join('\n')}`);

// jrpgbattle-balance measures each champion beside the engine's own heroes, so no id may be one of theirs.
const defaults = assembleContent(engine, ruleset);
for (const kind of ['heroes', 'abilities']) {
  const clash = Object.keys(roster[kind]).filter((id) => Object.hasOwn(defaults[kind], id));
  if (clash.length) throw new Error(`The roster's ${kind} reuse jrpg-battle's ids ${clash.join(', ')}, so a champion couldn't be measured beside the hero it stands in for.`);
}
const { manifest, heroes, abilities } = world;
// Where this world plays by other numbers than the ruleset's example world: its levels feature and how its campaign works.
const leaves = (value, prefix = '') => (value && typeof value === 'object' && !Array.isArray(value) ? Object.entries(value).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k)) : [prefix]);
const at = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
const differences = ['world', 'campaign'].flatMap((file) => leaves(world[file]).filter((path) => JSON.stringify(at(world[file], path)) !== JSON.stringify(at(engine.world[file], path)))
  .map((path) => `${file}.json ${path} ${JSON.stringify(at(world[file], path))} (the example's ${JSON.stringify(at(engine.world[file], path))})`));

const tuning = { heroes, abilities };
mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'tuning-import.json'), `${JSON.stringify(tuning, null, 2)}\n`);

console.log(`${manifest.name} ${manifest.version}: ${Object.keys(heroes).length} champions, ${Object.keys(abilities).length} abilities; builds, loads and fits the ${ruleset.id} world format`);
console.log(`Engine: ${ENGINE} (${ENGINE_VERSION}; CI checks against ${ENGINE_TAG})`);
console.log(differences.length ? `Where this world differs from the ${ruleset.id} example world: ${differences.join('; ')}` : `The ${ruleset.id} example world's levels and campaign as they are.`);
console.log('Wrote dist/tuning-import.json');
console.log('Win rates: jrpgbattle-balance (npm run roster there).');
