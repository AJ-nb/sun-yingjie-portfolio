import type { ChapterId } from './chapters'
import type { Lang, WorkDoc } from './workDocs'
import type { ProfileCapability } from './profile'

type BilingualReason = Record<Lang, string>
type CaseSummary = Pick<WorkDoc, 'slug' | 'chapter' | 'order'>
type CapabilitySummary = Pick<ProfileCapability, 'id' | 'title' | 'caseSlugs'>

export interface CaseRelation {
  slug: string
  reason: string
  basis: 'curated' | 'capability' | 'chapter'
}

// These pairs explain a specific editorial connection; their order sets priority.
export const CASE_CONNECTIONS: { slugs: [string, string]; reason: BilingualReason }[] = [
  { slugs: ['ai-video-systems', 'lensflow'], reason: { zh: '两者都把生成放进可回看的输入、判断、比较与人工复核流程。', en: 'Both place generation inside a reviewable sequence of inputs, judgment, comparison and human review.' } },
  { slugs: ['hermes', 'arcteryx'], reason: { zh: '同样通过道具、商品与空间层次，让品牌故事进入橱窗。', en: 'Both use props, merchandise and spatial layers to bring a brand story into a window.' } },
  { slugs: ['hermes', 'lighting'], reason: { zh: '从橱窗到灯具场景，继续比较物件尺度与周围空间的关系。', en: 'From windows to lighting scenes, compare the scale of an object with its surroundings.' } },
  { slugs: ['arcteryx', 'lighting'], reason: { zh: '从装备陈列到灯具场景，比较材料、光线与观看尺度如何共同组织空间。', en: 'From equipment displays to lighting scenes, compare how material, light and viewing scale organise space.' } },
  { slugs: ['lighting', 'rendering-studies'], reason: { zh: '继续观察材料如何被光线与镜头解释，以及单体如何进入场景。', en: 'Continue examining how light and a camera describe materials and place an object in a scene.' } },
  { slugs: ['rendering-studies', 'go-glow'], reason: { zh: '渲染选集中保留了 GO GLOW 的静物、水面与暗场画面，可返回产品案例比较模块组合与材料表达。', en: 'The rendering collection includes GO GLOW still-life, water and dark-scene images; return to the product case to compare modular combinations and material expression.' } },
  { slugs: ['plumber', 'huhu-care'], reason: { zh: '两个合作概念都先梳理不同角色，再组织设备、动作与反馈。', en: 'Both collaborative concepts map different roles before organizing equipment, actions and feedback.' } },
  { slugs: ['huhu-care', 'lingmu'], reason: { zh: '从呼气引导到自主洗浴，关注身体条件、接触位置和操作理解。', en: 'From breathing guidance to independent bathing, examine body conditions, contact points and understandable actions.' } },
  { slugs: ['biyuan', 'periastra'], reason: { zh: '比较品牌规则如何从图形识别进入产品语境与具体应用。', en: 'Compare how identity rules move from a graphic into product context and applications.' } },
  { slugs: ['biyuan', 'lensflow'], reason: { zh: '从平台的模型入口进入创作工作台，了解接入信息怎样连接实际任务。', en: 'Move from a platform’s model entry points to a creative workspace and see how access information connects to tasks.' } },
  { slugs: ['periastra', 'formline'], reason: { zh: '从标志的线宽与负形研究，进入几何构造和光学校正的可编辑对照。', en: 'Move from stroke and negative-space studies to editable comparisons of geometric construction and optical correction.' } },
  { slugs: ['lensflow', 'resume-formatter'], reason: { zh: '两者都把 AI 结果交回人工审阅，并保留修改与继续工作的路径。', en: 'Both return AI output to human review and retain paths for revision and continued work.' } },
  { slugs: ['lensflow', 'yantai'], reason: { zh: '同样从参考图出发，分别展开创作任务与造型学习的后续流程。', en: 'Both begin with a reference image, then develop creative tasks and form-learning workflows respectively.' } },
  { slugs: ['resume-formatter', 'formline'], reason: { zh: '比较两种本地编辑工具如何保留修改关系，并区分工程文件与最终导出。', en: 'Compare how two local editors retain editing relationships and distinguish project files from final exports.' } },
  { slugs: ['lingmu', 'water-walking-bath'], reason: { zh: '并列阅读两种洗浴概念，比较触及、进入、离开与身体支撑的设计问题。', en: 'Read two bathing concepts together and compare the design questions of reach, entry, exit and body support.' } },
  { slugs: ['go-glow', 'jimu-studio'], reason: { zh: '从个护模块到家具组合，比较可调整部件怎样组织日常使用。', en: 'From personal-care modules to furniture combinations, compare how adjustable parts organize everyday use.' } },
  { slugs: ['cloudwing', 'polar-wing'], reason: { zh: '并列阅读两种载人飞行器外观概念，比较机身、座舱与部件布局。', en: 'Read two passenger-aircraft concepts together and compare body, cabin and component layouts.' } },
  { slugs: ['construction-recycler', 'ecological-harvest'], reason: { zh: '从建筑废料到城市落叶，比较收集、处理与储存模块的组织方式。', en: 'From construction waste to urban leaves, compare the organization of collection, processing and storage modules.' } },
  { slugs: ['yantai', 'aesthetic-atlas'], reason: { zh: '把单张参考的造型学习连接到风格词汇、来源资料与 Eagle 归档。', en: 'Connect form study of one reference to style vocabulary, source material and Eagle archiving.' } },
  { slugs: ['image-2-5-xhs', 'xhs-methods'], reason: { zh: '把生成与连续编辑的观察，接到保留产品事实和人工复核的内容流程。', en: 'Connect observations of generation and iterative editing to content workflows that retain product facts and human review.' } },
]

const capabilityReasons: Record<string, BilingualReason> = {
  'product-system': { zh: '能力关联：把角色、动作与部件关系转化为可理解的产品形态。', en: 'Shared capability: translating roles, actions and component relationships into understandable product form.' },
  'spatial-visualization': { zh: '能力关联：通过比例、材质、灯光和构图解释物与空间的关系。', en: 'Shared capability: explaining objects and spaces through proportion, materials, light and composition.' },
  'brand-systems': { zh: '能力关联：让图形识别、应用规则与具体使用入口彼此衔接。', en: 'Shared capability: connecting graphic identity, application rules and entry points for use.' },
  interaction: { zh: '能力关联：把输入、预览、确认和返回组织为可操作的界面。', en: 'Shared capability: organizing input, preview, confirmation and return into an operable interface.' },
  'ai-workflows': { zh: '能力关联：将模型分析放进可以编辑、复核和继续的工作流程。', en: 'Shared capability: placing model analysis within workflows that can be edited, reviewed and continued.' },
  'review-delivery': { zh: '能力关联：整理版本、来源与导出，使成果能够被复核和继续使用。', en: 'Shared capability: organizing versions, sources and exports so work can be reviewed and reused.' },
}

const chapterReasons: Record<ChapterId, BilingualReason> = {
  windows: { zh: '同在商业橱窗章节，继续比较道具、商品与观看层次的组织。', en: 'In the commercial-window chapter, continue comparing props, merchandise and viewing layers.' },
  lighting: { zh: '同在灯具章节，继续比较系列形态、发光面与空间尺度。', en: 'In the lighting chapter, continue comparing family form, luminous surfaces and spatial scale.' },
  products: { zh: '同在产品设计章节，比较不同使用情境如何影响动作、部件与形态。', en: 'In the product-design chapter, compare how different use contexts affect actions, components and form.' },
  rendering: { zh: '同在三维表达章节，继续观察材料、光线、镜头与场景的关系。', en: 'In the visualization chapter, continue examining materials, light, cameras and settings.' },
  brands: { zh: '同在品牌孵化章节，比较定位、图形规则与应用载体的衔接。', en: 'In the brand-incubation chapter, compare the connection between positioning, graphic rules and applications.' },
  ai: { zh: '同在数字产品章节，比较信息怎样进入输入、判断与反馈流程。', en: 'In the digital-product chapter, compare how information enters input, judgment and feedback flows.' },
}

/** Return at most two justified, existing destinations; never fill with unrelated work. */
export function getCaseRelations(work: CaseSummary, works: readonly CaseSummary[], capabilities: readonly CapabilitySummary[], lang: Lang): CaseRelation[] {
  const catalog = new Map(works.map(item => [item.slug, item]))
  if (!catalog.has(work.slug)) return []
  const related: CaseRelation[] = []
  const append = (slug: string, reason: string, basis: CaseRelation['basis']) => {
    if (related.length < 2 && slug !== work.slug && catalog.has(slug) && !related.some(item => item.slug === slug)) related.push({ slug, reason, basis })
  }

  for (const connection of CASE_CONNECTIONS) {
    if (connection.slugs.includes(work.slug)) append(connection.slugs.find(slug => slug !== work.slug)!, connection.reason[lang], 'curated')
  }

  const shared = [...catalog.values()].filter(item => item.slug !== work.slug).map(item => ({
    item,
    capabilities: capabilities.filter(capability => capability.caseSlugs.includes(work.slug) && capability.caseSlugs.includes(item.slug)),
  })).filter(candidate => candidate.capabilities.length > 0).sort((a, b) => b.capabilities.length - a.capabilities.length || Number(b.item.chapter === work.chapter) - Number(a.item.chapter === work.chapter) || a.item.order - b.item.order || a.item.slug.localeCompare(b.item.slug))
  for (const candidate of shared) {
    const capability = candidate.capabilities[0]
    const reason = capabilityReasons[capability.id]?.[lang] ?? (lang === 'zh' ? `共同实践“${capability.title}”，从另一个案例继续比较。` : `Both explore ${capability.title.toLowerCase()}; continue the comparison in another case.`)
    append(candidate.item.slug, reason, 'capability')
  }

  const chapter = [...catalog.values()].filter(item => item.chapter === work.chapter).sort((a, b) => Math.abs(a.order - work.order) - Math.abs(b.order - work.order) || a.order - b.order || a.slug.localeCompare(b.slug))
  for (const item of chapter) append(item.slug, chapterReasons[work.chapter][lang], 'chapter')
  return related
}
