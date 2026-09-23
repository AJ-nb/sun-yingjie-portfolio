import publication from './publication.json'
import { FEATURED, getWorks, type Lang } from './workDocs'
import { getCaseRelations, type CaseRelation } from './caseRelations'
import { type ChapterId } from './chapters'

export type Localized<T = string> = { zh: T; en: T }
export type ProjectMaturity =
  | 'research'
  | 'experiment'
  | 'prototype'
  | 'functional-prototype'
  | 'production-ready-prototype'
  | 'live'
  | 'commercial-work'

export type Category = 'commercial' | 'product' | 'brand' | 'visual' | 'digital' | 'ai' | 'experimental' | 'research'
export type ProjectTrack = 'physical' | 'digital' | 'spatial' | 'service'
export type ProjectVisibility = 'public' | 'private' | 'review-only' | 'archived'
/** Evidence is graded for the public record, not for visual polish. */
export type EvidenceLevel = 'A' | 'B' | 'C' | 'D'
export type SourceKind = 'project-archive' | 'retrospective-reconstruction' | 'design-study' | 'reference-study' | 'concept' | 'public-demo'
export type LayoutVariant = 'seasonal-sequence' | 'technical-field' | 'vertical-space' | 'strategy-system' | 'brand-product-cmf' | 'metadata-archive' | 'default'

export const LAB_CATEGORIES: readonly Category[] = ['research', 'experimental', 'visual']
export const TOOL_CATEGORIES: readonly Category[] = ['digital', 'ai']

export interface ProjectEntry {
  id: string
  slug: string
  title: Localized
  subtitle?: Localized
  year?: string
  subCategory?: string
  type: string
  role: string
  roleScope: Localized
  client?: Localized
  summary: Localized
  description: Localized
  credits: Localized
  contribution: Localized
  provenance: Localized
  license?: string
  confidential: boolean
  availability: 'public' | 'private' | 'restricted'
  caseStudyUrl?: string
  liveDemoUrl?: string
  demoMode?: 'live' | 'precomputed'
  demoLabel?: Localized
  githubUrl?: string
  documentationUrl?: string
  researchUrl?: string
  figmaUrl?: string
  externalUrl?: string
  openSourceFoundation?: Localized
  aiRole: Localized
  humanGates: Localized<string[]>
  seo: { title: Localized; description: Localized; ogImage: string; noindex: boolean }
  links?: {
    caseStudyUrl?: string
    liveDemoUrl?: string
    githubUrl?: string
    documentationUrl?: string
    researchUrl?: string
    figmaUrl?: string
    externalUrl?: string
  }
  stack: string[]
  tools: string[]
  models: string[]
  skills: string[]
  status: Localized
  cover: string
  tags: Localized<string[]>
  category: Category
  track: ProjectTrack
  maturity: ProjectMaturity
  visibility: ProjectVisibility
  evidenceLevel: EvidenceLevel
  sourceKind: SourceKind
  sourceEvidence: Localized
  publicBoundary: Localized
  layoutVariant: LayoutVariant
  capabilityRoles: Localized<string[]>
  readingTime: number
  nextProject?: string
  assetGroups?: Array<{ name: Localized; evidenceLevel: EvidenceLevel }>
  featured: boolean
  selected: boolean
  chapter: ChapterId
  order: number
  startDate?: string
  endDate?: string
  datePrecision: 'month' | 'year' | 'range' | 'unknown'
}

type RegistryClassification = Pick<ProjectEntry, 'category' | 'track' | 'maturity'>

// Classification is intentionally explicit: these values are the reviewed boundary
// between a public case study, a tool, and a research or concept archive.
const classification: Record<string, RegistryClassification> = {
  hermes: { category: 'brand', track: 'spatial', maturity: 'commercial-work' },
  arcteryx: { category: 'brand', track: 'spatial', maturity: 'commercial-work' },
  karimoku: { category: 'brand', track: 'spatial', maturity: 'research' },
  periastra: { category: 'brand', track: 'physical', maturity: 'research' },
  yelisi: { category: 'brand', track: 'physical', maturity: 'experiment' },
  biyuan: { category: 'digital', track: 'digital', maturity: 'functional-prototype' },
  lighting: { category: 'product', track: 'physical', maturity: 'prototype' },
  'huhu-care': { category: 'product', track: 'physical', maturity: 'experiment' },
  'go-glow': { category: 'product', track: 'physical', maturity: 'experiment' },
  plumber: { category: 'product', track: 'service', maturity: 'experiment' },
  'jimu-studio': { category: 'product', track: 'physical', maturity: 'experiment' },
  lingmu: { category: 'product', track: 'physical', maturity: 'experiment' },
  'plant-companion': { category: 'product', track: 'physical', maturity: 'experiment' },
  'bat-quad': { category: 'product', track: 'physical', maturity: 'experiment' },
  cloudwing: { category: 'product', track: 'physical', maturity: 'experiment' },
  'construction-recycler': { category: 'product', track: 'service', maturity: 'experiment' },
  'ecological-harvest': { category: 'product', track: 'service', maturity: 'experiment' },
  'little-orange': { category: 'product', track: 'physical', maturity: 'experiment' },
  'polar-wing': { category: 'product', track: 'physical', maturity: 'experiment' },
  'purewater-rolling-filter': { category: 'product', track: 'physical', maturity: 'experiment' },
  'water-walking-bath': { category: 'product', track: 'physical', maturity: 'experiment' },
  'aesthetic-atlas': { category: 'research', track: 'digital', maturity: 'research' },
  formline: { category: 'digital', track: 'digital', maturity: 'prototype' },
  lensflow: { category: 'ai', track: 'digital', maturity: 'prototype' },
  'ai-video-systems': { category: 'ai', track: 'digital', maturity: 'experiment' },
  'resume-formatter': { category: 'digital', track: 'digital', maturity: 'live' },
  'visual-archive': { category: 'experimental', track: 'digital', maturity: 'prototype' },
  xintiao: { category: 'digital', track: 'digital', maturity: 'prototype' },
  yantai: { category: 'experimental', track: 'digital', maturity: 'prototype' },
  'image-2-5-xhs': { category: 'research', track: 'digital', maturity: 'research' },
  'xhs-methods': { category: 'research', track: 'digital', maturity: 'research' },
  'rendering-studies': { category: 'visual', track: 'physical', maturity: 'research' },
}

const excludedSlugs = new Set(['baobab-glow', 'water-guardian', 'yuju'])
const verifiedLinks: Record<string, Pick<ProjectEntry, 'liveDemoUrl' | 'demoMode' | 'demoLabel' | 'githubUrl' | 'researchUrl' | 'externalUrl'>> = {
  'ai-video-systems': { researchUrl: 'https://github.com/LearnPrompt/awesome-seedance' },
  biyuan: { externalUrl: 'https://biyuan.ai/' },
  lensflow: {
    liveDemoUrl: 'https://aj-nb.github.io/lensflow/studio/?demo=1',
    demoMode: 'precomputed',
    demoLabel: { zh: '预计算演示', en: 'Precomputed demo' },
  },
  'resume-formatter': {
    liveDemoUrl: 'https://aj-nb.github.io/resume-formatter/',
    demoMode: 'live',
    demoLabel: { zh: '试用工具', en: 'Try tool' },
  },
  yantai: { researchUrl: 'https://github.com/AJ-nb/luck-power' },
}
const selectedSlugs = new Set(FEATURED)
/**
 * The public recruiting sequence. It starts with physical and spatial work,
 * then moves through products, brand systems and the supporting visual study.
 * Home, /work, route-frame links and the publication manifest all refer to this
 * order; do not create a second editorial order in a consuming component.
 */
export const PRIMARY_WORK_ORDER = [
  'hermes',
  'arcteryx',
  'karimoku',
  'lighting',
  'plumber',
  'huhu-care',
  'plant-companion',
  'go-glow',
  'lingmu',
  'jimu-studio',
  'biyuan',
  'rendering-studies',
  'yelisi',
  'periastra',
] as const

// Compatibility name for existing consumers. The fixed order above is the
// source of truth; publication editions may select a page-budgeted subset.
export const DESIGN_OS_FEATURED = PRIMARY_WORK_ORDER
// These aliases are editorial handles; canonical URLs continue to use the stable slugs.
export const PROJECT_SLUG_ALIASES: Record<string, string> = {
  'hermes-seasonal-window-worlds': 'hermes',
  'mountain-performance-field': 'arcteryx',
  'karimoku-benwu-design-study': 'karimoku',
  'periastra-brand-system': 'periastra',
  'yelisi-brand-product-cmf': 'yelisi',
}

type CaseMetadata = Pick<ProjectEntry, 'evidenceLevel' | 'sourceKind' | 'sourceEvidence' | 'publicBoundary' | 'aiRole' | 'humanGates' | 'layoutVariant' | 'capabilityRoles' | 'readingTime' | 'nextProject' | 'assetGroups' | 'openSourceFoundation'>

const caseMetadata: Record<string, CaseMetadata> = {
  'ai-video-systems': {
    evidenceLevel: 'B',
    sourceKind: 'project-archive',
    sourceEvidence: {
      zh: '作者于 2026-09-22 提供 22.08 秒成片和过程说明；分镜数量、角色数量与单次生成说法为作者记录，未由第三方独立核验。',
      en: 'Yingjie Sun supplied the 22.08-second final film and a process account on 2026-09-22. Storyboard, cast-count and single-pass claims are author-recorded, not independently verified.',
    },
    publicBoundary: {
      zh: '公开页面只呈现作者提供的成片、从零绘制的系统图与过程边界；不公开参考影片、角色源图、Blender 源文件、完整提示词或第三方案例媒体，也不声称商业投放、模型所有权或外部效果。',
      en: 'The public page contains only the author-supplied final film, newly authored system diagrams and process boundaries. It excludes the reference film, character sources, Blender files, complete prompts and third-party case media, and makes no claim of commercial deployment, model ownership or external performance.',
    },
    aiRole: {
      zh: 'GPT 6 / Codex 用于剧情到分镜脚本、提示词与场景描述的协作；Blender 用于白模预演；Seedance 2.5 用于最终视频渲染。AI 输出不替代镜头、结构、选择与发布判断。',
      en: 'GPT 6 / Codex assisted plot-to-storyboard scripting, prompts and scene descriptions; Blender supported blocking; Seedance 2.5 rendered the final video. AI output does not replace decisions about camera, structure, selection or release.',
    },
    humanGates: {
      zh: ['剧情与分镜脚本人工确认', '角色、镜头、动作与物理关系逐项复看', '来源、参考范围、文字与公开权限检查'],
      en: ['Human approval of plot and storyboard script', 'Shot-by-shot review of identity, camera, action and physical relations', 'Review of source, reference scope, copy and public-display permission'],
    },
    layoutVariant: 'default',
    capabilityRoles: {
      zh: ['Primary · AI 视频工作流与镜头规格', 'Secondary · Blender 白模与时间结构', 'Support · 提示词评估与来源边界'],
      en: ['Primary · AI-video workflow and camera specification', 'Secondary · Blender blocking and temporal structure', 'Support · Prompt evaluation and source boundary'],
    },
    readingTime: 5,
    nextProject: 'lensflow',
    openSourceFoundation: {
      zh: '参考 LearnPrompt 的 Awesome Seedance 公开资料；该项目不属于本人原创开源作品，原帖、提示词、图片与视频仍归各自创作者或权利人所有。',
      en: 'Informed by LearnPrompt’s public Awesome Seedance material; it is not original open-source work by Yingjie Sun. Original posts, prompts, images and videos remain with their respective creators or rights holders.',
    },
  },
  hermes: {
    evidenceLevel: 'B',
    sourceKind: 'project-archive',
    sourceEvidence: {
      zh: '职责补充来源：2026-09-16 本人项目口述；现有公开图像支持团队协作与三维／视觉参与，但不独立证明统筹、法国沟通、工厂或门店交付边界。',
      en: 'Responsibility supplement: Yingjie Sun’s project account dated 2026-09-16. Existing public views support team collaboration and 3D/visual participation, but do not independently prove leadership, France communication, factory or store-delivery boundaries.',
    },
    publicBoundary: {
      zh: '公开页面保留 BENWU 团队协作、个人参与三维设计与视觉呈现，以及现有项目图像；新增的夏天、秋季、冬季板式素材来自外部整理目录，暂按 Level C 回顾性重建处理。个人统筹、法国沟通、生产和门店交付边界待原始项目记录核验。',
      en: 'The public case records BENWU collaboration, Yingjie Sun’s participation in 3D design and visual presentation, and retained project views. The newly supplied Summer, Autumn and Winter board sets are treated as Level C retrospective reconstruction material until primary sources are verified. Individual leadership, France communication, production and store-delivery boundaries remain unverified.',
    },
    aiRole: {
      zh: '当前项目档案未记录 AI 作为设计成果来源；页面只呈现已核验的团队协作与三维／视觉参与，个人交付边界仍待核验。',
      en: 'The current project record does not document AI as a source of the design outcome; the page presents verified team collaboration and 3D/visual participation, while personal delivery boundaries remain unverified.',
    },
    humanGates: {
      zh: ['团队对三维设计与视觉呈现的人工评审', '商品层级、道具尺度与窗幅关系复核', '生产、门店和商场交付边界待记录确认'],
      en: ['Human review of 3D design and visual presentation within the team', 'Review of merchandise hierarchy, prop scale and window proportions', 'Production, store and mall delivery boundaries require source records'],
    },
    layoutVariant: 'seasonal-sequence',
    capabilityRoles: {
      zh: ['Primary · 品牌空间叙事参与', 'Secondary · 三维设计与视觉呈现', 'Support · 商品与窗幅关系复盘'],
      en: ['Primary · Participation in spatial brand storytelling', 'Secondary · 3D design and visual presentation', 'Support · Merchandise and window-proportion review'],
    },
    readingTime: 5,
    nextProject: 'arcteryx',
    assetGroups: [
      { name: { zh: '夏天', en: 'Summer' }, evidenceLevel: 'C' },
      { name: { zh: '秋季', en: 'Autumn' }, evidenceLevel: 'C' },
      { name: { zh: '冬季', en: 'Winter' }, evidenceLevel: 'C' },
    ],
  },
  arcteryx: {
    evidenceLevel: 'B',
    sourceKind: 'project-archive',
    sourceEvidence: {
      zh: '职责补充来源：2026-09-16 本人项目口述；现有公开图像支持团队协作与三维／视觉参与，但不独立证明统筹、生产或展示交付边界。',
      en: 'Responsibility supplement: Yingjie Sun’s project account dated 2026-09-16. Existing public views support team collaboration and 3D/visual participation, but do not independently prove leadership, production or display-delivery boundaries.',
    },
    publicBoundary: {
      zh: '公开页面呈现 BENWU 团队协作、个人参与三维设计与视觉呈现，以及留存的 Alpha Center 橱窗图像；不由图像推导个人统筹、生产、展示、销售或性能结果。',
      en: 'The public case presents BENWU collaboration, Yingjie Sun’s participation in 3D design and visual presentation, and the retained Alpha Center window view; individual leadership, production, display, sales or performance outcomes are not inferred from imagery.',
    },
    aiRole: {
      zh: '当前项目档案未记录 AI 作为设计成果来源；页面只呈现已核验的团队协作与三维／视觉参与，不把性能或个人交付结果写入案例。',
      en: 'The current project record does not document AI as a source of the design outcome; the case presents verified team collaboration and 3D/visual participation without inferring performance or personal delivery outcomes.',
    },
    humanGates: {
      zh: ['团队对三维设计与整体画面关系的人工评审', '装备、身体和空间遮挡关系复核', '生产与门店展示边界待原始记录确认'],
      en: ['Human review of 3D design and overall composition within the team', 'Review of equipment, body and spatial occlusion', 'Production and store-display boundaries require source records'],
    },
    layoutVariant: 'technical-field',
    capabilityRoles: {
      zh: ['Primary · 空间层级与装备阅读', 'Secondary · 三维设计与视觉呈现', 'Support · 地形、身体和装备关系复盘'],
      en: ['Primary · Spatial hierarchy and equipment reading', 'Secondary · 3D design and visual presentation', 'Support · Terrain, body and equipment review'],
    },
    readingTime: 3,
    nextProject: 'karimoku',
  },
  karimoku: {
    evidenceLevel: 'C',
    sourceKind: 'design-study',
    sourceEvidence: {
      zh: '项目身份来源：BENWU 期间的设计研究档案与本人整理说明；官方委托、合作关系和生产记录尚未独立核验。',
      en: 'Project-identity source: a BENWU-period design-study archive and Yingjie Sun’s accompanying notes; official commission, partnership and production records are not independently verified.',
    },
    publicBoundary: {
      zh: '这是 BENWU 期间的 Karimoku × BENWU 设计研究与回顾性重建；当前没有足够证据证明官方委托、合作关系、量产或商业结果。',
      en: 'This is a Karimoku × BENWU design study and retrospective reconstruction from the BENWU period. The current record does not establish an official commission, partnership, production or commercial outcome.',
    },
    aiRole: {
      zh: '未记录 AI 生成或自动化交付；研究判断、材料取舍和归属边界由人工复核。',
      en: 'No AI generation or automated delivery is recorded; research judgments, material choices and attribution boundaries remain human-reviewed.',
    },
    humanGates: {
      zh: ['品牌事实与项目身份核验', '材料、工艺和供应链样片验证', '空间动线与传播顺序评审'],
      en: ['Verification of brand facts and project identity', 'Material, fabrication and supply-chain sample checks', 'Review of spatial movement and communication sequence'],
    },
    layoutVariant: 'vertical-space',
    capabilityRoles: {
      zh: ['Primary · 品牌基础与文化转译', 'Primary · 材料与空间系统', 'Support · 叙事与沟通组织'],
      en: ['Primary · Brand foundation and cultural translation', 'Primary · Material and spatial system', 'Support · Narrative and communication structure'],
    },
    readingTime: 4,
    nextProject: 'yelisi',
  },
  periastra: {
    evidenceLevel: 'C',
    sourceKind: 'design-study',
    sourceEvidence: {
      zh: '项目职责来源：本人项目口述与现有品牌图形档案；个人完整交付范围和商业采用状态仍待独立记录。',
      en: 'Responsibility source: Yingjie Sun’s project account and the existing brand-graphic archive; full individual delivery scope and commercial adoption remain independently unverified.',
    },
    publicBoundary: {
      zh: '公开页面记录共同创作的品牌图形与应用研究；Hasselblad 相关内容仅作为 Reference Study，用于学习方法，不代表合作、授权或成果归属。具体个人分工与商业采用状态待核验。',
      en: 'The public case records collaborative brand-graphic and application research. Hasselblad-related material is a Reference Study for learning methods only; it does not imply collaboration, authorization or ownership of outcomes. Individual scope and commercial adoption remain unverified.',
    },
    aiRole: {
      zh: '当前档案未记录 AI 参与字标采用或品牌决策；识别、信息和应用由人工比较与确认。',
      en: 'The current record does not document AI participation in wordmark adoption or brand decisions; identity, information and applications were compared and confirmed by people.',
    },
    humanGates: {
      zh: ['团队对品牌定位与识别方向的人工评审', '字标小尺寸与工艺样片检查', 'Hasselblad 参考边界人工复核'],
      en: ['Human team review of brand positioning and identity direction', 'Wordmark small-scale and fabrication-sample checks', 'Human review of the Hasselblad reference boundary'],
    },
    layoutVariant: 'strategy-system',
    capabilityRoles: {
      zh: ['Primary · 品牌策略与定位研究', 'Secondary · 识别与信息系统共同创作', 'Support · 产品语言与应用规则分析'],
      en: ['Primary · Brand strategy and positioning study', 'Secondary · Collaborative identity and information system work', 'Support · Product language and application analysis'],
    },
    readingTime: 4,
    nextProject: 'yelisi',
  },
  yelisi: {
    evidenceLevel: 'C',
    sourceKind: 'concept',
    sourceEvidence: {
      zh: '项目职责来源：本人项目口述与现有品牌／产品概念档案；个人总责、团队规模和制造或上市状态仍待独立记录。',
      en: 'Responsibility source: Yingjie Sun’s project account and the existing brand/product-concept archive; overall ownership, team size and manufacturing or launch status remain independently unverified.',
    },
    publicBoundary: {
      zh: '公开页面呈现品牌、产品与 CMF 的概念关系；产品仍处于概念阶段，不声称制造、上市、人体工学或商业结果已经验证。',
      en: 'The public case presents the relationship between brand, product and CMF concepts. The product remains conceptual; manufacturing, launch, ergonomics and commercial outcomes are not claimed as verified.',
    },
    aiRole: {
      zh: '未记录 AI 参与品牌方向或产品概念；材料接触、连接和人体工学需要人工与实物验证。',
      en: 'No AI participation in brand direction or product concepts is recorded; material contact, connection and ergonomics require human and physical validation.',
    },
    humanGates: {
      zh: ['团队方向与版本评审；个人总责和团队规模待核验', '接触材料、磁吸和释放方式实物测试', '人体工学、耐久度和制造可行性验证'],
      en: ['Team direction and version review; individual ownership and team size remain unverified', 'Physical tests for contact materials, magnetic force and release', 'Ergonomic, durability and manufacturing-feasibility validation'],
    },
    layoutVariant: 'brand-product-cmf',
    capabilityRoles: {
      zh: ['Primary · 品牌系统与语义共同创作', 'Secondary · 产品方向与 CMF 概念研究', 'Support · 应用规则与版本比较'],
      en: ['Primary · Collaborative brand system and meaning', 'Secondary · Product direction and CMF concept study', 'Support · Application rules and version comparison'],
    },
    readingTime: 4,
    nextProject: 'periastra',
  },
}

const documentedWorkflowMetadata: Record<string, Partial<CaseMetadata>> = {
  biyuan: {
    evidenceLevel: 'B',
    sourceKind: 'project-archive',
    publicBoundary: {
      zh: '公开页面记录整体 VI/UI 与迭代协作；彼源模型与服务归其提供方，当前档案不把模型研发、独立上线责任或商业结果归于本人。',
      en: 'The public case records overall VI/UI and iteration collaboration. Biyuan models and services belong to their providers; the record does not assign model development, independent launch ownership or commercial outcomes to Yingjie Sun.',
    },
    aiRole: {
      zh: '多模型服务作为产品上下文；人负责品牌层级、界面结构、交互取舍和发布前复核。',
      en: 'Multiple model services form the product context; human responsibility covers brand hierarchy, interface structure, interaction trade-offs and pre-release review.',
    },
    humanGates: {
      zh: ['品牌与界面层级评审', '模型返回内容与状态反馈检查', '上线范围和服务归属复核'],
      en: ['Review of brand and interface hierarchy', 'Checks on model output and state feedback', 'Review of launch scope and service ownership'],
    },
    readingTime: 3,
  },
  lensflow: {
    evidenceLevel: 'B',
    sourceKind: 'public-demo',
    publicBoundary: {
      zh: '公开演示使用预计算内容，不证明实时模型调用或全面兼容性；项目包含开源组件，个人贡献限定为产品与交互共同创作及已记录的实现范围。',
      en: 'The public demo uses precomputed content and does not prove live model calls or broad compatibility. Open-source components are included; personal contribution is limited to the documented product, interaction and implementation collaboration.',
    },
    aiRole: {
      zh: 'AI 辅助实现与工作流对象；演示中的分析和生成结果为预计算样例，人负责输入、编辑、比较、恢复和发布判断。',
      en: 'AI supports implementation and forms part of the workflow; analysis and generation in the demo are precomputed samples. Humans control input, editing, comparison, recovery and release decisions.',
    },
    humanGates: {
      zh: ['来源、提示词与任务状态人工复核', '局部失败恢复与兼容性检查', '开源依赖许可和发布边界检查'],
      en: ['Human review of sources, prompts and task state', 'Partial-failure recovery and compatibility checks', 'Open-source license and release-boundary checks'],
    },
    openSourceFoundation: {
      zh: '包含开源组件；具体依赖与许可证以项目声明为准，不主张上游代码归本人所有。',
      en: 'Includes open-source components; dependencies and licenses follow the project notices, and upstream code is not claimed as original work.',
    },
    readingTime: 3,
  },
  formline: {
    evidenceLevel: 'B',
    sourceKind: 'project-archive',
    publicBoundary: {
      zh: '公开页面记录本地 Logo 编辑器原型与界面结构；几何求解和绘图依赖开源组件，不将分项诊断写成通用自动化能力。',
      en: 'The public case records a local Logo-editor prototype and its interface structure. Geometry solving and drawing use open-source components; itemized diagnostics are not presented as general automated capability.',
    },
    aiRole: {
      zh: '当前档案未记录 AI 生成参与几何判断；人负责构造规则、光学校正、比较和导出确认。',
      en: 'The current record does not document AI generation in geometric decisions; humans control construction rules, optical correction, comparison and export approval.',
    },
    humanGates: {
      zh: ['构造关系与光学校正人工比较', '导出格式与诊断线索复核', '开源依赖许可边界检查'],
      en: ['Human comparison of construction and optical correction', 'Review of export formats and diagnostic cues', 'Open-source dependency and license-boundary checks'],
    },
    openSourceFoundation: {
      zh: 'PlaneGCS、Paper.js 等开源组件；贡献和许可证沿用原项目声明。',
      en: 'Uses open-source components including PlaneGCS and Paper.js; contributions and licenses follow the upstream notices.',
    },
    readingTime: 3,
  },
  'resume-formatter': {
    evidenceLevel: 'A',
    sourceKind: 'public-demo',
    publicBoundary: {
      zh: '公开在线工具可访问；项目是基于 MIT 上游的二次开发与共同创作，不主张从零原创，也不把虚构演示履历当作本人经历。',
      en: 'The public tool is available online. It is a collaborative extension of an MIT-licensed upstream project; it is not claimed as original from scratch, and fictional demo résumés are not presented as Yingjie Sun’s experience.',
    },
    aiRole: {
      zh: 'AI 改写为可选能力；人负责选择、差异审阅、日期和数字复核，以及最终应用或撤销。',
      en: 'AI rewriting is optional; humans choose, review diffs, verify dates and numbers, and approve or discard changes.',
    },
    humanGates: {
      zh: ['事实证据与岗位版本差异审阅', '导入、排版与 PDF 输出复核', '上游归属、许可证和隐私边界检查'],
      en: ['Fact evidence and job-version diff review', 'Import, layout and PDF-output checks', 'Upstream attribution, license and privacy-boundary checks'],
    },
    openSourceFoundation: {
      zh: 'Fork 自 gracexygu/resume-formatter；上游与本 Fork 均采用 MIT License。',
      en: 'Forked from gracexygu/resume-formatter; both upstream and this fork use the MIT License.',
    },
    readingTime: 3,
  },
  'visual-archive': {
    evidenceLevel: 'B',
    sourceKind: 'project-archive',
    publicBoundary: {
      zh: '公开画面记录 Chrome 扩展原型、本地测量和待生成状态；不证明模型分析精度、调用成功或隐藏结构识别。',
      en: 'The public screens record a Chrome extension prototype, local measurements and a pending-generation state; they do not prove model accuracy, call success or hidden-geometry recognition.',
    },
    aiRole: {
      zh: '模型档案在展示状态中尚未生成；人负责区分测量、推断、未知项和复现计划。',
      en: 'The model archive is not generated in the shown state; humans separate measurements, inferences, unknowns and reproduction plans.',
    },
    humanGates: {
      zh: ['本地测量与视觉推断分开检查', '空状态与待生成状态复核', '来源文件、提示词和隐私边界检查'],
      en: ['Separate checks for local measurements and visual inference', 'Review of empty and pending-generation states', 'Source-file, prompt and privacy-boundary checks'],
    },
    readingTime: 2,
  },
  xintiao: {
    evidenceLevel: 'B',
    sourceKind: 'project-archive',
    publicBoundary: {
      zh: '公开页面记录原生微信小程序的本地开发与模拟器验证；工资计算核心复用 AGPL-3.0-only 上游，不是 PayDance 官方产品，尚无上线或真实准确率结果。',
      en: 'The public case records local development and simulator verification of a native WeChat mini-program. Its wage-calculation core reuses an AGPL-3.0-only upstream; it is not an official PayDance product, and launch or real-world accuracy are unverified.',
    },
    aiRole: {
      zh: '当前档案未记录 AI 参与工资计算或交互决策；人负责产品组织、交互、视觉和平台改造。',
      en: 'The current record does not document AI in wage calculation or interaction decisions; humans control product structure, interaction, visual design and platform adaptation.',
    },
    humanGates: {
      zh: ['计薪规则、跨零点和午休校验', '模拟器状态与主题显示复核', '上游 AGPL 归属和平台发布边界检查'],
      en: ['Checks for wage rules, overnight shifts and breaks', 'Simulator state and theme-display review', 'Upstream AGPL attribution and platform-release checks'],
    },
    openSourceFoundation: {
      zh: '工资核心复用 MrBaoboer/PayDance（AGPL-3.0-only）；薪跳不是 PayDance 官方小程序。',
      en: 'Reuses the wage core from MrBaoboer/PayDance (AGPL-3.0-only); Xintiao is not an official PayDance mini-program.',
    },
    readingTime: 3,
  },
  yantai: {
    evidenceLevel: 'B',
    sourceKind: 'project-archive',
    publicBoundary: {
      zh: '公开页面记录产品造型学习与归档工具的原型和演示夹具；当前模块位于私有仓库，公开前身与上游链接已标明，不把灯具示例写成个人产品成果。',
      en: 'The public case records a product-form learning and archiving prototype with a demo fixture. The current module is private; its public predecessor and upstream link are identified, and the lamp example is not claimed as a personal product outcome.',
    },
    aiRole: {
      zh: 'AI 可提供观察、推断和练习建议；人负责核对图像依据、判断迁移方法并确认归档。',
      en: 'AI can suggest observations, inferences and exercises; humans verify visual evidence, judge transferable methods and confirm archiving.',
    },
    humanGates: {
      zh: ['观察、推断与练习建议分层复核', '归档写入前人工确认', '私有模块、公开前身和依赖许可边界检查'],
      en: ['Separate review of observations, inferences and exercises', 'Human confirmation before archive writes', 'Private-module, public-predecessor and dependency-license boundary checks'],
    },
    openSourceFoundation: {
      zh: '公开前身为 AJ-nb/luck-power；当前案例不把私有模块或上游代码归为从零原创。',
      en: 'The public predecessor is AJ-nb/luck-power; the current case does not claim the private module or upstream code as original from scratch.',
    },
    readingTime: 3,
  },
}

function defaultCaseMetadata(slug: string, config: RegistryClassification): CaseMetadata {
  const evidenceLevel: EvidenceLevel = config.maturity === 'live' ? 'A' : config.maturity === 'prototype' || config.maturity === 'functional-prototype' || config.maturity === 'commercial-work' ? 'B' : 'C'
  const sourceKind: SourceKind = config.maturity === 'live' ? 'public-demo' : config.maturity === 'prototype' || config.maturity === 'functional-prototype' || config.maturity === 'commercial-work' ? 'project-archive' : config.category === 'research' || config.category === 'experimental' ? 'retrospective-reconstruction' : 'concept'
  const boundary = config.maturity === 'commercial-work'
    ? {
        zh: '公开页面只呈现当前档案支持的团队协作和设计参与；不由图像推导未记录的个人职责、生产、上线或商业结果。',
        en: 'The public page stays within the recorded team collaboration and design contribution; unrecorded personal responsibility, production, launch or commercial outcomes are not inferred from imagery.',
      }
    : config.maturity === 'live'
      ? {
          zh: '公开演示链接可访问；个人贡献、上游依赖、运行覆盖和未验证结果按案例正文分别说明。',
          en: 'A public demo link is available; personal contribution, upstream dependencies, runtime coverage and unverified outcomes are stated in the case text.',
        }
      : {
          zh: '该页面是个人档案中的概念、原型或研究记录；不将视觉材料推导为官方合作、量产、上线、性能或商业结果。',
          en: 'This page is a concept, prototype or research record in the personal archive; visual material is not treated as proof of official collaboration, production, launch, performance or commercial outcomes.',
        }
  const generic = {
    evidenceLevel,
    sourceKind,
    sourceEvidence: {
      zh: '来源为现有项目档案与本人整理；没有额外独立来源时，职责和结果按正文边界解释。',
      en: 'Source is the existing project archive and Yingjie Sun’s authored record; where no independent source is available, responsibility and outcomes follow the case boundary.',
    },
    publicBoundary: boundary,
    aiRole: {
      zh: 'AI 角色仅按当前项目记录说明；问题定义、选择、事实核验、设计判断与发布由人负责。',
      en: 'AI is described only where the current project record supports it; humans remain responsible for framing, selection, fact checking, design judgment and release.',
    },
    humanGates: {
      zh: ['来源、署名与公开权限复核', '设计判断、状态和边界人工检查', '发布前素材、文字和链接检查'],
      en: ['Review of source, attribution and public permission', 'Human checks on design judgment, state and boundaries', 'Pre-release checks on assets, copy and links'],
    },
    layoutVariant: 'default' as const,
    capabilityRoles: {
      zh: ['Support · 作为能力档案中的补充证据'],
      en: ['Support · Supporting evidence in the capability archive'],
    },
    readingTime: 2,
  }
  return { ...generic, ...(documentedWorkflowMetadata[slug] ?? {}) }
}
const zhWorks = new Map(getWorks('zh').map(work => [work.slug, work]))
const enWorks = new Map(getWorks('en').map(work => [work.slug, work]))

const publicSlugs = [...zhWorks.keys()].filter(slug => !excludedSlugs.has(slug))
if (publicSlugs.some(slug => !classification[slug])) throw new Error('Project registry classification is incomplete')

export const PROJECT_REGISTRY: readonly ProjectEntry[] = publicSlugs.map(slug => {
  const zh = zhWorks.get(slug)!
  const en = enWorks.get(slug)
  const config = classification[slug]
  if (!en) throw new Error(`Missing English work document for ${slug}`)
  return {
    id: slug,
    slug,
    title: { zh: zh.title, en: en.title },
    year: zh.startDate?.slice(0, 4),
    type: config.category === 'brand' ? 'brand-case' : config.category === 'commercial' ? 'commercial-case' : config.category === 'research' ? 'research' : 'project',
    role: zh.role,
    roleScope: { zh: zh.role, en: en.role },
    summary: { zh: zh.summary, en: en.summary },
    description: { zh: zh.summary, en: en.summary },
    seo: { title: { zh: zh.title, en: en.title }, description: { zh: zh.summary, en: en.summary }, ogImage: zh.cover, noindex: false },
    credits: { zh: zh.credits, en: en.credits },
    contribution: { zh: zh.role, en: en.role },
    provenance: { zh: zh.credits, en: en.credits },
    confidential: false,
    availability: 'public',
    stack: [],
    tools: [],
    models: [],
    skills: zh.tags,
    status: { zh: zh.status, en: en.status },
    cover: zh.cover,
    tags: { zh: zh.tags, en: en.tags },
    ...config,
    ...(caseMetadata[slug] ?? defaultCaseMetadata(slug, config)),
    visibility: 'public',
    featured: selectedSlugs.has(slug),
    selected: selectedSlugs.has(slug),
    chapter: zh.chapter,
    order: zh.order,
    ...(zh.startDate ? { startDate: zh.startDate } : {}),
    ...(zh.endDate ? { endDate: zh.endDate } : {}),
    datePrecision: zh.datePrecision,
    ...(verifiedLinks[slug] ?? {}),
  }
})

export function getProject(slug?: string): ProjectEntry | null {
  const canonicalSlug = slug ? (PROJECT_SLUG_ALIASES[slug] ?? slug) : undefined
  return PROJECT_REGISTRY.find(entry => entry.slug === canonicalSlug) ?? null
}

export function getFeaturedProjects(): ProjectEntry[] {
  return PROJECT_REGISTRY.filter(entry => entry.featured)
}

export function getDesignOSFeaturedProjects(): ProjectEntry[] {
  return publication.homepageSelection.flatMap(slug => {
    const project = getProject(slug)
    return project ? [project] : []
  })
}

export function getPrimaryWorkProjects(): ProjectEntry[] {
  return PRIMARY_WORK_ORDER.flatMap(slug => { const project = getProject(slug); return project ? [project] : [] })
}

/** Keep the 14 primary cases at the start of the work archive, preserving the
 * source order of every remaining public entry for filters and search. */
export function orderProjectsByPrimaryWork(entries: readonly ProjectEntry[]): ProjectEntry[] {
  const primary = new Map(getPrimaryWorkProjects().map(project => [project.slug, project]))
  const primaryEntries = PRIMARY_WORK_ORDER.flatMap(slug => {
    const project = primary.get(slug)
    return project && entries.some(entry => entry.slug === slug) ? [project] : []
  })
  return [...primaryEntries, ...entries.filter(entry => !primary.has(entry.slug))]
}

export function filterProjects(category?: Category): ProjectEntry[] {
  return category ? PROJECT_REGISTRY.filter(entry => entry.category === category) : [...PROJECT_REGISTRY]
}

export function isLabProject(project: Pick<ProjectEntry, 'category'>): boolean {
  return LAB_CATEGORIES.includes(project.category)
}

export function isToolProject(project: Pick<ProjectEntry, 'category' | 'maturity'>): boolean {
  return TOOL_CATEGORIES.includes(project.category) && project.maturity !== 'experiment' && project.maturity !== 'research'
}

export function isResearchProject(project: Pick<ProjectEntry, 'category'>): boolean {
  return project.category === 'research'
}

export function getPublicProjectRoutes(): string[] {
  const canonicalRoutes = PROJECT_REGISTRY.flatMap(project => [
    `/work/${project.slug}`,
    ...(isLabProject(project) ? [`/lab/${project.slug}`] : []),
    ...(isToolProject(project) ? [`/tools/${project.slug}`] : []),
    ...(isResearchProject(project) ? [`/research/${project.slug}`] : []),
  ])
  const aliasRoutes = Object.keys(PROJECT_SLUG_ALIASES).map(alias => `/work/${alias}`)
  return [...canonicalRoutes, ...aliasRoutes]
}

export function getRelatedProjects(slug: string, lang: Lang = 'zh'): Array<ProjectEntry & { relation: CaseRelation }> {
  const project = getProject(slug)
  if (!project) return []
  const relations = getCaseRelations(project, PROJECT_REGISTRY, [], lang)
  return relations.flatMap(relation => {
    const related = getProject(relation.slug)
    return related ? [{ ...related, relation }] : []
  })
}

export function getProjectLabel(entry: ProjectEntry, lang: Lang): string {
  const labels: Record<Lang, Record<Category, string>> = {
    zh: { commercial: '商业', product: '产品', brand: '品牌', visual: '视觉', digital: '数字', ai: 'AI', experimental: '实验', research: '研究' },
    en: { commercial: 'Commercial', product: 'Product', brand: 'Brand', visual: 'Visual', digital: 'Digital', ai: 'AI', experimental: 'Experimental', research: 'Research' },
  }
  return labels[lang][entry.category]
}
