import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const source = await readFile(path.join(root, 'web/src/data/projectRegistry.ts'), 'utf8')

assert.match(source, /function defaultCaseMetadata\s*\(/, 'registry must define conservative metadata defaults')
assert.match(source, /caseMetadata\[slug\]\s*\?\?\s*defaultCaseMetadata\(slug,\s*config\)/, 'registry must apply metadata defaults to every public slug')
assert.match(source, /evidenceLevel:/, 'metadata must include evidence level')
assert.match(source, /sourceKind:/, 'metadata must include source kind')
assert.match(source, /sourceEvidence:/, 'metadata must name the evidence source')
assert.match(source, /publicBoundary:/, 'metadata must include public boundary')
assert.match(source, /aiRole:/, 'metadata must include AI role')
assert.match(source, /humanGates:/, 'metadata must include human review gates')
assert.match(source, /openSourceFoundation/, 'registry must expose upstream/open-source boundaries')

console.log('PASS: project registry applies evidence, source, public-boundary, AI and human-gate metadata to every public case.')
