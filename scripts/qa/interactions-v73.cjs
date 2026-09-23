const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const { chromium } = createRequire(path.join(root, 'web/package.json'))('@playwright/test')
const base = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:5176'
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || '.production-runtime/v73')
fs.mkdirSync(output, { recursive: true })
const report = { base, startedAt: new Date().toISOString(), browserArgs: ['--enable-smooth-scrolling'], environmentNote: 'This Windows Edge host performs native smooth scroll in one jump with its default settings, with and without preventScroll focus. A separate native baseline comparison is recorded in .production-runtime/v73/smooth-host-comparison.json. The QA browser flag exercises intermediate scroll frames without changing application or user settings.', checks: [] }
async function focusedTarget(page, id) {
  await page.waitForFunction(target => document.activeElement?.id === target, id)
  return page.evaluate(target => {
    const rect = document.getElementById(target).getBoundingClientRect()
    return { id: document.activeElement.id, top: rect.top, bottom: rect.bottom, viewport: innerHeight, headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom, historyLength: history.length, hash: location.hash }
  }, id)
}
;(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-smooth-scrolling'], executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' })
  async function check(name, width, run, route = '', reducedMotion = 'reduce') {
    const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion }), entry = { name }
    try {
      await page.goto(new URL(route || '/', base).href, { waitUntil: 'domcontentloaded' })
      await page.locator(route.startsWith('/#/work/') ? '.case-header h1' : '.site-header').waitFor()
      entry.detail = await run(page)
      entry.pass = true
    } catch (error) {
      entry.pass = false; entry.error = error.stack || error.message
      await page.screenshot({ path: path.join(output, `interaction-${name}.png`) }).catch(() => {})
    }
    report.checks.push(entry)
    fs.writeFileSync(path.join(output, 'interactions-regression.json'), JSON.stringify(report, null, 2))
    console.log(entry.pass ? 'PASS' : 'FAIL', name, entry.error || '')
    await page.close()
  }
  await check('anchor-target-and-history', 1280, async page => {
    await page.locator('#main-navigation a[href="#selected"]').click()
    const selected = await focusedTarget(page, 'selected')
    assert.ok(selected.top >= selected.headerBottom - 1 && selected.top < selected.viewport)
    await page.locator('#main-navigation a[href="#products"]').click()
    const products = await focusedTarget(page, 'products')
    assert.equal(products.historyLength, selected.historyLength + 1)
    assert.ok(products.top >= products.headerBottom - 1 && products.top < products.viewport)
    for (let i = 0; i < 3; i++) await page.locator('#main-navigation a[href="#products"]').click()
    const repeated = await focusedTarget(page, 'products')
    assert.equal(repeated.historyLength, products.historyLength)
    await page.goBack()
    await page.waitForURL('**/#selected')
    await page.waitForTimeout(150)
    const returned = await page.evaluate(() => ({ hash: location.hash, top: document.getElementById('selected').getBoundingClientRect().top, scrollY }))
    assert.ok(Math.abs(returned.top - selected.top) < 2)
    return { selected, products, repeated, returned }
  })
  await check('archive-collapse-focus', 1280, async page => {
    await page.locator('#main-navigation a[href="#works"]').click()
    await focusedTarget(page, 'works')
    await page.locator('.archive-expand').click()
    assert.equal(await page.locator('.catalog-grid .work-card').count(), 30)
    await page.locator('.archive-expand').click()
    assert.equal(await page.locator('.catalog-grid .work-card').count(), 8)
    const target = await focusedTarget(page, 'works')
    assert.ok(target.top >= target.headerBottom - 1 && target.top < target.viewport)
    await page.keyboard.press('Tab')
    assert.equal(await page.evaluate(() => document.activeElement?.closest('.category-list') !== null), true)
    return { target, nextControl: await page.evaluate(() => document.activeElement.textContent) }
  })
  await check('mobile-case-outline-escape-and-anchor', 390, async page => {
    const toggle = page.locator('.outline-toggle')
    await toggle.click()
    await page.locator('#case-outline-links button').nth(1).focus()
    await page.keyboard.press('Escape')
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false')
    assert.equal(await toggle.evaluate(element => document.activeElement === element), true)
    await toggle.click()
    await page.locator('#case-outline-links button').nth(1).click()
    const heading = await focusedTarget(page, 'case-section-1')
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false')
    const outlineHeight = await page.locator('.case-outline').evaluate(element => element.getBoundingClientRect().height)
    assert.ok(heading.top >= heading.headerBottom + outlineHeight - 1, JSON.stringify({ heading, outlineHeight }))
    assert.ok(heading.top < heading.viewport)
    return { heading, outlineHeight, escapeRestoresFocus: true }
  }, '/#/work/hermes')
  await check('smooth-anchor-and-case-return', 1280, async page => {
    await page.evaluate(() => {
      window.__scrollProof = { start: scrollY, samples: [], ended: false }
      window.addEventListener('scroll', () => window.__scrollProof.samples.push(scrollY), { passive: true })
      window.addEventListener('scrollend', () => { window.__scrollProof.ended = true }, { passive: true })
    })
    await page.locator('#main-navigation a[href="#selected"]').click()
    await page.waitForFunction(() => window.__scrollProof.ended && window.__scrollProof.samples.length > 2)
    const scroll = await page.evaluate(() => ({ ...window.__scrollProof, final: scrollY }))
    assert.ok(scroll.samples.some(y => y > scroll.start + 2 && y < scroll.final - 2), JSON.stringify(scroll))
    const selected = await focusedTarget(page, 'selected')
    assert.ok(selected.top >= selected.headerBottom - 1 && selected.top < selected.viewport)
    await page.locator('#main-navigation a[href="#selected"]').click()
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const repeated = await focusedTarget(page, 'selected')
    assert.equal(repeated.historyLength, selected.historyLength)
    const card = page.locator('.v7-project-image').first()
    const key = await card.getAttribute('data-return-focus')
    await card.evaluate(element => element.addEventListener('click', () => { window.__caseReturnTop = scrollY }, { once: true, capture: true }))
    await card.click()
    await page.locator('.case-header h1').waitFor()
    await page.locator('.case-toolbar button').click()
    await page.waitForFunction(key => document.activeElement?.dataset.returnFocus === key && Math.abs(scrollY - window.__caseReturnTop) < 2, key)
    const returned = await page.evaluate(() => ({ top: scrollY, expectedTop: window.__caseReturnTop, focusKey: document.activeElement.dataset.returnFocus }))
    return { scroll, selected, repeated, returned }
  }, '', 'no-preference')
  await browser.close()
  if (report.checks.some(check => !check.pass)) process.exitCode = 1
})().catch(error => { console.error(error); process.exitCode = 1 })
