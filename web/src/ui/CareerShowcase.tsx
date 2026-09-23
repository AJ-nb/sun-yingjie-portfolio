import { ArrowUpRight } from 'lucide-react'
import type { MouseEvent } from 'react'
import story from '../data/portfolioV6.json'
import { asset, type Lang, type WorkDoc } from '../data/workDocs'
import { CaseLink } from './Studio'
import { BRAND_CASES } from './portfolioTaxonomy'

type Props = { works: WorkDoc[]; lang: Lang; visit: (slug: string) => void }

export function CareerShowcase({ works, lang, visit }: Props) {
  const groups = [
    { id: 'brand-space', slugs: BRAND_CASES.slice(0, 2), title: lang === 'zh' ? '品牌空间与商业展示' : 'Brand spaces and commercial presentation', statement: lang === 'zh' ? '在 BENWU 团队中参与 Hermès 与 Arc’teryx 橱窗的三维设计与视觉呈现。以商品展示为核心，组织道具尺度、材质与观看层次。' : '3D design and visual contribution to Hermès and Arc’teryx windows within the BENWU team. The work organizes prop scale, materials and visual hierarchy around merchandise.' },
    { id: 'brand-identity', slugs: BRAND_CASES.slice(2), title: lang === 'zh' ? '品牌识别与设计方向' : 'Brand identity and design direction', statement: lang === 'zh' ? '参与 Periastra 品牌图形与应用研究，以及夜礼司品牌视觉与产品概念共同创作。将识别规则、界面与产品方向组织为连贯的设计系统，个人主导范围和团队规模按证据边界说明。' : 'Contributed to Periastra brand-graphic and application research and to Yelisi brand-visual and product-concept collaboration. Connect identity rules, interfaces and product direction while keeping individual scope and team size within the evidence boundary.' },
  ]
  return <section id="selected" className="v6-representatives v7-selected" aria-labelledby="representative-title" tabIndex={-1} data-motion-anchor>
    <header className="v7-heading"><div><span>{lang === 'zh' ? '商业空间 / 品牌识别 / VI/UI' : 'Commercial spaces / Identity / VI/UI'}</span><h2 id="representative-title">{lang === 'zh' ? '品牌设计' : 'Brand design'}</h2></div><p>{lang === 'zh' ? '从品牌方向到具体触点。四个项目呈现设计参与、团队协作与当前公开边界。' : 'From brand direction to individual touchpoints. Four projects show design participation, team collaboration and the current public boundary.'}</p></header>
    <div className="v7-representative-list">{groups.map(group => {
      const projects = group.slugs.flatMap(slug => { const work = works.find(item => item.slug === slug); return work ? [work] : [] })
      return <article key={group.id} className={`v7-representative representative-${group.id}`} data-representative={group.id}>
        <div className="v7-representative-media">{projects.map((work, index) => <CaseLink key={work.slug} slug={work.slug} visit={visit} focusKey={`representative:${group.id}:${work.slug}`} className="v7-project-image"><img src={asset(work.cover)} alt="" loading={group === groups[0] && index === 0 ? 'eager' : 'lazy'} decoding="async"/><span>{work.title}<ArrowUpRight size={20} aria-hidden="true"/></span></CaseLink>)}</div>
        <div className="v7-representative-copy"><div><h3>{group.title}</h3></div><div><p>{group.statement}</p><dl>{projects.map(work => <div key={work.slug}><dt>{work.title}</dt><dd>{work.role}</dd></div>)}</dl></div></div>
      </article>
    })}</div>
  </section>
}

export function ProductEvidence({ works, lang, visit, anchor }: Props & { anchor: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const slugs = ['lighting', 'huhu-care', 'go-glow', 'plumber']
  const captions: Record<string, [string, string]> = {
    lighting: ['以共同截面组织灯具系列', 'A lighting family built around a shared profile'],
    'huhu-care': ['围绕儿童操作组织形态与反馈', 'Form and feedback shaped around children’s actions'],
    'go-glow': ['用模块组合回应旅行收纳与使用', 'Modular combinations for travel, storage and use'],
    plumber: ['连接设备、作业者与服务流程', 'Connect equipment, operators and service'],
  }
  return <section id="products" className="v7-products" aria-labelledby="products-title" tabIndex={-1} data-motion-anchor>
    <header className="v7-heading"><div><span>{lang === 'zh' ? '使用场景 / 形态结构 / CMF' : 'Use scenarios / Form & structure / CMF'}</span><h2 id="products-title">{lang === 'zh' ? '产品设计' : 'Product design'}</h2></div><p>{lang === 'zh' ? '以使用需求定义产品，以形态、部件和材料回应约束。案例展示方案取舍、系列关系与当前成果阶段。' : 'Define products through use, then address constraints through form, components and materials. Explore design choices, product families and the stage each project has reached.'}</p></header>
    <nav className="product-subpaths" aria-label={lang === 'zh' ? '产品设计阅读方向' : 'Product design paths'}><a href="#physical-products" onClick={anchor}>{lang === 'zh' ? '实体产品' : 'Physical products'}</a><a href="#open-source" onClick={anchor}>{lang === 'zh' ? '数字产品与体验' : 'Digital products & experiences'}</a></nav>
    <div id="physical-products" className="v7-product-grid">{slugs.flatMap(slug => { const work = works.find(item => item.slug === slug); return work ? [work] : [] }).map(work => <article key={work.slug}>
      <CaseLink className="v7-product-image" slug={work.slug} visit={visit} focusKey={`modeling:${work.slug}`} ariaLabel={work.title}><img src={asset(work.cover)} alt="" loading="lazy" decoding="async"/><ArrowUpRight aria-hidden="true" size={24}/></CaseLink>
      <span>{work.status}</span><h3><CaseLink slug={work.slug} visit={visit} focusKey={`product:text:${work.slug}`}>{work.title}</CaseLink></h3><p>{captions[work.slug][lang === 'zh' ? 0 : 1]}</p>
    </article>)}</div>
  </section>
}

export function CareerTimeline({ lang }: Pick<Props, 'lang'>) {
  return <div id="career" className="v7-career-summary" tabIndex={-1}>
    <h3>{lang === 'zh' ? '工作与设计经历' : 'Experience & practice'}</h3>
    {story.careerChapters.map(chapter => <article key={chapter.id} data-career-chapter={chapter.id}><span>{chapter.period}</span><div><h4>{chapter.title[lang]}</h4><p>{chapter.role[lang]}</p><p>{chapter.summary[lang]}</p></div></article>)}
  </div>
}
