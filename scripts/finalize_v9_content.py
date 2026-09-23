"""Finish shared bilingual copy and media associations for the v9 rebuild."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'web/src/data'
def read(name):return json.loads((DATA/name).read_text(encoding='utf-8-sig'))
def save(name,data):(DATA/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

profile=read('profile.json')
old=read('resume-positioning.json')
# A short, evidence-backed common practice statement fits on a one-page CV.
practice={
 'zh':'独立 AI 视频研究：设计分镜、Blender 白模与渲染评估流程。AI 辅助生成，人负责输入、设计判断与核验；未作为商业部署成果。',
 'en':'Independent AI-video research: storyboard, Blender blocking and render review. AI assists generation; I define inputs, judge and verify outputs. The work focuses on independent workflow practice and method development.'}
variants={
 'overview':{
  'zh':('连接产品形态、CMF、三维与品牌，以模型和原型支持设计判断。', [('实体产品','从使用情境比较形态、材料与部件关系。'),('视觉系统','连接品牌识别、产品与商业空间的表达。'),('设计协作','以三维、界面和版本比较支持团队讨论。')]),
  'en':('I connect product form, CMF, 3D and brand, using models and prototypes to make design choices concrete.', [('Physical products','Compare form, materials and component relationships around use.'),('Visual systems','Connect identity, products and commercial spaces.'),('Collaboration','Use 3D, interfaces and version comparisons to support team decisions.')])},
 'brand':{
  'zh':('以产品设计方法连接品牌识别、空间视觉与数字触点，关注一致性与应用条件。',[('品牌识别','比较字标、色彩与信息层级，形成可延展的规则。'),('空间表达','以三维和材质光线呈现商品、道具与环境关系。'),('跨触点一致性','围绕 Periastra、夜礼司与彼源 AI 研究不同载体。')]),
  'en':('I connect identity, spatial visuals and digital touchpoints through a product-design approach.', [('Identity','Compare wordmarks, colour and hierarchy to form reusable rules.'),('Spatial expression','Use 3D, materials and light to frame merchandise and props.'),('Consistency','Explore applications through Periastra, YELISI and Biyuan AI.')])},
 'physical':{
  'zh':('从使用动作与材料出发，比较产品形态、CMF 与部件关系，以三维表达支持方案评审。',[('产品形态','用系列灯具、HUHU CARE 与 GO GLOW 比较比例与操作。'),('CMF 与三维','通过模型、渲染和场景研究材质、边缘与尺度。'),('工程语境','将制造环境中的标准化、质量与约束意识带入设计。')]),
  'en':('I explore product form, CMF and component relationships around use, making proposals tangible through 3D.', [('Product form','Compare proportion and use in lighting, HUHU CARE and GO GLOW.'),('CMF and 3D','Study materials, edges and scale through models and rendering.'),('Engineering context','Bring awareness of standards, quality and constraints from manufacturing.')])},
 'digital':{
  'zh':('将复杂任务转为清楚的输入、操作与反馈，结合界面设计、原型与开源整合完善体验。',[('界面与流程','设计彼源 AI 的 VI/UI；比较桌面与移动端层级。'),('可控交互','围绕改写审阅、恢复和版本选择设计工具流程。'),('创作系统','用分镜与白模组织 AI 视频的输入、镜头和评估。')]),
  'en':('I turn complex tasks into clear inputs, actions and feedback through interface design, prototypes and open-source integration.', [('Interfaces','Design Biyuan AI VI/UI and compare desktop and mobile hierarchy.'),('Controlled interaction','Design review, recovery and version-selection workflows.'),('Creative systems','Organise AI-video inputs, camera direction and review through storyboards and blocking.')])}}
tools_copy={
 'zh':[{'label':'产品与三维','body':'Rhino、SolidWorks、KeyShot、Cinema 4D、Blender'}, {'label':'视觉与界面','body':'Photoshop、Illustrator、Figma；React / TypeScript'}, {'label':'AI 与研究','body':'Codex、ChatGPT、ComfyUI、Midjourney；竞品与文化语境分析'}],
 'en':[{'label':'Product and 3D','body':'Rhino, SolidWorks, KeyShot, Cinema 4D, Blender'}, {'label':'Visual and digital','body':'Photoshop, Illustrator, Figma; React / TypeScript'}, {'label':'AI and research','body':'Codex, ChatGPT, ComfyUI, Midjourney; market and cultural context'}]}
new={'edition':'resume-v9-bilingual','confirmedInputs':old.get('confirmedInputs',[]),'variants':{},'practice':practice}
for key,pair in variants.items():
 localized={}
 for lang,(summary,rows) in pair.items():
  localized[lang]={'summary':summary,'strengths':[{'label':label,'body':body,'evidence':old['variants'][key]['strengths'][i]['evidence']} for i,(label,body) in enumerate(rows)],'tools':tools_copy[lang],'workflow':practice[lang],'workflowEvidence':['ai-video-systems']}
 new['variants'][key]={**localized['zh'],'localized':localized}
save('resume-positioning.json',new)
for variant in profile['resume']['variants']:
 key={'general':'overview','product':'physical'}.get(variant['id'],variant['id'])
 variant['summary']={lang:variants[key][lang][0] for lang in ['zh','en']}
profile['resume']['practice']=practice
save('profile.json',profile)

# Remove obsolete, unused positioning from the typed profile facade.
p=DATA/'profile.ts';s=p.read_text(encoding='utf-8');a=s.index('const editorial = ')+len('const editorial = ');z=s.index('\n\nfunction makeProfile',a)
ed=json.loads(s[a:z])
for lang,c in ed.items():
 for key in ['title','statement','narrative','experienceDetails']:c.pop(key,None)
 c['practiceDetails']=[practice[lang],*(c['practiceDetails'][:1])]
s=s[:a]+json.dumps(ed,ensure_ascii=False,indent=2)+s[z:]
s=s.replace("['lensflow', 'yantai', 'resume-formatter', 'xintiao', 'formline']","['ai-video-systems', 'resume-formatter', 'lensflow', 'formline', 'xintiao']")
p.write_text(s,encoding='utf-8')

# Make decision illustrations correspond to each topic, rather than the first
# three images of a flattened gallery (which mixed up the Hermès seasons).
p=ROOT/'scripts/editorial_v9.py';s=p.read_text(encoding='utf-8').replace("media=[im for page in mapping['casePages'][slug] for im in page['images']]","media=[page['images'][0] for page in mapping['casePages'][slug]]")
s=s.replace('boards 路径的图板属于回顾性重建','新增设计图板属于回顾性重建')
p.write_text(s,encoding='utf-8')

p=ROOT/'web/index.html';s=p.read_text(encoding='utf-8');s=s.replace('Yingjie Sun | Design Lead — Industrial & Product Design','Yingjie Sun | Industrial & Product Designer').replace('孙英杰，设计主导｜工业与产品设计。主导产品、3D、CMF 与品牌工作，并在能改善设计时整合 AI、研究与跨市场洞察。',profile['summary']['zh'])
s=re.sub(r'<noscript>.*?</noscript>','<noscript><p>孙英杰 · 工业与产品设计师</p><p><a href="/work">浏览作品</a> · <a href="/resume">简历与下载</a> · <a href="mailto:'+profile['email']+'">'+profile['email']+'</a></p></noscript>',s,flags=re.S);p.write_text(s,encoding='utf-8')
p=ROOT/'web/src/data/siteMetadata.ts';s=p.read_text(encoding='utf-8').replace('How Yingjie Sun leads industrial and product design','How Yingjie Sun approaches industrial and product design');p.write_text(s,encoding='utf-8')
print('Shared identity, concise bilingual resume positioning and media associations updated.')
