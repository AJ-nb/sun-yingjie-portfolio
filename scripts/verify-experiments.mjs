import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { experiments, initialReview, initialTasks, resumeSamples, reviewReducer, taskReducer } from '../web/src/data/experiments.ts'

// A failed batch must preserve successful result objects and attempts on recovery.
const queued = initialTasks()
const partial = taskReducer(queued, 'run')
assert.deepEqual(partial.map(task => task.status), ['success', 'success', 'failed'])
const recovered = taskReducer(partial, 'retry')
assert.equal(recovered[0], partial[0])
assert.equal(recovered[1], partial[1])
assert.deepEqual(recovered.map(task => task.attempts), [1, 1, 2])
assert.ok(recovered.every(task => task.status === 'success'))
assert.equal(taskReducer(recovered, 'run'), recovered, 'Starting again cannot overwrite an existing batch')
assert.deepEqual(taskReducer(recovered, 'retry'), recovered, 'Recovery is inert once all positions are complete')
assert.deepEqual(taskReducer(recovered, 'reset'), queued)
assert.deepEqual(queued, initialTasks(), 'Transitions must not mutate the initial fixture')

// Review decisions are local, explicit and reversible in reverse decision order.
const pending = initialReview()
const accepted = reviewReducer(pending, { type: 'accept', index: 1 })
const rejected = reviewReducer(accepted, { type: 'reject', index: 0 })
assert.deepEqual(rejected.choices, ['rejected', 'accepted', 'pending'])
assert.deepEqual(reviewReducer(rejected, { type: 'undo' }).choices, accepted.choices)
assert.deepEqual(reviewReducer(reviewReducer(rejected, { type: 'undo' }), { type: 'undo' }), pending)
assert.equal(reviewReducer(pending, { type: 'undo' }), pending, 'Undo with no history is inert')
assert.equal(reviewReducer(accepted, { type: 'reject', index: 1 }), accepted, 'Decided suggestions require undo before changing')
assert.equal(reviewReducer(pending, { type: 'accept', index: 99 }), pending, 'Out-of-range decisions are ignored')
assert.deepEqual(reviewReducer(rejected, { type: 'reset' }), pending)
assert.deepEqual(pending, initialReview(), 'Review transitions must not mutate prior states')
assert.equal(resumeSamples.length, pending.choices.length)

// All published experiment references must resolve to existing local project assets.
const slugs = ['hermes', 'lighting', 'plumber', 'huhu-care', 'biyuan', 'periastra', 'lensflow', 'resume-formatter']
assert.deepEqual(Object.keys(experiments).sort(), slugs.sort())
let assetReferences = 0
for (const [slug, experiment] of Object.entries(experiments)) {
  assert.ok(experiment.views.length)
  assert.ok(experiment.boundary.zh && experiment.boundary.en)
  for (const view of experiment.views) {
    assert.ok(view.image.startsWith('/works/'), `${slug}: source must be a local project asset`)
    assert.ok(existsSync(fileURLToPath(new URL(`../web/public${view.image}`, import.meta.url))), `${slug}: missing ${view.image}`)
    for (const language of ['zh', 'en']) assert.ok(view.title[language] && view.body[language] && view.caption[language])
    assetReferences++
  }
}
console.log(`PASS: recovery preservation, review undo/reject, reset invariants; ${slugs.length} bilingual experiments and ${assetReferences} local asset references.`)
