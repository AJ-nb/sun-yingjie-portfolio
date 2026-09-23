const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const { chromium } = createRequire(path.join(root, 'web/package.json'))('@playwright/test')
const base = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:5176'
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || '.production-runtime/v72')
fs.mkdirSync(output, { recursive: true })
const report = { base, startedAt: new Date().toISOString(), checks: [] }
const mediaPattern = '**/media/v7/hero-follow.mp4'
const mediaBody = fs.readFileSync(path.join(root, 'web/public/media/v7/hero-follow.mp4'))
const fineOptions = { viewport: { width: 743, height: 844 }, reducedMotion: 'no-preference' }
async function state(page) {
  return page.evaluate(() => ({
    width: innerWidth, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
    fine: matchMedia('(any-pointer:fine)').matches, hover: matchMedia('(any-hover:hover)').matches,
    videos: [...document.querySelectorAll('.original-video-hero video')].map(v => ({
      src: v.currentSrc || v.src, time: v.currentTime, ready: v.readyState, seeking: v.seeking,
      seekable: [...Array(v.seekable.length)].map((_, i) => [v.seekable.start(i), v.seekable.end(i)]), error: v.error?.message,
    })),
    source: document.querySelector('.original-video-hero')?.dataset.filmSource,
    storage: { motionPreference: localStorage.getItem('portfolio:motion-preference'), legacyMotionPaused: localStorage.getItem('portfolio:motion-paused') }, motionPaused: document.documentElement.classList.contains('motion-paused'),
  }))
}
async function follow(page) {
  await page.locator('.original-video-hero video').waitFor()
  await page.waitForFunction(() => document.querySelector('.original-video-hero video')?.readyState >= 2, null, { timeout: 45000 })
  const before = await state(page)
  assert.ok(before.videos[0].src.startsWith('blob:'), JSON.stringify(before))
  assert.equal(before.source, '/media/v7/hero-follow.mp4')
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
;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' })
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
  await check('system-reduce-explicit-override', { viewport: { width: 743, height: 844 }, reducedMotion: 'reduce' }, async page => {
    await page.waitForTimeout(500)
    assert.equal(await page.locator('.original-video-hero video').count(), 0)
    const initial = await state(page)
    await page.getByRole('button', { name: /开启鼠标跟随|启用鼠标跟随|Enable pointer|Enable mouse/i }).click()
    const enabled = await follow(page)
    await page.reload({ waitUntil: 'domcontentloaded' })
    const restored = await follow(page)
    const control = page.getByRole('button', { name: '静态浏览模式', exact: true })
    assert.equal(await control.isDisabled(), false)
    await control.click()
    await page.waitForFunction(() => !document.querySelector('.original-video-hero video'))
    const paused = await state(page)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.locator('.original-video-hero').waitFor()
    await page.waitForTimeout(400)
    assert.equal(await page.locator('.original-video-hero video').count(), 0)
    return { initial, enabled, restored, paused, reloaded: await state(page) }
  })
  await check('touch-explicit-play', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' }, async page => {
    await page.waitForTimeout(700)
    const initial = await state(page)
    assert.equal(initial.fine, false); assert.equal(initial.videos.length, 0)
    await page.locator('.original-video-hero').getByRole('button', { name: '播放短片', exact: true }).click()
    await page.locator('.original-video-hero video').waitFor()
    return { initial, after: await state(page) }
  })
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
    await page.getByRole('button', { name: '重新加载短片', exact: true }).waitFor()
    assert.equal(await page.locator('.original-video-hero video').count(), 0)
    await page.getByRole('button', { name: '重新加载短片', exact: true }).click()
    const poses = await follow(page)
    assert.equal(proof.requests, 2)
    assert.equal(await page.locator('.original-video-hero .video-play').getAttribute('aria-pressed'), 'false')
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
  await browser.close()
  if (report.checks.some(x => !x.pass)) process.exitCode = 1
})().catch(e => { console.error(e); process.exitCode = 1 })
