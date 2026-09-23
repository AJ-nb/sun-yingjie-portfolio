import { ArrowUpRight, Check, Circle } from 'lucide-react'
import type { MouseEvent } from 'react'
import { getWorkDoc, type Lang } from '../data/workDocs'
import {
  capabilityEvidenceLabel,
  capabilityLevelLabel,
  capabilityTerritories,
  aiDesignWorkflow,
  type CapabilityItem,
} from '../data/capabilities'
import { globalResearchBoundary, researchPipeline } from '../data/globalResearch'

type Props = {
  lang: Lang
  visit: (slug: string) => void
}

function EvidenceLinks({ item, lang, visit }: { item: CapabilityItem; lang: Lang; visit: Props['visit'] }) {
  if (!item.evidence.length) return <span className="capability-matrix-method">{capabilityEvidenceLabel(item, lang)}</span>
  return <div className="capability-matrix-evidence" aria-label={lang === 'zh' ? '对应案例' : 'Related cases'}>
    {item.evidence.map(slug => {
      const work = getWorkDoc(slug, lang)
      const timelineLabel = lang === 'zh'
        ? { hannstar: '瀚宇博德', ouyin: '欧音' }[slug as 'hannstar' | 'ouyin']
        : { hannstar: 'HannStar Board', ouyin: 'Ouyin' }[slug as 'hannstar' | 'ouyin']
      if (!work) return <span className="capability-matrix-reference" key={slug}>{timelineLabel ?? slug}</span>
      return <a
          key={slug}
          href={`#/work/${encodeURIComponent(slug)}`}
          data-return-focus={`capability-matrix:${item.id}:${slug}`}
          onClick={(event: MouseEvent<HTMLAnchorElement>) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            event.preventDefault()
            visit(slug)
          }}
        >{work.title}<ArrowUpRight size={13} aria-hidden="true" /></a>
    })}
  </div>
}

export function CapabilityMatrix({ lang, visit }: Props) {
  const isZh = lang === 'zh'
  return <section id="capability-system" className="capability-matrix" aria-labelledby="capability-matrix-title" tabIndex={-1} data-motion-anchor>
    <header className="capability-matrix-heading">
      <div>
        <span className="studio-eyebrow">{isZh ? '证据边界 / 方法能力 / 设计交付' : 'Evidence boundaries / Methods / Delivery'}</span>
        <h2 id="capability-matrix-title">{isZh ? '能力证据矩阵' : 'Capability evidence matrix'}</h2>
      </div>
      <p>{isZh
        ? '将品牌、产品、数字与 AI 工作流放在同一张地图中。每项能力都标明案例证据，或明确仍以方法能力保留。'
        : 'A single map for brand, product, digital and AI-supported work. Each capability shows its case evidence or stays explicitly bounded as a method.'}</p>
    </header>

    <div className="capability-matrix-grid">
      {capabilityTerritories.map((territory, territoryIndex) => <article className="capability-territory" key={territory.id}>
        <header>
          <span className="capability-territory-index">{String(territoryIndex + 1).padStart(2, '0')}</span>
          <div>
            <h3>{territory.title[lang]}</h3>
            <p>{territory.summary[lang]}</p>
          </div>
        </header>
        <ul>
          {territory.items.map(item => <li key={item.id} className={`capability-item capability-item--${item.level}`}>
            <div className="capability-item-head">
              <h4>{item.label[lang]}</h4>
              <span className="capability-level">{capabilityLevelLabel(item.level, lang)}</span>
            </div>
            <div className="capability-item-meta">
              <span className="capability-evidence-count">{capabilityEvidenceLabel(item, lang)}</span>
              {item.evidence.length ? <Check size={13} aria-hidden="true" /> : <Circle size={11} aria-hidden="true" />}
            </div>
            <EvidenceLinks item={item} lang={lang} visit={visit} />
            {item.note && <p className="capability-item-note">{item.note[lang]}</p>}
          </li>)}
        </ul>
      </article>)}
    </div>

    <div className="capability-matrix-practice">
      <article className="capability-practice-card capability-practice-card--ai">
        <header>
          <span className="studio-eyebrow">{isZh ? 'AI 设计技术 / 人类主导' : 'AI design technology / human-led'}</span>
          <h3>{isZh ? 'AI 工作流' : 'AI workflow'}</h3>
          <p>{isZh ? 'AI 负责扩大探索与比较，人负责问题定义、方向选择、编辑和最终批准。' : 'AI expands exploration and comparison; the designer owns framing, direction, editing and final approval.'}</p>
        </header>
        <ol className="capability-workflow" aria-label={isZh ? 'AI 工作流步骤' : 'AI workflow steps'}>
          {aiDesignWorkflow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{lang === 'zh' ? ['输入', '研究', '方向', '生成', '比较', '修整', '验证', '交付'][index] : step}</li>)}
        </ol>
        <dl className="capability-role-boundary">
          <div><dt>{isZh ? 'AI 角色' : 'AI role'}</dt><dd>{isZh ? '参考分析、生成、批量比较与局部修整。' : 'Reference analysis, generation, batch comparison and local edits.'}</dd></div>
          <div><dt>{isZh ? '人的角色' : 'Human role'}</dt><dd>{isZh ? '建立标准、筛选结果、处理来源并决定交付。' : 'Set criteria, select results, track provenance and decide delivery.'}</dd></div>
        </dl>
      </article>
      <article className="capability-practice-card capability-practice-card--research">
        <header>
          <span className="studio-eyebrow">{isZh ? '研究方法 / 尚无独立全球案例' : 'Research method / no standalone global case yet'}</span>
          <h3>{isZh ? '全球市场研究' : 'Global market research'}</h3>
          <p>{isZh ? '把竞品、消费者、趋势与文化观察转成可追溯的设计问题与方向。' : 'Translate competitor, consumer, trend and cultural observations into traceable design questions and directions.'}</p>
        </header>
        <ul className="capability-research-steps">
          {researchPipeline.slice(0, 4).map((step, index) => <li key={step.id}><span>{String(index + 1).padStart(2, '0')}</span>{step.label[lang]}</li>)}
        </ul>
        <p className="capability-boundary">{globalResearchBoundary[lang]}</p>
      </article>
    </div>
  </section>
}
