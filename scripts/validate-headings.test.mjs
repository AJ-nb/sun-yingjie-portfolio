import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('content and registry validators accept archive details with fenced prompt headings', () => {
  const content = spawnSync(process.execPath, ['scripts/validate-content.mjs'], {
    cwd: root,
    encoding: 'utf8',
  })
  assert.equal(content.status, 0, content.stderr || content.stdout)

  const registry = spawnSync(process.execPath, ['scripts/validate-project-registry.mjs'], {
    cwd: root,
    encoding: 'utf8',
  })
  assert.equal(registry.status, 0, registry.stderr || registry.stdout)
})
