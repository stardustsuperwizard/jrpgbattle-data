// The build (scripts/build.mjs): sources one file per entry, out to the
// drop-in content files and the static API. Small made-up content in temp
// folders, so these don't move when the real content does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { API_VERSION, KINDS, build, buildContent, render } from '../scripts/build.mjs';

const manifest = { name: 'Test', version: '1.0.0', licences: { data: 'UNLICENSED', lore: 'UNLICENSED' } };
const world = { ruleset: 'jrpgbattle', formatVersion: '2026-11-17', features: { levels: { maxLevel: 25, xpLevelBase: 40, xpLevelStep: 20, xpKillerShare: 0.5 } } };
const hero = (id, abilities) => ({ id, name: id, abilities });
const ability = (id) => ({ id, name: id, type: 'basic', target: 'enemy', effects: [] });
const enemy = (id) => ({ id, name: id, skills: [] });
const ALL_FILES = KINDS.map(({ name }) => `${name}.json`).sort();

// A repository root holding content/world/ as given; returns it, removed after the test.
function sources(t, { order = ['zed', 'amy'], heroes = { zed: ['jab', 'kick'], amy: ['kick', 'aim'] }, abilities = ['aim', 'jab', 'kick'], extra = () => {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'content-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, value) => {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), typeof value === 'string' ? value : render(value));
  };
  put('content/world/manifest.json', manifest);
  put('content/world/slots.json', [{ id: 'weapon', name: 'Weapon' }]);
  put('content/world/waves.json', [['rat']]);
  put('content/world/dungeon.json', null);
  put('content/world/world.json', world);
  put('content/world/campaign.json', { startGold: 0 });
  put('content/world/modes.json', { pve: { teams: [] } });
  put('content/world/elements.json', {});
  put('content/world/enemies/index.json', ['rat']);
  put('content/world/enemies/rat.json', enemy('rat'));
  put('content/world/items/index.json', []);
  mkdirSync(join(root, 'content/world/items'), { recursive: true });
  put('content/world/heroes/index.json', order);
  for (const [id, list] of Object.entries(heroes)) put(`content/world/heroes/${id}.json`, hero(id, list));
  for (const id of abilities) put(`content/world/abilities/${id}.json`, ability(id));
  // The engine's schemas, kept here as the repository keeps them.
  cpSync(new URL('../schemas', import.meta.url), join(root, 'schemas'), { recursive: true });
  extra(put);
  return root;
}

test('every kind comes in its index order, and abilities in the order the heroes use them', (t) => {
  const { content, unused } = buildContent(sources(t));
  assert.deepEqual(Object.keys(content), KINDS.map(({ name }) => name), 'every world file, in the ruleset\'s order');
  assert.deepEqual(Object.keys(content.heroes), ['zed', 'amy']);
  assert.deepEqual(content.world, world);
  assert.deepEqual(content.campaign, { startGold: 0 });
  assert.deepEqual(Object.keys(content.abilities), ['jab', 'kick', 'aim']);
  assert.deepEqual(content.items, {});
  assert.equal(content.dungeon, null);
  assert.deepEqual(content.waves, [['rat']]);
  assert.deepEqual(unused, []);
});

test("a hero's forms use their abilities too, after its own set", (t) => {
  const root = sources(t, {
    abilities: ['aim', 'jab', 'kick', 'zap', 'bonk'],
    extra: (put) => put('content/world/heroes/zed.json', { ...hero('zed', ['jab', 'kick']), forms: { other: { name: 'Other', abilities: ['zap', 'jab'] } } }),
  });
  const { content, unused } = buildContent(root);
  assert.deepEqual(Object.keys(content.abilities), ['jab', 'kick', 'zap', 'aim', 'bonk']);
  assert.deepEqual(unused, ['bonk']);
});

test('an ability no hero uses is built after the rest, by id, and reported', (t) => {
  const { content, unused } = buildContent(sources(t, { abilities: ['aim', 'jab', 'kick', 'zap', 'bonk'] }));
  assert.deepEqual(Object.keys(content.abilities), ['jab', 'kick', 'aim', 'bonk', 'zap']);
  assert.deepEqual(unused, ['bonk', 'zap']);
});

test('sources that do not fit together are refused, every problem named', (t) => {
  const problems = (opts) => {
    try {
      buildContent(sources(t, opts));
      return '';
    } catch (err) {
      return err.message;
    }
  };
  assert.match(problems({ order: ['zed', 'amy', 'bob'] }), /content\/world\/heroes\/index\.json lists "bob", but content\/world\/heroes\/bob\.json is missing\./);
  assert.match(problems({ order: ['zed'] }), /content\/world\/heroes\/amy\.json isn't listed in content\/world\/heroes\/index\.json/);
  assert.match(problems({ order: ['zed', 'amy', 'zed'] }), /lists "zed" twice/);
  assert.match(problems({ abilities: ['jab', 'kick'] }), /content\/world\/heroes\/amy\.json uses ability "aim", but content\/world\/abilities\/aim\.json is missing\./);
  assert.match(problems({ extra: (put) => put('content/world/abilities/jab.json', ability('jabs')) }), /content\/world\/abilities\/jab\.json says id "jabs"; its file name says "jab"\./);
  assert.match(problems({ extra: (put) => put('content/world/enemies/rat.json', enemy('mouse')) }), /content\/world\/enemies\/rat\.json says id "mouse"/);
  assert.match(problems({ extra: (put) => put('content/world/heroes/notes.md', '# notes') }), /content\/world\/heroes\/notes\.md: only <id>\.json files belong/);
  assert.match(problems({ extra: (put) => put('content/world/abilities/aim.json', '{ "id": ') }), /content\/world\/abilities\/aim\.json: /);
  assert.match(problems({ extra: (put) => put('content/world/enemies/mouse.json', enemy('mouse')) }), /content\/world\/enemies\/mouse\.json isn't listed in content\/world\/enemies\/index\.json/);
  assert.match(problems({ extra: (put) => put('content/world/enemies/index.json', ['rat', 'bat']) }), /content\/world\/enemies\/index\.json lists "bat", but content\/world\/enemies\/bat\.json is missing\./);
  const several = problems({ order: ['zed', 'amy', 'bob'], abilities: ['jab', 'kick'] });
  assert.match(several, /lists "bob"/);
  assert.match(several, /uses ability "aim"/);
});

test('a missing single file or kind folder is named', (t) => {
  const root = sources(t);
  rmSync(join(root, 'content/world/world.json'));
  rmSync(join(root, 'content/world/items'), { recursive: true });
  assert.throws(() => buildContent(root), (err) => {
    assert.match(err.message, /content\/world\/world\.json is missing\./);
    assert.match(err.message, /content\/world\/items\/ is missing\./);
    return true;
  });
});

test('the build writes every drop-in world file and the static API', (t) => {
  const root = sources(t);
  const out = join(root, 'dist');
  build(out, root);
  const read = (path) => JSON.parse(readFileSync(join(out, path), 'utf8'));
  assert.deepEqual(readdirSync(join(out, 'src')), ['world'], 'only the world: the rules are the ruleset\'s');
  assert.deepEqual(readdirSync(join(out, 'src', 'world')).sort(), ALL_FILES);
  assert.deepEqual(read('src/world/manifest.json'), manifest);
  assert.deepEqual(read('src/world/world.json'), world);
  assert.deepEqual(Object.keys(read('src/world/heroes.json')), ['zed', 'amy']);
  assert.equal(API_VERSION, 'v1');
  assert.deepEqual(read('api/index.json'), { name: 'Test', docs: 'index.html', versions: { v1: { index: 'v1/index.json', openapi: 'v1/openapi.json' } } });
  assert.deepEqual(readdirSync(join(out, 'api')).sort(), ['.nojekyll', 'index.html', 'index.json', 'v1'], 'every other path is under its version');
  assert.match(readFileSync(join(out, 'api/index.html'), 'utf8'), /url: 'v1\/openapi\.json'/);
  assert.deepEqual(read('api/v1/index.json'), {
    api: 'v1', name: 'Test', version: '1.0.0', ruleset: 'jrpgbattle', formatVersion: '2026-11-17',
    heroes: ['zed', 'amy'], abilities: ['jab', 'kick', 'aim'], enemies: ['rat'], items: [],
    content: KINDS.map(({ name }) => `content/${name}.json`),
    openapi: 'openapi.json', schemas: 'schemas/',
  });
  assert.deepEqual(read('api/v1/heroes/index.json'), ['zed', 'amy']);
  assert.deepEqual(read('api/v1/heroes/amy.json'), hero('amy', ['kick', 'aim']));
  assert.deepEqual(read('api/v1/abilities/index.json'), ['jab', 'kick', 'aim']);
  assert.deepEqual(read('api/v1/world.json'), world);
  assert.deepEqual(readdirSync(join(out, 'api', 'v1', 'content')).sort(), ALL_FILES);
  assert.equal(readFileSync(join(out, 'api/v1/content/heroes.json'), 'utf8'), readFileSync(join(out, 'src/world/heroes.json'), 'utf8'));
  // The schemas go out as the ruleset wrote them, and the description lists exactly the files written, each pointing at a schema that is there.
  const schemaFiles = readdirSync(join(root, 'schemas')).sort();
  assert.deepEqual(readdirSync(join(out, 'api/v1/schemas')).sort(), schemaFiles);
  for (const name of schemaFiles) assert.equal(readFileSync(join(out, 'api/v1/schemas', name), 'utf8'), readFileSync(join(root, 'schemas', name), 'utf8'));
  const spec = read('api/v1/openapi.json');
  assert.equal(spec.openapi, '3.1.0');
  assert.equal(spec.info.version, '1.0.0');
  const written = (dir, prefix = '') => readdirSync(join(out, 'api/v1', dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? written(join(dir, e.name), `${prefix}${e.name}/`) : [`/${prefix}${e.name}`]));
  const files = written('').filter((p) => !p.startsWith('/schemas/') && p !== '/openapi.json').sort();
  const listed = Object.entries(spec.paths).flatMap(([path, op]) => {
    const id = op.get.parameters?.find((p) => p.name === 'id');
    return id ? (id.schema.enum ?? []).map((v) => path.replace('{id}', v)) : [path];
  }).sort();
  assert.deepEqual(listed, files);
  const refs = JSON.stringify(spec).match(/"\$ref":"schemas\/[^"#]+/g).map((r) => r.slice('"$ref":"schemas/'.length));
  for (const file of refs) assert.ok(schemaFiles.includes(file), file);
  assert.equal(spec.paths['/heroes/{id}.json'].get.responses[200].content['application/json'].schema.$ref, 'schemas/heroes.schema.json#/$defs/hero');
  // A second build replaces the first: a hero removed from the sources leaves no file behind.
  rmSync(join(root, 'content/world/heroes/amy.json'));
  writeFileSync(join(root, 'content/world/heroes/index.json'), render(['zed']));
  build(out, root);
  assert.deepEqual(readdirSync(join(out, 'api', 'v1', 'heroes')).sort(), ['index.json', 'zed.json']);
});

test('the build stops without the schemas, naming the command that brings them', (t) => {
  const root = sources(t);
  rmSync(join(root, 'schemas'), { recursive: true });
  mkdirSync(join(root, 'schemas'));
  assert.throws(() => build(join(root, 'dist'), root), /schemas\/ has no manifest\.schema\.json: run npm run schemas/);
});

test("the repository's own sources build into every world file", () => {
  const { content, unused } = buildContent();
  assert.deepEqual(Object.keys(content), KINDS.map(({ name }) => name));
  assert.ok(Object.keys(content.heroes).length > 0);
  assert.deepEqual(unused, [], 'every ability belongs to a champion');
  for (const hero of Object.values(content.heroes)) for (const id of hero.abilities) assert.ok(content.abilities[id]);
});
