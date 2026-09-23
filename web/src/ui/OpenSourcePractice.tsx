import { ArrowUpRight, Plus } from 'lucide-react'
import story from '../data/portfolioV6.json'
import { asset, type Lang, type WorkDoc } from '../data/workDocs'
import { CaseLink } from './Studio'
import { AtlasResearchEntry } from './AtlasResearchEntry'

type Props = { works: WorkDoc[]; lang: Lang; visit: (slug: string) => void }
const value = (text: { zh: string; en: string }, lang: Lang) => text[lang]

export function OpenSourcePractice({ works, lang, visit }: Props) {
  return <section id="open-source" className="v6-open-source" aria-labelledby="open-source-title" data-motion-anchor>
    <header className="v7-heading">
      <div><span>{lang === 'zh' ? '产品设计 / 信息架构 / 交互流程' : 'Product design / Information / Interaction'}</span><h2 id="open-source-title">{lang === 'zh' ? '数字产品与体验' : 'Digital products & experiences'}</h2></div>
      <p>{lang === 'zh' ? '让品牌识别进入界面，让复杂任务成为清楚的操作路径。以信息层级、状态反馈和迭代建立完整体验。' : 'Carry brand identity into interfaces and give complex tasks clear paths. Build coherent experiences through information hierarchy, feedback and iteration.'}</p>
    </header>
    <div className="v7-digital-more">{['biyuan', 'lensflow', 'formline'].map(slug => { const work = works.find(item => item.slug === slug); return work ? <CaseLink key={slug} slug={slug} visit={visit} focusKey={`digital:more:${slug}`}><img src={asset(work.cover)} alt="" loading="lazy"/><div><h3>{work.title}</h3><p>{work.summary}</p></div><ArrowUpRight size={20}/></CaseLink> : null })}</div>
    <div className="digital-practice-heading"><h3>{lang === 'zh' ? '从交互方案到可运行工具' : 'From interaction design to working tools'}</h3><p>{lang === 'zh' ? '结合开源基础，验证任务流程、状态恢复与实际操作。' : 'Use open-source foundations to validate flows, recovery states and real interactions.'}</p></div>
    <div className="v6-open-source-grid">
      {story.openSource.map(project => {
        const work = works.find(item => item.slug === project.slug)
        if (!work) return null
        return <article key={project.slug} className="v6-open-source-card" data-open-source={project.slug}>
          <CaseLink slug={project.slug} visit={visit} focusKey={`digital:preview:${project.slug}`} className="v7-digital-image"><img src={asset(work.cover)} alt={work.title} loading="lazy"/></CaseLink>
          <h3><CaseLink slug={project.slug} visit={visit} focusKey={`open-source:${project.slug}`}>{work.title}<ArrowUpRight size={18}/></CaseLink></h3>
          <p className="v6-open-source-summary">{work.summary}</p>
          <dl className="digital-contribution">
            <div><dt>{lang === 'zh' ? '设计与实现增量' : 'Added design & implementation'}</dt><dd>{value(project.contribution, lang)}</dd></div>
          </dl>
          <details className="digital-source-details"><summary>{lang === 'zh' ? '实现说明与开源来源' : 'Implementation & open-source credits'}<Plus size={16} aria-hidden="true"/></summary><dl>
            <div><dt>{lang === 'zh' ? '上游' : 'Upstream'}</dt><dd><a href={project.upstreamUrl} target="_blank" rel="noreferrer">{project.upstream}<ArrowUpRight size={13}/></a></dd></div>
            <div><dt>{lang === 'zh' ? '许可证' : 'License'}</dt><dd>{project.license}</dd></div>
            <div><dt>{lang === 'zh' ? '保留能力' : 'Retained functionality'}</dt><dd>{value(project.retained, lang)}</dd></div>
            <div><dt>{lang === 'zh' ? '实现结果' : 'Implementation result'}</dt><dd>{value(project.result, lang)}</dd></div>
          </dl><p className="v6-open-source-boundary">{value(project.boundary, lang)}</p></details>
        </article>
      })}
    </div>
    <AtlasResearchEntry lang={lang}/>
  </section>
}
