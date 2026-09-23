import type { Lang } from './workDocs'

export type ResearchConfidence = 'high' | 'medium' | 'low' | 'unverified'

export type SourceRegisterField =
  | 'market'
  | 'source'
  | 'publisher'
  | 'date'
  | 'sourceType'
  | 'claim'
  | 'confidence'
  | 'region'
  | 'method'
  | 'notes'

export interface ResearchStage {
  id: string
  label: { zh: string; en: string }
  purpose: { zh: string; en: string }
}

export const sourceRegisterFields: readonly SourceRegisterField[] = [
  'market', 'source', 'publisher', 'date', 'sourceType', 'claim', 'confidence', 'region', 'method', 'notes',
]

export const priorityMarkets = [
  'China', 'Japan', 'South Korea', 'United States', 'United Kingdom', 'Germany', 'France', 'Italy',
  'Nordics', 'Canada', 'Australia', 'India', 'Southeast Asia', 'Middle East', 'Latin America',
] as const

export const researchPipeline: readonly ResearchStage[] = [
  { id: 'question', label: { zh: '研究问题', en: 'Question' }, purpose: { zh: '先定义要做出的设计判断。', en: 'Define the design decision the research must support.' } },
  { id: 'market-definition', label: { zh: '市场定义', en: 'Market definition' }, purpose: { zh: '说明范围、优先市场与比较单位。', en: 'Set scope, priority markets and comparison units.' } },
  { id: 'source-plan', label: { zh: '来源计划', en: 'Source plan' }, purpose: { zh: '按来源层级规划可追溯材料。', en: 'Plan traceable evidence by source tier.' } },
  { id: 'collection-validation', label: { zh: '采集与验证', en: 'Collection & validation' }, purpose: { zh: '记录来源、日期、方法与置信度。', en: 'Record sources, dates, methods and confidence.' } },
  { id: 'comparison', label: { zh: '市场比较', en: 'Market comparison' }, purpose: { zh: '比较消费者、竞争、文化、渠道与约束。', en: 'Compare consumers, competition, culture, channels and constraints.' } },
  { id: 'implications', label: { zh: '设计含义', en: 'Design implications' }, purpose: { zh: '回答研究结论如何改变品牌、产品或体验。', en: 'State how findings change brand, product or experience decisions.' } },
]

export const researchSourceTiers = [
  { id: 'tier-1', label: { zh: '一级来源', en: 'Tier 1' }, examples: { zh: '政府、官方统计、监管机构、公司披露', en: 'Government, official statistics, regulators and company filings' } },
  { id: 'tier-2', label: { zh: '二级来源', en: 'Tier 2' }, examples: { zh: '研究机构、行业协会、学术研究', en: 'Research firms, industry associations and academic work' } },
  { id: 'tier-3', label: { zh: '三级来源', en: 'Tier 3' }, examples: { zh: '行业媒体与专业出版物', en: 'Industry media and professional publications' } },
  { id: 'tier-4', label: { zh: '四级来源', en: 'Tier 4' }, examples: { zh: '社区、社交平台与用户评论', en: 'Communities, social platforms and user reviews' } },
] as const

export const globalResearchBoundary: Record<Lang, string> = {
  zh: '当前公开档案只支持研究方法与用户反馈经验；尚无独立发布的全球市场案例，因此不预设任何市场结论。',
  en: 'The public archive currently supports research methods and user-feedback experience; no standalone global-market case is published, so no market conclusion is preset.',
}
