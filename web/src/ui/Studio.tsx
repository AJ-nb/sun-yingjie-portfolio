import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { asset, getWorkDoc, type Lang, type WorkDoc } from '../data/workDocs'

type AnchorHandler = (event: MouseEvent<HTMLAnchorElement>) => void
const featured = ['hermes', 'plumber', 'biyuan', 'periastra']
const labels = {
  zh: ['空间的叙事', '产品的秩序', '数字的体验', '品牌的识别'],
  en: ['Spatial stories', 'Product systems', 'Digital experiences', 'Visual identities'],
}

export function CaseLink({ slug, children, visit, className, focusKey }: { slug: string; children: ReactNode; visit: (slug: string) => void; className?: string; focusKey: string }) {
  return <a className={className} href={`#/work/${slug}`} data-return-focus={focusKey} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault(); visit(slug)
  }}>{children}</a>
}

export function StudioIntroduction({ lang, reduced, portrait, visit, anchor, selection, setSelection }: { lang: Lang; reduced: boolean; portrait: ReactNode; visit: (slug: string) => void; anchor: AnchorHandler; selection: number; setSelection: (value: number) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const visual = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const work = getWorkDoc(featured[selection], lang)!
  useEffect(() => {
    const element = visual.current
    if (!element || reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let frame = 0
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = element.getBoundingClientRect()
        element.style.transform = `perspective(1200px) rotateX(${(0.5 - (event.clientY - box.top) / box.height) * 3}deg) rotateY(${((event.clientX - box.left) / box.width - .5) * 4}deg)`
      })
    }
    const leave = () => { cancelAnimationFrame(frame); element.style.transform = '' }
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave)
    return () => { leave(); element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave) }
  }, [reduced])
  return <div className="intro-scene studio-intro" ref={root}>
    <section className="studio-hero" aria-labelledby="hero-name">
      <div className="hero-ledger"><span><i aria-hidden="true" /> {lang === 'zh' ? '孙英杰 / 设计与实践' : 'YINGJIE SUN / DESIGN & PRACTICE'}</span><span>INDEPENDENT PERSPECTIVE · 2026</span></div>
      <motion.div className="hero-display" style={reduced ? undefined : { y: wordY }} aria-hidden="true"><span>BEYOND</span><span>THE <em>FORM.</em><MoveUpRight /></span></motion.div>
      <div className="hero-composition">
        <div className="hero-narrative">
          <span className="studio-eyebrow">PRODUCT · BRAND · DIGITAL</span>
          <h1 id="hero-name">{lang === 'zh' ? <>让想法有形，<br />让体验<em>发生。</em></> : <>Ideas take form.<br />Experiences <em>come alive.</em></>}</h1>
          <p className="hero-personal">{lang === 'zh' ? '我是孙英杰，产品设计背景的跨媒介设计师。以空间、物件、品牌与数字产品为载体，探索一个想法从视觉吸引到实际使用的完整过程。' : 'I’m Yingjie Sun, a multidisciplinary designer trained in product design. I work across spaces, objects, identities and digital products, following ideas from visual expression into use.'}</p>
          <div className="hero-actions"><a href="#selected" onClick={anchor} className="studio-primary">{lang === 'zh' ? '进入作品展览' : 'Enter the collection'}<ArrowDown size={19} /></a><a href="#about" onClick={anchor} className="studio-text-link">{lang === 'zh' ? '认识我' : 'Meet the designer'}<ArrowUpRight size={17} /></a></div>
          <div className="hero-annotation"><span>01—04</span><p>{lang === 'zh' ? '从商业橱窗的空间叙事，到一个工具中的细微反馈。设计，发生在不同尺度之间。' : 'From the story inside a commercial window to the smallest feedback in a tool. Design happens across scales.'}</p></div>
        </div>
        <div className="hero-artwork" ref={visual}>
          <div className="hero-art-orbit" aria-hidden="true" />
          <span className="hero-art-caption">{lang === 'zh' ? '点击下方切换设计视角' : 'CHOOSE A DESIGN PERSPECTIVE'} <ArrowDown size={14} /></span>
          <CaseLink className={`hero-feature hero-feature-${work.slug}`} slug={work.slug} visit={visit} focusKey={`hero:${work.slug}`}>
            <img key={work.slug} src={asset(`/thumbnails/${work.slug}.webp`)} alt={work.title} loading="eager" />
            <div className="hero-feature-label"><span>{String(selection + 1).padStart(2, '0')} / {work.title}</span><span className="round-arrow"><ArrowUpRight size={23}/></span></div>
          </CaseLink>
          <div className="hero-selector" role="group" aria-label={lang === 'zh' ? '首屏作品视角' : 'Featured design perspectives'}>{featured.map((slug, index) => <button key={slug} aria-pressed={selection === index} onClick={() => setSelection(index)}><span>0{index + 1}</span>{labels[lang][index]}</button>)}</div>
          <div className="portrait-medallion">{portrait}<span className="portrait-caption">SYJ / DIGITAL SELF-PORTRAIT</span></div>
        </div>
      </div>
      <div className="hero-bottom"><span>{lang === 'zh' ? '形态有理由 · 体验有逻辑 · 表达有态度' : 'FORM WITH REASON · EXPERIENCE WITH LOGIC'}</span><a href="#introduction" onClick={anchor}>{lang === 'zh' ? '继续了解' : 'Read the introduction'}<ArrowDown size={15}/></a><span>SCROLL TO DISCOVER</span></div>
    </section>
    <section className="studio-statement" id="introduction" aria-labelledby="statement-title">
      <div className="statement-index"><span className="studio-eyebrow">01 / THE DESIGNER</span><span className="statement-asterisk" aria-hidden="true">✳</span><span>{lang === 'zh' ? '从物的设计，到体验的构建。' : 'FROM OBJECTS TO EXPERIENCES.'}</span></div>
      <div className="statement-body"><h2 id="statement-title">{lang === 'zh' ? <>设计，是把一个<em>为什么，</em><br />变成可以感受的<em>答案。</em></> : <>Design turns a <em>why</em><br />into something you can <em>experience.</em></>}</h2><div className="statement-columns"><p>{lang === 'zh' ? '我的起点是产品设计：理解人的动作、物的结构，以及材料如何影响使用。后来，工作从模型和渲染延伸到商业橱窗、品牌系统与数字工具。媒介不断变化，但我始终关心同一个问题——设计为什么要以这种方式存在？' : 'My starting point is product design: how people act, how objects are structured, and how materials shape use. My work has since expanded from models and renders into commercial windows, identity systems and digital tools. Across these media, I keep asking why a design should take this particular form.'}</p><p>{lang === 'zh' ? '在 BENWU，我参与商业橱窗与灯具的三维设计和视觉呈现；在杭州理灵，我参与品牌孵化、官网视觉、交互与实现。与此同时，我通过镜序、砚台等实践，把 AI 放进有输入、确认、反馈和恢复的工作流程，让技术真正参与具体问题的解决。' : 'At BENWU, I contributed to 3D design and visualization for commercial windows and lighting. At Hangzhou Liling, my work connects brand incubation, website visuals, interaction and implementation. Alongside this, projects such as Lensflow and Yantai explore AI workflows with deliberate input, review, feedback and recovery.'}</p></div><a className="studio-text-link" href="#about" onClick={anchor}>{lang === 'zh' ? '阅读完整个人档案与工作方法' : 'Read my full profile and process'}<ArrowUpRight size={18}/></a></div>
    </section>
  </div>
}

export function StudioMarquee({ reduced, lang }: { reduced: boolean; lang: Lang }) {
  const words = ['FORM', 'SPACE', 'IDENTITY', 'EXPERIENCE']
  return <div className="marquee-shell"><div className={`studio-marquee ${reduced ? 'is-paused' : ''}`} role="img" aria-label={lang === 'zh' ? '形态、空间、识别、体验' : words.join(', ')}><div aria-hidden="true">{[0, 1].map(repeat => <span key={repeat}>{words.map(word => <span key={word}>{word}<i>✳</i></span>)}</span>)}</div></div></div>
}

export function StudioSelected({ works, lang, reduced, visit }: { works: WorkDoc[]; lang: Lang; reduced: boolean; visit: (slug: string) => void }) {
  const ids = ['lighting', 'huhu-care', 'lensflow']
  return <section className="studio-selected" aria-labelledby="selected-title">
    <div className="studio-section-heading"><div><span className="studio-eyebrow">02 / SELECTED PERSPECTIVES</span><h2 id="selected-title">{lang === 'zh' ? <>同一种好奇，<br /><em>不同的尺度。</em></> : <>One curiosity.<br /><em>Different scales.</em></>}</h2></div><p>{lang === 'zh' ? '用三个切面进入作品：看一个系列如何形成，一件产品如何照顾使用者，一段流程如何保留人的判断。' : 'Three ways into the work: how a family of objects takes shape, how a product responds to people, and how a workflow keeps human judgment in the loop.'}</p></div>
    <div className="selected-panels">{ids.map((id, index) => {
      const work = works.find(item => item.slug === id)!
      return <motion.article key={id} className={`selected-panel selected-panel-${index}`} initial={reduced ? false : { y: 45 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>
        <CaseLink className="selected-image" slug={id} visit={visit} focusKey={`selected:${id}`}><img src={asset(`/thumbnails/${id}.webp`)} alt={work.title} loading="lazy"/><span className="selected-no" aria-hidden="true">0{index + 1}</span><span className="round-arrow"><ArrowUpRight size={26}/></span></CaseLink>
        <div className="selected-copy"><span className="studio-eyebrow">{['FORM & LIGHT', 'PEOPLE & OBJECTS', 'TOOLS & JUDGMENT'][index]}</span><h3>{work.title}</h3><p>{work.summary}</p><div className="selected-context">{lang === 'zh' ? '本人职责' : 'My role'} · {work.role}<br/>{lang === 'zh' ? '项目阶段' : 'Stage'} · {work.status}</div><CaseLink slug={id} visit={visit} focusKey={`selected:text:${id}`} className="studio-text-link">{lang === 'zh' ? '阅读设计判断 · 体验交互' : 'Read the decisions · Try the interaction'}<ArrowUpRight size={17}/></CaseLink></div>
      </motion.article>
    })}</div>
  </section>
}
