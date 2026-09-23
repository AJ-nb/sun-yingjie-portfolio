const { createRequire } = require('node:module')
const path = require('node:path')
const fs = require('node:fs')
const root = path.resolve(__dirname, '../..')
const req = createRequire(path.join(root, 'web/package.json'))
const { chromium } = req('@playwright/test')
const AxeBuilder = req('@axe-core/playwright').default
const base = new URL(process.env.PORTFOLIO_QA_URL || process.env.BASE_URL || 'http://127.0.0.1:5173/').href
const output = path.join(root, 'design/qa-v7')
fs.mkdirSync(output, { recursive: true })
const executablePath = process.env.PLAYWRIGHT_BROWSER || chromium.executablePath()

;(async () => {
  const browser = await chromium.launch({ headless: true, ...(fs.existsSync(executablePath) ? { executablePath } : {}) })
  const report = []
  for (const [width, pathname] of [[390, '/'], [1280, '/'], [390, '/work/hermes'], [1280, '/work/ai-video-systems'], [1280, '/about'], [1280, '/contact']]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto(new URL(pathname, base).href)
    await page.locator('.home-os-shell, .design-os-shell').first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    report.push({ width, pathname, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) })
    await page.screenshot({ path: path.join(output, `a11y-${width}-${pathname === '/' ? 'home' : pathname.slice(1).replaceAll('/', '-')}.png`), fullPage: false })
    await context.close()
  }
  fs.writeFileSync(path.join(output, 'accessibility.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report))
  await browser.close()
  if (report.some(item => item.violations.length)) process.exitCode = 1
})().catch(error => { console.error(error); process.exitCode = 1 })
