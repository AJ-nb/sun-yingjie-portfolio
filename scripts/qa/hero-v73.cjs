const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { spawn } = require('node:child_process')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const { chromium } = createRequire(path.join(root, 'web/package.json'))('@playwright/test')
const base = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:5176'
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || '.production-runtime/v73')
fs.mkdirSync(output, { recursive: true })
const report = { base, startedAt: new Date().toISOString(), checks: [] }
const mediaPattern = '**/media/v7/hero-follow.mp4'
const mediaBody = fs.readFileSync(path.join(root, 'web/public/media/v7/hero-follow.mp4'))
const fineOptions = { viewport: { width: 743, height: 844 }, reducedMotion: 'no-preference' }
let preview
async function startPreview() {
  if (process.env.PORTFOLIO_QA_URL) return
  const vite = path.join(root, 'web/node_modules/vite/bin/vite.js')
  preview = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '5176', '--strictPort'], {
    cwd: path.join(root, 'web'), env: { ...process.env, NO_COLOR: '1' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  })
  await new Promise((resolve, reject) => {
    let logs = ''
    const timeout = setTimeout(() => finish(new Error(`Vite preview did not start within 30 seconds\n${logs}`)), 30000)
    const finish = error => {
      clearTimeout(timeout)
      preview.off('error', onError)
      preview.off('exit', onExit)
      preview.stdout.off('data', onData)
      preview.stderr.off('data', onData)
      error ? reject(error) : resolve()
    }
    const onError = error => finish(error)
    const onExit = code => finish(new Error(`Vite preview exited with code ${code}\n${logs}`))
    const onData = chunk => {
      logs += chunk.toString()
      if (logs.includes(base)) finish()
    }
    preview.once('error', onError)
    preview.once('exit', onExit)
    preview.stdout.on('data', onData)
    preview.stderr.on('data', onData)
  })
  const response = await fetch(base, { signal: AbortSignal.timeout(10000) })
  assert.equal(response.status, 200, 'Vite preview must serve the built homepage')
}
async function stopPreview() {
  if (!preview || preview.exitCode !== null || preview.signalCode !== null) return
  await new Promise(resolve => {
    preview.once('exit', resolve)
    preview.kill()
  })
}
function browserExecutable() {
  return [process.env.PLAYWRIGHT_BROWSER, chromium.executablePath(), 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(file => file && fs.existsSync(file))
}
async function state(page) {
  return page.evaluate(() => ({
    width: innerWidth, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
    fine: matchMedia('(any-pointer:fine)').matches, hover: matchMedia('(any-hover:hover)').matches,
    videos: [...document.querySelectorAll('.original-video-hero video')].map(v => ({
      src: v.currentSrc || v.src, time: v.currentTime, ready: v.readyState, seeking: v.seeking,
      paused: v.paused, autoplay: v.autoplay, controls: v.controls, seekable: [...Array(v.seekable.length)].map((_, i) => [v.seekable.start(i), v.seekable.end(i)]), error: v.error?.message,
    })),
    poster: (() => {
      const poster = document.querySelector('.original-video-hero .original-poster')
      return poster && { src: poster.currentSrc || poster.src, complete: poster.complete, naturalWidth: poster.naturalWidth }
    })(),
    transform: (() => {
      const visual = document.querySelector('.home-os-hero-interactive')
      return visual && { inline: visual.style.transform, computed: getComputedStyle(visual).transform }
    })(),
    source: document.querySelector('.original-video-hero')?.dataset.filmSource,
    storage: { motionPreference: localStorage.getItem('portfolio:motion-preference'), legacyMotionPaused: localStorage.getItem('portfolio:motion-paused') }, motionPaused: document.documentElement.classList.contains('motion-paused'),
  }))
}
function watchMediaRequests(page) {
  const proof = { mediaRequests: [] }
  page.on('request', request => { if (/\.mp4(?:[?#]|$)/.test(request.url())) proof.mediaRequests.push(request.url()) })
  return proof
}
async function staticCover(page, proof) {
  const poster = page.locator('.original-video-hero .original-poster')
  await poster.waitFor({ state: 'visible' })
  await page.waitForFunction(() => {
    const image = document.querySelector('.original-video-hero .original-poster')
    return image?.complete && image.naturalWidth > 0
  })
  const before = await state(page)
  // The correct reduced-motion/static implementation makes this decorative
  // layer non-interactive. Move the pointer in page coordinates instead of
  // requiring Playwright to hover an element that must not receive events.
  await page.mouse.move(12, 12)
  await page.mouse.move(page.viewportSize().width - 12, 420, { steps: 5 })
  await page.waitForTimeout(700)
  const after = await state(page)
  assert.ok(after.poster?.naturalWidth > 0, JSON.stringify(after))
  assert.equal(before.videos.length, 0)
  assert.equal(after.videos.length, 0)
  assert.equal(await page.locator('.original-video-hero button').count(), 0)
  assert.equal(await page.locator('.motion-toggle').count(), 0)
  assert.deepEqual(after.transform, before.transform, 'Static cover must not tilt in response to the pointer')
  if (after.reduce) assert.equal(after.transform?.computed, 'none', 'Reduced motion must disable the hero transform')
  assert.deepEqual(proof.mediaRequests, [], 'Static cover must not request any MP4 media')
  return { before, after, mediaRequests: [...proof.mediaRequests] }
}
async function follow(page) {
  await page.locator('.original-video-hero video').waitFor()
  await page.waitForFunction(() => document.querySelector('.original-video-hero video')?.readyState >= 2, null, { timeout: 45000 })
  const before = await state(page)
  assert.ok(before.videos[0].src.startsWith('blob:'), JSON.stringify(before))
  assert.equal(before.source, '/media/v7/hero-follow.mp4')
  assert.equal(before.videos[0].paused, true)
  assert.equal(before.videos[0].autoplay, false)
  assert.equal(before.videos[0].controls, false)
  assert.equal(await page.locator('.original-video-hero button').count(), 0)
  assert.equal(await page.locator('.motion-toggle').count(), 0)
  assert.ok(before.videos[0].seekable.at(-1)?.[1] > 4, JSON.stringify(before))
  const width = page.viewportSize().width, values = []
  for (const x of [.08, .5, .92, .08]) {
    await page.mouse.move(Math.round(width * x), 420, { steps: 5 })
    const expected = x <= .5 ? .75 + x * 2 * (32 / 24 - .75) : 32 / 24 + (x - .5) * 2 * (3 - 32 / 24)
    await page.waitForFunction(({ expected }) => {
      const v = document.querySelector('.original-video-hero video')
      return v && !v.seeking && Math.abs(v.currentTime - expected) < .025
    }, { expected }, { timeout: 12000 })
    values.push({ x, state: await state(page) })
  }
  assert.ok(Math.abs(values[0].state.videos[0].time - values[3].state.videos[0].time) < .06)
  return values
}
const response200 = () => ({ status: 200, headers: { 'content-type': 'video/mp4', 'content-length': String(mediaBody.length), 'cache-control': 'no-store' }, body: mediaBody })
async function runChecks(browser) {
  async function check(name, opts, fn, setup) {
    const page = await browser.newPage(opts), entry = { name }
    try {
      const prepared = setup ? await setup(page) : null
      await page.goto(base, { waitUntil: 'domcontentloaded' })
      await page.locator('.original-video-hero').waitFor()
      entry.detail = await fn(page, prepared)
      entry.pass = true
    } catch (e) {
      entry.pass = false; entry.error = e.stack || e.message
      entry.state = await state(page).catch(() => null)
      await page.screenshot({ path: path.join(output, 'regression-' + name + '.png') }).catch(() => {})
    }
    report.checks.push(entry)
    fs.writeFileSync(path.join(output, 'hero-regression.json'), JSON.stringify(report, null, 2))
    console.log(entry.pass ? 'PASS' : 'FAIL', name, entry.error || '')
    await page.close()
  }
  for (const width of [312, 390, 743, 1280]) await check('fine-' + width, { viewport: { width, height: 844 }, reducedMotion: 'no-preference' }, follow)
  await check('system-reduce-static-cover', { viewport: { width: 743, height: 844 }, reducedMotion: 'reduce' }, async (page, proof) => {
    const initial = await staticCover(page, proof)
    assert.equal(initial.after.reduce, true)
    await page.reload({ waitUntil: 'domcontentloaded' })
    return { initial, afterReload: await staticCover(page, proof) }
  }, watchMediaRequests)
  await check('legacy-settings-preserve-system-reduce', { viewport: { width: 743, height: 844 }, reducedMotion: 'reduce' }, staticCover, async page => {
    const proof = watchMediaRequests(page)
    await page.addInitScript(() => {
      localStorage.setItem('portfolio:motion-preference', 'off')
      localStorage.setItem('portfolio:motion-paused', 'true')
    })
    return proof
  })
  await check('legacy-paused-settings-do-not-block-follow', fineOptions, follow, async page => {
    await page.addInitScript(() => {
      localStorage.setItem('portfolio:motion-preference', 'off')
      localStorage.setItem('portfolio:motion-paused', 'true')
    })
  })
  await check('touch-static-cover', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' }, async (page, proof) => {
    const detail = await staticCover(page, proof)
    assert.equal(detail.after.fine, false)
    return detail
  }, watchMediaRequests)
  await check('http200-no-range', fineOptions, async (page, proof) => {
    const poses = await follow(page)
    assert.equal(proof.requests.length, 1, 'The cover must be fetched only once')
    assert.equal(proof.requests[0].range, undefined, 'Fetch must not rely on Range')
    return { ...proof, poses }
  }, async page => {
    const proof = { requests: [], responseStatus: 200, responseHasAcceptRanges: false }
    await page.route(mediaPattern, async route => { proof.requests.push({ range: route.request().headers().range }); await route.fulfill(response200()) })
    return proof
  })
  await check('fetch-failure-then-retry', fineOptions, async (page, proof) => {
    await page.getByRole('button', { name: '重试封面', exact: true }).waitFor()
    assert.equal(await page.locator('.original-video-hero video').count(), 0)
    await page.getByRole('button', { name: '重试封面', exact: true }).click()
    const poses = await follow(page)
    assert.equal(proof.requests, 2)
    assert.equal(await page.locator('.original-video-hero video').evaluate(video => video.paused), true)
    return { ...proof, poses }
  }, async page => {
    const proof = { requests: 0 }
    await page.route(mediaPattern, async route => { proof.requests++; await route.fulfill(proof.requests === 1 ? { status: 503, body: 'temporarily unavailable' } : response200()) })
    return proof
  })
  await check('loading-exit-abort-return', fineOptions, async (page, proof) => {
    await proof.firstSeen
    await page.locator('.video-follow-hint').filter({ hasText: '正在载入交互封面' }).waitFor()
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'instant' }))
    await page.waitForFunction(() => !document.querySelector('.original-video-hero')?.classList.contains('is-visible'))
    await page.waitForTimeout(250)
    proof.releaseFirst()
    await page.waitForTimeout(250)
    const offscreen = await state(page)
    assert.equal(offscreen.videos.length, 0)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    const poses = await follow(page)
    assert.equal(proof.requests, 2)
    assert.ok(proof.aborts.length >= 1, 'The initial network request should be aborted')
    return { requests: proof.requests, aborts: proof.aborts, offscreen, poses }
  }, async page => {
    let firstSeenResolve, releaseResolve
    const proof = { requests: 0, aborts: [], firstSeen: new Promise(resolve => { firstSeenResolve = resolve }), releaseFirst: () => releaseResolve() }
    const release = new Promise(resolve => { releaseResolve = resolve })
    page.on('requestfailed', req => { if (req.url().endsWith('/media/v7/hero-follow.mp4')) proof.aborts.push(req.failure()?.errorText) })
    await page.route(mediaPattern, async route => {
      proof.requests++
      if (proof.requests === 1) { firstSeenResolve(); await release }
      await route.fulfill(response200()).catch(() => {})
    })
    return proof
  })
  await check('pointer-position-before-video-ready', fineOptions, async (page, proof) => {
    await proof.firstSeen
    const width = page.viewportSize().width, pointerX = Math.round(width * .92)
    await page.mouse.move(pointerX, 420, { steps: 5 })
    const position = pointerX / width, expected = 32 / 24 + (position - .5) * 2 * (3 - 32 / 24)
    proof.release()
    await page.waitForFunction(expected => {
      const video = document.querySelector('.original-video-hero video')
      return video?.classList.contains('is-ready') && !video.seeking && Math.abs(video.currentTime - expected) < .025
    }, expected, { timeout: 15000 })
    return { expected, actual: await state(page), pointerCapturedBeforeLoad: true }
  }, async page => {
    let seen, release
    const proof = { firstSeen: new Promise(resolve => { seen = resolve }), release: () => release() }
    const ready = new Promise(resolve => { release = resolve })
    await page.route(mediaPattern, async route => { seen(); await ready; await route.fulfill(response200()) })
    return proof
  })
  await check('home-tilt-pointer-and-reset', fineOptions, async page => {
    await follow(page)
    const hero = page.locator('.home-os-hero')
    const box = await hero.boundingBox()
    assert.ok(box, 'Hero surface must have measurable bounds')
    await page.mouse.move(box.x + 12, box.y + 96, { steps: 5 })
    await page.waitForFunction(() => {
      const visual = document.querySelector('.home-os-hero-interactive')
      if (!visual) return false
      const matrix = new DOMMatrixReadOnly(getComputedStyle(visual).transform)
      return Math.abs(matrix.m13) + Math.abs(matrix.m23) > .005
    })
    const tilted = await state(page)
    await page.mouse.move(1, 1, { steps: 5 })
    await page.waitForFunction(() => {
      const visual = document.querySelector('.home-os-hero-interactive')
      if (visual?.style.transform !== 'perspective(1200px) rotateX(0deg) rotateY(0deg)') return false
      const matrix = new DOMMatrixReadOnly(getComputedStyle(visual).transform)
      return Math.abs(matrix.m13) + Math.abs(matrix.m23) < .000001
    })
    const reset = await state(page)
    assert.notEqual(tilted.transform.computed, reset.transform.computed)
    await page.evaluate(() => window.dispatchEvent(new Event('blur')))
    await page.waitForFunction(() => {
      const video = document.querySelector('.original-video-hero video')
      return video && !video.seeking && Math.abs(video.currentTime - 32 / 24) < .025
    })
    return { tilted, reset, centeredOnBlur: await state(page) }
  })
  if (report.checks.some(x => !x.pass)) process.exitCode = 1
}
;(async () => {
  let browser
  try {
    await startPreview()
    const executablePath = browserExecutable()
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) })
    await runChecks(browser)
  } finally {
    try { await browser?.close() } finally { await stopPreview() }
    report.finishedAt = new Date().toISOString()
    fs.writeFileSync(path.join(output, 'hero-regression.json'), JSON.stringify(report, null, 2))
  }
})().catch(e => { console.error(e); process.exitCode = 1 })
