const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const { chromium } = createRequire(path.join(root, 'web/package.json'))('@playwright/test')
const base = (process.env.PORTFOLIO_QA_URL || 'http://localhost:4184').replace(/\/$/, '')
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || '.production-runtime/v76/profile')
const profile = JSON.parse(fs.readFileSync(path.join(root, 'web/src/data/profile.json'), 'utf8'))
const story = JSON.parse(fs.readFileSync(path.join(root, 'web/src/data/portfolioV6.json'), 'utf8'))
const sourceLiling = profile.timeline.find(item => item.id === 'liling')
const sourceChapter = story.careerChapters.find(item => item.id === 'liling')
fs.mkdirSync(output, { recursive: true })
const report = { base, startedAt: new Date().toISOString(), scope: 'Updated bilingual profile content and expanded capability layouts at narrow widths; does not verify employment independently.', sources: { canonicalLiling: { start: sourceLiling.start, end: sourceLiling.end, period: sourceLiling.period }, homepagePeriod: sourceChapter.period }, checks: [], runtimeErrors: [] }
const save = () => fs.writeFileSync(path.join(output, 'profile-v76.json'), JSON.stringify(report, null, 2))
const normalizedPeriod = text => text.replace(/\s/g, '')
;(async () => {
  assert.equal(sourceLiling.start, '2026-02')
  assert.equal(sourceLiling.end, '2026-10')
  for (const lang of ['zh', 'en']) assert.equal(normalizedPeriod(sourceLiling.period[lang]), '2026.02—2026.10')
  assert.equal(normalizedPeriod(sourceChapter.period), '2026.02—2026.10')
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' })
  for (const width of [320, 390, 743]) for (const lang of ['zh', 'en']) {
    const name = `profile-${width}-${lang}`, entry = { name }
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce', hasTouch: width <= 390, isMobile: width <= 390 })
    const page = await context.newPage()
    page.on('pageerror', error => report.runtimeErrors.push({ name, message: error.message }))
    try {
      await page.goto(`${base}/${lang === 'en' ? '?lang=en' : ''}`, { waitUntil: 'domcontentloaded' })
      await page.locator('#profile-details').waitFor()
      await page.evaluate(() => document.fonts.ready)
      const chapter = page.locator('[data-career-chapter="liling"]')
      const period = await chapter.locator(':scope > span').innerText()
      assert.equal(normalizedPeriod(period), '2026.02—2026.10')
      const brandTitle = lang === 'zh' ? '品牌系统与 VI/UI' : 'Brand systems & VI/UI'
      const aiTitle = lang === 'zh' ? 'AIGC 与开源工作流' : 'AIGC & open-source workflows'
      const brand = page.locator('.capability-list details').filter({ has: page.locator('summary', { hasText: brandTitle }) })
      const ai = page.locator('.capability-list details').filter({ has: page.locator('summary', { hasText: aiTitle }) })
      for (const details of [brand, ai]) {
        assert.equal(await details.count(), 1)
        if (!await details.evaluate(element => element.open)) await details.locator('summary').click()
        assert.equal(await details.locator(':scope > div').isVisible(), true)
      }
      const brandTools = await brand.locator('.capability-tools').innerText()
      for (const tool of ['Adobe Photoshop', 'Adobe Illustrator', 'Figma']) assert.ok(brandTools.includes(tool), brandTools)
      const aiTools = await ai.locator('.capability-tools').innerText()
      for (const tool of ['Codex', 'ComfyUI', 'ChatGPT', 'Midjourney']) assert.ok(aiTools.includes(tool), aiTools)
      const aiBody = await ai.locator(':scope > div > p').innerText()
      for (const term of lang === 'zh' ? ['参考分析', '提示词', '节点工作流', 'Photoshop', '开源组件', '可复用'] : ['reference analysis', 'prompts', 'node workflows', 'Photoshop', 'open-source components', 'reusable workflows']) assert.ok(aiBody.includes(term), `${term}: ${aiBody}`)
      const layout = await page.evaluate(() => {
        const nodes = [...document.querySelectorAll('[data-career-chapter="liling"], [data-career-chapter="liling"] *, .capability-list details[open], .capability-list details[open] *')]
        const boxes = nodes.filter(element => !['svg', 'path', 'line'].includes(element.tagName.toLowerCase()) && element.getClientRects().length).map(element => {
          const rect = element.getBoundingClientRect(), style = getComputedStyle(element)
          const textRects = [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()).flatMap(node => { const range = document.createRange(); range.selectNodeContents(node); return [...range.getClientRects()].map(box => ({ left: box.left, right: box.right })) })
          return { tag: element.tagName, className: String(element.className), text: element.textContent.slice(0, 80), left: rect.left, right: rect.right, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, overflowX: style.overflowX, textRects }
        })
        return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, overflow: boxes.filter(box => box.left < -1 || box.right > innerWidth + 1 || box.textRects.some(rect => rect.left < -1 || rect.right > innerWidth + 1)), clipped: boxes.filter(box => ['hidden', 'clip'].includes(box.overflowX) && box.scrollWidth > box.clientWidth + 1) }
      })
      assert.ok(layout.documentWidth <= width + 1, JSON.stringify(layout))
      assert.deepEqual(layout.overflow, [])
      assert.deepEqual(layout.clipped, [])
      const links = await brand.locator('.evidence-links a').evaluateAll(elements => elements.map(element => ({ text: element.textContent, href: element.getAttribute('href') })))
      assert.equal(links.length, 3)
      assert.ok(links.every(link => link.text.trim() && link.href.startsWith('#/work/')))
      if (width === 320 || width === 390) {
        await chapter.screenshot({ path: path.join(output, `${width}-${lang}-liling.png`) })
        await brand.screenshot({ path: path.join(output, `${width}-${lang}-brand-tools.png`) })
        await ai.screenshot({ path: path.join(output, `${width}-${lang}-aigc.png`) })
      }
      entry.detail = { period, brandTools, aiTools, aiBody, links, layout }
      entry.passed = true
    } catch (error) {
      entry.passed = false
      entry.error = error.stack || error.message
      await page.screenshot({ path: path.join(output, `failure-${name}.png`) }).catch(() => {})
    }
    report.checks.push(entry)
    save()
    console.log(entry.passed ? 'PASS' : 'FAIL', name, entry.error || '')
    await context.close()
  }
  await browser.close()
  save()
  console.log(`${report.checks.filter(entry => entry.passed).length}/${report.checks.length} passed; ${report.runtimeErrors.length} runtime errors`)
  if (report.checks.some(entry => !entry.passed) || report.runtimeErrors.length) process.exitCode = 1
})().catch(error => { report.failure = error.stack || error.message; save(); console.error(error); process.exitCode = 1 })
