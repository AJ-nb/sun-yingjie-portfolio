import { ArrowUpRight, FlaskConical } from 'lucide-react'
import type { Lang } from '../data/workDocs'
import './atlas-research-entry.css'

/**
 * ATLAS is presented as a research record only. Keeping this entry as a
 * content component prevents the standalone prototype runtime from becoming
 * part of the published homepage bundle.
 */
export function AtlasResearchEntry({ lang }: { lang: Lang }) {
  const zh = lang === 'zh'
  return <article className="atlas-research-entry" data-layer="second" data-provenance="research-prototype">
    <div className="atlas-research-mark" aria-hidden="true"><FlaskConical size={20}/><span>SIMULATION</span></div>
    <div className="atlas-research-copy">
      <p className="atlas-research-eyebrow">{zh ? '研究与实验 / AI 设计工作流' : 'Research & experiments / AI design workflow'}</p>
      <h3>ATLAS//AI <span>{zh ? '项目叙事与状态研究' : 'project narrative & state research'}</span></h3>
      <p>{zh ? 'Phase 3 prototype：把项目、旅程、机会点、任务、交付物与状态串成一条可回看的设计轨迹。' : 'Phase 3 prototype: a trace connecting projects, journeys, opportunities, tasks, artifacts and project state.'}</p>
      <p className="atlas-research-boundary">{zh ? <><span className="sr-only">ATLAS run not recorded. </span>ATLAS 运行记录未公开；本条目是研究原型，未连接生产环境，也不代表已验证的自动化服务。</> : 'ATLAS run not recorded; this is a research prototype, not connected to production, and does not represent a validated automation service.'}</p>
    </div>
    <a className="atlas-research-link" href="/lab">{zh ? '查看实验档案' : 'Open the lab archive'}<ArrowUpRight size={16} aria-hidden="true"/></a>
  </article>
}
