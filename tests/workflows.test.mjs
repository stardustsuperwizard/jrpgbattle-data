// The workflows read repository files by path; a file that moves (as the
// manifest did into content/setting/ on 2026-11-09) breaks a release without
// failing any pull request, since the release workflow only runs on a tag.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dir = join(root, '.github', 'workflows');

test('every file a workflow requires exists', () => {
  const missing = [];
  for (const name of readdirSync(dir)) {
    const text = readFileSync(join(dir, name), 'utf8');
    for (const [, path] of text.matchAll(/require\('\.\/([^']+)'\)/g)) {
      if (!existsSync(join(root, path))) missing.push(`${name}: ${path}`);
    }
  }
  assert.deepEqual(missing, []);
});
