import { useEffect, useState } from 'react'
import index from '../data/aiVideoIndex.json'
import { localePath } from '../data/locale'
import type { Lang } from '../data/workDocs'

const layers=[['intent','意图','Intent'],['visual','视觉一致性','Visual lock'],['temporal','时间结构','Time'],['physical','物理逻辑','Physics'],['camera','镜头系统','Camera'],['evaluation','评估迭代','Evaluation']]
const applications=[['product','产品','Product'],['cmf','材料与光线','CMF & light'],['space','空间','Space'],['narrative','叙事','Narrative']]
const initial={q:'',layer:'',application:'',page:1}
const pageSize=18
export default function VideoReferenceIndex({lang}:{lang:Lang}) {
  const [filters,setFilters]=useState(initial)
  const [active,setActive]=useState<string|null>(null)
  const [hydrated,setHydrated]=useState(false)
  useEffect(()=>{
    const read=()=>{const q=new URLSearchParams(location.search);setFilters({q:(q.get('catalog_q')||'').slice(0,150),layer:layers.some(l=>l[0]===q.get('catalog_layer'))?q.get('catalog_layer')!:'',application:applications.some(a=>a[0]===q.get('catalog_application'))?q.get('catalog_application')!:'',page:Math.max(1,Number(q.get('catalog_page'))||1)});setActive(null)}
    read();setHydrated(true);window.addEventListener('popstate',read);return()=>window.removeEventListener('popstate',read)
  },[])
  const query=filters.q.normalize('NFKC').toLowerCase().trim()
  const matches=index.entries.filter(e=>(!filters.layer||e.layer===filters.layer)&&(!filters.application||e.application===filters.application)&&(!query||[e.title.zh,e.title.en,e.focus.zh,e.focus.en,e.template,...e.models].join(' ').normalize('NFKC').toLowerCase().includes(query)))
  const pages=Math.max(1,Math.ceil(matches.length/pageSize)),page=Math.min(pages,Math.floor(filters.page))
  const shown=hydrated?matches.slice((page-1)*pageSize,page*pageSize):matches
  function change(next:typeof initial){
    setFilters(next);setActive(null)
    const url=new URL(location.href)
    for(const [key,value] of Object.entries(next)){const name='catalog_'+key;if(value!==''&&!(key==='page'&&value===1))url.searchParams.set(name,String(value));else url.searchParams.delete(name)}
    history.replaceState(null,'',url)
    const switcher=document.querySelector<HTMLAnchorElement>('.site-language');if(switcher)switcher.href=localePath(url.pathname+url.search,lang==='zh'?'en':'zh')
  }
  return <section className="reference-catalog" id="reference-catalog">
    <div className="methods-section-title"><p>{lang==='zh'?'研究索引 / 非个人作品':'Research index / reference work'}</p><h2>{lang==='zh'?'完整索引，按问题查阅。':'A complete index, organized around questions.'}</h2><p>{lang==='zh'?`${index.entries.length} 条固定版本参考记录。分类是研究导航，描述的是分析关注点，不代表观看或生成验证。`:`${index.entries.length} pinned reference records. Categories describe research questions, not viewing or generation-test results.`}</p></div>
    <form className="method-filters" onSubmit={e=>e.preventDefault()}>
      <label>{lang==='zh'?'搜索全部参考':'Search all references'}<input type="search" value={filters.q} onChange={e=>change({...filters,q:e.target.value,page:1})}/></label>
      <label>{lang==='zh'?'索引控制层':'Index control layer'}<select value={filters.layer} onChange={e=>change({...filters,layer:e.target.value,page:1})}><option value="">{lang==='zh'?'全部':'All'}</option>{layers.map(([id,zh,en])=><option key={id} value={id}>{lang==='zh'?zh:en}</option>)}</select></label>
      <label>{lang==='zh'?'索引应用场景':'Index application'}<select value={filters.application} onChange={e=>change({...filters,application:e.target.value,page:1})}><option value="">{lang==='zh'?'全部':'All'}</option>{applications.map(([id,zh,en])=><option key={id} value={id}>{lang==='zh'?zh:en}</option>)}</select></label>
      <button type="button" onClick={()=>change(initial)}>{lang==='zh'?'清除索引筛选':'Clear index filters'}</button>
    </form>
    <p role="status">{lang==='zh'?`${matches.length} 条结果 · 第 ${page} / ${pages} 页`:`${matches.length} results · Page ${page} / ${pages}`}</p>
    {!matches.length&&<p>{lang==='zh'?'暂无匹配记录，请调整筛选。':'No matching records. Adjust the filters.'}</p>}
    <div className="reference-grid">{shown.map(entry=>{const tweet=/\/status\/(\d+)/.exec(entry.sourceUrl)?.[1];return <article key={entry.id} id={'reference-'+entry.id}>
      <small>{entry.models.join(' / ')} · {lang==='zh'?'案例解析索引':'Case analysis index'}</small><h3>{entry.title[lang]}</h3><p>{lang==='zh'?'分析关注：':'Research focus: '}{entry.focus[lang]}</p>
      <details><summary>{lang==='zh'?'参考与资料说明':'Reference and source notes'}</summary><p>{lang==='zh'?'文档索引；未标记为已观看或个人复测。':'Document index; not marked as watched or personally retested.'}</p><p>{entry.creator} · <a href={entry.sourceUrl} target="_blank" rel="noreferrer">{lang==='zh'?'来源':'Source'}</a> · <a href={entry.recordUrl} target="_blank" rel="noreferrer">GoodCase</a></p>
        {tweet&&<button type="button" aria-expanded={active===entry.id} onClick={()=>setActive(active===entry.id?null:entry.id)}>{active===entry.id?(lang==='zh'?'关闭参考视频':'Close reference video'):(lang==='zh'?'点击加载参考视频':'Load reference video')}</button>}
        {tweet&&active===entry.id&&<><p>{lang==='zh'?'视频由 X 提供；如未显示，可使用来源链接。':'Video is served by X. Use the source link if unavailable.'}</p><iframe title={entry.title[lang]} src={`https://platform.twitter.com/embed/Tweet.html?id=${tweet}&theme=dark&dnt=true`} loading="lazy" allow="fullscreen" referrerPolicy="strict-origin-when-cross-origin"/></>}
      </details>
    </article>})}</div>
    {hydrated&&<nav className="catalog-pagination" aria-label={lang==='zh'?'参考索引分页':'Reference index pages'}><button disabled={page<=1} onClick={()=>change({...filters,page:page-1})}>{lang==='zh'?'上一页':'Previous'}</button><span>{page} / {pages}</span><button disabled={page>=pages} onClick={()=>change({...filters,page:page+1})}>{lang==='zh'?'下一页':'Next'}</button></nav>}
  </section>
}
