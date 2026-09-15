"""Layout helpers and entry point for the 32-page v5 selected edition.

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
PUBLICATION = json.loads((ROOT/'web/src/data/publication.json').read_text(encoding='utf-8'))
SELECTED = [item['slug'] for item in PUBLICATION['selected']]
INK, PAPER, SAGE, MUTED, LINE = '#131613', '#f5f3ed', '#bddb42', '#61665f', '#d9ddd1'
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
    for name,filename in [('Body','DM-Sans-Regular.ttf'),('BodyBold','DM-Sans-SemiBold.ttf'),('Display','Epilogue-Medium.ttf')]:
        font_path=PUBLIC/'fonts/documents'/filename
        if not font_path.exists():raise FileNotFoundError(font_path)
        pdfmetrics.registerFont(TTFont(name,str(font_path)))


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
    for fragment in GALLERY.get(data['slug'], []):
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
        font={'Helvetica':'Body','Helvetica-Bold':'BodyBold','Times-Italic':'Display'}.get(font,font)
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
            im = rgba.copy() if rgba.getextrema()[3][0] < 255 else rgba.convert('RGB')
        self.rect(x, y, w, h, PAPER)
        scale = min(w/im.width, h/im.height)
        dw, dh = im.width*scale, im.height*scale
        im.thumbnail((2400, 2000), Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        if im.mode == 'RGBA': im.save(buffer, 'PNG')
        else: im.save(buffer, 'JPEG', quality=91, subsampling=0)
        self.c.drawImage(ImageReader(buffer), x+(w-dw)/2, y+(h-dh)/2, width=dw, height=dh, mask='auto')
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
    from build_selected_v5 import build as build_v5
    build_v5()

if __name__ == '__main__':
    build()
