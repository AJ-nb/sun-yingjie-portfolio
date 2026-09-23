const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module')
const root=path.resolve(__dirname,'../..'),req=createRequire(path.join(root,'web/package.json')),{chromium,expect}=req('@playwright/test')
const base=(process.env.PORTFOLIO_QA_URL||'http://127.0.0.1:5173').replace(/\/$/,''),out=path.join(root,'.production-runtime/v11/qa')
fs.mkdirSync(out,{recursive:true})
;(async()=>{
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:1280,height:720},reducedMotion:'reduce'}),page=await context.newPage(),errors=[]
await context.addInitScript(()=>{try{localStorage.removeItem('portfolio-motion')}catch{}})
page.on('pageerror',e=>errors.push(e.message))
try{
 await page.goto(base+'/');await page.evaluate(()=>document.fonts.ready)
 await expect(page.locator('html')).toHaveAttribute('data-motion','full')
 const canvas=page.locator('.home-tv-figure canvas')
 await expect(canvas).toHaveAttribute('data-pose','32',{timeout:30000})
 const images=[]
 for(const [x,pose] of [[1,18],[1279,72],[640,32]]){await page.mouse.move(x,350);await expect(canvas).toHaveAttribute('data-pose',String(pose),{timeout:15000});images.push(await canvas.evaluate(c=>c.toDataURL()))}
 assert.equal(new Set(images).size,3)
 await page.mouse.move(1,350);await page.mouse.move(1279,350);await expect(canvas).toHaveAttribute('data-pose','72')
 await page.mouse.move(640,10);await expect(canvas).toHaveAttribute('data-pose','32')
 await page.reload();await expect(page.locator('#motion-preference')).toHaveValue('full')
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('html')).toHaveAttribute('data-motion','full')
 await page.locator('#motion-preference').selectOption('reduced');await expect(page.locator('html')).toHaveAttribute('data-motion','reduced')
 await page.locator('#motion-preference').selectOption('full');await expect(page.locator('html')).toHaveAttribute('data-motion','full')
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('html')).toHaveAttribute('data-motion','full')
 for(const [width,height] of [[390,844],[768,1024],[1280,720],[1440,900],[1920,1080],[1280,600]]){
   await page.setViewportSize({width,height});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350)
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${width}`)
   if(width>=1024&&height>=720){await expect(page.locator('.home-stack-slot[data-stack=enabled]')).toHaveCount(3)}
   await page.locator('.home-stack').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`stack-${width}-${height}.png`)})
 }
 await page.setViewportSize({width:1440,height:900});await page.goto(base+'/');await page.screenshot({path:path.join(out,'home.png'),fullPage:true})
 assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.mp4/.test(r.name)).length),0)
 await page.goto(base+'/systems/ai-video-methods');await expect(page.locator('.reference-grid article')).toHaveCount(18)
 await page.getByRole('button',{name:'下一页',exact:true}).click();assert.ok(page.url().includes('catalog_page=2'))
 await page.reload();await expect(page.locator('.catalog-pagination span')).toHaveText('2 / 26')
 await page.getByLabel('搜索全部参考',{exact:true}).fill('biscuit');await expect(page.locator('.reference-grid article')).toHaveCount(2)
 await page.locator('.site-language').click();await expect(page.getByLabel('Search all references',{exact:true})).toHaveValue('biscuit')
 await page.getByRole('button',{name:'Clear index filters',exact:true}).click();await expect(page.locator('.reference-grid article')).toHaveCount(18)
 assert.equal(await page.locator('iframe').count(),0)
 await page.screenshot({path:path.join(out,'methods.png'),fullPage:true})
 assert.deepEqual(errors,[])
 const blocked=await browser.newContext({reducedMotion:'reduce'});await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})})
 const bp=await blocked.newPage();await bp.goto(base+'/');await expect(bp.locator('html')).toHaveAttribute('data-motion','full');await blocked.close()
 console.log('PASS v12 full-motion default, manual reduction, poses, layouts, filters, persistence, storage failure and media loading')
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
