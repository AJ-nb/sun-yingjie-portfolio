import VideoReferenceIndex from './VideoReferenceIndex'
import { asset } from '../data/workDocs'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import methods from '../data/aiVideoMethods.json'
import { localePath } from '../data/locale'
import type { Lang } from '../data/workDocs'
import './ai-video-methods.css'

const layers = [
  ['intent','意图','Intent'],['visual','视觉一致性','Visual lock'],['temporal','时间结构','Time'],
  ['physical','物理逻辑','Physics'],['camera','镜头系统','Camera'],['evaluation','评估迭代','Evaluation'],
]
const applications=[['product','产品','Product'],['cmf','材料与光线','CMF & light'],['space','空间','Space'],['narrative','叙事','Narrative']]
type Entry = typeof methods.entries[number]
type Filters = {q:string;layer:string;application:string}
const empty:Filters={q:'',layer:'',application:''}
function readFilters():Filters {
  const search=new URLSearchParams(location.search)
  return {q:(search.get('q')??'').slice(0,150),layer:layers.some(l=>l[0]===search.get('layer'))?search.get('layer')!:'',application:applications.some(l=>l[0]===search.get('application'))?search.get('application')!:''}
}
function Reference({entry,lang}:{entry:Entry;lang:Lang}) {
  const [open,setOpen]=useState(false), reference=entry.reference
  if(!reference)return <a href={entry.templateUrl} target="_blank" rel="noreferrer">{lang==='zh'?'阅读参考模板':'Read the source template'} <ArrowUpRight size={14}/></a>
  const tweet=/\/status\/(\d+)/.exec(reference.sourceUrl)?.[1]
  return <div className="method-reference"><p>{lang==='zh'?'参考案例':'Reference case'} · {reference.title}</p>
    {tweet&&<button type="button" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?(lang==='zh'?'关闭参考':'Close reference'):(lang==='zh'?'加载参考帖与视频（X）':'Load reference post & video (X)')}</button>}
    <a href={reference.sourceUrl} target="_blank" rel="noreferrer">{lang==='zh'?'打开原始来源':'Open original source'} <ArrowUpRight size={14}/></a>
    <small>{reference.creator} · <a href={reference.recordUrl} target="_blank" rel="noreferrer">GoodCase</a> · {lang==='zh'?'参考作品':'Reference work'}</small>
    {tweet&&open&&<><p>{lang==='zh'?'参考内容由 X 提供；若未显示，请使用上方的原始来源链接。':'Reference content is served by X. If it does not appear, use the original-source link above.'}</p><iframe title={`${lang==='zh'?'参考视频':'Reference video'}: ${reference.title}`} src={`https://platform.twitter.com/embed/Tweet.html?id=${tweet}&theme=dark&dnt=true`} loading="lazy" allow="fullscreen" referrerPolicy="strict-origin-when-cross-origin"/></>}

  </div>
}
export function MethodsLink({lang}:{lang:Lang}) {
  return <a className="methods-feature-link" href={localePath('/systems/ai-video-methods',lang)}><span>{lang==='zh'?'从参考到可控镜头':'From references to controlled shots'}</span><strong>{lang==='zh'?'AI 视频研究方法库':'AI video methods'}</strong><span>{lang==='zh'?'六个控制层 · 八项方法拆解':'Six control layers · eight method studies'} <ArrowUpRight size={18}/></span></a>
}
export default function AIVideoMethods({lang}:{lang:Lang}) {
  const [filters,setFilters]=useState<Filters>(empty)
  useEffect(()=>{const sync=()=>{setFilters(readFilters());const link=document.querySelector<HTMLAnchorElement>('.site-language');if(link)link.href=localePath(location.pathname+location.search,lang==='zh'?'en':'zh')};sync();window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync)},[lang])
  function change(next:Filters) {
    setFilters(next)
    const url=new URL(location.href)
    for(const key of ['q','layer','application'] as const){if(next[key])url.searchParams.set(key,next[key]);else url.searchParams.delete(key)}
    history.replaceState(null,'',url)
    // Keep the selected filters when switching language without changing canonical metadata.
    const switcher=document.querySelector<HTMLAnchorElement>('.site-language')
    if(switcher)switcher.href=localePath(url.pathname+url.search,lang==='zh'?'en':'zh')
  }
  const query=filters.q.normalize('NFKC').toLowerCase().trim()
  const shown=methods.entries.filter(e=>(!filters.layer||e.layer===filters.layer)&&(!filters.application||e.application===filters.application)&&(!query||[e.title[lang],e.goal[lang],e.control[lang],e.transfer[lang],e.template].join(' ').normalize('NFKC').toLowerCase().includes(query)))
  const fields=[['goal','目标','Goal'],['inputs','输入','Inputs'],['control','控制方式','Control'],['observation','文档观察','Document observation'],['limits','限制','Limits'],['transfer','设计迁移','Design transfer']] as const
  return <article className="methods-page">
    <header className="methods-heading"><p>{lang==='zh'?'独立研究 / 创作系统':'Independent research / creative systems'}</p><h1>{lang==='zh'?'从参考，\n到可控镜头。':'From references\nto controlled shots.'}</h1><p>{lang==='zh'?'把分镜、角色、材料、空间与运镜分开思考，再组织成可以检查、修改和复用的工作流程。':'Separate storyboards, identity, material, space and camera decisions, then connect them in a workflow that can be inspected, revised and reused.'}</p></header>
    <section className="method-layers" aria-label={lang==='zh'?'六个控制层':'Six control layers'}>{layers.map(([id,zh,en],i)=><a key={id} href={`#methods`} onClick={()=>change({...empty,layer:id})}><span>{String(i+1).padStart(2,'0')}</span><strong>{lang==='zh'?zh:en}</strong><small>{lang==='zh'?['片段要说明什么','哪些特征必须保留','动作如何按时间衔接','接触与受力是否成立','视点如何解释主体','用什么标准决定重做'][i]:['What must the clip explain?','What must remain invariant?','How do actions connect in time?','Do contact and force make sense?','How does viewpoint explain the subject?','What would justify another iteration?'][i]}</small></a>)}</section>
    <section className="methods-practice"><img src={asset('/works/ai-video-systems/ai-video-systems-cover.webp')} alt={lang==='zh'?'个人短片与Blender白模的对照画面':'Personal film paired with Blender blocking'} loading="lazy" width="1080" height="1440"/><div><p>{lang==='zh'?'个人实践':'Personal practice'}</p><h2>{lang==='zh'?'用白模把镜头意图变得具体。':'Make camera intent tangible through blocking.'}</h2><p>{lang==='zh'?'故事与参考 → 分镜 → Blender 白模 → 角色与提示语 → 渲染审阅。22.08 秒片段连接研究方法与个人实践；11 个分镜、20 多个角色及一次生成均保留为作者过程记录。':'Story and references → storyboard → Blender blocking → character inputs and prompts → render review. The 22.08-second film connects method research to personal practice. Eleven storyboard units, 20+ characters and one-pass generation remain author-described process records.'}</p><a className="outline-pill" href={localePath('/work/ai-video-systems',lang)}>{lang==='zh'?'查看个人流程与影片':'View the personal workflow and film'}<ArrowUpRight size={18}/></a></div></section>
    <section id="methods"><div className="methods-section-title"><h2>{lang==='zh'?'八个问题，八种控制方法。':'Eight questions. Eight control methods.'}</h2><p>{lang==='zh'?'以下是对源文档的分析与设计迁移建议，并与个人流程应用分开呈现。':'These source-document analyses and design-transfer proposals are presented alongside, and separately from, the personal workflow application.'}</p></div>
      <form className="method-filters" onSubmit={e=>e.preventDefault()}><label>{lang==='zh'?'关键词':'Search'}<input type="search" value={filters.q} onChange={e=>change({...filters,q:e.target.value})} placeholder={lang==='zh'?'例如：材质、分镜、角色':'Try material, storyboard, character'}/></label><label>{lang==='zh'?'控制层':'Control layer'}<select aria-label={lang==='zh'?'控制层':'Control layer'} value={filters.layer} onChange={e=>change({...filters,layer:e.target.value})}><option value="">{lang==='zh'?'全部控制层':'All layers'}</option>{layers.map(([id,zh,en])=><option key={id} value={id}>{lang==='zh'?zh:en}</option>)}</select></label><label>{lang==='zh'?'应用场景':'Application'}<select aria-label={lang==='zh'?'应用场景':'Application'} value={filters.application} onChange={e=>change({...filters,application:e.target.value})}><option value="">{lang==='zh'?'全部场景':'All applications'}</option>{applications.map(([id,zh,en])=><option key={id} value={id}>{lang==='zh'?zh:en}</option>)}</select></label><button type="button" onClick={()=>change(empty)}>{lang==='zh'?'清除筛选':'Clear filters'}</button></form>
      <p className="method-count" role="status">{lang==='zh'?`${shown.length} 项方法`:`${shown.length} methods`}</p>
      {shown.length===0&&<p>{lang==='zh'?'没有匹配结果，请减少关键词或清除筛选。':'No matching methods. Try fewer keywords or clear the filters.'}</p>}
      <div className="method-list">{shown.map((entry)=><article className="method-entry" id={entry.id} key={entry.id}><div className="method-intro"><span>{applications.find(a=>a[0]===entry.application)?.[lang==='zh'?1:2]}</span><h3>{entry.title[lang]}</h3><p>{entry.goal[lang]}</p></div><details><summary>{lang==='zh'?'展开方法拆解':'Explore the method'}</summary><dl>{fields.map(([key,zh,en])=><div key={key}><dt>{lang==='zh'?zh:en}</dt><dd>{entry[key][lang]}</dd></div>)}</dl><Reference entry={entry} lang={lang}/><a className="method-template" href={entry.templateUrl.replace('/en/',lang==='zh'?'/zh/':'/en/')} target="_blank" rel="noreferrer">{lang==='zh'?'查阅固定版本的参考模板':'Read the pinned source template'} <ArrowUpRight size={14}/></a></details></article>)}</div>
    </section>
    <VideoReferenceIndex lang={lang}/><footer className="methods-context"><h2>{lang==='zh'?'资料与研究边界':'Sources and research boundaries'}</h2><p>{lang==='zh'?'本专题基于 Awesome Seedance / goodcase.ai 的整理资料，重新组织控制层、适用条件和产品设计迁移建议。源文档分析、个人流程与第三方参考分别呈现。':'This study reorganizes curation from Awesome Seedance / goodcase.ai into control layers, conditions of use and product-design applications. Source-document analysis, personal practice and third-party references remain distinguishable.'}</p><p>{lang==='zh'?'资料检索':'Retrieved'}: {methods.source.retrievedAt} · <a href={`${methods.source.repository}/tree/${methods.source.revision}`}>{lang==='zh'?'固定版本':'Pinned revision'} {methods.source.revision.slice(0,7)}</a></p><p>{lang==='zh'?'代码 MIT；整理内容 CC BY 4.0；提示词与媒体由各自权利人持有。本站没有复制第三方视频文件，参考帖仅在点击后从原平台加载。':'Code: MIT. Curation: CC BY 4.0. Prompts and media remain with their respective rights holders. Third-party video files are not copied here; reference posts load from the original platform only after a click.'} <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p></footer>
  </article>
}
