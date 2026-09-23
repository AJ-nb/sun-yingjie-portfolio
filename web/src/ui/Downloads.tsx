import { ArrowUpRight, Download } from 'lucide-react'
import manifest from '../data/downloads.json'
import { asset, type Lang } from '../data/workDocs'

export type DownloadVariant = 'overview' | 'brand' | 'physical' | 'digital'
type DownloadItem = { id: string; variant: string; type: string; format: string; label: string | { zh: string; en: string }; path: string; bytes: number; sha256: string; pages?: number | null }
const revisionUrl = (path: string, sha256: string) => `${asset(path)}?v=${sha256.slice(0, 12)}`
export function Downloads({ lang, variant, setVariant }: { lang: Lang; variant: DownloadVariant; setVariant: (variant: DownloadVariant) => void }) {
  const labels: Record<DownloadVariant, [string, string]> = { overview: ['综合版本', 'Overview'], brand: ['品牌设计', 'Brand design'], physical: ['产品设计 · 实体', 'Products · Physical'], digital: ['产品设计 · 数字', 'Products · Digital'] }
  const items = (manifest.items as DownloadItem[]).filter(item => item.variant === variant)
  const resume = items.find(item => item.type === 'resume' && item.format === 'pdf')
  const primary = items.filter(item => item.format === 'pdf' && item.id !== 'full')
  const secondary = items.filter(item => item.format !== 'pdf' || item.id === 'full')
  const descriptions: Record<DownloadVariant, [string, string]> = {
    overview: ['品牌、产品与项目统筹的完整概览。适合首次了解我的工作。', 'An overview of brand, product and design coordination. Start here for the full picture.'],
    brand: ['聚焦 Hermès、Arc’teryx、Periastra 与夜礼司，呈现品牌系统与设计落地。', 'Hermès, Arc’teryx, Periastra and Yelisi: identity systems, direction and delivery.'],
    physical: ['聚焦使用场景、产品形态、系列关系与 CMF，呈现实物设计的判断过程。', 'Use scenarios, form, product families and CMF, with the decisions behind each design.'],
    digital: ['聚焦 VI/UI、信息架构、交互流程与迭代，呈现数字产品的完整体验。', 'VI/UI, information architecture, interaction flows and iteration across digital experiences.'],
  }
  const preview = `/media/v7/resume-preview${variant === 'overview' ? '' : `-${variant}`}.webp`
  const size = (bytes: number) => bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`
  const fileLink = (file: DownloadItem) => <a className="download-link" href={revisionUrl(file.path, file.sha256)} key={file.id} download data-download={file.id === 'selected' ? 'selected' : file.id}><span>{file.format === 'docx' ? (lang === 'zh' ? '可编辑简历（Word）' : 'Editable résumé (Word)') : typeof file.label === 'string' ? file.label : file.label[lang]}<small>{file.format.toUpperCase()}{file.pages ? ` / ${file.pages} ${lang === 'zh' ? '页' : 'pages'}` : ''}{file.bytes > 0 ? ` / ${size(file.bytes)}` : ''}</small></span><Download size={20} aria-hidden="true"/></a>
  return <section id="downloads" className="v7-downloads" tabIndex={-1} aria-labelledby="downloads-title" data-motion-anchor>
    <header className="v7-heading"><div><span>{lang === 'zh' ? '在线浏览 / 离线阅读' : 'Online preview / Offline reading'}</span><h2 id="downloads-title">{lang === 'zh' ? '简历与作品集' : 'Résumé & portfolio'}</h2></div><p>{lang === 'zh' ? '一页简历概览职责与经历，精选作品集展开设计过程。选择与你关注的方向对应的版本。' : 'A one-page résumé for experience and responsibilities; a selected portfolio for the design process. Choose the edition relevant to your interests.'}</p></header>
    <div className="download-variants" role="group" aria-label={lang === 'zh' ? '投递方向' : 'Portfolio focus'}>{(Object.keys(labels) as DownloadVariant[]).map(key => <button type="button" key={key} aria-pressed={variant === key} onClick={() => setVariant(key)}>{labels[key][lang === 'zh' ? 0 : 1]}</button>)}</div>
    <div className="download-edition">
      {resume && <a className="resume-preview" href={revisionUrl(resume.path, resume.sha256)} target="_blank" rel="noreferrer" aria-label={lang === 'zh' ? `预览${labels[variant][0]}简历 PDF，新窗口打开` : `Preview the ${labels[variant][1]} résumé PDF in a new tab`}><img src={revisionUrl(preview, resume.sha256)} width="640" height="905" loading="lazy" alt={lang === 'zh' ? `${labels[variant][0]}简历首页` : `${labels[variant][1]} résumé first page`}/><span>{lang === 'zh' ? '打开简历预览' : 'Preview résumé'}<ArrowUpRight size={16} aria-hidden="true"/></span></a>}
      <div className="download-edition-content"><div className="download-edition-intro" aria-live="polite"><h3>{labels[variant][lang === 'zh' ? 0 : 1]}</h3><p>{descriptions[variant][lang === 'zh' ? 0 : 1]}</p></div><div className="v7-download-list" aria-live="polite"><div className="download-primary">{primary.map(fileLink)}</div><div className="download-secondary">{secondary.map(fileLink)}</div></div></div>
    </div>
    <p className="v7-updated">{lang === 'zh' ? '更新于' : 'Updated'} {manifest.updatedAt.slice(0, 10)}</p>
  </section>
}
