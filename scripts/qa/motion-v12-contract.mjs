import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const preference = await readFile(new URL('../../web/src/ui/MotionPreference.tsx', import.meta.url), 'utf8')
const motion = await readFile(new URL('../../web/src/ui/PortfolioMotion.tsx', import.meta.url), 'utf8')

assert.match(preference, /type Preference = 'full' \| 'reduced'/, 'motion preference must expose only full/reduced modes')
assert.doesNotMatch(preference, /value === 'system'/, 'system media query must not control the effective mode')
assert.match(preference, /stored === 'system'|preference === 'system'/, 'legacy system values must be migrated to full')
assert.doesNotMatch(motion, /setReady\(true\)/, 'frame painting must not trigger React state updates')
assert.match(motion, /requestAnimationFrame\(animate\)/, 'turning figure must retain a single animation loop')

console.log('motion-v12 contract: pass')
