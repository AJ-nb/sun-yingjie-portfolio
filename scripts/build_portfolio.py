"""Author the designed portfolio from the same verified cases as the website."""
from pathlib import Path
import re, json, shutil, hashlib, io, sys
from xml.sax.saxutils import escape
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parents[1]
sys.stdout.reconfigure(encoding='utf-8')
PUBLIC = ROOT / 'web/public'
OUT = ROOT / 'deliverables/portfolio'
OUT.mkdir(parents=True, exist_ok=True)
URL = 'https://sun-yingjie-portfolio.mauve-heron-8150.chatgpt.site'
pdfmetrics.registerFont(TTFont('CN', 'C:/Windows/Fonts/msyh.ttc'))
pdfmetrics.registerFont(TTFont('CNB', 'C:/Windows/Fonts/msyhbd.ttc'))
W,H = 960,600
INK, PAPER, SAGE, MUTED = '#18251f','#f4f1ea','#728776','#617066'
CATS = {'commercial':('商业空间','SPACES'), 'product':('工业与产品','PRODUCTS'), 'brand':('品牌视觉','IDENTITY'), 'digital':('数字产品','DIGITAL'), 'experiments':('渲染与创作实验','EXPERIMENTS')}
PRIORITY = ['hermes','arcteryx','lighting','plumber','huhu-care','plant-companion','periastra','yelisi','lensflow','yantai','formline']
EXPANDED = {'hermes','lighting','plumber','huhu-care','plant-companion','lensflow'}
cases=[]
for path in (ROOT/'web/src/content/works').glob('*.zh.md'):
    raw=path.read_text(encoding='utf-8-sig'); front,body=raw.split('---',2)[1:]
    data={m[1]:m[2].strip().strip('"') for line in front.splitlines() if (m:=re.match(r'^(\w+):\s*(.*)$',line))}
    data.update(slug=path.name[:-6],body=body)
    data['images']=[{'alt':m[1],'src':m[2]} for m in re.finditer(r'!\[([^\]]*)\]\(([^\s)]+)\)',body)]
    cases.append(data)
cases.sort(key=lambda d:(list(CATS).index(d['category']), PRIORITY.index(d['slug']) if d['slug'] in PRIORITY else 99,d['slug']))
output=OUT/'sun-yingjie-portfolio.pdf'
c=canvas.Canvas(str(output),pagesize=(W,H),pageCompression=1)
c.setTitle('孙英杰 设计作品集'); c.setAuthor('孙英杰及各项目署名协作者'); c.setSubject('商业空间 产品设计 品牌视觉 数字产品 创作实验')
records=[]; page=0
def rect(x,y,w,h,color):
    c.setFillColor(HexColor(color)); c.rect(x,y,w,h,fill=1,stroke=0)
def text(s,x,y,size=10,color=INK,font='CN'):
    s=s.replace('Arc’teryx', "Arc'teryx")
    c.setFillColor(HexColor(color));c.setFont(font,size);c.drawString(x,y,s)
def para(s,x,top,width,size=11,leading=None,color=INK,bold=False):
    s=s.replace('Arc’teryx', "Arc'teryx")
    font='CNB' if bold else 'CN'
    lines=[]
    for part in s.split('\n'):
        line=''
        for token in re.findall(r"[A-Za-z0-9_./'-]+|.",part):
            if line and pdfmetrics.stringWidth(line+token,font,size)>width-1:
                if token in '，。、；：！？）】》”’':
                    lines.append(line[:-1].rstrip());line=line[-1]+token
                else:
                    lines.append(line.rstrip());line=token.lstrip()
            else: line+=token
        lines.append(line.rstrip())
    style=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.65,textColor=HexColor(color),wordWrap='CJK',spaceBefore=0,spaceAfter=0,splitLongWords=False)
    p=Paragraph('<br/>'.join(escape(line) for line in lines),style); _,h=p.wrap(width,1000);p.drawOn(c,x,top-h)
    return top-h
def contain(src,x,y,w,h,bg='#e8e7e0'):
    rect(x,y,w,h,bg)
    im=Image.open(src).convert('RGB'); scale=min(w/im.width,h/im.height)
    dw,dh=im.width*scale,im.height*scale
    im.thumbnail((1800,1800),Image.Resampling.LANCZOS)
    buffer=io.BytesIO();im.save(buffer,format='JPEG',quality=90,subsampling=0)
    c.drawImage(ImageReader(buffer),x+(w-dw)/2,y+(h-dh)/2,width=dw,height=dh)
def base(section,dark=False):
    global page
    page+=1;rect(0,0,W,H,INK if dark else PAPER)
    color=PAPER if dark else INK
    text('SUN YINGJIE',48,565,10,color,'Helvetica-Bold')
    text(section,660,565,9,color)
    text('DESIGN PORTFOLIO  /  2026',48,24,8,SAGE,'Helvetica')
    text(f'{page:02d}',888,24,9,color,'Helvetica')
def end(kind,slug=None):
    records.append({'page':page,'kind':kind,'case':slug});c.showPage()

# Identity-led cover uses the image supplied by the user.
page+=1
im=Image.open(ROOT/'avatar/references/user-generated/landscape.png').convert('RGB')
buffer=io.BytesIO();im.save(buffer,format='JPEG',quality=94,subsampling=0)
c.drawImage(ImageReader(buffer),0,0,W,H)
text('SUN YINGJIE  /  孙英杰',52,545,12,PAPER)
text('Design',48,405,69,PAPER,'Times-Italic');text('Portfolio',48,329,69,PAPER,'Times-Italic')
para('商业空间 · 工业与产品\n品牌视觉 · 数字产品',52,262,350,16,28,PAPER)
text('2026',52,53,13,PAPER,'Helvetica');text('精选项目与完整作品目录',119,54,10,PAPER)
end('cover')

# Index has genuine PDF links and stable corresponding web links.
base('作品目录  /  INDEX')
text('不同尺度，同一种设计视角。',48,504,29,INK,'CNB')
para('30 个案例，从材料与空间到屏幕。点击项目名称阅读本册，或通过案例页访问完整图像与过程。',48,476,800,11)
case_pages={}; start=4
for d in cases:
    case_pages[d['slug']]=start; start+=2 if d['slug'] in EXPANDED else 1
for i,d in enumerate(cases):
    col=i//15;row=i%15;x=48+col*446;y=418-row*23
    title=d['title'];size=9.8
    while pdfmetrics.stringWidth(title,'CN',size)>350: size-=.3
    text(title,x,y,size);text(str(case_pages[d['slug']]).zfill(2),x+384,y,9,MUTED,'Helvetica')
    c.linkRect('',d['slug'],(x,y-5,x+415,y+14),relative=0,thickness=0)
end('index')

base('个人实践  /  PRACTICE',True)
text('孙英杰',48,487,39,PAPER,'CNB')
text('Yingjie Sun',50,450,20,SAGE,'Times-Italic')
para('从产品形态与结构出发，\n延伸到商业空间、品牌识别与数字工具。',48,391,430,23,38,PAPER)
para('产品设计本科背景。关注材料、灯光与空间的表达，也通过交互原型和数字工具探索设计方法的延伸。',48,272,416,13,23,PAPER)
text('EDUCATION & EXPERIENCE',551,492,10,SAGE,'Helvetica-Bold')
entries=[('2021.09 - 2025.06','常州工学院 · 产品设计本科'),('2025','湖南欧音文化传媒 · 设计师助理'),('2025.03 - 2025.12','BENWU · 3D 设计师')]
for i,(date,title) in enumerate(entries):
    y=445-i*83;text(date,551,y,10,SAGE,'Helvetica');para(title,551,y-17,350,14,23,PAPER)
para('合作项目保留团队及原展板署名。概念研究、原型和商业项目按各自阶段呈现。',551,172,348,10.5,18,PAPER)
end('profile')

for index,d in enumerate(cases):
    label,en=CATS[d['category']]
    base(f'{label}  /  {en}')
    c.bookmarkPage(d['slug']);c.addOutlineEntry(d['title'],d['slug'],0,False)
    text(f'{index+1:02d}',48,509,39,SAGE,'Helvetica')
    title=d['title']
    if d['slug']=='periastra': title='Periastra\n相机包品牌标志'
    if ' · ' in title and pdfmetrics.stringWidth(title,'CNB',23)>267:
        title=title.replace(' · ','\n',1)
    y=para(title,48,470,267,23,31,INK,True)
    y=para(d['summary'],48,y-20,262,11.5,19)-24
    text('参与方式',48,y,8.5,MUTED);y=para(d['role'],48,y-10,258,10,17)-21
    text('项目阶段',48,y,8.5,MUTED);y=para(d['status'],48,y-10,258,10,17)-21
    text('合作与署名',48,y,8.5,MUTED);y=para(d['credits'],48,y-10,258,9,15)
    if y<65: raise ValueError(f'Left text overflow: {d["slug"]} at {y}')
    contain(PUBLIC/d['cover'].lstrip('/'),342,78,570,450)
    text('完整案例与作品图',754,46,10,INK)
    c.linkURL(URL+'/#/work/'+d['slug'],(740,36,911,62),relative=0,thickness=0)
    end('project',d['slug'])
    if d['slug'] in EXPANDED:
        base(f'{d["title"]}  /  DETAILS')
        pics=[p for p in d['images'] if p['src']!=d['cover'] and not p['src'].endswith('.svg')][:2]
        if not pics: pics=[{'src':d['cover'],'alt':d['title']}]
        total=len(pics);width=(864-24*(total-1))/total
        for j,p in enumerate(pics):
            x=48+j*(width+24); contain(PUBLIC/p['src'].lstrip('/'),x,160,width,363)
            para(p['alt'],x,147,width,9.5,16,MUTED)
        m=re.search(r'## 设计过程\s+([^#]+)',d['body'])
        process=(m[1].split('\n\n')[0].strip() if m else d['summary'])
        process=re.sub(r'[*_`]', '', process)
        para(process,48,97,857,10,17)
        end('details',d['slug'])

base('联系  /  CONTACT',True)
text('让想法成为作品。',48,420,43,PAPER,'CNB')
para('求职沟通 · 设计合作 · 项目交流',51,343,800,17,27,PAPER)
text('2950884508@qq.com',48,233,32,PAPER,'Helvetica')
c.linkURL('mailto:2950884508@qq.com',(48,222,500,263),relative=0,thickness=0)
text('135 1524 9897',48,183,20,SAGE,'Helvetica')
text('浏览在线作品集',48,97,12,PAPER);c.linkURL(URL,(43,82,250,119),relative=0,thickness=0)
text('SUN YINGJIE',699,90,18,SAGE,'Times-Italic')
end('contact')
c.save()
public_pdf=PUBLIC/'downloads/sun-yingjie-selected-portfolio.pdf'
shutil.copyfile(output,public_pdf)
(ROOT/'private/sources/download-manifest.json').write_text(json.dumps({'publicPath':'/downloads/sun-yingjie-selected-portfolio.pdf','document':str(output.relative_to(ROOT)),'pages':records,'caseCount':len(cases),'pageCount':page,'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'note':'New editorial portfolio with all 30 case introductions, selected detail pages, original collaboration credits, clickable index and full-case web links. Complete original PDF pages retained in private source archive.'},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':page,'cases':len(cases),'bytes':output.stat().st_size,'output':str(output)},ensure_ascii=False))
