import { useState } from 'react'
import { ArrowUpRight, Copy } from 'lucide-react'
import type { Lang } from '../data/workDocs'
import { localePath } from '../data/locale'
import { SITE_HOST } from '../data/sitePaths'
import { QUICK_STUDIO as studio } from '../data/quickStudio'
import './quick-studio.css'

export function QuickStudioEntry({ lang }: { lang: Lang }) {
  return <section className="quick-studio-entry" aria-label="Quick Studio">
    <div><span>{lang === 'zh' ? '可在线使用的工作流' : 'An online workflow'}</span><h2>{studio.title[lang]}</h2><p>{studio.summary[lang]}</p></div>
    <div className="quick-studio-actions"><a className="quick-studio-primary" href={localePath(studio.path, lang)}>{lang === 'zh' ? '了解并使用工作台' : 'Explore the workbench'}<ArrowUpRight size={17}/></a><a href={studio.url} target="_blank" rel="noreferrer">{lang === 'zh' ? '直接打开工作台' : 'Open the workbench'}<ArrowUpRight size={16}/></a></div>
  </section>
}

export function QuickStudio({ lang }: { lang: Lang }) {
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle')
  const shareUrl = SITE_HOST + localePath(studio.path, lang)
  async function share() {
    try { await navigator.clipboard.writeText(shareUrl); setCopyState('done') }
    catch { setCopyState('error') }
  }
  const zh = lang === 'zh'
  return <article className="design-os-frame quick-studio-page">
    <header className="quick-studio-hero">
      <div><p className="quick-studio-status">{zh ? '在线工作台 · 无需注册 · 自带 API' : 'Online workbench · No sign-up · Bring your API'}</p><h1>Quick Studio</h1><h2>{zh ? '从衣服实拍，\n到模特上身与交付。' : 'From garment references\nto on-model delivery.'}</h2><p>{studio.summary[lang]}</p>
        <div className="quick-studio-actions"><a className="quick-studio-primary" href={studio.url} target="_blank" rel="noreferrer">{zh ? '打开工作台' : 'Open the workbench'}<ArrowUpRight size={18}/></a><a href={studio.guide} target="_blank" rel="noreferrer">{zh ? '使用与接口说明' : 'Usage & API guide'}<ArrowUpRight size={16}/></a></div>
        <small>{zh ? '在新标签页打开。工作台目前为中文界面。' : 'Opens in a new tab. The workbench interface is currently in Chinese.'}</small>
      </div>
      <div className="quick-studio-flow" aria-label={zh ? '工作流结构' : 'Workflow structure'}>
        <div className="quick-studio-inputs"><span>{zh ? '商品正面' : 'Garment front'}</span><span>{zh ? '商品背面' : 'Garment back'}</span></div>
        <p>{zh ? '参考素材锁定' : 'Reference constraints'} ↓</p>
        <strong>{zh ? '模特上身效果' : 'On-model imagery'}</strong>
        <p>{zh ? '人工审核与定稿' : 'Human review & approval'} ↓</p>
        <div className="quick-studio-delivery"><b>{zh ? '图片交付包' : 'Image delivery ZIP'}</b><span>{zh ? '可选：详情长图' : 'Optional: stitched detail image'}</span></div>
        <div className="quick-studio-optional">{zh ? '需要视频？定稿后继续分镜与视频制作。' : 'Need video? Continue with storyboards after image approval.'}</div>
      </div>
    </header>
    <section className="quick-studio-section"><h2>{zh ? '一个 SKU，一条清楚的制作流程。' : 'One SKU. A clear production process.'}</h2><ol className="quick-studio-steps">{studio.steps.map((step, index) => <li key={index}><span>0{index + 1}</span><h3>{step[lang][0]}</h3><p>{step[lang][1]}</p></li>)}</ol></section>
    <section className="quick-studio-section quick-studio-details"><div><h2>{zh ? '第一次使用' : 'Your first session'}</h2><p>{zh ? '准备有权使用的服装正背面照片。进入工作台后选「先试一张」，填写支持图片编辑的服务和模型，点击「启用 API 并生成 1 张」。' : 'Prepare front and back garment photos you have permission to use. Choose the one-image proof, configure a reference-editing model, then submit one image.'}</p><p>{zh ? '只想了解操作，可进入独立模拟工作区。模拟不调用模型，返回的是参考图副本，不是生成效果。' : 'Use the separate simulation workspace to learn the flow without model calls. Simulation returns reference copies, not generated imagery.'}</p></div><div><h2>{zh ? '使用前了解' : 'Before you start'}</h2><ul><li>{zh ? '每位使用者填写自己的 API Key，费用由对应服务商收取。' : 'Each user supplies their own API key. Provider charges apply.'}</li><li>{zh ? 'Key 只在当前页面会话中使用，刷新后需重新填写。素材与 Key 会经工作台代理发送至你确认的服务商。' : 'Keys stay in the current page session and must be re-entered after refresh. Selected assets and keys pass through the workbench proxy to your confirmed provider.'}</li><li>{zh ? '草稿保存在当前浏览器，不会随分享链接同步；交付文件需另行下载和发送。' : 'Drafts stay in your browser and are not included in shared links. Download and share delivery files separately.'}</li><li>{zh ? '已验证工作流与接口适配；尚未以有效 Key 完成付费出图验收，不承诺所有模型兼容或商品完全还原。' : 'Workflow and adapter tests have passed. Paid generation acceptance with a valid key is still pending; model compatibility and perfect garment fidelity are not guaranteed.'}</li></ul></div></section>
    <section className="quick-studio-share"><div><h2>{zh ? '把工作流分享给下一位使用者。' : 'Share the workflow with the next maker.'}</h2><p>{zh ? '公开链接只打开工具说明，每个人使用自己的素材、草稿和服务配置。' : 'The public link opens this guide. Each person uses their own assets, drafts and service settings.'}</p></div><button type="button" onClick={share}><Copy size={17}/>{zh ? '复制分享链接' : 'Copy share link'}</button><p role="status">{copyState === 'done' ? (zh ? '已复制公开链接' : 'Public link copied') : copyState === 'error' ? (zh ? '请手动复制下方链接' : 'Copy the link below manually') : ''}</p><a className="quick-studio-share-url" href={shareUrl}>{shareUrl}</a></section>
    <a className="design-os-text-link" href={localePath('/tools', lang)}>{zh ? '浏览其他工具' : 'Explore other tools'}<ArrowUpRight size={16}/></a>
  </article>
}
