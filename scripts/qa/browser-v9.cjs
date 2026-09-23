const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const root = path.resolve(__dirname, '../..')
const req = createRequire(path.join(root, 'web/package.json'))
const { chromium, expect } = req('@playwright/test')
const AxeBuilder = req('@axe-core/playwright').default
const base = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:4181'
const output = path.join(root, '.production-runtime/qa-v9/browser')
fs.mkdirSync(output, { recursive: true })
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'web/public/route-manifest.json')))
const checks = [], errors = [], violations = []
async function check(name, run) {
  try { const detail = await run(); checks.push({ name, passed: true, detail }) }
  catch (error) { checks.push({ name, passed: false, error: error.message }); console.error('FAIL', name, error.message) }
}
function monitor(page) {
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error' && /hydration|did not match|server HTML/i.test(message.text())) errors.push(`${page.url()}: ${message.text()}`)
  })
}
async function ready(page, route) {
  await page.goto(base + route, { waitUntil: 'networkidle' })
  await page.locator('.home-os-shell,.design-os-shell').first().waitFor()
  await page.evaluate(() => document.fonts.ready)
}
async function geometry(page) {
  return page.evaluate(() => {
    const escaped = [...document.querySelectorAll('main h1, main h2, main h3, .home-hero-bottom a, .site-header a')].filter(n => n.checkVisibility({checkVisibilityCSS:true}) && !n.closest('details:not([open])')).filter(n => { const r = n.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1 }).map(n => n.textContent)
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, escaped }
  })
}
async function main() {
  const browser = await chromium.launch({ headless: true })
  const sizes = [[390,844],[768,1024],[1280,900],[1440,1000],[1920,1080],[1280,650]]
  const routes = ['/', '/work', '/systems', '/systems/ai-video-methods', '/lab', '/tools', '/research', '/about', '/resume', '/contact', '/work/hermes', '/work/arcteryx', '/work/karimoku', '/work/ai-video-systems']
  for (const [width,height] of sizes) {
    const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' })
    const page = await context.newPage(); monitor(page)
    for (const lang of ['zh','en']) for (const route of routes) {
      const localized = lang==='en' ? '/en'+(route==='/' ? '/' : route) : route
      await check(`${localized} geometry ${width}x${height}`, async () => {
        await ready(page,localized); const state = await geometry(page)
        assert(state.scrollWidth<=width+1,JSON.stringify(state));assert.deepEqual(state.escaped,[])
        assert.equal(await page.locator('h1').count(),1)
        assert.equal(await page.locator('html').getAttribute('lang'),lang==='en'?'en':'zh-CN')
        if (route==='/') {
          assert.deepEqual(await page.locator('.home-project').evaluateAll(nodes=>nodes.map(n=>n.dataset.project)),['hermes','arcteryx','karimoku','lighting','yelisi','periastra','biyuan','ai-video-systems'])
          assert.equal(await page.locator('video').count(),0)
          assert.deepEqual(await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.mp4')).map(r=>r.name)),[])
          if (width===390) {const actions=await page.locator('.home-hero-bottom').boundingBox();assert(actions.y+actions.height<=height+1,JSON.stringify(actions))}
          if (width>=1024) assert.equal(await page.locator('.home-project-stack').first().evaluate(n=>getComputedStyle(n).position),'static')
        }
        if (['/','/work','/resume','/systems','/work/hermes','/work/arcteryx','/work/karimoku','/work/ai-video-systems'].includes(route) && [390,1440].includes(width)) await page.screenshot({path:path.join(output,`${lang}-${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${width}.png`)})
        return state
      })
    }
    await context.close();console.log(`Reviewed ${routes.length*2} surfaces at ${width}x${height}`)
  }
  const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']})
  const page=await context.newPage();monitor(page)
  // Every generated route, including aliases, must retain its static identity after hydration.
  for (const route of manifest.routes) await check(`${route} static/client metadata`,async()=>{
    await ready(page,route); const expected=manifest.metadata[route]
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),expected.canonical)
    assert.equal(await page.title(),expected.title)
    assert.equal(await page.locator('html').getAttribute('lang'),expected.lang)
    for(const [lang,href] of Object.entries(expected.alternates||{})) assert.equal(await page.locator(`link[hreflang="${lang}"]`).getAttribute('href'),href)
    const result=await geometry(page);assert.equal(result.escaped.length,0);assert(result.scrollWidth<=1441)
  })
  await check('language query normalization and page-preserving switch',async()=>{
    await ready(page,'/work/hermes?lang=en');await expect(page).toHaveURL(/\/en\/work\/hermes$/)
    await page.locator('.site-language').click();await expect(page).toHaveURL(/\/work\/hermes$/)
    assert.match(await page.locator('html').getAttribute('lang'),/zh/)
  })
  await check('controlled video and captions',async()=>{
    await ready(page,'/en/work/ai-video-systems');const video=page.locator('video')
    assert.equal(await video.getAttribute('preload'),'metadata');assert.equal(await video.getAttribute('autoplay'),null)
    assert(await video.evaluate(n=>n.controls && n.paused && n.duration>22 && n.duration<23))
    assert.equal(await video.locator('track').count(),2)
    await video.focus();assert(await video.evaluate(n=>n===document.activeElement))
  })
  await check('lightbox escape and focus restoration',async()=>{
    await ready(page,'/work/hermes');const trigger=page.locator('[data-media-trigger="media-0"]').first();await trigger.click()
    await page.locator('.yarl__root').waitFor();await page.keyboard.press('Escape');await expect(trigger).toBeFocused()
  })
  await check('contact copy feedback',async()=>{
    await ready(page,'/');await page.locator('.copy-email').click();await expect(page.locator('.copy-email')).toContainText('已复制')
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'2950884508@qq.com')
  })
  await check('desktop pointer feedback and sticky eligibility',async()=>{
    await ready(page,'/');await page.mouse.move(980,400);await expect.poll(()=>page.locator('.home-tv-figure').getAttribute('style')).toMatch(/rotateY|translate/)
    assert.equal(await page.locator('.home-stack-slot').first().evaluate(n=>getComputedStyle(n).position),'sticky')
    await page.setViewportSize({width:1280,height:650});assert.equal(await page.locator('.home-project-stack').first().evaluate(n=>getComputedStyle(n).position),'static')
  })
  await check('mobile menu keyboard behavior',async()=>{
    await page.setViewportSize({width:390,height:844});await ready(page,'/');const menu=page.locator('.site-mobile-menu summary');await menu.focus();await page.keyboard.press('Enter');assert(await page.locator('.site-mobile-menu').evaluate(n=>n.open));await page.keyboard.press('Escape');assert(!await page.locator('.site-mobile-menu').evaluate(n=>n.open));await expect(menu).toBeFocused()
  })
  await check('legacy hash compatibility',async()=>{
    await page.goto(base+'/#/work/hermes');await expect(page.locator('main')).toContainText('Hermès')
  })
  await context.close()
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}});const staticPage=await nojs.newPage()
  for(const route of ['/','/en/','/work/hermes','/en/systems','/resume']) await check(route+' without JavaScript',async()=>{
    await staticPage.goto(base+route);assert((await staticPage.locator('main').innerText()).length>250)
    assert.equal(await staticPage.locator('body').evaluate(n=>getComputedStyle(n).backgroundColor),'rgba(0, 0, 0, 0)')
    assert.equal(await staticPage.locator('.home-os-shell,.design-os-shell').first().evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(12, 12, 12)')
    if(route.includes('hermes')){const gallery=staticPage.locator('main details').first();await gallery.locator('summary').click();assert(await gallery.evaluate(n=>n.open))}
  });await nojs.close()
  const ax=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});const ap=await ax.newPage()
  for(const route of ['/','/en/','/work','/en/work/hermes','/work/arcteryx','/work/karimoku','/systems','/en/resume','/work/ai-video-systems','/contact']) await check(route+' accessibility',async()=>{
    await ready(ap,route);const result=await new AxeBuilder({page:ap}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();violations.push({route,violations:result.violations});assert.equal(result.violations.length,0,result.violations.map(v=>v.id+': '+v.nodes.map(n=>n.target).join(',')).join(';'))
  });await ax.close();await browser.close()
  checks.push({name:'runtime errors',passed:errors.length===0,detail:[...new Set(errors)]})
  const report={passed:checks.every(c=>c.passed),checks,errors:[...new Set(errors)],violations};fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2))
  console.log(JSON.stringify({passed:report.passed,checks:checks.length,failures:checks.filter(c=>!c.passed)}));if(!report.passed)process.exitCode=1
}
main().catch(e=>{console.error(e);process.exitCode=1})
