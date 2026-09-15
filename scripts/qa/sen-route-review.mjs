import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const out=path.join(root,'design/qa-r2'); await fs.mkdir(out,{recursive:true});
const base=process.env.PORTFOLIO_REVIEW_URL||'http://127.0.0.1:8946/';
const report={at:new Date().toISOString(),base,scope:'Focused independent local review. Normal motion; GLB request intentionally blocked to isolate route/layout checks from heavy 3D work.',checks:[],traces:{},errors:[]};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
await context.route('**/models/avatar.glb',route=>route.abort());
const page=await context.newPage();
page.setDefaultTimeout(15000);
page.on('pageerror',error=>report.errors.push(error.message));
async function check(name,fn){try{const detail=await fn();report.checks.push({name,pass:true,detail});console.log('PASS '+name);}catch(error){report.checks.push({name,pass:false,error:String(error)});console.log('FAIL '+name+': '+error.message.slice(0,600));}await fs.writeFile(path.join(out,'digital-focused-results.json'),JSON.stringify(report,null,2));}
async function traceAction(action){
 await page.evaluate(()=>{
  const docTop=node=>{let result=0;while(node){result+=node.offsetTop||0;node=node.offsetParent;}return result;};
  window.__routeTrace=[];window.__routeClickSample=null;const start=performance.now();
  const sample=()=>{const node=document.querySelector('.case-page'),head=document.querySelector('.site-header');return {ms:performance.now()-start,title:document.querySelector('.case-header h1')?.textContent??null,hash:location.hash,y:scrollY,docHeight:document.documentElement.scrollHeight,caseLayoutTop:node?docTop(node):null,caseRectTop:node?.getBoundingClientRect().top??null,opacity:node?getComputedStyle(node).opacity:null,transform:node?getComputedStyle(node).transform:null,headerPosition:head?getComputedStyle(head).position:null,home:!!document.querySelector('#top')};};
  // Playwright may scroll a lazily loaded target before dispatching its click.
  // Capture the baseline before React handles that event, after auto-scrolling.
  window.__routeClickListener=()=>{window.__routeClickSample=sample();};
  document.addEventListener('click',window.__routeClickListener,{capture:true,once:true});
  const tick=()=>{window.__routeTrace.push(sample());if(performance.now()-start<1000)requestAnimationFrame(tick);};tick();
 });
 await action();await page.waitForTimeout(1100);return page.evaluate(()=>{document.removeEventListener('click',window.__routeClickListener,true);return {frames:window.__routeTrace,click:window.__routeClickSample};});
}
try{
 await check('Recurring performance window detects later sustained slowdown',async()=>{
  const source=await fs.readFile(path.join(root,'web/src/scene/PortraitScene.tsx'),'utf8');
  const code=source.slice(source.indexOf('const stats = performance.current'),source.indexOf('const smoothOff'));
  const run=new Function('deltas',`const performance={current:{count:0,elapsed:0,notified:false}};const reduced=false;let calls=0;const onSlow=()=>calls++;for(const dt of deltas){${code}}return {calls,stats:performance.current};`);
  const result=run([...Array(150).fill(1/60),...Array(600).fill(.1)]);assert.equal(result.calls,1);return result;
 });
 await check('641/680/700 header and gallery navigation remain visible and unobstructed',async()=>{
  const results=[];
  for(const width of [641,680,700])for(const lang of ['zh','en']){
   await page.setViewportSize({width,height:900});await page.goto(base+(lang==='en'?'?lang=en':''));await page.locator('.wk-progress').waitFor();
   const header=await page.evaluate(()=>{const head=document.querySelector('.site-header'),nav=head.querySelector('nav');const r=head.getBoundingClientRect();return {display:getComputedStyle(nav).display,left:r.left,right:r.right,scrollWidth:document.documentElement.scrollWidth,width:innerWidth,links:[...nav.querySelectorAll('a')].map(link=>{const rect=link.getBoundingClientRect();const hit=document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2);return {label:link.textContent,href:link.getAttribute('href'),left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,hit:hit===link||link.contains(hit)};})};});
   assert.equal(header.display,'flex');assert(header.left>=0&&header.right<=width&&header.scrollWidth<=width,JSON.stringify(header));assert.deepEqual(header.links.map(link=>link.href),['#works','#about','#contact']);assert(header.links.every(link=>link.hit&&link.left>=0&&link.right<=width&&link.top>=0&&link.bottom<=900),JSON.stringify(header));
   await page.locator('.wk-gallery').evaluate(node=>window.scrollTo({top:node.getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.waitForTimeout(250);
   const row=await page.evaluate(()=>{const nav=document.querySelector('.mobile-nav'),progress=document.querySelector('.wk-progress');const rect=progress.getBoundingClientRect();return {width:innerWidth,vertical:document.querySelector('.wk-gallery').classList.contains('wk-vertical'),navDisplay:getComputedStyle(nav).display,progress:{top:rect.top,bottom:rect.bottom},buttons:[...progress.querySelectorAll('button')].map(button=>{const r=button.getBoundingClientRect();const el=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {label:button.textContent,disabled:button.disabled,hit:el===button||button.contains(el)};})};});
   assert.equal(row.navDisplay,'none');assert.equal(row.vertical,false);assert(row.buttons.every(button=>button.disabled||button.hit),JSON.stringify(row));results.push({...row,lang,header});await page.screenshot({path:path.join(out,`digital-gallery-${width}${lang==='en'?'-en':''}.png`)});
  }return results;
 });
 let savedListY,firstTitle,nextTitle,nextHash;
 await check('Normal-motion detail entry restores top and displays an entry transition',async()=>{
  await page.setViewportSize({width:1440,height:900});await page.goto(base+'#works');await page.getByRole('button',{name:'工业与产品',exact:true}).click();await page.getByRole('searchbox').fill('管道');assert.equal(await page.locator('.catalog-grid .work-card').count(),1);
  await page.locator('.catalog-grid .work-card').scrollIntoViewIfNeeded();await page.waitForTimeout(200);savedListY=await page.evaluate(()=>scrollY);
  const trace=await traceAction(()=>page.locator('.catalog-grid .work-card').click());report.traces.entry=trace;firstTitle=await page.locator('.case-header h1').innerText();savedListY=trace.click.y;
  assert.equal(await page.evaluate(()=>scrollY),0);assert(trace.frames.some(frame=>frame.title&&Number(frame.opacity)>0&&Number(frame.opacity)<.98),'No intermediate entrance opacity recorded');return {savedListY,firstTitle,intermediateFrames:trace.frames.filter(frame=>frame.title&&Number(frame.opacity)<.98).length};
 });
 await check('Next case holds outgoing scroll and replays entry',async()=>{
  await page.locator('.next-case a').scrollIntoViewIfNeeded();await page.waitForTimeout(200);nextHash=await page.locator('.next-case a').getAttribute('href');
  const trace=await traceAction(()=>page.locator('.next-case a').click());report.traces.next=trace;nextTitle=await page.locator('.case-header h1').innerText();
  assert.notEqual(nextTitle,firstTitle);assert(trace.click,'No click baseline captured');const before=trace.click.y;const outgoing=trace.frames.filter(frame=>frame.title===firstTitle&&frame.ms>=trace.click.ms);assert(outgoing.length>2);assert(outgoing.every(frame=>Math.abs(frame.y-before)<3&&Math.abs(frame.caseLayoutTop-trace.click.caseLayoutTop)<2),'Outgoing next-case scroll/layout changed after the click; see report.traces.next');assert(trace.frames.some(frame=>frame.title===nextTitle&&Number(frame.opacity)>0&&Number(frame.opacity)<.98),'Next entry has no transition');assert.equal(await page.evaluate(()=>scrollY),0);return {before,outgoingFrames:outgoing.length,nextTitle,nextHash};
 });
 await check('Browser back preserves outgoing layout until exit, then filter/query/list position',async()=>{
  await page.evaluate(()=>window.scrollTo({top:1200,behavior:'instant'}));await page.waitForTimeout(100);const before=await page.evaluate(()=>scrollY);
  const trace=await traceAction(()=>page.evaluate(()=>history.back()));report.traces.back=trace;
  await page.locator('.catalog-grid').waitFor();assert.equal(await page.getByRole('searchbox').inputValue(),'管道');assert.equal(await page.getByRole('button',{name:'工业与产品',exact:true}).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.catalog-grid .work-card').count(),1);const after=await page.evaluate(()=>scrollY);assert(Math.abs(after-savedListY)<3,JSON.stringify({savedListY,after}));
  const outgoing=trace.frames.filter(frame=>frame.title===nextTitle);const baseline=outgoing[0];const early=outgoing.filter(frame=>frame.ms>20&&frame.ms<350);assert(early.length>2,'Insufficient outgoing back-navigation frames');assert(early.every(frame=>Math.abs(frame.caseLayoutTop-baseline.caseLayoutTop)<2&&Math.abs(frame.y-before)<3),'Outgoing back-navigation scroll/layout changed; see report.traces.back');return {before,after,savedListY,outgoingFrames:outgoing.length,caseLayoutTop:baseline.caseLayoutTop};
 });
 await check('Browser forward returns to next case at its entry position',async()=>{
  await page.goForward();await page.waitForTimeout(750);assert.equal(new URL(page.url()).hash,nextHash);assert.equal(await page.locator('.case-header h1').innerText(),nextTitle);const y=await page.evaluate(()=>scrollY);assert.equal(y,0);return {hash:nextHash,y};
 });
 await check('Explicit back button returns to same filtered list',async()=>{
  await page.locator('.case-back-bottom').scrollIntoViewIfNeeded();await page.waitForTimeout(200);const trace=await traceAction(()=>page.locator('.case-back-bottom').click());report.traces.explicitBack=trace;await page.locator('.catalog-grid').waitFor();assert.equal(await page.getByRole('searchbox').inputValue(),'管道');const after=await page.evaluate(()=>scrollY);assert(Math.abs(after-savedListY)<3,JSON.stringify({savedListY,after}));return {after,savedListY};
 });
}finally{await context.close();await browser.close();report.completed=new Date().toISOString();await fs.writeFile(path.join(out,'digital-focused-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.checks.filter(x=>x.pass).length,failed:report.checks.filter(x=>!x.pass).length,errors:report.errors}));if(report.checks.some(x=>!x.pass)||report.errors.length)process.exitCode=1;}
