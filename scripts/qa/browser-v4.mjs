import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { readFile, readdir, mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'

// v4 extends the complete v3 route/media/experiment regression suite.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const require = createRequire(path.join(root, 'web/package.json'))
const { chromium, expect } = require('@playwright/test')
const { default: AxeBuilder } = require('@axe-core/playwright')
const ts = require('typescript')
const profilePath = path.join(root, 'web/src/data/profile.ts')
const profileExports = {}
const compiledProfile = ts.transpileModule(await readFile(profilePath, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } })
new Function('exports', 'require', compiledProfile.outputText)(profileExports, createRequire(profilePath))
const { profileCopy } = profileExports
const canonical = JSON.parse(await readFile(path.join(root, 'web/src/data/profile.json'), 'utf8'))
const base = new URL(process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:4178/').href.replace(/\/?$/, '/')
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || 'design/qa-v4')
const buildRoot = path.resolve(process.env.PORTFOLIO_BUILD_DIR || path.join(root, 'web/dist'))
const filter = process.env.PORTFOLIO_QA_FILTER ? new RegExp(process.env.PORTFOLIO_QA_FILTER) : null
await mkdir(output, { recursive: true })
const deadline = Date.now() + 30000
while (true) {
  try { if ((await fetch(base, { signal: AbortSignal.timeout(1500) })).ok) break } catch { /* Preview may be starting. */ }
  if (Date.now() >= deadline) throw new Error(`Preview unavailable after 30 seconds: ${base}`)
  await new Promise(resolve => setTimeout(resolve, 500))
}
const index = await readFile(path.join(buildRoot, 'index.html'))
const report = { started: new Date().toISOString(), base, buildIndexSha256: createHash('sha256').update(index).digest('hex'), scope: 'Production v4 interaction extension; run alongside the complete v3 regression suite. Local isolated Chromium evidence, not field performance data or a complete accessibility certification.', checkFilter: process.env.PORTFOLIO_QA_FILTER || null, checks: [], accessibility: [], runtimeErrors: [], consoleErrors: [], failedRequests: [] }
const titles = { zh: {}, en: {} }
for (const file of await readdir(path.join(root, 'web/src/content/works'))) {
  const match = /^(.*)\.(zh|en)\.md$/.exec(file)
  if (!match) continue
  const content = await readFile(path.join(root, 'web/src/content/works', file), 'utf8')
  titles[match[2]][match[1]] = /^title:\s*"(.+)"\r?$/m.exec(content)?.[1]
}
async function executable() {
  if (process.env.PORTFOLIO_QA_BROWSER) return process.env.PORTFOLIO_QA_BROWSER
  try { await access(chromium.executablePath()); return undefined } catch { /* Try an existing browser when pinned Chromium is not installed. */ }
  const candidates = process.platform === 'win32' ? ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'] : process.platform === 'darwin' ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'] : ['/usr/bin/chromium', '/usr/bin/google-chrome']
  for (const candidate of candidates) { try { await access(candidate); return candidate } catch { /* Next candidate. */ } }
  throw new Error('No Chromium browser is available. Install Playwright Chromium in web/.')
}
const executablePath = await executable()
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}), args: ['--enable-unsafe-swiftshader'] })
report.browserVersion = browser.version()
report.browserSource = executablePath ? 'existing local Chromium-family browser' : 'Playwright pinned Chromium'
function observe(page) {
  page.setDefaultTimeout(10000)
  page.on('pageerror', error => report.runtimeErrors.push({ url: page.url(), message: error.message }))
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ url: page.url(), message: message.text() }) })
  page.on('requestfailed', request => { if (!request.failure()?.errorText.includes('ERR_ABORTED')) report.failedRequests.push({ url: request.url(), failure: request.failure()?.errorText }) })
  return page
}
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const page = observe(await context.newPage())
const persist = () => writeFile(path.join(output, 'browser-results.json'), JSON.stringify(report, null, 2))
async function check(name, operation) {
  if (filter && !filter.test(name)) return
  const start = Date.now()
  try {
    const detail = await operation()
    report.checks.push({ name, passed: true, milliseconds: Date.now() - start, detail })
    console.log(`PASS ${name}`)
  } catch (error) {
    const screenshot = `failure-${String(report.checks.length + 1).padStart(2, '0')}.png`
    await page.screenshot({ path: path.join(output, screenshot), animations: 'disabled' }).catch(() => {})
    report.checks.push({ name, passed: false, milliseconds: Date.now() - start, error: error.stack, screenshot })
    console.log(`FAIL ${name}: ${error.message.slice(0, 900)}`)
  }
  await persist()
}
const url = (lang = 'zh', hash = '#top') => `${base}${lang === 'en' ? '?lang=en' : ''}${hash}`
async function paint(target = page) { await target.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))) }
async function home(lang = 'zh', hash = '#top', target = page) {
  await target.goto(url(lang, hash))
  await target.locator('.studio-hero h1').waitFor()
  await target.evaluate(() => document.fonts.ready)
  await paint(target)
}
async function decode(locator) {
  const dimensions = await locator.evaluate(async image => {
    const loaded = new Image(); loaded.src = image.currentSrc || image.src
    await Promise.race([loaded.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error('Image decode exceeded 10 seconds')), 10000))])
    return { source: loaded.src, width: loaded.naturalWidth, height: loaded.naturalHeight }
  })
  assert.ok(dimensions.width > 0 && dimensions.height > 0, `Image did not decode: ${JSON.stringify(dimensions)}`)
  return dimensions
}
async function overflow(target = page) {
  const size = await target.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))
  assert.ok(size.document <= size.viewport + 1 && size.body <= size.viewport + 1, `Horizontal overflow: ${JSON.stringify(size)}`)
  return size
}
async function axe(label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const violations = result.violations.map(item => ({ id: item.id, impact: item.impact, description: item.description, nodes: item.nodes.map(node => ({ target: node.target, failureSummary: node.failureSummary })) }))
  report.accessibility.push({ label, violations, passes: result.passes.length, incomplete: result.incomplete.length })
  assert.deepEqual(violations.filter(item => ['critical', 'serious'].includes(item.impact)), [], `${label}: ${JSON.stringify(violations)}`)
}
async function backToLink(link, expectedSlug, lang = 'zh') {
  const focusKey = await link.getAttribute('data-return-focus')
  await link.scrollIntoViewIfNeeded(); await paint()
  await link.click()
  await expect(page.locator('.case-header h1')).toHaveText(titles[lang][expectedSlug])
  await page.locator('.case-toolbar button').click()
  await page.locator('.studio-hero').waitFor()
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('data-return-focus'))).toBe(focusKey)
  await expect(page.locator(`[data-return-focus="${focusKey}"]`)).toBeVisible()
  return focusKey
}

try {
  await check('v4 preview is the exact local production build and all source profiles are preserved', async () => {
    assert.deepEqual(Buffer.from(await (await fetch(base)).arrayBuffer()), index)
    assert.equal(Object.keys(titles.zh).length, 33); assert.equal(Object.keys(titles.en).length, 33)
    for (const lang of ['zh', 'en']) {
      const entries = [...profileCopy[lang].experience, profileCopy[lang].education, profileCopy[lang].practice]
      assert.deepEqual(entries.map(item => item.id).sort(), canonical.timeline.map(item => item.id).sort())
    }
    return { cases: 33, languages: 2, canonicalExperiences: canonical.timeline.length }
  })

  await check('Four hero perspectives match original thumbnails and case links in both languages', async () => {
    const states = []
    for (const lang of ['zh', 'en']) {
      await home(lang)
      await expect(page.locator('.hero-selector[role="group"] button')).toHaveCount(4)
      const slugs = ['hermes', 'plumber', 'biyuan', 'periastra']
      for (const i of [0, 1, 2, 3, 0]) {
        await page.locator('.hero-selector button').nth(i).press('Enter')
        await expect(page.locator('.hero-selector button[aria-pressed="true"]')).toHaveCount(1)
        await expect(page.locator('.hero-selector button').nth(i)).toHaveAttribute('aria-pressed', 'true')
        await expect(page.locator('.hero-feature')).toHaveAttribute('href', `#/work/${slugs[i]}`)
        await expect(page.locator('.hero-feature-label')).toContainText(titles[lang][slugs[i]])
        await expect(page.locator('.hero-feature img')).toHaveAttribute('alt', titles[lang][slugs[i]])
        const image = await decode(page.locator('.hero-feature img'))
        assert.ok(new URL(image.source).pathname.endsWith(`/thumbnails/${slugs[i]}.webp`))
        states.push({ lang, slug: slugs[i], source: image.source })
      }
    }
    return states
  })

  await check('Homepage skip link moves keyboard focus to the catalogue and the next tab reaches its controls', async () => {
    for (const lang of ['zh', 'en']) {
      await home(lang)
      await page.locator('.skip-link').press('Enter')
      await expect(page.locator('#works')).toBeFocused()
      assert.equal(new URL(page.url()).hash, '#works')
      await page.keyboard.press('Tab')
      assert.ok(await page.evaluate(() => document.querySelector('#works').contains(document.activeElement)), 'Tab after skip returned to the header instead of entering the catalogue')
    }
    return { languages: 2, targetFocused: true, nextTabInCatalogue: true }
  })

  await check('Selected works expose three original projects, explanations and operable case links', async () => {
    await home()
    await expect(page.locator('.selected-panel')).toHaveCount(3)
    const slugs = ['lighting', 'huhu-care', 'lensflow']
    for (let i = 0; i < slugs.length; i++) {
      const panel = page.locator('.selected-panel').nth(i)
      await expect(panel.locator('h3')).toHaveText(titles.zh[slugs[i]])
      assert.ok((await panel.locator('.selected-copy p').textContent()).trim().length > 15)
      await expect(panel.locator('.selected-image')).toHaveAttribute('href', `#/work/${slugs[i]}`)
      await decode(panel.locator('img'))
    }
    const focusKey = await backToLink(page.locator('.selected-image').nth(2), 'lensflow')
    return { projects: slugs, focusKey }
  })

  await check('Personal profile contains five source experiences, six expandable capabilities and four downloads', async () => {
    const results = []
    for (const lang of ['zh', 'en']) {
      await home(lang, '#about')
      const data = profileCopy[lang]
      const entries = [...data.experience, data.education, data.practice]
      await expect(page.locator('#about .profile-entry[data-experience]')).toHaveCount(5)
      for (const item of entries) {
        const entry = page.locator(`#about [data-experience="${item.id}"]`)
        await expect(entry.locator('h4')).toHaveText(item.place)
        await expect(entry.locator('.profile-period')).toHaveText(item.period)
        await expect(entry.locator('.profile-entry-heading > span')).toHaveText(item.role)
        await expect(entry.locator('ul > li')).toHaveCount(item.details.length)
        assert.deepEqual(await entry.locator('.evidence-links a').evaluateAll(links => links.map(link => link.getAttribute('href'))), item.caseSlugs.map(slug => `#/work/${slug}`))
      }
      await expect(page.locator('.capability-list details')).toHaveCount(6)
      for (let i = 0; i < data.capabilities.length; i++) {
        const capability = page.locator('.capability-list details').nth(i)
        const wasOpen = await capability.getAttribute('open') !== null
        await capability.locator('summary').press('Enter')
        assert.equal(await capability.getAttribute('open') !== null, !wasOpen)
        if (wasOpen) await capability.locator('summary').press('Enter')
        await expect(capability.locator('p')).toHaveText(data.capabilities[i].body)
        assert.deepEqual(await capability.locator('.evidence-links a').evaluateAll(links => links.map(link => link.getAttribute('href'))), data.capabilities[i].caseSlugs.map(slug => `#/work/${slug}`))
      }
      const files = await page.locator('.profile-downloads a[download]').evaluateAll(links => links.map(link => new URL(link.href).pathname.split('/').at(-1)))
      assert.deepEqual(files, ['sun-yingjie-selected-portfolio.pdf', 'sun-yingjie-full-portfolio.pdf', 'sun-yingjie-resume.pdf', 'sun-yingjie-resume.docx'])
      await expect(page.locator('.profile-asof')).toHaveText(data.asOf)
      results.push({ lang, experiences: entries.length, capabilities: data.capabilities.length, downloads: files })
    }
    return results
  })

  await check('Five design methods change their explanation and project evidence with keyboard operation', async () => {
    const states = []
    for (const lang of ['zh', 'en']) {
      await home(lang, '#process')
      const methods = profileCopy[lang].methods
      await expect(page.locator('.method-selector button')).toHaveCount(5)
      for (const i of [0, 1, 2, 3, 4, 0]) {
        await page.locator('.method-selector button').nth(i).press('Enter')
        await expect(page.locator('.method-selector button[aria-pressed="true"]')).toHaveCount(1)
        await expect(page.locator('.method-content h3')).toHaveText(methods[i].title)
        await expect(page.locator('.method-description')).toHaveText(methods[i].body)
        const hrefs = await page.locator('.method-image a').evaluateAll(links => links.map(link => link.getAttribute('href')))
        assert.deepEqual(hrefs, methods[i].caseSlugs.slice(0, 2).map(slug => `#/work/${slug}`))
        for (const image of await page.locator('.method-image img').all()) await decode(image)
        states.push({ lang, method: methods[i].id, hrefs })
      }
    }
    return states
  })

  await check('Gallery and list views retain search, selections and focus through section navigation, reload and case return', async () => {
    await home('zh', '#works')
    await page.getByRole('button', { name: '工业与产品', exact: true }).click()
    await page.getByRole('searchbox').fill('管道')
    await expect(page.locator('.catalog-grid .work-card')).toHaveCount(1)
    await page.locator('.view-switch').getByRole('button', { name: '列表', exact: true }).press('Enter')
    await expect(page.locator('.catalog-grid')).toHaveClass(/catalog-list/)
    await expect(page.getByRole('searchbox')).toHaveValue('管道')
    await expect(page.getByRole('button', { name: '工业与产品', exact: true })).toHaveAttribute('aria-pressed', 'true')
    assert.equal(await page.evaluate(() => history.state.portfolioCatalog.view), 'list')
    await page.locator('.hero-selector button').nth(2).press('Enter')
    await page.locator('.method-selector button').nth(4).press('Enter')
    const expandedCapability = page.locator('.capability-list details').nth(4)
    if (await expandedCapability.getAttribute('open') === null) await expandedCapability.locator('summary').press('Enter')
    for (const section of ['#about', '#contact']) {
      await page.locator(`.site-header nav a[href="${section}"]`).click()
      assert.equal(new URL(page.url()).hash, section)
      await page.reload(); await page.locator('.studio-hero').waitFor()
      await expect(page.locator('.catalog-grid')).toHaveClass(/catalog-list/)
      await expect(page.getByRole('searchbox')).toHaveValue('管道')
      await expect(page.getByRole('button', { name: '工业与产品', exact: true })).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('.catalog-list .work-card')).toHaveCount(1)
      await expect(page.locator('.hero-feature')).toHaveAttribute('href', '#/work/biyuan')
      await expect(page.locator('.method-content h3')).toHaveText(profileCopy.zh.methods[4].title)
      await expect(expandedCapability).toHaveAttribute('open', '')
    }
    const focusKey = await backToLink(page.locator('.catalog-list .work-card'), 'plumber')
    await expect(page.locator('.catalog-grid')).toHaveClass(/catalog-list/)
    await page.reload(); await page.locator('.catalog-list').waitFor()
    await expect(page.getByRole('searchbox')).toHaveValue('管道')
    await expect(page.locator('.catalog-list .work-card')).toHaveCount(1)
    await page.locator('.view-switch').getByRole('button', { name: '画廊', exact: true }).click()
    await expect(page.locator('.catalog-grid')).not.toHaveClass(/catalog-list/)
    await expect(page.locator('.catalog-grid .work-card')).toHaveCount(1)
    await page.getByRole('searchbox').fill('v4-intentional-empty-97283')
    await page.getByRole('button', { name: '清除筛选', exact: true }).click()
    await expect(page.locator('.catalog-grid .work-card')).toHaveCount(33)
    return { focusKey, sourceCount: 33, filteredCount: 1, reload: true, sectionNavigation: ['#about', '#contact'], restoredHero: 'biyuan', restoredMethod: profileCopy.zh.methods[4].id, capabilityExpanded: true }
  })

  await check('Returning from a non-default hero perspective restores the selected project and initiating focus', async () => {
    await home()
    await page.locator('.hero-selector button').nth(2).click()
    const focusKey = await backToLink(page.locator('.hero-feature'), 'biyuan')
    await expect(page.locator('.hero-selector button').nth(2)).toHaveAttribute('aria-pressed', 'true')
    return { focusKey, restoredSelection: 2 }
  })

  await check('Returning from a non-default design method restores its explanation and initiating focus', async () => {
    await home('zh', '#process')
    await page.locator('.method-selector button').nth(4).click()
    const method = profileCopy.zh.methods[4]
    const focusKey = await backToLink(page.locator('.method-image a').first(), method.caseSlugs[0])
    await expect(page.locator('.method-content h3')).toHaveText(method.title)
    return { focusKey, method: method.id }
  })

  await check('Returning from an expanded capability reopens the initiating evidence link', async () => {
    await home('zh', '#about')
    const capability = page.locator('.capability-list details').nth(4)
    if (await capability.getAttribute('open') === null) await capability.locator('summary').click()
    const focusKey = await backToLink(capability.locator('.evidence-links a').first(), profileCopy.zh.capabilities[4].caseSlugs[0])
    await expect(capability).toHaveAttribute('open', '')
    return { focusKey, expanded: true }
  })

  await check('Still browsing persists, respects the system preference and preserves content and reading anchors', async () => {
    const motionContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' })
    const target = observe(await motionContext.newPage())
    try {
      await home('zh', '#top', target)
      const toggle = target.locator('.motion-toggle')
      await expect(toggle).toBeEnabled(); await expect(toggle).toHaveAttribute('aria-pressed', 'false')
      await toggle.press('Enter')
      await expect(toggle).toHaveAttribute('aria-pressed', 'true')
      assert.equal(await target.evaluate(() => localStorage.getItem('portfolio:motion-paused')), 'true')
      await expect(target.locator('.wk-vertical .wk-card')).toHaveCount(6)
      await target.reload(); await target.locator('.studio-hero').waitFor()
      await expect(toggle).toHaveAttribute('aria-pressed', 'true')
      await expect(target.locator('.portrait-stage canvas')).toHaveCount(0)
      await toggle.press('Enter')
      await target.locator('.wk-progress').waitFor({ state: 'attached' })
      const galleryTop = await target.locator('.wk-gallery').evaluate(node => node.getBoundingClientRect().top + scrollY)
      await target.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), galleryTop + 2 * 1440)
      await target.waitForFunction(() => document.querySelector('.wk-progress button[aria-current]')?.textContent?.trim().startsWith('03'))
      const before = await target.locator('.wk-card').nth(2).evaluate(node => ({ top: node.getBoundingClientRect().top, left: node.getBoundingClientRect().left }))
      // Invoke the visible control's handler without browser automation scrolling an offscreen header into view.
      await toggle.evaluate(button => button.click())
      await expect(toggle).toHaveAttribute('aria-pressed', 'true')
      await paint(target)
      const after = await target.locator('.wk-card').nth(2).evaluate(node => ({ top: node.getBoundingClientRect().top, left: node.getBoundingClientRect().left }))
      assert.ok(Math.abs(before.top - after.top) <= 3, `Reading anchor moved: ${JSON.stringify({ before, after })}`)
      await expect(target.locator('.wk-card')).toHaveCount(6)
      await target.emulateMedia({ reducedMotion: 'reduce' })
      await expect(toggle).toBeDisabled(); await expect(toggle).toHaveAttribute('aria-pressed', 'true')
      await target.evaluate(() => localStorage.setItem('portfolio:motion-paused', 'false'))
      await target.reload(); await target.locator('.studio-hero').waitFor()
      await expect(toggle).toBeDisabled(); await expect(toggle).toHaveAttribute('aria-pressed', 'true')
      await expect(target.locator('.portrait-stage canvas')).toHaveCount(0)
      const running = await target.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)
      assert.equal(running, 0, `System-reduced mode still has ${running} running animations`)
      return { persists: true, before, after, systemWins: true, runningAnimations: running }
    } finally { await motionContext.close() }
  })

  await check('Contact copy succeeds and permission failure provides readable recovery', async () => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(base).origin })
    for (const lang of ['zh', 'en']) {
      await home(lang, '#contact')
      await page.locator('.contact-copy').click()
      await expect(page.locator('.copy-status')).toHaveText(lang === 'zh' ? '邮箱已复制。' : 'Email copied.')
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), canonical.email)
      await expect(page.locator('.email-link')).toHaveAttribute('href', `mailto:${canonical.email}`)
    }
    const deniedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
    await deniedContext.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new DOMException('Denied test fixture', 'NotAllowedError')) }, configurable: true }))
    const denied = observe(await deniedContext.newPage())
    try {
      await home('zh', '#contact', denied)
      await denied.locator('.contact-copy').click()
      await expect(denied.locator('.copy-status')).toContainText('暂时无法复制')
      await expect(denied.locator('.email-link')).toHaveAttribute('href', `mailto:${canonical.email}`)
    } finally { await deniedContext.close() }
    return { bilingualCopy: true, deniedClipboardRecovery: true }
  })

  await check('Bilingual hero, profile, method and list layouts fit desktop, short screens and mobile touch targets', async () => {
    const layouts = [], undersized = [], cropped = [], overflowErrors = []
    for (const viewport of [{ width: 320, height: 844 }, { width: 390, height: 844 }, { width: 768, height: 1000 }, { width: 1440, height: 1000 }, { width: 1440, height: 720 }]) {
      await page.setViewportSize(viewport)
      for (const lang of ['zh', 'en']) {
        const measureLayout = async label => {
          const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))
          if (dimensions.document > dimensions.viewport + 1 || dimensions.body > dimensions.viewport + 1) overflowErrors.push({ label, size: viewport, lang, ...dimensions })
          return dimensions
        }
        await home(lang)
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await paint()
        await decode(page.locator('.hero-feature img'))
        const hero = await page.locator('.hero-feature').evaluate(node => { const box = node.getBoundingClientRect(); return { top: Math.round(box.top), bottom: Math.round(box.bottom), visibleHeight: Math.max(0, Math.min(box.bottom, innerHeight) - Math.max(box.top, 0)) } })
        if (hero.visibleHeight < 80) cropped.push({ viewport, lang, hero })
        layouts.push({ size: viewport, lang, ...(await measureLayout('hero')), hero })
        await page.screenshot({ path: path.join(output, `hero-${lang}-${viewport.width}x${viewport.height}.png`), animations: 'disabled' })
        const sizes = await page.locator('.hero-selector button,.method-selector button,.motion-toggle,.view-switch button,.capability-list summary,.contact-copy').evaluateAll(nodes => nodes.map(node => { const rect = node.getBoundingClientRect(); return { label: node.getAttribute('aria-label') || node.textContent.trim(), width: rect.width, height: rect.height } }).filter(item => item.width < 43.5 || item.height < 43.5))
        undersized.push(...sizes.map(size => ({ viewport, lang, ...size })))
        await page.locator('.profile-heading').scrollIntoViewIfNeeded(); await measureLayout('profile')
        if (viewport.width === 390 || viewport.width === 1440 && viewport.height === 1000) await page.screenshot({ path: path.join(output, `profile-${lang}-${viewport.width}.png`), animations: 'disabled' })
        await page.locator('#process').scrollIntoViewIfNeeded(); await measureLayout('method')
        if (viewport.width === 390 || viewport.width === 1440 && viewport.height === 1000) await page.screenshot({ path: path.join(output, `method-${lang}-${viewport.width}.png`), animations: 'disabled' })
        await page.locator('.view-switch button').last().click()
        await expect(page.locator('.catalog-grid')).toHaveClass(/catalog-list/)
        await measureLayout('list')
        if (viewport.width === 390 || viewport.width === 1440 && viewport.height === 1000) await page.screenshot({ path: path.join(output, `list-${lang}-${viewport.width}.png`), animations: 'disabled' })
      }
    }
    report.responsive = { layouts, undersized, cropped, overflowErrors }
    assert.ok(!undersized.length && !cropped.length && !overflowErrors.length, `Responsive issues: ${JSON.stringify({ undersized, cropped, overflowErrors })}`)
    return layouts
  })

  await check('Touch input operates the featured work selector, methods and expandable capabilities', async () => {
    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true, hasTouch: true })
    const target = observe(await touchContext.newPage())
    try {
      await home('zh', '#top', target)
      await target.locator('.hero-selector button').nth(3).tap()
      await expect(target.locator('.hero-feature')).toHaveAttribute('href', '#/work/periastra')
      await target.locator('.method-selector button').nth(2).tap()
      await expect(target.locator('.method-content h3')).toHaveText(profileCopy.zh.methods[2].title)
      const details = target.locator('.capability-list details').nth(3)
      await details.locator('summary').tap()
      await expect(details).toHaveAttribute('open', '')
      await overflow(target)
      return { width: 390, touch: true, hero: true, method: true, capability: true }
    } finally { await touchContext.close() }
  })

  await check('Portrait loads near the desktop viewport, responds to local pointer movement, stops offscreen and requires a mobile tap', async () => {
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' })
    await desktopContext.addInitScript(() => {
      window.__portraitDrawCalls = 0
      for (const kind of [globalThis.WebGLRenderingContext, globalThis.WebGL2RenderingContext]) {
        if (!kind) continue
        for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
          const draw = kind.prototype[name]
          if (!draw) continue
          kind.prototype[name] = function (...args) { if (this.canvas.closest('.portrait-stage')) window.__portraitDrawCalls++; return draw.apply(this, args) }
        }
      }
    })
    const desktop = observe(await desktopContext.newPage())
    const desktopRequests = []
    desktop.on('request', request => { if (/\/models\/avatar\.glb(?:\?|$)/.test(request.url())) desktopRequests.push(request.url()) })
    let desktopEvidence
    try {
      await home('zh', '#works', desktop)
      // Observation exceeds the authored 900ms delay; remaining offscreen must not start a model load.
      await desktop.waitForTimeout(1200)
      assert.equal(desktopRequests.length, 0, 'Offscreen portrait loaded automatically')
      await expect(desktop.locator('.portrait-stage canvas')).toHaveCount(0)
      await desktop.locator('.portrait-medallion').evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await expect(desktop.locator('.portrait-stage')).toHaveClass(/is-live/, { timeout: 30000 })
      assert.equal(desktopRequests.length, 1)
      const canvas = desktop.locator('.portrait-stage canvas')
      const box = await canvas.boundingBox()
      assert.ok(box && box.width >= 50 && box.height >= 50)
      await desktop.mouse.move(box.x + box.width * .5, box.y + box.height * .5)
      await desktop.waitForTimeout(220)
      const beforePointer = await canvas.screenshot()
      await desktop.mouse.move(box.x + box.width * .88, box.y + box.height * .28)
      await desktop.waitForTimeout(300)
      const afterPointer = await canvas.screenshot({ path: path.join(output, 'portrait-desktop-live.png') })
      assert.ok(!beforePointer.equals(afterPointer), 'Moving the pointer within the portrait did not change its rendered image')
      const activeDraws = await desktop.evaluate(() => window.__portraitDrawCalls)
      assert.ok(activeDraws > 0, 'No WebGL drawing was observed')
      await desktop.locator('#works').evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await desktop.waitForTimeout(250)
      const stoppedBefore = await desktop.evaluate(() => window.__portraitDrawCalls)
      await desktop.waitForTimeout(450)
      const stoppedAfter = await desktop.evaluate(() => window.__portraitDrawCalls)
      assert.equal(stoppedAfter, stoppedBefore, 'The portrait kept drawing while far outside the viewport')
      await desktop.locator('.portrait-medallion').evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await desktop.locator('.scene-toggle').click()
      await desktop.waitForTimeout(1200)
      await expect(desktop.locator('.portrait-stage canvas')).toHaveCount(0)
      await expect(desktop.locator('.portrait-poster')).toBeVisible()
      desktopEvidence = { modelRequests: desktopRequests.length, pointerChangedPixels: true, activeDraws, stoppedBefore, stoppedAfter, staticFallback: true }
    } finally { await desktopContext.close() }

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', isMobile: true, hasTouch: true })
    const mobile = observe(await mobileContext.newPage())
    let mobileRequests = 0
    mobile.on('request', request => { if (/\/models\/avatar\.glb(?:\?|$)/.test(request.url())) mobileRequests++ })
    try {
      await home('zh', '#top', mobile)
      await mobile.locator('.portrait-medallion').evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }))
      await mobile.waitForTimeout(1200)
      assert.equal(mobileRequests, 0, 'Mobile portrait loaded before a deliberate tap')
      await expect(mobile.locator('.portrait-stage canvas')).toHaveCount(0)
      await mobile.locator('.scene-toggle').tap()
      await expect(mobile.locator('.portrait-stage')).toHaveClass(/is-live/, { timeout: 30000 })
      assert.equal(mobileRequests, 1)
      await mobile.locator('.portrait-stage canvas').screenshot({ path: path.join(output, 'portrait-mobile-live.png') })
      await mobile.locator('.scene-toggle').tap()
      await expect(mobile.locator('.portrait-stage canvas')).toHaveCount(0)
      await expect(mobile.locator('.portrait-poster')).toBeVisible()
      return { desktop: desktopEvidence, mobile: { modelRequests: mobileRequests, deliberateTap: true, staticFallback: true } }
    } finally { await mobileContext.close() }
  })

  await check('Case guide and sticky outline remain hittable and reveal unobscured headings after scrolling', async () => {
    const states = []
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 720 }]) {
      await page.setViewportSize(viewport)
      for (const lang of ['zh', 'en']) for (const slug of ['hermes', 'resume-formatter']) {
        await page.goto(url(lang, `#/work/${slug}`))
        await expect(page.locator('.case-header h1')).toHaveText(titles[lang][slug])
        await page.evaluate(() => document.fonts.ready)
        for (const [surface, index] of [['.case-reading', 3], ['.case-outline', 1], ['.case-outline', 4]]) {
          const button = page.locator(`${surface} button`).nth(index)
          if (surface === '.case-reading') await button.evaluate(node => node.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' }))
          else await button.scrollIntoViewIfNeeded()
          await paint()
          const hit = await button.evaluate(node => {
            const rect = node.getBoundingClientRect(), x = rect.x + rect.width / 2, y = rect.y + rect.height / 2
            const target = document.elementFromPoint(x, y)
            return { matches: !!target && node.contains(target), x, y, target: target?.className }
          })
          assert.ok(hit.matches, `Reading button is obscured before pointer click: ${JSON.stringify({ viewport, lang, slug, surface, index, hit })}`)
          await button.click()
          const heading = page.locator(`#case-section-${index}`)
          await expect(heading).toBeFocused()
          await paint()
          const position = await heading.evaluate(node => ({ headingTop: node.getBoundingClientRect().top, headingBottom: node.getBoundingClientRect().bottom, headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom, outlineTop: document.querySelector('.case-outline').getBoundingClientRect().top, outlineBottom: document.querySelector('.case-outline').getBoundingClientRect().bottom, viewportHeight: innerHeight }))
          assert.ok(position.outlineTop >= position.headerBottom - 2, `Sticky header covers the outline: ${JSON.stringify(position)}`)
          assert.ok(position.headingTop >= Math.max(position.headerBottom, position.outlineBottom) - 2 && position.headingTop < position.viewportHeight - 44, `Focused heading is obscured or outside the viewport: ${JSON.stringify({ viewport, lang, slug, surface, index, position })}`)
          states.push({ viewport, lang, slug, surface, section: index, position })
        }
        if (slug === 'hermes') await page.screenshot({ path: path.join(output, `case-outline-${lang}-${viewport.width}.png`), animations: 'disabled' })
      }
    }
    return states
  })

  await check('New hero, expanded profile, design methods, list and contact pass automated accessibility checks', async () => {
    const failures = []
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
      for (const lang of ['zh', 'en']) {
        await home(lang)
        for (const [label, selector] of [['hero', '.studio-hero'], ['profile', '#about'], ['method', '#process'], ['list', '#works'], ['contact', '#contact']]) {
          if (label === 'profile') for (const details of await page.locator('.capability-list details').all()) { if (await details.getAttribute('open') === null) await details.locator('summary').press('Enter') }
          if (label === 'method') await page.locator('.method-selector button').last().press('Enter')
          if (label === 'list') await page.locator('.view-switch button').last().click()
          await page.locator(selector).scrollIntoViewIfNeeded()
          try { await axe(`${label}-${lang}-${width}`) } catch (error) { failures.push(error.message) }
        }
      }
    }
    assert.deepEqual(failures, [], failures.join('\n'))
    return report.accessibility.map(item => ({ label: item.label, violations: item.violations.length, incomplete: item.incomplete }))
  })

  await check('v4 interactions produce no uncaught errors or unexpected failed requests', async () => {
    assert.deepEqual(Buffer.from(await (await fetch(base)).arrayBuffer()), index, 'The production build changed during this run; rerun against a stable build')
    assert.deepEqual(report.runtimeErrors, [], JSON.stringify(report.runtimeErrors))
    assert.deepEqual(report.failedRequests, [], JSON.stringify(report.failedRequests))
    assert.deepEqual(report.consoleErrors, [], JSON.stringify(report.consoleErrors))
    return { runtimeErrors: 0, failedRequests: 0, consoleErrors: 0 }
  })
} finally {
  await context.close(); await browser.close()
  report.finished = new Date().toISOString()
  report.summary = { passed: report.checks.filter(check => check.passed).length, failed: report.checks.filter(check => !check.passed).length, accessibilityStates: report.accessibility.length }
  await persist()
}
console.log(JSON.stringify({ ...report.summary, report: path.join(output, 'browser-results.json') }))
if (report.summary.failed) process.exitCode = 1
