import { SITE_HOST, SITE_ROOT, sitePath } from './sitePaths'
import { localePath, languageAlternates } from './locale'
import profile from './profile.json'
import { getProject, isLabProject, isResearchProject, isToolProject, type ProjectEntry } from './projectRegistry'
import type { DesignOSRoute } from './routeResolver'
import type { Lang } from './workDocs'

export type PageType = 'WebPage' | 'CollectionPage' | 'CreativeWork'
export interface PageMetadata {
  title: string
  description: string
  canonical: string
  image?: string
  noindex: boolean
  type: PageType
  alternates?: Record<string, string>
}

export const SITE_ORIGIN = SITE_ROOT
export const DEFAULT_IMAGE = `${SITE_ORIGIN}/media/v5/hero-poster.webp`
const DEFAULT_TITLE = { zh: '孙英杰 | 工业与产品设计师', en: 'Yingjie Sun | Industrial & Product Designer' }
const DEFAULT_DESCRIPTION = profile.summary

const pageCopy: Record<string, { title: { zh: string; en: string }; description: { zh: string; en: string }; type: PageType; noindex?: boolean }> = {
  '/systems/ai-video-methods': { title: { zh: 'AI 视频研究方法库 | 孙英杰', en: 'AI video methods | Yingjie Sun' }, description: { zh: '六个控制层与八项方法拆解：从分镜、角色、材料与运镜研究，到个人 Blender 和 AI 视频实践。', en: 'Six control layers and eight method studies connecting storyboard, identity, material and camera research to a personal Blender and AI-video workflow.' }, type: 'CollectionPage' },
  '/': { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, type: 'WebPage' },
  '/systems': { title: { zh: '系统与工作流 | 孙英杰', en: 'Systems & workflows | Yingjie Sun' }, description: { zh: '用于创作、比较和审阅的设计工具与 AI 工作流。', en: 'Design tools and AI workflows for creation, comparison and review.' }, type: 'CollectionPage' },
  '/work': { title: { zh: '作品档案 | 孙英杰 Design OS', en: 'Work archive | Yingjie Sun Design OS' }, description: { zh: '从商业品牌、空间展示到实体与数字产品，阅读孙英杰的设计项目与职责边界。', en: 'Commercial brand, spatial, physical and digital projects by Yingjie Sun, with responsibilities and evidence boundaries.' }, type: 'CollectionPage' },
  '/lab': { title: { zh: '实验与方法 | 孙英杰 Design OS', en: 'Lab & methods | Yingjie Sun Design OS' }, description: { zh: '记录实验、评估与仍在形成中的设计方法。', en: 'Experiments, evaluations and design methods still in formation.' }, type: 'CollectionPage' },
  '/tools': { title: { zh: '工具与原型 | 孙英杰 Design OS', en: 'Tools & prototypes | Yingjie Sun Design OS' }, description: { zh: '可操作的数字工具与产品原型，展示输入、判断与反馈。', en: 'Operable digital tools and product prototypes for input, judgment and feedback.' }, type: 'CollectionPage' },
  '/research': { title: { zh: '研究档案 | 孙英杰 Design OS', en: 'Research archive | Yingjie Sun Design OS' }, description: { zh: '记录研究问题、来源与方法边界，让观察和试验保持可追溯。', en: 'Research questions, sources and method boundaries kept traceable.' }, type: 'CollectionPage' },
  '/about': { title: { zh: '关于孙英杰 | 工业与产品设计师', en: 'About Yingjie Sun | Industrial & Product Designer' }, description: { zh: '了解孙英杰如何以研究、3D、CMF、品牌与 AI 工作流推进工业与产品设计。', en: 'How Yingjie Sun approaches industrial and product design through research, 3D, CMF, brand and AI workflows.' }, type: 'WebPage' },
  '/resume': { title: { zh: '简历与精选作品集 | 孙英杰', en: 'Résumé & selected portfolio | Yingjie Sun' }, description: { zh: '孙英杰的职业经历、设计能力与精选作品集下载。', en: 'Yingjie Sun’s experience, capabilities and selected portfolio downloads.' }, type: 'WebPage' },
  '/contact': { title: { zh: '联系孙英杰 | Yingjie Sun', en: 'Contact Yingjie Sun' }, description: { zh: '联系孙英杰，讨论品牌、产品设计与数字体验项目。', en: 'Contact Yingjie Sun about brand, product design and digital experience work.' }, type: 'WebPage' },
  '/404': { title: { zh: '404 / 页面未收录 | 孙英杰', en: '404 / Object not found | Yingjie Sun' }, description: { zh: '没有找到这个公开页面。', en: 'This public page could not be found.' }, type: 'WebPage', noindex: true },
}

export function routeProject(route: DesignOSRoute | null): ProjectEntry | null {
  if (!route?.slug) return null
  const project = getProject(route.slug)
  if (!project) return null
  if (route.name === 'work-detail') return project
  if (route.name === 'lab-detail') return isLabProject(project) ? project : null
  if (route.name === 'tools-detail') return isToolProject(project) ? project : null
  if (route.name === 'research-detail') return isResearchProject(project) ? project : null
  return null
}

export function getPageMetadata(route: DesignOSRoute | null, lang: Lang): PageMetadata {
  const pathname = route?.pathname ?? '/'
  const project = routeProject(route)
  const invalidDetail = Boolean(route?.name.endsWith('-detail') && !project)
  if (route?.name === '404' || invalidDetail) {
    const item = pageCopy['/404']
    return { title: item.title[lang], description: item.description[lang], canonical: `${SITE_HOST}${localePath(pathname, lang)}`, noindex: true, type: 'WebPage' }
  }
  if (project && route) return {
    title: project.seo.title[lang],
    description: project.seo.description[lang],
    // Readable aliases resolve to the same record but should point search
    // engines at the stable slug as their canonical URL.
    canonical: `${SITE_HOST}${localePath(`/work/${project.slug}`, lang)}`,
    image: new URL(sitePath(project.seo.ogImage || project.cover), `${SITE_HOST}/`).toString(),
    noindex: project.seo.noindex || project.availability !== 'public' || project.visibility !== 'public',
    type: 'CreativeWork', alternates: languageAlternates(`/work/${project.slug}`, SITE_HOST),
  }
  const item = pageCopy[pathname] ?? pageCopy['/404']
  return {
    title: item.title[lang], description: item.description[lang], canonical: `${SITE_HOST}${localePath(pathname, lang)}`,
    image: pathname === '/' ? DEFAULT_IMAGE : pathname === '/systems/ai-video-methods' ? `${SITE_ORIGIN}/works/ai-video-systems/ai-video-systems-cover.webp` : undefined, noindex: Boolean(item.noindex), type: item.type, alternates: languageAlternates(pathname, SITE_HOST),
  }
}


export function getStructuredData(metadata: PageMetadata, lang: Lang): Record<string, unknown> {
  const page: Record<string, unknown> = {
    '@type': metadata.type, '@id': `${metadata.canonical}#page`, url: metadata.canonical,
    name: metadata.title, description: metadata.description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` }, about: { '@id': `${SITE_ORIGIN}/#person` },
  }
  if (metadata.image) page.image = metadata.image
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: 'Yingjie Sun Design OS', url: SITE_ORIGIN, inLanguage: lang === 'zh' ? 'zh-CN' : 'en' },
    { '@type': 'Person', '@id': `${SITE_ORIGIN}/#person`, name: '孙英杰 / Yingjie Sun', url: SITE_ORIGIN, jobTitle: profile.position[lang] },
    page,
  ] }
}
