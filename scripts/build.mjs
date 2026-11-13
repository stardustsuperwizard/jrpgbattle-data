// Builds the content from its sources, one JSON file per entry, into what a
// deployment and a client use. Plain Node, no dependencies and no engine
// checkout, so the release workflow can run it on its own.
//   node scripts/build.mjs [outDir]           (default dist/)
//
// Sources, in content/setting/: jrpg-battle's setting files (its decision
// 0050: the world, played by the engine's own core rules), the ones keyed by
// id broken out one file per entry.
//   manifest.json, slots.json, waves.json, dungeon.json, house-rules.json
//                            single files, built as they are
//   <kind>/index.json        the ids in order, for heroes (the order the pick
//                            screen lists them), enemies and items
//   <kind>/<id>.json         one entry each; abilities have no index, and
//                            come in the order the heroes use them
//
// Output, in outDir:
//   src/content/setting/<name>.json  jrpg-battle's setting files: dropped over
//                            a jrpg-battle checkout's src/content/setting/,
//                            they replace its default world whole
//   api/                     the static API: an index naming its versions
//                            and a docs page, and under api/v1/ the sources
//                            entry by entry, an index per kind, the combined
//                            files under api/v1/content/, the content format's
//                            schemas (schemas/, the engine's) and the
//                            OpenAPI description, api/v1/openapi.json
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openapi } from './openapi.mjs';
import { SCHEMA_DIR, keptSchemas } from './schemas.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ID_RE = /^[a-z0-9][a-z0-9_]*$/;

// The setting files in the order jrpg-battle lists them (CONTENT_LAYOUT.setting),
// and how each is kept here: `single` as one file; otherwise one file per
// entry, `id` when an entry names its own id, `order` from the kind's
// index.json or, for abilities, from the heroes that use them.
export const KINDS = [
  { name: 'manifest', single: true },
  { name: 'heroes', order: 'index', id: true },
  { name: 'abilities', order: 'use', id: true },
  { name: 'enemies', order: 'index', id: true },
  { name: 'items', order: 'index', id: true },
  { name: 'slots', single: true },
  { name: 'waves', single: true },
  { name: 'dungeon', single: true },
  { name: 'house-rules', single: true },
];

/**
 * The static API's version: its paths and the shape of its indexes. Entries
 * are the sources as they are, in the content format the index names
 * (`formatVersion`), so a new roster or content format is not a new version;
 * moving, renaming or removing a path, or changing an index's shape, is.
 */
export const API_VERSION = 'v1';

/** Where the sources live, under the repository root. */
export const SOURCE_DIR = 'content/setting';

// The repository's JSON layout: two-space indent and a final newline, so built files diff cleanly.
export const render = (value) => `${JSON.stringify(value, null, 2)}\n`;

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    throw new Error(`${label}: ${err.message}`);
  }
}

// Every <id>.json in a kind's folder but its index; an entry that names its id must name its file's.
function readEntries(dir, kind, problems) {
  const entries = {};
  for (const name of readdirSync(dir).filter((n) => n !== 'index.json').sort()) {
    const where = `${SOURCE_DIR}/${kind.name}/${name}`;
    if (!name.endsWith('.json')) {
      problems.push(`${where}: only <id>.json files belong in ${SOURCE_DIR}/${kind.name}/.`);
      continue;
    }
    const id = name.slice(0, -'.json'.length);
    if (!ID_RE.test(id)) problems.push(`${where}: an id is lowercase letters, digits and "_".`);
    const entry = readJson(join(dir, name), where);
    if (kind.id && entry?.id !== id) problems.push(`${where} says id ${JSON.stringify(entry?.id)}; its file name says "${id}".`);
    entries[id] = entry;
  }
  return entries;
}

// A kind's entries in its index's order, every file listed once and every listed id a file.
function indexed(content, kind, files, problems) {
  const where = `${SOURCE_DIR}/${kind.name}/index.json`;
  if (!existsSync(join(content, kind.name, 'index.json'))) {
    problems.push(`${where} is missing; it lists the ${kind.name} in order.`);
    return {};
  }
  const order = readJson(join(content, kind.name, 'index.json'), where);
  if (!Array.isArray(order) || !order.every((id) => typeof id === 'string')) {
    problems.push(`${where} must be a list of ids, in order.`);
    return {};
  }
  const listed = new Set();
  for (const id of order) {
    if (listed.has(id)) problems.push(`${where} lists "${id}" twice.`);
    else if (!files[id]) problems.push(`${where} lists "${id}", but ${SOURCE_DIR}/${kind.name}/${id}.json is missing.`);
    listed.add(id);
  }
  for (const id of Object.keys(files)) {
    if (!listed.has(id)) problems.push(`${SOURCE_DIR}/${kind.name}/${id}.json isn't listed in ${where}, so it has no place in the order.`);
  }
  return Object.fromEntries(order.filter((id) => files[id]).map((id) => [id, files[id]]));
}

/**
 * Every setting file, built from the sources: single files as they are,
 * indexed kinds in index order, abilities in the order the heroes use them,
 * each hero's own set before its forms'
 * (then any no hero uses, by id). Throws, listing every problem, when the
 * sources don't fit together; the game rules themselves are jrpg-battle's to
 * check (npm run check).
 * @param {string} [root]  the repository root
 * @returns {{ content: Record<string, unknown>, unused: string[] }}
 */
export function buildContent(root = ROOT) {
  const dir = join(root, SOURCE_DIR);
  const problems = [];
  const content = {};
  const abilityFiles = {};
  for (const kind of KINDS) {
    if (kind.single) {
      const path = join(dir, `${kind.name}.json`);
      if (!existsSync(path)) problems.push(`${SOURCE_DIR}/${kind.name}.json is missing.`);
      else content[kind.name] = readJson(path, `${SOURCE_DIR}/${kind.name}.json`);
      continue;
    }
    if (!existsSync(join(dir, kind.name))) {
      problems.push(`${SOURCE_DIR}/${kind.name}/ is missing.`);
      continue;
    }
    const files = readEntries(join(dir, kind.name), kind, problems);
    if (kind.order === 'index') content[kind.name] = indexed(dir, kind, files, problems);
    else Object.assign(abilityFiles, files);
  }

  const used = [];
  for (const [id, hero] of Object.entries(content.heroes ?? {})) {
    if (!Array.isArray(hero.abilities)) {
      problems.push(`${SOURCE_DIR}/heroes/${id}.json needs "abilities", a list of ability ids.`);
      continue;
    }
    // Its own set, then each of its forms' (jrpg-battle decision 0061).
    const forms = Object.values(hero.forms ?? {}).map((form) => (Array.isArray(form?.abilities) ? form.abilities : []));
    for (const abilityId of [hero.abilities, ...forms].flat()) {
      if (!abilityFiles[abilityId]) problems.push(`${SOURCE_DIR}/heroes/${id}.json uses ability "${abilityId}", but ${SOURCE_DIR}/abilities/${abilityId}.json is missing.`);
      else if (!used.includes(abilityId)) used.push(abilityId);
    }
  }
  if (problems.length) throw new Error(problems.join('\n'));
  const unused = Object.keys(abilityFiles).filter((id) => !used.includes(id)).sort();
  content.abilities = Object.fromEntries([...used, ...unused].map((id) => [id, abilityFiles[id]]));
  // In KINDS order, as the engine lists its setting files.
  return { content: Object.fromEntries(KINDS.map(({ name }) => [name, content[name]])), unused };
}

/**
 * Writes the drop-in setting files and the static API under `out`, replacing
 * what a previous build left there.
 * @param {string} out
 * @param {string} [root]
 */
export function build(out, root = ROOT) {
  const { content, unused } = buildContent(root);
  const { manifest } = /** @type {any} */ (content);
  for (const dir of ['src', 'api']) rmSync(join(out, dir), { recursive: true, force: true });
  const write = (path, value) => {
    mkdirSync(dirname(join(out, path)), { recursive: true });
    writeFileSync(join(out, path), typeof value === 'string' ? value : render(value));
  };

  for (const [name, value] of Object.entries(content)) write(`src/content/setting/${name}.json`, value);

  // The API: a root index naming the versions, then the version's index to
  // discover the rest, and each kind entry by entry.
  const v = `api/${API_VERSION}`;
  write('api/index.json', {
    name: manifest.name,
    docs: 'index.html',
    versions: { [API_VERSION]: { index: `${API_VERSION}/index.json`, openapi: `${API_VERSION}/openapi.json` } },
  });
  write('api/index.html', docsPage(manifest.name, `${API_VERSION}/openapi.json`));
  const entryKinds = KINDS.filter((kind) => !kind.single).map((kind) => kind.name);
  write(`${v}/index.json`, {
    api: API_VERSION,
    name: manifest.name,
    version: manifest.version,
    formatVersion: manifest.formatVersion,
    ...Object.fromEntries(entryKinds.map((name) => [name, Object.keys(content[name])])),
    content: Object.keys(content).map((name) => `content/${name}.json`),
    openapi: 'openapi.json',
    schemas: 'schemas/',
  });
  for (const kind of KINDS) {
    if (kind.single) {
      write(`${v}/${kind.name}.json`, content[kind.name]);
      continue;
    }
    const entries = /** @type {Record<string, unknown>} */ (content[kind.name]);
    write(`${v}/${kind.name}/index.json`, Object.keys(entries));
    for (const [id, entry] of Object.entries(entries)) write(`${v}/${kind.name}/${id}.json`, entry);
  }
  for (const [name, value] of Object.entries(content)) write(`${v}/content/${name}.json`, value);
  // The content format's schemas, as the engine wrote them, and the description that refers to them.
  const schemas = keptSchemas(root);
  for (const kind of KINDS) if (!schemas[`${kind.name}.schema.json`]) throw new Error(`${SCHEMA_DIR}/ has no ${kind.name}.schema.json: run npm run schemas with the pinned jrpg-battle.`);
  for (const [name, text] of Object.entries(schemas)) write(`${v}/schemas/${name}`, text);
  write(`${v}/openapi.json`, openapi(content, KINDS, API_VERSION));
  // GitHub Pages runs Jekyll otherwise, which has no business with JSON.
  write('api/.nojekyll', '');
  const counts = Object.fromEntries(entryKinds.map((name) => [name, Object.keys(content[name]).length]));
  return { counts, unused };
}

// The API's front page: the OpenAPI description, browsable, with Swagger UI
// from a CDN at a fixed version. It reads only this API's own files.
const SWAGGER_UI = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14';
const escape = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export function docsPage(name, spec) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(name)} API</title>
<link rel="stylesheet" href="${SWAGGER_UI}/swagger-ui.css">
<style>body { margin: 0; background: #fafafa; }</style>
</head>
<body>
<noscript><p>The API's description is <a href="${spec}">${spec}</a>; its index is <a href="index.json">index.json</a>.</p></noscript>
<div id="docs"></div>
<script src="${SWAGGER_UI}/swagger-ui-bundle.js" crossorigin="anonymous"></script>
<script>SwaggerUIBundle({ url: '${spec}', dom_id: '#docs', deepLinking: true });</script>
</body>
</html>
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = resolve(process.argv[2] ?? join(ROOT, 'dist'));
  const { counts, unused } = build(out);
  console.log(`Built ${Object.entries(counts).map(([name, n]) => `${n} ${name}`).join(', ')} into ${out}/src/content/setting/ and ${out}/api/.`);
  if (unused.length) console.log(`No hero uses ${unused.join(', ')}; built after the rest.`);
}
