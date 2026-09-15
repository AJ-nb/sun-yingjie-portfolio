const { createRequire } = require('node:module')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const assert = require('node:assert/strict')
const root = path.resolve(__dirname, '../..')
const { chromium } = createRequire(path.join(root, 'web/package.json'))('@playwright/test')
const origin = require(path.join(root, 'web/src/data/profile.json')).url
const output = path.join(root, '.cache/v5/public-verification')
fs.mkdirSync(output, { recursive: true })
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
async function main() {
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' } : {}) })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const report = { url: origin, verifiedAt: new Date().toISOString(), freshUnauthenticatedContext: true, checks: [] }
  try {
    const response = await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.locator('.v5-hero h1').waitFor({ timeout: 60000 })
    assert.match(await page.locator('.v5-hero h1').innerText(), /孙英杰/)
    report.checks.push({ name: 'anonymous homepage', status: response.status(), passed: true })
    await page.screenshot({ path: path.join(output, 'public-home.png') })
    await page.locator('.v5-selected-case .v5-case-image').first().click()
    await page.locator('.case-header h1').waitFor()
    assert.match(await page.locator('.case-header h1').innerText(), /彼源/)
    report.checks.push({ name: 'anonymous case', url: page.url(), passed: true })
    await page.screenshot({ path: path.join(output, 'public-case.png') })
    const files = ['media-index.json', 'media/v5/footer-gaze.json', 'works/brand/periastra/final-wordmark.png']
    for (const file of files) {
      const received = await page.evaluate(async url => {
        const response = await fetch(url)
        const bytes = await response.arrayBuffer()
        const hash = await crypto.subtle.digest('SHA-256', bytes)
        return { status: response.status, bytes: bytes.byteLength, sha256: [...new Uint8Array(hash)].map(x => x.toString(16).padStart(2, '0')).join('') }
      }, `${origin}/${file}`)
      assert.equal(received.status, 200, file)
      const expected = fs.readFileSync(path.join(root, 'web/dist', file))
      assert.equal(received.sha256, digest(expected), `Remote bytes differ: ${file}`)
      report.checks.push({ name: file, ...received, passed: true })
    }
    await page.goto(origin, { waitUntil: 'domcontentloaded' })
    for (const filename of ['sun-yingjie-selected-portfolio.pdf','sun-yingjie-full-portfolio.pdf','sun-yingjie-resume.pdf','sun-yingjie-resume.docx']) {
      const link = page.locator(`a[download][href$="${filename}"]`).first()
      const [download] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }), link.click()])
      const saved = await download.path()
      assert.ok(saved, await download.failure())
      const bytes = fs.readFileSync(saved)
      assert.equal(digest(bytes), digest(fs.readFileSync(path.join(root, 'web/dist/downloads', filename))), filename)
      report.checks.push({ name: filename, clickedDownload: true, bytes: bytes.length, sha256: digest(bytes), passed: true })
    }
    report.passed = true
  } catch (error) {
    report.passed = false
    report.error = error.message
    report.observedTitle = await page.title().catch(() => '')
    await page.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {})
    process.exitCode = 1
  } finally {
    fs.writeFileSync(path.join(root, 'deliverables/public-verification-v5.json'), JSON.stringify(report, null, 2))
    console.log(JSON.stringify(report))
    await browser.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
