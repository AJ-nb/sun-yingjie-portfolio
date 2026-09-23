const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const { chromium } = createRequire(path.join(root, 'web/package.json'))('@playwright/test')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'web/public/route-manifest.json'), 'utf8'))
const base = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:5173'
const output = path.join(root, '.production-runtime/desktop-ai-video')
fs.mkdirSync(output, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const results = []
  const failures = []
  try {
    for (const width of [1280, 1440, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
      for (const lang of ['zh', 'en']) {
        for (const route of manifest.routes) {
          await page.goto(new URL(route + (lang === 'en' ? '?lang=en' : ''), base).href, { waitUntil: 'domcontentloaded' })
          await page.locator('.home-os-shell,.design-os-shell').first().waitFor()
          await page.evaluate(() => document.fonts.ready)
          const state = await page.evaluate(() => {
            const nav = document.querySelector('header nav')
            const title = document.querySelector('main h1')
            const navLinks = [...(nav?.querySelectorAll('a') || [])].map(link => {
              const rect = link.getBoundingClientRect()
              return { text: link.textContent, x: rect.x, right: rect.right, width: rect.width }
            })
            return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, titleSize: parseFloat(getComputedStyle(title).fontSize), navOverflow: !!nav && nav.scrollWidth > nav.clientWidth + 1, navLinks, bodyLength: document.querySelector('main').innerText.length }
          })
          const errors = []
          if (state.scrollWidth > width + 1) errors.push('horizontal overflow')
          if (state.navOverflow || state.navLinks.some(link => link.x < 0 || link.right > width || link.width < 1)) errors.push('navigation clipping')
          if (state.titleSize > (route === '/' ? 116 : 68) + 1) errors.push('title scale')
          if (state.bodyLength < 20) errors.push('missing body')
          results.push({ route, lang, width, titleSize: state.titleSize, errors })
          if (errors.length) failures.push({ route, lang, width, ...state, errors })
        }
      }
      if (width === 1440) {
        for (const route of ['/work', '/resume', '/work/ai-video-systems']) {
          await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' })
          await page.screenshot({ path: path.join(output, route.slice(1).replaceAll('/', '-') + '.png') })
        }
        await page.goto(base, { waitUntil: 'networkidle' })
        await page.locator('.home-os-project').first().scrollIntoViewIfNeeded()
        await page.screenshot({ path: path.join(output, 'home-projects.png') })
        await page.goto(new URL('/work/ai-video-systems?lang=en', base).href, { waitUntil: 'networkidle' })
        const video = page.locator('.design-os-detail-body video')
        await video.scrollIntoViewIfNeeded()
        const bounds = await video.boundingBox()
        assert.ok(bounds && bounds.height <= 840 && bounds.width <= 864, 'Portrait video and controls must fit within the desktop reading viewport')
        await video.focus()
        assert.equal(await video.evaluate(node => node.paused), true)
        await page.keyboard.press('Space')
        await page.waitForFunction(() => !document.querySelector('.design-os-detail-body video').paused)
        await page.keyboard.press('Space')
        await page.waitForFunction(() => document.querySelector('.design-os-detail-body video').paused)
        results.push({ route: '/work/ai-video-systems', check: 'native keyboard play and pause', errors: [] })
        await page.screenshot({ path: path.join(output, 'video-player.png') })
      }
      await page.close()
      console.log(`PASS: reviewed all bilingual public routes at ${width}px`)
    }
  } finally {
    await browser.close()
    fs.writeFileSync(path.join(output, 'audit.json'), JSON.stringify({ checkedAt: new Date().toISOString(), checks: results.length, failures, results }, null, 2))
  }
  console.log(JSON.stringify({ checks: results.length, failures }))
  if (failures.length) process.exitCode = 1
})().catch(error => { console.error(error); process.exitCode = 1 })
