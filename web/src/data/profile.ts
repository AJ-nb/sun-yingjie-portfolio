import canonicalProfile from './profile.json'
import type { Lang } from './workDocs'

export const PROFILE_AS_OF = '2026.09'

export interface ProfileExperience {
  id: string
  period: string
  place: string
  role: string
  description: string
  details: string[]
  caseSlugs: string[]
}

export interface ProfileCapability {
  id: string
  title: string
  body: string
  tools: string[]
  caseSlugs: string[]
}

export interface ProfileMethod {
  id: string
  title: string
  body: string
  caseSlugs: string[]
}

export interface ProfileCopy {
  name: string
  position: string
  eyebrow: string
  title: string
  lead: string
  statement: string
  asOf: string
  narrative: string[]
  facts: { label: string; value: string }[]
  experience: ProfileExperience[]
  education: ProfileExperience
  practice: ProfileExperience
  capabilities: ProfileCapability[]
  methods: ProfileMethod[]
  principles: { id: string; title: string; body: string }[]
  collaboration: { title: string; body: string; items: string[] }
  contact: {
    title: string
    body: string
    email: string
    phone: string
    phoneDisplay: string
    portfolioUrl: string
    githubUrl: string
  }
}

function timelineEntry(id: string, lang: Lang, details: string[], caseSlugs: string[]): ProfileExperience {
  const entry = canonicalProfile.timeline.find(item => item.id === id)
  if (!entry) throw new Error(`Unknown canonical profile entry: ${id}`)
  const period = entry.end !== null
    ? entry.period[lang]
    : id === 'ai'
      ? lang === 'zh' ? `2026 — 持续实践 · 档案截至 ${PROFILE_AS_OF}` : `2026 — Ongoing practice · record as of ${PROFILE_AS_OF}`
      : lang === 'zh' ? `${entry.start.replace('-', '.')} 起在职 · 档案截至 ${PROFILE_AS_OF}` : `Since ${entry.start.replace('-', '.')} · employed as of ${PROFILE_AS_OF}`
  return { id, period, place: entry.place[lang], role: entry.role[lang], description: entry.description[lang], details, caseSlugs }
}

const contactFacts = {
  email: canonicalProfile.email,
  phone: canonicalProfile.phone,
  phoneDisplay: canonicalProfile.phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3'),
  portfolioUrl: canonicalProfile.url,
  githubUrl: 'https://github.com/AJ-nb',
}

export const profileCopy: Record<Lang, ProfileCopy> = {
  zh: {
    name: canonicalProfile.name.zh,
    position: canonicalProfile.position.zh,
    eyebrow: '关于我 / 工作与方法',
    title: '从物的形态，到人的体验。',
    lead: canonicalProfile.summary.zh,
    statement: '让形态有依据，让体验有回应，让设计走向交付。',
    asOf: `职业档案截至 ${PROFILE_AS_OF}`,
    narrative: [
      '我是孙英杰，产品设计本科毕业。我的工作从产品造型、三维与商业空间表达，延伸到品牌孵化和数字工具。这些领域的媒介不同，却共享一个问题：怎样把需求、形态和使用过程连接起来，让一个方案既能被看见，也能被理解和继续完善。',
      '产品设计训练让我习惯从角色与动作进入问题。引渡者将市政工人、市民和管理方放在同一服务关系中，再讨论机器人、基站与界面；HUHU CARE 从儿童、家长和医护人员的引导过程出发，组织吹嘴、握持区、气球与底座。它们是合作概念项目，展板、形态模型和部件图帮助说明提案，也提醒我把造型讨论与实际使用验证分开。',
      '在 BENWU 参与商业橱窗和灯具视觉工作时，设计对象进入了更大的空间。Hermès 与 Arc’teryx 橱窗需要同时考虑道具尺度、商品位置和观看层次；铝型材灯具则需要从一个截面理解台灯、落地灯、壁灯与吊灯的系列关系。三维表达因此不仅是制作一张完成图，也是讨论比例、材料与光线如何共同起作用的方法。',
      '在杭州理灵，我负责彼源 AI 整体视觉设计并辅助上线，同时推进 Periastra 与夜礼司品牌设计。我的重点是让定位、标志和应用形成系统：用方案对照明确方向，用信息层级组织入口，用版本与交付管理推动设计继续向前。',
      'AI 与数字产品是持续实践的一条线。镜序把参考采集、分析、可编辑简报和生成任务留在同一工作区；砚台把看图延伸为造型学习，再由人确认归档；Resume Formatter 在开源基础上组织简历母版、岗位版本与改写审阅。这些项目让我把设计判断写进界面状态、确认步骤和恢复路径，而不只停留在一张界面效果图。',
      '我希望持续参与能够连接品牌、产品与数字体验的工作：把问题整理清楚，把抽象方向变成可以讨论的图形、模型或界面，再通过对照和反馈继续调整。本作品集保留项目来源、合作署名与阶段信息；读者可以从个人叙述进入具体案例，也可以从案例返回能力和工作经历，了解这些判断从哪里来。',
    ],
    facts: [
      { label: '工作方向', value: canonicalProfile.position.zh },
      { label: '教育背景', value: `${canonicalProfile.timeline[0].place.zh} · 产品设计本科` },
      { label: '呈现方式', value: '产品与空间、品牌系统、可操作的数字界面' },
      { label: '档案日期', value: PROFILE_AS_OF },
    ],
    experience: [
      timelineEntry('liling', 'zh', [
        '负责彼源 AI 整体视觉设计并辅助上线，梳理品牌识别、官网层级与模型入口，让了解服务、选择模型和开始使用形成连贯路径。',
        '推进夜礼司与 Periastra 的品牌设计。Periastra 从 P 图形探索转向已采用的字体标志；夜礼司以中文私印与身体负形建立识别，持续整理应用规则。',
        '承担设计方向整理、方案比较、版本管理与交付协调，把品牌判断落实到页面和应用载体。',
      ], ['biyuan', 'yelisi', 'periastra']),
      timelineEntry('benwu', 'zh', [
        '作为 3D 设计师，参与 Hermès 季节橱窗与 Arc’teryx Alpha Center 橱窗的三维设计和视觉呈现，围绕道具比例、商品位置、空间层次及材质灯光开展团队协作。',
        '参与铝型材灯具系列的造型与场景表达，以单体、细部和室内视图说明线性发光面、金属槽道、支撑方式与空间尺度。',
        '作品中的橱窗与灯具保持团队署名；不同视角用来呈现设计关系，工程性能和施工结果以相应证据为准。',
      ], ['hermes', 'arcteryx', 'lighting', 'rendering-studies']),
      timelineEntry('ouyin', 'zh', [
        '参与市场调研和用户反馈整理，协助把分散的需求归纳为可以讨论的问题与体验方向。',
        '参与 Figma 交互原型设计，使页面关系和操作步骤能够被团队比较与迭代。',
      ], []),
    ],
    education: timelineEntry('education', 'zh', [
      '学习产品设计方法、材料与加工工艺、人机工程学、结构设计和工程制图，建立从使用情境到造型、部件与表达的基础。',
      '作品集中保留引渡者与 HUHU CARE 等合作概念项目，以角色旅程、草图、形态模型、结构示意和渲染说明不同阶段的设计思考。',
    ], ['plumber', 'huhu-care']),
    practice: timelineEntry('ai', 'zh', [
      '镜序关注采集、分析、简报编辑和任务结果之间的连续性；砚台关注视觉观察、造型解释、迁移练习和人工确认归档。两者分别展开创作工作流与设计学习路径。',
      '在 Resume Formatter 的开源二次开发中探索母版与岗位版关系、选区改写、差异确认和可撤销编辑；薪跳以原生微信小程序页面组织首次设置、今日金额与日历回看，保留上游归属。',
      '构线把几何构造与光学校正分别保存，借助 Geometry、Final 和 X-Ray 视图帮助比较规则与观感。这些数字项目包含共同创作、AI 辅助实现与开源组件，具体范围在案例中说明。',
    ], ['lensflow', 'yantai', 'resume-formatter', 'xintiao', 'formline']),
    capabilities: [
      {
        id: 'product-system', title: '产品形态与使用关系',
        body: '将角色、动作、部件与场景放在一起讨论。引渡者连接机器人、基站和服务流程，HUHU CARE 连接儿童引导、握持与反馈；通过草图、模型和部件图，让造型背后的使用设想可被理解。',
        tools: ['Rhino', 'SolidWorks', '角色旅程', '结构示意'], caseSlugs: ['plumber', 'huhu-care'],
      },
      {
        id: 'spatial-visualization', title: '三维、材料与空间表达',
        body: '围绕比例、构图、材料和灯光组织三维视觉。在商业橱窗中处理道具与商品的主次，在灯具系列中比较单体、细部与室内尺度，使画面能承担具体的设计讨论。',
        tools: ['KeyShot', 'Cinema 4D', 'Blender', '材质与灯光'], caseSlugs: ['hermes', 'arcteryx', 'lighting', 'rendering-studies'],
      },
      {
        id: 'brand-systems', title: '品牌图形与应用规则',
        body: '从定位与图形母题出发，比较轮廓、线宽、负形和载体中的识别顺序。Periastra 从符号探索收束到字体标志；彼源把品牌语言延伸至网站的信息组织与操作入口。',
        tools: ['图形研究', '应用系统', 'Figma'], caseSlugs: ['periastra', 'yelisi', 'biyuan'],
      },
      {
        id: 'interaction', title: '交互原型与界面实现',
        body: '把信息关系落实到输入、预览、确认和返回。Resume Formatter 让编辑与真实排版预览相邻，薪跳让首次设置与日历回看各有清楚的入口；同时考虑桌面、移动端与页面状态的变化。',
        tools: ['Figma', 'React / TypeScript', '原生微信小程序'], caseSlugs: ['resume-formatter', 'xintiao', 'formline'],
      },
      {
        id: 'ai-workflows', title: 'AI 工作流与人工判断',
        body: '把模型能力接入可编辑、可复核的流程。镜序保留参考关系与任务位置，砚台区分图像观察和解释，简历工具让改写先进入差异审阅；重点是使用者能够理解输入并决定下一步。',
        tools: ['需求拆解', '结构化输出', '提示词组织', '人工确认'], caseSlugs: ['lensflow', 'yantai', 'resume-formatter'],
      },
      {
        id: 'review-delivery', title: '版本、来源与交付组织',
        body: '将项目阶段、协作归属、输入来源和交付内容一起整理。数字工具的本地保存、版本比较与导出路径，让修改能够继续；案例中的原稿、界面记录与来源说明，让设计过程能够被复核。',
        tools: ['GitHub', '版本管理', '来源记录', '导出与交付'], caseSlugs: ['resume-formatter', 'lensflow', 'formline'],
      },
    ],
    methods: [
      {
        id: 'frame', title: '01 / 先确认谁在使用',
        body: '先梳理参与者、目标和动作，找出需要被解决的具体关系。HUHU CARE 区分儿童、家长与医护，引渡者区分专业作业和公众参与；产品形态与页面结构从这些关系继续展开。',
        caseSlugs: ['huhu-care', 'plumber'],
      },
      {
        id: 'observe', title: '02 / 把判断放回可见依据',
        body: '从轮廓、轴线、比例、接触位置和层级中提出问题。灯具系列用共同截面比较不同单体；砚台把观察指向图像位置，再讨论可能的作用与迁移方法。',
        caseSlugs: ['lighting', 'yantai'],
      },
      {
        id: 'compare', title: '03 / 用对照推动选择',
        body: '让不同方案、尺度或状态能够并列比较。Periastra 对照图形线宽与负形，构线切换几何、最终和 X-Ray 视图，简历工具将原文与改写差异交给使用者审阅。',
        caseSlugs: ['periastra', 'formline', 'resume-formatter'],
      },
      {
        id: 'respond', title: '04 / 给每个动作明确回应',
        body: '设计输入之后发生什么，也设计等待、失败和返回。镜序按结果位置保留任务，简历工具提供应用、丢弃与撤销；一个流程需要解释当前状态，并给使用者可继续的路径。',
        caseSlugs: ['lensflow', 'resume-formatter', 'xintiao'],
      },
      {
        id: 'handover', title: '05 / 让结果能被继续使用',
        body: '整理交付格式、版本和来源，让成果进入下一次工作。构线区分最终图与构造图的导出，砚台在确认后归档，简历工具区分投递文件与工作区备份。',
        caseSlugs: ['formline', 'yantai', 'resume-formatter'],
      },
    ],
    principles: [
      { id: 'reason', title: '外观需要有理由', body: '用比例、使用动作、识别顺序和材料关系解释造型。视觉表达越完整，越需要让人看清它在回应什么问题。' },
      { id: 'agency', title: '自动化保留人的选择', body: '让分析可以编辑，让改写可以审阅，让操作可以返回。AI 进入流程之后，确认与判断仍应有清楚的位置。' },
      { id: 'evidence', title: '把作品的来路说清楚', body: '保留合作署名、开源来源和项目阶段；区分概念、界面记录与实际验证，使读者能够理解每一项成果的范围。' },
    ],
    collaboration: {
      title: '从一个具体问题开始合作。',
      body: '如果你的工作涉及品牌与产品的连接、三维和空间表达，或希望把复杂流程变成更清楚的数字体验，可以先从使用对象、现有材料与交付目标展开。',
      items: ['品牌研究、图形规则与应用表达', '产品概念、三维视觉与空间呈现', '交互原型、数字界面与 AI 工作流'],
    },
    contact: {
      ...contactFacts,
      title: '聊聊你正在推进的项目。',
      body: '邮件中可以附上项目背景、希望解决的问题、已有资料与预期时间；具体范围、分工和交付方式可据此继续讨论。',
    },
  },
  en: {
    name: canonicalProfile.name.en,
    position: canonicalProfile.position.en,
    eyebrow: 'About / Work & approach',
    title: 'From the form of things to the experience of people.',
    lead: canonicalProfile.summary.en,
    statement: 'Give form a reason, actions a response and outcomes a basis for review.',
    asOf: `Professional record as of ${PROFILE_AS_OF}`,
    narrative: [
      'I am Yingjie Sun, a product design graduate. My work extends from product form, 3D visualization and commercial spaces to brand incubation and digital tools. Across these media, I return to one question: how can needs, form and use connect so that a proposal can be seen, understood and developed further?',
      'Product design training taught me to begin with people and actions. Plumber connects municipal workers, residents and operators before considering the robot, station and interface. HUHU CARE organizes the mouthpiece, grip, balloon and base around guidance between children, parents and clinical staff. These collaborative concepts use boards, form models and component drawings to communicate proposals while keeping form exploration separate from validation in use.',
      'At BENWU, window displays and lighting placed the object within a larger space. Work for Hermès and Arc’teryx involved prop scale, merchandise placement and viewing layers. Aluminum lighting explored a shared profile across table, floor, wall and pendant formats. Visualization became a way to discuss proportion, materials and light as well as produce a finished image.',
      'At Hangzhou Liling, I was responsible for Biyuan AI’s overall visual design and supported its launch, while advancing Periastra and Yelisi branding. I connect positioning, identity and applications through direction comparisons, clear information hierarchy, version control and delivery coordination.',
      'AI and digital products form an ongoing practice. Lensflow keeps reference collection, analysis, editable briefs and generation tasks in one workspace. Yantai turns image collection into form study before a person confirms archiving. Built on an open-source project, Resume Formatter connects a master résumé, job-specific versions and rewrite review. These projects put design decisions into interface states, confirmation steps and recovery paths.',
      'I want to continue working where brand, product and digital experience meet: clarify a problem, turn a direction into a graphic, model or interface that can be discussed, then revise it through comparison and feedback. This portfolio retains sources, collaborators and project stages. Readers can follow the narrative into individual cases, or return from a case to the capabilities and experience behind it.',
    ],
    facts: [
      { label: 'Focus', value: canonicalProfile.position.en },
      { label: 'Education', value: `${canonicalProfile.timeline[0].place.en} · Product Design` },
      { label: 'Mediums', value: 'Products and spaces, identities, working digital interfaces' },
      { label: 'Record date', value: PROFILE_AS_OF },
    ],
    experience: [
      timelineEntry('liling', 'en', [
        'Responsible for Biyuan AI’s overall visual design and launch support, connecting identity, website hierarchy and model entry points into a coherent path from understanding to use.',
        'Advanced Yelisi and Periastra brand design. Periastra moved from P-symbol explorations to its adopted wordmark; Yelisi connects a Chinese seal and bodily negative space with application rules.',
        'Organized design directions, compared alternatives, managed versions and coordinated delivery across website and brand applications.',
      ], ['biyuan', 'yelisi', 'periastra']),
      timelineEntry('benwu', 'en', [
        'As a 3D designer, contributed to Hermès seasonal windows and Arc’teryx Alpha Center windows through 3D design and visualization, working with the team on props, merchandise placement, spatial layers, materials and light.',
        'Contributed to form and scene visualization for aluminum lighting. Individual objects, details and interior views communicate the relationship between linear luminous surfaces, metal channels, supports and spatial scale.',
        'The window and lighting cases retain team credit. Views explain design relationships; engineering performance and construction outcomes require their own supporting records.',
      ], ['hermes', 'arcteryx', 'lighting', 'rendering-studies']),
      timelineEntry('ouyin', 'en', [
        'Contributed to market research and user feedback synthesis, helping turn scattered requirements into questions and directions the team could discuss.',
        'Contributed to Figma interaction prototypes so that page relationships and action sequences could be compared and revised.',
      ], []),
    ],
    education: timelineEntry('education', 'en', [
      'Studied product design methods, materials and manufacturing processes, ergonomics, structural design and engineering drawing, building a foundation from use contexts to form, components and communication.',
      'The portfolio retains collaborative concepts including Plumber and HUHU CARE, using role journeys, sketches, form models, structural diagrams and renders to explain decisions at different stages.',
    ], ['plumber', 'huhu-care']),
    practice: timelineEntry('ai', 'en', [
      'Lensflow focuses on continuity between collection, analysis, brief editing and task results. Yantai focuses on visual observation, form explanation, transfer exercises and confirmed archiving. They address creative workflows and design learning respectively.',
      'Open-source development of Resume Formatter explores master and job-specific versions, selected-text rewriting, difference review and undo. Xintiao uses native WeChat pages for onboarding, today’s amount and calendar review while retaining upstream attribution.',
      'Formline stores geometric construction separately from optical correction and compares rules with appearance through Geometry, Final and X-Ray. These projects include collaborative work, AI-assisted implementation and open-source components, with the scope described in each case.',
    ], ['lensflow', 'yantai', 'resume-formatter', 'xintiao', 'formline']),
    capabilities: [
      {
        id: 'product-system', title: 'Product form and use',
        body: 'Discuss people, actions, components and settings together. Plumber connects a robot, station and service sequence; HUHU CARE connects guidance, grip and feedback. Sketches, models and component drawings make the intended use behind the form understandable.',
        tools: ['Rhino', 'SolidWorks', 'Role journeys', 'Structural diagrams'], caseSlugs: ['plumber', 'huhu-care'],
      },
      {
        id: 'spatial-visualization', title: '3D, materials and space',
        body: 'Organize visualization around proportion, composition, materials and light. Window displays establish a hierarchy between props and merchandise; lighting views compare objects, details and interior scale so that images support specific design discussions.',
        tools: ['KeyShot', 'Cinema 4D', 'Blender', 'Materials and lighting'], caseSlugs: ['hermes', 'arcteryx', 'lighting', 'rendering-studies'],
      },
      {
        id: 'brand-systems', title: 'Identity and application rules',
        body: 'Start with positioning and a graphic motif, then compare contour, stroke, negative space and reading order across applications. Periastra evolves from symbol exploration to a distinctive wordmark; Biyuan extends its identity into website information and actions.',
        tools: ['Graphic research', 'Application systems', 'Figma'], caseSlugs: ['periastra', 'yelisi', 'biyuan'],
      },
      {
        id: 'interaction', title: 'Interaction and interface implementation',
        body: 'Turn information relationships into input, preview, confirmation and return paths. Resume Formatter places editing beside the actual layout preview; Xintiao gives onboarding and calendar review clear entries. Desktop, mobile and state changes are part of the same work.',
        tools: ['Figma', 'React / TypeScript', 'Native WeChat mini-programs'], caseSlugs: ['resume-formatter', 'xintiao', 'formline'],
      },
      {
        id: 'ai-workflows', title: 'AI workflows and human judgment',
        body: 'Place model capabilities within editable, reviewable workflows. Lensflow retains references and task positions, Yantai separates observation from interpretation, and résumé rewriting begins with a difference review. Users should understand the input and choose what follows.',
        tools: ['Requirement decomposition', 'Structured outputs', 'Prompt organization', 'Human confirmation'], caseSlugs: ['lensflow', 'yantai', 'resume-formatter'],
      },
      {
        id: 'review-delivery', title: 'Versions, sources and handover',
        body: 'Organize stages, collaborators, input sources and deliverables together. Local saving, version comparison and export paths keep digital work usable. Original boards, interface records and source notes make the design process available for review.',
        tools: ['GitHub', 'Version management', 'Source records', 'Export and delivery'], caseSlugs: ['resume-formatter', 'lensflow', 'formline'],
      },
    ],
    methods: [
      { id: 'frame', title: '01 / Establish who uses it', body: 'Map people, goals and actions to identify the relationship that needs attention. HUHU CARE distinguishes children, parents and clinical staff; Plumber distinguishes professional operations from public participation. Form and interface structure develop from these relationships.', caseSlugs: ['huhu-care', 'plumber'] },
      { id: 'observe', title: '02 / Ground a judgment in what is visible', body: 'Ask questions through contours, axes, proportions, contact points and hierarchy. The lighting family compares objects through a shared profile. Yantai links an observation to an image location before discussing possible effects and transfer methods.', caseSlugs: ['lighting', 'yantai'] },
      { id: 'compare', title: '03 / Make options comparable', body: 'Compare alternatives, scales and states. Periastra examines stroke weight and negative space, Formline switches between Geometry, Final and X-Ray, and résumé rewriting puts original text and proposed changes in front of the user.', caseSlugs: ['periastra', 'formline', 'resume-formatter'] },
      { id: 'respond', title: '04 / Give actions a clear response', body: 'Design what follows input, including waiting, failure and returning. Lensflow retains individual task results; Resume Formatter offers apply, discard and undo. A workflow should explain its present state and provide a way to continue.', caseSlugs: ['lensflow', 'resume-formatter', 'xintiao'] },
      { id: 'handover', title: '05 / Prepare the result for its next use', body: 'Organize formats, versions and sources for subsequent work. Formline separates final and construction exports, Yantai archives after confirmation, and Resume Formatter distinguishes an application file from a workspace backup.', caseSlugs: ['formline', 'yantai', 'resume-formatter'] },
    ],
    principles: [
      { id: 'reason', title: 'Form needs a reason', body: 'Explain form through proportion, actions, reading order and material relationships. A polished visual should also reveal the question it responds to.' },
      { id: 'agency', title: 'Automation preserves a choice', body: 'Make analysis editable, changes reviewable and actions reversible. Confirmation and judgment need clear places within an AI-assisted workflow.' },
      { id: 'evidence', title: 'Show where the work comes from', body: 'Retain collaborators, open-source attribution and project stages. Distinguish concepts, interface records and validation so readers can understand the scope of each outcome.' },
    ],
    collaboration: {
      title: 'Begin with a specific problem.',
      body: 'For work connecting brand and product, 3D and spatial communication, or complex processes and clearer digital experiences, a useful starting point is the intended user, the existing material and the delivery goal.',
      items: ['Brand research, graphic rules and applications', 'Product concepts, 3D visualization and spaces', 'Interaction prototypes, digital interfaces and AI workflows'],
    },
    contact: {
      ...contactFacts,
      title: 'Tell me about the project you are developing.',
      body: 'An email can include the background, the problem to address, existing material and an expected timeline. Scope, responsibilities and deliverables can then be discussed in context.',
    },
  },
}
