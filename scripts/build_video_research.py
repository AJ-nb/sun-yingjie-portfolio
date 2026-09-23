"""Pin and inventory upstream documentation, publish only attributed research metadata."""
import json, urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REV='9927d9b5bc2d1c305b2945917e461b3547642497'
BASE=f'https://raw.githubusercontent.com/LearnPrompt/awesome-seedance/{REV}/'
def fetch(path):
    return json.load(urllib.request.urlopen(BASE+path))
cases=fetch('data/cases.json'); templates=fetch('data/templates-local.json');taxonomy=fetch('data/case-taxonomy.json')
archive=ROOT/'.production-runtime/v10/upstream';archive.mkdir(parents=True,exist_ok=True)
for name,data in [('cases',cases),('templates',templates),('taxonomy',taxonomy)]:
    (archive/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
rows=[
('product-form','visual','product','product-commercial-shotlist','产品轮廓：让物件保持同一个物件','Product form: keep one object consistent',
'产品运动时，仍能辨认轮廓、部件比例和标识位置。','Preserve silhouette, component proportions and mark placement while the product moves.',
'正侧视图、部件名称、不可改变的比例、目标终帧。','Front and side references, named components, invariant proportions and a target final frame.',
'把产品身份与镜头指令分开；先列不变量，再限定单镜动作。','Separate product identity from camera instructions; define invariants before assigning one action per shot.',
'产品广告模板将终帧构图与产品身份参考分工处理。这是文档结构的观察，不是本人的生成测试。','The product-commercial template separates final-frame composition from product-identity references. This is a documentation observation, not a personal generation test.',
'文字指令无法保证精确尺寸或商标；几何与文字仍需人工检查。','Text instructions cannot guarantee dimensions or marks; geometry and lettering still need inspection.',
'用灯具的灯体截面、连接件和出光面建立核对清单，再讨论运镜。','For a luminaire, check the housing section, connectors and emitting surface before judging the camera move.'),
('material-light','intent','cmf','product-commercial-shotlist','CMF 与光线：让材质成为镜头目标','CMF and light: give material a shot objective',
'用光线变化解释表面，而不只追求高光强度。','Explain a surface through changing light rather than highlight intensity alone.',
'材料样本、粗糙度意图、主光方向、希望辨认的表面特征。','Material references, intended roughness, key-light direction and the surface feature to reveal.',
'一个镜头只验证一类表面现象，区分漫反射、边缘反光与透射。','Give each shot one material question; distinguish diffuse response, edge reflection and transmission.',
'上游模板要求指定微距拍摄对象，并将风格词集中处理；可据此减少镜头目标混杂。','The template asks for specific macro subjects and groups style instructions. This provides a way to reduce competing shot objectives.',
'生成图像不能证明真实材料、制造工艺或物理参数。','Generated imagery does not establish real materials, manufacturing processes or physical parameters.',
'在夜礼司概念评审中区分木、金属、透明材料的视觉意图；最终 CMF 决定仍依赖样本。','In YELISI concept review, distinguish wood, metal and transparent-material intentions; final CMF decisions still require samples.'),
('spatial-path','camera','space','travel-city-walk','空间运动：先建立路径，再安排景别','Spatial movement: establish the path first',
'镜头之间保留入口、目标与行动方向的关系。','Preserve the relationship between entry, destination and movement direction.',
'平面路径、关键视点、主体位置、空间尺度参考。','A plan path, key viewpoints, subject positions and scale references.',
'先用白模定义每段路径的起止位置，再为每段指定景别与运动轴。','Define each path segment in blocking, then assign framing and a movement axis.',
'城市行走模板按地点和时段组织段落；本研究将它转译为视点与空间节点的对应关系。','The travel template organizes segments by place and time; this study translates that structure into viewpoints and spatial nodes.',
'漂亮的连续镜头仍可能出现门洞、距离或朝向突变；文档描述不等于空间连续性验证。','An attractive sequence can still change openings, distances or orientation. A written description is not spatial-continuity validation.',
'适用于橱窗与展陈的观看路径预演，不替代施工尺寸或现场验证。','Use it to preview viewing paths through windows and displays, not to replace construction dimensions or site checks.'),
('character-lock','visual','narrative','character-reference-lock','角色一致性：明确继承与排除','Character consistency: specify what carries over',
'跨镜头保留角色身份，同时允许姿态与构图变化。','Carry identity across shots while allowing pose and composition to change.',
'角色参考图、服饰轮廓、颜色关系，以及不希望复制的姿态。','Character references, clothing silhouette, color relationships and poses that must not carry over.',
'为参考图分配独立职责；角色图管身份，分镜图管动作与构图。','Assign each reference a job: character images own identity; storyboard images own action and composition.',
'身份锁定模板同时包含继承与排除要求，避免把身份一致误解成整张图的复制。','The identity-lock template describes both inheritance and exclusions, separating identity consistency from copying a whole reference.',
'多人场景仍可能串脸、换装或错误分配角色；未进行本人重复生成对照。','Crowds may still swap faces, clothing or roles; no personal repeat-generation comparison is claimed.',
'对应个人22秒实践中的两张角色输入；未来可逐镜核对身份漂移。','Connects to the two character inputs in the personal 22-second study; identity drift can be checked shot by shot.'),
('storyboard-handoff','temporal','narrative','storyboard-grid-to-video','分镜衔接：把画面顺序变成动作关系','Storyboard hand-offs: connect actions, not just panels',
'每个分镜结束时，为下个镜头提供可接续的状态。','End each storyboard unit in a state the next shot can inherit.',
'编号分镜、总时长、单镜动作、上一镜结尾和下一镜开头。','Numbered panels, runtime, one action per shot and adjacent start/end states.',
'先检查分镜格数与总时长，再明确每格的动作、景别和交接条件。','Check panel count against runtime, then specify action, framing and hand-off conditions.',
'网格转视频模板将分镜图与视频提示语分两阶段处理；本研究额外强调镜头之间的状态交接。','The grid-to-video template separates storyboard creation from the video prompt; this study additionally emphasizes state hand-offs.',
'格数与时长是输入约束，不能保证模型严格执行；作者描述的11格不等于独立验证。','Panel count and runtime are input constraints, not execution guarantees. The author-described 11 units are not independently validated.',
'可将产品使用过程写成“接近—接触—操作—反馈”的连续状态。','Describe product use as connected states: approach, contact, operation and feedback.'),
('continuous-camera','camera','space','pov-continuous-take','连续运镜：说明相机与主体的关系','Continuous camera: define its relation to the subject',
'在不中断视线关系的前提下改变距离或方向。','Change distance or direction while preserving a legible viewing relationship.',
'相机起终点、关注目标、路径、速度变化与遮挡条件。','Camera start/end positions, target, path, speed changes and occlusion conditions.',
'把相机运动和主体运动分别描述；先验证一条可读路径，再增加节奏变化。','Describe camera and subject motion separately; validate one readable path before adding tempo changes.',
'连续镜头模板以不中断的视点运动组织描述；可用白模把含糊的“环绕”转成具体路径。','The continuous-take template organizes the description around uninterrupted viewpoint movement. Blocking can turn a vague orbit into a specific path.',
'写下“一镜到底”并不保证无隐藏切换或几何穿透。','Writing “one continuous take” does not guarantee the absence of hidden cuts or geometry intersections.',
'为产品展示比较轨道环绕与产品自转，明确哪种更能说明结构。','Compare a camera orbit with product rotation, choosing the one that better explains structure.'),
('physical-action','physical','product','sports-extreme','动作物理：检查接触与受力链','Physical action: inspect contact and force',
'让动作起因、接触、运动和结束状态可解释。','Make initiation, contact, movement and the end state causally legible.',
'动作分解、接触点、支撑面、重心意图和终止条件。','Action breakdown, contact points, support surfaces, intended balance and stopping conditions.',
'逐段写出完整动作链；把漂浮、瞬移和接触丢失设为审阅项。','Write the action chain in order; review floating, teleportation and lost contact explicitly.',
'运动模板将动作链和物理限制分别表达；它提供的是提示结构，不是物理仿真。','The sports template separates action chains from physical constraints. It provides prompt structure, not physical simulation.',
'生成结果不能证明承载、安全性、人体工学或工程可行性。','Generated output cannot establish load capacity, safety, ergonomics or engineering feasibility.',
'在产品操作短片中检查手、按钮、关节和物件接触，避免用视觉效果代替可用性证据。','Check hand, button, joint and object contact in product-use films; visual polish is not usability evidence.'),
('style-time','evaluation','narrative','time-freeze-rewind','风格与时间：把效果变成可审阅规则','Style and time: turn effects into review rules',
'区分视觉风格、时间顺序和需要保持不变的对象。','Separate visual style, temporal order and objects that must remain invariant.',
'正向事件序列、冻结对象、倒放区间、风格参考与审阅清单。','Forward event sequence, frozen objects, rewind interval, style references and a review checklist.',
'先定义正常事件，再标出时间操作范围；审阅前后状态能否对应。','Define the normal event first, mark the temporal-operation interval, then compare its boundary states.',
'时间冻结模板对不同时间状态作区分；本研究将其转为可复用的前后状态检查。','The time-freeze template distinguishes temporal states; this study converts that idea into a reusable boundary-state check.',
'单个成功样片不等于稳定性；上游复测也不是本人的实验成绩。','One successful example does not establish repeatability; upstream retests are not personal experimental results.',
'用于产品拆装或变形概念预演时，标明哪些是编辑效果，哪些是结构设计意图。','For assembly or transformation previews, distinguish editorial effects from structural design intentions.'),
]
index={c['slug']:c for c in cases['cases']}
all_templates=templates['templates']
# Some template definitions are exported in the style library rather than local overrides.
style=fetch('data/style-library.json');(archive/'style-library.json').write_text(json.dumps(style,ensure_ascii=False),encoding='utf-8')
def find_template(node,id):
    if isinstance(node,dict):
        if node.get('id')==id:return node
        for value in node.values():
            found=find_template(value,id)
            if found:return found
    if isinstance(node,list):
        for value in node:
            found=find_template(value,id)
            if found:return found
    return None
entries=[]
for row in rows:
    id,layer,application,template,*copy=row
    t=find_template(templates,template) or find_template(style,template) or {}
    examples=t.get('exampleCases',[])
    candidates=[index[s] for s in examples if isinstance(s,str) and s in index]
    case=next((c for c in candidates if 'x.com/' in c.get('sourceUrl','')),candidates[0] if candidates else None)
    entry={'id':id,'layer':layer,'application':application,'template':template,'personallyRetested':False,'videoReviewed':False,'mediaMode':'official-embed' if case and 'x.com/' in case.get('sourceUrl','') else 'source-link','reference': {'title':case['title'],'slug':case['slug'],'creator':case['creator'],'sourceUrl':case['sourceUrl'],'recordUrl':case['goodcaseUrl']} if case else None,'templateUrl':f'https://github.com/LearnPrompt/awesome-seedance/blob/{REV}/docs/templates/en/{template}.md'}
    for i,key in enumerate(['title','goal','inputs','control','observation','limits','transfer']):entry[key]={'zh':copy[i*2],'en':copy[i*2+1]}
    entries.append(entry)
data={'source':{'repository':'https://github.com/LearnPrompt/awesome-seedance','revision':REV,'retrievedAt':'2026-09-23','exportedAt':cases['meta']['exportedAt'],'caseCount':len(cases['cases']),'licenses':{'code':'MIT','curation':'CC BY 4.0','media':'Individual creator rights; no repository-wide media license'}},'entries':entries}
(ROOT/'web/src/data/aiVideoMethods.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'docs/ai-video-research-snapshot.md').write_text('# AI video methods — research record\n\nRevision: '+REV+'\nRetrieved: 2026-09-23\n\nInventory: '+str(len(cases['cases']))+' upstream case records. Counts describe the source snapshot, not personal work.\n\nRead source data, template structures and limitations. Editorial observations are document-based; no reference video has been personally retested or presented as viewed evidence. Test fixtures were excluded. Raw source data is retained only in the local production runtime.\n\n## Reviewed template mapping\n'+ '\n'.join('- '+e['template']+' → '+e['layer']+' / '+e['application'] for e in entries)+'\n\n## Reuse\nCode: MIT. Curation: CC BY 4.0, attributed to awesome-seedance / goodcase.ai. Prompts, posters and videos remain individually owned. No third-party media is copied into the release. Official post embeds are loaded only after a visitor chooses to view a reference.\n',encoding='utf-8')
print(json.dumps({'cases':len(cases['cases']),'methods':len(entries),'linkedExamples':sum(bool(e['reference']) for e in entries)}))
