import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { readFile, readdir, mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { experiments } from '../../web/src/data/experiments.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const require = createRequire(path.join(root, 'web/package.json'))
const { chromium, expect } = require('@playwright/test')
const { default: AxeBuilder } = require('@axe-core/playwright')
const base = new URL(process.env.PORTFOLIO_QA_URL || process.env.SYJ_QA_URL || 'http://127.0.0.1:4173/').href.replace(/\/?$/, '/')
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || 'design/qa-v3')
const checkFilter = process.env.PORTFOLIO_QA_FILTER ? new RegExp(process.env.PORTFOLIO_QA_FILTER) : null
await mkdir(output, { recursive: true })
const reportPath = path.join(output, 'browser-results.json')
const previewDeadline = Date.now() + 30000
while (true) {
  try { if ((await fetch(base, { signal: AbortSignal.timeout(1500) })).ok) break } catch { /* The preview process may still be starting. */ }
  if (Date.now() >= previewDeadline) throw new Error(`Preview did not become ready within 30 seconds: ${base}`)
  await new Promise(resolve => setTimeout(resolve, 500))
}
const buildRoot = path.resolve(process.env.PORTFOLIO_BUILD_DIR || path.join(root, 'web/dist'))
const index = await readFile(path.join(buildRoot, 'index.html'))
const report = {
  started: new Date().toISOString(), base, buildIndexSha256: createHash('sha256').update(index).digest('hex'),
  scope: 'Production-build browser checks. Isolated Chromium profile. Default reduced-motion mode; normal-motion and model-failure checks are explicit. Laboratory evidence, not field performance data.',
  checkFilter: process.env.PORTFOLIO_QA_FILTER || null,
  checks: [], runtimeErrors: [], consoleErrors: [], failedRequests: [], accessibility: [],
}
const sourceFiles = await readdir(path.join(root, 'web/src/content/works'))
const slugs = sourceFiles.filter(file => file.endsWith('.zh.md')).map(file => file.slice(0, -6)).sort()
assert.equal(slugs.length, 33, 'The source collection must preserve 33 cases')
const titles = { zh: {}, en: {} }
const categories = {}
for (const slug of slugs) {
  for (const lang of ['zh', 'en']) {
    const source = await readFile(path.join(root, `web/src/content/works/${slug}.${lang}.md`), 'utf8')
    titles[lang][slug] = /^title:\s*"(.+)"\r?$/m.exec(source)?.[1]
    assert.ok(titles[lang][slug], `Missing title for ${slug}.${lang}`)
    if (lang === 'zh') {
      const category = /^category:\s*"(.+)"\r?$/m.exec(source)?.[1]
      categories[category] = (categories[category] || 0) + 1
    }
  }
}

async function browserExecutable() {
  if (process.env.PORTFOLIO_QA_BROWSER) return process.env.PORTFOLIO_QA_BROWSER
  try { await access(chromium.executablePath()); return undefined } catch { /* Prefer Playwright's pinned browser; a local Chrome is an explicit fallback. */ }
  const candidates = process.platform === 'win32' ? [
    path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe'),
  ] : process.platform === 'darwin' ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'] : ['/usr/bin/chromium', '/usr/bin/google-chrome']
  for (const candidate of candidates) { try { await access(candidate); return candidate } catch { /* Check the next supported local installation. */ } }
  throw new Error('No Chromium browser found. Run: cd web && npx playwright install chromium')
}
const executablePath = await browserExecutable()
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}), args: ['--enable-unsafe-swiftshader'] })
report.browserVersion = browser.version()
report.browserSource = executablePath ? 'existing local Chromium-family browser' : 'Playwright pinned Chromium'
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true })
await context.addInitScript(() => {
  window.__portfolioPerformance = { lcp: null, cls: 0 }
  try {
    new PerformanceObserver(list => { const entries = list.getEntries(); const last = entries[entries.length - 1]; if (last) window.__portfolioPerformance.lcp = last.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__portfolioPerformance.cls += entry.value }).observe({ type: 'layout-shift', buffered: true })
  } catch { /* Unsupported browser metrics are recorded as unavailable. */ }
})
const page = await context.newPage()
page.setDefaultTimeout(12000)
page.on('pageerror', error => report.runtimeErrors.push({ url: page.url(), message: error.message }))
page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ url: page.url(), message: message.text(), location: message.location() }) })
page.on('requestfailed', request => { if (!request.failure()?.errorText.includes('ERR_ABORTED')) report.failedRequests.push({ url: request.url(), failure: request.failure()?.errorText }) })
const persist = () => writeFile(reportPath, JSON.stringify(report, null, 2))
async function check(name, operation) {
  if (checkFilter && !checkFilter.test(name)) return
  const started = Date.now()
  try {
    const detail = await operation()
    report.checks.push({ name, passed: true, milliseconds: Date.now() - started, detail })
    console.log(`PASS ${name}`)
  } catch (error) {
    const failureImage = `failure-${String(report.checks.length + 1).padStart(2, '0')}.png`
    await page.screenshot({ path: path.join(output, failureImage), animations: 'disabled' }).catch(() => {})
    report.checks.push({ name, passed: false, milliseconds: Date.now() - started, error: error.stack, screenshot: failureImage })
    console.log(`FAIL ${name}: ${error.message}`)
  }
  await persist()
}
function routeUrl(slug, lang = 'zh') { return `${base}${lang === 'en' ? '?lang=en' : ''}#/work/${slug}` }
async function detail(slug, lang = 'zh') {
  await page.goto(routeUrl(slug, lang))
  await expect(page.locator('.case-header h1')).toHaveText(titles[lang][slug], { timeout: 12000 })
  await expect(page.locator('html')).toHaveAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en')
  if (experiments[slug]) await expect(page.locator('.case-experiment')).toHaveAttribute('data-experiment', slug)
}
async function home(lang = 'zh') {
  await page.goto(`${base}${lang === 'en' ? '?lang=en' : ''}#works`)
  await page.locator('.catalog-grid').waitFor()
  await page.getByRole('searchbox').fill('')
  await page.getByRole('button', { name: lang === 'zh' ? '全部作品' : 'All work', exact: true }).click()
  await expect(page.locator('.catalog-grid .work-card')).toHaveCount(slugs.length)
}
async function noOverflow(label) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))
  assert.ok(dimensions.document <= dimensions.width + 1, `${label}: ${JSON.stringify(dimensions)}`)
  return dimensions
}
const decoded = new Set()
async function decodeImages(selector) {
  const sources = await page.locator(selector).evaluateAll(images => [...new Set(images.map(image => image.currentSrc || image.src))])
  const fresh = sources.filter(source => !decoded.has(source))
  for (let offset = 0; offset < fresh.length; offset += 5) {
    const batch = fresh.slice(offset, offset + 5)
    const results = await page.evaluate(async urls => await Promise.all(urls.map(async url => {
      const image = new Image(); image.src = url
      try { await image.decode(); return { url, width: image.naturalWidth, height: image.naturalHeight } } catch { return { url, error: 'Image decode failed' } }
    })), batch)
    assert.ok(results.every(result => result.width > 0), JSON.stringify(results.filter(result => result.error)))
    results.forEach(result => decoded.add(result.url))
  }
  return sources.length
}
async function checkAxe(label) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const violations = results.violations.map(violation => ({ id: violation.id, impact: violation.impact, description: violation.description, helpUrl: violation.helpUrl, nodes: violation.nodes.map(node => ({ target: node.target, failureSummary: node.failureSummary })) }))
  report.accessibility.push({ label, violations, passes: results.passes.length, incomplete: results.incomplete.length })
  const blockers = violations.filter(violation => ['critical', 'serious'].includes(violation.impact))
  assert.equal(blockers.length, 0, `${label}: ${JSON.stringify(blockers)}`)
  return { passes: results.passes.length, violations: violations.length, blockingViolations: blockers.length }
}

try {
  await check('Production build responds and explicit media/download/license whitelist is present', async () => {
    const response = await context.request.get(base)
    assert.equal(response.status(), 200)
    assert.equal(createHash('sha256').update(await response.body()).digest('hex'), report.buildIndexSha256, 'Preview must serve this exact production build')
    const mediaResponse = await context.request.get(new URL('media-index.json', base).href)
    assert.equal(mediaResponse.status(), 200)
    const media = await mediaResponse.json()
    const paths = new Set(media.map(item => item.path))
    for (const experiment of Object.values(experiments)) for (const view of experiment.views) assert.ok(paths.has(view.image), `Experiment media omitted from production: ${view.image}`)
    const downloads = ['/downloads/sun-yingjie-selected-portfolio.pdf', '/downloads/sun-yingjie-full-portfolio.pdf', '/downloads/sun-yingjie-resume.pdf', '/downloads/sun-yingjie-resume.docx']
    const checked = []
    for (const file of downloads) {
      assert.ok(paths.has(file), `Download omitted: ${file}`)
      const result = await context.request.get(new URL(file.slice(1), base).href)
      assert.equal(result.status(), 200)
      const bytes = await result.body()
      assert.ok(bytes.length > 1000)
      assert.equal(bytes.subarray(0, file.endsWith('.pdf') ? 5 : 2).toString(), file.endsWith('.pdf') ? '%PDF-' : 'PK')
      const sha256 = createHash('sha256').update(bytes).digest('hex')
      assert.equal(sha256, media.find(item => item.path === file).sha256, `Downloaded file differs from staged digest: ${file}`)
      checked.push({ file, bytes: bytes.length, sha256 })
    }
    assert.ok(paths.has('/THIRD_PARTY_NOTICES.md'))
    const licenses = [...paths].filter(file => file.startsWith('/licenses/'))
    assert.ok(licenses.length > 0)
    for (const file of ['/THIRD_PARTY_NOTICES.md', ...licenses]) {
      const response = await context.request.get(new URL(file.slice(1), base).href)
      assert.equal(response.status(), 200, `License unavailable: ${file}`)
      assert.ok((await response.body()).length > 0)
    }
    return { mediaEntries: paths.size, experimentViews: Object.values(experiments).reduce((count, item) => count + item.views.length, 0), licenses: licenses.length, downloads: checked }
  })

  await check('All 33 catalog cards, category counts, normalized search and empty-state reset', async () => {
    await home()
    assert.equal(await decodeImages('.catalog-grid img'), slugs.length)
    const categoryLabels = { commercial: '商业空间', product: '工业与产品', brand: '品牌视觉', digital: '数字产品', experiments: '创作实验' }
    for (const [category, label] of Object.entries(categoryLabels)) {
      await page.getByRole('button', { name: label, exact: true }).click()
      await expect(page.locator('.catalog-grid .work-card')).toHaveCount(categories[category] || 0)
    }
    await page.getByRole('button', { name: '全部作品', exact: true }).click()
    await page.getByRole('searchbox').fill('  ＬＥＮＳＦＬＯＷ  ')
    await expect(page.locator('.catalog-grid .work-card')).toHaveCount(1)
    await expect(page.locator('.catalog-grid .work-card')).toHaveAttribute('href', '#/work/lensflow')
    await page.getByRole('searchbox').fill('no-such-project-v3-938247')
    await page.locator('.empty-state').waitFor()
    await page.getByRole('button', { name: '清除筛选', exact: true }).click()
    await expect(page.locator('.catalog-grid .work-card')).toHaveCount(slugs.length)
    await expect(page.getByRole('searchbox')).toHaveValue('')
    return { cards: slugs.length, categories }
  })

  await check('Static homepage performance sample records timing, layout shift and asset requests', async () => {
    await page.goto(`${base}?qa_sample=static`)
    await page.locator('.portrait-poster').waitFor()
    await page.evaluate(async () => {
      await document.fonts.ready
      await document.querySelector('.portrait-poster').decode()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    })
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      const resources = performance.getEntriesByType('resource')
      return {
        navigationDurationMs: navigation?.duration ?? null,
        domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? null,
        lcpMs: window.__portfolioPerformance?.lcp ?? null,
        cls: window.__portfolioPerformance?.cls ?? null,
        jsRequests: resources.filter(item => /\.m?js(?:\?|$)/.test(item.name)).length,
        modelRequests: resources.filter(item => /\.glb(?:\?|$)/.test(item.name)).length,
        resourceTransferredBytes: resources.reduce((total, item) => total + (item.transferSize || 0), 0),
        canvasCount: document.querySelectorAll('.portrait-stage canvas').length,
        sampleAtMs: performance.now(),
      }
    })
    assert.equal(metrics.canvasCount, 0)
    assert.equal(metrics.modelRequests, 0)
    report.performance = { static: metrics, conditions: 'Local production preview; desktop 1440x1000; reduced motion; browser cache may be warm; no CPU or network throttle; observation ends after fonts and poster decode. Not field Core Web Vitals.' }
    return report.performance
  })

  await check('All 66 bilingual routes match source titles and every case image decodes', async () => {
    let references = 0
    for (const lang of ['zh', 'en']) {
      for (const slug of slugs) {
        await detail(slug, lang)
        await expect(page.locator('.case-body > h2')).toHaveCount(6)
        references += await decodeImages('.case-page img')
        assert.match(await page.title(), new RegExp(titles[lang][slug].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      }
    }
    return { routes: slugs.length * 2, imageReferences: references, uniqueDecodedImages: decoded.size }
  })

  await check('Eight experiments work at 320, 390, 768 and 1440 pixels with complete touch targets', async () => {
    const results = []
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 })
      for (const slug of Object.keys(experiments)) {
        await detail(slug)
        const section = page.locator('.case-experiment')
        const controls = section.locator('.ce-selector button')
        await controls.last().click()
        await expect(controls.last()).toHaveAttribute('aria-pressed', 'true')
        await decodeImages('.case-experiment img')
        await noOverflow(`${slug} at ${width}`)
        const shortTargets = await section.locator('button').evaluateAll(buttons => buttons.map(button => ({ text: button.textContent, width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height })).filter(button => button.width > 0 && (button.width < 43.9 || button.height < 43.9)))
        assert.deepEqual(shortTargets, [], `${slug} at ${width}: small touch target`)
        const selected = await controls.last().innerText()
        await section.getByRole('button', { name: '重置视角', exact: true }).click()
        await expect(controls.first()).toHaveAttribute('aria-pressed', 'true')
        if (width === 390 || width === 1440) await section.screenshot({ path: path.join(output, `${slug}-${width}.png`), animations: 'disabled' })
        results.push({ width, slug, lastView: selected, targets: '44px minimum', reset: true })
      }
    }
    return results
  })

  await check('Hermes and robot hotspots expose accurate source-based annotations', async () => {
    await detail('hermes')
    await page.locator('.ce-selector button').last().click()
    await page.locator('.ce-hotspot').first().click()
    await expect(page.locator('.ce-annotation')).toContainText('黄色包袋')
    await page.locator('.ce-hotspot').first().press('Enter')
    await expect(page.locator('.ce-annotation')).toContainText('选择图中编号')
    await detail('plumber')
    await page.locator('.ce-selector button').last().click()
    await page.locator('.ce-hotspot').nth(1).click()
    await expect(page.locator('.ce-annotation')).toContainText('履带区域')
    return { pointerAndKeyboard: true, originalImages: true }
  })

  await check('Lensflow partial failure retains successful outputs and only increments failed-item attempts', async () => {
    await detail('lensflow')
    const demo = page.getByTestId('batch-demo')
    await demo.getByRole('button', { name: /演示一次部分失败/ }).click()
    const state = () => demo.locator('[data-task]').evaluateAll(nodes => nodes.map(node => ({ id: node.dataset.task, status: node.dataset.status, result: node.dataset.result, attempts: Number(node.querySelector('small b').textContent) })))
    const failed = await state()
    assert.deepEqual(failed.map(item => item.status), ['success', 'success', 'failed'])
    await demo.getByRole('button', { name: /只补全失败项 C/ }).click()
    const recovered = await state()
    assert.deepEqual(recovered.slice(0, 2), failed.slice(0, 2))
    assert.deepEqual(recovered.map(item => item.attempts), [1, 1, 2])
    assert.ok(recovered.every(item => item.status === 'success'))
    await demo.getByRole('button', { name: '重置批次', exact: true }).click()
    assert.ok((await state()).every(item => item.status === 'queued' && item.attempts === 0 && !item.result))
    return { failed, recovered, reset: true }
  })

  await check('Resume suggestions require acceptance, reject preserves text, undo restores history', async () => {
    await detail('resume-formatter')
    const demo = page.getByTestId('review-demo')
    const current = demo.locator('.ce-resume-paper p')
    const original = await current.allTextContents()
    await demo.getByRole('button', { name: '接受建议', exact: true }).click()
    assert.notEqual(await current.first().textContent(), original[0])
    await expect(current.first()).toHaveAttribute('data-choice', 'accepted')
    await demo.getByRole('button', { name: '撤销最近决定', exact: true }).press('Enter')
    assert.deepEqual(await current.allTextContents(), original)
    await demo.getByRole('button', { name: '保留原文', exact: true }).click()
    assert.deepEqual(await current.allTextContents(), original)
    await expect(current.first()).toHaveAttribute('data-choice', 'rejected')
    await demo.getByRole('button', { name: /重置全部建议/ }).click()
    await expect(demo.locator('.ce-demo-heading strong')).toHaveText('0 / 3')
    assert.deepEqual(await current.allTextContents(), original)
    return { accept: true, reject: true, keyboardUndo: true, reset: true }
  })

  await check('Periastra uses the same source at four CSS sizes and reversible colour inversion', async () => {
    await detail('periastra', 'en')
    const sizes = await page.locator('.ce-mark-crop').evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, source: node.querySelector('img').getAttribute('src') })))
    assert.deepEqual(sizes.map(item => Math.round(item.width)), [16, 32, 64, 128])
    assert.equal(new Set(sizes.map(item => item.source)).size, 1)
    await page.getByRole('button', { name: /Invert colours/ }).click()
    await expect(page.locator('.ce-logo-checks')).toHaveClass(/is-inverse/)
    await page.getByRole('button', { name: /Invert colours/ }).press('Enter')
    await expect(page.locator('.ce-logo-checks')).not.toHaveClass(/is-inverse/)
    return sizes
  })

  await check('Mobile touch taps operate seasonal hotspots and reversible resume review', async () => {
    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
    const touchPage = await touchContext.newPage()
    try {
      await touchPage.goto(routeUrl('hermes'))
      await touchPage.locator('.ce-selector button').last().tap()
      await expect(touchPage.locator('.ce-selector button').last()).toHaveAttribute('aria-pressed', 'true')
      await touchPage.locator('.ce-hotspot').first().tap()
      await expect(touchPage.locator('.ce-annotation')).toContainText('黄色包袋')
      await touchPage.goto(routeUrl('resume-formatter'))
      await expect(touchPage.locator('.case-experiment')).toHaveAttribute('data-experiment', 'resume-formatter')
      await touchPage.getByRole('button', { name: '接受建议', exact: true }).tap()
      await expect(touchPage.locator('.ce-resume-paper p').first()).toHaveAttribute('data-choice', 'accepted')
      await touchPage.getByRole('button', { name: '撤销最近决定', exact: true }).tap()
      await expect(touchPage.locator('.ce-resume-paper p').first()).toHaveAttribute('data-choice', 'pending')
      return { width: 390, touch: true, hotspot: true, acceptAndUndo: true }
    } finally { await touchContext.close() }
  })

  await check('Original video decodes and muted playback advances', async () => {
    await detail('rendering-studies')
    const video = page.locator('video').first()
    await video.scrollIntoViewIfNeeded()
    await video.evaluate(async element => { element.muted = true; await element.play() })
    await page.waitForFunction(() => document.querySelector('video')?.currentTime > .25)
    const state = await video.evaluate(element => ({ time: element.currentTime, duration: element.duration, width: element.videoWidth, height: element.videoHeight, error: element.error?.message ?? null }))
    await video.evaluate(element => element.pause())
    assert.ok(state.width > 0 && state.height > 0 && state.duration > 0 && !state.error)
    return state
  })

  await check('Case navigation, back/forward, filters, scroll position and focus survive route changes', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await home()
    await page.getByRole('button', { name: '工业与产品', exact: true }).click()
    await page.getByRole('searchbox').fill('管道')
    const card = page.locator('.catalog-grid a[href="#/work/plumber"]')
    await card.scrollIntoViewIfNeeded()
    const scrollBefore = await page.evaluate(() => scrollY)
    await card.click()
    await expect(page.locator('.case-header h1')).toHaveText(titles.zh.plumber)
    await expect(page.locator('.case-page')).toBeFocused()
    await page.locator('#case-section-3').scrollIntoViewIfNeeded()
    // Observe a painted reading position before using the browser toolbar. The
    // protocol scroll command itself can return before the first scroll event.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const nativeCaseScrollBefore = await page.evaluate(() => scrollY)
    const nativeStoredBefore = await page.evaluate(() => history.state?.portfolioPosition ?? null)
    assert.ok(nativeStoredBefore?.hash === '#/work/plumber' && Math.abs(nativeStoredBefore.top - nativeCaseScrollBefore) < 2, `Painted reading position not saved: ${JSON.stringify({ nativeCaseScrollBefore, nativeStoredBefore })}`)
    await page.goBack()
    await page.locator('.catalog-grid').waitFor()
    await page.goForward()
    await expect(page.locator('.case-header h1')).toHaveText(titles.zh.plumber)
    try { await page.waitForFunction(expected => Math.abs(scrollY - expected) < 4, nativeCaseScrollBefore) }
    catch (error) {
      const actual = await page.evaluate(() => ({ scroll: scrollY, hash: location.hash, stored: history.state?.portfolioPosition ?? null }))
      throw new Error(`${error.message}; native-navigation diagnostics: ${JSON.stringify({ expectedScroll: nativeCaseScrollBefore, nativeStoredBefore, actual })}`)
    }
    const nativeCaseScrollAfter = await page.evaluate(() => scrollY)
    await page.locator('.next-case a').click()
    const nextSlug = decodeURIComponent(new URL(page.url()).hash.slice(7))
    await expect(page.locator('.case-header h1')).toHaveText(titles.zh[nextSlug])
    await page.locator('.case-toolbar button').click()
    await page.locator('.catalog-grid').waitFor()
    await expect(page.getByRole('searchbox')).toHaveValue('管道')
    await expect(page.getByRole('button', { name: '工业与产品', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await page.waitForFunction(expected => Math.abs(scrollY - expected) < 4, scrollBefore)
    await expect(card).toBeFocused()
    const scrollAfter = await page.evaluate(() => scrollY)
    await page.goForward()
    await expect(page.locator('.case-header h1')).toHaveText(titles.zh[nextSlug])
    await page.reload()
    await expect(page.locator('.case-header h1')).toHaveText(titles.zh[nextSlug])
    await page.locator('.case-toolbar button').click()
    await page.locator('.catalog-grid').waitFor()
    await expect(page.getByRole('searchbox')).toHaveValue('管道')
    await expect(page.getByRole('button', { name: '工业与产品', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(card).toBeFocused()
    return { scrollBefore, scrollAfter, nativeCaseScrollBefore, nativeCaseScrollAfter, nextSlug, focusOnCase: true, initiatingLinkFocusRestored: true, reloadThenBack: true }
  })

  await check('Control-click preserves the current page and opens the requested case in a new tab', async () => {
    await home()
    const current = page.url()
    const popupPromise = context.waitForEvent('page')
    await page.locator('.catalog-grid a[href="#/work/hermes"]').click({ modifiers: ['ControlOrMeta'] })
    const popup = await popupPromise
    await popup.waitForLoadState('domcontentloaded')
    await expect(popup.locator('.case-header h1')).toHaveText(titles.zh.hermes)
    assert.equal(page.url(), current)
    await popup.close()
    return { newTab: true, originalPagePreserved: true }
  })

  await check('Delayed cold case chunks restore saved reading position after a home reload and browser back', async () => {
    const coldContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
    const coldPage = await coldContext.newPage()
    coldPage.setDefaultTimeout(12000)
    let delayedLoads = 0
    let before = null
    let savedBefore = null
    await coldContext.route(/\/assets\/CasePage-[^/]+\.js(?:\?|$)/, async route => {
      delayedLoads++
      await new Promise(resolve => setTimeout(resolve, 400))
      await route.continue()
    })
    try {
      await coldPage.goto(`${base}#works`)
      await coldPage.locator('.catalog-grid a[href="#/work/hermes"]').click()
      await expect(coldPage.locator('.case-header h1')).toHaveText(titles.zh.hermes)
      await coldPage.locator('#case-section-3').scrollIntoViewIfNeeded()
      before = await coldPage.evaluate(() => scrollY)
      await coldPage.waitForFunction(() => history.state?.portfolioPosition?.hash === location.hash && Math.abs(history.state.portfolioPosition.top - scrollY) < 2)
      savedBefore = await coldPage.evaluate(() => history.state.portfolioPosition)
      // A real hash navigation preserves this reading position. Clicking an offscreen
      // header would first scroll it into view and correctly save that different position.
      await coldPage.goto(`${base}#about`)
      await coldPage.locator('#about').waitFor()
      await coldPage.reload()
      await coldPage.locator('#about').waitFor()
      await coldPage.goBack()
      await expect(coldPage.locator('.case-header h1')).toHaveText(titles.zh.hermes)
      await coldPage.waitForFunction(expected => Math.abs(scrollY - expected) < 4, before)
      const after = await coldPage.evaluate(() => scrollY)
      assert.ok(delayedLoads >= 2, 'The lazy case chunk should load in both document lifetimes')
      return { before, savedBefore, after, delayedLoads, delayPerChunkMs: 400 }
    } catch (error) {
      const actual = await coldPage.evaluate(() => ({ hash: location.hash, scroll: scrollY, height: document.documentElement.scrollHeight, storedPosition: history.state?.portfolioPosition ?? null, experiment: document.querySelector('.case-experiment')?.getAttribute('data-experiment') ?? null }))
      throw new Error(`${error.message}; cold-case diagnostics: ${JSON.stringify({ expectedScroll: before, savedBefore, actual, delayedLoads })}`)
    } finally { await coldContext.close() }
  })

  await check('Bilingual lightbox supports keyboard navigation, zoom, Escape and trigger focus restoration', async () => {
    const results = []
    for (const lang of ['zh', 'en']) {
      await detail('hermes', lang)
      const trigger = page.locator('.case-cover')
      await trigger.focus(); await trigger.press('Enter')
      await page.locator('.yarl__root').waitFor()
      const counter = page.locator('.yarl__counter')
      const first = await counter.innerText()
      await page.keyboard.press('ArrowRight')
      await expect(counter).not.toHaveText(first)
      await page.keyboard.press('ArrowLeft')
      await expect(counter).toHaveText(first)
      await page.getByRole('button', { name: lang === 'zh' ? '放大图片' : 'Zoom in', exact: true }).click()
      await expect(page.getByRole('button', { name: lang === 'zh' ? '缩小图片' : 'Zoom out', exact: true })).toBeEnabled()
      await page.keyboard.press('Escape')
      await page.locator('.yarl__root').waitFor({ state: 'detached' })
      await expect(trigger).toBeFocused()
      results.push({ lang, initialCounter: first, arrowKeys: true, zoom: true, restoredFocus: true })
    }
    return results
  })

  await check('Case outline moves keyboard focus and malformed routes recover', async () => {
    await detail('huhu-care')
    await page.locator('.skip-link').focus(); await page.locator('.skip-link').press('Enter')
    await expect(page.locator('.case-page')).toBeFocused()
    await page.locator('.case-outline button').nth(3).press('Enter')
    await expect(page.locator('#case-section-3')).toBeFocused()
    for (const invalid of ['%', 'missing-case-v3-938247']) {
      await page.goto(`${base}#/work/${invalid}`)
      await page.locator('.not-found').waitFor()
      await page.locator('.not-found button').click()
      await page.locator('.catalog-grid').waitFor()
      assert.equal(new URL(page.url()).hash, '#works')
    }
    return { skipLinkFocus: true, outlineKeyboardFocus: true, malformedAndMissing: true }
  })

  await check('Reduced motion keeps complete static content and no automatic 3D canvas', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`${base}#top`)
    await page.locator('.portrait-poster').waitFor()
    await expect(page.locator('.portrait-stage canvas')).toHaveCount(0)
    await expect(page.locator('.wk-vertical .wk-card')).toHaveCount(6)
    await expect(page.locator('.wk-progress')).toHaveCount(0)
    const poster = await page.locator('.portrait-poster').evaluate(image => ({ visible: getComputedStyle(image).visibility, source: image.currentSrc }))
    assert.equal(poster.visible, 'visible')
    await detail('lighting')
    await page.locator('.ce-selector button').last().press('Enter')
    await expect(page.locator('.ce-selector button').last()).toHaveAttribute('aria-pressed', 'true')
    return { automaticCanvas: false, allSixChapters: true, keyboardInteraction: true, poster }
  })

  await check('Normal-motion routes complete, six gallery stops reverse, and resize keeps the current chapter usable', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 1440, height: 1000 })
    for (const slug of ['hermes', 'lensflow', 'resume-formatter', 'periastra']) await detail(slug)
    await page.locator('.case-toolbar button').click()
    await page.locator('.wk-progress').waitFor({ state: 'attached' })
    const top = await page.locator('.wk-gallery').evaluate(node => node.getBoundingClientRect().top + scrollY)
    const positions = []
    for (const chapter of [0, 2, 5, 1, 0]) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top + chapter * 1440)
      await page.waitForFunction(expected => document.querySelector('.wk-progress button[aria-current]')?.textContent?.trim().startsWith(String(expected + 1).padStart(2, '0')), chapter)
      const current = await page.locator('.wk-card').nth(chapter).boundingBox()
      assert.ok(Math.abs(current.x) <= 2, `Chapter ${chapter + 1} did not align: ${current.x}`)
      positions.push({ chapter: chapter + 1, x: current.x })
    }
    await page.setViewportSize({ width: 1440, height: 720 })
    const shortTop = await page.locator('.wk-gallery').evaluate(node => node.getBoundingClientRect().top + scrollY)
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), shortTop + 5 * 1440)
    await page.waitForFunction(() => document.querySelector('.wk-progress button[aria-current]')?.textContent?.trim().startsWith('06'))
    const clipping = await page.locator('.wk-card').nth(5).evaluate(card => {
      const header = card.querySelector('.wk-card-head').getBoundingClientRect()
      const link = card.querySelector('.wk-catalogue-link').getBoundingClientRect()
      const progress = document.querySelector('.wk-progress').getBoundingClientRect()
      return { headerTop: header.top, lastLinkBottom: link.bottom, progressTop: progress.top, viewport: innerHeight }
    })
    assert.ok(clipping.headerTop >= -2 && clipping.lastLinkBottom <= clipping.progressTop + 2, `Chapter six clips in a short viewport: ${JSON.stringify(clipping)}`)
    await page.screenshot({ path: path.join(output, 'chapter-six-1440x720.png'), animations: 'disabled' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.locator('.wk-vertical').waitFor()
    await expect(page.locator('.wk-card')).toHaveCount(6)
    await noOverflow('gallery after desktop to mobile resize')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    return { positions, shortViewport: clipping }
  })

  await check('Blocked 3D model falls back to the visible poster with an operable retry control', async () => {
    const failureContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
    const failurePage = await failureContext.newPage()
    let blocked = 0
    await failureContext.route('**/models/avatar.glb', route => { blocked++; return route.abort() })
    try {
      await failurePage.goto(base)
      await failurePage.locator('.scene-toggle').click()
      await expect.poll(() => blocked, { timeout: 20000 }).toBeGreaterThan(0)
      await expect(failurePage.locator('.scene-toggle')).toContainText('查看三维人物', { timeout: 20000 })
      await expect(failurePage.locator('.portrait-poster')).toBeVisible()
      return { blockedRequests: blocked, posterVisible: true, retryAvailable: true, note: 'Model request intentionally aborted in a separate browser context.' }
    } finally { await failureContext.close() }
  })

  await check('Home and English/Chinese case layouts have no horizontal overflow at all required widths', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const states = []
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 })
      for (const lang of ['zh', 'en']) {
        await home(lang)
        states.push({ width, lang, view: 'catalog', ...(await noOverflow(`catalog ${lang} ${width}`)) })
        await page.screenshot({ path: path.join(output, `catalog-${lang}-${width}.png`), animations: 'disabled' })
        await detail('resume-formatter', lang)
        states.push({ width, lang, view: 'case', ...(await noOverflow(`case ${lang} ${width}`)) })
      }
    }
    return states
  })

  await check('WCAG automated checks have no critical or serious violations on home and eight experiments', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 1000 })
    const failures = []
    await home()
    try { await checkAxe('home-zh') } catch (error) { failures.push(error.message) }
    for (const slug of Object.keys(experiments)) {
      await detail(slug)
      try { await checkAxe(slug) } catch (error) { failures.push(error.message) }
    }
    await detail('resume-formatter', 'en')
    try { await checkAxe('resume-formatter-en') } catch (error) { failures.push(error.message) }
    await page.setViewportSize({ width: 390, height: 844 })
    await detail('huhu-care')
    await page.locator('.case-back-bottom').scrollIntoViewIfNeeded()
    try { await checkAxe('case-bottom-mobile') } catch (error) { failures.push(error.message) }
    await home()
    await page.getByRole('searchbox').fill('no-such-project-axe-v3')
    await page.locator('.empty-state').scrollIntoViewIfNeeded()
    try { await checkAxe('empty-search-mobile') } catch (error) { failures.push(error.message) }
    assert.equal(failures.length, 0, failures.join('\n'))
    return report.accessibility.map(result => ({ label: result.label, violations: result.violations.length, passes: result.passes }))
  })

  await check('No uncaught runtime errors or unexpected failed requests during functional checks', async () => {
    assert.deepEqual(report.runtimeErrors, [], JSON.stringify(report.runtimeErrors))
    assert.deepEqual(report.failedRequests, [], JSON.stringify(report.failedRequests))
    return { runtimeErrors: report.runtimeErrors.length, failedRequests: report.failedRequests.length, consoleErrors: report.consoleErrors.length }
  })
} finally {
  await context.close(); await browser.close()
  report.finished = new Date().toISOString()
  report.summary = { passed: report.checks.filter(check => check.passed).length, failed: report.checks.filter(check => !check.passed).length, decodedImages: decoded.size }
  await persist()
}
console.log(JSON.stringify({ ...report.summary, report: reportPath }))
if (report.summary.failed) process.exitCode = 1
