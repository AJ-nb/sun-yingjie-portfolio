const { createRequire } = require('node:module')
const path = require('node:path')

const webRequire = createRequire(path.join(__dirname, '..', 'web', 'package.json'))
const { chromium } = webRequire('@playwright/test')
const AxeBuilder = webRequire('@axe-core/playwright').default

const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:5177'
const routes = ['/', '/work', '/work/hermes', '/tools/lensflow', '/lab/yantai', '/research', '/about', '/resume', '/contact', '/404']
const widths = [390, 768, 1280, 1440]

async function main() {
  const executablePath = process.env.QA_BROWSER_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  const browser = await chromium.launch({ headless: true, executablePath })
  const report = { origin, checkedAt: new Date().toISOString(), routes: [], accessibility: [], interactions: [] }
  const failures = []

  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    for (const route of routes) {
      const page = await context.newPage()
      const consoleErrors = []
      page.on('console', message => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })
      page.on('pageerror', error => consoleErrors.push(error.message))
      const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' })
      const title = await page.title()
      const h1 = (await page.locator('h1').first().textContent())?.trim() || ''
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      const result = { width, route, status: response?.status(), title, h1, overflow, consoleErrors }
      report.routes.push(result)
      if (response?.status() !== 200 || !h1 || overflow > 1 || consoleErrors.length) failures.push(result)
      await page.close()
    }
    await context.close()
  }

  for (const route of ['/', '/work/hermes', '/resume', '/contact']) {
    for (const width of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
      const page = await context.newPage()
      await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' })
      const result = await new AxeBuilder({ page }).analyze()
      const serious = result.violations.filter(item => ['serious', 'critical'].includes(item.impact))
      report.accessibility.push({ route, width, serious: serious.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.length })) })
      if (serious.length) failures.push({ route, width, accessibility: serious })
      await context.close()
    }
  }

  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] })
    const page = await context.newPage()
    await page.goto(`${origin}/work/hermes`, { waitUntil: 'networkidle' })
    const cover = page.getByRole('button', { name: /放大项目封面/ })
    await cover.click()
    await page.locator('.yarl__container').waitFor({ state: 'attached' })
    const lightboxOpened = await page.locator('.yarl__container').count() === 1
    await page.keyboard.press('Escape')
    await page.locator('.yarl__root').waitFor({ state: 'detached' })
    const focusRestored = await cover.evaluate(element => element === document.activeElement)
    report.interactions.push({ name: 'case-lightbox', lightboxOpened, focusRestored })
    if (!lightboxOpened || !focusRestored) failures.push({ interaction: 'case-lightbox', lightboxOpened, focusRestored })

    await page.goto(`${origin}/contact`, { waitUntil: 'networkidle' })
    const copyButton = page.getByRole('button', { name: /复制邮箱/ })
    await copyButton.click()
    const copied = await page.getByRole('button', { name: /已复制/ }).isVisible()
    report.interactions.push({ name: 'copy-email', copied })
    if (!copied) failures.push({ interaction: 'copy-email', copied })

    await page.goto(`${origin}/work/no-such`, { waitUntil: 'networkidle' })
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    const invalidH1 = (await page.locator('h1').textContent())?.trim()
    report.interactions.push({ name: 'invalid-route', robots, h1: invalidH1 })
    if (!robots?.includes('noindex') || invalidH1 !== 'OBJECT NOT FOUND') failures.push({ interaction: 'invalid-route', robots, invalidH1 })
    await context.close()
  }

  await browser.close()
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  if (failures.length) {
    process.stderr.write(`QA failures: ${JSON.stringify(failures, null, 2)}\n`)
    process.exitCode = 1
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
