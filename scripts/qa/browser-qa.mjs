import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.SYJ_QA_PLAYWRIGHT || 'C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const base = process.env.SYJ_QA_URL || 'http://127.0.0.1:4173/'
const screenshots = path.join(root, 'design/qa-r2')
await mkdir(screenshots, { recursive: true })
const index = await readFile(path.join(root, 'web/dist/index.html'))
const report = { timestamp: new Date().toISOString(), base, buildIndexSha256: createHash('sha256').update(index).digest('hex'), engine: 'Chrome headless, isolated temporary profile; software WebGL permitted', checks: [], errors: [], measurements: {} }
const browser = await chromium.launch({ executablePath: process.env.SYJ_QA_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] })
report.browserVersion = browser.version()
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', acceptDownloads: true })
const page = await context.newPage()
page.setDefaultTimeout(15000)
page.on('pageerror', error => report.errors.push({ type: 'pageerror', text: error.message, url: page.url() }))
page.on('console', message => { if (message.type() === 'error') report.errors.push({ type: 'console', text: message.text(), url: page.url(), source: message.location() }) })
const screenshot = name => page.screenshot({ path: path.join(screenshots, name), animations: 'disabled' })
async function check(name, run) {
  const start = Date.now()
  try { const detail = await run(); report.checks.push({ name, passed: true, milliseconds: Date.now() - start, detail }); console.log(`PASS ${name}`) }
  catch (error) { report.checks.push({ name, passed: false, milliseconds: Date.now() - start, error: error.stack }); console.log(`FAIL ${name}: ${error.message}`); await screenshot(`failure-${report.checks.length}.png`).catch(() => {}) }
  await writeFile(path.join(screenshots, 'browser-results.json'), JSON.stringify(report, null, 2))
}
const count = () => page.locator('.catalog-grid .work-card').count()
async function home(lang = 'zh') {
  await page.goto(`${base}${lang === 'en' ? '?lang=en' : ''}#works`)
  await page.getByRole('searchbox').fill('')
  await page.getByRole('button', { name: lang === 'en' ? 'All work' : '全部作品', exact: true }).click()
  await page.locator('.catalog-grid .work-card').first().waitFor()
}
async function detail(slug, lang = 'zh') { await page.goto(`${base}${lang === 'en' ? '?lang=en' : ''}#/work/${slug}`); await page.locator('.case-header h1').waitFor() }
const slugs = (await readdir(path.join(root, 'web/src/content/works'))).filter(name => name.endsWith('.zh.md')).map(name => name.replace('.zh.md', ''))
const sourceCategories = {}
for (const slug of slugs) { const raw = await readFile(path.join(root, `web/src/content/works/${slug}.zh.md`), 'utf8'); const category = /^category:\s*"?([^"\n\r]+)"?/m.exec(raw)[1]; sourceCategories[category] = (sourceCategories[category] || 0) + 1 }
async function decodeImages(selector) {
  return page.locator(selector).evaluateAll(async images => {
    const sources = [...new Set(images.map(image => image.currentSrc || image.src))]
    const results = await Promise.all(sources.map(async src => { const image = new Image(); image.src = src; try { await image.decode(); return { src, width: image.naturalWidth, height: image.naturalHeight } } catch { return { src, error: 'decode failed' } } }))
    return results
  })
}
async function noOverflow(label) {
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))
  assert(dimensions.document <= dimensions.viewport + 1, `${label}: ${JSON.stringify(dimensions)}`)
  return dimensions
}

try {
  await check('All catalog cards and every thumbnail decode', async () => {
    await home(); assert.equal(await count(), slugs.length)
    const images = await decodeImages('.catalog-grid img'); assert.equal(images.length, slugs.length); assert(images.every(image => image.width > 0), JSON.stringify(images.filter(image => image.error)))
    return { cards: slugs.length, uniqueDecodedThumbnails: images.length }
  })
  await check('All categories match source counts; normalized query; empty-state reset', async () => {
    await home()
    const labels = { commercial: '商业空间', product: '工业与产品', brand: '品牌视觉', digital: '数字产品', experiments: '创作实验' }
    const counts = {}
    for (const [category, label] of Object.entries(labels)) { await page.getByRole('button', { name: label, exact: true }).click(); assert.equal(await count(), sourceCategories[category]); counts[category] = await count() }
    await page.getByRole('button', { name: '全部作品', exact: true }).click()
    const search = page.getByRole('searchbox'); await search.fill('  ＬＥＮＳＦＬＯＷ  '); assert.equal(await count(), 1); assert.equal(await page.locator('.catalog-grid .work-card').getAttribute('href'), '#/work/lensflow')
    await search.fill('no-such-project-938247'); await page.locator('.empty-state').waitFor(); assert.equal(await count(), 0)
    await page.getByRole('button', { name: '清除筛选', exact: true }).click(); assert.equal(await count(), slugs.length); assert.equal(await search.inputValue(), '')
    await screenshot('catalog-390.png'); return counts
  })
  await check('All deep routes load and every case image decodes', async () => {
    let imageReferences = 0; const unique = new Set()
    for (const slug of slugs) {
      await detail(slug); assert((await page.locator('.case-header h1').innerText()).trim()); assert.equal(await page.locator('.case-body h2').count(), 6)
      const images = await decodeImages('.case-page img'); assert(images.every(image => image.width > 0), `${slug}: ${JSON.stringify(images.filter(image => image.error))}`)
      imageReferences += images.length; images.forEach(image => unique.add(image.src))
    }
    return { routes: slugs.length, decodedCaseReferences: imageReferences, uniqueDecodedImages: unique.size }
  })
  await check('Malformed and missing case routes show the fallback and recover', async () => {
    for (const slug of ['%', 'missing-project-938247']) { await page.goto(`${base}#/work/${slug}`); await page.locator('.not-found').waitFor(); await page.getByRole('button', { name: '返回作品', exact: true }).click(); await page.locator('#works').waitFor(); assert.equal(new URL(page.url()).hash, '#works') }
  })
  await check('Case next/back preserves filter, query and scroll; browser forward/back', async () => {
    await home(); await page.getByRole('button', { name: '工业与产品', exact: true }).click(); await page.getByRole('searchbox').fill('管道')
    assert.equal(await count(), 1)
    const card = page.locator('.catalog-grid .work-card'); await card.scrollIntoViewIfNeeded(); const before = await page.evaluate(() => scrollY)
    await card.click(); await page.locator('.case-page').waitFor(); await page.locator('.next-case a').click(); const next = new URL(page.url()).hash
    await page.locator('.case-toolbar button').click(); await page.locator('.catalog-grid').waitFor(); await page.waitForFunction(expected => Math.abs(scrollY - expected) < 2, before)
    assert.equal(await page.getByRole('searchbox').inputValue(), '管道'); assert.equal(await page.getByRole('button', { name: '工业与产品', exact: true }).getAttribute('aria-pressed'), 'true'); assert.equal(await count(), 1)
    const after = await page.evaluate(() => scrollY); await page.goForward(); await page.locator('.case-page').waitFor(); assert.equal(new URL(page.url()).hash, next)
    await page.goBack(); await page.locator('.catalog-grid').waitFor(); await page.waitForFunction(expected => Math.abs(scrollY - expected) < 2, before)
    return { scrollBefore: before, scrollAfter: after, nextRoute: next }
  })
  await check('Cross-page about/contact/top anchors reach their target', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    const offsets = {}
    for (const id of ['about', 'contact', 'top']) {
      await detail('hermes'); const selector = id === 'top' ? '.signature' : `.site-header nav a[href="#${id}"]`; await page.locator(selector).click(); await page.locator(`#${id}`).waitFor(); await page.waitForFunction(expected => location.hash === `#${expected}`, id)
      await page.waitForFunction(expected => {
        const node = document.getElementById(expected), documentTop = node.getBoundingClientRect().top + scrollY
        const padding = expected === 'top' ? 0 : parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
        const target = Math.max(0, Math.min(documentTop - padding, document.documentElement.scrollHeight - innerHeight))
        return Math.abs(scrollY - target) < 3
      }, id)
      offsets[id] = await page.locator(`#${id}`).evaluate(node => node.getBoundingClientRect().top)
    }
    await page.setViewportSize({ width: 390, height: 844 }); return offsets
  })
  await check('Keyboard lightbox: next/previous, zoom, Escape and focus restoration', async () => {
    await detail('hermes'); const trigger = page.locator('.case-cover'); await trigger.focus(); await trigger.press('Enter'); await page.locator('dialog[open]').waitFor()
    const initial = await page.locator('.lightbox-bar > span').innerText(); await page.keyboard.press('ArrowRight'); const next = await page.locator('.lightbox-bar > span').innerText(); assert.notEqual(next, initial)
    await page.keyboard.press('ArrowLeft'); assert.equal(await page.locator('.lightbox-bar > span').innerText(), initial)
    await page.getByRole('button', { name: '切换图片大小', exact: true }).click(); assert(await page.locator('dialog').evaluate(node => node.classList.contains('is-zoomed')))
    await screenshot('lightbox-390.png'); await page.keyboard.press('Escape'); await page.locator('dialog').waitFor({ state: 'detached' })
    assert(await trigger.evaluate(node => document.activeElement === node), 'focus did not return to the image trigger'); assert.equal(await page.locator('body').evaluate(node => node.style.overflow), '')
    return { initial, next, focusRestored: true }
  })
  await check('Video metadata and muted playback advance', async () => {
    await detail('rendering-studies'); const video = page.locator('video'); await video.scrollIntoViewIfNeeded(); await video.evaluate(node => { node.muted = true }); await video.click(); await video.evaluate(node => node.play())
    await page.waitForFunction(() => document.querySelector('video')?.currentTime > 0.25)
    const state = await video.evaluate(node => ({ currentTime: node.currentTime, duration: node.duration, width: node.videoWidth, height: node.videoHeight, paused: node.paused, readyState: node.readyState, error: node.error?.message ?? null }))
    assert(!state.paused && !state.error && state.width > 0); await video.evaluate(node => node.pause()); await screenshot('video-390.png'); return state
  })
  await check('Language changes home/case copy and URL; both PDFs download', async () => {
    await home(); await page.locator('.language').click(); assert.equal(new URL(page.url()).searchParams.get('lang'), 'en'); assert.equal(await page.locator('html').getAttribute('lang'), 'en'); assert.equal(await page.locator('#index-title').innerText(), 'Work index')
    await page.locator('.catalog-grid a[href="#/work/hermes"]').click(); assert.match(await page.locator('.case-header h1').innerText(), /Hermès/); assert.match(await page.locator('.case-toolbar button').innerText(), /Back to work/)
    await page.locator('.language').click(); assert.equal(new URL(page.url()).searchParams.get('lang'), null); assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN')
    await page.locator('.case-toolbar button').click(); await page.locator('#works').waitFor(); const downloads = []
    for (const link of await page.locator('a[download]').all()) {
      const href = await link.getAttribute('href'), url = new URL(href, page.url()).href, response = await context.request.get(url), body = await response.body(); assert.equal(response.status(), 200); assert.equal(body.subarray(0, 5).toString(), '%PDF-')
      const event = page.waitForEvent('download'); await link.click(); const download = await event; downloads.push({ href, suggestedFilename: download.suggestedFilename(), bytes: body.length }); await download.cancel()
    }
    assert.equal(downloads.length, 2); return downloads
  })
  await check('320/390/1440 widths: home, index, case and English have no horizontal overflow', async () => {
    const sizes = []
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: width > 700 ? 1000 : 844 })
      for (const lang of ['zh', 'en']) {
        await page.goto(`${base}${lang === 'en' ? '?lang=en' : ''}#top`); await page.locator('#hero-name').waitFor(); sizes.push({ width, lang, surface: 'home', ...(await noOverflow('home')) }); await screenshot(`home-${lang}-${width}.png`)
        await page.locator('.sen-explore').click(); await page.locator('#works').waitFor(); sizes.push({ width, lang, surface: 'index', ...(await noOverflow('index')) })
        await detail('arcteryx', lang); sizes.push({ width, lang, surface: 'case', ...(await noOverflow('case')) }); await screenshot(`case-${lang}-${width}.png`)
      }
    }
    return sizes
  })
  await check('Reduced motion makes no Three or GLB request until explicit click', async () => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }), p = await ctx.newPage(), requests = []
    p.on('request', request => requests.push(request.url()))
    try {
      await p.goto(base); await p.waitForLoadState('networkidle'); await p.waitForTimeout(1300)
      const initial = requests.filter(url => /\/models\/|\/assets\/(?:three|PortraitScene)/.test(url)); assert.equal(initial.length, 0, JSON.stringify(initial)); assert.equal(await p.locator('canvas').count(), 0)
      await p.locator('.scene-toggle').click(); await p.locator('.portrait-stage.is-live').waitFor({ timeout: 30000 }); assert.equal(await p.locator('.portrait-poster').evaluate(node => getComputedStyle(node).visibility), 'hidden')
      const model = requests.filter(url => /avatar\.glb/.test(url)); assert.equal(model.length, 1); await p.screenshot({ path: path.join(screenshots, 'reduced-explicit-3d-390.png') })
      await p.locator('.scene-toggle').click(); assert.equal(await p.locator('canvas').count(), 0); assert.equal(await p.locator('.portrait-poster').evaluate(node => getComputedStyle(node).visibility), 'visible')
      return { initialThreeRequests: initial.length, requestedModelCount: model.length, explicitSceneLive: true }
    } finally { await ctx.close() }
  })
  await check('Normal motion loads a live GLB scene; poster remains visible during delayed GLB', async () => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' }), p = await ctx.newPage(), errors = []
    p.on('pageerror', error => errors.push(error.message)); let modelRequested = false, release
    const gate = new Promise(resolve => { release = resolve })
    await p.route('**/models/avatar.glb', async route => { modelRequested = true; await gate; await route.continue() })
    try {
      await p.goto(base); await p.waitForFunction(() => !!document.querySelector('canvas'), null, { timeout: 15000 }); await p.waitForTimeout(400); assert(modelRequested)
      assert.equal(await p.locator('.portrait-poster').evaluate(node => getComputedStyle(node).visibility), 'visible'); assert.equal(await p.locator('.canvas-shell').evaluate(node => getComputedStyle(node).opacity), '0')
      release(); await p.locator('.portrait-stage.is-live').waitFor({ timeout: 30000 }); await p.waitForTimeout(300)
      const rendered = await p.locator('canvas').evaluate(node => ({ width: node.width, height: node.height })); assert(rendered.width > 0); assert.equal(await p.locator('.portrait-poster').evaluate(node => getComputedStyle(node).visibility), 'hidden'); assert.equal(errors.length, 0, JSON.stringify(errors))
      await p.screenshot({ path: path.join(screenshots, 'normal-live-3d-1440.png') }); return { rendered, delayedPosterVisible: true, errors }
    } finally { release(); await ctx.close() }
  })
  await check('Failed model request restores the static portrait', async () => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' }), p = await ctx.newPage(); let blocked = false
    await p.route('**/models/avatar.glb', route => { blocked = true; return route.abort('failed') })
    try { await p.goto(base); await p.waitForFunction(() => document.querySelector('.scene-toggle')?.textContent.includes('查看三维人物')); await p.waitForTimeout(1300); assert(blocked); await p.locator('canvas').waitFor({ state: 'detached' }); assert.equal(await p.locator('.portrait-poster').evaluate(node => getComputedStyle(node).visibility), 'visible'); return { deliberatelyAbortedModel: true, staticRestored: true } }
    finally { await ctx.close() }
  })
  await check('sen gallery has six ordered chapters, accessible stops, mobile fallback and reverse scroll', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 1440, height: 900 }); await page.goto(base)
    await page.locator('.wk-progress').waitFor({ state: 'attached' })
    const titles = await page.locator('.wk-card-head h2').allTextContents()
    assert.deepEqual(titles, ['商业橱窗','铝型材灯具','产品设计与模型','三维渲染实践','品牌孵化','AI 与数字产品'])
    const galleryTop = await page.locator('.wk-gallery').evaluate(node => node.getBoundingClientRect().top + scrollY)
    const states = []
    for (const index of [0, 2, 5, 1, 0]) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), galleryTop + index * 1440)
      await page.waitForFunction(expected => document.querySelector('.wk-progress button[aria-current]')?.textContent?.startsWith(String(expected + 1).padStart(2, '0')), index)
      const rect = await page.locator('.wk-card').nth(index).boundingBox(); assert(Math.abs(rect.x) < 2)
      states.push({ index, x: rect.x }); await screenshot(`chapter-${index}-1440.png`)
    }
    const points = await page.locator('.tl-entry').evaluateAll(nodes => nodes.map(node => ({ point: node.dataset.point, top: node.getBoundingClientRect().top + scrollY })))
    assert.deepEqual(points.map(p => p.point), ['focus-1','focus-2','focus-3','focus-4','focus-5'])
    for (const point of points) { await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), point.top - 270); await page.waitForTimeout(650); await screenshot(`${point.point}-1440.png`) }
    await page.setViewportSize({ width: 390, height: 844 }); await page.locator('.wk-vertical').waitFor({ state: 'attached' }); assert.equal(await page.locator('.wk-progress').count(), 0)
    await page.locator('.wk-card').first().scrollIntoViewIfNeeded(); await screenshot('chapter-mobile-390.png'); await noOverflow('vertical gallery')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    return { titles, points: points.map(p => p.point), forwardAndReverse: states }
  })
  await check('No unexpected console errors or uncaught page errors in functional checks', async () => { assert.equal(report.errors.length, 0, JSON.stringify(report.errors)); return { recordedErrors: report.errors.length } })
} finally {
  await context.close(); await browser.close(); report.finished = new Date().toISOString(); await writeFile(path.join(screenshots, 'browser-results.json'), JSON.stringify(report, null, 2))
}
console.log(JSON.stringify({ passed: report.checks.filter(item => item.passed).length, failed: report.checks.filter(item => !item.passed).length, report: path.join(screenshots, 'browser-results.json') }))
if (report.checks.some(item => !item.passed)) process.exitCode = 1
