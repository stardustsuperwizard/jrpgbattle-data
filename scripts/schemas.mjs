// Copies the content format's JSON Schemas from a jrpg-battle checkout into
// schemas/, which the build publishes with the API (api/v1/schemas/) and its
// OpenAPI description refers to. The schemas are the engine's (its decision
// 0053); they are kept here so the build needs no engine, and `npm run check`
// fails when they differ from the release engine.json names.
//   JRPG_BATTLE=/path/to/jrpg-battle node scripts/schemas.mjs
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SCHEMA_DIR = 'schemas';

/** The engine's schema files, by name: docs/content-format/*.schema.json in a checkout. */
export function engineSchemas(engine) {
  const dir = join(engine, 'docs', 'content-format');
  return Object.fromEntries(readdirSync(dir).filter((n) => n.endsWith('.schema.json')).sort().map((n) => [n, readFileSync(join(dir, n), 'utf8')]));
}

/** The schema files kept here, by name. */
export function keptSchemas(root = ROOT) {
  const dir = join(root, SCHEMA_DIR);
  return Object.fromEntries(readdirSync(dir).filter((n) => n.endsWith('.schema.json')).sort().map((n) => [n, readFileSync(join(dir, n), 'utf8')]));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const engine = resolve(process.env.JRPG_BATTLE ?? join(ROOT, '..', 'jrpg-battle'));
  const { version } = JSON.parse(readFileSync(join(engine, 'package.json'), 'utf8'));
  const { tag } = JSON.parse(readFileSync(join(ROOT, 'engine.json'), 'utf8'));
  if (`v${version}` !== tag) console.warn(`The checkout is jrpg-battle ${version}, but engine.json pins ${tag}: copy from the pinned release.`);
  rmSync(join(ROOT, SCHEMA_DIR), { recursive: true, force: true });
  mkdirSync(join(ROOT, SCHEMA_DIR));
  const names = Object.keys(engineSchemas(engine));
  for (const name of names) copyFileSync(join(engine, 'docs', 'content-format', name), join(ROOT, SCHEMA_DIR, name));
  console.log(`Copied ${names.length} schemas from jrpg-battle ${version} into ${SCHEMA_DIR}/.`);
}
