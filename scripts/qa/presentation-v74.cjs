const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const { chromium } = createRequire(path.join(root, 'web/package.json'))('@playwright/test')
const base = (process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:5178').replace(/\/$/, '')
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || '.production-runtime/v74/presentation')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'web/src/data/downloads.json'), 'utf8'))
fs.mkdirSync(output, { recursive: true })
const report = { base, startedAt: new Date().toISOString(), checks: [], runtimeErrors: [] }
const save = () => fs.writeFileSync(path.join(output, 'presentation-v74.json'), JSON.stringify(report, null, 2))
async function focusTarget(page, id) {
  await page.waitForFunction(id => document.activeElement?.id === id, id)
  return page.evaluate(id => ({ hash: location.hash, historyLength: history.length, scroll: scrollY, focus: document.activeElement.id, top: document.getElementById(id).getBoundingClientRect().top }), id)
}
async function visibleImages(page) {
  await page.locator('img').evaluateAll(images => Promise.allSettled(images.filter(image => { const box = image.getBoundingClientRect(); return box.top < innerHeight && box.bottom > 0 }).map(image => image.decode())))
}
;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' })
  async function check(name, options, run, route = '') {
    const context = await browser.newContext({ viewport: { width: 1280, height: 844 }, reducedMotion: 'reduce', ...options })
    const page = await context.newPage(), entry = { name }
    page.on('pageerror', error => report.runtimeErrors.push({ name, error: error.message }))
    try {
      await page.goto(base + route, { waitUntil: 'domcontentloaded' })
      await page.locator('main').waitFor()
      await page.evaluate(() => document.fonts.ready)
      entry.detail = await run(page)
      entry.passed = true
    } catch (error) {
      entry.passed = false; entry.error = error.stack || error.message
      await page.screenshot({ path: path.join(output, `failure-${name}.png`) }).catch(() => {})
    }
    report.checks.push(entry); save()
    console.log(entry.passed ? 'PASS' : 'FAIL', name, entry.error || '')
    await context.close()
  }
  for (const width of [320, 390, 743, 1280, 1440]) for (const lang of ['zh', 'en']) {
    await check(`layout-${width}-${lang}`, { viewport: { width, height: 844 }, isMobile: width <= 390, hasTouch: width <= 390 }, async page => {
      await page.locator('#downloads').waitFor()
      const layout = await page.evaluate(() => {
        const visible = element => { const style = getComputedStyle(element); return element.getClientRects().length && style.visibility !== 'hidden' && style.display !== 'none' && !element.closest('.sr-only') }
        const elements = [...document.querySelectorAll('main *, .site-header *')].filter(element => visible(element) && !['svg', 'path', 'line', 'rect', 'circle'].includes(element.tagName.toLowerCase()))
        const overflow = elements.filter(element => { const box = element.getBoundingClientRect(); return box.left < -2 || box.right > innerWidth + 2 }).map(element => ({ element: element.tagName + '.' + String(element.className), text: element.textContent.slice(0, 60) }))
        const method = document.querySelector('.method-selector'), buttons = [...method.querySelectorAll('button')]
        return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, overflow, sectionOrder: [...document.querySelectorAll('main [id]')].filter(element => ['selected', 'products', 'open-source', 'works', 'process', 'about', 'downloads', 'contact'].includes(element.id)).map(element => element.id), headings: [...document.querySelectorAll('.v7-heading h2,.work-index h2,.studio-method h2')].map(element => ({ text: element.textContent, fontSize: Number.parseFloat(getComputedStyle(element).fontSize) })), method: { clientWidth: method.clientWidth, scrollWidth: method.scrollWidth, buttons: buttons.map(button => ({ visible: visible(button), left: button.getBoundingClientRect().left, right: button.getBoundingClientRect().right, text: button.textContent })) } }
      })
      assert.ok(layout.documentWidth <= width + 1, JSON.stringify(layout))
      assert.deepEqual(layout.overflow, [])
      assert.deepEqual(layout.sectionOrder, ['selected', 'products', 'open-source', 'works', 'process', 'about', 'downloads', 'contact'])
      assert.equal(layout.method.buttons.length, 5)
      assert.ok(layout.method.scrollWidth <= layout.method.clientWidth + 1)
      assert.ok(layout.method.buttons.every(button => button.visible && button.left >= 0 && button.right <= width + 1))
      assert.ok(layout.headings.every(heading => heading.fontSize >= 28 && heading.fontSize <= 48))
      if (width === 390 && lang === 'zh') {
        await page.evaluate(() => document.getElementById('downloads').scrollIntoView({ behavior: 'instant' }))
        await visibleImages(page)
        layout.mobileDownload = await page.evaluate(() => ({ previewImageWidth: document.querySelector('.resume-preview img').getBoundingClientRect().width, firstDownloadTop: document.querySelector('.download-primary .download-link').getBoundingClientRect().top, dockTop: document.querySelector('.mobile-dock').getBoundingClientRect().top }))
        assert.ok(layout.mobileDownload.previewImageWidth <= 110)
        assert.ok(layout.mobileDownload.firstDownloadTop < layout.mobileDownload.dockTop, JSON.stringify(layout.mobileDownload))
        await page.screenshot({ path: path.join(output, '390-downloads.png') })
      }
      if (width === 1280 && lang === 'zh') {
        await page.evaluate(() => document.getElementById('selected').scrollIntoView({ behavior: 'instant' }))
        await visibleImages(page)
        layout.header = await page.locator('.mainframe-header').evaluate(header => ({ background: getComputedStyle(header).backgroundColor, comma: getComputedStyle(header.querySelector('nav a'), '::after').content, pseudoDisplay: getComputedStyle(header.querySelector('nav a'), '::after').display }))
        assert.equal(layout.header.background, 'rgb(248, 248, 245)')
        assert.ok(layout.header.pseudoDisplay === 'none' || ['none', 'normal', '""'].includes(layout.header.comma))
        await page.screenshot({ path: path.join(output, '1280-header.png') })
      }
      return layout
    }, lang === 'en' ? '/?lang=en' : '/')
  }
  await check('download-editions-preview-format-integrity', {}, async page => {
    const variants = ['overview', 'brand', 'physical', 'digital'], results = []
    for (let index = 0; index < variants.length; index++) {
      const variant = variants[index], expected = manifest.items.filter(item => item.variant === variant)
      await page.locator('.download-variants button').nth(index).click()
      const links = await page.locator('.v7-download-list .download-link').evaluateAll(elements => elements.map(element => ({ id: element.dataset.download, url: element.href, path: new URL(element.href).pathname, revision: new URL(element.href).searchParams.get('v'), label: element.textContent, download: element.hasAttribute('download') })))
      assert.equal(links.length, variant === 'overview' ? 4 : 3)
      assert.deepEqual(links.map(link => link.id).sort(), expected.map(item => item.id).sort())
      const preview = await page.locator('.resume-preview').evaluate(element => ({ path: new URL(element.href).pathname, revision: new URL(element.href).searchParams.get('v'), target: element.target, rel: element.rel, image: new URL(element.querySelector('img').src).pathname, imageUrl: element.querySelector('img').src, imageRevision: new URL(element.querySelector('img').src).searchParams.get('v') }))
      const resume = expected.find(item => item.type === 'resume' && item.format === 'pdf')
      assert.equal(preview.path, resume.path); assert.equal(preview.target, '_blank'); assert.ok(preview.rel.includes('noreferrer'))
      assert.equal(preview.image, `/media/v7/resume-preview${variant === 'overview' ? '' : `-${variant}`}.webp`)
      assert.equal(preview.revision, resume.sha256.slice(0, 12)); assert.equal(preview.imageRevision, preview.revision)
      const imageResponse = await page.request.get(preview.imageUrl), imageBytes = await imageResponse.body()
      assert.equal(imageResponse.status(), 200); assert.ok(imageResponse.headers()['content-type'].startsWith('image/webp'))
      assert.equal(imageBytes.subarray(0, 4).toString(), 'RIFF'); assert.equal(imageBytes.subarray(8, 12).toString(), 'WEBP')
      const files = []
      for (const link of links) {
        const expectedFile = expected.find(item => item.id === link.id)
        assert.equal(link.path, expectedFile.path); assert.equal(link.download, true)
        assert.equal(link.revision, expectedFile.sha256.slice(0, 12))
        const response = await page.request.get(link.url), bytes = await response.body()
        assert.equal(response.status(), 200)
        assert.equal(bytes.length, expectedFile.bytes)
        assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), expectedFile.sha256)
        if (expectedFile.format === 'pdf') { assert.equal(bytes.subarray(0, 5).toString(), '%PDF-'); assert.ok(response.headers()['content-type'].includes('application/pdf')) }
        else { assert.equal(bytes.subarray(0, 2).toString(), 'PK'); assert.ok(link.label.includes('Word')) }
        files.push({ id: link.id, path: link.path, bytes: bytes.length, sha256Matched: true, format: expectedFile.format })
      }
      results.push({ variant, preview, files })
    }
    return results
  })
  for (const lang of ['zh', 'en']) await check(`expanded-digital-credits-${lang}`, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, async page => {
    const details = page.locator('.digital-source-details'), count = await details.count()
    assert.equal(count, 2)
    for (let index = 0; index < count; index++) await details.nth(index).locator('summary').click()
    const result = await page.locator('.digital-source-details').evaluateAll(elements => {
      const rgb = css => { const parts = css.match(/[\d.]+/g)?.map(Number) || []; return parts.length >= 3 ? parts.slice(0, 3) : [255, 255, 255] }
      const lum = color => color.map(value => { const channel = value / 255; return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4 }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
      const background = element => { for (let node = element; node; node = node.parentElement) { const color = getComputedStyle(node).backgroundColor; if (color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') return color } return 'rgb(255, 255, 255)' }
      return elements.map(element => ({ open: element.open, width: element.getBoundingClientRect().width, nodes: [...element.querySelectorAll('summary,dt,dd,p,a')].map(node => { const style = getComputedStyle(node), back = background(node), frontLum = lum(rgb(style.color)), backLum = lum(rgb(back)), ratio = (Math.max(frontLum, backLum) + .05) / (Math.min(frontLum, backLum) + .05); return { text: node.textContent.slice(0, 70), fontSize: Number.parseFloat(style.fontSize), lineHeight: Number.parseFloat(style.lineHeight), ratio, color: style.color, background: back, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth } }) }))
    })
    assert.ok(result.every(item => item.open && item.width <= 390))
    for (const item of result) for (const node of item.nodes) { assert.ok(node.fontSize >= 12, JSON.stringify(node)); assert.ok(node.ratio >= 4.5, JSON.stringify(node)); assert.ok(node.scrollWidth <= node.clientWidth + 2, JSON.stringify(node)) }
    return result
  }, lang === 'en' ? '/?lang=en' : '/')
  await check('footer-download-product-subpaths-and-digital-return', {}, async page => {
    await page.locator('#contact a[href="#downloads"]').click()
    const downloads = await focusTarget(page, 'downloads')
    await page.locator('#main-navigation a[href="#products"]').click()
    const products = await focusTarget(page, 'products')
    await page.locator('.product-subpaths a[href="#physical-products"]').click()
    const physical = await focusTarget(page, 'physical-products')
    assert.equal(physical.historyLength, products.historyLength + 1)
    await page.locator('.product-subpaths a[href="#open-source"]').click()
    const digital = await focusTarget(page, 'open-source')
    assert.equal(digital.historyLength, physical.historyLength + 1)
    const card = page.locator('.v7-digital-more a[data-return-focus]').first(), key = await card.getAttribute('data-return-focus')
    await card.evaluate(element => element.addEventListener('click', () => { window.__presentationReturnTop = scrollY }, { once: true, capture: true }))
    await card.click(); await page.locator('.case-header h1').waitFor()
    await page.locator('.case-toolbar button').click()
    await page.waitForFunction(key => document.activeElement?.dataset.returnFocus === key && Math.abs(scrollY - window.__presentationReturnTop) < 2, key)
    const returned = await page.evaluate(() => ({ focus: document.activeElement.dataset.returnFocus, top: scrollY, expected: window.__presentationReturnTop }))
    return { downloads, products, physical, digital, returned }
  })
  for (const width of [390, 1280]) for (const slug of ['hermes', 'huhu-care']) await check(`case-layout-${width}-${slug}`, { viewport: { width, height: 844 }, isMobile: width === 390, hasTouch: width === 390 }, async page => {
    await page.locator('.case-body').waitFor(); await visibleImages(page)
    const layout = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, title: document.querySelector('.case-header h1').textContent, font: getComputedStyle(document.querySelector('.case-header h1')).fontSize }))
    assert.ok(layout.documentWidth <= width + 1, JSON.stringify(layout))
    await page.screenshot({ path: path.join(output, `${width}-case-${slug}.png`) })
    return layout
  }, `/#/work/${slug}`)
  await browser.close(); save()
  console.log(`${report.checks.filter(check => check.passed).length}/${report.checks.length} passed; ${report.runtimeErrors.length} runtime errors`)
  if (report.checks.some(check => !check.passed) || report.runtimeErrors.length) process.exitCode = 1
})().catch(error => { report.failure = error.stack || error.message; save(); console.error(error); process.exitCode = 1 })
