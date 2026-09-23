const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')

const root = path.resolve(__dirname, '../..')
const webRequire = createRequire(path.join(root, 'web/package.json'))
const { chromium } = webRequire('@playwright/test')
const base = new URL(process.env.BASE_URL || process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:5173/').href
const output = path.resolve(root, process.env.PORTFOLIO_QA_OUTPUT || 'design/qa-v7')
fs.mkdirSync(output, { recursive: true })

function browserExecutable() {
  if (process.env.PLAYWRIGHT_BROWSER) return process.env.PLAYWRIGHT_BROWSER
  const bundled = chromium.executablePath()
  return fs.existsSync(bundled) ? bundled : undefined
}

async function main() {
  const executablePath = browserExecutable()
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) })
  const errors = []
  const checks = []
  const check = async (name, run) => {
    try { const detail = await run(); checks.push({ name, passed: true, detail }); console.log(`PASS ${name}`) }
    catch (error) { checks.push({ name, passed: false, error: error.stack || error.message }); console.error(`FAIL ${name}: ${error.message}`) }
  }

  for (const [width, height] of [[390, 844], [1280, 900], [1440, 900], [1920, 1080]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(base)
    await page.locator('.home-os-shell').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.original-poster').evaluate(image => image.decode())
    await check(`home layout ${width}`, async () => {
      const state = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        width: innerWidth,
        sections: [...document.querySelectorAll('main section[id]')].map(node => node.id),
        role: document.querySelector('.home-os-hero-role')?.textContent,
        contact: document.querySelector('.home-os-contact')?.innerText,
        reducedAnimation: getComputedStyle(document.querySelector('.home-os-hero h1')).animationName,
        cards: [...document.querySelectorAll('.home-os-project')].map(node => {
          const { x, y, width, height } = node.getBoundingClientRect()
          return { x, y, width, height }
        }),
      }))
      assert.ok(state.scrollWidth <= state.width + 1, JSON.stringify(state))
      assert.match(state.role || '', /Design\s*Lead/)
      assert.match(await page.locator('.home-os-hero-top').innerText(), /Industrial\s*&\s*Product Design/)
      assert.match(state.contact || '', /2950884508@qq\.com|联系|Contact/)
      assert.ok(state.sections.indexOf('selected') >= 0 && state.sections.indexOf('contact') > state.sections.indexOf('selected'))
      assert.equal(state.reducedAnimation, 'none')
      assert.equal(await page.locator('.original-video-hero video, .video-follow-hint').count(), 0, 'Static mode must not load video or announce a pending interactive cover')
      assert.equal(await page.locator('.home-os-project').count(), 14, 'Homepage must expose all fourteen primary works')
      assert.ok(await page.getByRole('link', { name: /Karimoku/i }).count() >= 1)
      assert.equal(await page.locator('.home-os-ai-video').count(), 1, 'Homepage must expose the AI Video Systems feature')
      assert.equal(await page.locator('video[src*="ai-video-systems-film"]').count(), 0, 'Homepage must not embed the AI Video Systems film')
      assert.deepEqual(await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name).filter(name => name.includes('ai-video-systems-film'))), [], 'Homepage must not request the AI Video Systems film')
      if (width >= 1280) {
        assert.equal(state.cards.length, 14)
        for (let index = 0; index < state.cards.length; index += 2) {
          const left = state.cards[index]
          const right = state.cards[index + 1]
          assert.ok(Math.abs(left.y - right.y) < 2, `Projects ${index + 1} and ${index + 2} should share a filled row`)
          assert.ok(left.x + left.width + 96 >= right.x, `Projects ${index + 1} and ${index + 2} leave an oversized desktop gap`)
        }
      }
      if (width === 390) {
        const action = await page.locator('.home-os-hero-actions').boundingBox()
        assert.ok(action && action.y >= 0 && action.y + action.height <= height, 'Browse and contact actions must fit within the first mobile screen')
        const bottom = await page.locator('.home-os-hero-bottom').boundingBox()
        assert.ok(bottom && bottom.y + bottom.height <= height, 'Hero metadata must fit within the first mobile screen')
      }
      return state
    })
    await page.screenshot({ path: path.join(output, `home-${width}.png`), fullPage: false })
    await context.close()
  }

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await check('English home metadata matches visible language', async () => {
    await page.goto(new URL('/?lang=en', base).href)
    await page.locator('.home-os-shell').waitFor()
    assert.equal(await page.locator('html').getAttribute('lang'), 'en')
    assert.equal(await page.locator('meta[property="og:locale"]').getAttribute('content'), 'en_US')
    assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), await page.title())
    assert.equal(await page.locator('meta[name="twitter:description"]').getAttribute('content'), await page.locator('meta[name="description"]').getAttribute('content'))
    const structured = JSON.parse(await page.locator('script[data-design-os-seo-jsonld]').textContent())
    assert.equal(structured['@graph'].find(node => node['@type'] === 'WebSite').inLanguage, 'en')
  })
  await check('Periastra is presented as research', async () => {
    await page.goto(new URL('/work/periastra?lang=en', base).href)
    await page.locator('.design-os-shell').waitFor()
    assert.match(await page.locator('.design-os-hero > span').innerText(), /RESEARCH/)
    assert.match(await page.locator('.design-os-hero').innerText(), /RESEARCH/)
  })
  await check('work archive begins with the complete primary sequence', async () => {
    await page.goto(new URL('/work?lang=en', base).href)
    await page.locator('.design-os-shell').waitFor()
    const titles = await page.locator('.design-os-card h2').allTextContents()
    const expectedOrder = [/Hermès/i, /Mountain Performance Field/i, /Karimoku/i, /Aluminum Lighting/i, /PLUMBER/i, /HUHU/i, /Plant Companion/i, /GO GLOW/i, /LINGMU/i, /JiMu/i, /Biyuan/i, /Rendering/i, /Yelisi/i, /Periastra/i]
    assert.equal(titles.length >= expectedOrder.length, true, 'Work archive must expose every primary project')
    expectedOrder.forEach((expected, index) => assert.match(titles[index], expected, `Primary project order drifted at position ${index + 1}`))
    return titles.slice(0, 14)
  })
  await check('AI Video Systems case uses a controlled, captioned player', async () => {
    await page.goto(new URL('/work/ai-video-systems?lang=en', base).href)
    await page.locator('.design-os-shell').waitFor()
    const player = page.locator('.design-os-detail-body video')
    assert.equal(await player.count(), 1)
    assert.equal(await player.getAttribute('preload'), 'metadata')
    assert.equal(await player.evaluate(node => node.paused), true, 'The film must not autoplay')
    assert.equal(await player.evaluate(node => node.controls), true, 'The film must expose native keyboard-operable controls')
    assert.equal(await player.locator('track[kind="captions"]').count(), 2)
    assert.match(await page.locator('main').innerText(), /independent applied research|independent workflow adaptation/i)
    assert.match(await page.locator('main').innerText(), /LEVEL B\s*\/\s*PROJECT ARCHIVE/i)
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://yingjie-sun.ajhhq.chatgpt.site/work/ai-video-systems')
  })
  for (const pathname of ['/', '/work', '/lab', '/tools', '/research', '/about', '/resume', '/contact', '/work/hermes', '/work/karimoku', '/work/karimoku-benwu-design-study', '/work/ai-video-systems']) {
    await check(`route ${pathname}`, async () => {
      await page.goto(new URL(pathname, base).href)
      await page.locator('.home-os-shell, .design-os-shell').first().waitFor()
      assert.ok((await page.locator('main').innerText()).trim().length > 20)
      assert.equal(await page.locator('link[rel="canonical"]').count(), 1)
      if (pathname.startsWith('/work/')) assert.ok(await page.locator('.design-os-detail-meta').count() >= 1)
      return { pathname, canonical: await page.locator('link[rel="canonical"]').getAttribute('href') }
    })
  }
  await check('Hermes evidence and focus restoration', async () => {
    await page.goto(new URL('/work/hermes', base).href)
    await page.locator('.design-os-shell').waitFor()
    assert.match(await page.locator('.design-os-hero').innerText(), /商业项目|COMMERCIAL WORK/)
    const trigger = page.locator('.design-os-detail-cover button').first()
    await trigger.click()
    await page.locator('.yarl__portal').waitFor()
    await page.keyboard.press('Escape')
    await page.locator('.yarl__portal').waitFor({ state: 'detached' })
    assert.equal(await trigger.evaluate(node => document.activeElement === node), true)
  })
  await check('legacy hash compatibility', async () => {
    await page.goto(new URL('/#/work/hermes', base).href)
    await page.locator('.case-header, .case-page, .final-career-home').first().waitFor()
    assert.equal(await page.locator('.home-os-shell').count(), 0)
  })
  await context.close()
  await browser.close()

  const report = { startedAt: new Date().toISOString(), base, checks, errors, finishedAt: new Date().toISOString() }
  fs.writeFileSync(path.join(output, 'frontend-browser.json'), JSON.stringify(report, null, 2))
  const failures = checks.filter(item => !item.passed)
  console.log(`${checks.length - failures.length}/${checks.length} checks passed`)
  if (failures.length || errors.length) process.exitCode = 1
}

main().catch(error => { console.error(error); process.exitCode = 1 })
