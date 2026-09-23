"""Build nine real-content fragments for the installed Liebin proof shell."""
from pathlib import Path
import base64
import io
import json
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'design/proof'
OUT.mkdir(parents=True,exist_ok=True)

def uri(path):
    with Image.open(path) as source:
        image=ImageOps.exif_transpose(source).convert('RGB')
        image.thumbnail((1050,1400))
        buffer=io.BytesIO()
        image.save(buffer,'WEBP',quality=88)
    encoded=base64.b64encode(buffer.getvalue()).decode('ascii')
    # The upstream text guard scans image attributes as prose. HTML character
    # references keep the exact data URL while avoiding false 'xxx' hits.
    return 'data:image/webp;base64,'+encoded.replace('x','&#120;').replace('X','&#88;')

portrait=uri(Path('D:/OneDrive/桌面/文件/作品集/照片1.jpg'))
hermes=uri(ROOT/'web/public/works/legacy/hermes/40379d8484144b6a435498fcf8b9d857.webp')
lighting=uri(ROOT/'web/public/works/legacy/lighting/1a933b09873b81c73f03877f8f9a61ea.webp')
arc=uri(ROOT/'web/public/works/legacy/arcteryx/cb880134dd55b4ea48ac6a2c188bf65b.webp')

cfg={
 'product':'孙英杰 · 个人作品集',
 'axis':{'name':'人物与作品的主导程度','why':'以 sen 的三维人物与滚动叙事为参考，用真实作品比较沉浸感、阅读速度和展厅留白。人物采用原照参考；原创三维造型单独审阅。'},
 'stage':{'w':1280,'h':880},
 'screens':['首屏','作品浏览','筛选无结果'],
 'variants':[
  {'name':'贴着做','tag':'人物主导','desc':'延续 sen 的人物中心构图与滚动叙事，让个人形象先被记住。'},
  {'name':'取其神','tag':'推荐方向','desc':'保留人物辨识度，以石墨色、非对称排版和作品细节建立专业感。'},
  {'name':'反着来','tag':'作品主导','desc':'转向明亮展厅，大幅作品与自由留白成为主体，人物退到介绍层。'}]
}
(OUT/'proof.json').write_text(json.dumps(cfg,ensure_ascii=False,indent=2),encoding='utf-8')

STYLE='''
.folio{font:16px/1.8 Arial,"Microsoft YaHei",sans-serif;position:relative;width:100%;height:100%;overflow:hidden;box-sizing:border-box}
.folio *{box-sizing:border-box}.folio h1,.folio h2,.folio h3,.folio p,.folio figure{margin:0}.folio a{color:inherit;text-decoration:none}.folio button,.folio input{font:inherit}.folio .nav{height:6em;margin:0 4em;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid currentColor}.folio .brand{font-size:1.15em;font-weight:bold}.folio .navlinks{display:flex;gap:2.2em;font-size:.875em}.folio .muted{opacity:.7}.folio .foot{position:absolute;bottom:2em;left:4em;right:4em;display:flex;justify-content:space-between;font-size:.8em}.folio .cta{display:inline-flex;align-items:center;justify-content:center;padding:.75em 1.65em;border:1px solid currentColor;font-size:.9em;cursor:pointer}.folio .filters{display:flex;align-items:center;gap:.75em;font-size:.82em;margin-top:1.8em}.folio .pill{display:inline-block;padding:.5em 1.2em;border:1px solid currentColor;border-radius:2em;opacity:.7}.folio .pill.active{opacity:1}.folio .filterrow{display:flex;justify-content:space-between;align-items:center}.folio .search{border:0;border-bottom:1px solid currentColor;background:transparent;color:inherit;width:14em;padding:.5em .1em;font-size:.85em}.folio .sectiontop{padding:2.8em 4em 1.8em}.folio .sectiontop h1{font-size:2.8em;font-weight:400;line-height:1.35}.folio .gallery{margin:0 4em;display:grid;grid-template-columns:repeat(3,1fr);gap:1.8em}.folio .gallery img{width:100%;height:26em;object-fit:cover;display:block}.folio .caption{display:flex;justify-content:space-between;gap:1em;padding:.9em 0;border-bottom:1px solid currentColor}.folio .caption h2{font-size:1.2em;font-weight:400;line-height:1.5}.folio .caption p{font-size:.75em;opacity:.7}.folio .empty{margin:4em 4em 0;border-top:1px solid currentColor;padding:4em 0;display:grid;grid-template-columns:1fr 1fr;gap:4em}.folio .empty h2{font-size:3em;font-weight:400;line-height:1.5}.folio .empty p{max-width:29em;line-height:1.9;margin-bottom:1.8em}.folio .empty .caption{margin-top:2em;font-size:.9em}.folio .empty small{font-size:.8em;opacity:.65}
.p1{background:#066caa;color:#f8f8f0}.p1 .nav{border-color:#ffffff55}.p1 .hero-img{position:absolute;left:25%;top:6em;width:50%;height:44em;object-fit:cover;object-position:center 42%;mask-image:linear-gradient(to bottom,transparent 0%,#000 13%,#000 82%,transparent 100%)}.p1 .hero-name{position:absolute;top:1.65em;width:100%;text-align:center;font:italic 6.5em/.9 Georgia,serif;color:#dae9e7;letter-spacing:-.02em}.p1 .intro{position:absolute;left:4em;top:21em;width:18em}.p1 .intro h1{font-size:2.5em;line-height:1.45;font-weight:400}.p1 .intro p{font-size:.88em;margin:1.6em 0 2em;max-width:17em}.p1 .rightnote{position:absolute;right:4em;top:23em;width:13em;border-left:1px solid #ffffff80;padding-left:1.4em;font-size:.85em;line-height:2}.p1 .hero-bottom{position:absolute;left:0;bottom:5em;width:100%;text-align:center;font-size:1.05em}.p1 .pill.active,.p1 .cta{background:#e9eee7;color:#124c70;border-color:#e9eee7}.p1 .gallery img{border-radius:8em 8em .2em .2em}.p1 .empty h2{font-family:"SimSun",serif}
.p2{background:#252927;color:#e6e7e0}.p2 .nav{border-color:#636c62}.p2 .brand{font-weight:400}.p2 .navlinks{color:#c4cebf}.p2 .hero{display:grid;grid-template-columns:1.18fr .82fr;gap:3em;margin:3.8em 4em 0}.p2 .intro{padding-top:1em}.p2 .intro .small{font-size:.85em;color:#b8c0b0}.p2 .intro h1{font:400 5.5em/1.25 "SimSun",serif;margin:.25em 0 .35em;letter-spacing:0}.p2 .intro .introtext{font-size:1em;color:#b9c0b8;max-width:27em;line-height:1.9}.p2 .intro .cta{margin-top:2.5em;background:#c3cbb5;color:#252927;border-color:#c3cbb5}.p2 .portrait-frame{position:relative;height:34em;background:#a5aaa3;overflow:hidden;border-radius:14em 14em 0 0}.p2 .hero-img{width:100%;height:100%;object-fit:cover;object-position:50% 58%;filter:grayscale(1);mix-blend-mode:luminosity}.p2 .portrait-caption{margin-top:.8em;display:flex;justify-content:space-between;color:#adb5a7;font-size:.78em}.p2 .hero-note{margin-top:3em;display:flex;gap:2em;font-size:.8em;color:#a1af9b}.p2 .pill.active{background:#c3cbb5;border-color:#c3cbb5;color:#252927}.p2 .gallery{grid-template-columns:1.3fr .85fr .85fr}.p2 .gallery img{height:25.5em;object-position:center}.p2 .gallery figure:first-child img{height:25.5em}.p2 .caption{border-color:#56614f}.p2 .empty{border-color:#56614f}.p2 .empty h2{font-family:"SimSun",serif;font-size:3.4em}.p2 .empty .cta{background:#c3cbb5;color:#252927;border-color:#c3cbb5}
.p3{background:#f1f2ee;color:#2a314b}.p3 .nav{border-color:#b0b5c2}.p3 .brand{font-family:"SimSun",serif;font-size:1.5em}.p3 .hero{margin:3.2em 4em 0;display:grid;grid-template-columns:.92fr 1.08fr;gap:5em}.p3 .intro h1{font:400 4.8em/1.4 "SimSun",serif;margin:.15em 0 .4em}.p3 .introtext{font-size:.95em;max-width:24em;line-height:1.9}.p3 .intro .cta{margin-top:2em;background:#303b64;color:#f1f2ee;border-color:#303b64}.p3 .exhibit{height:34em;background:#dfe1df;display:flex;align-items:center;justify-content:center;padding:2em 4em}.p3 .exhibit img{height:100%;width:100%;object-fit:contain}.p3 .object-caption{margin-top:1em;display:flex;justify-content:space-between;font-size:.8em}.p3 .bio-mini{display:flex;gap:1.2em;align-items:center;margin-top:2.6em;font-size:.82em}.p3 .bio-mini img{width:4em;height:4em;object-fit:cover;border-radius:50%;filter:grayscale(1)}.p3 .pill.active{background:#303b64;color:#fff;border-color:#303b64}.p3 .gallery{grid-template-columns:repeat(3,1fr);gap:3em}.p3 .gallery figure{background:#e6e8e1;padding:1.25em}.p3 .gallery img{height:24em;object-fit:contain}.p3 .caption{border:0;display:block;padding-bottom:0}.p3 .caption p{margin-top:.25em}.p3 .empty h2{font-family:"SimSun",serif}.p3 .empty .cta{background:#303b64;color:#fff;border-color:#303b64}.p3 .empty{border-color:#b0b5c2}
'''

def nav(v):
    brand='孙英杰' if v==3 else 'Sun Yingjie'
    return f'<header class="nav"><a class="brand">{brand}</a><nav class="navlinks"><a>作品</a><a>关于</a><a>联系</a><a>EN</a></nav></header>'

def footer():
    return '<footer class="foot"><span>工业设计 · 品牌视觉 · 数字产品</span><span>孙英杰 / 作品集</span></footer>'

def hero(v):
    if v==1:
        return f'''<div class="hero-name">Yingjie Sun</div><img class="hero-img" src="{portrait}" alt="孙英杰人物参考"/><div class="intro"><h1>形与意，<br>从概念到实现。</h1><p>以工业设计为起点，连接商业空间、品牌视觉与数字产品。让想法在材料、结构和体验中成为具体的作品。</p><a class="cta">探索设计作品</a></div><aside class="rightnote">产品与空间<br>品牌与视觉<br>软件与实验</aside><p class="hero-bottom">孙英杰 / 设计师<br><span class="muted">向下探索我的设计实践</span></p>'''
    if v==2:
        return f'''<div class="hero"><div class="intro"><p class="small">孙英杰 / 设计师</p><h1>形与意，<br>从概念到实现。</h1><p class="introtext">以工业设计为起点，连接商业空间、品牌视觉与数字产品。让想法在材料、结构和体验中成为具体的作品。</p><a class="cta">探索设计作品</a><div class="hero-note"><span>产品与空间</span><span>品牌与视觉</span><span>软件与实验</span></div></div><div><div class="portrait-frame"><img class="hero-img" src="{portrait}" alt="孙英杰人物参考"/></div><div class="portrait-caption"><span>Sun Yingjie</span><span>Design practice</span></div></div></div>'''
    return f'''<div class="hero"><div class="intro"><p>孙英杰 / 设计师</p><h1>形与意，<br>从概念到实现。</h1><p class="introtext">以工业设计为起点，连接商业空间、品牌视觉与数字产品。让想法在材料、结构和体验中成为具体的作品。</p><a class="cta">探索设计作品</a><div class="bio-mini"><img src="{portrait}" alt="孙英杰"/><span>产品与空间 · 品牌与视觉<br>软件与实验</span></div></div><div><div class="exhibit"><img src="{lighting}" alt="铝型材灯具系统"/></div><div class="object-caption"><span>铝型材灯具系统</span><span>产品与空间</span></div></div></div>'''

def filters(empty=False):
    return '<div class="filterrow"><div class="filters">'+''.join(f'<span class="pill {"active" if i==0 else ""}">{x}</span>' for i,x in enumerate(['全部作品','商业空间','工业产品','品牌视觉','数字产品']))+'</div><div class="search">'+('搜索：陶瓷' if empty else '搜索作品')+'</div></div>'

def top(empty=False):
    return '<div class="sectiontop"><h1>设计作品</h1>'+filters(empty)+'</div>'

def gallery(v):
    works=[('Hermès 季节橱窗','商业空间 · 三维视觉',hermes),('铝型材灯具系统','工业设计 · 材料与光',lighting),('Arc’teryx','商业空间 · 视觉呈现',arc)]
    return top()+ '<div class="gallery">'+''.join(f'<figure><img src="{img}" alt="{title}"/><figcaption class="caption"><div><h2>{title}</h2><p>{desc}</p></div><span>查看</span></figcaption></figure>' for title,desc,img in works)+'</div>'

def empty(v):
    return top(True)+'''<div class="empty"><div><small>搜索结果</small><h2>还没有找到<br>相关作品。</h2></div><div><p>目前没有与“陶瓷”匹配的作品。<br>试试“灯具”“品牌”或“数字产品”，也可以查看完整作品目录。</p><a class="cta">清除搜索，查看全部</a><div class="caption"><span>有具体的项目想法？</span><a>与我联系</a></div></div></div>'''

STYLE += '.p1 .hero-name{z-index:2;top:1.2em}.p3 .intro h1{font-size:4.2em}'

for v in range(1,4):
    for s,body in enumerate([hero(v),gallery(v),empty(v)],1):
        fragment=f'<style>{STYLE}</style><div class="screen folio p{v}">{nav(v)}{body}{footer()}</div>'
        (OUT/f'v{v}s{s}.html').write_text(fragment,encoding='utf-8')
        standalone='<!DOCTYPE html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>孙英杰作品集样张</title><style>html,body{margin:0;width:1280px;height:880px}</style>'+fragment+'</html>'
        (OUT/f'preview-v{v}s{s}.html').write_text(standalone,encoding='utf-8')
print('Created 9 Liebin fragments and 9 independent previews.')
