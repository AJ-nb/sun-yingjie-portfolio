"""Build editable A4 résumé. Run using Codex bundled Python, then export_word.ps1."""
import json
from pathlib import Path
from docx import Document
from docx.shared import Mm, Pt, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.opc.constants import RELATIONSHIP_TYPE as RT

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'deliverables/resume'
DATA = {
 'name':'孙英杰', 'role':'产品设计师  /  3D 设计',
 'phone':'13515249897', 'email':'2950884508@qq.com', 'portfolio_url':'',
 'summary':'以产品造型与三维表达为基础，参与商业橱窗、灯具系列与数字工具的设计。关注形态、材料和使用情境的关系，将概念转化为清晰的模型、场景与交互表达。',
 'sections':[
  ['工作经历',[
   ['BENWU  ·  3D 设计师','2025.03 - 2025.12',[
    '参与 Hermès 夏、秋、冬季橱窗及 Arc’teryx Alpha Center 橱窗的三维设计与视觉呈现，围绕道具比例、商品位置和空间层次展开团队协作。',
    '参与铝型材灯具系列的三维设计与场景表达，呈现台灯、落地灯、壁灯与吊灯的共同形态语言，以及金属表面、线性发光与空间尺度关系。']],
   ['湖南欧音文化传媒有限公司  ·  设计师助理','2025',[
    '参与市场调研与用户反馈整理，使用 Figma 进行交互原型设计，配合团队讨论与完善用户体验流程。']]]],
  ['项目选录',[
   ['HUHU CARE  ·  儿童呼气检测','合作概念项目',[
    '围绕儿童、家长与医护人员的检查旅程，探索吹气球式引导、握持造型与灯光反馈。项目包含草图、手工形态模型、部件示意和场景渲染；处于概念提案阶段。']],
   ['镜序 Lensflow  ·  AI 创作工作台','共同创作',[
    '参与产品与交互共同创作，以采集、分析、简报和生成任务组织素材工作流。已有浏览器扩展、Studio 工作区与公开产品站，包含 AI 辅助实现及开源组件。']],
   ['Periastra  ·  相机包品牌标志','共同创作',[
    '参与品牌图形与应用研究，将字母 P、镜头旋涡与保护容器整合为标志，整理结构、线宽与负形关系。当前为标志方案及应用研究，尚未作为投产成果。']]]],
  ['教育背景',[
   ['常州工学院  ·  产品设计本科','2021.09 - 2025.06',[
    '课程涵盖产品设计方法、工程制图与 CAD、材料与加工工艺、人机工程学、产品结构设计及制造工程。']]]],
  ['设计能力与工具',[
   ['', '', ['产品造型与三维建模  ·  场景渲染与视觉表达  ·  用户研究与交互原型',
             'Rhino  /  SolidWorks  /  Figma  /  CAD  /  AIGC 辅助设计']]]]
 ]
}
source=OUT/'resume-content.json'
if source.exists(): DATA=json.loads(source.read_text(encoding='utf-8'))
else: source.write_text(json.dumps(DATA,ensure_ascii=False,indent=2),encoding='utf-8')
doc=Document(); s=doc.sections[0]
s.page_width=Mm(210); s.page_height=Mm(297)
s.top_margin=Mm(17); s.bottom_margin=Mm(16); s.left_margin=Mm(21); s.right_margin=Mm(21)
normal=doc.styles['Normal']; normal.font.name='Microsoft YaHei'; normal.font.size=Pt(9.5)
normal.font.color.rgb=RGBColor.from_string('303731')
normal.element.rPr.rFonts.set(qn('w:eastAsia'),'Microsoft YaHei')
normal.paragraph_format.line_spacing=Pt(15.5)
normal.paragraph_format.space_after=Pt(5)
for st in ['Title','Heading 1']:
 doc.styles[st].font.name='Microsoft YaHei'
 doc.styles[st].element.rPr.rFonts.set(qn('w:eastAsia'),'Microsoft YaHei')
 doc.styles[st].font.color.rgb=RGBColor(0,0,0)
for sty in doc.styles:
 for border in list(sty.element.iter(qn('w:pBdr'))): border.getparent().remove(border)
for grid in list(s._sectPr.findall(qn('w:docGrid'))): s._sectPr.remove(grid)
def para(text,size=None,bold=False,color=None,after=5,before=0,style=None):
 p=doc.add_paragraph(style=style); p.paragraph_format.space_after=Pt(after); p.paragraph_format.space_before=Pt(before)
 snap=OxmlElement('w:snapToGrid');snap.set(qn('w:val'),'0');p._p.get_or_add_pPr().append(snap)
 p.paragraph_format.line_spacing=Pt(15.5 if not size or size<14 else size*1.2)
 r=p.add_run(text); r.bold=bold
 if size:r.font.size=Pt(size)
 if color:r.font.color.rgb=RGBColor.from_string(color)
 return p
para(DATA['name'],30,False,after=2,style='Title')
para(DATA['role'],12,False,'526750',after=9)
contact=DATA['phone']+'    '+DATA['email']
p=para(contact,9,False,'526750',after=11)
if DATA['portfolio_url']:
 p.add_run('    ')
 link=OxmlElement('w:hyperlink')
 link.set(qn('r:id'),p.part.relate_to(DATA['portfolio_url'],RT.HYPERLINK,is_external=True))
 run=OxmlElement('w:r'); props=OxmlElement('w:rPr')
 fonts=OxmlElement('w:rFonts'); fonts.set(qn('w:eastAsia'),'Microsoft YaHei');props.append(fonts)
 col=OxmlElement('w:color');col.set(qn('w:val'),'526750');props.append(col)
 sz=OxmlElement('w:sz');sz.set(qn('w:val'),'18');props.append(sz)
 under=OxmlElement('w:u');under.set(qn('w:val'),'single');props.append(under)
 run.append(props); label=OxmlElement('w:t');label.text='在线作品集';run.append(label);link.append(run);p._p.append(link)
para(DATA['summary'],9.5,after=5)
for title,entries in DATA['sections']:
 p=para(title,11,True,after=7,before=11,style='Heading 1')
 for name,date,bullets in entries:
  if name:
   p=para(name,10,True,after=4)
   p.paragraph_format.tab_stops.add_tab_stop(Mm(168),WD_TAB_ALIGNMENT.RIGHT)
   r=p.add_run('\t'+date);r.bold=False;r.font.size=Pt(8.5);r.font.color.rgb=RGBColor.from_string('65765F')
   p.paragraph_format.keep_with_next=True
  for text in bullets: para(text.replace('Arc’teryx',"Arc'teryx"),10,after=5)
doc.core_properties.author='孙英杰';doc.core_properties.title='孙英杰 产品设计师简历'
doc.core_properties.subject='产品设计与三维设计'
doc.save(OUT/'sun-yingjie-resume.docx')
print(OUT/'sun-yingjie-resume.docx')
