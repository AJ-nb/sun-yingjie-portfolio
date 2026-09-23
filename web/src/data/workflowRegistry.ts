import { getProject, type Localized, type ProjectMaturity } from './projectRegistry'

export type WorkflowKind = 'lab' | 'tool' | 'research'

export interface WorkflowRegistryEntry {
  slug: string
  title: Localized
  kind: WorkflowKind
  purpose: Localized
  inputs: Localized<string[]>
  outputs: Localized<string[]>
  workflow: Localized<string[]>
  maturity: ProjectMaturity
  provenance: Localized
  sourceLinks: string[]
  assets: string[]
  public: boolean
  seo: { title: Localized; description: Localized; ogImage?: string; noindex: boolean }
}

const seeds: Array<Pick<WorkflowRegistryEntry, 'slug' | 'kind' | 'purpose' | 'inputs' | 'outputs' | 'workflow'>> = [
  {
    slug: 'lensflow',
    kind: 'tool',
    purpose: { zh: '把素材采集、结构化分析、提示词组织和生成任务连接为可继续编辑的创作工作台。', en: 'Connect material capture, structured analysis, prompt organization and generation into an editable creative workbench.' },
    inputs: { zh: ['参考图', '来源信息', '设计问题'], en: ['Reference image', 'Source context', 'Design question'] },
    outputs: { zh: ['结构化简报', '提示词变体', '可追溯素材记录'], en: ['Structured brief', 'Prompt variants', 'Traceable source record'] },
    workflow: { zh: ['采集并记录来源', '分析构图、材质与关系', '组织可编辑简报', '人工比较并提交生成任务'], en: ['Capture and record provenance', 'Analyze composition, material and relationships', 'Organize an editable brief', 'Compare and submit generation tasks by human review'] },
  },
  {
    slug: 'resume-formatter',
    kind: 'tool',
    purpose: { zh: '把简历母版、岗位版本、事实证据与版式导出放在同一工作区。', en: 'Keep the résumé master, role-specific variants, evidence and layout export in one workspace.' },
    inputs: { zh: ['简历事实', '岗位要求', '版式选择'], en: ['Résumé facts', 'Role requirements', 'Layout selection'] },
    outputs: { zh: ['岗位版本简历', '可打印 PDF', '事实检查结果'], en: ['Role-specific résumé', 'Print-ready PDF', 'Fact-check result'] },
    workflow: { zh: ['载入事实母版', '选择岗位重点', '编辑并检查证据', '导出并复核 PDF'], en: ['Load the factual master', 'Select role emphasis', 'Edit and check evidence', 'Export and review the PDF'] },
  },
  {
    slug: 'yantai',
    kind: 'lab',
    purpose: { zh: '从视觉参考中观察、拆解和迁移产品造型方法，再经人工确认归档。', en: 'Observe, deconstruct and transfer product-form methods from visual references before human review and filing.' },
    inputs: { zh: ['产品参考图', '造型关系', '练习目标'], en: ['Product reference', 'Form relationships', 'Exercise goal'] },
    outputs: { zh: ['比例观察', '造型练习', '研究记录'], en: ['Proportion observations', 'Form exercise', 'Study record'] },
    workflow: { zh: ['观察主体与轴线', '比较比例和重量', '提出一个关系保持练习', '保存结果并标注解释边界'], en: ['Observe the subject and axes', 'Compare proportion and visual weight', 'Propose one relationship-preserving exercise', 'Save the result with interpretation boundaries'] },
  },
  {
    slug: 'aesthetic-atlas',
    kind: 'research',
    purpose: { zh: '把视觉参考整理为可追溯的风格、结构和产品设计观察。', en: 'Organize visual references into traceable observations about style, structure and product design.' },
    inputs: { zh: ['参考图', '来源', '观察维度'], en: ['Reference image', 'Source', 'Observation axes'] },
    outputs: { zh: ['参考关系', '视觉标签', '研究笔记'], en: ['Reference relationships', 'Visual tags', 'Research notes'] },
    workflow: { zh: ['收集并保留来源', '按维度观察', '记录可证实与推测内容', '归档为后续设计参考'], en: ['Collect and retain provenance', 'Observe by defined axes', 'Separate evidence from interpretation', 'File the result for later design reference'] },
  },
  {
    slug: 'xhs-methods',
    kind: 'research',
    purpose: { zh: '研究产品事实、原创资产、生成候选与人工审阅之间的内容工作流。', en: 'Study the content workflow between product facts, original assets, generated candidates and human review.' },
    inputs: { zh: ['产品事实', '原创素材', '内容任务'], en: ['Product facts', 'Original assets', 'Content task'] },
    outputs: { zh: ['工作流假设', '评估记录', '待验证原型方向'], en: ['Workflow hypothesis', 'Evaluation record', 'Prototype direction to validate'] },
    workflow: { zh: ['整理事实与素材', '生成候选版本', '人工审核并保留证据', '记录失败与下一步'], en: ['Organize facts and assets', 'Generate candidate variants', 'Review by hand and retain evidence', 'Record failures and next steps'] },
  },
]

export const WORKFLOW_REGISTRY: readonly WorkflowRegistryEntry[] = seeds.map(seed => {
  const project = getProject(seed.slug)
  if (!project) throw new Error(`Workflow registry project is missing: ${seed.slug}`)
  return {
    ...seed,
    title: project.title,
    maturity: project.maturity,
    provenance: project.provenance,
    sourceLinks: [project.liveDemoUrl, project.githubUrl, project.researchUrl, project.externalUrl].filter((value): value is string => Boolean(value)),
    assets: [project.cover],
    public: project.availability === 'public' && project.visibility === 'public',
    seo: { title: project.seo.title, description: project.seo.description, ogImage: project.seo.ogImage, noindex: project.seo.noindex },
  }
})

export function getWorkflow(slug: string | undefined): WorkflowRegistryEntry | null {
  return WORKFLOW_REGISTRY.find(entry => entry.slug === slug) ?? null
}
