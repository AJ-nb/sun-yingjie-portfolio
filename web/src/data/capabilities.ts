import type { Lang } from './workDocs'

export type CapabilityLevel = 'demonstrated-expertise' | 'professional-proficiency'

export interface CapabilityItem {
  id: string
  label: { zh: string; en: string }
  level: CapabilityLevel
  evidence: string[]
  note?: { zh: string; en: string }
}

export interface CapabilityTerritory {
  id: string
  title: { zh: string; en: string }
  summary: { zh: string; en: string }
  items: CapabilityItem[]
}

export const capabilityTerritories: CapabilityTerritory[] = [
  {
    id: 'brand-visual',
    title: { zh: '品牌与视觉', en: 'Brand & visual' },
    summary: { zh: '从识别规则到商业展示与数字应用。', en: 'From identity rules to commercial display and digital application.' },
    items: [
      { id: 'identity', label: { zh: '品牌识别 / VI / UI', en: 'Identity / VI / UI' }, level: 'demonstrated-expertise', evidence: ['hermes', 'arcteryx', 'periastra', 'yelisi', 'biyuan'] },
      { id: 'art-direction', label: { zh: '艺术指导与商业视觉', en: 'Art direction & commercial visual' }, level: 'demonstrated-expertise', evidence: ['hermes', 'arcteryx'] },
      { id: 'packaging', label: { zh: '包装与印刷交付', en: 'Packaging & print delivery' }, level: 'professional-proficiency', evidence: [], note: { zh: '用户确认具备；当前公开案例不足以升级为案例证明。', en: 'User-confirmed; current public cases do not support a case-backed claim.' } },
      { id: 'motion-storytelling', label: { zh: '动效与视觉叙事', en: 'Motion & visual storytelling' }, level: 'professional-proficiency', evidence: ['rendering-studies'], note: { zh: '以视觉研究与影片表达为基础，通用动效生产仍在扩展。', en: 'Grounded in visual studies and films; a general motion-production system remains in progress.' } },
    ],
  },
  {
    id: 'product-industrial',
    title: { zh: '产品与工业设计', en: 'Product & industrial design' },
    summary: { zh: '以使用场景、形态、结构与 CMF 建立产品判断。', en: 'Product decisions through use, form, structure and CMF.' },
    items: [
      { id: 'form-cmf', label: { zh: '产品形态与 CMF', en: 'Product form & CMF' }, level: 'demonstrated-expertise', evidence: ['lighting', 'huhu-care', 'go-glow', 'plumber', 'yelisi'] },
      { id: 'surface', label: { zh: '曲面与表面质量', en: 'Surface quality & continuity' }, level: 'professional-proficiency', evidence: [], note: { zh: '用户确认具备；当前项目未形成公开 G0–G3 或 Zebra 记录。', en: 'User-confirmed; no public G0–G3 or zebra-analysis record is published yet.' } },
      { id: 'dfm', label: { zh: 'DFM 与工程意识', en: 'DFM & engineering awareness' }, level: 'professional-proficiency', evidence: ['hermes', 'arcteryx', 'hannstar'], note: { zh: '公开证据支持制造语境、设计交接和工程约束分析；个人生产对接与量产工程签核均未独立核验。', en: 'Public evidence supports manufacturing context, design handoff and engineering-constraint analysis; individual production liaison and mass-production sign-off are not independently verified.' } },
      { id: 'prototype', label: { zh: '原型与设计验证', en: 'Prototyping & design validation' }, level: 'professional-proficiency', evidence: ['huhu-care', 'go-glow'], note: { zh: '公开案例以概念与模型为主，未声称已完成量产验证。', en: 'Public cases focus on concepts and models; mass-production validation is not claimed.' } },
    ],
  },
  {
    id: 'three-d',
    title: { zh: '3D 与可视化', en: '3D & visualization' },
    summary: { zh: '用模型、材质、灯光和构图把设计判断变成可比较的画面。', en: 'Make design decisions comparable through models, materials, light and composition.' },
    items: [
      { id: 'modeling', label: { zh: 'Rhino / C4D / Blender / KeyShot', en: 'Rhino / C4D / Blender / KeyShot' }, level: 'demonstrated-expertise', evidence: ['lighting', 'rendering-studies', 'hermes', 'arcteryx'] },
      { id: 'cad-surface', label: { zh: 'Creo / Alias / NX', en: 'Creo / Alias / NX' }, level: 'professional-proficiency', evidence: [] },
      { id: 'rendering', label: { zh: 'Redshift / Octane / V-Ray / Unreal / VRED', en: 'Redshift / Octane / V-Ray / Unreal / VRED' }, level: 'professional-proficiency', evidence: [], note: { zh: '用户确认具备；当前公开案例未逐一证明渲染器生产经验。', en: 'User-confirmed; public cases do not yet evidence production use of each renderer.' } },
    ],
  },
  {
    id: 'digital',
    title: { zh: '数字设计', en: 'Digital design' },
    summary: { zh: '把品牌、信息层级和复杂任务组织为可操作的界面。', en: 'Turn brand, hierarchy and complex tasks into operable interfaces.' },
    items: [
      { id: 'interaction', label: { zh: 'Figma / 交互 / 原型', en: 'Figma / interaction / prototyping' }, level: 'demonstrated-expertise', evidence: ['biyuan', 'formline', 'lensflow', 'resume-formatter', 'xintiao'] },
      { id: 'design-systems', label: { zh: '组件、变量与设计系统', en: 'Components, variables & design systems' }, level: 'professional-proficiency', evidence: ['biyuan', 'resume-formatter'], note: { zh: '当前作品集展示系统化实践，自动同步与治理仍未单独验证。', en: 'The portfolio shows system-oriented practice; automated sync and governance are not separately verified.' } },
      { id: 'design-to-code', label: { zh: 'React / TypeScript / Design-to-Code', en: 'React / TypeScript / design-to-code' }, level: 'demonstrated-expertise', evidence: ['resume-formatter', 'lensflow', 'xintiao'] },
      { id: 'design-qa', label: { zh: 'Design QA 与评估', en: 'Design QA & evaluation' }, level: 'professional-proficiency', evidence: ['image-2-5-xhs'], note: { zh: '保留为方法能力；尚未包装成独立审计工具。', en: 'Kept as a method capability; not presented as a standalone audit product.' } },
    ],
  },
  {
    id: 'aigc-automation',
    title: { zh: 'AIGC 与设计自动化', en: 'AIGC & design automation' },
    summary: { zh: 'AI 参与研究、生成、比较与修整；人的方向、选择和最终批准保持清晰。', en: 'AI supports research, generation, comparison and editing; human direction, selection and approval remain explicit.' },
    items: [
      { id: 'aigc-workflow', label: { zh: '参考分析 / 提示词 / 节点工作流', en: 'Reference analysis / prompts / node workflows' }, level: 'demonstrated-expertise', evidence: ['huhu-care', 'lensflow', 'image-2-5-xhs'] },
      { id: 'control-evaluation', label: { zh: '一致性、遮罩与输出评估', en: 'Consistency, masking & output evaluation' }, level: 'professional-proficiency', evidence: ['image-2-5-xhs'], note: { zh: '公开案例为窄范围评估，不外推为大规模可靠性。', en: 'Public evidence is narrow evaluation work; it does not imply large-scale reliability.' } },
      { id: 'agent-integration', label: { zh: 'Codex / Agent / MCP / 开源整合', en: 'Codex / agents / MCP / open-source integration' }, level: 'professional-proficiency', evidence: ['resume-formatter', 'xintiao'], note: { zh: '定位为设计自动化与原型协作，不改写为软件工程职位。', en: 'Positioned as design automation and prototype collaboration, not software-engineering employment.' } },
    ],
  },
  {
    id: 'global-research',
    title: { zh: '全球市场情报', en: 'Global market intelligence' },
    summary: { zh: '把跨市场竞品、消费者、趋势与文化研究转译为设计方向。', en: 'Translate cross-market competitor, consumer, trend and cultural research into design direction.' },
    items: [
      { id: 'market-research', label: { zh: '市场、消费者与竞品研究', en: 'Market, consumer & competitor research' }, level: 'professional-proficiency', evidence: ['ouyin'], note: { zh: '目前展示研究方法与用户反馈经验，尚无独立发布的全球市场案例。', en: 'Current evidence covers research methods and user feedback; no standalone global-market case is published yet.' } },
      { id: 'localization', label: { zh: '文化研究与设计本地化', en: 'Cultural research & localization' }, level: 'professional-proficiency', evidence: [], note: { zh: '作为可迁移方法保留，不预设任何国家的研究结论。', en: 'Kept as a transferable method without presetting conclusions for any market.' } },
      { id: 'research-quality', label: { zh: '来源分级、可追溯与设计含义', en: 'Source hierarchy, traceability & design implications' }, level: 'professional-proficiency', evidence: [], note: { zh: '方法参考国际市场研究质量原则，不声称 ISO 认证。', en: 'Informed by international market-research quality principles; no ISO certification is claimed.' } },
    ],
  },
  {
    id: 'delivery-systems',
    title: { zh: '交付与系统', en: 'Delivery & systems' },
    summary: { zh: '连接团队、版本、制造语境与公开交付边界。', en: 'Connect teams, versions, manufacturing context and delivery boundaries.' },
    items: [
      { id: 'coordination', label: { zh: '方向设计与团队协作', en: 'Direction & team collaboration' }, level: 'professional-proficiency', evidence: ['hermes', 'arcteryx', 'yelisi'], note: { zh: '案例支持方向分析、三维表达和团队协作语境；个人统筹人数与跨方责任按项目证据说明。', en: 'Cases support direction analysis, 3D presentation and team-collaboration context; individual team size and cross-party responsibility remain project-specific.' } },
      { id: 'manufacturing', label: { zh: '制造语境与质量意识', en: 'Manufacturing context & quality awareness' }, level: 'professional-proficiency', evidence: ['hermes', 'arcteryx', 'hannstar'], note: { zh: '案例支持制造语境、标准化与质量约束理解；不等同于个人工厂对接或工程签核。', en: 'Cases support understanding of manufacturing context, standardization and quality constraints; this does not equal individual factory liaison or engineering sign-off.' } },
      { id: 'documentation', label: { zh: '版本、来源与交付文档', en: 'Versioning, provenance & delivery docs' }, level: 'demonstrated-expertise', evidence: ['resume-formatter', 'lensflow', 'periastra'] },
      { id: 'supplier-review', label: { zh: '供应商样品与 CMF 审核', en: 'Supplier samples & CMF approval' }, level: 'professional-proficiency', evidence: [], note: { zh: '用户确认具备；当前公开档案未提供供应商或样品记录。', en: 'User-confirmed; supplier or sample records are not public in the current archive.' } },
    ],
  },
]

export const capabilityLevelLabel = (level: CapabilityLevel, lang: Lang) => level === 'demonstrated-expertise'
  ? lang === 'zh' ? 'Demonstrated Expertise / 精通' : 'Demonstrated Expertise'
  : lang === 'zh' ? 'Professional Proficiency / 熟练' : 'Professional Proficiency'

export const capabilityEvidenceLabel = (item: CapabilityItem, lang: Lang) => item.evidence.length
  ? `${item.evidence.length} ${lang === 'zh' ? '个案例' : item.evidence.length === 1 ? 'case' : 'cases'}`
  : lang === 'zh' ? '方法能力 / 证据待扩展' : 'Method / evidence in progress'

export const aiDesignWorkflow = [
  'Input',
  'Research',
  'Direction',
  'Generate',
  'Compare',
  'Edit',
  'Validate',
  'Deliver',
] as const

export const aiDesignWorkflowLabel = 'Input → Research → Direction → Generate → Compare → Edit → Validate → Deliver'
