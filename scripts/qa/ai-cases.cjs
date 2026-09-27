const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const req = createRequire(path.join(root, 'web/package.json'))
const { chromium, expect } = req('@playwright/test')
const AxeBuilder = req('@axe-core/playwright').default
const { createHash } = require('node:crypto')
const base = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:4181/sun-yingjie-portfolio'
const output = path.join(root, '.production-runtime/qa-ai-cases')
fs.mkdirSync(output, { recursive: true })
const slugs = ['ink-realm', 'character-consistency', 'portrait-lighting']
const checks = [], errors = []
async function check(name, run) { try { await run(); checks.push({ name, passed: true }) } catch (e) { checks.push({ name, passed: false, error: e.message }); console.error(name, e.message) } }
async function main() {
  const assets = JSON.parse(fs.readFileSync(path.join(root, 'web/src/data/ai-case-assets.json'))).assets
  await check('all supplied originals retain their recorded bytes', async () => {
    assert.equal(assets.length, 16)
    for (const item of assets) assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, 'web/public', item.path))).digest('hex'), item.sha256)
  })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await context.newPage()
  page.on('pageerror', e => errors.push(e.message))
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const lang of ['zh', 'en']) for (const slug of slugs) await check(`${lang}/${slug} ${width}px images, layout and accessibility`, async () => {
      await page.goto(`${base}/${lang === 'en' ? 'en/' : ''}work/${slug}`, { waitUntil: 'networkidle' })
      assert.equal(await page.locator('h1').count(), 1)
      const article = page.locator('.design-os-detail-body')
      assert(!/未知|Unknown|TBD|TODO/.test(await article.innerText()))
      const originals = article.locator(`img[src*="/works/${slug}/"]`)
      assert.equal(await originals.count(), slug === 'ink-realm' ? 9 : slug === 'character-consistency' ? 5 : 9)
      // Lazy images must load as the reader reaches them, at their original proportions.
      for (const im of await originals.all()) {
        await im.scrollIntoViewIfNeeded()
        await expect.poll(() => im.evaluate(n => n.complete && n.naturalWidth > 0)).toBeTruthy()
        assert.equal(await im.evaluate(n => getComputedStyle(n).objectFit), 'contain')
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
      assert.deepEqual(result.violations.map(v => v.id), [])
      await page.screenshot({ path: path.join(output, `${lang}-${slug}-${width}.png`), fullPage: true })
    })
  }
  await check('video plays, seeks and pauses with complete source prompt', async () => {
    await page.goto(base+'/work/ink-realm', { waitUntil: 'networkidle' })
    const video = page.locator('video')
    assert.equal(await video.getAttribute('autoplay'), null)
    assert.equal(await video.locator('track').count(), 2)
    await expect.poll(() => video.evaluate(n => n.duration)).toBeGreaterThan(30)
    await video.evaluate(n => n.play())
    await expect.poll(() => video.evaluate(n => n.currentTime)).toBeGreaterThan(.1)
    await video.evaluate(n => { n.pause(); n.currentTime = 26 })
    await expect.poll(() => video.evaluate(n => n.currentTime)).toBeGreaterThan(25)
    assert(await video.evaluate(n => n.paused))
    await page.locator('.design-os-detail-body details summary').click()
    const prompt = fs.readFileSync(path.join(root,'web/public/works/ink-realm/prompt.txt'),'utf8').trim()
    assert.equal((await page.locator('.case-prompt pre').textContent()).trim().replace(/\r\n/g, '\n'), prompt.replace(/\r\n/g, '\n'))
    await page.getByRole('button', { name: '复制提示词', exact: true }).click()
    await expect(page.getByRole('status')).toContainText('已复制')
    assert.equal((await page.evaluate(() => navigator.clipboard.readText())).trim().replace(/\r\n/g, '\n'), prompt.replace(/\r\n/g, '\n'))
  })
  await check('clipboard-denied path selects the full prompt', async () => {
    await context.clearPermissions()
    await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied') } } }) })
    await page.getByRole('button', { name: '复制提示词', exact: true }).click()
    await expect(page.getByRole('status')).toContainText('手动复制')
    assert((await page.evaluate(() => window.getSelection()?.toString().length)) > 4000)
  })
  await check('original image zoom closes and restores keyboard focus', async () => {
    await page.goto(base+'/work/character-consistency', { waitUntil: 'networkidle' })
    const trigger = page.locator('.design-os-inline-media button').nth(1)
    await trigger.click(); await page.locator('.yarl__root').waitFor(); await page.keyboard.press('Escape'); await expect(trigger).toBeFocused()
  })
  await context.close()
  const nojs = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await nojs.newPage()
  for (const slug of slugs) await check(slug+' readable without JavaScript', async () => {
    await staticPage.goto(base+'/work/'+slug)
    assert((await staticPage.locator('main').innerText()).length > 700)
    if (slug === 'ink-realm') { await staticPage.locator('.design-os-detail-body details summary').click(); assert(await staticPage.locator('.design-os-detail-body details').evaluate(n => n.open)) }
  })
  await nojs.close(); await browser.close()
  checks.push({ name: 'no browser runtime errors', passed: errors.length === 0, errors })
  const report = { passed: checks.every(c=>c.passed), checks }
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2))
  console.log(JSON.stringify({passed:report.passed,checks:checks.length,failures:checks.filter(c=>!c.passed)}))
  if (!report.passed) process.exitCode=1
}
main().catch(e=>{console.error(e);process.exitCode=1})
