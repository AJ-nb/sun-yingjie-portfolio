export type ExperimentLang = 'zh' | 'en'
export type Copy = { zh: string; en: string }
export const bilingual = (zh: string, en: string): Copy => ({ zh, en })
export const copy = (value: Copy, lang: ExperimentLang) => value[lang]
export type ExperimentView = { id: string; label: Copy; title: Copy; body: Copy; image: string; caption: Copy; focus?: { x: number; y: number; label: Copy }[] }
export type Experiment = { slug: string; number: string; title: Copy; intro: Copy; boundary: Copy; views: ExperimentView[] }
const b = bilingual
const hermes = '/works/legacy/hermes/'
const lighting = '/works/legacy/lighting/'
const huhu = '/works/refinement-v2/huhu/'
const plumber = '/works/refinement-v2/plumber/'
const periastra = '/works/brand/periastra/'
export const experiments: Record<string, Experiment> = {
  hermes: {
    slug: 'hermes', number: '01', title: b('商品与场景，谁先被看见？', 'What catches the eye first?'),
    intro: b('切换季节，观察道具尺度、商品位置与背景如何改变观看顺序。', 'Switch seasons to examine how props, product placement and backgrounds guide attention.'),
    boundary: b('原始项目展示图 · 标注是对画面构成的复盘，不代表视线追踪测试。', 'Original project imagery · Annotations are a composition review, not eye-tracking evidence.'),
    views: [
      { id: 'summer', label: b('夏 / Summer', 'Summer'), title: b('用放大的道具建立情境', 'Set the scene through scale'), body: b('鱼竿、手形与折叠椅构成休闲语境。先用轮廓抓住注意，再检查包袋与鞋履是否仍可被独立辨认。', 'A fishing rod, hand shape and folding chair establish leisure. Their silhouettes attract attention; the bag and shoes must still remain individually legible.'), image: hermes + '40379d8484144b6a435498fcf8b9d857.webp', caption: b('夏季橱窗：漫画式道具与橙、蓝绿色块。', 'Summer window: comic-like props and orange–teal colour fields.') },
      { id: 'autumn', label: b('秋 / Autumn', 'Autumn'), title: b('让框景成为阅读路径', 'Use framing to guide the eye'), body: b('放大的鱼形穿过装饰门框，错位尺度制造停留理由。框架将动物、人台和配饰组织在同一个有限空间中。', 'An oversized fish crosses a decorative doorway. The unexpected scale invites a second look while the frame connects the animal, mannequin and accessories.'), image: hermes + '043e019544984416521bf2009313a5fb.webp', caption: b('秋季橱窗：鱼形、门框与人台的尺度关系。', 'Autumn window: scale relationships between fish, doorway and mannequin.') },
      { id: 'winter', label: b('冬 / Winter', 'Winter'), title: b('让层叠与留白共同工作', 'Balance layers with breathing room'), body: b('白马与雪地层面提供连续的视觉方向，蓝色背景将轮廓分开。黄色包袋与粉色小马成为蓝白画面中的色彩停靠点。', 'White horse and snow layers establish a visual direction against blue. A yellow bag and pink horse create colour accents within the blue-and-white scene.'), image: hermes + 'f1455674fa1906fe49bd555bcad97e9c.webp', caption: b('冬季横向橱窗：白马、层叠雪地与悬挂配饰。', 'Winter window: white horse, layered snow and suspended accessories.') },
    ],
  },
  lighting: {
    slug: 'lighting', number: '02', title: b('同一截面，四种空间关系', 'One language, four spatial roles'),
    intro: b('改变长度、朝向与支撑方式，检查系列辨识度如何延续。', 'Change length, orientation and support to examine how a product family stays recognisable.'),
    boundary: b('原始系列展示图 · 此处比较形态与空间关系，不模拟照度或性能。', 'Original series imagery · This compares form and spatial relationships, not lighting performance.'),
    views: [
      { id: 'table', label: b('台灯', 'Table'), title: b('在近距离中看见截面', 'Read the section at close range'), body: b('四瓣感端部、纵向发光条与圆形底座成为单体的三项线索。桌面与书本提供使用情境中的比例参照。', 'The lobed end, linear light strip and circular base give the object three recognisable cues. A desk and book contextualise its proportions.'), image: lighting + '5beb6f4875965136b4cf16ffcfe6f1fe.webp', caption: b('银色台灯与桌面场景。', 'Silver table lamp in a desktop setting.') },
      { id: 'floor', label: b('落地灯', 'Floor'), title: b('用长度改变存在感', 'Let length change its presence'), body: b('灯体向竖向延伸，保留截面、线性发光面与底座的关系。系列变化集中在尺度，不必再添加一套装饰语言。', 'The body extends vertically while retaining its section, light strip and base relationship. Scale creates variation without a second decorative vocabulary.'), image: lighting + '916094a2d9a1fe336ac2d4c9854737b4.webp', caption: b('银色落地灯完整视图。', 'Complete view of the silver floor lamp.') },
      { id: 'wall', label: b('壁灯', 'Wall'), title: b('让建筑成为支撑', 'Let architecture become the support'), body: b('移除落地支撑后，竖向灯体与墙面凹处建立关系。金属色与灰色建筑背景形成材质对照。', 'With floor support removed, the vertical body relates to an architectural recess. Metallic colour contrasts with the grey wall.'), image: lighting + '3f7ec7c3d1a16952bb9a0a0c1523be7b.webp', caption: b('金色壁灯与建筑凹处。', 'Gold wall light within an architectural recess.') },
      { id: 'pendant', label: b('吊灯', 'Pendant'), title: b('从竖向标记到横向连接', 'From vertical marker to horizontal link'), body: b('线性灯体转为水平悬吊，与长桌方向呼应。改变安装方式时，端部截面与连续发光条继续维持家族关系。', 'The linear body becomes a horizontal pendant aligned with a long table. End sections and continuous light strips retain the family identity.'), image: lighting + '450b32ccc90b8ca88b74c5bbf307c838.webp', caption: b('餐桌上方的水平线性吊灯。', 'Horizontal linear pendant above a dining table.') },
    ],
  },
  plumber: {
    slug: 'plumber', number: '03', title: b('把地下作业变成可读的步骤', 'Make underground work legible'),
    intro: b('沿扫描、清理、返回的概念流程，查看设备与反馈之间的关系。', 'Follow the proposed scan, clean and return sequence to explore the relationship between equipment and feedback.'),
    boundary: b('概念流程 · 使用原始渲染演示，不代表设备已运行或清淤效果已验证。', 'Concept sequence · Original renders illustrate a proposal, not verified operation or cleaning performance.'),
    views: [
      { id: 'scan', label: b('01 扫描', '01 Scan'), title: b('先让不可见的问题可理解', 'First make the hidden problem readable'), body: b('提案将识别与成像放在清理之前。画面需要告诉操作者当前阶段与设备位置；传感精度、定位和权限仍待工程验证。', 'Identification and imaging precede cleaning in the proposal. Feedback needs to show the current stage and location; sensor accuracy, localisation and permissions remain unverified.'), image: plumber + 'front.webp', caption: b('机器人正视原始渲染。', 'Original front-view robot render.') },
      { id: 'clean', label: b('02 清理', '02 Clean'), title: b('把作业端与主体分开阅读', 'Distinguish the working end from the body'), body: b('清理端形成明确的功能朝向，暖色外壳与深色部件区分结构。形态表达说明概念分工，不足以证明实际负载与通过能力。', 'The cleaning end gives the robot a clear working direction. Warm housing and dark parts separate visual groups; this does not establish load or passage capability.'), image: plumber + 'cleaning-head.webp', caption: b('清理端局部原始渲染。', 'Original render of the cleaning end.') },
      { id: 'return', label: b('03 返回', '03 Return'), title: b('用基站结束一个工作回路', 'Complete the working loop at a station'), body: b('地下基站将部署、返回与维护连接起来。系统需要保留工作人员监督，而不能从游戏化界面推导出公众对真实设备的控制权限。', 'The underground station connects deployment, return and maintenance. Professional supervision remains necessary; a game-like interface does not establish public control authority.'), image: plumber + 'station.webp', caption: b('地下基站概念原始渲染。', 'Original underground-station concept render.') },
      { id: 'structure', label: b('04 部件关系', '04 Parts'), title: b('分解图是理解关系的入口', 'An exploded view opens up the relationships'), body: b('沿原始分解图查看外壳、内部部件与作业端的相对组织。此处保留原有图像，不加入未经确认的尺寸或隐藏机构。', 'Inspect how the housing, internal components and working end are organised in the original exploded view. No unverified dimensions or hidden mechanisms are added.'), image: plumber + 'exploded.webp', caption: b('机器人部件分解原始渲染；部件功能以原提案为界。', 'Original exploded robot render; functional interpretation stays within the proposal.') },
    ],
  },
  'huhu-care': {
    slug: 'huhu-care', number: '04', title: b('同一个动作，三种关切', 'One action, three perspectives'),
    intro: b('切换儿童、家长与医护视角，理解造型与操作接触点的关系。', 'Switch between child, parent and clinician to explore form through different touchpoints.'),
    boundary: b('儿童呼气体验概念 · 医疗检测路线、临床适用性与实际易用性尚未验证。', 'Child exhalation experience concept · Detection technology, clinical use and usability remain unverified.'),
    views: [
      { id: 'child', label: b('儿童', 'Child'), title: b('从可理解的握持开始', 'Begin with an understandable grip'), body: b('熟悉的吹气球动作提供引导，握持区域帮助说明手应放在哪里。趣味化是体验假设，仍需观察真实儿童的理解与操作。', 'A familiar balloon-blowing action provides guidance, while the grip signals hand placement. Playfulness remains an experience hypothesis requiring observation with children.'), image: huhu + 'grip.webp', caption: b('防滑握持区域原始渲染。', 'Original render of the grip area.') },
      { id: 'parent', label: b('家长', 'Parent'), title: b('让引导有一个具体接触点', 'Give guidance a concrete touchpoint'), body: b('吹嘴与连接位置是解释动作的入口。家长需要知道何时引导、何时等待；图像表达操作关系，不给出检测或清洁指令。', 'The mouthpiece and its connection make the action explainable. Parents need to know when to guide and when to wait; the imagery is not a testing or cleaning instruction.'), image: huhu + 'mouthpiece.webp', caption: b('吹嘴与连接位置原始渲染。', 'Original render of mouthpiece and connection.') },
      { id: 'clinician', label: b('医护', 'Clinician'), title: b('从单次动作回到完整流程', 'Return from one action to the whole workflow'), body: b('产品与底座构成使用前后的收纳与放置关系。耗材替换、状态反馈和清洁流程需要与检测技术共同验证。', 'Product and base frame placement before and after use. Consumable replacement, feedback and cleaning must be validated alongside the detection technology.'), image: huhu + 'charging-base.webp', caption: b('产品与充电底座组合原始渲染。', 'Original render of the product and charging-base concept.') },
    ],
  },
  biyuan: {
    slug: 'biyuan', number: '05', title: b('从理解服务，到找到下一步', 'From understanding to a next step'),
    intro: b('在保存的真实界面中，按访问意图走过首页、模型目录与名称查找。', 'Move through saved real interfaces: service introduction, model catalogue and name search.'),
    boundary: b('2026-09-15 保存的真实网页截图 · 此处为路径讲解，不读取实时目录或调用模型。', 'Real webpage captures saved on 15 Sep 2026 · This is a walkthrough, not a live catalogue or model call.'),
    views: [
      { id: 'home', label: b('01 理解服务', '01 Understand'), title: b('把主要行动放在第一层', 'Place the primary actions first'), body: b('首页并列提供快速开始与接口文档，分别回应准备使用和先行评估的访问者。暖白底与橙色强调组织阅读重心。', 'Quick start and API documentation address visitors ready to begin and those evaluating first. Warm white and orange establish the reading hierarchy.'), image: '/works/refinement-brand/biyuan/home-desktop.png', caption: b('官网首页真实截图；图中的服务主张为当时页面文案。', 'Real homepage capture; service claims belong to the page at capture time.') },
      { id: 'models', label: b('02 选择用途', '02 Explore'), title: b('用用途收束选择范围', 'Narrow choice by use case'), body: b('用途筛选、搜索和模型卡片把大列表变为可浏览的目录。卡片内容为比较提供入口，不等于已经验证每项性能。', 'Use-case filters, search and model cards turn a large list into a browsable catalogue. Cards support comparison but do not establish verified performance.'), image: '/works/refinement-brand/biyuan/models-desktop.png', caption: b('模型广场桌面真实截图。', 'Real desktop capture of the model catalogue.') },
      { id: 'name', label: b('03 找到名称', '03 Find a name'), title: b('为明确目标提供短路径', 'Give a known target a short path'), body: b('当访问者知道要找什么，名称搜索将列表收束到相关条目。复制名称与试用入口连接查找和后续接入；账户实际可用范围仍需服务返回确认。', 'Name search narrows the list for visitors with a target. Copy-name and trial actions connect discovery to setup; account availability still depends on the service response.'), image: '/works/refinement-brand/biyuan/models-filtered.png', caption: b('模型名称搜索后的真实页面状态。', 'Real page state after searching by model name.') },
    ],
  },
  periastra: {
    slug: 'periastra', number: '06', title: b('让复杂度服从识别', 'Let complexity serve recognition'),
    intro: b('从现有标志到结构与负形研究，再检查缩小和反转后的阅读。', 'Move from the existing mark to structure and negative space, then inspect size and inversion.'),
    boundary: b('标志与应用研究 · 屏幕检查不代表16px图标或实体工艺已通过验证。', 'Identity and application study · On-screen inspection does not validate a 16px icon or physical production.'),
    views: [
      { id: 'mark', label: b('当前标志', 'Current mark'), title: b('先读 P，再读镜头与容器', 'Read P, then lens and enclosure'), body: b('字母为第一识别入口，回旋笔画与外部轮廓提供第二层联想。此处使用原始标志图，不重绘或替换其几何。', 'The letter is the first point of recognition; internal turns and enclosure add associations. This uses the original mark without redrawing its geometry.'), image: periastra + 'logo/periastra-logo-v01-20260422.webp', caption: b('2026-04-22 原始标志方案，含字标。', 'Original identity proposal dated 22 Apr 2026, including wordmark.') },
      { id: 'structure', label: b('结构阅读', 'Structure'), title: b('分开观察三个图形母题', 'Read the three motifs separately'), body: b('结构说明将主干、圆弧腹部与外部框架连成阅读顺序。分析图用于解释现有关系，不是对历史设计过程的重演。', 'The structure study connects the stem, curved bowl and outer frame in a reading order. It explains relationships rather than reenacting an undocumented process.'), image: periastra + 'explainers/periastra-structure-breakdown-v01.svg', caption: b('原有结构说明图：字母、镜头与保护框架。', 'Existing structure diagram: letter, lens and protective frame.') },
      { id: 'space', label: b('负形与线宽', 'Negative space'), title: b('把留白当成结构的一部分', 'Treat empty space as structure'), body: b('比较外框与内笔画的重量、中央留白和断口节奏。优化方向是需要进一步验证的研究，并非已经替换当前标志的定稿。', 'Compare outer and inner stroke weight, central space and breaks. These are research directions to validate, not a finished replacement for the current mark.'), image: periastra + 'explainers/periastra-lineweight-negative-space-v01.svg', caption: b('原有线宽与负形优化研究。', 'Existing study of line weight and negative space.') },
    ],
  },
  lensflow: {
    slug: 'lensflow', number: '07', title: b('失败一个，不丢掉已经完成的', 'One failure should not erase progress'),
    intro: b('沿固定样例走过采集、分析、简报和批次恢复，观察成功结果如何保留。', 'Follow a fixed sample through capture, analysis, brief and batch recovery to see how completed results survive.'),
    boundary: b('本地交互样例 · 截图为v0.3.0保存画面；恢复逻辑演示不调用任何模型。', 'Local interactive fixture · Captures show v0.3.0; this recovery demonstration makes no model calls.'),
    views: [
      { id: 'capture', label: b('01 采集', '01 Capture'), title: b('先保留素材与来源关系', 'Keep material and origin connected'), body: b('把参考素材放入工作区，后续分析仍与当前图像关联。此样例使用预设数据，没有上传访客文件。', 'Bring a reference into the workspace while keeping later analysis linked to it. This fixture uses preset data and uploads no visitor files.'), image: '/works/digital/lensflow/studio-guide.webp', caption: b('v0.3.0 首次使用引导保存画面。', 'Saved v0.3.0 onboarding view.') },
      { id: 'analyse', label: b('02 分析', '02 Analyse'), title: b('让结论有结构，也有上下文', 'Give findings structure and context'), body: b('图像、色板与分析文字保持相邻，帮助核对分析是否对应原素材。模型判断与本地测量具有不同证据边界。', 'Image, palette and analysis stay adjacent so findings can be checked against the reference. Model judgments and local measurements have different evidence limits.'), image: '/works/digital/lensflow/studio-analysis.webp', caption: b('v0.3.0 结构化分析保存画面；灯具为演示素材。', 'Saved v0.3.0 structured analysis; lamp is demonstration material.') },
      { id: 'brief', label: b('03 简报', '03 Brief'), title: b('分析之后，仍然保留编辑权', 'Keep editorial control after analysis'), body: b('风格、主体、构图、色彩和动态共同组织输入。分析不是不可修改的指令，用户需要在提交前核对当前简报。', 'Style, subject, composition, colour and motion organise the input. Analysis is editable material; users review the current brief before submission.'), image: '/works/digital/lensflow/studio-analysis.webp', caption: b('保存界面用作流程背景；下方任务为独立的固定样例。', 'Saved interface provides context; tasks below are a separate fixed fixture.') },
      { id: 'recover', label: b('04 恢复', '04 Recover'), title: b('只恢复失败位置', 'Recover only the failed position'), body: b('每个结果位置单独记录。触发一次样例失败，再手动补全失败项，观察已完成的两项内容与尝试次数保持不变。', 'Each output position is recorded separately. Trigger the fixture failure, then recover it manually: the two completed outputs and their attempt counts stay unchanged.'), image: '/works/digital/lensflow/studio-analysis.webp', caption: b('下方可操作的批次为本地固定样例，不产生真实图像。', 'The batch below is a local fixture and produces no real images.') },
    ],
  },
  'resume-formatter': {
    slug: 'resume-formatter', number: '08', title: b('润色表达，不悄悄改变事实', 'Improve expression without changing facts'),
    intro: b('用虚构履历审阅三条建议，逐条接受或拒绝，并撤销最近一次决定。', 'Review three suggestions on a fictional résumé. Accept or reject each, then undo the latest decision.'),
    boundary: b('虚构履历样例 · 仅演示审阅机制，不调用AI，不代表真实人物或招聘效果。', 'Fictional résumé fixture · Demonstrates review mechanics without AI calls, real people or hiring claims.'),
    views: [
      { id: 'review', label: b('差异审阅', 'Review changes'), title: b('决定留在使用者手中', 'Keep the decision with the user'), body: b('建议与原文并列，只有接受后才改变当前简历。拒绝保留原文；撤销恢复到最近一次决定之前。', 'Suggestions sit beside the source. The current résumé changes only after acceptance. Rejection retains the original; undo restores the state before the last decision.'), image: '/works/digital/resume-formatter/rewrite-diff.webp', caption: b('v2.4.0 保存的差异审阅界面，含虚构履历。', 'Saved v2.4.0 difference-review interface with fictional résumé content.') },
    ],
  },
}

export type SampleTask = { id: string; status: 'queued' | 'success' | 'failed'; attempts: number; result: string | null }
export const initialTasks = (): SampleTask[] => ['A', 'B', 'C'].map(id => ({ id, status: 'queued', attempts: 0, result: null }))
export function taskReducer(tasks: SampleTask[], action: 'run' | 'retry' | 'reset'): SampleTask[] {
  if (action === 'reset') return initialTasks()
  if (action === 'run') return tasks.some(task => task.status !== 'queued') ? tasks : tasks.map((task, index) => ({ ...task, attempts: 1, status: index === 2 ? 'failed' : 'success', result: index === 2 ? null : `fixture-${task.id}-v1` }))
  return tasks.map(task => task.status === 'failed' ? { ...task, status: 'success', attempts: task.attempts + 1, result: `fixture-${task.id}-v1` } : task)
}
export type ReviewChoice = 'pending' | 'accepted' | 'rejected'
export type ReviewState = { choices: ReviewChoice[]; history: ReviewChoice[][] }
export const initialReview = (): ReviewState => ({ choices: ['pending', 'pending', 'pending'], history: [] })
export function reviewReducer(state: ReviewState, action: { type: 'accept' | 'reject'; index: number } | { type: 'undo' } | { type: 'reset' }): ReviewState {
  if (action.type === 'reset') return initialReview()
  if (action.type === 'undo') return state.history.length ? { choices: state.history[state.history.length - 1], history: state.history.slice(0, -1) } : state
  if (action.index < 0 || action.index >= state.choices.length || state.choices[action.index] !== 'pending') return state
  const choices = [...state.choices]
  choices[action.index] = action.type === 'accept' ? 'accepted' : 'rejected'
  return { choices, history: [...state.history, state.choices] }
}
export const resumeSamples = [
  { label: b('项目表达', 'Project description'), original: b('做了一个校园活动报名页面，整理内容，也画了页面。', 'Made a campus event sign-up page, organised content and designed the screens.'), suggestion: b('为校园活动设计报名页面，负责内容梳理与界面设计。', 'Designed a campus event sign-up page, covering content organisation and interface design.'), reason: b('把动作与承担范围连接起来；没有新增结果数字。', 'Connects the action and contribution without adding outcome metrics.') },
  { label: b('协作表达', 'Collaboration'), original: b('和开发同学沟通页面，改了一些按钮和表单。', 'Talked with student developers about the page and changed some buttons and forms.'), suggestion: b('与开发同学协作，调整页面按钮与表单。', 'Collaborated with student developers to refine page buttons and forms.'), reason: b('压缩重复表达，保留协作身份与实际修改对象。', 'Removes repetition while preserving collaboration and the actual items changed.') },
  { label: b('过程表达', 'Process'), original: b('看了三个同类网站，记录报名步骤。', 'Looked at three similar websites and recorded their sign-up steps.'), suggestion: b('对比三个同类网站，整理报名流程。', 'Compared three similar websites and mapped their sign-up flows.'), reason: b('保留“三个”的原始事实，不把对比升级为用户研究。', 'Preserves the original count of three and does not recast comparison as user research.') },
]
