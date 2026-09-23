import type { MouseEvent } from 'react'
import { ArrowDownRight } from 'lucide-react'
import type { Lang } from '../data/workDocs'

export function DisciplinePaths({ lang, anchor }: { lang: Lang; anchor: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const items = lang === 'zh'
    ? [{ href: '#selected', title: '品牌设计', body: '品牌识别、商业空间与设计统筹', proof: 'Hermès / Arc’teryx / Periastra / 夜礼司' }, { href: '#products', title: '产品设计', body: '实体产品、数字体验与系统设计', proof: '灯具 / HUHU CARE / GO GLOW / 彼源 / 数字工具' }, { href: '#capability-system', title: 'AI 设计与全球研究', body: '以人类判断为核心的 AI 工作流与市场研究方法', proof: '研究 → 方向 → 生成 → 比较 → 交付' }]
    : [{ href: '#selected', title: 'Brand design', body: 'Identity, commercial spaces and design direction', proof: 'Hermès / Arc’teryx / Periastra / Yelisi' }, { href: '#products', title: 'Product design', body: 'Physical products, digital experiences and systems', proof: 'Lighting / HUHU CARE / GO GLOW / Biyuan / Digital tools' }, { href: '#capability-system', title: 'AI design & global research', body: 'Human-led AI workflows and market-research methods', proof: 'Research → Direction → Generate → Compare → Deliver' }]
  return <nav id="introduction" className="discipline-paths" data-layer="second" aria-label={lang === 'zh' ? '首页第二层：按设计方向阅读' : 'Homepage second layer: explore by discipline'}>
    {items.map(item => <a key={item.href} href={item.href} onClick={anchor}><div><h2>{item.title}</h2><ArrowDownRight size={24} aria-hidden="true"/></div><p>{item.body}</p><small>{item.proof}</small></a>)}
  </nav>
}
