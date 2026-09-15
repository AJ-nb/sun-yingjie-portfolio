"""Build the 28-page selected edition from the website's canonical Chinese cases.

Run with Python containing ReportLab, Pillow and pypdf. CJK fonts can be supplied
with PORTFOLIO_FONT and PORTFOLIO_BOLD_FONT. SVG rendering uses the selected
Codex workspace Node runtime, or NODE_BINARY and NODE_PATH when supplied.
Source artwork is never modified. The complete edition remains a separate file.
"""
from pathlib import Path
import hashlib
import io
import json
import os
import re
import shutil
import subprocess
import sys
from xml.sax.saxutils import escape

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'web/public'
OUT = ROOT / 'deliverables/portfolio'
SELECTED = ['hermes', 'lighting', 'plumber', 'huhu-care', 'biyuan', 'periastra', 'lensflow', 'resume-formatter']
INK, PAPER, SAGE, MUTED, LINE = '#18251f', '#f4f1ea', '#728776', '#617066', '#d7dcd3'
W, H = 960, 600


def register_fonts():
    candidates = [
        ('C:/Windows/Fonts/msyh.ttc', 'C:/Windows/Fonts/msyhbd.ttc'),
        ('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'),
        ('/System/Library/Fonts/PingFang.ttc', '/System/Library/Fonts/PingFang.ttc'),
    ]
    normal, bold = os.environ.get('PORTFOLIO_FONT'), os.environ.get('PORTFOLIO_BOLD_FONT')
    if not normal:
        normal, bold = next(((a, b) for a, b in candidates if Path(a).is_file()), (None, None))
    if not normal:
        raise RuntimeError('Set PORTFOLIO_FONT and PORTFOLIO_BOLD_FONT to readable CJK TrueType fonts')
    pdfmetrics.registerFont(TTFont('CN', normal))
    pdfmetrics.registerFont(TTFont('CNB', bold or normal))


def rasterize_svg(original):
    """Rasterize diagrams, including embedded WebP, without machine-specific paths."""
    cache = ROOT / '.production-runtime/portfolio-svg'
    cache.mkdir(parents=True, exist_ok=True)
    target = cache / (hashlib.sha256(original.read_bytes()).hexdigest()[:24] + '.png')
    if target.exists():
        return target
    runtime = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies'
    bundled_node = runtime / 'node/bin' / ('node.exe' if os.name == 'nt' else 'node')
    node = os.environ.get('NODE_BINARY') or (str(bundled_node) if bundled_node.exists() else shutil.which('node'))
    if not node:
        raise RuntimeError('SVG diagrams need Node.js and sharp; supply NODE_BINARY and NODE_PATH')
    env = os.environ.copy()
    env.setdefault('NODE_PATH', str(runtime / 'node/node_modules'))
    code = """const fs=require('node:fs/promises'),sharp=require('sharp');
    (async()=>{let svg=await fs.readFile(process.argv[1],'utf8');
    const embeds=[...new Set(svg.match(/data:image\\/webp;base64,[A-Za-z0-9+/=]+/g)||[])];
    for(const uri of embeds){const png=await sharp(Buffer.from(uri.split(',')[1],'base64')).png().toBuffer();
    svg=svg.replaceAll(uri,'data:image/png;base64,'+png.toString('base64'));}
    await sharp(Buffer.from(svg),{density:144}).resize({width:2400,height:1800,fit:'inside'}).png().toFile(process.argv[2]);
    })().catch(e=>{console.error(e);process.exit(1)});"""
    subprocess.run([node, '-e', code, str(original), str(target)], env=env, check=True, capture_output=True)
    return target


def clean(value):
    value = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', value)
    value = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', value)
    value = re.sub(r'<!--.*?-->', '', value, flags=re.S)
    value = re.sub(r'[*_`]', '', value)
    return value.replace('Arc’teryx', "Arc'teryx").strip()


def read_cases():
    result = {}
    for path in (ROOT / 'web/src/content/works').glob('*.zh.md'):
        _, front, body = path.read_text(encoding='utf-8-sig').split('---', 2)
        data = {m[1]: m[2].strip().strip('"') for line in front.splitlines() if (m := re.match(r'^(\w+):\s*(.*)$', line))}
        sections = {m[1]: m[2] for m in re.finditer(r'^## ([^\n]+)\n(.*?)(?=^## |\Z)', body, re.M | re.S)}
        images = []
        for m in re.finditer(r'!\[([^\]]*)\]\(([^\s)]+)\)', body):
            note = re.match(r'\s*\*([^*\n]+)\*', body[m.end():])
            if (PUBLIC / m[2].lstrip('/')).is_file():
                images.append({'alt': m[1], 'src': m[2], 'note': note[1] if note else ''})
        data.update(slug=path.name[:-6], body=body, sections=sections, images=images)
        result[data['slug']] = data
    return result


def first_paragraph(value, limit=230):
    paragraphs = [clean(p) for p in re.split(r'\n\s*\n', value) if not p.strip().startswith(('#', '!', '*', '<!--'))]
    text = next((p for p in paragraphs if p), '')
    if len(text) <= limit:
        return text
    pieces = re.split(r'(?<=[。；！？])', text)
    result = ''
    for piece in pieces:
        if result and len(result + piece) > limit:
            break
        result += piece
    return result


def project_decisions(data):
    process = data['sections'].get('设计过程', '')
    matches = list(re.finditer(r'^### ([^\n]+)\n(.*?)(?=^### |\Z)', process, re.M | re.S))
    rows = [(m[1], first_paragraph(m[2], 180)) for m in matches if first_paragraph(m[2], 180)]
    if len(rows) >= 3:
        return rows[:3]
    return [(label, first_paragraph(data['sections'].get(section, ''), 180)) for label, section in [
        ('设计问题', '关键问题'), ('过程与选择', '设计过程'), ('当前结果', '成果与阶段')]]


GALLERY = {
    'hermes': ['40379d', '043e01', '54f3c9'],
    'lighting': ['e9ab15', 'a56bfb', '450b32'],
    'plumber': ['refinement-v2/plumber/exploded.webp', 'portfolio-51/006', 'refinement-v2/plumber/underground-close.webp'],
    'huhu-care': ['refinement-v2/huhu/three-quarter.webp', 'portfolio-51/023', 'refinement-v2/huhu/charging-base.webp'],
    'biyuan': ['refinement-brand/'],
    'periastra': ['structure-breakdown', 'lineweight-negative', 'application-fit'],
    'lensflow': [],
    'resume-formatter': [],
}


def gallery(data):
    images = data['images']
    chosen = []
    for fragment in GALLERY[data['slug']]:
        candidate = next((i for i in images if fragment in i['src'] and i not in chosen), None)
        if candidate:
            chosen.append(candidate)
    chosen += [p for p in images if p not in chosen and p['src'] != data['cover']]
    return chosen or [{'src': data['cover'], 'alt': data['title'], 'note': ''}]


class Edition:
    def __init__(self, filename):
        register_fonts()
        self.c = canvas.Canvas(str(filename), pagesize=(W, H), pageCompression=1)
        self.page = 0
        self.records, self.media, self.bounds = [], {}, []

    def rect(self, x, y, w, h, fill):
        self.c.setFillColor(HexColor(fill))
        self.c.rect(x, y, w, h, fill=1, stroke=0)

    def line(self, x, y, x2, y2, color=LINE):
        self.c.setStrokeColor(HexColor(color)); self.c.setLineWidth(.55)
        self.c.line(x, y, x2, y2)

    def text(self, s, x, y, size=10, color=INK, font='CN'):
        self.c.setFillColor(HexColor(color)); self.c.setFont(font, size)
        self.c.drawString(x, y, clean(s))

    def para(self, s, x, top, width, size=11, leading=None, color=INK, bold=False, floor=42):
        font='CNB' if bold else 'CN'
        lines=[]
        for part in clean(s).split('\n'):
            line=''
            for token in re.findall(r"[A-Za-z0-9_./'-]+|.",part):
                if line and pdfmetrics.stringWidth(line+token,font,size)>width-1:
                    if token in '，。、；：！？）】》”’':
                        lines.append(line[:-1].rstrip());line=line[-1]+token
                    else:
                        lines.append(line.rstrip());line=token.lstrip()
                else:
                    line+=token
            lines.append(line.rstrip())
        style = ParagraphStyle('p', fontName=font, fontSize=size,
            leading=leading or size*1.65, textColor=HexColor(color), wordWrap='CJK', splitLongWords=False)
        p = Paragraph('<br/>'.join(escape(line) for line in lines), style)
        _, height = p.wrap(width, 2000)
        if top-height < floor:
            raise ValueError(f'Text overflow on page {self.page}: {s[:50]} at {top-height:.1f}')
        p.drawOn(self.c, x, top-height)
        self.bounds.append({'page': self.page, 'text': clean(s), 'bounds': [x, top-height, x+width, top]})
        return top-height

    def image(self, public_path, x, y, w, h):
        original = PUBLIC / public_path.lstrip('/')
        path = rasterize_svg(original) if original.suffix.lower() == '.svg' else original
        with Image.open(path) as source:
            rgba = source.convert('RGBA')
            backdrop = Image.new('RGBA', rgba.size, 'white'); backdrop.alpha_composite(rgba)
            im = backdrop.convert('RGB')
        self.rect(x, y, w, h, '#e7e9e2')
        scale = min(w/im.width, h/im.height)
        dw, dh = im.width*scale, im.height*scale
        im.thumbnail((2400, 2000), Image.Resampling.LANCZOS)
        buffer = io.BytesIO(); im.save(buffer, 'JPEG', quality=91, subsampling=0)
        self.c.drawImage(ImageReader(buffer), x+(w-dw)/2, y+(h-dh)/2, width=dw, height=dh)
        entry = self.media.setdefault(public_path, {'publicPath': public_path, 'sha256': hashlib.sha256(original.read_bytes()).hexdigest(), 'pages': []})
        entry['pages'].append(self.page)

    def start(self, label, dark=False):
        self.page += 1
        self.rect(0, 0, W, H, INK if dark else PAPER)
        color = PAPER if dark else INK
        self.text('SUN YINGJIE', 48, 563, 9, color, 'Helvetica-Bold')
        self.para(label, 482, 572, 430, 8.5, 13, color)
        self.text('SELECTED WORKS  /  2026', 48, 24, 8, SAGE, 'Helvetica')
        self.text(f'{self.page:02d}', 889, 24, 9, color, 'Helvetica')
        if self.page > 2:
            self.text('目录', 838, 24, 8, color)
            self.c.linkRect('目录', 'contents', (831, 19, 872, 37), thickness=0)

    def end(self, kind, slug=None):
        self.records.append({'page': self.page, 'kind': kind, 'case': slug})
        self.c.showPage()


def build():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    OUT.mkdir(parents=True, exist_ok=True)
    profile = json.loads((ROOT / 'web/src/data/profile.json').read_text(encoding='utf-8'))
    all_cases = read_cases(); cases = [all_cases[s] for s in SELECTED]
    output = OUT / 'sun-yingjie-selected-portfolio.pdf'
    e = Edition(output)
    e.c.setTitle('孙英杰 精选设计作品集 2026')
    e.c.setAuthor('孙英杰及各项目署名协作者')
    e.c.setSubject('八个案例的设计问题、关键判断、过程材料与成果边界')
    e.start('八个案例的设计判断与过程')
    e.text(profile['name']['zh'], 48, 476, 40, font='CNB')
    e.text('Selected', 47, 393, 68, font='Times-Italic')
    e.text('Works', 47, 326, 68, font='Times-Italic')
    e.para(profile['position']['zh'], 51, 269, 310, 17, 28)
    e.para(profile['summary']['zh'], 51, 215, 300, 11.5, 20, MUTED)
    e.image(cases[0]['cover'], 395, 308, 517, 212)
    e.image(cases[1]['cover'], 395, 87, 205, 205)
    e.image(all_cases['huhu-care']['cover'], 616, 87, 296, 205)
    e.text('08 CASE STUDIES / 28 PAGES', 51, 74, 9, MUTED, 'Helvetica')
    e.para('从空间与产品，到品牌与数字体验', 51, 57, 330, 9, 15, MUTED)
    e.end('cover')

    e.start('阅读目录  /  CONTENTS')
    e.c.bookmarkPage('contents')
    e.text('从作品进入设计判断', 48, 502, 31, font='CNB')
    e.para('每个案例用三页呈现：项目与参与范围、关键选择与过程材料、成果与阶段。\n点击标题跳转；案例末页可继续访问在线交互与完整原稿。', 50, 465, 790, 12, 21, MUTED)
    labels = ['空间与商品的观看层次', '共同截面与不同支撑', '任务链与系统关系', '角色与操作的连接', '品牌表达与服务路径', '识别顺序与负形', '分析、人工确认与恢复', '局部改写与可撤销操作']
    for i, (d, subtitle) in enumerate(zip(cases, labels)):
        col, row = i//4, i%4
        x, y = 48+col*446, 373-row*76
        e.text(f'{i+1:02d}', x, y, 13, SAGE, 'Helvetica')
        e.para(d['title'], x+42, y+13, 327, 13.5, 20, bold=True)
        e.para(subtitle, x+42, y-14, 327, 10, 16, MUTED)
        e.text(f'{4+i*3:02d}', x+390, y, 10, MUTED, 'Helvetica')
        e.line(x, y-39, x+414, y-39)
        e.c.linkRect(d['title'], d['slug'], (x, y-31, x+413, y+27), thickness=0)
    e.end('contents')

    e.start('个人实践  /  PRACTICE', True)
    e.text(profile['name']['zh'], 48, 479, 39, PAPER, 'CNB')
    e.text(profile['name']['en'], 50, 441, 22, SAGE, 'Times-Italic')
    e.para(profile['position']['zh'], 48, 389, 410, 25, 38, PAPER, True)
    e.para(profile['summary']['zh'], 48, 290, 396, 13, 23, PAPER)
    e.para('商业项目保留团队署名，概念项目说明完成阶段；数字实践突出可检查、可恢复的工作流程。', 48, 163, 396, 10.5, 18, SAGE)
    for i, item in enumerate(sorted(profile['timeline'], key=lambda d:d['start'], reverse=True)):
        y=484-i*78
        e.text(item['period']['zh'].replace('—', '-'), 518, y, 9, SAGE)
        e.para(item['place']['zh'], 518, y-11, 386, 12.5, 20, PAPER, True)
        e.para(item['role']['zh'], 518, y-38, 386, 10, 16, PAPER)
    e.end('profile')

    for i, d in enumerate(cases):
        pics = gallery(d)
        e.start(f'{i+1:02d}  /  {d["title"]}')
        e.c.bookmarkPage(d['slug']); e.c.addOutlineEntry(d['title'], d['slug'], 0, False)
        e.text(f'{i+1:02d}', 48, 509, 33, SAGE, 'Helvetica')
        display_title={'periastra':'Periastra\n相机包品牌标志','resume-formatter':'Resume Formatter\n简历编辑器','biyuan':'彼源 AI\n品牌、官网与产品接入','huhu-care':'HUHU CARE\n儿童呼气检测概念'}.get(d['slug'],d['title'])
        y=e.para(display_title, 48, 470, 269, 23, 32, bold=True)
        y=e.para(d['summary'], 48, y-19, 266, 11.5, 20)-23
        for label, field in [('本人参与', 'role'), ('项目阶段', 'status'), ('合作与署名', 'credits')]:
            e.text(label, 48, y, 8.5, MUTED)
            y=e.para(d[field], 48, y-10, 263, 9.5, 16)-20
        e.image(d['cover'], 342, 204, 570, 324)
        e.text('核心问题', 342, 181, 9, MUTED)
        e.para(first_paragraph(d['sections']['关键问题'], 225), 342, 163, 568, 11, 19)
        e.end('project', d['slug'])

        e.start(f'{d["title"]}  /  关键选择与过程材料')
        e.text('看见选择的依据', 48, 502, 29, font='CNB')
        top=455
        for j,(title,body) in enumerate(project_decisions(d)):
            e.text(f'0{j+1}', 48, top-15, 11, SAGE, 'Helvetica')
            y=e.para(title, 80, top, 323, 12.5, 20, bold=True)
            y=e.para(body, 80, y-10, 323, 10.5, 17.5)
            top=y-27
        e.image(pics[0]['src'], 445, 254, 467, 274)
        e.para(pics[0]['alt'], 445, 240, 467, 9.3, 15, MUTED)
        if len(pics)>1:
            e.image(pics[1]['src'], 445, 71, 226, 126)
            e.para(pics[1]['alt'], 687, 188, 221, 9.5, 16, MUTED)
            if pics[1]['note']:
                e.para(pics[1]['note'], 687, 137, 221, 8.5, 14, MUTED)
        e.end('decisions', d['slug'])

        e.start(f'{d["title"]}  /  成果与阶段')
        result = pics[2] if len(pics)>2 else next((p for p in d['images'] if p['src']==d['cover']),{'src':d['cover'],'alt':d['title'],'note':''})
        e.image(result['src'], 48, 203, 570, 325)
        e.para(result['alt'], 48, 188, 569, 9.5, 16, MUTED)
        if result['note']:
            e.para(result['note'], 48, 152, 569, 9, 15, MUTED)
        e.text('成果与边界', 658, 500, 22, font='CNB')
        y=e.para(first_paragraph(d['sections']['成果与阶段'], 300), 658, 460, 252, 11.5, 20)
        y=e.para('完成阶段', 658, y-29, 252, 9, 15, MUTED)
        y=e.para(d['status'], 658, y-9, 252, 10.5, 18)
        e.line(658, y-24, 912, y-24)
        next_step=re.search(r'^### 下一项需要验证的判断\n(.*?)(?=^### |<details>|\Z)',d['sections']['成果与阶段'],re.M|re.S)
        if next_step:
            e.para('下一项需要验证的判断',658,y-41,252,9,15,MUTED)
            e.para(first_paragraph(next_step[1],180).replace('以下保留早期版本供对照。',''),658,y-66,252,9.5,16.5,MUTED)
        else:
            e.para('在线案例提供完整作品图、交互讲解及来源说明。',658,y-41,252,9.5,16.5,MUTED)
        e.text('阅读完整案例  →', 658, 67, 11, INK)
        url=profile['url'].rstrip('/')+'/#/work/'+d['slug']
        e.c.linkURL(url,(649,51,912,88),thickness=0)
        e.end('outcome', d['slug'])

    e.start('联系  /  CONTACT', True)
    e.text('让想法进入具体的体验', 48, 421, 33, PAPER, 'CNB')
    e.para(profile['position']['zh'], 51, 351, 800, 20, 31, PAPER)
    e.text(profile['email'], 48, 231, 32, PAPER, 'Helvetica')
    e.c.linkURL('mailto:'+profile['email'], (48,220,600,265), thickness=0)
    e.text(profile['phone'], 48, 180, 20, SAGE, 'Helvetica')
    e.text(profile['url'], 48, 104, 11, PAPER, 'Helvetica')
    e.c.linkURL(profile['url'],(45,90,650,127),thickness=0)
    e.para('完整作品集另收录六个章节、三十三个案例及项目图集。', 48, 72, 780, 10, 17, SAGE)
    e.end('contact')
    assert e.page == 28
    e.c.save()
    web_output=OUT/'sun-yingjie-selected-portfolio-web.pdf'
    subprocess.run([sys.executable,str(ROOT/'scripts/compress_portfolio_pdf.py'),'--input',str(output),'--output',str(web_output),'--max-edge','1800','--quality','84','--report',str(OUT/'selected-compression.json')],check=True)
    public=PUBLIC/'downloads/sun-yingjie-selected-portfolio.pdf'
    public.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(web_output,public)
    manifest={'edition':'selected-v3','pageCount':e.page,'caseCount':len(cases),'caseSlugs':SELECTED,'document':str(output.relative_to(ROOT)).replace('\\','/'),'publicPath':'/downloads/sun-yingjie-selected-portfolio.pdf','profileSource':'web/src/data/profile.json','contentSource':'web/src/content/works/*.zh.md','pages':e.records,'media':list(e.media.values()),'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'publicSha256':hashlib.sha256(public.read_bytes()).hexdigest(),'publicBytes':public.stat().st_size}
    manifest['sourceHashes']={str(path.relative_to(ROOT)).replace('\\','/'):hashlib.sha256(path.read_bytes()).hexdigest() for path in [ROOT/'web/src/data/profile.json',*(ROOT/f'web/src/content/works/{slug}.zh.md' for slug in SELECTED)]}
    (OUT/'selected-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/'qa').mkdir(exist_ok=True)
    (OUT/'qa/selected-text-bounds.json').write_text(json.dumps(e.bounds,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'pages':e.page,'cases':len(cases),'output':str(output),'publicBytes':public.stat().st_size},ensure_ascii=False))


if __name__ == '__main__':
    build()
