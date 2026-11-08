// Builds the roster from its sources, one JSON file per entry, into what a
// deployment and a client use. Plain Node, no dependencies and no engine
// checkout, so the Pages and release workflows can run it on their own.
//   node scripts/build.mjs [outDir]           (default dist/)
//
// Sources, in content/:
//   manifest.json            the roster's name, version and content format
//   heroes/index.json        the champions' ids, in roster order (the order
//                            jrpg-battle's pick screen lists them)
//   heroes/<id>.json         one champion each
//   abilities/<id>.json      one ability each
//
// Output, in outDir:
//   src/content/<name>.json  manifest, heroes and abilities as jrpg-battle's
//                            content files (its decision 0030): dropped over a
//                            jrpg-battle checkout, they replace its own
//   api/                     the static API GitHub Pages serves: the sources
//                            entry by entry, an index per kind, and the
//                            combined files under api/content/
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ID_RE = /^[a-z0-9][a-z0-9_]*$/;

// The repository's JSON layout: two-space indent and a final newline, so built files diff cleanly.
export const render = (value) => `${JSON.stringify(value, null, 2)}\n`;

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    throw new Error(`${label}: ${err.message}`);
  }
}

// Every <id>.json in a kind's folder but its index, checked against its file name.
function readEntries(dir, kind, problems) {
  const entries = {};
  for (const name of readdirSync(dir).filter((n) => n !== 'index.json').sort()) {
    const where = `content/${kind}/${name}`;
    if (!name.endsWith('.json')) {
      problems.push(`${where}: only <id>.json files belong in content/${kind}/.`);
      continue;
    }
    const id = name.slice(0, -'.json'.length);
    if (!ID_RE.test(id)) problems.push(`${where}: an id is lowercase letters, digits and "_".`);
    const entry = readJson(join(dir, name), where);
    if (entry?.id !== id) problems.push(`${where} says id ${JSON.stringify(entry?.id)}; its file name says "${id}".`);
    entries[id] = entry;
  }
  return entries;
}

/**
 * The roster as jrpg-battle's three content files, built from the sources:
 * heroes in index order, abilities in the order the heroes use them (the
 * order the combined files have always had), then any no hero uses, by id.
 * Throws, listing every problem, when the sources don't fit together; the
 * game rules themselves are jrpg-battle's to check (npm run check).
 * @param {string} [root]  the repository root
 * @returns {{ manifest: object, heroes: Record<string, object>, abilities: Record<string, object>, unused: string[] }}
 */
export function buildContent(root = ROOT) {
  const content = join(root, 'content');
  const problems = [];
  const manifest = readJson(join(content, 'manifest.json'), 'content/manifest.json');
  const heroFiles = readEntries(join(content, 'heroes'), 'heroes', problems);
  const abilityFiles = readEntries(join(content, 'abilities'), 'abilities', problems);

  const order = readJson(join(content, 'heroes', 'index.json'), 'content/heroes/index.json');
  if (!Array.isArray(order) || !order.every((id) => typeof id === 'string')) {
    throw new Error('content/heroes/index.json must be a list of hero ids, in roster order.');
  }
  const listed = new Set();
  for (const id of order) {
    if (listed.has(id)) problems.push(`content/heroes/index.json lists "${id}" twice.`);
    else if (!heroFiles[id]) problems.push(`content/heroes/index.json lists "${id}", but content/heroes/${id}.json is missing.`);
    listed.add(id);
  }
  for (const id of Object.keys(heroFiles)) {
    if (!listed.has(id)) problems.push(`content/heroes/${id}.json isn't listed in content/heroes/index.json, so it has no place in the roster.`);
  }

  const heroes = Object.fromEntries(order.filter((id) => heroFiles[id]).map((id) => [id, heroFiles[id]]));
  const used = [];
  for (const [id, hero] of Object.entries(heroes)) {
    if (!Array.isArray(hero.abilities)) {
      problems.push(`content/heroes/${id}.json needs "abilities", a list of ability ids.`);
      continue;
    }
    for (const abilityId of hero.abilities) {
      if (!abilityFiles[abilityId]) problems.push(`content/heroes/${id}.json uses ability "${abilityId}", but content/abilities/${abilityId}.json is missing.`);
      else if (!used.includes(abilityId)) used.push(abilityId);
    }
  }
  if (problems.length) throw new Error(problems.join('\n'));
  const unused = Object.keys(abilityFiles).filter((id) => !used.includes(id)).sort();
  const abilities = Object.fromEntries([...used, ...unused].map((id) => [id, abilityFiles[id]]));
  return { manifest, heroes, abilities, unused };
}

/**
 * Writes the drop-in content files and the static API under `out`, replacing
 * what a previous build left there.
 * @param {string} out
 * @param {string} [root]
 */
export function build(out, root = ROOT) {
  const { manifest, heroes, abilities, unused } = buildContent(root);
  const files = { manifest, heroes, abilities };
  for (const dir of ['src', 'api']) rmSync(join(out, dir), { recursive: true, force: true });
  const write = (path, value) => {
    mkdirSync(dirname(join(out, path)), { recursive: true });
    writeFileSync(join(out, path), typeof value === 'string' ? value : render(value));
  };

  for (const [name, value] of Object.entries(files)) write(`src/content/${name}.json`, value);

  // The API: a root index to discover the rest, then each kind entry by entry.
  write('api/index.json', {
    name: manifest.name,
    version: manifest.version,
    formatVersion: manifest.formatVersion,
    heroes: Object.keys(heroes),
    abilities: Object.keys(abilities),
    content: Object.keys(files).map((name) => `content/${name}.json`),
  });
  write('api/manifest.json', manifest);
  for (const [kind, entries] of Object.entries({ heroes, abilities })) {
    write(`api/${kind}/index.json`, Object.keys(entries));
    for (const [id, entry] of Object.entries(entries)) write(`api/${kind}/${id}.json`, entry);
  }
  for (const [name, value] of Object.entries(files)) write(`api/content/${name}.json`, value);
  // GitHub Pages runs Jekyll otherwise, which has no business with JSON.
  write('api/.nojekyll', '');
  return { heroes: Object.keys(heroes).length, abilities: Object.keys(abilities).length, unused };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = resolve(process.argv[2] ?? join(ROOT, 'dist'));
  if (!existsSync(join(ROOT, 'content'))) throw new Error('No content/ folder to build from.');
  const { heroes, abilities, unused } = build(out);
  console.log(`Built ${heroes} heroes and ${abilities} abilities into ${out}/src/content/ and ${out}/api/.`);
  if (unused.length) console.log(`No hero uses ${unused.join(', ')}; built after the rest.`);
}
