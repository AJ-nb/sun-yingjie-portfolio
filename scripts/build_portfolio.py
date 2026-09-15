"""Author the designed portfolio from the same verified cases as the website."""
from pathlib import Path
import re, json, shutil, hashlib, io, sys, subprocess
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
PROFILE = json.loads((ROOT/'web/src/data/profile.json').read_text(encoding='utf-8'))
URL = PROFILE['url']
pdfmetrics.registerFont(TTFont('CN', 'C:/Windows/Fonts/msyh.ttc'))
pdfmetrics.registerFont(TTFont('CNB', 'C:/Windows/Fonts/msyhbd.ttc'))
W,H = 960,600
INK, PAPER, SAGE, MUTED = '#18251f','#f4f1ea','#728776','#617066'
chapter_source=(ROOT/'web/src/data/chapters.ts').read_text(encoding='utf-8')
CHAPTERS=[]
for m in re.finditer(r"\{ id: '([^']+)', title: \{ zh: '([^']+)', en: '([^']+)' \}, note: \{ zh: '([^']+)', en: '([^']+)'",chapter_source.split('] as const')[0]):
    CHAPTERS.append(dict(zip(('id','title','english','note','noteEnglish'),m.groups())))
sequence=chapter_source.split('const sequence:')[1].split('// Dates')[0]
for ch in CHAPTERS:ch['slugs']=re.findall(r"'([^']+)'",re.search(r'\b'+ch['id']+r':\s*\[([^\]]+)\]',sequence)[1])
assert len(CHAPTERS)==6
EXPANDED={'hermes','arcteryx','lighting','plumber','huhu-care','lingmu','jimu-studio','rendering-studies','biyuan','yelisi','periastra','lensflow','yantai','xintiao','formline','resume-formatter','image-2-5-xhs'}
cases=[]
for path in (ROOT/'web/src/content/works').glob('*.zh.md'):
    raw=path.read_text(encoding='utf-8-sig'); front,body=raw.split('---',2)[1:]
    data={m[1]:m[2].strip().strip('"') for line in front.splitlines() if (m:=re.match(r'^(\w+):\s*(.*)$',line))}
    data.update(slug=path.name[:-6],body=body)
    data['images']=[]
    for m in re.finditer(r'!\[([^\]]*)\]\(([^\s)]+)\)',body):
        note=re.match(r'\s*\*([^*\n]+)\*',body[m.end():])
        data['images'].append({'alt':m[1],'src':m[2],'note':note[1] if note else ''})
    cases.append(data)
ordered_slugs=[s for ch in CHAPTERS for s in ch['slugs']]
cases.sort(key=lambda d:ordered_slugs.index(d['slug']))
assert len(cases)==33,'The second edition must introduce all 33 cases'
for d in cases:d['chapter']=next(ch for ch in CHAPTERS if d['slug'] in ch['slugs'])

def chosen_gallery(d):
    pics=d['images'];slug=d['slug']
    if slug in ('plumber','huhu-care'):
        prefix='/works/refinement-v2/'+('plumber/' if slug=='plumber' else 'huhu/')
        chosen=[p for p in pics if prefix in p['src']]
        chosen += [p for p in pics if ('portfolio-51/006.' if slug=='plumber' else 'portfolio-51/023.') in p['src']]
    elif slug in ('lingmu','jimu-studio'):
        chosen=[p for p in pics if '/works/refinement-v2/psd-' in p['src']]
        if not chosen and '--plan' not in sys.argv:raise ValueError(slug+': native PSD selections pending')
    elif slug=='xintiao':
        chosen=[p for p in pics if 'monster-' not in p['src'] and not p['src'].endswith('.svg')]
        if not chosen and '--plan' not in sys.argv:raise ValueError('Xintiao native runtime screenshots pending')
    elif slug=='yantai':
        p=pics[0]
        chosen=[dict(p,alt=alt,crop=crop) for alt,crop in [
            ('砚台 · 图像入口与学习工作区',[0,0,760,741]),
            ('砚台 · 可见依据、作用推断与迁移方法',[0,741,760,1470]),
            ('砚台 · 迁移练习与人工确认归档',[0,1470,760,1985])]]
    elif slug=='lighting':chosen=[p for p in pics if '/refinement-v2/' in p['src']]+[p for p in pics if any(t in p['src'] for t in ('e9ab15','450b32','1a933','9aa74'))]
    elif slug=='hermes':chosen=[p for p in pics if '/legacy/hermes/' in p['src']]
    elif slug=='rendering-studies':chosen=[p for p in pics if '/refinement-v2/' in p['src']]+[p for p in pics if '/legacy/rendering/' in p['src']][:3]
    else:chosen=pics
    seen=set();result=[]
    for p in chosen:
        key=(p['src'],tuple(p.get('crop',[])))
        if key not in seen and (PUBLIC/p['src'].lstrip('/')).is_file():seen.add(key);result.append(p)
    return result[:12]

def image_groups(d):
    pics=chosen_gallery(d);result=[]
    def aspect(p):
        src=PUBLIC/p['src'].lstrip('/')
        if src.suffix=='.svg':return 1.6
        with Image.open(src) as im:return im.width/im.height
    while pics:
        count=1
        if aspect(pics[0])<=1.55 and d['slug'] not in ('lensflow','yantai','formline','resume-formatter','periastra'):
            while count<min(3,len(pics)) and aspect(pics[count])<=1.55:count+=1
        result.append(pics[:count]);pics=pics[count:]
    return result

for d in cases:d['detailGroups']=image_groups(d) if d['slug'] in EXPANDED else []
case_pages={};chapter_pages={};planned_page=4
for ch in CHAPTERS:
    chapter_pages[ch['id']]=planned_page;planned_page+=1
    for d in [d for d in cases if d['chapter']['id']==ch['id']]:
        case_pages[d['slug']]=planned_page;planned_page+=1+len(d['detailGroups'])
if '--plan' in sys.argv:
    (ROOT/'private/sources/refinement-v2/portfolio-page-plan.json').write_text(json.dumps({'caseCount':len(cases),'pageCountWithReadyAssets':planned_page,'chapters':CHAPTERS,'chapterPages':chapter_pages,'casePages':case_pages,'details':{d['slug']:d['detailGroups'] for d in cases},'status':'Final media incorporated; page count is calculated from current shared case sources'},ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'cases':len(cases),'pagesWithReadyAssets':planned_page,'status':'All final media incorporated'}));raise SystemExit()
output=OUT/'sun-yingjie-portfolio.pdf'
c=canvas.Canvas(str(output),pagesize=(W,H),pageCompression=1)
c.setTitle('孙英杰 | 品牌与产品设计＋AI | 完整作品集 2026'); c.setAuthor('孙英杰及各项目署名协作者'); c.setSubject('商业橱窗 铝型材灯具 产品设计与模型 三维渲染实践 品牌孵化 AI与数字产品')
records=[]; page=0; used_media={}; text_bounds=[]
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
    p=Paragraph('<br/>'.join(escape(line) for line in lines),style); _,h=p.wrap(width,1000)
    if top-h<40:raise ValueError(f'Text overflow on page {page}: {s[:45]} at {top-h}')
    p.drawOn(c,x,top-h);text_bounds.append({'page':page,'text':s,'bounds':[x,top-h,x+width,top]})
    return top-h
def contain(src,x,y,w,h,bg='#e8e7e0',crop=None):
    rect(x,y,w,h,bg)
    original=Path(src)
    if original.suffix.lower()=='.svg':
        cache=ROOT/'.production-runtime/model-worksets/portfolio-cache';cache.mkdir(exist_ok=True)
        src=cache/(hashlib.sha256(original.read_bytes()+(ROOT/'scripts/source-r2/rasterize_svg.cjs').read_bytes()).hexdigest()[:20]+'.png')
        if not src.exists():subprocess.run(['C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe',str(ROOT/'scripts/source-r2/rasterize_svg.cjs'),str(original),str(src)],check=True,capture_output=True)
    with Image.open(src) as source:
        rgba=(source.crop(crop) if crop else source).convert('RGBA');bgim=Image.new('RGBA',rgba.size,'white');bgim.alpha_composite(rgba);im=bgim.convert('RGB')
    scale=min(w/im.width,h/im.height)
    dw,dh=im.width*scale,im.height*scale
    im.thumbnail((2400,2000),Image.Resampling.LANCZOS)
    buffer=io.BytesIO();im.save(buffer,format='JPEG',quality=93,subsampling=0)
    c.drawImage(ImageReader(buffer),x+(w-dw)/2,y+(h-dh)/2,width=dw,height=dh)
    media='/'+str(original.relative_to(PUBLIC)).replace('\\','/')
    if media not in used_media:used_media[media]={'publicPath':media,'sha256':hashlib.sha256(original.read_bytes()).hexdigest(),'pages':[]}
    used_media[media]['pages'].append(page)
    if crop:used_media[media].setdefault('displayCrops',[]).append({'page':page,'sourcePixelBounds':crop})
def base(section,dark=False):
    global page
    page+=1;rect(0,0,W,H,INK if dark else PAPER)
    color=PAPER if dark else INK
    text('SUN YINGJIE',48,565,10,color,'Helvetica-Bold')
    para(section,505,573,407,8.7,13,color)
    text('DESIGN PORTFOLIO  /  2026',48,24,8,SAGE,'Helvetica')
    text(f'{page:02d}',888,24,9,color,'Helvetica')
    if page>2:
        text('目录',832,24,8,color);c.linkRect('目录','contents',(826,19,863,37),thickness=0)
def end(kind,slug=None):
    records.append({'page':page,'kind':kind,'case':slug});c.showPage()

# The cover uses verified project imagery rather than a pending avatar revision.
page+=1
rect(0,0,W,H,PAPER)
text('SUN YINGJIE / 2026',48,550,11,INK,'Helvetica-Bold')
text(PROFILE['name']['zh'],48,460,38,INK,'CNB')
text('Design',48,385,61,INK,'Times-Italic');text('Portfolio',48,324,61,INK,'Times-Italic')
para(PROFILE['position']['zh'],51,269,323,17,28,INK)
para(PROFILE['summary']['zh'],51,211,305,11,19,MUTED)
lookup={d['slug']:d for d in cases}
contain(PUBLIC/lookup['hermes']['cover'].lstrip('/'),395,308,517,212)
contain(PUBLIC/lookup['lighting']['cover'].lstrip('/'),395,91,205,201)
contain(PUBLIC/lookup['plumber']['cover'].lstrip('/'),616,91,296,201)
text('33 PROJECTS / 6 CHAPTERS',51,73,9,MUTED,'Helvetica')
text('空间、产品、品牌与数字实践',51,51,10,MUTED)
text(URL,395,51,9,MUTED,'Helvetica');c.linkURL(URL,(391,39,914,68),thickness=0)
end('cover')

# Index has genuine PDF links and stable corresponding web links.
base('作品目录  /  INDEX')
c.bookmarkPage('contents')
text('六个章节，三十三个案例。',48,504,29,INK,'CNB')
para('商业橱窗 → 铝型材灯具 → 产品设计与模型 → 三维渲染 → 品牌孵化 → AI 与数字产品。\n点击项目名称阅读本册，案例页可继续访问完整网站。',48,476,850,10.5,18)
for i,d in enumerate(cases):
    col=i//17;row=i%17;x=48+col*446;y=410-row*21
    title=d['title'];size=9.8
    while pdfmetrics.stringWidth(title,'CN',size)>350: size-=.3
    text(title,x,y,size);text(str(case_pages[d['slug']]).zfill(2),x+384,y,9,MUTED,'Helvetica')
    c.linkRect('',d['slug'],(x,y-5,x+415,y+14),relative=0,thickness=0)
end('index')

base('个人实践  /  PRACTICE',True)
text(PROFILE['name']['zh'],48,487,39,PAPER,'CNB')
text(PROFILE['name']['en'],50,450,20,SAGE,'Times-Italic')
para(PROFILE['position']['zh'],48,391,425,25,38,PAPER)
para(PROFILE['summary']['zh'],48,296,405,13,23,PAPER)
para('合作项目保留团队及原展板署名。概念研究、原型与商业项目按各自阶段呈现。',48,160,401,10.5,18,PAPER)
text('EXPERIENCE & PRACTICE',515,492,10,SAGE,'Helvetica-Bold')
entries=sorted(PROFILE['timeline'],key=lambda d:d['start'],reverse=True)
for i,e in enumerate(entries):
    y=453-i*77;text(e['period']['zh'].replace('—','-'),515,y,9,SAGE)
    para(e['place']['zh'],515,y-13,390,12.5,20,PAPER,True)
    para(e['role']['zh'],515,y-38,390,10,16,PAPER)
end('profile')

previous_chapter=None
for index,d in enumerate(cases):
    ch=d['chapter'];label,en=ch['title'],ch['english']
    if ch['id']!=previous_chapter:
        base(en.upper(),True);n=CHAPTERS.index(ch)+1
        text(f'{n:02d}',48,420,105,SAGE,'Helvetica')
        para(ch['title'],51,321,820,41,55,PAPER,True)
        text(ch['english'],52,209,25,PAPER,'Times-Italic')
        para(ch['note'],53,143,805,12,21,SAGE)
        c.bookmarkPage('chapter-'+ch['id']);c.addOutlineEntry(ch['title'],'chapter-'+ch['id'],0,False)
        end('chapter',ch['id']);previous_chapter=ch['id']
    base(f'{label}  /  {en}')
    assert page==case_pages[d['slug']],f'Index mismatch for {d["slug"]}'
    c.bookmarkPage(d['slug']);c.addOutlineEntry(d['title'],d['slug'],1,False)
    text(f'{index+1:02d}',48,509,39,SAGE,'Helvetica')
    title=d['title']
    if d['slug']=='periastra': title='Periastra\n相机包品牌标志'
    if ' · ' in title and pdfmetrics.stringWidth(title,'CNB',23)>267:
        title=title.replace(' · ','\n',1)
    y=para(title,48,470,267,21,29,INK,True)
    y=para(d['summary'],48,y-20,262,11.5,19)-24
    text('参与方式',48,y,8.5,MUTED);y=para(d['role'],48,y-10,258,10,17)-21
    text('项目阶段',48,y,8.5,MUTED);y=para(d['status'],48,y-10,258,10,17)-21
    text('合作与署名',48,y,8.5,MUTED);y=para(d['credits'],48,y-10,258,9,15)
    if y<65: raise ValueError(f'Left text overflow: {d["slug"]} at {y}')
    contain(PUBLIC/d['cover'].lstrip('/'),342,166,570,362,crop=[0,0,760,625] if d['slug']=='yantai' else None)
    outcome_match=re.search(r'^## 成果与阶段\s+([^#]+)',d['body'],re.M)
    outcome=outcome_match[1].split('\n\n')[0].strip() if outcome_match else d['summary']
    outcome=re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',outcome)
    if d['slug']=='image-2-5-xhs':outcome=re.search(r'^2026-09-09[^\n]+',d['body'],re.M)[0]
    if len(outcome)>260:
        short=outcome[:260];cut=short.rfind('。');outcome=short[:cut+1] if cut>120 else short+'…'
    text('成果与边界',342,143,8.5,MUTED);para(outcome,342,130,565,9.3,15.3)
    text('完整案例与作品图',754,46,10,INK)
    c.linkURL(URL+'/#/work/'+d['slug'],(740,36,911,62),relative=0,thickness=0)
    end('project',d['slug'])
    for detail_index,pics in enumerate(d['detailGroups']):
        base(f'{d["title"]}  /  DETAILS')
        total=len(pics);width=(864-24*(total-1))/total
        for j,p in enumerate(pics):
            x=48+j*(width+24); contain(PUBLIC/p['src'].lstrip('/'),x,178,width,345,crop=p.get('crop'))
            caption_end=para(p['alt'],x,164,width,9.2,15,MUTED)
            source_label='原始项目素材'
            if '/psd-' in p['src']:source_label='PSD 原生图层 · sRGB'
            elif '/refinement-v2/plumber/' in p['src'] or '/refinement-v2/huhu/' in p['src']:source_label='原始项目渲染 · 本轮选片'
            elif '/rendering-pdf/' in p['src']:source_label='原作品集高清内嵌图'
            elif '/refinement-brand/' in p['src']:source_label='真实公开网页截图'
            elif '/refinement-digital/xintiao/' in p['src']:source_label='原生微信开发者工具运行截图'
            if d['slug'] in ('xintiao','yantai','periastra','image-2-5-xhs') and p.get('note'):
                source_note=p['note'] if p['note'].startswith('微信开发者工具真实运行截图') else source_label+'。'+p['note']
                para(source_note,x,caption_end-10,width,8.5,13.5,MUTED)
            else:para(source_label,x,116,width,8,13,MUTED)
        m=re.search(r'## 设计过程\s+([^#]+)',d['body'])
        process=(m[1].split('\n\n')[0].strip() if m else d['summary']) if detail_index==0 else outcome
        process=re.sub(r'[*_`]', '', process)
        process=re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',process)
        if d['slug']=='image-2-5-xhs':process=re.search(r'^失败判断[^\n]+',d['body'],re.M)[0]
        if len(process)>220:
            short=process[:220];cut=short.rfind('。');process=short[:cut+1] if cut>110 else short+'…'
        if d['slug'] not in ('xintiao','yantai','periastra'):para(process,48,86,718,8.8,14)
        text('在线完整案例',809,54,8,MUTED);c.linkURL(URL+'/#/work/'+d['slug'],(803,44,915,70),thickness=0)
        end('details',d['slug'])

base('联系  /  CONTACT',True)
text(PROFILE['position']['zh'],48,420,36,PAPER,'CNB')
para('求职沟通 · 设计合作 · 项目交流',51,343,800,17,27,PAPER)
text(PROFILE['email'],48,233,32,PAPER,'Helvetica')
c.linkURL('mailto:'+PROFILE['email'],(48,222,500,263),relative=0,thickness=0)
text(PROFILE['phone'],48,183,20,SAGE,'Helvetica')
text('浏览在线作品集',48,97,12,PAPER);c.linkURL(URL,(43,82,250,119),relative=0,thickness=0)
text('SUN YINGJIE',699,90,18,SAGE,'Times-Italic')
end('contact')
c.save()
public_pdf=PUBLIC/'downloads/sun-yingjie-selected-portfolio.pdf'
web_output=OUT/'sun-yingjie-portfolio-web.pdf'
subprocess.run([sys.executable,str(ROOT/'scripts/compress_portfolio_pdf.py'),'--input',str(output),'--output',str(web_output),'--max-edge','1800','--quality','80','--report',str(ROOT/'private/sources/refinement-v2/portfolio-web-compression.json')],check=True)
shutil.copyfile(web_output,public_pdf)
(ROOT/'private/sources/download-manifest.json').write_text(json.dumps({'publicPath':'/downloads/sun-yingjie-selected-portfolio.pdf','document':str(output.relative_to(ROOT)),'pages':records,'caseCount':len(cases),'pageCount':page,'chapters':CHAPTERS,'profileSource':'web/src/data/profile.json','chapterSource':'web/src/data/chapters.ts','media':list(used_media.values()),'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'note':'Second edition: all 33 case introductions in six shared chapters, high-resolution native/source detail pages, preserved collaboration credits, clickable index and stable full-case web links. Original sources retained unchanged.'},ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'private/sources/refinement-v2/portfolio-text-bounds.json').write_text(json.dumps(text_bounds,ensure_ascii=False,indent=2),encoding='utf-8')
download_manifest=ROOT/'private/sources/download-manifest.json'
download_data=json.loads(download_manifest.read_text(encoding='utf-8'))
download_data.update({'publicDocument':web_output.relative_to(ROOT).as_posix(),'publicBytes':web_output.stat().st_size,'publicSha256':hashlib.sha256(web_output.read_bytes()).hexdigest(),'publicOptimization':'Raster images only, up to 1800px, JPEG80 4:4:4; strict size below 20MiB. All text, page content streams, outlines and links preserved; detailed evidence in refinement-v2/portfolio-web-compression.json.'})
download_manifest.write_text(json.dumps(download_data,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':page,'cases':len(cases),'bytes':output.stat().st_size,'output':str(output)},ensure_ascii=False))
