import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(new URL('../web/package.json', import.meta.url))
const validator = require('gltf-validator')
const bytes = readFileSync(fileURLToPath(new URL('../web/public/models/avatar.glb', import.meta.url)))
assert.equal(bytes.toString('utf8', 0, 4), 'glTF')
const doc = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)))
const names = doc.nodes.map(node => node.name)
for (const name of ['focus-start', 'focus-1', 'focus-2', 'focus-3', 'focus-4', 'focus-5', 'focus-works', 'Camera', 'eye_left | curved sclera', 'eye_right | curved sclera']) {
  assert.equal(names.filter(value => value === name).length, 1, `Required unique model node: ${name}`)
}
const clip = doc.animations.find(animation => animation.name === 'CameraAction')
assert.ok(clip, 'Authored camera animation must remain available')
assert.deepEqual(clip.channels.map(channel => channel.target.path).sort(), ['rotation', 'translation'])
const report = await validator.validateBytes(new Uint8Array(bytes), { uri: 'avatar.glb', maxIssues: 100 })
assert.equal(report.issues.numErrors, 0, JSON.stringify(report.issues))
assert.equal(report.issues.numWarnings, 0, JSON.stringify(report.issues))
console.log(`PASS: glTF validation, camera animation, seven focus anchors and two independent eyes; ${bytes.length} bytes. ${report.issues.numInfos} informational notes (focus anchors and texture dimensions).`)
