const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const {createRequire} = require('node:module')
const root = path.resolve(__dirname, '../..')
const req = createRequire(path.join(root, 'web/package.json'))
const {chromium, expect} = req('@playwright/test')
const AxeBuilder = req('@axe-core/playwright').default
const base = process.env.PORTFOLIO_QA_URL || 'http://127.0.0.1:4181/sun-yingjie-portfolio'
const prefix = new URL(base).pathname.replace(/\/$/, '')
const output = path.join(root, '.production-runtime/quick-studio-qa')
fs.mkdirSync(output, {recursive:true})

async function main() {
  const browser = await chromium.launch({headless:true})
  const errors = []
  try {
    for (const width of [390,768,1440]) {
      const context = await browser.newContext({viewport:{width,height:1000}, reducedMotion:'reduce'})
      const page = await context.newPage()
      page.on('pageerror', error => errors.push(error.message))
      await page.addInitScript(() => Object.defineProperty(navigator,'clipboard',{value:{writeText:async text => {document.documentElement.dataset.shared=text}}}))
      for (const lang of ['zh','en']) {
        const route = (lang === 'en' ? '/en' : '') + '/tools/quick-studio/'
        await page.goto(base + route, {waitUntil:'networkidle'})
        await expect(page.locator('h1')).toHaveText('Quick Studio')
        await expect(page.locator('html')).toHaveAttribute('lang',lang==='zh'?'zh-CN':'en')
        await expect(page.getByRole('link',{name:lang==='zh'?'打开工作台':'Open the workbench',exact:true})).toHaveAttribute('href','https://quick-studio-web.vercel.app/')
        await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',`https://aj-nb.github.io/sun-yingjie-portfolio${route.replace(/\/$/,'')}`)
        await page.getByRole('button',{name:lang==='zh'?'复制分享链接':'Copy share link',exact:true}).click()
        await expect(page.locator('html')).toHaveAttribute('data-shared',`https://aj-nb.github.io/sun-yingjie-portfolio${route.replace(/\/$/,'')}`)
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))
        const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
        assert.deepEqual(a11y.violations.map(v=>v.id),[])
        await page.screenshot({path:path.join(output,`${lang}-${width}.png`),fullPage:true})
        for (const entry of ['/', '/tools/', '/systems/']) {
          await page.goto(base + (lang==='en'?'/en':'') + entry,{waitUntil:'networkidle'})
          await expect(page.locator('.quick-studio-entry')).toBeVisible()
          await expect(page.locator('.quick-studio-entry a').first()).toHaveAttribute('href',prefix+(lang==='en'?'/en':'')+'/tools/quick-studio')
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))
        }
      }
      await context.close()
    }
    const noJS=await browser.newContext({javaScriptEnabled:false})
    const page=await noJS.newPage()
    for(const lang of ['zh','en']) {
      await page.goto(base+(lang==='en'?'/en':'')+'/tools/quick-studio/')
      await expect(page.locator('h1')).toHaveText('Quick Studio')
      await expect(page.locator('.quick-studio-steps li')).toHaveCount(4)
      await expect(page.getByRole('link',{name:lang==='zh'?'打开工作台':'Open the workbench',exact:true})).toBeVisible()
    }
    assert.deepEqual(errors,[])
    console.log('PASS: bilingual workflow routes, 3 viewports, 18 entry surfaces, public-only sharing, accessibility structure, static HTML and no runtime errors.')
  } finally { await browser.close() }
}
main().catch(error=>{console.error(error);process.exitCode=1})
