const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const { chromium } = createRequire(path.join(root, 'web/package.json'))('@playwright/test')
const base = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:4181'
const out = path.join(root, '.production-runtime/qa-v9/performance.json')
const runs = []

async function main() {
  const browser = await chromium.launch({ headless: true })
  for (const mode of ['desktop', 'mobile']) for (const route of ['/', '/en/']) for (let run = 1; run <= 3; run++) {
    const mobile = mode === 'mobile'
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: mobile ? 100 : 40, downloadThroughput: (mobile ? 4 : 10) * 1e6 / 8, uploadThroughput: 1e6 / 8 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: mobile ? 4 : 1 })
    await page.addInitScript(() => {
      window.__metrics = { lcp: 0, cls: 0, largestElement: '', shifts: [] }
      new PerformanceObserver(list => {
        for (const e of list.getEntries()) { window.__metrics.lcp = e.startTime; window.__metrics.largestElement = e.element?.tagName + '.' + e.element?.className }
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      // These are initial-load CLS samples before any input; all layout shifts
      // occur inside one short session. Raw entries remain available for audit.
      new PerformanceObserver(list => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) { window.__metrics.cls += e.value; window.__metrics.shifts.push({ time: e.startTime, value: e.value }) }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1200)
    const measured = await page.evaluate(() => ({ ...window.__metrics, resources: performance.getEntriesByType('resource').map(r => ({ name: new URL(r.name).pathname, bytes: r.transferSize, duration: r.duration })) }))
    runs.push({ mode, route, run, ...measured })
    console.log(JSON.stringify({ mode, route, run, lcp: measured.lcp, cls: measured.cls, largestElement: measured.largestElement }))
    await context.close()
  }
  await browser.close()
  const summaries = ['desktop', 'mobile'].flatMap(mode => ['/', '/en/'].map(route => {
    const matches = runs.filter(r => r.mode === mode && r.route === route)
    const lcpMedianMs = matches.map(r => r.lcp).sort((a, b) => a - b)[1]
    const clsMax = Math.max(...matches.map(r => r.cls))
    return { mode, route, lcpMedianMs, clsMax, meetsTargets: lcpMedianMs <= 2500 && clsMax <= .1 }
  }))
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, JSON.stringify({ base, measuredAt: new Date().toISOString(), conditions: { desktop: '1440x1000; cold cache; 10 Mbps; 40 ms latency; no CPU throttle', mobile: '390x844; cold cache; 4 Mbps; 100 ms latency; 4x CPU slowdown', scope: 'Chromium laboratory initial-load measurements, not field data or real-user INP', sampleCount: 3 }, targets: { lcpMs: 2500, cls: .1 }, summaries, runs }, null, 2))
  console.log(JSON.stringify(summaries))
}
main().catch(error => { console.error(error); process.exitCode = 1 })
