// The static API's OpenAPI description (api/v1/openapi.json): every path the
// build writes, and what each returns, by the world format's JSON Schemas
// published beside it (api/v1/schemas/, jrpg-battle decision 0053). Built
// from the same content and KINDS as the files, so it can't list a path that
// isn't there or miss one that is.

// An entry's shape in its file's schema: one hero is heroes.schema.json#/$defs/hero.
const ENTRY = { heroes: 'hero', abilities: 'ability', enemies: 'enemy', items: 'item' };

// GitHub Pages answers 404 for any file it doesn't have, so every path can.
const ok = (description, schema) => ({ 200: { description, content: { 'application/json': { schema } } }, 404: { description: 'No such file: an id that isn\'t in the kind\'s index, or a path this version doesn\'t have.' } });
// An operationId from a path: /heroes/{id}.json is getHeroesById.
const camel = (text) => text.replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase());
const operationId = (path) => `get${path.replace(/\.json$/, '').split('/').filter(Boolean).map((part) => (part === '{id}' ? 'ById' : camel(part))).join('')}`;
const ref = (path) => ({ $ref: path });

/**
 * @param {Record<string, any>} content  the built world files, by name
 * @param {{ name: string, single?: boolean }[]} kinds
 * @param {string} apiVersion
 */
export function openapi(content, kinds, apiVersion) {
  const { manifest } = content;
  const entryKinds = kinds.filter((k) => !k.single).map((k) => k.name);
  const paths = {
    '/index.json': {
      get: {
        tags: ['index'],
        summary: 'Start here: the release, its ruleset and world format, each kind\'s ids and the combined files',
        responses: ok('The index.', ref('#/components/schemas/Index')),
      },
    },
  };
  for (const kind of kinds) {
    const file = `schemas/${kind.name}.schema.json`;
    if (kind.single) {
      paths[`/${kind.name}.json`] = { get: { tags: [kind.name], summary: `world/${kind.name}.json`, responses: ok(`The ${kind.name} file.`, ref(file)) } };
      continue;
    }
    const ids = Object.keys(content[kind.name]);
    paths[`/${kind.name}/index.json`] = {
      get: { tags: [kind.name], summary: `The ${kind.name}' ids, in order`, responses: ok('Ids, in order.', { type: 'array', items: { type: 'string' } }) },
    };
    paths[`/${kind.name}/{id}.json`] = {
      get: {
        tags: [kind.name],
        summary: `One of the ${kind.name}, by id`,
        parameters: [{ name: 'id', in: 'path', required: true, description: `An id from /${kind.name}/index.json.`, schema: { type: 'string', ...(ids.length && { enum: ids }) } }],
        responses: ok(`One of the ${kind.name}.`, ref(`${file}#/$defs/${ENTRY[kind.name]}`)),
      },
    };
  }
  for (const kind of kinds) {
    paths[`/content/${kind.name}.json`] = {
      get: { tags: ['content'], summary: `The whole world/${kind.name}.json, as a deployment drops it over jrpg-battle's src/world/`, responses: ok(`world/${kind.name}.json.`, ref(`schemas/${kind.name}.schema.json`)) },
    };
  }
  for (const [path, item] of Object.entries(paths)) item.get.operationId = operationId(path);
  return {
    openapi: '3.1.0',
    info: {
      title: `${manifest.name} API`,
      version: manifest.version,
      description: [
        `The ${manifest.name} world for the jrpg-battle engine's ${content.world.ruleset} ruleset, served as static JSON: release ${manifest.version}, in its world format ${content.world.formatVersion}.`,
        '',
        `This is API ${apiVersion}: its paths and the shape of its indexes. Entries are the world's files as they are, in the world format the index names, described by the ruleset's JSON Schemas under \`schemas/\`. A new roster release or world format is not a new API version; moving or removing a path is.`,
        '',
        'Every path is a GET of a file. The data is unlicensed (all rights reserved) until the roster opens.',
      ].join('\n'),
    },
    servers: [{ url: '.', description: `API ${apiVersion}, beside this file` }],
    // Public files: no sign-in.
    security: [],
    tags: [
      { name: 'index', description: 'Where to start.' },
      ...kinds.map((k) => ({ name: k.name, description: k.single ? `world/${k.name}.json` : `world/${k.name}.json, entry by entry` })),
      { name: 'content', description: 'The combined world files, the same as a release\'s content zip.' },
    ],
    paths,
    components: {
      schemas: {
        Index: {
          type: 'object',
          additionalProperties: false,
          required: ['api', 'name', 'version', 'ruleset', 'formatVersion', ...entryKinds, 'content', 'openapi', 'schemas'],
          properties: {
            api: { const: apiVersion, description: 'This API\'s version.' },
            name: { type: 'string' },
            version: { type: 'string', description: 'The roster release served: the manifest\'s version.' },
            ruleset: { type: 'string', description: 'The jrpg-battle ruleset the world plays, as its world.json names it.' },
            formatVersion: { type: 'string', description: 'The ruleset\'s world format the entries are written in. Read it before reading entries.' },
            ...Object.fromEntries(entryKinds.map((n) => [n, { type: 'array', items: { type: 'string' }, description: `The ${n}' ids, in order.` }])),
            content: { type: 'array', items: { type: 'string' }, description: 'The paths of the combined files.' },
            openapi: { type: 'string', description: 'The path of this description.' },
            schemas: { type: 'string', description: 'The folder of the world format\'s JSON Schemas.' },
          },
        },
      },
    },
  };
}
