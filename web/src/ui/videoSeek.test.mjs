import test from 'node:test'
import assert from 'node:assert/strict'
import { createSeekController, HERO_POSES, heroPoseTime } from './videoSeek.ts'

class Decoder extends EventTarget {
  duration = 7
  seeking = false
  seeks = []
  time = 0
  get currentTime() { return this.time }
  set currentTime(time) {
    assert.equal(this.seeking, false, 'do not issue a second seek while the decoder is busy')
    this.seeks.push(time)
    this.time = time
    this.seeking = true
  }
  finish() { this.seeking = false; this.dispatchEvent(new Event('seeked')) }
}
test('cover pointer coordinates map to calibrated left, front and right frames', () => {
  assert.equal(heroPoseTime(0), 18 / 24)
  assert.equal(heroPoseTime(.5), 32 / 24)
  assert.equal(heroPoseTime(1), 72 / 24)
  assert.equal(heroPoseTime(-10), HERO_POSES.left)
  assert.equal(heroPoseTime(10), HERO_POSES.right)
  assert.equal(heroPoseTime(NaN), HERO_POSES.center)
  const times = Array.from({ length: 101 }, (_, index) => heroPoseTime(index / 100))
  assert.ok(times.every((time, index) => index === 0 || time > times[index - 1]))
})
test('different pointer paths return to the same pose and reverse while decoding', () => {
  const media = new Decoder(), controller = createSeekController(media)
  for (const x of [0, 1, .5, .1, .9, .5]) controller.seek(heroPoseTime(x))
  assert.equal(media.seeks.length, 1)
  media.finish()
  assert.equal(media.currentTime, HERO_POSES.center)
  media.finish()
  for (const x of [.75, 1, 0, .5]) { controller.seek(heroPoseTime(x)); media.finish() }
  assert.equal(media.currentTime, HERO_POSES.center)
  controller.dispose()
})
test('rapid pointer reversals retain the newest target and serialize decoder work', () => {
  const media = new Decoder(), controller = createSeekController(media)
  controller.seek(5)
  controller.seek(6)
  controller.seek(2)
  assert.deepEqual(media.seeks, [5])
  media.finish()
  assert.deepEqual(media.seeks, [5, 2])
  media.finish()
  controller.dispose()
})
test('endpoints stay within decodable frames and subframe noise is ignored', () => {
  const media = new Decoder(), controller = createSeekController(media)
  controller.seek(99)
  assert.equal(media.currentTime, 7 - 1 / 24)
  media.finish()
  controller.seek(-99)
  assert.equal(media.currentTime, 0)
  media.finish()
  controller.seek(1 / 100)
  assert.equal(media.seeks.length, 2)
  controller.dispose()
})
test('late metadata applies the pending target; disposal discards pending work', () => {
  const media = new Decoder()
  media.duration = NaN
  const controller = createSeekController(media)
  controller.seek(3)
  assert.equal(media.seeks.length, 0)
  media.duration = 7
  media.dispatchEvent(new Event('loadedmetadata'))
  assert.deepEqual(media.seeks, [3])
  controller.seek(5)
  controller.dispose()
  media.finish()
  assert.deepEqual(media.seeks, [3])
})
