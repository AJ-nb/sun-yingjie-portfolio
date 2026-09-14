from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / 'private/sources/pdf-cases.json'
cases = json.loads(DATA.read_text(encoding='utf-8-sig'))

# The paired text below describes the visible proposals. It does not convert
# claims in the original presentation boards into tested product performance.
copy = {
'plumber': {
 'tags': (['产品系统','市政维护','服务设计','游戏化界面'], ['Product systems','Municipal maintenance','Service design','Gamified interfaces']),
 'zh': [
  '引渡者从排水管道淤积和地下维护作业出发，把清淤机器人、地下基站和公众参与界面放进同一套服务提案。项目关注设备如何被部署、作业信息如何呈现，以及市政工人、市民和管理方之间的关系。',
  '本项目为合作项目，具体分工待补充。此处展示团队提案中的服务关系梳理、产品形态探索、部件组织、界面与场景表达。',
  '核心问题是如何将地下作业转译为可理解的操作与反馈。提案以游戏化界面连接公众参与和设备状态；实际控制权限、专业人员监督与任务边界仍是后续需要明确的系统问题。',
  '过程先用故事板、服务系统蓝图和用户旅程连接不同角色，再通过草图与 AIGC 推演探索机器人形态。后续页面将扫描、清理、巡航和返回基站组织成流程，并呈现视觉风格、操作页面、机器人与基站的分解示意。',
  '最终视觉方案以机器人、基站及地下环境为主体，同时展示控制、监控、结算和积分页面。暖色识别区域与深色机械部件形成层次，场景渲染用于说明产品之间的空间关系。',
  '已形成覆盖服务、产品、界面和场景的概念提案。现阶段成果为设计呈现，设备运行、清淤效果与游戏化参与效果尚未验证。以下保留早期演示版本的对应页面。'
 ],
 'en': [
  'PLUMBER starts with sediment buildup and underground maintenance, bringing a cleaning robot, an underground service station and a public-participation interface into one service proposal. It explores deployment, the presentation of task information, and relationships between municipal workers, residents and administrators.',
  'This is a collaborative project; the specific division of responsibilities remains to be documented. The material presents the team’s service mapping, form exploration, component organization, interfaces and scene visualization.',
  'The central question is how to translate underground work into understandable actions and feedback. The proposal uses a gamified interface to connect public participation with equipment status. Control permissions, professional supervision and task boundaries remain system questions for further development.',
  'Storyboards, a service-system blueprint and user journeys connect the different roles. Sketches and AIGC explorations then develop the robot’s form. Later pages organize scanning, cleaning, cruising and returning to the station into a proposed workflow, followed by visual direction, interface screens and exploded views of the robot and station.',
  'The final visual proposal combines the robot, service station and underground environment with control, monitoring, settlement and points screens. Warm identification areas contrast with darker mechanical parts; scene renders communicate spatial relationships between the products.',
  'The outcome is a concept proposal spanning service, product, interface and scene design. It remains a design presentation; equipment operation, cleaning performance and the effects of gamified participation have not been validated. Corresponding pages from an earlier presentation version follow.'
 ]
},
'huhu-care': {
 'tags': (['儿童体验','产品概念','呼气交互','形态模型'], ['Children’s experience','Product concept','Breath interaction','Form models']),
 'zh': [
  'HUHU CARE 关注儿童面对检查器械时的紧张感，以及理解和配合呼气操作的困难。概念以吹气球这一熟悉动作作为入口，围绕儿童、家长和医护人员之间的引导关系组织体验。',
  '本项目为合作项目，具体分工待补充。展示内容涵盖检查旅程、造型推演、手工形态模型、部件示意与场景渲染。',
  '设计需要同时考虑儿童的握持与注意力、家长对流程的理解，以及医护人员对耗材替换和状态反馈的需求。趣味化交互与检测流程的严谨性如何衔接，是方案仍需推进的重点。',
  '方案通过角色分析和检查旅程整理接触点，再以草图、手工形态模型和 AIGC 图像比较外观方向。部件表达包括可替换吹嘴、防滑握持区域、气球连接和充电底座，流程图则探索连续操作与灯光提示。部分故事画面由 Midjourney 生成。',
  '最终方案采用圆润的手持形态，将气球、握持区域和底座组织为一组产品。产品图和儿童场景呈现了造型、配色和交互设想；手工模型照片记录的是形态探索。',
  '成果为儿童呼气检测的外观与体验概念，包含故事板、形态模型照片、结构示意和渲染。检测技术路线、试剂方式及临床适用性尚未验证，形态模型不代表可运行的诊断原型。以下保留早期演示版本。'
 ],
 'en': [
  'HUHU CARE explores children’s anxiety around examination equipment and the difficulty of understanding and cooperating with a breath-sampling task. Blowing up a balloon provides a familiar starting point for a guided experience involving children, parents and clinical staff.',
  'This is a collaborative project; the specific division of responsibilities remains to be documented. The presentation covers the examination journey, form exploration, handmade form models, component diagrams and scene renders.',
  'The design considers children’s grip and attention, parents’ understanding of the process, and staff needs around replaceable consumables and status feedback. Connecting a playful interaction with a rigorous examination workflow remains an important question for further development.',
  'Role analysis and an examination journey establish the touchpoints. Sketches, handmade form models and AIGC images compare visual directions. Component studies include a replaceable mouthpiece, textured grip, balloon connection and charging base; a process diagram explores the sequence and light cues. Some storyboard images were generated with Midjourney.',
  'The final proposal uses a rounded handheld form, grouping the balloon, grip and base into a product family. Product images and scenes with children communicate form, color and interaction ideas. The handmade-model photographs document form exploration.',
  'The outcome is an appearance and experience concept for pediatric breath testing, with storyboards, form-model photographs, component diagrams and renders. The diagnostic approach, reagent format and clinical suitability have not been validated; the form model is not a functioning diagnostic prototype. Earlier presentation versions follow.'
 ]
},
'go-glow': {
 'tags': (['模块化','个人护理','旅行场景','产品与界面'], ['Modularity','Personal care','Travel scenarios','Product and interface']),
 'zh': [
  'GO GLOW 以旅行中的个护用品携带、收纳和充电为切入点。原提案面向女性用户，将牙刷、洁面和头皮护理三个方向纳入同一套产品语言，探索日常与出行之间的转换。',
  '本项目为合作项目，具体分工待补充。展示内容包括需求情境、模块组合、草图、使用方式、配套界面与产品渲染。',
  '多个护理功能共用一个主体时，模块识别、替换动作和收纳关系需要保持清楚。设计的重点是让组合方式易于理解，同时为不同接触部位保留各自的形态需求。',
  '用户旅程从行李准备延伸到使用和维护，再通过草图探索手柄与护理头的关系。产品页面展示不同模块的使用姿态，配套应用以低保真结构和高保真界面表达模式与信息组织。',
  '最终呈现一组具有统一轮廓和配色的护理模块，以及相应的产品组合图和界面。多种端部形态区分牙刷、洁面与头皮护理用途，共用主体构成系列识别。',
  '已形成产品与界面概念提案。模块连接、防水、清洁效果和实际收纳表现仍需样机与测试验证。以下保留早期演示版本中的背景页面。'
 ],
 'en': [
  'GO GLOW begins with carrying, storing and charging personal-care products while traveling. The original proposal focuses on women and brings toothbrush, facial-cleansing and scalp-care directions into one product language, exploring the transition between everyday and travel use.',
  'This is a collaborative project; the specific division of responsibilities remains to be documented. The material covers use scenarios, module combinations, sketches, usage illustrations, a companion interface and product renders.',
  'When several care functions share one body, module identification, replacement actions and storage relationships need to remain clear. The design explores understandable combinations while allowing different contact areas to retain their own form requirements.',
  'The user journey extends from packing through use and maintenance. Sketches then explore the relationship between the handle and care attachments. Product pages show how the modules are held and used, while low- and high-fidelity app screens express modes and information organization.',
  'The final presentation combines care attachments with a consistent silhouette and color language, product arrangements and interface screens. Different end forms distinguish toothbrush, facial-cleansing and scalp-care uses; the shared body establishes family resemblance.',
  'The outcome is a product and interface concept proposal. Module connections, water resistance, cleaning performance and practical storage require prototypes and testing. An earlier version of the background presentation page follows.'
 ]
},
'lingmu': {
 'tags': (['无障碍','洗浴体验','人机关系','模块布局'], ['Accessibility','Bathing experience','Ergonomics','Module layout']),
 'zh': [
  'LINGMU 面向无臂人士及上肢活动受限的洗浴情境，关注洗头、清洁身体、调节水温和操作开关时对双手或他人协助的依赖。项目从浴室中的身体动作和设备位置关系出发。',
  '本项目为合作项目，具体分工待补充。展示内容涵盖需求情境、用户旅程、洗头故事板、形态草图、清洁模块与使用场景。',
  '设计的关键是让清洁区域和控制方式位于使用者能够触及的位置，并适应不同的身体状态。头部与身体模块的高度、移动范围和接近方式构成布局探索的重点。',
  '前期页面以人物情境和旅程整理操作障碍，再从整体淋浴布局和局部清洁模块展开草图。后续方案展示垂直设备布局、可调清洗部件、控制位置和材料设想，以人物比例表达使用关系。',
  '最终视觉方案将头部与身体清洁模块布置在垂直结构上，结合身体可触及的控制方式。分解图、局部展示和整体场景共同表达模块之间的连接及人机位置关系。',
  '成果为无障碍洗浴概念提案。现有材料呈现布局和操作设想，清洁覆盖、湿区安全与不同人群的实际使用体验仍需实物验证。'
 ],
 'en': [
  'LINGMU explores bathing for people with absent or limited upper-limb function. It focuses on dependence on hands or assistance when washing hair and the body, adjusting water temperature and operating switches, starting with the relationship between body movement and equipment position.',
  'This is a collaborative project; the specific division of responsibilities remains to be documented. The material covers use scenarios, a user journey, a hair-washing storyboard, sketches, cleaning modules and scenes of use.',
  'The key question is how to place washing areas and controls within a user’s reach while accommodating different physical conditions. Module height, movement range and approach to the head and body guide the layout exploration.',
  'Early pages use personal scenarios and a journey to organize interaction barriers. Sketches explore both the overall shower layout and local cleaning modules. The developed proposal shows a vertical arrangement, adjustable washing parts, control locations and material ideas, with human figures communicating the relationship to the body.',
  'The final visual proposal places head- and body-cleaning modules on a vertical structure with controls intended to be reachable using the body. Exploded views, details and an overall scene describe the connections and spatial relationships.',
  'The outcome is an accessible-bathing concept proposal. The material presents layout and interaction ideas; cleaning coverage, wet-area safety and use by different people still require physical validation.'
 ]
},
'jimu-studio': {
 'tags': (['家具概念','材料应用','小空间','模块化'], ['Furniture concept','Material application','Compact spaces','Modularity']),
 'zh': [
  'JiMu Studio 将农业副产物的材料再利用与有限居住空间中的收纳、阅读和工作联系起来。提案以玉米芯复合板材为材料设想，探索一件能够移动、展开和组合的家具。',
  '本项目为合作项目，具体分工待补充。展示内容包括材料方向比较、使用情境、家具草图、模块分解、尺寸表达和居家渲染。',
  '收纳柜、工作面和座凳需要在有限占地内建立清晰关系。设计同时探索材料的视觉质感与家具结构如何衔接，以及展开和收起状态之间的转换。',
  '方案从植物来源材料及家具应用方向展开，再借助用户画像和草图组织功能。后续页面呈现板材设想、柜体与桌面组合、模块分解和尺寸关系，并将家具放入居住场景中观察整体比例。',
  '最终概念包含移动柜体、可调桌面和独立座凳。板材的颗粒感与简洁的块面共同构成视觉语言，组合图展示不同部件在收纳和使用状态中的关系。',
  '成果为材料应用与模块化家具提案。板材配方、材料性能、承载和连接结构尚未通过样品与测试验证；当前呈现的是材料与家具的设计设想。'
 ],
 'en': [
  'JiMu Studio connects reuse of agricultural byproducts with storage, reading and work in limited living space. A proposed corncob-based composite board provides the material direction for furniture that can move, unfold and combine.',
  'This is a collaborative project; the specific division of responsibilities remains to be documented. The presentation covers material directions, use scenarios, furniture sketches, module breakdowns, dimensions and domestic renders.',
  'The storage cabinet, work surface and stool need a clear relationship within a compact footprint. The design also explores how the visual character of the material connects with furniture structure and how the arrangement moves between stored and open states.',
  'The proposal begins with plant-derived materials and furniture applications, then uses a persona and sketches to organize functions. Later pages show the board concept, cabinet and desktop combinations, module breakdowns and dimensions. Domestic scenes place the furniture in context to explore overall proportions.',
  'The final concept includes a mobile cabinet, an adjustable desktop and a separate stool. The proposed board’s granular appearance and simple surfaces establish the visual language; combination views show the parts in storage and use.',
  'The outcome is a material-application and modular-furniture proposal. Board formulation, material properties, load capacity and connections have not been validated through samples and testing. The current presentation is a material and furniture design concept.'
 ]
},
'plant-companion': {
 'tags': (['桌面健身','仿生设计','模块化','虚拟养植'], ['Desktop fitness','Biomorphic design','Modularity','Virtual growing']),
 'zh': [
  '植遇相伴以久坐办公、桌面空间有限和运动动力不足为情境，将轻量运动器材与植物形态联系起来。产品在收纳状态下融入桌面，应用则用虚拟养植与打卡表达持续活动的激励设想。',
  '本项目为团队合作项目，具体分工与其他成员署名待补充。展示内容涵盖需求整理、植物仿生、器材模块、CMF、像素植物与应用界面。',
  '项目需要协调两种状态：安静融入工作环境的桌面物件，以及取出后容易理解的运动器材。模块识别、收纳顺序和运动反馈之间的联系，是产品与界面共同处理的问题。',
  '方案从办公人群情境、竞品和需求梳理出发，以植物形态探索可收纳的器材组合。后续呈现哑铃、跳绳、按摩球和弹力带的用法，并将像素植物、卡片、成长记录和打卡串联为应用流程。',
  '最终方案把植物般的桌面外观与可组合器材联系起来，以清新的配色建立系列关系。产品说明、模块使用图、界面规范和高保真页面共同表达实体运动与虚拟养植之间的互动设想。',
  '已形成产品与应用界面的完整概念提案。器材连接与使用体验、运动记录方式、长期参与及健康效果仍需样机和用户验证。'
 ],
 'en': [
  'Plant Companion uses sedentary office work, limited desk space and low motivation to exercise as its design context. Lightweight exercise equipment takes on plant-inspired forms when stored, while a companion app uses virtual growing and check-ins to explore encouragement for regular activity.',
  'This is a team project; the division of responsibilities and other team credits remain to be documented. The material covers needs, plant-inspired forms, equipment modules, CMF, pixel plants and app interfaces.',
  'The project needs to coordinate two states: a desk object that fits quietly into work surroundings, and exercise equipment whose use is understandable when removed. Module recognition, storage order and activity feedback are shared product and interface questions.',
  'Office scenarios, competitor observations and needs inform a storable equipment combination inspired by plants. The developed proposal shows dumbbell, skipping-rope, massage-ball and resistance-band uses, then links pixel plants, cards, growth records and check-ins into an app flow.',
  'The final proposal connects a plant-like desktop appearance with combinable equipment, using a fresh color palette to establish a family. Product descriptions, module illustrations, interface guidelines and high-fidelity screens express the proposed relationship between physical activity and virtual growing.',
  'The outcome is a complete product and app-interface concept proposal. Equipment connections and usability, activity recording, long-term participation and health effects require prototypes and user validation.'
 ]
},
'bat-quad': {
 'tags': (['交通工具','仿生造型','四轮越野','课程概念'], ['Transportation','Biomorphic form','Off-road quad','Course concept']),
 'zh': [
  '项目以蝙蝠的形态特征为起点，探索休闲越野电动车的外观。展板把仿生意象延伸到车头、车身轮廓和部件组合。',
  '本项目为合作项目，具体分工与其他成员署名待补充。展示内容包括草图、整车造型、部件分解、三视图和配色研究。',
  '重点是让仿生特征与四轮车的座椅、车架、轮胎和操作区域形成连贯的比例关系，同时保持整车的方向感和识别。',
  '草图从蝙蝠意象发展车头和侧面轮廓，再通过分解图安排车架、座椅、照明与显示部件。三视图和人物尺度表达补充整体比例，配色渲染比较不同的视觉效果。',
  '最终展板集中呈现整车多视角、细节、结构示意与配色。蝙蝠意象通过车头和外壳折面形成视觉主题。',
  '成果为四轮越野车的造型概念与课程展板，尚未进入实车验证阶段。动力、电池与车辆性能不作为已实现规格。'
 ],
 'en': [
  'This project takes bat forms as a starting point for the appearance of a recreational electric off-road vehicle. The board extends the biomorphic reference into the front, body silhouette and component arrangement.',
  'This is a collaborative project; the division of responsibilities and other team credits remain to be documented. The material includes sketches, overall form, component breakdowns, orthographic views and color studies.',
  'The focus is on connecting the bat-inspired character with the seat, frame, wheels and control area in coherent proportions while maintaining a clear direction and identity.',
  'Sketches develop the front and side silhouette from the bat reference. Exploded views organize the frame, seat, lighting and display. Orthographic views and human-scale illustrations supplement the proportions, while color renders compare visual treatments.',
  'The final board brings together multiple views, details, component diagrams and colors. The front and faceted bodywork carry the bat-inspired visual theme.',
  'The outcome is an electric-quad form concept and course presentation board, without vehicle testing. Powertrain, battery and vehicle-performance descriptions are not established specifications.'
 ]
},
'baobab-glow': {
 'tags': (['便携照明','太阳能概念','仿生设计','教育场景'], ['Portable lighting','Solar concept','Biomorphic design','Learning scenarios']),
 'zh': [
  'BAOBAB GLOW 以猴面包树意象，以及非洲地区的学习和放学后移动照明为概念背景。方案把手持携带与桌面放置放进同一件便携灯中。',
  '本项目为合作项目，原展板署名邓志成；具体分工待补充。展示内容涵盖产品形态、部件关系、故事板与使用场景。',
  '灯具需要在携带与放置时保持清楚的使用方式。造型探索围绕提握、立放、光线方向和太阳能供电设想展开。',
  '方案从树木形态建立产品意象，以分解示意展示灯体、透镜、电池和开关关系。故事板进一步把课堂、步行与居家阅读串联起来，观察同一灯具在不同情境中的使用姿态。',
  '最终展板呈现一件可手持、可桌面放置的照明概念，通过结构分解和多场景图表达形态与用途。原展板署名完整保留。',
  '成果为便携照明概念展板。太阳能供电、照度、续航和当地实际使用表现尚未经过验证。'
 ],
 'en': [
  'BAOBAB GLOW draws on baobab forms and learning and after-school lighting scenarios in Africa. The concept combines handheld carrying and tabletop placement in one portable light.',
  'This is a collaborative project. The original board credits Deng Zhicheng (邓志成); the specific division of responsibilities remains to be documented. The material presents product form, component relationships, a storyboard and use scenarios.',
  'The light needs understandable modes for carrying and placement. Form exploration addresses the grip, standing position, light direction and a proposed solar-power approach.',
  'Tree forms establish the product reference. An exploded view shows relationships between the body, lens, battery and switch. Storyboards connect classrooms, walking and reading at home to explore how one light is used in different situations.',
  'The final board presents a lighting concept for handheld and tabletop use through a component breakdown and multiple scenarios. The original credit remains visible on the board.',
  'The outcome is a portable-lighting concept board. Solar power, illuminance, battery life and performance in the proposed local setting have not been validated.'
 ]
},
'water-walking-bath': {
 'tags': (['适老设计','洗浴设备','水中活动','人机布局'], ['Age-friendly design','Bathing equipment','Water activity','Ergonomic layout']),
 'zh': [
  '项目将老年人进出浴缸、获得身体支撑和进行水中轻活动的需求结合，探索洗浴设备的内部布局。侧向入口、扶手和座位构成主要接触点。',
  '本项目为合作项目，原展板署名邓志成，指导老师为陶裕仿；具体分工待补充。展示内容涵盖入口、支撑部件、内部机构与人机尺度。',
  '设计需要协调进出空间、坐姿休息和水中步行区域，避免多种功能的组合使操作关系难以理解。控制位置和支撑路径也是布局的重点。',
  '方案先组织浴缸入口、扶手、座位和显示器位置，再用分解示意呈现跑步机与推流器等内部部件的设想。三视图和人物比例补充空间关系。',
  '最终展板将侧向进入、扶手支撑、座位与水中步行区域集中呈现，配以构造说明、细节和尺度示意。原有作者与指导教师署名保留在图中。',
  '成果为适老洗浴设备概念与课程展板。进出、密封、防滑、承载和水中活动的实际体验仍需验证，未形成康复效果结论。'
 ],
 'en': [
  'This project combines older users’ needs for entering and leaving a bathtub, physical support and light movement in water. A side entrance, handrails and a seat form the main contact points in an exploration of the interior layout.',
  'This is a collaborative project. The original board credits Deng Zhicheng (邓志成) and advisor Tao Yufang (陶裕仿); the specific division of responsibilities remains to be documented. The material covers access, support features, internal mechanisms and human-scale relationships.',
  'The design needs to coordinate access space, seated rest and a water-walking area without making the arrangement difficult to understand. Control locations and the sequence of support points are also central to the layout.',
  'The proposal first arranges the entrance, handrails, seat and display. An exploded diagram then presents proposed internal parts, including a treadmill and water-flow device. Orthographic views and human figures add spatial context.',
  'The final board presents side access, handrail support, seating and a water-walking area with construction explanations, details and scale illustrations. The original author and advisor credits remain visible.',
  'The outcome is an age-friendly bathing concept and course board. Access, sealing, slip resistance, load capacity and the practical water-activity experience require validation; no rehabilitation outcome has been established.'
 ]
},
'yuju': {
 'tags': (['应用界面','共享服务','信息结构','视觉规范'], ['App interface','Sharing service','Information structure','Visual guidelines']),
 'zh': [
  '雨聚围绕共享雨伞的集中租借与归还建立应用概念，把位置查询、账户、信用积分和帮助功能放入一套绿色视觉系统。',
  '本项目为合作项目，具体分工与其他成员署名待补充。展示内容涵盖命名、伞形标识、视觉规范、页面关系与界面样机。',
  '共享服务需要让用户理解到哪里借还、如何查看账户状态，以及遇到问题时从哪里获得帮助。界面结构围绕这些基本任务展开。',
  '命名从“雨”与“聚”建立共享情境，标识借用雨伞轮廓。界面组织覆盖导航、账户、信用、帮助中心和设置，配合绿色主色、图标与页面样机形成整体表达。',
  '最终展板同时展示品牌元素、交互原型关系和应用页面，呈现共享雨伞服务的视觉与信息组织。',
  '成果为应用界面提案，当前展示的是设计页面与流程关系，未提供应用上线或服务运营结果。'
 ],
 'en': [
  'Yuju develops an app concept around shared umbrella pickup and return. Location search, accounts, credit points and help functions sit within a green visual system.',
  'This is a collaborative project; the division of responsibilities and other team credits remain to be documented. The material covers naming, an umbrella-shaped mark, visual guidelines, screen relationships and interface mockups.',
  'The sharing service needs to communicate where users can collect and return umbrellas, how to check account status and where to find help. The interface structure develops around these basic tasks.',
  'The name combines ideas of rain and gathering, while the mark uses an umbrella silhouette. Navigation, accounts, credit, a help center and settings establish the screen organization, supported by green as the primary color, icons and mockups.',
  'The final board combines brand elements, interaction-prototype relationships and app screens to present the service’s visual and information organization.',
  'The outcome is an app-interface proposal. The presentation consists of screens and flow relationships; no app launch or service-operation results are documented.'
 ]
},
'construction-recycler': {
 'tags': (['装备概念','模块运输','建筑废料','系统布局'], ['Equipment concept','Modular transport','Construction waste','System layout']),
 'zh': [
  '项目以建筑拆除废料再利用和设备移动部署为情境，探索现场处理装备的模块划分。不同处理环节被安排在可分别运输的单元中。',
  '本项目为合作项目，具体分工与其他成员署名待补充。展示内容涵盖工艺流程、模块布局、运输组合、剖视与部件特写。',
  '关键问题是如何把连续的物料处理流程拆分为独立运输单元，并让组合后的进料、处理和输出关系保持清楚。',
  '提案划分进料、破碎分选、粉碎及混合成型环节，再探索模块的车载布局和组合方式。剖视示意与局部图用于表达内部通道和部件之间的空间关系。',
  '最终横向展板将各模块与物料流程并列展示，同时呈现运输状态和组合使用设想，形成一套移动回收装备的视觉提案。',
  '成果为模块化装备概念。分选、处理能力及成型材料尚未通过设备、样品和计算验证。'
 ],
 'en': [
  'This project uses reuse of demolition waste and mobile deployment as the setting for a modular on-site processing system. Different processing stages are arranged in units intended for separate transport.',
  'This is a collaborative project; the division of responsibilities and other team credits remain to be documented. The material covers process flow, module layout, transport arrangements, cutaways and component details.',
  'The key question is how to divide a continuous material-processing sequence into independently transported units while keeping feeding, processing and output relationships understandable when assembled.',
  'The proposal separates feeding, crushing and sorting, pulverizing, and mixing and forming. Vehicle-mounted layouts and combinations are then explored. Cutaways and detail views communicate internal passages and the spatial relationships between parts.',
  'The final horizontal board presents the modules alongside the material flow, including transport states and a proposed combined arrangement. Together these form a visual proposal for mobile recycling equipment.',
  'The outcome is a modular equipment concept. Sorting, processing capacity and formed materials have not been validated through equipment, samples or calculations.'
 ]
},
'cloudwing': {
 'tags': (['交通概念','载人飞行器','曲面造型','座舱布局'], ['Transport concept','Passenger aircraft','Surface design','Cabin layout']),
 'zh': [
  '云端之翼以未来载人垂直起降飞行器为主题，探索机身曲面、进出方式和乘坐空间之间的关系。方案聚焦整体形态与座舱体验的视觉表达。',
  '本项目为合作项目，具体分工与其他成员署名待补充。展示内容包括草图、机身比例、舱盖、座舱、起降支撑和场景渲染。',
  '设计需要让连续曲面、舱盖开合和乘员空间构成一致的整体，同时表达机身与支撑结构在静止和飞行情境中的关系。',
  '草图先推演机身和舱体比例，后续通过多视角展示舱盖、座舱与支撑结构。配色和场景图进一步探索未来交通工具的视觉性格。',
  '最终展板呈现连续的机身表面、座舱开启关系和乘坐空间，并以多角度渲染表达整机外观。',
  '成果为飞行器造型概念。动力架构、空气动力、实际飞行与安全性尚未验证；当前图像不代表可飞行原型。'
 ],
 'en': [
  'CloudWing explores a future VTOL passenger aircraft through the relationship between body surfaces, access and seating space. The proposal focuses on the visual expression of overall form and cabin experience.',
  'This is a collaborative project; the division of responsibilities and other team credits remain to be documented. The material includes sketches, body proportions, a canopy, cabin, landing supports and scene renders.',
  'The design needs to connect continuous surfaces, canopy opening and passenger accommodation into a consistent whole, while showing how the body relates to its supports in stationary and flight scenarios.',
  'Sketches develop body and cabin proportions. Multiple views then explore the canopy, interior and support structures. Color and scenario images further investigate the visual character of a future vehicle.',
  'The final board presents continuous body surfaces, cabin access and passenger space, with multiple render angles describing the overall appearance.',
  'The outcome is an aircraft form concept. Propulsion architecture, aerodynamics, flight and safety have not been validated; the images do not represent a flying prototype.'
 ]
},
'little-orange': {
 'tags': (['日常轻活动','坐姿踏板','仿生造型','产品界面'], ['Light daily activity','Seated pedals','Biomorphic form','Product interface']),
 'zh': [
  '小橘运动加油站面向居家或办公的坐姿腿部活动，以橘子形态为视觉起点，探索放在桌下或座椅前使用的踏板设备。',
  '本项目为合作项目，具体分工与其他成员署名待补充。展示内容包括形态草图、踏板机构、分解图、界面、提手与遥控器收纳。',
  '设计需要协调脚部活动空间、坐姿视线和日常搬移，同时让档位、时间与控制方式容易识别。',
  '方案以橘子意象安排外壳与踏板比例，用分解示意组织传动、电机、显示与外壳关系。灯光、显示页面和遥控收纳进一步表达使用时的反馈与整理方式。',
  '最终展板呈现圆润外壳、双踏板、提手、显示区域和遥控器位置，配以坐姿使用及配色图。',
  '成果为日常轻活动设备概念。运动表现、噪声、人体适配和康复收益尚未验证。'
 ],
 'en': [
  'Little Orange addresses seated leg movement at home or in the office. An orange-inspired form provides the starting point for a pedal device placed under a desk or in front of a chair.',
  'This is a collaborative project; the division of responsibilities and other team credits remain to be documented. The material covers sketches, a pedal mechanism, an exploded view, an interface, a handle and remote-control storage.',
  'The design needs to coordinate foot clearance, seated viewing and everyday carrying, while making speed levels, time and controls easy to recognize.',
  'The proposal arranges the shell and pedals around an orange-inspired form. An exploded diagram organizes transmission, motor, display and housing. Lighting, display screens and remote storage express the intended feedback and tidying process.',
  'The final board presents a rounded housing, two pedals, a handle, display area and remote location, supported by seated-use and color illustrations.',
  'The outcome is a concept for light daily activity. Exercise performance, noise, ergonomic fit and rehabilitation benefits have not been validated.'
 ]
},
'water-guardian': {
 'tags': (['水体维护','清藻概念','浮体装备','结构表达'], ['Water maintenance','Algae-cleaning concept','Floating equipment','Component visualization']),
 'zh': [
  '水中卫士以水面藻类收集和水体维护为背景，探索移动浮体、过滤入口与清洁模块的组合。提案通过圆角体块表达水面装备的整体形态。',
  '本项目为合作项目，原资料包含邓志成、张成承署名；具体分工待补充。展示内容涵盖草图、浮体布局、过滤与清洁部件、三视图和场景渲染。',
  '重点是组织水面入口、浮体空间和顶部设备层，使收集位置与维护部件之间的关系可被理解。',
  '方案以草图探索圆角浮体轮廓，再通过分解图和三视图安排过滤入口、内部模块与顶部部件。细节和水面场景用于表达设备的外观与使用位置。',
  '最终展板集中呈现浮体装备、部件关系和水面工作情境，保留原方案的结构示意与视觉表达。',
  '成果为清藻装备概念展板。过滤、清藻方式、生态影响和水质改善尚未通过实测验证。'
 ],
 'en': [
  'Water Guardian uses surface-algae collection and water maintenance as the context for combining a moving floating body, filtering openings and cleaning modules. Rounded volumes establish the overall form of the proposed equipment.',
  'This is a collaborative project. The source credits include Deng Zhicheng (邓志成) and Zhang Chengcheng (张成承); the specific division of responsibilities remains to be documented. The material covers sketches, floating-body layout, filtering and cleaning parts, orthographic views and scene renders.',
  'The focus is on organizing water-level openings, flotation volume and the upper equipment layer so that collection positions and maintenance parts have understandable relationships.',
  'Sketches explore a rounded floating silhouette. Exploded and orthographic views then arrange the filtering openings, internal modules and upper parts. Details and water scenes communicate the appearance and intended operating position.',
  'The final board brings together the floating equipment, component relationships and a water-surface scenario, preserving the original proposal’s diagrams and visualization.',
  'The outcome is an algae-cleaning equipment concept board. Filtering, algae-removal methods, ecological effects and water-quality improvement have not been tested.'
 ]
},
'ecological-harvest': {
 'tags': (['城市清洁','落叶回收','装备概念','物料流程'], ['Urban cleaning','Leaf collection','Equipment concept','Material flow']),
 'zh': [
  '生态丰收漫游者以城市道路的落叶清扫和有机物循环使用为情境，探索在移动清洁设备内组织收集、分选、储存与处理模块。',
  '本项目为合作项目，具体分工与其他成员署名待补充。展示内容包括整车造型、内部通道、模块配置、信息屏、维护位置和人机尺度。',
  '项目关注落叶从进入设备到储存和处理的路径，以及内部流程如何对应外部开口和维护位置。',
  '方案将清扫刷、吸尘入口、储存区和处理通道安排在整车布局中，通过内部结构、三视图和人物比例表达空间关系。外部信息屏与场景渲染补充设备在道路环境中的形象。',
  '最终展板呈现整车外观、内部功能区与物料流程，形成落叶收集和处理设备的系统视觉提案。',
  '成果为城市清洁装备概念。落叶转化工艺、清扫能力、无人驾驶与环境收益仍需设备和流程验证。'
 ],
 'en': [
  'Ecological Harvest Rambler uses urban leaf sweeping and reuse of organic material as the setting for a mobile cleaning system. The concept organizes collection, sorting, storage and processing modules within one vehicle.',
  'This is a collaborative project; the division of responsibilities and other team credits remain to be documented. The material includes vehicle form, internal passages, module configuration, an information display, maintenance positions and human-scale illustrations.',
  'The project focuses on the path from leaf intake to storage and processing, and on how internal stages relate to external openings and maintenance access.',
  'Sweeping brushes, a suction opening, storage and processing passages are arranged within the vehicle. Internal views, orthographic drawings and human figures express spatial relationships. An external display and scene renders place the equipment visually in a street setting.',
  'The final board presents exterior form, internal functional zones and material flow as a system visualization for leaf collection and processing equipment.',
  'The outcome is an urban-cleaning equipment concept. Leaf-conversion processes, sweeping capacity, autonomous driving and environmental benefits require equipment and process validation.'
 ]
},
'purewater-rolling-filter': {
 'tags': (['取水运输','容器设计','过滤概念','使用状态'], ['Water transport','Container design','Filtering concept','Use configurations']),
 'zh': [
  'PureWater 以非洲农村与偏远地区的长距离取水和家庭储水为设计情境，把可推行容器与可拆分过滤层联系起来。',
  '原展板署名孙英杰，本案例按合作项目收录，具体分工待补充。展示内容包括滚动运输、叠放过滤、提拉杆、固定结构和出水口。',
  '设计需要让运输状态和静置使用状态之间的转换清楚可见，同时组织容器、手柄与过滤层的拆合关系。',
  '方案通过可推行容器减少直接提举的设计设想，并将过滤层安排为竖向叠放组合。分解图呈现提拉杆、固定结构、出水口和层间关系，人物比例与三视图补充两种状态的表达。',
  '最终展板并列呈现滚动运输与叠放过滤，展示容器和过滤层的组合方式。孙英杰的原展板署名完整保留。',
  '成果为取水、运输与过滤设备概念。实际运输负担、过滤表现和饮用水安全尚未验证。'
 ],
 'en': [
  'PureWater uses long-distance water collection and household storage in rural Africa and remote areas as its design context, connecting a rolling container with separable filtering layers.',
  'The original board credits Sun Yingjie (孙英杰). This case is presented as a collaborative project; the specific division of responsibilities remains to be documented. The material covers rolling transport, stacked filtering, a pull handle, fastening parts and an outlet.',
  'The design needs to make the transition between transport and stationary use understandable, while organizing how the container, handle and filter layers connect and separate.',
  'The proposal explores rolling transport as a way to reduce direct lifting, with filtering layers arranged in a vertical stack. An exploded view presents the pull handle, fastening structure, outlet and layer relationships. Human figures and orthographic views illustrate the two configurations.',
  'The final board shows rolling transport and stacked filtering side by side, explaining how the container and filtering layers combine. Sun Yingjie’s original board credit remains visible.',
  'The outcome is a water-collection, transport and filtering concept. Practical transport effort, filtering performance and drinking-water safety have not been validated.'
 ]
},
'polar-wing': {
 'tags': (['未来出行','eVTOL概念','多人座舱','分布式推进形态'], ['Future mobility','eVTOL concept','Multi-seat cabin','Distributed propulsion form']),
 'zh': [
  '极翼以未来城市空中出行为情境，探索载人级无人驾驶 eVTOL 的机身、多人座舱与分布式推进单元。项目从未来交通工具的整体比例与部件组织展开。',
  '本项目为合作项目，具体分工与其他成员署名待补充。展示内容包括情境参考、草图、座舱、座椅、透明舱盖、推进部件和多视角渲染。',
  '设计需要将多人乘坐空间、透明舱体和外部推进单元纳入连贯的机身形态，同时保持各部分的位置关系可被辨识。',
  '方案通过情境与草图比较机身及推进单元的配置，继而展示座舱、座椅和舱盖的分解关系。多视角场景及尺寸示意补充整机的比例表达。',
  '最终展板呈现带多个推进单元的载人飞行器形态，保留多人座舱、构造示意与场景图。该方案与云端之翼分别呈现不同的形态方向。',
  '成果为未来出行概念展板。电推进、无人驾驶、航程和飞行安全仍属待验证方向，未形成可飞行原型的证据。'
 ],
 'en': [
  'Polar Wing explores an autonomous passenger eVTOL for future urban air mobility, combining an aircraft body, a multi-seat cabin and distributed propulsion units. The project develops overall proportions and component organization.',
  'This is a collaborative project; the division of responsibilities and other team credits remain to be documented. The material includes scenario references, sketches, a cabin, seats, a transparent canopy, propulsion parts and multiple render views.',
  'The design needs to incorporate seating for several passengers, a transparent cabin and external propulsion units into a coherent body while keeping their locations understandable.',
  'Scenarios and sketches compare body and propulsion layouts. The proposal then shows cabin, seat and canopy relationships through component views. Multiple scenes and dimension illustrations supplement the overall proportions.',
  'The final board presents a passenger-aircraft form with multiple propulsion units, a multi-seat cabin, construction diagrams and scenes. It represents a different form direction from CloudWing.',
  'The outcome is a future-mobility concept board. Electric propulsion, autonomous operation, range and flight safety remain unvalidated directions; there is no evidence of a flying prototype.'
 ]
},
'rendering-studies': {
 'tags': (['3D视觉','材质与灯光','自行车渲染','动态影像'], ['3D visualization','Materials and lighting','Bicycle renders','Motion studies']),
 'zh': [
  '本组选集围绕材质、灯光、构图与场景展开，包含自行车静态图、产品渲染长卷和跑车动态习作。不同主题共同探索产品在细节、完整形态与环境中的视觉呈现。',
  '展示方向为 3D 渲染与场景呈现。选集中的模型、背景、参考素材及协作分工未逐项列明，本案例聚焦可见的视觉研究。',
  '核心问题是如何通过镜头距离、环境光和材质反差组织观看顺序：完整产品建立轮廓，局部图表达表面与连接细节，场景与动态镜头补充氛围和节奏。',
  '自行车组比较暗色整车、雪地与山地场景，以及车架、水壶、车把和传动部件的近景。产品长卷通过配色、组合和环境光呈现个护、健身、灯具及装备；动态短片则切换极光和沙漠场景，展示跑车车身与运动镜头。',
  '作品分为自行车静态组、产品与场景长卷、跑车动态习作三个部分。长卷包含 GO GLOW、HUHU CARE、植遇相伴、引渡者及其他视觉主题；跑车短片约 28 秒，画面中的 Ferrari 标志属于所展示车辆。',
  '成果为静态与动态视觉习作。选集展示图像表达，不将出现的品牌视为委托客户，也不据此声明汽车或自行车产品造型为原创设计。'
 ],
 'en': [
  'This selection explores materials, lighting, composition and scenes through bicycle stills, a long-format product-render collection and a sports-car motion study. Together they examine products as details, complete forms and objects within an environment.',
  'The presentation focuses on 3D rendering and scene visualization. Individual models, backgrounds, references and collaborative responsibilities are not itemized; the case addresses the visible visual studies.',
  'The central question is how camera distance, environmental lighting and material contrast direct attention. Overall views establish silhouette, close-ups describe surfaces and connections, and scenes and moving shots add atmosphere and rhythm.',
  'The bicycle group compares a dark overall view, snow and mountain settings, and close-ups of the frame, bottle, handlebar and drivetrain. The product collection uses colors, arrangements and environmental light across personal care, fitness, lighting and equipment. The motion study alternates aurora and desert settings to show the car body and movement.',
  'The work is presented in three groups: bicycle stills, the product-and-scene collection, and the sports-car motion study. The long collection includes GO GLOW, HUHU CARE, Plant Companion, PLUMBER and other visual themes. The car film runs for approximately 28 seconds; the Ferrari marks belong to the depicted vehicle.',
  'The outcome is a selection of still and motion visualization studies. Brands shown are not presented as commissioning clients, and this selection does not claim original authorship of the depicted car or bicycle product designs.'
 ]
}
}

def pg(slug, n):
    return f'/works/documents/{slug}/{n:03d}.webp'

# Section number: background 0, role 1, question 2, process 3, work 4, stage 5.
page_sections = {
 'plumber': ('portfolio-51', {0:[3,4,5],2:[6,7],3:[8,9,10,11,12,13,14],4:[15,16,17]}),
 'huhu-care': ('portfolio-51', {0:[18,19,20],2:[21,22],3:[23,24,25,26],4:[27,28]}),
 'go-glow': ('portfolio-51', {0:[29,30,31],2:[32],3:[33,35],4:[34,36]}),
 'lingmu': ('portfolio-51', {0:[37,38],2:[39],3:[40,41,42],4:[43]}),
 'jimu-studio': ('portfolio-51', {0:[44,45],2:[46],3:[47,48],4:[49]}),
 'plant-companion': ('office-fitness', {0:[1,2,3],2:[4,5,6],3:[7,10,11],4:[8,9,12]})
}
page_captions = {
 'portfolio-51': {
  3:('引渡者项目视觉开篇','PLUMBER project opening'), 4:('项目背景与原提案研究图表','Background and research charts from the proposal'),
  5:('游戏化与公众参与的概念框架','Concept framework for gamification and public participation'), 6:('故事板与服务系统蓝图','Storyboard and service-system blueprint'),
  7:('角色与用户旅程','Roles and user journey'), 8:('机器人草图与 AIGC 形态探索','Robot sketches and AIGC form exploration'),
  9:('产品视觉、配色与材料设想','Product visualization, colors and material ideas'),10:('扫描、清理与返回基站的流程设想','Proposed scanning, cleaning and return-to-station workflow'),
  11:('识别与成像流程示意','Proposed recognition and imaging sequence'),12:('游戏界面风格、颜色与页面组织','Game-interface direction, colors and screen organization'),
  13:('操作、监控与积分界面','Operation, monitoring and points screens'),14:('机器人与基站的分解及三视图','Robot and station exploded and orthographic views'),
  15:('清淤机器人地下场景渲染','Underground cleaning-robot scene render'),16:('机器人与环境的产品视觉','Product visualization of the robot in its environment'),
  17:('引渡者视觉展示页','PLUMBER visual presentation'),18:('HUHU CARE 项目开篇','HUHU CARE project opening'),19:('儿童检查情境与 AIGC 故事画面','Pediatric examination scenarios and AIGC storyboard images'),
  20:('呼气检测体验的背景整理','Background research for the breath-test experience'),21:('儿童、家长与医护的需求情境','Needs of children, parents and clinical staff'),
  22:('角色旅程与设计目标','Role journeys and design objectives'),23:('草图、手工形态模型与 AIGC 探索','Sketches, handmade form models and AIGC exploration'),
  24:('产品外观、材料设想与三视图','Product appearance, proposed materials and orthographic views'),25:('吹嘴、握持、灯光与底座的部件示意','Mouthpiece, grip, lighting and base diagrams'),
  26:('呼气与反馈的交互流程设想','Proposed breath interaction and feedback sequence'),27:('HUHU CARE 产品场景渲染','HUHU CARE product scene render'),28:('HUHU CARE 配色与组合展示','HUHU CARE colors and product arrangement'),
  29:('GO GLOW 项目开篇','GO GLOW project opening'),30:('旅行个护背景与原提案研究图表','Travel-care background and original proposal research charts'),
  31:('竞品观察与概念定位','Competitor observations and concept positioning'),32:('旅行准备、使用和维护旅程','Packing, use and maintenance journey'),
  33:('模块化个护产品草图','Modular personal-care sketches'),34:('护理模块与使用方式','Care attachments and usage illustrations'),35:('配套应用低保真与高保真页面','Companion-app low- and high-fidelity screens'),36:('GO GLOW 产品系列渲染','GO GLOW product-family render'),
  37:('LINGMU 项目开篇','LINGMU project opening'),38:('无障碍洗浴需求与背景研究','Accessible-bathing needs and background research'),39:('洗浴角色、旅程与操作情境','Bathing roles, journey and interaction scenarios'),
  40:('洗浴设备草图与形态方向','Bathing-equipment sketches and form directions'),41:('洗浴模块的构造与布局设想','Washing-module construction and layout concept'),42:('模块、控制与人机位置关系','Modules, controls and human-scale relationships'),43:('LINGMU 整体场景与产品呈现','LINGMU overall scene and product presentation'),
  44:('JiMu Studio 项目开篇','JiMu Studio project opening'),45:('植物材料与家具应用研究','Plant-material and furniture-application research'),46:('小空间使用情境与需求','Compact-space scenarios and needs'),
  47:('模块化家具草图与组合探索','Modular-furniture sketches and combination studies'),48:('材料、结构与尺寸设想','Proposed materials, structure and dimensions'),49:('JiMu Studio 家具与居家场景','JiMu Studio furniture and domestic scene')
 },
 'office-fitness': {
  1:('植遇相伴项目开篇','Plant Companion project opening'),2:('办公轻活动背景与原提案研究图表','Office-activity background and original research charts'),3:('办公人群画像与需求情境','Office-user profiles and needs'),
  4:('竞品观察、头脑风暴与需求整理','Competitor observations, brainstorming and needs'),5:('方案机会与挑战分析','Concept opportunities and challenges'),6:('产品定位与游戏化框架','Product positioning and gamification framework'),
  7:('植物形态与器材收纳草图','Plant forms and equipment-storage sketches'),8:('器材组合、三视图与 CMF','Equipment combination, orthographic views and CMF'),9:('哑铃、跳绳、按摩与拉伸用法','Dumbbell, skipping, massage and stretching uses'),
  10:('界面视觉规范与像素植物','Interface guidelines and pixel plants'),11:('虚拟养植、卡片与打卡流程','Virtual-growing, card and check-in flows'),12:('植遇相伴产品与应用展示','Plant Companion product and app presentation')
 }
}
bikes = [
 ('22de046ff3e66598345084183a3aea6b','暗色灯光下的整车渲染','Complete bicycle under dark lighting'),
 ('6b8d00417baa8b204447fd0857eb435a','CLIMBER MINI24 雪地场景渲染','CLIMBER MINI24 snow-scene render'),
 ('7ddd2cc1d08f22e83dbf11ca277471eb','山地自行车环境渲染','Mountain-bike environment render'),
 ('a7bdacdb33c834301102c595220b48d3','车架与水壶细节','Frame and bottle detail'),
 ('c7db2abf68343f46198039db6ab4fba6','车把局部材质与灯光','Handlebar material and lighting detail'),
 ('d426d7f675239cd43c29396f4b542fee','传动部件近景','Drivetrain close-up')
]
render = next(c for c in cases if c['id']=='rendering-studies')
render.update({
 'titleZh':'渲染与动态影像习作', 'titleEn':'Rendering & Motion Studies',
 'summaryZh':'通过自行车静态图、产品场景长卷与跑车动态短片，探索材质、灯光、镜头和环境之间的视觉关系。',
 'summaryEn':'Bicycle stills, a product-scene collection and a sports-car motion study exploring relationships between materials, lighting, cameras and environments.',
 'galleries':[f'/works/legacy/rendering/{bikes[1][0]}.webp'] + [f'/works/legacy/rendering/{b[0]}.webp' for b in bikes if b!=bikes[1]] + [pg('rendering-sheet',1)],
 'videos':[{'path':'/works/local/111.mp4','durationSeconds':27.916667,'width':960,'height':544,'fps':24,'descriptionZh':'带 Ferrari 标志跑车的极光与沙漠场景动画习作','descriptionEn':'Aurora- and desert-scene motion study featuring a sports car with Ferrari marks'}]
})
render['sources'] += ['legacy/rendering: 6 bicycle images retained as a distinct editorial group', 'local-14: 111.mp4; reviewed nine sample frames across the 27.916667-second film']
render['evidenceLimits'] += ['111.mp4 为跑车动画，与自行车6图不同；按渲染与动态视觉选集合并，不认定车辆造型原创或 Ferrari 品牌委托。','视频图像已抽样核验；音轨作者与逐项素材出处未核实。']

heads={'zh':['背景','本人职责','关键问题','设计过程','最终作品','成果与阶段'],'en':['Background','My role','Key question','Design process','Final work','Outcome and stage']}
credits = {
 'baobab-glow':('原展板署名：邓志成；合作项目','Original board credit: Deng Zhicheng (邓志成); collaborative project'),
 'water-walking-bath':('原展板署名：邓志成；指导老师：陶裕仿','Original board credit: Deng Zhicheng (邓志成); advisor: Tao Yufang (陶裕仿)'),
 'water-guardian':('合作署名：邓志成、张成承','Collaboration credits: Deng Zhicheng (邓志成), Zhang Chengcheng (张成承)'),
 'purewater-rolling-filter':('原展板署名：孙英杰；合作分工待补充','Original board credit: Sun Yingjie (孙英杰); collaborative roles to be documented'),
 'rendering-studies':('视觉习作；模型、背景与参考素材出处待逐项补充','Visual studies; individual model, background and reference credits to be documented')
}

def md_img(path, zh, en, lang):
    return f'![{zh if lang=="zh" else en}]({path})'

out = ROOT / 'web/src/content/works'
out.mkdir(parents=True, exist_ok=True)
for case in cases:
    case_id = case['id']
    d = copy[case_id]
    cpair = credits.get(case_id, ('合作项目；其他成员署名待补充','Collaborative project; other team credits to be documented'))
    case['creditsZh'],case['creditsEn'] = cpair
    case['backgroundZh'],case['backgroundEn'] = d['zh'][0],d['en'][0]
    case['processZh'],case['processEn'] = [d['zh'][3]],[d['en'][3]]
    case['resultsZh'],case['resultsEn'] = [d['zh'][5]],[d['en'][5]]
    for lang_i,lang in enumerate(['zh','en']):
        title=case['titleZh' if lang=='zh' else 'titleEn']
        role=('共同创作，具体分工待补充' if lang=='zh' else 'Collaborative work; specific role to be documented') if case_id!='rendering-studies' else case['roleZh' if lang=='zh' else 'roleEn']
        status=('概念方案与设计提案' if lang=='zh' else 'Concept and design proposal') if case_id!='rendering-studies' else ('静态与动态视觉习作' if lang=='zh' else 'Still and motion visualization studies')
        if case_id=='yuju': status='应用界面概念' if lang=='zh' else 'App-interface concept'
        fields = {
          'title':title,
          'category':'digital' if case_id=='yuju' else ('experiments' if case_id=='rendering-studies' else 'product'),
          'summary':case['summaryZh' if lang=='zh' else 'summaryEn'],
          'role':role,'credits':cpair[lang_i],'status':status,'cover':case['galleries'][0], 'tags':d['tags'][lang_i]
        }
        lines=['---']+[f'{key}: {json.dumps(value,ensure_ascii=False)}' for key,value in fields.items()]+['---','']
        displayed=[]
        for section_i,heading in enumerate(heads[lang]):
            lines += [f'## {heading}','',d[lang][section_i],'']
            if case_id in page_sections:
                slug,assignment=page_sections[case_id]
                for num in assignment.get(section_i,[]):
                    path=pg(slug,num)
                    zh,en=page_captions[slug][num]
                    lines += [md_img(path,zh,en,lang),'']
                    displayed.append(path)
                if section_i==5:
                    for path in case['galleries']:
                        if 'legacy-full-portfolio' in path:
                            num=int(Path(path).stem)
                            zh,en=page_captions['portfolio-51'][num]
                            lines += [md_img(path,'早期演示版本：'+zh,'Earlier presentation version: '+en,lang),'']
                            displayed.append(path)
            elif case_id=='rendering-studies' and section_i==4:
                lines += [('**自行车静态组**' if lang=='zh' else '**Bicycle stills**'),'']
                for name,zh,en in bikes:
                    path=f'/works/legacy/rendering/{name}.webp'
                    lines += [md_img(path,zh,en,lang),'']
                    displayed.append(path)
                lines += [('**产品与场景长卷**' if lang=='zh' else '**Product and scene collection**'),'']
                path=pg('rendering-sheet',1)
                lines += [md_img(path,'个护、健身、灯具、装备与科幻形态的完整渲染长卷','Complete render collection of personal care, fitness, lighting, equipment and science-fiction forms',lang),'']
                displayed.append(path)
                lines += [('**跑车动态习作**' if lang=='zh' else '**Sports-car motion study**'),'']
                video_label='跑车场景与动态镜头习作' if lang=='zh' else 'Sports-car scene and camera-motion study'
                lines += [f'<video controls playsinline preload="metadata" src="/works/local/111.mp4" aria-label="{video_label}"></video>','']
            elif case_id not in page_sections and case_id!='rendering-studies' and section_i==4:
                for path in case['galleries']:
                    lines += [md_img(path,title+'完整概念展板',title+' complete concept board',lang),'']
                    displayed.append(path)
        assert len(displayed)==len(set(displayed)),(case_id,'repeated body image')
        assert set(displayed)==set(case['galleries']),(case_id,'missing image')
        (out/f'{case_id}.{lang}.md').write_text('\n'.join(lines).rstrip()+'\n',encoding='utf-8')

DATA.write_text(json.dumps(cases,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'cases':len(cases),'markdownFiles':len(cases)*2,'uniqueGalleryImages':len({p for c in cases for p in c['galleries']}),'videos':sum(len(c.get('videos',[])) for c in cases)},ensure_ascii=False))
