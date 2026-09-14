
const DATA = {
  hero: { portrait: "证件照.png" },
  projectIndex: [
    { id: "commercial", cover: "爱马仕/夏季/40379d8484144b6a435498fcf8b9d857.png", key: "hermes" },
    { id: "commercial", cover: "始祖鸟/cb880134dd55b4ea48ac6a2c188bf65b.jpg", key: "arc" },
    { id: "industrial", cover: "设计上海与米兰设计周/1a933b09873b81c73f03877f8f9a61ea.jpg", key: "industrial" },
    { id: "strategy", cover: "设计上海与米兰设计周/3f7ec7c3d1a16952bb9a0a0c1523be7b.jpg", key: "strategy" },
    { id: "aigc", cover: "渲染作品/22de046ff3e66598345084183a3aea6b.jpg", key: "aigc" }
  ],
  hermes: {
    summer: [
      "爱马仕/夏季/40379d8484144b6a435498fcf8b9d857.png",
      "爱马仕/夏季/51a7ab3976cb48ff18f4591b5056409e.jpg",
      "爱马仕/夏季/a8d210af1968eb83486446dc2f40027a.jpg"
    ],
    autumn: [
      "爱马仕/秋季/043e019544984416521bf2009313a5fb.jpg",
      "爱马仕/秋季/34aa997644c1849af5a716bd5cdcf55b.jpg",
      "爱马仕/秋季/b1d7e5fa28f89c792ee7a540882cf5ce.jpg"
    ],
    winter: [
      "爱马仕/冬季/54f3c93240044222915bc785ca86bc40.jpg",
      "爱马仕/冬季/776d28c61be0075bb8c93bffd65035ef.jpg",
      "爱马仕/冬季/8c4f37a6cb7ca715256d9a6f7dc9e210.jpg",
      "爱马仕/冬季/bfdc3c738e0adc5a35237a99374f7ac5.jpg",
      "爱马仕/冬季/e8d955a3898da97773e081384d4117e3.jpg",
      "爱马仕/冬季/f1455674fa1906fe49bd555bcad97e9c.jpg"
    ]
  },
  arcteryx: ["始祖鸟/cb880134dd55b4ea48ac6a2c188bf65b.jpg"],
  industrial: [
    "设计上海与米兰设计周/1a933b09873b81c73f03877f8f9a61ea.jpg",
    "设计上海与米兰设计周/211a2e25f8d767e880624789a3a63594.jpg",
    "设计上海与米兰设计周/3f7ec7c3d1a16952bb9a0a0c1523be7b.jpg",
    "设计上海与米兰设计周/450b32ccc90b8ca88b74c5bbf307c838.png",
    "设计上海与米兰设计周/4c9ca8a7b2459a9667ce0b7438da56e1.jpg",
    "设计上海与米兰设计周/5beb6f4875965136b4cf16ffcfe6f1fe.png",
    "设计上海与米兰设计周/916094a2d9a1fe336ac2d4c9854737b4.jpg",
    "设计上海与米兰设计周/9aa74a4014cf6e5ba9f80dae478ae31e.jpg",
    "设计上海与米兰设计周/a56bfb9a22490e6fa6dc7073ce8b6f87.png",
    "设计上海与米兰设计周/b3462a8b9f91b20f2fb239d91e7cadcf.jpg",
    "设计上海与米兰设计周/e9ab15f955279470fd53cb6e9e9a8c18.jpg"
  ],
  lab: [
    "渲染作品/22de046ff3e66598345084183a3aea6b.jpg",
    "渲染作品/6b8d00417baa8b204447fd0857eb435a.png",
    "渲染作品/7ddd2cc1d08f22e83dbf11ca277471eb.png",
    "渲染作品/a7bdacdb33c834301102c595220b48d3.png",
    "渲染作品/c7db2abf68343f46198039db6ab4fba6.png",
    "渲染作品/d426d7f675239cd43c29396f4b542fee.png"
  ],
  aigcGallery: [
    "渲染作品/22de046ff3e66598345084183a3aea6b.jpg",
    "渲染作品/6b8d00417baa8b204447fd0857eb435a.png",
    "渲染作品/7ddd2cc1d08f22e83dbf11ca277471eb.png",
    "渲染作品/c7db2abf68343f46198039db6ab4fba6.png"
  ],
  pdf: "孙英杰个人作品集/项目.pdf"
};

const I18N = {
  zh: {
    pageTitle: "孙英杰 | 策略驱动型全栈设计师",
    pageDesc: "孙英杰作品集：策略驱动型全栈设计师，覆盖商业落地、工业系统、战略设计与 AIGC 生产工作流。",
    brand: "Sun Yingjie",
    nav: { index: "精选项目", commercial: "商业落地", industrial: "工业系统", strategy: "战略案例", aigc: "AIGC 专家", about: "关于我", contact: "联系" },
    toggle: "EN",
    hero: {
      photoTag: "OPEN TO WORK · HANGZHOU",
      eyebrow: "STRATEGY-DRIVEN FULL-STACK DESIGNER",
      name: "孙英杰",
      role: "策略驱动型全栈设计师",
      tagline: "深耕工业设计与视觉传达边界，致力于实现从创意叙事到工程落地的全链路闭环。",
      facts: ["13515249897", "男 · 23岁 · 中共党员", "工作经验：4年", "求职意向：工业设计", "期望薪资：9-14K", "期望城市：杭州"],
      primaryBtn: "浏览精选项目",
      secondaryBtn: "查看完整案例 PDF",
      advantagesTitle: "个人优势",
      advantages: [
        { title: "核心定位", text: "深耕工业设计与视觉传达边界，构建从创意叙事到工程落地的全闭环。" },
        { title: "大牌背书", text: "曾服务 Hermès 与 Arc'teryx，将高端品牌愿景转化为高保真量产装置。" },
        { title: "行业认可", text: "主导铝型材灯具系统获邀参加米兰设计周与 Design Shanghai 展览。" },
        { title: "硬核技能", text: "深谙 DFM 与 CMF 逻辑，精通 3D 建模、高精渲染与跨媒介叙事。" },
        { title: "个人价值", text: "拒绝平庸，在严谨工业限制中以材质细节与结构创新打造收藏级高溢价产品。" }
      ],
      proof: ["Hermès", "Arc'teryx", "Milan Design Week", "Design Shanghai"],
      portraitAlt: "孙英杰彩色形象照"
    },
    index: {
      eyebrow: "CURATED PROJECTS",
      title: "精选项目入口",
      desc: "先看能力版图，再深入项目复盘。每个入口都对应完整的策略、过程与结果。",
      cards: {
        hermes: { title: "Hermès 四季橱窗", desc: "品牌遗产 × 空间叙事" },
        arc: { title: "Arc'teryx Alpha Center", desc: "机能语义 × 零售体验" },
        industrial: { title: "铝型材灯具系统", desc: "模块化 × 可制造性" },
        strategy: { title: "战略案例复盘", desc: "PEST / SWOT / Journey" },
        aigc: { title: "AIGC 生产力系统", desc: "图像与视频自动化" }
      }
    },
    commercial: {
      eyebrow: "COMMERCIAL EXCELLENCE",
      title: "商业落地：顶级品牌视觉资产管理",
      desc: "围绕品牌遗产、空间叙事与消费路径构建项目方法，确保从视觉冲击到门店转化形成连续体验。",
      hermesTitle: "Hermès 四季橱窗",
      hermesDesc: "以四季叙事重塑品牌符号：让马、丝巾与工艺语言在空间里完成情绪递进。",
      hermesAnalysisTitle: "作品介绍与分析",
      hermesAnalysis: ["策略层：将品牌遗产符号转译为空间语言，增强记忆点。", "执行层：以材质与光线对比制造视觉停留和浏览节奏。", "结果层：实现品牌内容传播与店面体验的一体化表达。"],
      hermesMetaTitle: "项目复盘（背景 / 过程 / 结果 / 角色）",
      hermesMeta: ["项目背景：需要在高端零售场景中持续输出季节化叙事。", "设计过程：概念草图 -> 3D 建模 -> 材质灯光 -> 现场安装调优。", "最终成果：形成高识别橱窗语言，并具备跨季节延展能力。", "个人角色：主导叙事构建、3D 执行与视觉资产整合。"],
      arcTitle: "Arc'teryx Alpha Center",
      arcDesc: "以地形线索、机能语汇与材料精度建立空间秩序，强化入口瞬时识别。",
      arcAnalysisTitle: "作品介绍与分析",
      arcAnalysis: ["策略层：以户外地形语义统一产品、空间与品牌调性。", "执行层：精准控制材料与光温，保证体验可复制落地。", "结果层：提升品牌识别效率并强化机能形象的可信度。"],
      arcMetaTitle: "项目复盘（背景 / 过程 / 结果 / 角色）",
      arcMeta: ["项目背景：打造兼具机能感与高端体验的品牌空间节点。", "设计过程：语义提炼 -> 动线推演 -> 材料打样 -> 场景校正。", "最终成果：入口识别度显著提升，空间叙事更聚焦。", "个人角色：负责核心视觉策略、空间氛围和交付质量控制。"],
      seasons: {
        summer: { title: "夏季 Summer", note: "高饱和叙事与前景道具形成即时吸引。", caption: "夏季场景" },
        autumn: { title: "秋季 Autumn", note: "纵深构图与层次分区强化故事推进。", caption: "秋季场景" },
        winter: { title: "冬季 Winter", note: "冷暖材质对比，强化品牌工艺质感。", caption: "冬季场景" }
      }
    },
    industrial: {
      eyebrow: "INDUSTRIAL SYSTEMS",
      title: "行业背书：米兰设计周 / 设计上海 铝型材灯具系统",
      desc: "从单体灯具到空间照明系统，展示模块化设计、结构可制造性与品牌展示效率的统一。",
      analysisTitle: "作品介绍与分析",
      analysis: ["策略层：建立“单元-连接-系统-空间”的模块化架构。", "执行层：基于铝型材实现结构稳定、装配高效与维护友好。", "结果层：在展会与商业场景中维持高一致性的呈现品质。"],
      metaTitle: "项目复盘（背景 / 过程 / 结果 / 角色）",
      meta: ["项目背景：满足展陈与商业空间对可扩展照明系统的需求。", "设计过程：系统拆分 -> 参数验证 -> 渲染评审 -> 展会落地。", "最终成果：形成可组合的灯具语言并完成行业级展览展示。", "个人角色：主导系统逻辑、造型细化、渲染表达与展示实施。"],
      caption: "工业系统画面"
    },
    strategy: {
      eyebrow: "STRATEGIC CASE STUDY",
      title: "逻辑深挖：PLUMBER 管道机器人 / HUHU CARE 医疗设计",
      desc: "通过结构化分析框架把复杂问题拆解为可验证的决策路径，体现策略设计能力而非单点视觉表达。",
      methodTitle: "方法框架",
      methods: ["PEST：识别政策、产业、技术、社会变量", "SWOT：定义优势、风险与机会窗口", "用户旅程：定位关键触点与决策节点", "服务蓝图：打通前台体验与后台系统能力"],
      roleTitle: "角色与贡献",
      roles: ["主导问题定义、调研结构与决策逻辑建模", "推进跨团队评审，统一设计与工程约束", "将策略结论转化为可执行的产品与服务方案"],
      pdfTitle: "完整案例文档（PDF）",
      openPdf: "新窗口打开 PDF",
      downloadPdf: "下载 PDF"
    },
    aigc: {
      eyebrow: "AIGC EXPERTISE",
      title: "AIGC 图像与视频生成专家",
      desc: "以可控工作流连接创意发散、批量生产与质量管理，确保 AI 能力服务于真实项目交付。",
      cards: [
        { title: "图像生成", text: "深耕 AIGC 领域，熟练运用 Gemini、Grok 进行创意发散；擅长利用 Flux 工作流实现高效率、大批量图像生产。" },
        { title: "视频生成", text: "全面掌握 Sora、Seedance2、Runway 及 Veo 等主流视频生成工具，并能根据项目需求灵活运用或接入工作流。" },
        { title: "技术底层", text: "具备深厚的 Stable Diffusion 经验，现高度依赖 ComfyUI 搭建深度、可控的自动化生产工作流。" }
      ],
      toolImageTitle: "图像工具栈",
      toolVideoTitle: "视频工具栈",
      toolPipelineTitle: "工作流与控制",
      toolImage: ["Gemini", "Grok", "Flux", "Midjourney", "Stable Diffusion"],
      toolVideo: ["Sora", "Seedance2", "Runway", "Veo"],
      toolPipeline: ["ComfyUI", "Prompt Routing", "Batch Queue", "Quality Check"],
      caption: "AIGC 视觉实验"
    },
    lab: {
      eyebrow: "TECHNOLOGY LAB",
      title: "技术实验室：AI 驱动的未来流",
      desc: "通过渲染实验与自动化流程，验证从概念到交付的效率提升与质量稳定性。",
      workflow: ["需求定义", "3D 建模", "AIGC 扩散", "后期精修", "交付复盘"],
      analysisTitle: "作品介绍与分析",
      analysis: ["策略层：将 AI 定位为效率引擎，不替代核心设计判断。", "执行层：ShadowBot + Midjourney / SD 形成快速迭代链路。", "结果层：显著缩短试错周期，释放高价值创意时间。"],
      caption: "技术实验画面"
    },
    about: {
      eyebrow: "ABOUT",
      title: "关于我：设计思维 + 工程落地",
      desc: "不仅展示结果，更展示方法论、协作能力与执行深度。",
      expTitle: "职业履历",
      exp: ["BENWU｜3D设计师（2025.03-2025.12）：主导多项高端品牌空间与产品视觉项目。", "湖南欧音文化传媒有限公司｜设计师助理（2023.12-2025.02）：用户研究、交互原型与数据分析。"],
      eduTitle: "教育背景",
      edu: ["常州工学院｜本科｜设计（2021-2025）"],
      awardsTitle: "荣誉与认可",
      awards: ["东方创意之星设计大赛铜奖", "三好学生一等奖学金 / 国家奖学金", "“两岸新锐设计竞赛-毕业奖”", "优秀共青团员 / 学业奖学金"],
      skillsTitle: "技能矩阵",
      skills: ["Rhino", "KeyShot", "Blender", "Adobe Suite", "Figma", "DFM", "CMF", "AIGC", "数据分析", "市场调研"],
      traitsTitle: "性格标签",
      traits: ["策略导向", "工程思维", "结果驱动", "审美敏感", "跨团队协作"]
    },
    contact: {
      eyebrow: "CONTACT",
      title: "让策略可视化，让美学可执行",
      desc: "欢迎联系，我可以按岗位需求快速提供定制化项目讲解版本。",
      card1Title: "候选人定位",
      card1Text: "策略驱动型全栈设计师 / 工业设计 / 3D 空间叙事 / AIGC 设计增效",
      card2Title: "素材覆盖",
      card3Title: "文档能力",
      card3Text: "战略案例 PDF 已放大内嵌，支持在线阅读、外链查看与下载。",
      card4Title: "联系信息",
      card4Text: "电话：13515249897｜城市：杭州｜可快速到岗沟通",
      proof: ["Hermès", "Arc'teryx", "Milan Design Week", "Design Shanghai", "AIGC Workflow"]
    },
    stats: {
      totalImages: "总图片",
      hermes: "Hermès",
      arc: "Arc'teryx",
      industrial: "工业系统",
      lab: "技术实验",
      pdf: "PDF",
      imageUnit: "张",
      fileUnit: "份",
      coverage: "已接入素材：图片 {images} 张 + 项目 PDF 1 份（来源于当前文件夹全部项目资源）。",
      seasonCount: "{count} 张"
    },
    lightboxCloseAria: "关闭"
  },
  en: {
    pageTitle: "Sun Yingjie | Strategy-Driven Full-Stack Designer",
    pageDesc: "Portfolio of Sun Yingjie: strategy-driven full-stack designer across commercial execution, industrial systems, strategic design, and AIGC workflow.",
    brand: "Sun Yingjie",
    nav: { index: "Highlights", commercial: "Commercial", industrial: "Industrial", strategy: "Strategy", aigc: "AIGC Expert", about: "About", contact: "Contact" },
    toggle: "中文",
    hero: {
      photoTag: "OPEN TO WORK · HANGZHOU",
      eyebrow: "STRATEGY-DRIVEN FULL-STACK DESIGNER",
      name: "Sun Yingjie",
      role: "Strategy-Driven Full-Stack Designer",
      tagline: "I bridge industrial design and visual storytelling, delivering complete loops from creative narrative to engineering execution.",
      facts: ["Phone: 13515249897", "Male · 23 · CPC Member", "Experience: 4 years", "Target Role: Industrial Designer", "Salary: RMB 9K-14K", "Preferred City: Hangzhou"],
      primaryBtn: "Explore Highlighted Projects",
      secondaryBtn: "Open Full Case PDF",
      advantagesTitle: "Profile Highlights",
      advantages: [
        { title: "Core Positioning", text: "Bridging industrial design and visual communication to deliver complete concept-to-execution systems." },
        { title: "Premium Brand Experience", text: "Worked with Hermès and Arc'teryx, translating premium brand vision into high-fidelity, manufacturable installations." },
        { title: "Industry Recognition", text: "Led an aluminum-profile lighting system invited to Milan Design Week and Design Shanghai." },
        { title: "Hard Skills", text: "Strong DFM/CMF logic with advanced 3D modeling, rendering, and cross-media storytelling capability." },
        { title: "Personal Value", text: "I avoid generic outcomes and craft collectible-quality products under strict engineering constraints." }
      ],
      proof: ["Hermès", "Arc'teryx", "Milan Design Week", "Design Shanghai"],
      portraitAlt: "Sun Yingjie portrait"
    },
    index: {
      eyebrow: "CURATED PROJECTS",
      title: "Project Entry Points",
      desc: "Start with capability map, then deep dive into process, decisions, and outcomes.",
      cards: {
        hermes: { title: "Hermès Seasonal Windows", desc: "Heritage × Spatial Narrative" },
        arc: { title: "Arc'teryx Alpha Center", desc: "Functional Semantics × Retail Experience" },
        industrial: { title: "Aluminum Lighting System", desc: "Modularity × Manufacturability" },
        strategy: { title: "Strategic Case Studies", desc: "PEST / SWOT / Journey" },
        aigc: { title: "AIGC Production System", desc: "Image + Video Workflow" }
      }
    },
    commercial: {
      eyebrow: "COMMERCIAL EXCELLENCE",
      title: "Commercial Execution: Premium Brand Visual Asset Delivery",
      desc: "A method that connects brand heritage, spatial storytelling, and conversion-oriented retail experience.",
      hermesTitle: "Hermès Seasonal Windows",
      hermesDesc: "Reframing brand symbols into seasonal spatial narratives with clear emotional progression.",
      hermesAnalysisTitle: "Project Summary & Analysis",
      hermesAnalysis: ["Strategy: turn heritage symbols into memorable spatial cues.", "Execution: use material-light contrast to build attention anchors.", "Outcome: integrate storytelling quality with commercial communication goals."],
      hermesMetaTitle: "Case Review (Context / Process / Outcome / Role)",
      hermesMeta: ["Context: deliver seasonal narratives in premium retail windows.", "Process: sketch -> 3D build -> material/light tuning -> on-site refinement.", "Outcome: high-recognition window language with seasonal scalability.", "Role: led narrative strategy, 3D execution, and visual asset integration."],
      arcTitle: "Arc'teryx Alpha Center",
      arcDesc: "Combining topographic narrative, technical material language, and retail precision.",
      arcAnalysisTitle: "Project Summary & Analysis",
      arcAnalysis: ["Strategy: one outdoor semantic system for product-space-brand consistency.", "Execution: controlled material-light balance for repeatable delivery.", "Outcome: stronger entry recognition and clearer functional brand expression."],
      arcMetaTitle: "Case Review (Context / Process / Outcome / Role)",
      arcMeta: ["Context: build a premium yet functional branded retail node.", "Process: semantic extraction -> circulation simulation -> material mockup -> calibration.", "Outcome: improved entry impact and narrative focus.", "Role: owned visual strategy, ambience decisions, and delivery quality control."],
      seasons: {
        summer: { title: "Summer", note: "High-saturation narrative and foreground props for immediate attraction.", caption: "Summer Scene" },
        autumn: { title: "Autumn", note: "Depth composition and layered zoning to advance storytelling.", caption: "Autumn Scene" },
        winter: { title: "Winter", note: "Cold/warm material contrast reinforces craftsmanship perception.", caption: "Winter Scene" }
      }
    },
    industrial: {
      eyebrow: "INDUSTRIAL SYSTEMS",
      title: "Industry Endorsement: Milan Design Week / Design Shanghai Lighting System",
      desc: "From single fixtures to spatial systems, demonstrating modular architecture and manufacturable structure.",
      analysisTitle: "Project Summary & Analysis",
      analysis: ["Strategy: modular path from unit to integrated spatial system.", "Execution: aluminum-profile logic for stability and assembly efficiency.", "Outcome: consistent display quality across exhibitions and commercial scenes."],
      metaTitle: "Case Review (Context / Process / Outcome / Role)",
      meta: ["Context: scalable lighting system demand for exhibitions and retail.", "Process: decomposition -> parameter validation -> render review -> deployment.", "Outcome: combinable lighting language delivered at industry-level venues.", "Role: led system logic, form detailing, rendering, and installation guidance."],
      caption: "Industrial System"
    },
    strategy: {
      eyebrow: "STRATEGIC CASE STUDY",
      title: "Deep Strategy: PLUMBER Robot / HUHU CARE Medical Design",
      desc: "Structured frameworks translate complex constraints into clear and verifiable decisions.",
      methodTitle: "Framework",
      methods: ["PEST: policy, industry, technology, social variables", "SWOT: strengths, risks, and opportunity windows", "User Journey: critical touchpoints and decisions", "Service Blueprint: frontstage-backstage system alignment"],
      roleTitle: "Role & Contribution",
      roles: ["Led problem framing, research structure, and decision modeling", "Coordinated cross-team reviews to align design with engineering constraints", "Converted strategy outcomes into executable product/service directions"],
      pdfTitle: "Full Case Documentation (PDF)",
      openPdf: "Open PDF in New Tab",
      downloadPdf: "Download PDF"
    },
    aigc: {
      eyebrow: "AIGC EXPERTISE",
      title: "AIGC Image & Video Generation Specialist",
      desc: "A controllable workflow linking ideation, batch production, and quality control for real delivery scenarios.",
      cards: [
        { title: "Image Generation", text: "Advanced in AIGC ideation with Gemini and Grok; experienced in high-throughput image production with Flux pipelines." },
        { title: "Video Generation", text: "Hands-on with Sora, Seedance2, Runway, and Veo, flexibly integrated by project needs." },
        { title: "Technical Foundation", text: "Deep Stable Diffusion practice; now relying on ComfyUI for controllable automated production pipelines." }
      ],
      toolImageTitle: "Image Stack",
      toolVideoTitle: "Video Stack",
      toolPipelineTitle: "Pipeline & Control",
      toolImage: ["Gemini", "Grok", "Flux", "Midjourney", "Stable Diffusion"],
      toolVideo: ["Sora", "Seedance2", "Runway", "Veo"],
      toolPipeline: ["ComfyUI", "Prompt Routing", "Batch Queue", "Quality Check"],
      caption: "AIGC Visual Study"
    },
    lab: {
      eyebrow: "TECHNOLOGY LAB",
      title: "Technology Lab: AI-Driven Future Flow",
      desc: "Rendering experiments and automation pipelines to validate speed and quality from concept to delivery.",
      workflow: ["Brief", "3D Build", "AIGC Divergence", "Post", "Delivery Review"],
      analysisTitle: "Project Summary & Analysis",
      analysis: ["Strategy: AI is an acceleration layer, not a replacement for design judgment.", "Execution: ShadowBot + Midjourney/SD for rapid iterations.", "Outcome: shorter trial cycles and more focus on high-value decisions."],
      caption: "Tech Lab"
    },
    about: {
      eyebrow: "ABOUT",
      title: "About Me: Design Thinking + Engineering Execution",
      desc: "Beyond visuals, I demonstrate method, collaboration, and delivery depth.",
      expTitle: "Experience",
      exp: ["BENWU | 3D Designer (2025.03-2025.12): delivered premium brand space/product visual projects.", "Hunan Ouyin Media | Design Assistant (2023.12-2025.02): user research, interaction prototypes, and data analysis."],
      eduTitle: "Education",
      edu: ["Changzhou Institute of Technology | Bachelor of Design (2021-2025)"],
      awardsTitle: "Awards & Recognition",
      awards: ["Oriental Creative Star Design Competition (Bronze)", "Outstanding Student Scholarship / National Scholarship", "Cross-Strait New Design Competition - Graduation Award", "Outstanding Youth League Member / Academic Scholarship"],
      skillsTitle: "Skill Matrix",
      skills: ["Rhino", "KeyShot", "Blender", "Adobe Suite", "Figma", "DFM", "CMF", "AIGC", "Data Analysis", "Market Research"],
      traitsTitle: "Personality Tags",
      traits: ["Strategy-led", "Engineering-minded", "Outcome-driven", "Aesthetic sensitivity", "Cross-team collaboration"]
    },
    contact: {
      eyebrow: "CONTACT",
      title: "Make Strategy Visible, Make Aesthetics Executable",
      desc: "Feel free to reach out. I can provide tailored walkthrough versions for specific roles.",
      card1Title: "Candidate Positioning",
      card1Text: "Strategy-Driven Full-Stack Designer / Industrial Design / Spatial Narrative / AIGC Workflow",
      card2Title: "Asset Coverage",
      card3Title: "Documentation",
      card3Text: "Strategic PDF is enlarged and embedded for reading, external opening, and download.",
      card4Title: "Contact",
      card4Text: "Phone: 13515249897 | City: Hangzhou | Available for interview discussion",
      proof: ["Hermès", "Arc'teryx", "Milan Design Week", "Design Shanghai", "AIGC Workflow"]
    },
    stats: {
      totalImages: "Total Images",
      hermes: "Hermès",
      arc: "Arc'teryx",
      industrial: "Industrial",
      lab: "Tech Lab",
      pdf: "PDF",
      imageUnit: "images",
      fileUnit: "file",
      coverage: "Assets included: {images} images + 1 project PDF (from all local project resources).",
      seasonCount: "{count} images"
    },
    lightboxCloseAria: "Close"
  }
};

const STATE = { lang: "zh" };
const SECTION_IDS = ["project-index", "commercial", "industrial", "strategy", "aigc", "about", "contact"];

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");

const $ = (id) => document.getElementById(id);
const setText = (id, value) => { const n = $(id); if (n) n.textContent = value; };
const tmpl = (str, vars) => Object.keys(vars).reduce((acc, key) => acc.replace(`{${key}}`, String(vars[key])), str);

function createImageCard(path, caption) {
  const card = document.createElement("article");
  card.className = "image-card";
  const button = document.createElement("button");
  button.type = "button";
  const image = document.createElement("img");
  image.src = path;
  image.alt = caption;
  image.loading = "lazy";
  button.appendChild(image);
  button.addEventListener("click", () => {
    lightboxImg.src = path;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
  const meta = document.createElement("p");
  meta.className = "image-meta";
  meta.textContent = caption;
  card.appendChild(button);
  card.appendChild(meta);
  return card;
}

function renderList(id, items) {
  const ul = $(id);
  ul.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function renderChipList(id, items, cls) {
  const root = $(id);
  root.innerHTML = "";
  items.forEach((text) => {
    const node = document.createElement("span");
    node.className = cls;
    node.textContent = text;
    root.appendChild(node);
  });
}

function renderAdvantages(content) {
  const root = $("advantageGrid");
  root.innerHTML = "";
  content.hero.advantages.forEach((item) => {
    const card = document.createElement("article");
    card.className = "adv-card";
    const h3 = document.createElement("h3");
    h3.textContent = item.title;
    const p = document.createElement("p");
    p.textContent = item.text;
    card.appendChild(h3);
    card.appendChild(p);
    root.appendChild(card);
  });
}

function renderProjectIndex(content) {
  const root = $("projectIndexGrid");
  root.innerHTML = "";
  DATA.projectIndex.forEach((item) => {
    const t = content.index.cards[item.key];
    const card = document.createElement("article");
    card.className = "index-card";
    const link = document.createElement("a");
    link.href = `#${item.id}`;
    const img = document.createElement("img");
    img.src = item.cover;
    img.alt = t.title;
    img.loading = "lazy";
    const wrap = document.createElement("div");
    wrap.className = "index-content";
    const h3 = document.createElement("h3");
    h3.textContent = t.title;
    const p = document.createElement("p");
    p.textContent = t.desc;
    wrap.appendChild(h3);
    wrap.appendChild(p);
    link.appendChild(img);
    link.appendChild(wrap);
    card.appendChild(link);
    root.appendChild(card);
  });
}

function renderSeason(container, season, list, stats) {
  const block = document.createElement("section");
  block.className = "season-block";
  const head = document.createElement("div");
  head.className = "season-head";
  const title = document.createElement("h4");
  title.textContent = season.title;
  const count = document.createElement("span");
  count.className = "count-tag";
  count.textContent = tmpl(stats.seasonCount, { count: list.length });
  const note = document.createElement("p");
  note.className = "season-note";
  note.textContent = season.note;
  const grid = document.createElement("div");
  grid.className = "gallery-grid";
  list.forEach((path, idx) => {
    const caption = `${season.caption} ${String(idx + 1).padStart(2, "0")}`;
    grid.appendChild(createImageCard(path, caption));
  });
  head.appendChild(title);
  head.appendChild(count);
  block.appendChild(head);
  block.appendChild(note);
  block.appendChild(grid);
  container.appendChild(block);
}

function renderGridGallery(containerId, list, captionBase) {
  const root = $(containerId);
  root.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "gallery-grid";
  list.forEach((path, idx) => {
    const caption = `${captionBase} ${String(idx + 1).padStart(2, "0")}`;
    grid.appendChild(createImageCard(path, caption));
  });
  root.appendChild(grid);
}

function renderMasonry(containerId, list, captionBase) {
  const root = $(containerId);
  root.innerHTML = "";
  list.forEach((path, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "masonry-item";
    const caption = `${captionBase} ${String(idx + 1).padStart(2, "0")}`;
    wrap.appendChild(createImageCard(path, caption));
    root.appendChild(wrap);
  });
}

function renderAigc(content) {
  const grid = $("aigcGrid");
  grid.innerHTML = "";
  content.aigc.cards.forEach((item) => {
    const card = document.createElement("article");
    card.className = "aigc-card";
    const h3 = document.createElement("h3");
    h3.textContent = item.title;
    const p = document.createElement("p");
    p.textContent = item.text;
    card.appendChild(h3);
    card.appendChild(p);
    grid.appendChild(card);
  });
  setText("aigcToolImageTitle", content.aigc.toolImageTitle);
  setText("aigcToolVideoTitle", content.aigc.toolVideoTitle);
  setText("aigcToolPipelineTitle", content.aigc.toolPipelineTitle);
  renderChipList("aigcToolImage", content.aigc.toolImage, "tool-chip");
  renderChipList("aigcToolVideo", content.aigc.toolVideo, "tool-chip");
  renderChipList("aigcToolPipeline", content.aigc.toolPipeline, "tool-chip");
  renderGridGallery("aigcGallery", DATA.aigcGallery, content.aigc.caption);
}

function renderWorkflow(content) {
  const root = $("workflowLane");
  root.innerHTML = "";
  content.lab.workflow.forEach((step) => {
    const node = document.createElement("span");
    node.textContent = step;
    root.appendChild(node);
  });
}

function setPdf(content) {
  $("portfolioPdf").src = `${DATA.pdf}#view=FitH`;
  const open = $("pdfOpen");
  const download = $("pdfDownload");
  open.href = DATA.pdf;
  download.href = DATA.pdf;
  open.textContent = content.strategy.openPdf;
  download.textContent = content.strategy.downloadPdf;
  const heroSecondary = $("heroSecondaryBtn");
  heroSecondary.href = DATA.pdf;
  heroSecondary.textContent = content.hero.secondaryBtn;
}

function setCoverage(content) {
  const hermesCount = DATA.hermes.summer.length + DATA.hermes.autumn.length + DATA.hermes.winter.length;
  const totalImages = 1 + hermesCount + DATA.arcteryx.length + DATA.industrial.length + DATA.lab.length;
  const chips = [
    `${content.stats.totalImages} ${totalImages} ${content.stats.imageUnit}`,
    `${content.stats.hermes} ${hermesCount}`,
    `${content.stats.arc} ${DATA.arcteryx.length}`,
    `${content.stats.industrial} ${DATA.industrial.length}`,
    `${content.stats.lab} ${DATA.lab.length}`,
    `${content.stats.pdf} 1 ${content.stats.fileUnit}`
  ];
  const statsRoot = $("assetStats");
  statsRoot.innerHTML = "";
  chips.forEach((text) => {
    const chip = document.createElement("span");
    chip.className = "stat-chip";
    chip.textContent = text;
    statsRoot.appendChild(chip);
  });
  setText("coverageText", tmpl(content.stats.coverage, { images: totalImages }));
}

function bindLightbox() {
  const close = $("lightboxClose");
  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  };
  close.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

function bindLanguageToggle() {
  $("langToggle").addEventListener("click", () => {
    applyLanguage(STATE.lang === "zh" ? "en" : "zh");
  });
}

function bindBackTop() {
  const btn = $("backTop");
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    if (window.scrollY > 560) btn.classList.add("show");
    else btn.classList.remove("show");
  });
}

function bindScrollSpy() {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const map = new Map(links.map((link) => [link.getAttribute("href")?.slice(1), link]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => link.classList.remove("active"));
        const active = map.get(entry.target.id);
        if (active) active.classList.add("active");
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 });
  SECTION_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

function applyLanguage(lang) {
  STATE.lang = lang;
  const content = I18N[lang];
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = content.pageTitle;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", content.pageDesc);

  setText("brandText", content.brand);
  setText("navIndex", content.nav.index);
  setText("navCommercial", content.nav.commercial);
  setText("navIndustrial", content.nav.industrial);
  setText("navStrategy", content.nav.strategy);
  setText("navAigc", content.nav.aigc);
  setText("navAbout", content.nav.about);
  setText("navContact", content.nav.contact);
  setText("langToggle", content.toggle);

  setText("heroPhotoTag", content.hero.photoTag);
  setText("heroEyebrow", content.hero.eyebrow);
  setText("heroName", content.hero.name);
  setText("heroRole", content.hero.role);
  setText("heroTagline", content.hero.tagline);
  setText("heroPrimaryBtn", content.hero.primaryBtn);
  $("heroPrimaryBtn").href = "#project-index";
  setText("advantageTitle", content.hero.advantagesTitle);
  $("heroPortrait").alt = content.hero.portraitAlt;
  renderChipList("personalFacts", content.hero.facts, "fact-chip");
  renderAdvantages(content);
  renderChipList("socialProof", content.hero.proof, "proof-chip");

  setText("indexEyebrow", content.index.eyebrow);
  setText("indexTitle", content.index.title);
  setText("indexDesc", content.index.desc);
  renderProjectIndex(content);

  setText("commercialEyebrow", content.commercial.eyebrow);
  setText("commercialTitle", content.commercial.title);
  setText("commercialDesc", content.commercial.desc);
  setText("hermesTitle", content.commercial.hermesTitle);
  setText("hermesDesc", content.commercial.hermesDesc);
  setText("hermesAnalysisTitle", content.commercial.hermesAnalysisTitle);
  renderList("hermesAnalysisList", content.commercial.hermesAnalysis);
  setText("hermesMetaTitle", content.commercial.hermesMetaTitle);
  renderList("hermesMetaList", content.commercial.hermesMeta);
  setText("arcTitle", content.commercial.arcTitle);
  setText("arcDesc", content.commercial.arcDesc);
  setText("arcAnalysisTitle", content.commercial.arcAnalysisTitle);
  renderList("arcAnalysisList", content.commercial.arcAnalysis);
  setText("arcMetaTitle", content.commercial.arcMetaTitle);
  renderList("arcMetaList", content.commercial.arcMeta);
  const seasonRoot = $("hermesSeasons");
  seasonRoot.innerHTML = "";
  renderSeason(seasonRoot, content.commercial.seasons.summer, DATA.hermes.summer, content.stats);
  renderSeason(seasonRoot, content.commercial.seasons.autumn, DATA.hermes.autumn, content.stats);
  renderSeason(seasonRoot, content.commercial.seasons.winter, DATA.hermes.winter, content.stats);
  renderGridGallery("arcGallery", DATA.arcteryx, lang === "zh" ? "始祖鸟空间" : "Arc'teryx Space");

  setText("industrialEyebrow", content.industrial.eyebrow);
  setText("industrialTitle", content.industrial.title);
  setText("industrialDesc", content.industrial.desc);
  setText("industrialAnalysisTitle", content.industrial.analysisTitle);
  renderList("industrialAnalysisList", content.industrial.analysis);
  setText("industrialMetaTitle", content.industrial.metaTitle);
  renderList("industrialMetaList", content.industrial.meta);
  renderMasonry("industrialGallery", DATA.industrial, content.industrial.caption);

  setText("strategyEyebrow", content.strategy.eyebrow);
  setText("strategyTitle", content.strategy.title);
  setText("strategyDesc", content.strategy.desc);
  setText("strategyMethodTitle", content.strategy.methodTitle);
  renderList("strategyMethodList", content.strategy.methods);
  setText("strategyRoleTitle", content.strategy.roleTitle);
  renderList("strategyRoleList", content.strategy.roles);
  setText("strategyPdfTitle", content.strategy.pdfTitle);

  setText("aigcEyebrow", content.aigc.eyebrow);
  setText("aigcTitle", content.aigc.title);
  setText("aigcDesc", content.aigc.desc);
  renderAigc(content);

  setText("labEyebrow", content.lab.eyebrow);
  setText("labTitle", content.lab.title);
  setText("labDesc", content.lab.desc);
  setText("labAnalysisTitle", content.lab.analysisTitle);
  renderList("labAnalysisList", content.lab.analysis);
  renderWorkflow(content);
  renderMasonry("labGallery", DATA.lab, content.lab.caption);

  setText("aboutEyebrow", content.about.eyebrow);
  setText("aboutTitle", content.about.title);
  setText("aboutDesc", content.about.desc);
  setText("aboutExpTitle", content.about.expTitle);
  renderList("aboutExpList", content.about.exp);
  setText("aboutEduTitle", content.about.eduTitle);
  renderList("aboutEduList", content.about.edu);
  setText("aboutAwardsTitle", content.about.awardsTitle);
  renderList("aboutAwardsList", content.about.awards);
  setText("aboutSkillsTitle", content.about.skillsTitle);
  renderChipList("aboutSkills", content.about.skills, "skill-tag");
  setText("aboutTraitsTitle", content.about.traitsTitle);
  renderChipList("aboutTraits", content.about.traits, "trait-tag");

  setText("contactEyebrow", content.contact.eyebrow);
  setText("contactTitle", content.contact.title);
  setText("contactDesc", content.contact.desc);
  setText("contactCard1Title", content.contact.card1Title);
  setText("contactCard1Text", content.contact.card1Text);
  setText("contactCard2Title", content.contact.card2Title);
  setText("contactCard3Title", content.contact.card3Title);
  setText("contactCard3Text", content.contact.card3Text);
  setText("contactCard4Title", content.contact.card4Title);
  setText("contactCard4Text", content.contact.card4Text);
  renderChipList("proofStrip", content.contact.proof, "proof-badge");

  $("lightboxClose").setAttribute("aria-label", content.lightboxCloseAria);
  setPdf(content);
  setCoverage(content);
}

function init() {
  $("heroPortrait").src = DATA.hero.portrait;
  bindLightbox();
  bindLanguageToggle();
  bindBackTop();
  bindScrollSpy();
  applyLanguage("zh");
}

init();
