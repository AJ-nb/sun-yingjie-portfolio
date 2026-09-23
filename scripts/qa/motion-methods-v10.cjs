const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module')
const root=path.resolve(__dirname,'../..'),req=createRequire(path.join(root,'web/package.json'))
const {chromium,expect}=req('@playwright/test'),Axe=req('@axe-core/playwright').default
const base=process.env.PORTFOLIO_QA_URL||'http://127.0.0.1:5173',out=path.join(root,'.production-runtime/v10/qa')
fs.mkdirSync(out,{recursive:true});const results=[]
async function check(name,fn){try{await fn();results.push({name,passed:true})}catch(e){results.push({name,passed:false,error:e.message});console.error(name,e.message)}}
async function main(){
 const browser=await chromium.launch({headless:true})
 const context=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:path.join(out,'video'),size:{width:1440,height:1000}}}),page=await context.newPage(),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 await page.goto(base);await page.evaluate(()=>document.fonts.ready)
 await check('visible original left/front/right poses and reset',async()=>{
  const canvas=page.locator('.home-tv-figure canvas');await expect(canvas).toHaveAttribute('data-pose','32',{timeout:30000})
  const hashes=[]
  for(const [x,pose,name] of [[1,18,'left'],[720,32,'front'],[1439,72,'right']]){
   await page.mouse.move(x,400);await expect(canvas).toHaveAttribute('data-pose',String(pose),{timeout:20000})
   hashes.push(await canvas.evaluate(n=>n.toDataURL()));await page.screenshot({path:path.join(out,`hero-${name}.png`)})
  }
  assert.equal(new Set(hashes).size,3)
  await page.mouse.move(1,400);await page.mouse.move(1439,400);await expect(canvas).toHaveAttribute('data-pose','72')
  await page.mouse.move(720,20);await expect(canvas).toHaveAttribute('data-pose','32')
  const films=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.mp4/.test(r.name)));assert.equal(films.length,0)
 })
 await check('scroll-linked strip, text and card retreat',async()=>{
  const strip=page.locator('.home-strip-row').first(),before=await strip.getAttribute('style')
  await page.mouse.wheel(0,850);await page.waitForTimeout(450);assert.notEqual(await strip.getAttribute('style'),before)
  await page.screenshot({path:path.join(out,'strip.png')})
  await page.locator('.home-about').scrollIntoViewIfNeeded();await page.waitForTimeout(450);await page.screenshot({path:path.join(out,'about.png')})
  await page.locator('.home-capabilities').scrollIntoViewIfNeeded();await page.waitForTimeout(450);await page.screenshot({path:path.join(out,'capabilities.png')})
  const stack=await page.locator('.home-stack').evaluate(n=>n.getBoundingClientRect().top+scrollY)
  for(const [i,y] of [stack,stack+700,stack+1550,stack+2200].entries()){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(500);await page.screenshot({path:path.join(out,`stack-${i}.png`)})}
  const gap=await page.evaluate(()=>document.querySelector('.home-project-grid').getBoundingClientRect().top-document.querySelector('.home-project-karimoku').getBoundingClientRect().bottom);assert(gap<=160,`stack exit gap ${gap}`)
  const scale=await page.locator('.home-project-stack').first().evaluate(n=>new DOMMatrix(getComputedStyle(n).transform).a);assert(scale<.97&&scale>=.93)
 })
 await check('keyboard focus in image strip stays visible',async()=>{await page.locator('.home-strip-row a').first().focus();await page.waitForTimeout(200);const b=await page.locator('.home-strip-row a').first().boundingBox();assert(b.x>=0&&b.x+b.width<=1440);await page.locator('.home-strip-row a').first().blur()})
 for(const [width,height] of [[390,844],[768,1024],[1280,900],[1440,1000],[1920,1080],[1280,650]]){
  await page.setViewportSize({width,height})
  for(const lang of ['','/en'])for(const route of ['/','/systems/ai-video-methods'])await check(`${lang+route} layout ${width}x${height}`,async()=>{
   await page.goto(base+lang+route);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(900)
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))
   if(route==='/'){
    assert.equal(await page.locator('.home-capability-grid article').count(),5);assert.equal(await page.locator('.home-project').count(),8)
    const box=await page.locator('.home-hero-bottom').boundingBox();if(width===390)assert(box.y+box.height<=height+1,JSON.stringify(box))
    assert.equal(await page.locator('.home-stack-slot').first().evaluate(n=>getComputedStyle(n).position),width>=1024&&height>=760?'sticky':'static')
   }
   if([390,1440].includes(width))await page.screenshot({path:path.join(out,`${lang?'en':'zh'}-${route==='/'?'home':'methods'}-${width}.png`)})
  })
 }
 await page.setViewportSize({width:1440,height:1000})
 await check('filters, reload, empty result, keyboard details and lazy reference',async()=>{
  await page.goto(base+'/systems/ai-video-methods');assert.equal(await page.locator('iframe').count(),0);assert.equal(await page.locator('.method-entry').count(),8)
  await page.getByLabel('控制层',{exact:true}).selectOption('camera');assert.equal(await page.locator('.method-entry').count(),2);assert(page.url().includes('layer=camera'))
  await page.reload();await expect(page.locator('.method-entry')).toHaveCount(2)
  await page.getByLabel('关键词',{exact:true}).fill('no-result-xyz');await expect(page.getByRole('status')).toHaveText('0 项方法')
  await page.getByRole('button',{name:'清除筛选'}).click();await expect(page.locator('.method-entry')).toHaveCount(8)
  const summary=page.locator('.method-entry summary').first();await summary.focus();await page.keyboard.press('Enter');assert(await page.locator('.method-entry details').first().evaluate(n=>n.open))
  const embed=page.getByRole('button',{name:'加载参考帖与视频（X）'}).first();if(await embed.count()){await embed.click();assert.equal(await page.locator('iframe').count(),1);await page.getByRole('button',{name:'关闭参考'}).click();assert.equal(await page.locator('iframe').count(),0);await expect(embed).toBeFocused()}
 })
 await check('static center pose survives failed frame loads',async()=>{
  await page.route(/\/media\/v10\/hero\/\d+\.webp/,r=>r.abort());await page.goto(base);await page.waitForTimeout(1000)
  assert(await page.locator('.home-tv-figure img').evaluate(n=>n.complete&&n.naturalWidth>0&&getComputedStyle(n).visibility==='visible'));await page.unrouteAll()
 })
 const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}}),rp=await reduced.newPage()
 await check('reduced motion and keyboard-visible original image band',async()=>{await rp.goto(base);assert.equal(await rp.locator('.home-stack-slot').first().evaluate(n=>getComputedStyle(n).position),'static');assert.equal(await rp.locator('.home-tv-figure canvas').getAttribute('data-pose'),null)})
 for(const route of ['/','/systems/ai-video-methods','/en/systems/ai-video-methods'])await check(`${route} accessibility`,async()=>{await rp.goto(base+route);const report=await new Axe({page:rp}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.equal(report.violations.length,0,JSON.stringify(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))))})
 await reduced.close()
 const nojs=await browser.newContext({javaScriptEnabled:false}),np=await nojs.newPage()
 if(!base.includes('5173'))await check('no-script static research index',async()=>{await np.goto(base+'/systems/ai-video-methods');assert.equal(await np.locator('.method-entry').count(),8);await np.locator('.method-entry summary').first().click();assert((await np.locator('main').innerText()).includes('文档观察'))})
 if(!base.includes('5173'))await check('no-script homepage natural flow',async()=>{await np.setViewportSize({width:1440,height:1000});await np.goto(base);assert.equal(await np.locator('.home-stack-slot').first().evaluate(n=>getComputedStyle(n).position),'static');assert.equal(await np.locator('.home-project-stack').first().evaluate(n=>getComputedStyle(n).position),'relative');const box=await np.locator('.home-strip-row a').first().boundingBox();assert(box.x>=0)})
 await nojs.close();await context.close();await browser.close();results.push({name:'runtime errors',passed:errors.length===0,errors});fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({checks:results.length,failures:results.filter(r=>!r.passed)}));if(results.some(r=>!r.passed))process.exitCode=1
}
main().catch(e=>{console.error(e);process.exitCode=1})
