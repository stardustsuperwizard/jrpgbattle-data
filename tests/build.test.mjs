// The build (scripts/build.mjs): sources one file per entry, out to the
// drop-in content files and the static API. Small made-up rosters in temp
// folders, so these don't move when the real champions do.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build, buildContent, render } from '../scripts/build.mjs';

const manifest = { formatVersion: '2026-11-08', name: 'Test', version: '1.0.0', licences: { data: 'UNLICENSED', lore: 'UNLICENSED' } };
const hero = (id, abilities) => ({ id, name: id, abilities });
const ability = (id) => ({ id, name: id, type: 'basic', target: 'enemy', effects: [] });

// A repository root holding content/ as given; returns it, removed after the test.
function roster(t, { order = ['zed', 'amy'], heroes = { zed: ['jab', 'kick'], amy: ['kick', 'aim'] }, abilities = ['aim', 'jab', 'kick'], extra = () => {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'roster-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, value) => {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), typeof value === 'string' ? value : render(value));
  };
  put('content/manifest.json', manifest);
  put('content/heroes/index.json', order);
  for (const [id, list] of Object.entries(heroes)) put(`content/heroes/${id}.json`, hero(id, list));
  for (const id of abilities) put(`content/abilities/${id}.json`, ability(id));
  extra(put);
  return root;
}

test('heroes come in index order and abilities in the order the heroes use them', (t) => {
  const { heroes, abilities, unused } = buildContent(roster(t));
  assert.deepEqual(Object.keys(heroes), ['zed', 'amy']);
  assert.deepEqual(Object.keys(abilities), ['jab', 'kick', 'aim']);
  assert.deepEqual(unused, []);
});

test('an ability no hero uses is built after the rest, by id, and reported', (t) => {
  const { abilities, unused } = buildContent(roster(t, { abilities: ['aim', 'jab', 'kick', 'zap', 'bonk'] }));
  assert.deepEqual(Object.keys(abilities), ['jab', 'kick', 'aim', 'bonk', 'zap']);
  assert.deepEqual(unused, ['bonk', 'zap']);
});

test('sources that do not fit together are refused, every problem named', (t) => {
  const problems = (opts) => {
    try {
      buildContent(roster(t, opts));
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
  assert.match(problems({ extra: (put) => put('content/heroes/notes.md', '# notes') }), /content\/heroes\/notes\.md: only <id>\.json files belong/);
  assert.match(problems({ extra: (put) => put('content/abilities/aim.json', '{ "id": ') }), /content\/abilities\/aim\.json: /);
  const several = problems({ order: ['zed', 'amy', 'bob'], abilities: ['jab', 'kick'] });
  assert.match(several, /lists "bob"/);
  assert.match(several, /uses ability "aim"/);
});

test('the build writes the drop-in content files and the static API', (t) => {
  const root = roster(t);
  const out = join(root, 'dist');
  build(out, root);
  const read = (path) => JSON.parse(readFileSync(join(out, path), 'utf8'));
  assert.deepEqual(readdirSync(join(out, 'src', 'content')).sort(), ['abilities.json', 'heroes.json', 'manifest.json']);
  assert.deepEqual(read('src/content/manifest.json'), manifest);
  assert.deepEqual(Object.keys(read('src/content/heroes.json')), ['zed', 'amy']);
  assert.deepEqual(read('api/index.json'), {
    name: 'Test', version: '1.0.0', formatVersion: '2026-11-08',
    heroes: ['zed', 'amy'], abilities: ['jab', 'kick', 'aim'],
    content: ['content/manifest.json', 'content/heroes.json', 'content/abilities.json'],
  });
  assert.deepEqual(read('api/heroes/index.json'), ['zed', 'amy']);
  assert.deepEqual(read('api/heroes/amy.json'), hero('amy', ['kick', 'aim']));
  assert.deepEqual(read('api/abilities/index.json'), ['jab', 'kick', 'aim']);
  assert.equal(readFileSync(join(out, 'api/content/heroes.json'), 'utf8'), readFileSync(join(out, 'src/content/heroes.json'), 'utf8'));
  // A second build replaces the first: a hero removed from the sources leaves no file behind.
  rmSync(join(root, 'content/heroes/amy.json'));
  writeFileSync(join(root, 'content/heroes/index.json'), render(['zed']));
  build(out, root);
  assert.deepEqual(readdirSync(join(out, 'api', 'heroes')).sort(), ['index.json', 'zed.json']);
});

test("the repository's own sources build", () => {
  const { heroes, abilities, unused } = buildContent();
  assert.ok(Object.keys(heroes).length > 0);
  assert.deepEqual(unused, [], 'every ability belongs to a champion');
  for (const hero of Object.values(heroes)) for (const id of hero.abilities) assert.ok(abilities[id]);
});
