const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const repository = path.resolve(__dirname, '../..')
const repoRequire = createRequire(path.join(repository, 'web/package.json'))
const { chromium } = repoRequire('@playwright/test')
const base = new URL(process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:5176/')
const output = path.join(repository, 'design/qa-v7/interactions')
const report = { startedAt: new Date().toISOString(), base: base.href, checks: [], runtimeErrors: [] }
fs.mkdirSync(output, { recursive: true })

const route = hash => { const url = new URL(base); url.hash = hash; return url.href }
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))

async function focusSnapshot(page) {
  return page.evaluate(() => ({
    hash: location.hash,
    scrollY,
    id: document.activeElement?.id,
    tag: document.activeElement?.tagName,
    text: document.activeElement?.textContent?.trim().slice(0, 100),
  }))
}

async function check(browser, name, viewport, run) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  page.on('pageerror', error => report.runtimeErrors.push({ check: name, message: error.message }))
  try {
    const detail = await run(page)
    report.checks.push({ name, passed: true, detail })
    console.log('PASS ' + name)
  } catch (error) {
    report.checks.push({ name, passed: false, error: error.stack || error.message, state: await focusSnapshot(page).catch(() => null) })
    await page.screenshot({ path: path.join(output, 'failure-' + report.checks.length + '.png'), fullPage: false }).catch(() => {})
    console.error('FAIL ' + name + ': ' + error.message)
  } finally {
    await context.close()
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
  }
}

async function destinationHasFocus(page, target) {
  await page.waitForFunction(id => document.activeElement?.id === id, target)
  assert.equal(new URL(page.url()).hash, '#' + target)
  const snapshot = await focusSnapshot(page)
  assert.equal(snapshot.id, target)
  return snapshot
}

async function main() {
  const edge = process.env.PLAYWRIGHT_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  const browser = await chromium.launch({ headless: true, executablePath: edge })
  const desktop = { width: 1280, height: 720 }
  const mobile = { width: 390, height: 844 }
  try {
    await check(browser, 'Hero keyboard navigation transfers focus and stays in the chosen section', desktop, async page => {
      await page.goto(route(''))
      await page.locator('.hero-pills a[href="#selected"]').focus()
      await page.keyboard.press('Enter')
      const entered = await destinationHasFocus(page, 'selected')
      assert.ok(entered.scrollY > 500, JSON.stringify(entered))
      await page.keyboard.press('Tab')
      await settle(page)
      const tabbed = await page.evaluate(() => ({
        scrollY,
        inDestination: document.querySelector('#selected').contains(document.activeElement),
        inHero: Boolean(document.activeElement?.closest('.mainframe-hero')),
        focus: document.activeElement?.outerHTML.slice(0, 180),
      }))
      assert.ok(tabbed.inDestination, JSON.stringify(tabbed))
      assert.equal(tabbed.inHero, false, JSON.stringify(tabbed))
      assert.ok(tabbed.scrollY > 500, JSON.stringify(tabbed))
      return { entered, tabbed }
    })

    await check(browser, 'Mobile shortcuts transfer focus to their destination', mobile, async page => {
      await page.goto(route(''))
      const details = []
      for (const target of ['selected', 'works', 'downloads', 'contact']) {
        await page.locator('.mobile-dock a[href="#' + target + '"]').click()
        details.push(await destinationHasFocus(page, target))
      }
      return details
    })

    await check(browser, 'Mobile case outline scroll uses the collapsed controls height', mobile, async page => {
      await page.goto(route('/work/hermes'))
      await page.locator('.case-outline').waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.locator('.outline-toggle').click()
      assert.equal(await page.locator('.outline-toggle').getAttribute('aria-expanded'), 'true')
      const expanded = await page.locator('.case-outline').evaluate(node => node.getBoundingClientRect().height)
      await page.locator('#case-outline-links button').nth(2).click()
      await settle(page)
      await page.waitForFunction(() => document.activeElement?.id === 'case-section-2')
      const geometry = await page.evaluate(() => {
        const header = document.querySelector('.site-header').getBoundingClientRect().height
        const outline = document.querySelector('.case-outline').getBoundingClientRect().height
        const heading = document.getElementById('case-section-2').getBoundingClientRect().top
        return { header, outline, heading, expected: header + outline + 20, delta: heading - header - outline - 20 }
      })
      assert.equal(await page.locator('.outline-toggle').getAttribute('aria-expanded'), 'false')
      assert.ok(expanded > geometry.outline + 30, JSON.stringify({ expanded, ...geometry }))
      assert.ok(Math.abs(geometry.delta) <= 6, JSON.stringify(geometry))
      return { expanded, ...geometry }
    })

    await check(browser, 'Selected download edition survives case return and reload', desktop, async page => {
      await page.goto(route('downloads'))
      await page.locator('.download-variants button').filter({ hasText: /^品牌设计$/ }).click()
      const selectedFiles = await page.locator('.v7-download-list a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))
      assert.ok(selectedFiles.length >= 2)
      assert.ok(selectedFiles.every(href => href.includes('-brand.')), JSON.stringify(selectedFiles))
      const caseLink = page.locator('.v7-project-image[href="#/work/hermes"]')
      await caseLink.click()
      await page.locator('.case-header h1').waitFor()
      await page.locator('.case-toolbar button').click()
      await page.locator('.download-variants').waitFor()
      assert.equal(await page.locator('.download-variants [aria-pressed="true"]').innerText(), '品牌设计')
      const returnFiles = await page.locator('.v7-download-list a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))
      assert.deepEqual(returnFiles, selectedFiles)
      await page.reload()
      await page.locator('.download-variants').waitFor()
      assert.equal(await page.locator('.download-variants [aria-pressed="true"]').innerText(), '品牌设计')
      const reloadedFiles = await page.locator('.v7-download-list a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))
      assert.deepEqual(reloadedFiles, selectedFiles)
      return { selectedFiles, returnFiles, reloadedFiles }
    })

    await check(browser, 'Case to brand navigation focuses the newly mounted destination', desktop, async page => {
      await page.goto(route('/work/hermes'))
      await page.locator('.case-header h1').waitFor()
      await page.locator('#main-navigation a[href="#selected"]').focus()
      await page.keyboard.press('Enter')
      const result = await destinationHasFocus(page, 'selected')
      await page.keyboard.press('Tab')
      assert.ok(await page.evaluate(() => document.querySelector('#selected').contains(document.activeElement)))
      return result
    })

    await check(browser, 'Case to downloads via the mobile menu focuses the newly mounted destination', mobile, async page => {
      await page.goto(route('/work/hermes'))
      await page.locator('.case-header h1').waitFor()
      await page.getByRole('button', { name: '打开菜单', exact: true }).click()
      await page.locator('#main-navigation a[href="#downloads"]').click()
      const result = await destinationHasFocus(page, 'downloads')
      assert.equal(await page.getByRole('button', { name: '打开菜单', exact: true }).getAttribute('aria-expanded'), 'false')
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
      return result
    })
  } finally {
    await browser.close()
  }
  report.completedAt = new Date().toISOString()
  report.passed = report.checks.every(check => check.passed) && report.runtimeErrors.length === 0
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length, runtimeErrors: report.runtimeErrors.length, report: path.join(output, 'report.json') }))
  if (!report.passed) process.exitCode = 1
}
main().catch(error => { console.error(error); process.exitCode = 1 })
