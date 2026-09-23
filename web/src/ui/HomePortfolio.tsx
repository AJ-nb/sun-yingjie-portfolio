import { usePortfolioReducedMotion as useReducedMotion } from './MotionPreference'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { getDesignOSFeaturedProjects, getProject, type ProjectEntry } from '../data/projectRegistry'
import { asset, getWorkDoc, type Lang } from '../data/workDocs'
import { localePath } from '../data/locale'
import { profileCopy } from '../data/profile'
import { SiteHeader, ContactBlock, SiteFooter } from './SiteChrome'
import { DesignOSSeo } from './DesignOSSeo'
import { TurningFigure, ScrollParagraph, Reveal } from './PortfolioMotion'
import './home-v9.css'
import './home-v10.css'

const shortNames: Record<string, { zh: string; en: string }> = {
  hermes: { zh: 'Hermès · 季节橱窗', en: 'Hermès Seasonal Worlds' },
  arcteryx: { zh: 'Arc’teryx · 山地性能场', en: 'Arc’teryx Mountain Field' },
  karimoku: { zh: 'Karimoku × BENWU', en: 'Karimoku × BENWU' },
  lighting: { zh: '铝型材灯具系统', en: 'Aluminum Lighting' },
  yelisi: { zh: '夜礼司', en: 'YELISI' }, periastra: { zh: 'Periastra', en: 'Periastra' },
  biyuan: { zh: '彼源 AI', en: 'Biyuan AI' }, 'ai-video-systems': { zh: 'AI 视频系统', en: 'AI Video Systems' },
}
const stages: Record<string, { zh: string; en: string }> = {
  hermes: { zh: '团队商业项目', en: 'Commercial team project' }, arcteryx: { zh: '团队商业项目', en: 'Commercial team project' },
  karimoku: { zh: '设计研究', en: 'Design study' }, lighting: { zh: '系列设计与三维呈现', en: 'Series design & 3D' },
  yelisi: { zh: '品牌与产品概念', en: 'Brand & product concept' }, periastra: { zh: '品牌系统研究', en: 'Brand system study' },
  biyuan: { zh: '数字产品与界面', en: 'Digital product & interface' }, 'ai-video-systems': { zh: '独立应用研究', en: 'Independent applied research' },
}
function ImageStrip({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLElement>(null), reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const [travel,setTravel]=useState(450), [ready,setReady]=useState(false)
  useEffect(()=>{setReady(true);const measure=()=>setTravel((innerHeight+(ref.current?.offsetHeight??560))*.3);measure();window.addEventListener('resize',measure);return()=>window.removeEventListener('resize',measure)},[])
  const first = useTransform(scrollYProgress, [0, 1], [-450, -450+travel]), second = useTransform(scrollYProgress, [0, 1], [-450+travel, -450])
  const rows = [['lighting', 'huhu-care', 'yelisi', 'hermes', 'arcteryx'], ['periastra', 'karimoku', 'go-glow', 'biyuan', 'ai-video-systems']]
  return <section className="home-image-strip" data-motion={ready?'ready':undefined} ref={ref} aria-label={lang === 'zh' ? '项目图像速览' : 'A glimpse of the work'}>{rows.map((row, index) => <motion.div className="home-strip-row" key={index} style={reduced ? undefined : { x: index ? second : first }}>{[...row,...row,...row].map((slug,itemIndex) => { const project = getProject(slug)!; return <a href={localePath('/work/' + slug, lang)} key={`${slug}-${itemIndex}`} tabIndex={itemIndex>=row.length?-1:undefined} aria-hidden={itemIndex>=row.length?true:undefined}><img src={asset(project.cover)} alt={project.title[lang]} loading="lazy" width="420" height="270"/><span>{shortNames[slug]?.[lang] ?? project.title[lang]}<ArrowUpRight size={14}/></span></a> })}</motion.div>)}</section>
}
function SelectedCard({ project, lang, large, index, progress }: { progress: MotionValue<number>; project: ProjectEntry; lang: Lang; large: boolean; index: number }) {
  const ref=useRef<HTMLDivElement>(null), reduced=useReducedMotion()
  const [stack,setStack]=useState(false)
  useEffect(()=>{
    const node=ref.current;if(!node||!large)return
    const update=()=>setStack(!reduced&&innerWidth>=1024&&node.offsetHeight+170<=innerHeight)
    const observer=new ResizeObserver(update);observer.observe(node);update();window.addEventListener('resize',update)
    return()=>{observer.disconnect();window.removeEventListener('resize',update)}
  },[large,reduced])
  useEffect(()=>{
    const node=ref.current;if(!node||reduced||(large&&stack))return
    let animation:Animation|undefined
    const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){animation=node.animate([{opacity:.3,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.25,.1,.25,1)'});observer.disconnect()}},{rootMargin:'0px 0px -30px 0px'})
    observer.observe(node);return()=>{observer.disconnect();animation?.cancel()}
  },[large,stack,reduced])
  const scale=useTransform(progress,[index/4,(index+1)/4],[1,1-(2-index)*.03])
  const title = shortNames[project.slug]?.[lang] ?? project.title[lang]
  const doc=getWorkDoc(project.slug,lang)
  const images=[...new Set(Array.from((doc?.body??'').matchAll(/!\[[^\]]*\]\(([^)]+)\)/g),m=>m[1]))].filter(src=>src!==project.cover)
  return <div ref={ref} data-stack={stack?'enabled':'flow'} className={large?'home-stack-slot':'home-secondary-slot'}>
    <motion.article className={'home-project '+(large?'home-project-stack':'home-project-small')+' home-project-'+project.slug} style={{'--card-index':index,...(large&&stack&&!reduced?{scale}:{})} as React.CSSProperties} data-project={project.slug}>
      <div className="home-project-copy"><p className="home-project-stage">{stages[project.slug]?.[lang]}</p><h3><a href={localePath('/work/'+project.slug,lang)}>{title}</a></h3>{large?<span className="home-project-role">{project.roleScope[lang]}</span>:<p>{project.summary[lang]}</p>}<a className="outline-pill" href={localePath('/work/'+project.slug,lang)}>{lang==='zh'?'阅读案例':'Explore project'}<ArrowUpRight size={17}/></a></div>
      <div className="home-project-composition">{large&&<div className="home-project-studies">{images.slice(0,2).map((src,i)=><a key={src} href={localePath('/work/'+project.slug,lang)}><img src={asset(src)} alt={lang==='zh'?`${title} · 设计图 ${i+1}`:`${title} · design study ${i+1}`} loading="lazy"/>{src.includes('/boards/')&&<small>{lang==='zh'?'回顾性重建':'Retrospective reconstruction'}</small>}</a>)}</div>}<a className="home-project-image" href={localePath('/work/'+project.slug,lang)} aria-label={title}><img src={asset(project.cover)} alt={project.title[lang]} loading="lazy" width="1122" height="1402"/></a></div>
    </motion.article>
  </div>
}
export function HomeDesignOS({ lang }: { lang: Lang }) {
  const selected = getDesignOSFeaturedProjects(), profile = profileCopy[lang], hero=useRef<HTMLElement>(null), stack=useRef<HTMLDivElement>(null)
  const [ready,setReady]=useState(false)
  useEffect(()=>setReady(true),[])
  const {scrollYProgress}=useScroll({target:stack,offset:['start start','end end']})
  const capabilities = lang === 'zh' ? [
    ['工业与产品','从使用动作出发，推敲形态、部件关系与结构，让产品在场景中成立。','/work/lighting','铝型材灯具系统'],
    ['3D 与 CMF','用模型、材料和光线比较尺度与触感，让设计选择可见。','/work/yelisi','夜礼司 · 产品概念'],
    ['品牌与视觉','从定位到识别与信息层级，在不同触点保留清晰的品牌关系。','/work/periastra','Periastra · 品牌系统'],
    ['空间与叙事','组织物件、观看路径与季节线索，让空间成为可阅读的叙事。','/work/hermes','Hermès · 季节橱窗'],
    ['AI 与创作系统','把参考、分镜、三维控制和评估整理为可审阅的创作方法。','/systems/ai-video-methods','AI 视频研究方法库'],
  ] : [
    ['Industrial & product','Form, components and structure developed around how a product is used.','/work/lighting','Aluminum lighting system'],
    ['3D & CMF','Models, materials and light make scale, touch and design decisions visible.','/work/yelisi','YELISI · product concepts'],
    ['Brand & visual','Positioning, identity and information hierarchy connect a brand across touchpoints.','/work/periastra','Periastra · brand system'],
    ['Space & narrative','Objects, viewing paths and seasonal cues make a spatial story readable.','/work/hermes','Hermès · seasonal windows'],
    ['AI & creative systems','References, storyboards, 3D control and evaluation become a reviewable creative process.','/systems/ai-video-methods','AI video methods'],
  ]
  return <div className="home-os-shell" lang={lang === 'zh' ? 'zh-CN' : 'en'}>
    <DesignOSSeo route={null} lang={lang}/><a className="site-skip" href="#home-main">{lang === 'zh' ? '跳到主要内容' : 'Skip to main content'}</a><SiteHeader lang={lang}/>
    <main id="home-main">
      <section ref={hero} className="home-hero" id="top" aria-labelledby="home-name"><h1 id="home-name">YINGJIE SUN</h1><TurningFigure hero={hero} lang={lang}/><div className="home-hero-bottom"><div className="home-hero-intro"><p className="home-role">{profile.position}</p><p>{lang === 'zh' ? '从形态到系统。连接产品、3D、CMF 与品牌，让设计在真实语境中成立。' : 'From form to system. Connecting products, 3D, CMF and brand through design that responds to its context.'}</p><a className="hero-work-link" href="#selected">{lang === 'zh' ? '查看精选作品' : 'View selected work'}<ArrowDown size={17}/></a></div><div className="home-hero-contact"><a className="contact-pill" href={'mailto:' + profile.contact.email}>{lang === 'zh' ? '联系我' : 'Contact me'}<ArrowUpRight size={19}/></a><a href={'mailto:' + profile.contact.email}>{profile.contact.email}</a></div></div></section>
      <ImageStrip lang={lang}/>
      <section className="home-about" id="about"><div className="home-about-objects" aria-hidden="true">{['/media/v6/product-lighting-cutout.png','/media/v6/product-huhu-cutout.png','/media/v6/product-plumber-cutout.png','/media/v6/product-lighting-cutout.png'].map((src,i)=><Reveal key={i} className={`home-object home-object-${i}`} delay={[.1,.25,.15,.3][i]}><img src={asset(src)} alt="" loading="lazy"/></Reveal>)}</div><p className="home-about-line">FORM → SYSTEM → INTELLIGENCE</p><h2>{lang === 'zh' ? '让形态有依据，\n让系统有温度。' : 'Thoughtful form.\nCoherent systems.'}</h2><ScrollParagraph>{lang === 'zh' ? '我是孙英杰，一名工业与产品设计师。我从使用情境与材料出发，在产品、视觉与空间之间建立关系；再把有价值的研究与 AI 方法纳入流程，让设计更容易比较、完善与传达。' : 'I’m Yingjie Sun, an industrial and product designer. I start with how things are used and what they are made of, connecting products, visual identity and space. Research and AI enter the process where they make ideas easier to compare, refine and communicate.'}</ScrollParagraph><a className="text-link" href={localePath('/about', lang)}>{lang === 'zh' ? '了解我的工作方式' : 'How I approach design'}<ArrowUpRight size={16}/></a></section>
      <section className="home-capabilities" id="capabilities"><div className="home-capabilities-heading"><h2>{lang === 'zh' ? '从一个物件，\n到一套系统。' : 'From an object\nto a system.'}</h2><p>{lang === 'zh' ? '五种能力，连接设计的不同尺度。' : 'Five capabilities, connected across scales.'}</p></div><div className="home-capability-grid">{capabilities.map(([title, body, path, note],i) => <Reveal key={title} delay={i*.1}><article><h3>{title}</h3><p>{body}</p><small>{note}</small><a href={localePath(path, lang)}>{lang === 'zh' ? '查看相关作品' : 'See the work'}<ArrowUpRight size={17}/></a></article></Reveal>)}</div></section>
      <section className="home-selected" id="selected" aria-labelledby="selected-title"><header><h2 id="selected-title">{lang === 'zh' ? '精选作品' : 'Selected work'}</h2><p>{lang === 'zh' ? '从商业空间，到产品形态、品牌与创作系统。' : 'Commercial spaces, physical products, identities and creative systems.'}</p></header><div className="home-stack" data-motion={ready?'ready':undefined} ref={stack}>{selected.slice(0, 3).map((project, i) => <SelectedCard progress={scrollYProgress} key={project.slug} project={project} lang={lang} index={i} large/>)}</div><div className="home-project-grid">{selected.slice(3).map((project, i) => <SelectedCard progress={scrollYProgress} key={project.slug} project={project} lang={lang} index={i} large={false}/>)}</div><a className="outline-pill home-archive-link" href={localePath('/work', lang)}>{lang === 'zh' ? '浏览全部 32 个项目' : 'Explore all 32 projects'}<ArrowUpRight size={18}/></a></section>
      <ContactBlock lang={lang}/>
    </main><SiteFooter lang={lang}/>
  </div>
}
