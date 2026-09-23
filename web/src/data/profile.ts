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
  const period = id === 'ai'
    ? lang === 'zh' ? `2026 — 持续实践 · 档案截至 ${PROFILE_AS_OF}` : `2026 — Ongoing practice · record as of ${PROFILE_AS_OF}`
    : entry.period[lang]
  return { id, period, place: entry.place[lang], role: entry.role[lang], description: entry.description[lang], details, caseSlugs }
}

const contactFacts = {
  email: canonicalProfile.email,
  phone: canonicalProfile.phone,
  phoneDisplay: canonicalProfile.phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3'),
  portfolioUrl: canonicalProfile.url,
  githubUrl: 'https://github.com/AJ-nb',
}

const editorial = {
  "zh": {
    "eyebrow": "关于我 / 工业与产品设计",
    "educationDetails": [
      "产品设计方法、材料与加工工艺、人机工程学、结构表达与工程制图。",
      "以引渡者、HUHU CARE、GO GLOW 等合作概念，连接角色旅程、形态、模型与界面。"
    ],
    "practiceDetails": [
      "独立 AI 视频研究：整理六层控制方法与八项参考分析，连接分镜、Blender 白模与渲染审阅。AI 辅助生成，人负责判断；未声称商业部署或上游成果。",
      "以 Resume Formatter 的母版与岗位版本、差异审阅和撤销，实践可控的内容改写；它是 MIT 上游 fork，不主张从零原创。"
    ],
    "capabilities": [
      {
        "id": "brand-systems",
        "title": "品牌系统与 VI/UI",
        "body": "将品牌定位转化为标志、字体、色彩、图形及应用规则。Periastra 以字体标志建立识别；夜礼司把品牌视觉连接到产品概念；彼源将 VI 延伸至数字产品的界面与操作入口。",
        "tools": [
          "Adobe Photoshop",
          "Adobe Illustrator",
          "Figma",
          "应用规则"
        ],
        "caseSlugs": [
          "biyuan",
          "periastra",
          "yelisi"
        ]
      },
      {
        "id": "product-system",
        "title": "产品设计与 CMF",
        "body": "从使用者、操作动作和收纳场景定义产品要求，通过草图、形态模型、部件关系与 CMF 比较方案。让外观选择对应具体的使用与结构条件。",
        "tools": [
          "Rhino",
          "SolidWorks",
          "场景与部件",
          "CMF"
        ],
        "caseSlugs": [
          "lighting",
          "huhu-care",
          "go-glow",
          "plumber",
          "yelisi"
        ]
      },
      {
        "id": "spatial-visualization",
        "title": "三维与商业空间",
        "body": "围绕商品展示建立空间层级，以尺度、材质、光线和视线关系比较方案。通过整体设计稿与三维表达，把品牌意图、制作语境和展示要求组织成可评审的空间方案。",
        "tools": [
          "Cinema 4D",
          "KeyShot",
          "Blender",
          "材质与灯光"
        ],
        "caseSlugs": [
          "hermes",
          "arcteryx",
          "lighting"
        ]
      },
      {
        "id": "engineering-system",
        "title": "制造与工程系统",
        "body": "在 PCB 制造语境中理解标准化、工程约束、质量要求与跨部门协同。公开表达聚焦方法变化与设计交接，不展示客户板件、Gerber、内部 SOP 或工艺参数。",
        "tools": [
          "标准化",
          "工程约束",
          "质量意识",
          "设计交接"
        ],
        "caseSlugs": []
      },
      {
        "id": "interaction",
        "title": "交互与界面实现",
        "body": "将复杂任务拆解为输入、比较、确认与后续操作，组织信息层级和状态反馈。主流程之外，处理空状态、等待、错误、撤销与返回，衔接原型和界面实现。",
        "tools": [
          "Figma",
          "React / TypeScript",
          "原生微信小程序",
          "状态设计"
        ],
        "caseSlugs": [
          "biyuan",
          "resume-formatter",
          "xintiao",
          "formline"
        ]
      },
      {
        "id": "ai-workflows",
        "title": "AIGC 与开源工作流",
        "body": "以 ChatGPT 组织参考分析与简报，用 Midjourney、ComfyUI 进行图像方向探索、提示词与节点工作流编排，并结合 Photoshop 修整输出。通过 Codex 辅助原型与界面实现；独立 AI 视频研究将故事、分镜、Blender 白模、提示词与渲染评估组织为可复核流程。",
        "tools": [
          "Codex",
          "ComfyUI",
          "ChatGPT",
          "Midjourney",
          "提示词与工作流复用"
        ],
        "caseSlugs": [
          "lensflow",
          "yantai",
          "resume-formatter",
          "ai-video-systems"
        ]
      },
      {
        "id": "review-delivery",
        "title": "项目统筹与交付",
        "body": "主导方向研究、整体方案与团队协作，以版本、导出与恢复支持持续迭代，并把设计判断清楚地连接到可交付的表达。",
        "tools": [
          "团队协作",
          "方案评审",
          "制作语境分析",
          "版本与交接"
        ],
        "caseSlugs": [
          "hermes",
          "arcteryx",
          "yelisi",
          "resume-formatter"
        ]
      }
    ],
    "methods": [
      {
        "id": "frame",
        "title": "01 / 定义问题与约束",
        "body": "梳理目标、参与者、使用场景与交付条件，区分品牌表达、商品展示和操作体验的具体问题，明确方案的优先级与约束。",
        "caseSlugs": [
          "hermes",
          "huhu-care",
          "biyuan"
        ]
      },
      {
        "id": "observe",
        "title": "02 / 建立判断依据",
        "body": "将抽象要求转为比例、轮廓、层级、触点与操作动作，用图形、模型和原型定位问题，让讨论围绕具体方案展开。",
        "caseSlugs": [
          "arcteryx",
          "lighting",
          "yelisi"
        ]
      },
      {
        "id": "compare",
        "title": "03 / 比较，再收束",
        "body": "对照目标比较备选方向、尺寸与操作状态，说明每个选择解决的问题及保留的限制，再将采用方案整理为一致的规则。",
        "caseSlugs": [
          "periastra",
          "formline",
          "resume-formatter"
        ]
      },
      {
        "id": "respond",
        "title": "04 / 连接设计与实施",
        "body": "将方向落实为整体设计稿、模型或原型，组织评审与修改。商业项目以生产与展示语境为约束，数字项目以界面实现与状态反馈为约束。",
        "caseSlugs": [
          "hermes",
          "arcteryx",
          "biyuan"
        ]
      },
      {
        "id": "handover",
        "title": "05 / 形成下一次工作的起点",
        "body": "整理版本、应用规则、组件与可编辑文件，记录修改理由与待解决事项，使后续应用和迭代能够沿用已有判断。",
        "caseSlugs": [
          "yelisi",
          "resume-formatter",
          "lensflow"
        ]
      }
    ],
    "principles": [
      {
        "id": "reason",
        "title": "把判断说具体",
        "body": "用比例、材料、阅读顺序与操作状态解释设计，使方案可以讨论，也可以修改。"
      },
      {
        "id": "agency",
        "title": "把媒介连起来",
        "body": "品牌、产品、空间与界面共用目标，在每种载体中重新组织表达。"
      },
      {
        "id": "evidence",
        "title": "把交付想在前面",
        "body": "方向稿要能进入团队协作，规范要能被继续使用，成果要有清楚的版本与归属。"
      }
    ],
    "collaboration": {
      "title": "从问题到可审阅交付，一起把设计推进。",
      "body": "适合品牌视觉、产品设计与数字体验工作，也关注需要跨团队、跨媒介协同的项目。",
      "items": [
        "品牌与 VI/UI 系统",
        "产品、CMF 与三维表达",
        "设计方向、团队协作与交付边界"
      ]
    },
    "contactTitle": "聊聊下一项设计工作。",
    "contactBody": "欢迎提供项目背景、目标、已有资料与时间安排。"
  },
  "en": {
    "eyebrow": "About / Industrial & Product Design",
    "educationDetails": [
      "Product design methods, materials and manufacturing processes, ergonomics, structural communication and engineering drawing.",
      "Collaborative concepts including Plumber, HUHU CARE and GO GLOW connect role journeys, form, models and interfaces."
    ],
    "practiceDetails": [
      "Independent AI-video research: six control layers and eight reference analyses linked to storyboard, Blender blocking and render review. Human-led judgment; no commercial or upstream results claimed.",
      "Resume Formatter explores master and job-specific versions, diff review and undo in a controlled editing flow; it is an MIT upstream fork rather than a from-scratch original."
    ],
    "capabilities": [
      {
        "id": "brand-systems",
        "title": "Brand systems & VI/UI",
        "body": "Translate positioning into logos, typography, color, graphics and application rules. Periastra centers its identity on a wordmark; Yelisi connects brand and product direction; Biyuan extends its VI into digital interfaces and actions.",
        "tools": [
          "Adobe Photoshop",
          "Adobe Illustrator",
          "Figma",
          "Application rules"
        ],
        "caseSlugs": [
          "biyuan",
          "periastra",
          "yelisi"
        ]
      },
      {
        "id": "product-system",
        "title": "Product design & CMF",
        "body": "Define product requirements through users, actions and storage scenarios. Compare proposals using sketches, form models, component relationships and CMF, linking appearance to specific use and structural conditions.",
        "tools": [
          "Rhino",
          "SolidWorks",
          "Scenarios & components",
          "CMF"
        ],
        "caseSlugs": [
          "lighting",
          "huhu-care",
          "go-glow",
          "plumber",
          "yelisi"
        ]
      },
      {
        "id": "spatial-visualization",
        "title": "3D & commercial space",
        "body": "Build spatial hierarchy around merchandise, comparing scale, materials, light and sightlines. Use overall design proposals and 3D visualization to align brand intent, production discussions and display requirements.",
        "tools": [
          "Cinema 4D",
          "KeyShot",
          "Blender",
          "Materials & light"
        ],
        "caseSlugs": [
          "hermes",
          "arcteryx",
          "lighting"
        ]
      },
      {
        "id": "engineering-system",
        "title": "Manufacturing & engineering systems",
        "body": "Work within PCB manufacturing clarified how standardization, engineering constraints, quality requirements and cross-functional coordination shape design. Public material focuses on method and handoff without exposing customer boards, Gerber files, internal SOPs or process parameters.",
        "tools": [
          "Standardization",
          "Engineering constraints",
          "Quality awareness",
          "Design handoff"
        ],
        "caseSlugs": []
      },
      {
        "id": "interaction",
        "title": "Interaction & implementation",
        "body": "Break complex tasks into input, comparison, confirmation and next actions, supported by information hierarchy and feedback. Design empty, loading, error, undo and return states alongside the main flow, connecting prototypes with implementation.",
        "tools": [
          "Figma",
          "React / TypeScript",
          "Native WeChat mini-programs",
          "State design"
        ],
        "caseSlugs": [
          "biyuan",
          "resume-formatter",
          "xintiao",
          "formline"
        ]
      },
      {
        "id": "ai-workflows",
        "title": "AIGC & open-source workflows",
        "body": "Use ChatGPT for reference analysis and briefs, Midjourney and ComfyUI for visual exploration, prompts and node workflows, and Photoshop for output refinement. Use Codex to support prototypes and interface implementation; an independent AI-video study organizes story, storyboard, Blender blocking, prompts and render evaluation into a reviewable workflow.",
        "tools": [
          "Codex",
          "ComfyUI",
          "ChatGPT",
          "Midjourney",
          "Reusable prompts & workflows"
        ],
        "caseSlugs": [
          "lensflow",
          "yantai",
          "resume-formatter",
          "ai-video-systems"
        ]
      },
      {
        "id": "review-delivery",
        "title": "Project coordination & delivery",
        "body": "Contribute to direction studies, overall proposals and team collaboration within the documented evidence boundary, keeping production, launch and commercial outcomes marked for verification. Digital projects support iteration through versions, exports and recovery.",
        "tools": [
          "Team coordination",
          "Cross-party review",
          "Production context",
          "Version & handoff"
        ],
        "caseSlugs": [
          "hermes",
          "arcteryx",
          "yelisi",
          "resume-formatter"
        ]
      }
    ],
    "methods": [
      {
        "id": "frame",
        "title": "01 / Define the problem and constraints",
        "body": "Map objectives, participants, use scenarios and delivery conditions. Separate questions of brand expression, merchandise display and interaction to establish priorities and constraints.",
        "caseSlugs": [
          "hermes",
          "huhu-care",
          "biyuan"
        ]
      },
      {
        "id": "observe",
        "title": "02 / Establish a basis for judgment",
        "body": "Translate abstract requirements into proportion, contour, hierarchy, touchpoints and actions. Use graphics, models and prototypes to locate issues and ground discussion in a concrete proposal.",
        "caseSlugs": [
          "arcteryx",
          "lighting",
          "yelisi"
        ]
      },
      {
        "id": "compare",
        "title": "03 / Compare, then converge",
        "body": "Compare alternatives, scales and interaction states against the objectives. Explain what each choice resolves and which constraints remain, then organize the adopted direction into consistent rules.",
        "caseSlugs": [
          "periastra",
          "formline",
          "resume-formatter"
        ]
      },
      {
        "id": "respond",
        "title": "04 / Connect design with implementation",
        "body": "Develop direction into overall proposals, models or prototypes, then participate in review and revision. Analyze commercial projects against production and display context, and connect digital projects with interface implementation and feedback; personal site delivery remains case-specific.",
        "caseSlugs": [
          "hermes",
          "arcteryx",
          "biyuan"
        ]
      },
      {
        "id": "handover",
        "title": "05 / Prepare the next use",
        "body": "Organize versions, application rules, components and editable files. Record reasons for changes and open issues so later applications and iterations can build on previous decisions.",
        "caseSlugs": [
          "yelisi",
          "resume-formatter",
          "lensflow"
        ]
      }
    ],
    "principles": [
      {
        "id": "reason",
        "title": "Make judgments specific",
        "body": "Explain design through proportion, materials, reading order and states so proposals can be discussed and revised."
      },
      {
        "id": "agency",
        "title": "Connect the media",
        "body": "Identity, product, space and interface share a goal, with expression reorganized for each medium."
      },
      {
        "id": "evidence",
        "title": "Plan for delivery",
        "body": "Proposals support collaboration, guidelines remain reusable, and outcomes retain clear versions and credit."
      }
    ],
    "collaboration": {
      "title": "Move the design from problem to a reviewable result.",
      "body": "Open to brand, product and digital experience work, including projects requiring collaboration across teams and media.",
      "items": [
        "Brand and VI/UI systems",
        "Product, CMF and 3D visualization",
        "Design direction, team collaboration and evidence-bounded handoff"
      ]
    },
    "contactTitle": "Let’s discuss the next design project.",
    "contactBody": "Share the background, objectives, existing material and expected timing."
  }
}

function makeProfile(lang: Lang): ProfileCopy {
  const copy = editorial[lang]
  const zh = lang === 'zh'
  const details = canonicalProfile.resume.experienceLocalized[lang]
  return {
    name: canonicalProfile.name[lang],
    position: canonicalProfile.position[lang],
    eyebrow: copy.eyebrow,
    title: zh ? '从形态到系统。' : 'From form to system.',
    lead: canonicalProfile.summary[lang],
    statement: canonicalProfile.summary[lang],
    asOf: zh ? `职业档案截至 ${PROFILE_AS_OF}` : `Professional record as of ${PROFILE_AS_OF}`,
    narrative: canonicalProfile.about[lang],
    facts: [
      { label: zh ? '工作方向' : 'Focus', value: canonicalProfile.headline[lang] },
      { label: zh ? '教育背景' : 'Education', value: `${canonicalProfile.timeline[0].place[lang]} · ${zh ? '产品设计本科' : 'Product Design'}` },
      { label: zh ? '项目责任' : 'Responsibility', value: zh ? '方向设计、团队协作与交付边界' : 'Direction, team collaboration & delivery boundaries' },
      { label: zh ? '档案日期' : 'Record date', value: PROFILE_AS_OF },
    ],
    experience: [
      timelineEntry('liling', lang, details.liling, ['yelisi', 'biyuan', 'periastra']),
      timelineEntry('hannstar', lang, details.hannstar, []),
      timelineEntry('benwu', lang, details.benwu, ['hermes', 'arcteryx', 'lighting']),
      timelineEntry('ouyin', lang, details.ouyin, []),
    ],
    education: timelineEntry('education', lang, copy.educationDetails, ['plumber', 'huhu-care', 'go-glow']),
    practice: timelineEntry('ai', lang, copy.practiceDetails, ['ai-video-systems', 'resume-formatter', 'lensflow', 'formline', 'xintiao']),
    capabilities: [copy.capabilities.find(item => item.id === 'product-system') ?? copy.capabilities[1], copy.capabilities[0], copy.capabilities.find(item => item.id.includes('ai')) ?? copy.capabilities[copy.capabilities.length - 1]],
    methods: copy.methods,
    principles: copy.principles,
    collaboration: copy.collaboration,
    contact: { ...contactFacts, title: copy.contactTitle, body: copy.contactBody },
  }
}

export const profileCopy: Record<Lang, ProfileCopy> = {
  zh: makeProfile('zh'),
  en: makeProfile('en'),
}
