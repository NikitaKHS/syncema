import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import YAML from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';

const root = resolve(import.meta.dirname, '..');
for (const name of ['openapi.yaml', 'asyncapi.yaml']) {
  const document = YAML.parse(await readFile(resolve(root, name), 'utf8'));
  if (!document.info?.title || !document.info?.version) throw new Error(`${name}: missing info`);
}
const schema = JSON.parse(await readFile(resolve(root, 'schemas/realtime-event.schema.json'), 'utf8'));
const ajv = new Ajv2020({ strict: false });
ajv.addFormat('uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
ajv.addFormat('date-time', (value) => !Number.isNaN(Date.parse(value)));
ajv.compile(schema);
console.log('Contracts are syntactically valid.');
