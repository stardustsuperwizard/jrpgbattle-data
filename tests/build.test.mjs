// The build (scripts/build.mjs): sources one file per entry, out to the
// drop-in content files and the static API. Small made-up content in temp
// folders, so these don't move when the real content does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { KINDS, build, buildContent, render } from '../scripts/build.mjs';

const manifest = { formatVersion: '2026-11-08', name: 'Test', version: '1.0.0', licences: { data: 'UNLICENSED', lore: 'UNLICENSED' } };
const hero = (id, abilities) => ({ id, name: id, abilities });
const ability = (id) => ({ id, name: id, type: 'basic', target: 'enemy', effects: [] });
const status = (name) => ({ name, kind: 'buff', icon: '✨' });
const enemy = (id) => ({ id, name: id, skills: [] });
const ALL_FILES = KINDS.map(({ name }) => `${name}.json`).sort();

// A repository root holding content/ as given; returns it, removed after the test.
function sources(t, { order = ['zed', 'amy'], heroes = { zed: ['jab', 'kick'], amy: ['kick', 'aim'] }, abilities = ['aim', 'jab', 'kick'], extra = () => {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'content-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, value) => {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), typeof value === 'string' ? value : render(value));
  };
  put('content/manifest.json', manifest);
  put('content/rules.json', { maxSp: 5 });
  put('content/waves.json', [['rat']]);
  put('content/modes.json', { pve: { teams: [] } });
  put('content/dungeon.json', null);
  put('content/statuses/index.json', ['glow', 'calm']);
  put('content/statuses/calm.json', status('Calm'));
  put('content/statuses/glow.json', status('Glow'));
  put('content/elements/index.json', ['wind']);
  put('content/elements/wind.json', { name: 'Wind', icon: '🌬️', color: '#fff', break: { status: 'calm', duration: 1 } });
  put('content/enemies/index.json', ['rat']);
  put('content/enemies/rat.json', enemy('rat'));
  put('content/items/index.json', []);
  mkdirSync(join(root, 'content/items'), { recursive: true });
  put('content/heroes/index.json', order);
  for (const [id, list] of Object.entries(heroes)) put(`content/heroes/${id}.json`, hero(id, list));
  for (const id of abilities) put(`content/abilities/${id}.json`, ability(id));
  extra(put);
  return root;
}

test('every kind comes in its index order, and abilities in the order the heroes use them', (t) => {
  const { content, unused } = buildContent(sources(t));
  assert.deepEqual(Object.keys(content), KINDS.map(({ name }) => name), 'every content file, in the engine\'s order');
  assert.deepEqual(Object.keys(content.heroes), ['zed', 'amy']);
  assert.deepEqual(Object.keys(content.statuses), ['glow', 'calm']);
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
  assert.match(problems({ order: ['zed', 'amy', 'bob'] }), /content\/heroes\/index\.json lists "bob", but content\/heroes\/bob\.json is missing\./);
  assert.match(problems({ order: ['zed'] }), /content\/heroes\/amy\.json isn't listed in content\/heroes\/index\.json/);
  assert.match(problems({ order: ['zed', 'amy', 'zed'] }), /lists "zed" twice/);
  assert.match(problems({ abilities: ['jab', 'kick'] }), /content\/heroes\/amy\.json uses ability "aim", but content\/abilities\/aim\.json is missing\./);
  assert.match(problems({ extra: (put) => put('content/abilities/jab.json', ability('jabs')) }), /content\/abilities\/jab\.json says id "jabs"; its file name says "jab"\./);
  assert.match(problems({ extra: (put) => put('content/enemies/rat.json', enemy('mouse')) }), /content\/enemies\/rat\.json says id "mouse"/);
  assert.match(problems({ extra: (put) => put('content/heroes/notes.md', '# notes') }), /content\/heroes\/notes\.md: only <id>\.json files belong/);
  assert.match(problems({ extra: (put) => put('content/abilities/aim.json', '{ "id": ') }), /content\/abilities\/aim\.json: /);
  assert.match(problems({ extra: (put) => put('content/statuses/index.json', ['glow']) }), /content\/statuses\/calm\.json isn't listed in content\/statuses\/index\.json/);
  assert.match(problems({ extra: (put) => put('content/elements/index.json', ['wind', 'fire']) }), /content\/elements\/index\.json lists "fire", but content\/elements\/fire\.json is missing\./);
  const several = problems({ order: ['zed', 'amy', 'bob'], abilities: ['jab', 'kick'] });
  assert.match(several, /lists "bob"/);
  assert.match(several, /uses ability "aim"/);
});

test('a missing single file or kind folder is named', (t) => {
  const root = sources(t);
  rmSync(join(root, 'content/rules.json'));
  rmSync(join(root, 'content/items'), { recursive: true });
  assert.throws(() => buildContent(root), (err) => {
    assert.match(err.message, /content\/rules\.json is missing\./);
    assert.match(err.message, /content\/items\/ is missing\./);
    return true;
  });
});

test('the build writes every drop-in content file and the static API', (t) => {
  const root = sources(t);
  const out = join(root, 'dist');
  build(out, root);
  const read = (path) => JSON.parse(readFileSync(join(out, path), 'utf8'));
  assert.deepEqual(readdirSync(join(out, 'src', 'content')).sort(), ALL_FILES);
  assert.deepEqual(read('src/content/manifest.json'), manifest);
  assert.deepEqual(Object.keys(read('src/content/heroes.json')), ['zed', 'amy']);
  assert.deepEqual(read('api/index.json'), {
    name: 'Test', version: '1.0.0', formatVersion: '2026-11-08',
    statuses: ['glow', 'calm'], elements: ['wind'], heroes: ['zed', 'amy'], abilities: ['jab', 'kick', 'aim'], enemies: ['rat'], items: [],
    content: KINDS.map(({ name }) => `content/${name}.json`),
  });
  assert.deepEqual(read('api/heroes/index.json'), ['zed', 'amy']);
  assert.deepEqual(read('api/heroes/amy.json'), hero('amy', ['kick', 'aim']));
  assert.deepEqual(read('api/abilities/index.json'), ['jab', 'kick', 'aim']);
  assert.deepEqual(read('api/statuses/calm.json'), status('Calm'));
  assert.deepEqual(read('api/rules.json'), { maxSp: 5 });
  assert.deepEqual(readdirSync(join(out, 'api', 'content')).sort(), ALL_FILES);
  assert.equal(readFileSync(join(out, 'api/content/heroes.json'), 'utf8'), readFileSync(join(out, 'src/content/heroes.json'), 'utf8'));
  // A second build replaces the first: a hero removed from the sources leaves no file behind.
  rmSync(join(root, 'content/heroes/amy.json'));
  writeFileSync(join(root, 'content/heroes/index.json'), render(['zed']));
  build(out, root);
  assert.deepEqual(readdirSync(join(out, 'api', 'heroes')).sort(), ['index.json', 'zed.json']);
});

test("the repository's own sources build into every content file", () => {
  const { content, unused } = buildContent();
  assert.deepEqual(Object.keys(content), KINDS.map(({ name }) => name));
  assert.ok(Object.keys(content.heroes).length > 0);
  assert.deepEqual(unused, [], 'every ability belongs to a champion');
  for (const hero of Object.values(content.heroes)) for (const id of hero.abilities) assert.ok(content.abilities[id]);
});
