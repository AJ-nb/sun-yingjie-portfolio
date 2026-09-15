import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from '../web/node_modules/typescript/lib/typescript.js'
const source = await readFile(new URL('../web/src/scene/scrollTimeline.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } })
const { scrollFrame, dwell } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const tops = [900, 1500, 2100, 2700, 3300]
const input = { height: 800, width: 1440, tops, galleryTop: Infinity, totalFrames: 350 }
assert.equal(scrollFrame({ ...input, scroll: 0 }), 0)
for (const [i, top] of tops.entries()) {
  const lock = top - input.height * .3
  assert.equal(scrollFrame({ ...input, scroll: lock }), (i + 1) * 50)
  assert.equal(scrollFrame({ ...input, scroll: lock + 80 }), (i + 1) * 50, 'Each node has a readable dwell window')
}
const forward = Array.from({ length: 401 }, (_, i) => scrollFrame({ ...input, scroll: i * 10 }))
assert(forward.every((frame, i) => i === 0 || frame >= forward[i - 1]), 'Forward scroll must not reverse the camera')
const reversed = Array.from({ length: 401 }, (_, i) => scrollFrame({ ...input, scroll: (400 - i) * 10 }))
assert.deepEqual(reversed, [...forward].reverse(), 'Fast reverse scroll uses the same coordinates')
assert.equal(scrollFrame({ ...input, scroll: 3500, galleryTop: 800 }), 250)
assert.equal(scrollFrame({ ...input, scroll: 3500, galleryTop: 400 }), 275)
assert.equal(scrollFrame({ ...input, scroll: 3500, galleryTop: 0 }), 300)
assert.equal(scrollFrame({ ...input, scroll: 3500, galleryTop: -1440 }), 350)
assert.equal(scrollFrame({ ...input, scroll: 3500, galleryTop: -9999 }), 350)
for (const height of [667, 844, 1080]) for (const [i, top] of tops.entries()) assert.equal(scrollFrame({ ...input, height, scroll: top - height * .3 }), (i + 1) * 50, 'Resize must keep node-to-frame mapping')
assert.equal(dwell(.2), 0); assert.equal(dwell(.8), 1); assert.equal(dwell(.5), .5)
console.log('PASS: 5 node stops, dwell, monotonicity, exact reverse mapping, works entrance/tail, 3 viewport heights.')
