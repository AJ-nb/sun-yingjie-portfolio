const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')

const root = path.resolve(__dirname, '../..')
const webRequire = createRequire(path.join(root, 'web/package.json'))
const { chromium } = webRequire('@playwright/test')
const publication = require(path.join(root, 'web/src/data/publication.json'))
const base = new URL(process.env.BASE_URL || process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:5176').href.replace(/\/?$/, '/')
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || 'design/qa-v5')
const report = { startedAt: new Date().toISOString(), baseUrl: base, checks: [] }
fs.mkdirSync(output, { recursive: true })

async function browserExecutable() {
  if (process.env.PLAYWRIGHT_BROWSER) return process.env.PLAYWRIGHT_BROWSER
  if (process.platform === 'win32') {
    const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    if (fs.existsSync(edge)) return edge
    throw new Error(`Microsoft Edge is required for Windows QA: ${edge}`)
  }
  if (fs.existsSync(chromium.executablePath())) return undefined
  throw new Error('Playwright Chromium is required for non-Windows QA. Run npx playwright install chromium in web/.')
}

async function check(name, operation, page) {
  const started = Date.now()
  try {
    const detail = await operation()
    report.checks.push({ name, passed: true, milliseconds: Date.now() - started, detail })
    console.log(`PASS ${name}`)
  } catch (error) {
    const screenshot = `failure-${String(report.checks.length + 1).padStart(2, '0')}.png`
    if (page) await page.screenshot({ path: path.join(output, screenshot), fullPage: false }).catch(() => {})
    report.checks.push({ name, passed: false, milliseconds: Date.now() - started, error: error.stack || error.message, screenshot })
    console.error(`FAIL ${name}: ${error.message}`)
  }
  fs.writeFileSync(path.join(output, 'frontend-browser.json'), JSON.stringify(report, null, 2))
}

async function waitForServer() {
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    try { if ((await fetch(base, { signal: AbortSignal.timeout(1500) })).ok) return } catch { /* Retry while Vite starts. */ }
    await new Promise(resolve => setTimeout(resolve, 400))
  }
  throw new Error(`Site unavailable after 30 seconds: ${base}`)
}

async function main() {
  await waitForServer()
  const executablePath = await browserExecutable()
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) })
  report.browserVersion = browser.version()
  report.browserSource = executablePath || 'Playwright Chromium'

  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 }, reducedMotion: 'reduce' })
    await page.goto(base)
    await page.locator('.v5-selected-case').first().waitFor()
    await check(`responsive layout ${width}px`, async () => {
      const overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))
      assert.ok(overflow.document <= overflow.viewport + 1 && overflow.body <= overflow.viewport + 1, JSON.stringify(overflow))
      assert.equal(await page.locator('.v5-selected-case').count(), publication.selected.length)
      assert.equal(await page.locator('video').count(), 0, 'Reduced motion must render static posters without video elements')
      const order = await page.locator('.v5-selected-case').evaluateAll(cards => cards.map(card => card.className.match(/case-([\w-]+)/)?.[1]))
      assert.deepEqual(order, publication.selected.map(item => item.slug))
      const periastra = await page.locator('.case-periastra .v5-case-image img').getAttribute('src')
      assert.equal(new URL(periastra, base).pathname, '/works/brand/periastra/final-wordmark.png')
      return { overflow, selectedOrder: order }
    }, page)
    await page.screenshot({ path: path.join(output, `hero-${width}.png`), fullPage: false })

    if (width === 390) {
      await check('mobile menu focus and contact navigation', async () => {
        const menu = page.getByRole('button', { name: '打开菜单' })
        await menu.click()
        assert.equal(await page.locator('#main-navigation a').first().evaluate(element => document.activeElement === element), true)
        await page.keyboard.press('Escape')
        assert.equal(await menu.evaluate(element => document.activeElement === element), true)
        await menu.click()
        await page.locator('#main-navigation').getByRole('link', { name: '联系', exact: true }).click()
        assert.equal(new URL(page.url()).hash, '#contact')
        assert.equal(await page.locator('#contact').evaluate(element => document.activeElement === element), true)
      }, page)
      await page.screenshot({ path: path.join(output, 'footer-390.png'), fullPage: false })
    }
    await page.close()
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  const runtimeErrors = []
  page.on('pageerror', error => runtimeErrors.push(error.message))
  await page.goto(base)
  await page.locator('.v5-selected-case').first().waitFor()

  await check('hero shortcuts and document downloads', async () => {
    const shortcuts = page.locator('.hero-pills a')
    assert.equal(await shortcuts.count(), 4)
    assert.deepEqual(await shortcuts.evaluateAll(links => links.map(link => new URL(link.href).pathname || new URL(link.href).hash)), [
      '/', '/downloads/sun-yingjie-selected-portfolio.pdf', '/downloads/sun-yingjie-resume.pdf', '/'
    ])
    assert.deepEqual(await shortcuts.evaluateAll(links => links.map(link => new URL(link.href).hash)), ['#selected', '', '', '#contact'])
    for (const link of await page.locator('.hero-pills a[download], .footer-downloads a[download]').all()) {
      const href = await link.getAttribute('href')
      const response = await page.request.get(new URL(href, base).href)
      assert.ok(response.ok(), `${href} returned ${response.status()}`)
    }
  }, page)

  await check('archive controls, case route, history and lightbox', async () => {
    await page.locator('#works').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: '工业与产品', exact: true }).click()
    await page.getByRole('searchbox').fill('管道')
    assert.equal(await page.locator('.catalog-grid .work-card').count(), 1)
    await page.getByRole('button', { name: '列表', exact: true }).click()
    assert.match(await page.locator('.catalog-grid').getAttribute('class'), /catalog-list/)
    await page.getByRole('searchbox').fill('')
    await page.getByRole('button', { name: '全部作品', exact: true }).click()
    const entry = page.locator('.v5-case-image').first()
    const focusKey = await entry.getAttribute('data-return-focus')
    await entry.click()
    await page.locator('.case-header h1').waitFor()
    assert.equal(new URL(page.url()).hash, `#/work/${publication.selected[0].slug}`)
    await page.locator('.case-cover').click()
    await page.locator('.yarl__root').waitFor()
    await page.getByRole('button', { name: '关闭' }).click()
    await page.locator('.case-toolbar button').click()
    await page.locator('.v5-selected-case').first().waitFor()
    assert.equal(await page.evaluate(key => document.activeElement?.getAttribute('data-return-focus') === key, focusKey), true)
    assert.match(await page.locator('.catalog-grid').getAttribute('class'), /catalog-list/)
    assert.equal(await page.getByRole('searchbox').inputValue(), '')
    assert.equal(await page.getByRole('button', { name: '全部作品', exact: true }).getAttribute('aria-pressed'), 'true')
    return { route: publication.selected[0].slug, focusKey, lightbox: true }
  }, page)

  await check('desktop original-video behavior and three-column footer', async () => {
    await page.goto(base)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForFunction(() => document.querySelector('.original-video-hero video')?.readyState >= 2)
    await page.mouse.move(100, 300); await page.waitForTimeout(60)
    await page.mouse.move(1100, 300); await page.waitForTimeout(450)
    const forward = await page.locator('.original-video-hero video').evaluate(video => video.currentTime)
    await page.mouse.move(300, 300); await page.waitForTimeout(450)
    const reverse = await page.locator('.original-video-hero video').evaluate(video => video.currentTime)
    assert.ok(forward > 0.5 && reverse < forward, JSON.stringify({ forward, reverse }))
    assert.equal(await page.locator('.original-video-hero video').evaluate(video => video.paused), true)
    await page.locator('.original-video-footer').scrollIntoViewIfNeeded()
    await page.waitForFunction(() => document.querySelector('.original-video-footer video')?.readyState >= 2)
    assert.equal(await page.locator('.studio-contact > .footer-column').count(), 2)
    assert.equal(await page.locator('.studio-contact > .footer-wordmark').count(), 1)
    assert.equal(await page.locator('.original-video-footer').evaluate(element => getComputedStyle(element).position), 'absolute')
    assert.equal(await page.locator('.original-video-footer video').evaluate(video => video.paused), true)
    const referenceHref = await page.locator('.footer-reference').getAttribute('href')
    assert.equal(new URL(referenceHref, page.url()).pathname, '/OPEN_SOURCE_REFERENCES.md')
    return { forward, reverse }
  }, page)
  await page.screenshot({ path: path.join(output, 'footer-1440.png'), fullPage: false })

  await check('English route', async () => {
    await page.goto(`${base}?lang=en`)
    assert.equal(await page.locator('html').getAttribute('lang'), 'en')
    assert.match(await page.locator('h1').innerText(), /Yingjie Sun/)
    assert.equal(await page.locator('.footer-reference').innerText(), 'Open-source projects & references')
  }, page)
  await check('no runtime errors', async () => assert.deepEqual(runtimeErrors, []), page)
  await page.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' })
  await mobile.goto(base)
  await check('mobile explicit hero playback and footer loop placement', async () => {
    assert.equal(await mobile.locator('.original-video-hero video').evaluate(video => video.paused), true)
    await mobile.getByRole('button', { name: '播放短片' }).click()
    await mobile.waitForFunction(() => !document.querySelector('.original-video-hero video').paused)
    await mobile.locator('.original-video-footer').scrollIntoViewIfNeeded()
    await mobile.waitForFunction(() => !document.querySelector('.original-video-footer video').paused)
    assert.equal(await mobile.locator('.original-video-footer video').evaluate(video => video.loop && video.muted), true)
    assert.equal(await mobile.locator('.original-video-footer').evaluate(element => getComputedStyle(element).position), 'relative')
    const order = await mobile.locator('.studio-contact').evaluate(footer => [...footer.children].map(child => ({ className: child.className, top: child.getBoundingClientRect().top })))
    const videoTop = order.find(item => item.className.includes('original-video-footer')).top
    assert.ok(order.filter(item => !item.className.includes('original-video')).every(item => item.top < videoTop), JSON.stringify(order))
    return { order }
  }, mobile)
  await mobile.screenshot({ path: path.join(output, 'footer-video-390.png'), fullPage: false })
  await mobile.close()

  await browser.close()
  report.finishedAt = new Date().toISOString()
  fs.writeFileSync(path.join(output, 'frontend-browser.json'), JSON.stringify(report, null, 2))
  const failed = report.checks.filter(item => !item.passed)
  console.log(`${report.checks.length - failed.length}/${report.checks.length} checks passed`)
  if (failed.length) process.exitCode = 1
}

main().catch(error => { console.error(error); process.exitCode = 1 })
