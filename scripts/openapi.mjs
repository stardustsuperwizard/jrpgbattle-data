// The static API's OpenAPI description (api/v1/openapi.json): every path the
// build writes, and what each returns, by the content format's JSON Schemas
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
 * @param {Record<string, any>} content  the built setting files, by name
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
        summary: 'Start here: the release, its content format, each kind\'s ids and the combined files',
        responses: ok('The index.', ref('#/components/schemas/Index')),
      },
    },
  };
  for (const kind of kinds) {
    const file = `schemas/${kind.name}.schema.json`;
    if (kind.single) {
      paths[`/${kind.name}.json`] = { get: { tags: [kind.name], summary: `setting/${kind.name}.json`, responses: ok(`The ${kind.name} file.`, ref(file)) } };
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
      get: { tags: ['content'], summary: `The whole setting/${kind.name}.json, as a deployment drops it over jrpg-battle's`, responses: ok(`setting/${kind.name}.json.`, ref(`schemas/${kind.name}.schema.json`)) },
    };
  }
  for (const [path, item] of Object.entries(paths)) item.get.operationId = operationId(path);
  return {
    openapi: '3.1.0',
    info: {
      title: `${manifest.name} API`,
      version: manifest.version,
      description: [
        `The ${manifest.name} setting for the jrpg-battle engine, served as static JSON: release ${manifest.version}, in content format ${manifest.formatVersion}.`,
        '',
        `This is API ${apiVersion}: its paths and the shape of its indexes. Entries are the setting's files as they are, in the content format the index names, described by the engine's JSON Schemas under \`schemas/\`. A new roster release or content format is not a new API version; moving or removing a path is.`,
        '',
        'Every path is a GET of a file. The data is unlicensed (all rights reserved) until the roster opens.',
      ].join('\n'),
    },
    servers: [{ url: '.', description: `API ${apiVersion}, beside this file` }],
    // Public files: no sign-in.
    security: [],
    tags: [
      { name: 'index', description: 'Where to start.' },
      ...kinds.map((k) => ({ name: k.name, description: k.single ? `setting/${k.name}.json` : `setting/${k.name}.json, entry by entry` })),
      { name: 'content', description: 'The combined setting files, the same as a release\'s content zip.' },
    ],
    paths,
    components: {
      schemas: {
        Index: {
          type: 'object',
          additionalProperties: false,
          required: ['api', 'name', 'version', 'formatVersion', ...entryKinds, 'content', 'openapi', 'schemas'],
          properties: {
            api: { const: apiVersion, description: 'This API\'s version.' },
            name: { type: 'string' },
            version: { type: 'string', description: 'The roster release served: the manifest\'s version.' },
            formatVersion: { type: 'string', description: 'The jrpg-battle content format the entries are written in. Read it before reading entries.' },
            ...Object.fromEntries(entryKinds.map((n) => [n, { type: 'array', items: { type: 'string' }, description: `The ${n}' ids, in order.` }])),
            content: { type: 'array', items: { type: 'string' }, description: 'The paths of the combined files.' },
            openapi: { type: 'string', description: 'The path of this description.' },
            schemas: { type: 'string', description: 'The folder of the content format\'s JSON Schemas.' },
          },
        },
      },
    },
  };
}
