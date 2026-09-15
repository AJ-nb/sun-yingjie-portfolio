"""Author an editable one-page résumé from the website's canonical profile."""
import json,sys
from pathlib import Path
from docx import Document
from docx.shared import Mm, Pt, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from reportlab.graphics.barcode import qrencoder
from PIL import Image, ImageDraw
sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'deliverables/resume';OUT.mkdir(parents=True,exist_ok=True)
P=json.loads((ROOT/'web/src/data/profile.json').read_text(encoding='utf-8'))
T={entry['id']:entry for entry in P['timeline']}
DATA={'name':P['name']['zh'],'role':P['position']['zh'],'phone':P['phone'],'email':P['email'],'portfolio_url':P['url'],'summary':P['summary']['zh'],'sections':[
 ['工作经历',[
  [T['liling']['place']['zh']+'  |  '+T['liling']['role']['zh'],T['liling']['period']['zh'],[
   '参与彼源 AI 品牌、官网视觉、交互与开发，连接品牌定位、页面信息组织与实际体验；参与夜礼司、Periastra 的品牌研究、图形演化和应用表达。']],
  [T['benwu']['place']['zh']+'  |  '+T['benwu']['role']['zh'],T['benwu']['period']['zh'],[
   '参与 Hermès 季节橱窗与 Arc’teryx Alpha Center 橱窗三维设计，围绕道具比例、商品位置、空间层次及材质灯光进行团队协作。',
   '参与铝型材灯具系列的造型与场景表达，呈现台灯、落地灯、壁灯和吊灯的系列语言、结构关系与金属表面。']],
  [T['ouyin']['place']['zh']+'  |  '+T['ouyin']['role']['zh'],T['ouyin']['period']['zh'],[
   '参与市场调研、用户反馈整理与 Figma 交互原型设计，协助需求梳理和体验流程迭代。']]]],
 ['代表项目',[
  ['镜序 Lensflow / Resume Formatter','AI 与数字产品',[
   '围绕参考采集、结构化分析、人工确认与任务恢复组织镜序流程；在简历工具中探索局部改写、岗位对照与可撤销编辑，保留上游来源及个人扩展边界。']],
  ['Periastra 相机包品牌标志','共同创作',[
   '参与图形与应用研究，以 P、镜头与保护框架建立识别顺序；分析线宽、负形和小尺寸表现，区分图形研究与尚未验证的实体工艺。']],
  ['引渡者管道机器人 / HUHU CARE','合作概念项目',[
   '通过服务关系、产品形态、结构示意与多视角渲染说明概念；保留合作属性和原始署名，明确样机、工程及使用测试尚待验证。']]]],
 ['教育背景',[
  [T['education']['place']['zh']+'  |  '+T['education']['role']['zh'],T['education']['period']['zh'],[
   '产品设计方法、材料与加工工艺、人机工程学、结构设计与工程制图。']]]],
 ['设计能力',[
  ['','',[
   '产品与空间：Rhino、SolidWorks 建模，KeyShot / C4D / Blender 材质、灯光与构图。',
   '品牌与数字：品牌图形和应用系统、Figma 原型、交互逻辑与响应式界面。',
   'AI 工作流：需求拆解、结构化提示、人工复核、版本与来源管理，关注实际限制。']]]]
]}
(OUT/'resume-content.json').write_text(json.dumps(DATA,ensure_ascii=False,indent=2),encoding='utf-8')
qr=qrencoder.QRCode(1,qrencoder.QRErrorCorrectLevel.M)
qr.addData(P['url']);qr.version=qr.calculate_version();qr.make()
modules=qr.getModuleCount();scale=10
im=Image.new('RGB',((modules+8)*scale,(modules+8)*scale),'white');draw=ImageDraw.Draw(im)
for y in range(modules):
 for x in range(modules):
  if qr.isDark(y,x):draw.rectangle(((x+4)*scale,(y+4)*scale,(x+5)*scale-1,(y+5)*scale-1),fill='#16272b')
im.save(OUT/'portfolio-qr.png')
doc=Document();s=doc.sections[0]
s.page_width=Mm(210);s.page_height=Mm(297)
s.top_margin=Mm(16);s.bottom_margin=Mm(15);s.left_margin=Mm(18);s.right_margin=Mm(18)
normal=doc.styles['Normal'];normal.font.name='Microsoft YaHei';normal.font.size=Pt(9)
normal.font.color.rgb=RGBColor.from_string('29343A');normal.element.rPr.rFonts.set(qn('w:eastAsia'),'Microsoft YaHei')
normal.paragraph_format.line_spacing=Pt(14.5);normal.paragraph_format.space_after=Pt(4)
for sty in doc.styles:
 for border in list(sty.element.iter(qn('w:pBdr'))):border.getparent().remove(border)
for grid in list(s._sectPr.findall(qn('w:docGrid'))):s._sectPr.remove(grid)
for title in ['Title','Heading 1']:
 doc.styles[title].font.name='Microsoft YaHei';doc.styles[title].element.rPr.rFonts.set(qn('w:eastAsia'),'Microsoft YaHei')
 doc.styles[title].font.color.rgb=RGBColor.from_string('000000')
def para(text,size=9,bold=False,color='29343A',after=4,before=0,parent=None,style=None):
 p=(parent or doc).add_paragraph(style=style);p.paragraph_format.space_after=Pt(after);p.paragraph_format.space_before=Pt(before)
 snap=OxmlElement('w:snapToGrid');snap.set(qn('w:val'),'0');p._p.get_or_add_pPr().append(snap)
 p.paragraph_format.line_spacing=Pt(14.5 if size<14 else size*1.2)
 r=p.add_run(text.replace('—','-').replace('Arc’teryx',"Arc'teryx"));r.bold=bold;r.font.size=Pt(size);r.font.color.rgb=RGBColor.from_string(color)
 return p
p=para(DATA['name'],28,False,'000000',after=5,style='Title')
para(DATA['role'],11,False,'000000',after=6)
para(DATA['phone']+'    '+DATA['email'],8.5,color='52665E',after=0)
para(DATA['summary'],9.2,after=4,before=10)
for title,entries in DATA['sections']:
 p=para(title,11,True,'000000',after=5,before=10,style='Heading 1');p.paragraph_format.keep_with_next=True
 for name,date,bullets in entries:
  if name:
   p=para(name,9.5,True,after=3)
   p.paragraph_format.tab_stops.add_tab_stop(Mm(174),WD_TAB_ALIGNMENT.RIGHT)
   r=p.add_run('\t'+date.replace('—','-'));r.bold=False;r.font.size=Pt(8);r.font.color.rgb=RGBColor.from_string('65736D')
   p.paragraph_format.keep_with_next=True
  for body in bullets:para(body,9,after=4)
p=para(P['url'],7.4,color='52665E',before=6,after=0)
link=OxmlElement('w:hyperlink');link.set(qn('r:id'),p.part.relate_to(P['url'],RT.HYPERLINK,is_external=True))
for run in list(p._p.findall(qn('w:r'))):p._p.remove(run);link.append(run)
p._p.append(link)
doc.core_properties.author=P['name']['zh'];doc.core_properties.title='孙英杰 品牌与产品设计简历';doc.core_properties.subject='工作经历、代表项目与设计能力'
doc.save(OUT/'sun-yingjie-resume.docx')
print(OUT/'sun-yingjie-resume.docx')
