// The build (scripts/build.mjs): sources one file per entry, out to the
// drop-in content files and the static API. Small made-up content in temp
// folders, so these don't move when the real content does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { API_VERSION, KINDS, build, buildContent, render } from '../scripts/build.mjs';

const manifest = { formatVersion: '2026-11-11', name: 'Test', version: '1.0.0', licences: { data: 'UNLICENSED', lore: 'UNLICENSED' } };
const hero = (id, abilities) => ({ id, name: id, abilities });
const ability = (id) => ({ id, name: id, type: 'basic', target: 'enemy', effects: [] });
const enemy = (id) => ({ id, name: id, skills: [] });
const ALL_FILES = KINDS.map(({ name }) => `${name}.json`).sort();

// A repository root holding content/setting/ as given; returns it, removed after the test.
function sources(t, { order = ['zed', 'amy'], heroes = { zed: ['jab', 'kick'], amy: ['kick', 'aim'] }, abilities = ['aim', 'jab', 'kick'], extra = () => {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'content-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, value) => {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), typeof value === 'string' ? value : render(value));
  };
  put('content/setting/manifest.json', manifest);
  put('content/setting/slots.json', [{ id: 'weapon', name: 'Weapon' }]);
  put('content/setting/waves.json', [['rat']]);
  put('content/setting/dungeon.json', null);
  put('content/setting/house-rules.json', { rules: { maxLevel: 25 } });
  put('content/setting/enemies/index.json', ['rat']);
  put('content/setting/enemies/rat.json', enemy('rat'));
  put('content/setting/items/index.json', []);
  mkdirSync(join(root, 'content/setting/items'), { recursive: true });
  put('content/setting/heroes/index.json', order);
  for (const [id, list] of Object.entries(heroes)) put(`content/setting/heroes/${id}.json`, hero(id, list));
  for (const id of abilities) put(`content/setting/abilities/${id}.json`, ability(id));
  // The engine's schemas, kept here as the repository keeps them.
  cpSync(new URL('../schemas', import.meta.url), join(root, 'schemas'), { recursive: true });
  extra(put);
  return root;
}

test('every kind comes in its index order, and abilities in the order the heroes use them', (t) => {
  const { content, unused } = buildContent(sources(t));
  assert.deepEqual(Object.keys(content), KINDS.map(({ name }) => name), 'every setting file, in the engine\'s order');
  assert.deepEqual(Object.keys(content.heroes), ['zed', 'amy']);
  assert.deepEqual(content['house-rules'], { rules: { maxLevel: 25 } });
  assert.deepEqual(Object.keys(content.abilities), ['jab', 'kick', 'aim']);
  assert.deepEqual(content.items, {});
  assert.equal(content.dungeon, null);
  assert.deepEqual(content.waves, [['rat']]);
  assert.deepEqual(unused, []);
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
  assert.match(problems({ order: ['zed', 'amy', 'bob'] }), /content\/setting\/heroes\/index\.json lists "bob", but content\/setting\/heroes\/bob\.json is missing\./);
  assert.match(problems({ order: ['zed'] }), /content\/setting\/heroes\/amy\.json isn't listed in content\/setting\/heroes\/index\.json/);
  assert.match(problems({ order: ['zed', 'amy', 'zed'] }), /lists "zed" twice/);
  assert.match(problems({ abilities: ['jab', 'kick'] }), /content\/setting\/heroes\/amy\.json uses ability "aim", but content\/setting\/abilities\/aim\.json is missing\./);
  assert.match(problems({ extra: (put) => put('content/setting/abilities/jab.json', ability('jabs')) }), /content\/setting\/abilities\/jab\.json says id "jabs"; its file name says "jab"\./);
  assert.match(problems({ extra: (put) => put('content/setting/enemies/rat.json', enemy('mouse')) }), /content\/setting\/enemies\/rat\.json says id "mouse"/);
  assert.match(problems({ extra: (put) => put('content/setting/heroes/notes.md', '# notes') }), /content\/setting\/heroes\/notes\.md: only <id>\.json files belong/);
  assert.match(problems({ extra: (put) => put('content/setting/abilities/aim.json', '{ "id": ') }), /content\/setting\/abilities\/aim\.json: /);
  assert.match(problems({ extra: (put) => put('content/setting/enemies/mouse.json', enemy('mouse')) }), /content\/setting\/enemies\/mouse\.json isn't listed in content\/setting\/enemies\/index\.json/);
  assert.match(problems({ extra: (put) => put('content/setting/enemies/index.json', ['rat', 'bat']) }), /content\/setting\/enemies\/index\.json lists "bat", but content\/setting\/enemies\/bat\.json is missing\./);
  const several = problems({ order: ['zed', 'amy', 'bob'], abilities: ['jab', 'kick'] });
  assert.match(several, /lists "bob"/);
  assert.match(several, /uses ability "aim"/);
});

test('a missing single file or kind folder is named', (t) => {
  const root = sources(t);
  rmSync(join(root, 'content/setting/house-rules.json'));
  rmSync(join(root, 'content/setting/items'), { recursive: true });
  assert.throws(() => buildContent(root), (err) => {
    assert.match(err.message, /content\/setting\/house-rules\.json is missing\./);
    assert.match(err.message, /content\/setting\/items\/ is missing\./);
    return true;
  });
});

test('the build writes every drop-in setting file and the static API', (t) => {
  const root = sources(t);
  const out = join(root, 'dist');
  build(out, root);
  const read = (path) => JSON.parse(readFileSync(join(out, path), 'utf8'));
  assert.deepEqual(readdirSync(join(out, 'src', 'content')), ['setting'], 'only the setting: the core rules are the engine\'s');
  assert.deepEqual(readdirSync(join(out, 'src', 'content', 'setting')).sort(), ALL_FILES);
  assert.deepEqual(read('src/content/setting/manifest.json'), manifest);
  assert.deepEqual(Object.keys(read('src/content/setting/heroes.json')), ['zed', 'amy']);
  assert.equal(API_VERSION, 'v1');
  assert.deepEqual(read('api/index.json'), { name: 'Test', docs: 'index.html', versions: { v1: { index: 'v1/index.json', openapi: 'v1/openapi.json' } } });
  assert.deepEqual(readdirSync(join(out, 'api')).sort(), ['.nojekyll', 'index.html', 'index.json', 'v1'], 'every other path is under its version');
  assert.match(readFileSync(join(out, 'api/index.html'), 'utf8'), /url: 'v1\/openapi\.json'/);
  assert.deepEqual(read('api/v1/index.json'), {
    api: 'v1', name: 'Test', version: '1.0.0', formatVersion: '2026-11-11',
    heroes: ['zed', 'amy'], abilities: ['jab', 'kick', 'aim'], enemies: ['rat'], items: [],
    content: KINDS.map(({ name }) => `content/${name}.json`),
    openapi: 'openapi.json', schemas: 'schemas/',
  });
  assert.deepEqual(read('api/v1/heroes/index.json'), ['zed', 'amy']);
  assert.deepEqual(read('api/v1/heroes/amy.json'), hero('amy', ['kick', 'aim']));
  assert.deepEqual(read('api/v1/abilities/index.json'), ['jab', 'kick', 'aim']);
  assert.deepEqual(read('api/v1/house-rules.json'), { rules: { maxLevel: 25 } });
  assert.deepEqual(readdirSync(join(out, 'api', 'v1', 'content')).sort(), ALL_FILES);
  assert.equal(readFileSync(join(out, 'api/v1/content/heroes.json'), 'utf8'), readFileSync(join(out, 'src/content/setting/heroes.json'), 'utf8'));
  // The schemas go out as the engine wrote them, and the description lists exactly the files written, each pointing at a schema that is there.
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
  rmSync(join(root, 'content/setting/heroes/amy.json'));
  writeFileSync(join(root, 'content/setting/heroes/index.json'), render(['zed']));
  build(out, root);
  assert.deepEqual(readdirSync(join(out, 'api', 'v1', 'heroes')).sort(), ['index.json', 'zed.json']);
});

test('the build stops without the schemas, naming the command that brings them', (t) => {
  const root = sources(t);
  rmSync(join(root, 'schemas'), { recursive: true });
  mkdirSync(join(root, 'schemas'));
  assert.throws(() => build(join(root, 'dist'), root), /schemas\/ has no manifest\.schema\.json: run npm run schemas/);
});

test("the repository's own sources build into every setting file", () => {
  const { content, unused } = buildContent();
  assert.deepEqual(Object.keys(content), KINDS.map(({ name }) => name));
  assert.ok(Object.keys(content.heroes).length > 0);
  assert.deepEqual(unused, [], 'every ability belongs to a champion');
  for (const hero of Object.values(content.heroes)) for (const id of hero.abilities) assert.ok(content.abilities[id]);
});
