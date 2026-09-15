"""32-page editorial edition using canonical facts, cases and selection order."""
from pathlib import Path
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
import json, hashlib, shutil, subprocess, sys
from build_selected_portfolio import Edition, ROOT, PUBLIC, OUT, PAPER, INK, MUTED, SAGE, read_cases, first_paragraph, project_decisions, clean

CONFIG=json.loads((ROOT/'web/src/data/publication.json').read_text(encoding='utf-8'))
DETAILS={
 'biyuan': [('品牌承诺 / 首次进入','背景','home-desktop.png'),('选择模型 / 两种路径','设计过程','models-desktop.png'),('移动端 / 行动优先','最终作品','home-mobile.png')],
 'periastra':[('方向对照 / 为什么选择字标','设计过程','exploration-orbit.png'),('应用检查 / 名称成为识别','最终作品','final-wordmark.png')],
 'yelisi':[('方向演化 / 从曲线到私印','设计过程','songnasty-historical-logo.webp'),('应用秩序 / 稳定与流动','最终作品','yelisi-logo.webp')],
 'lighting':[('系列关系 / 长度、朝向与支撑','最终作品','450b32')],
 'hermes':[('季节对照 / 商品与观看层次','设计过程','40379d')],
 'lensflow':[('交互状态 / 输入、确认与恢复','设计过程','studio-guide')],
}
INTERACTION={
 'biyuan':['理解服务','选择用途','找到模型','进入使用'],
 'periastra':['字体标志','探索比较','缩放检查','工艺复核'],
 'yelisi':['历史曲线','中文私印','应用层级','样片复核'],
 'lighting':['台灯','落地灯','壁灯','吊灯'],
 'hermes':['商品位置','道具比例','前后层次','季节切换'],
 'lensflow':['采集与分析','编辑简报','确认输入','局部恢复'],
}

def build():
    sys.stdout.reconfigure(encoding='utf-8')
    OUT.mkdir(parents=True,exist_ok=True)
    p=json.loads((ROOT/'web/src/data/profile.json').read_text(encoding='utf-8'))
    all_cases=read_cases();cases=[all_cases[x['slug']] for x in CONFIG['selected']]
    output=OUT/'sun-yingjie-selected-portfolio.pdf';e=Edition(output)
    e.c.setTitle('孙英杰 · 品牌与产品设计 · 精选作品集 v5')
    e.c.setAuthor('孙英杰及各项目署名协作者')
    e.c.setSubject('六个案例：问题、职责、取舍、交付与验证阶段')
    e.start('BRAND / PRODUCT / AI')
    e.text('让设计',48,459,53,font='CNB');e.text('走向交付。',48,390,53,font='CNB')
    e.text('DESIGN INTO PRACTICE',51,348,13,font='Helvetica')
    e.para(p['name']['zh']+' / '+p['name']['en'],50,283,360,19,29,bold=True)
    e.para(p['position']['zh'],50,235,355,15,25)
    e.para(p['summary']['zh'],50,162,350,11,19,MUTED)
    e.image(cases[0]['cover'],458,300,454,223)
    e.image(cases[1]['cover'],458,65,220,217)
    e.image(cases[3]['cover'],694,65,218,217)
    e.text('06 CASES / 32 PAGES / 2026.09',50,66,9,MUTED,'Helvetica');e.end('cover')

    e.start('阅读目录 / CONTENTS');e.c.bookmarkPage('contents')
    e.text('六个项目，一条工作主线。',48,498,32,font='CNB')
    e.para('定义问题 → 形成系统 → 比较方案 → 推进交付',50,458,800,16,25,MUTED)
    first=4
    for i,(case,entry) in enumerate(zip(cases,CONFIG['selected'])):
        x=48+(i//3)*448;y=365-(i%3)*99
        e.text(f'0{i+1}',x,y,16,SAGE,'Helvetica-Bold')
        e.para(case['title'],x+43,y+18,320,16,23,bold=True)
        e.para(entry['focus'],x+43,y-18,320,10.5,18,MUTED)
        e.text(f'{first:02d}—{first+entry["pages"]-1:02d}',x+43,y-53,9,MUTED,'Helvetica')
        e.c.linkRect(case['title'],case['slug'],(x,y-62,x+408,y+23),thickness=0)
        first+=entry['pages']
    e.para('先读精选案例；更多产品概念、模型视角、原始展板与开源实践，见在线扩展档案。',50,73,800,10,17,MUTED)
    e.end('contents')

    e.start('个人介绍 / ABOUT')
    e.text('孙英杰',48,489,35,font='CNB');e.text('YINGJIE SUN',50,454,16,font='Helvetica')
    e.para('连接品牌、产品与数字体验。',48,410,404,24,35,bold=True)
    e.para(p['summary']['zh'],48,312,402,13,22)
    e.para('产品设计训练帮助我理解使用关系；商业项目让我关注比例、材料与交付；AI 实践让我把分析、确认和恢复写进可操作的流程。',48,215,402,12,21,MUTED)
    portrait=PUBLIC/'media/v5/portrait.png'
    if portrait.exists():e.image('/media/v5/portrait.png',48,57,135,120)
    e.para('品牌系统 / 产品与空间\nAI 工作流 / 原型与实现\n版本管理 / 上线协作',207,156,230,12,22)
    timeline=[next(t for t in p['timeline'] if t['id']==id) for id in ['liling','benwu','ouyin','education']]
    for i,t in enumerate(timeline):
        y=495-i*108
        e.text(t['period']['zh'],512,y,10,MUTED)
        e.para(t['place']['zh'],512,y-15,394,15,22,bold=True)
        e.para(t['role']['zh'],512,y-44,394,10,16,MUTED)
        e.para(t['description']['zh'],512,y-66,394,9,15,MUTED)
    e.end('profile')

    for i,d in enumerate(cases):
        slug=d['slug'];start=e.page+1;url=p['url'].rstrip('/')+'/#/work/'+slug
        pics=[im for im in d['images'] if 'snake-component' not in im['src']]
        cover={'src':d['cover'],'alt':d['title'],'note':''}
        e.start(f'0{i+1} / '+d['title']);e.c.bookmarkPage(slug);e.c.addOutlineEntry(d['title'],slug,0,False)
        e.text(f'0{i+1}',48,497,43,SAGE,'Helvetica')
        y=e.para(d['title'],48,444,279,25,34,bold=True)
        y=e.para(d['summary'],48,y-22,279,12,21)-24
        for label,field in [('我的职责','role'),('项目阶段','status'),('合作归属','credits')]:
            e.text(label,48,y,9,MUTED);y=e.para(d[field],48,y-13,279,10,17)-21
        e.image(d['cover'],357,209,555,317)
        e.text('设计命题',357,183,9,MUTED)
        e.para(first_paragraph(d['sections']['关键问题'],240),357,164,555,12,21)
        e.end('project',slug)

        e.start(d['title']+' / DESIGN DECISIONS')
        e.text('选择背后的依据',48,494,31,font='CNB')
        top=441
        for j,(title,body) in enumerate(project_decisions(d)):
            e.text(f'0{j+1}',48,top-15,12,MUTED,'Helvetica')
            y=e.para(title,88,top,354,14,22,bold=True)
            y=e.para(body,88,y-9,354,10.5,18);top=y-25
        pic=next((im for im in pics if im['src']!=d['cover']),cover)
        e.image(pic['src'],484,188,428,338)
        e.para(pic['alt'],484,170,428,10,17,MUTED)
        e.end('decisions',slug)

        for j,(title,section,match) in enumerate(DETAILS[slug]):
            e.start(d['title']+' / '+title)
            e.text(title,48,492,27,font='CNB')
            pic=next((im for im in pics if match in im['src']),cover)
            # Generated application assets are optional until the image workflow completes.
            candidate={'periastra':'periastra-application.png','yelisi':'yelisi-application.png'}.get(slug)
            if j==1 and candidate and (PUBLIC/'works/v5'/candidate).exists():
                pic={'src':'/works/v5/'+candidate,'alt':'品牌应用视觉提案','note':'AI 辅助应用表现，非实物打样。'}
            if slug=='biyuan' and 'mobile' in match:
                e.image(pic['src'],52,81,295,363)
                e.para('让主要行动在小屏幕上仍然清楚',389,422,518,25,35,bold=True)
                e.para(first_paragraph(d['sections']['成果与阶段'],260),389,319,511,13,22)
                e.para(pic.get('note',''),389,161,511,9,16,MUTED)
            else:
                e.image(pic['src'],48,125,595,324)
                e.para(pic['alt'],48,110,595,9,15,MUTED)
                decisions=project_decisions(d);heading,body=decisions[min(j,len(decisions)-1)]
                e.para(heading,681,440,230,17,26,bold=True)
                y=e.para(body,681,345,230,11.5,20)
                e.para(pic.get('note',''),681,min(y-23,170),230,9,15,MUTED)
            e.end('application',slug)

        e.start(d['title']+' / DELIVERY & REVIEW')
        e.text('从作品，到可以继续的工作。',48,493,28,font='CNB')
        e.para(first_paragraph(d['sections']['成果与阶段'],330),48,439,487,13,22)
        e.para('交互阅读路径',590,439,322,17,26,bold=True)
        for j,label in enumerate(INTERACTION[slug]):
            yy=369-j*58;e.text(f'0{j+1}',590,yy,12,MUTED,'Helvetica')
            e.para(label,633,yy+14,278,15,24,bold=True)
        e.para('在线操作把不同状态放在同一尺度下比较，帮助读者理解设计判断。PDF 保留关键画面与路径说明。',590,125,320,10,17,MUTED)
        pic=cover if slug in ('biyuan','lighting') else next((im for im in reversed(pics) if 'snake' not in im['src']),cover)
        e.image(pic['src'],48,77,487,192)
        e.text('阅读完整案例 →',48,52,10)
        e.c.linkURL(url,(45,40,400,71),thickness=0)
        e.end('outcome',slug)
        assert e.page-start+1==CONFIG['selected'][i]['pages'],slug

    e.start('联系 / CONTACT',True)
    e.text('下一步，做出具体的改变。',48,449,34,PAPER,'CNB')
    e.para(p['position']['zh'],48,368,820,20,32,PAPER)
    e.text(p['email'],48,250,32,PAPER,'Helvetica');e.c.linkURL('mailto:'+p['email'],(48,235,640,286),thickness=0)
    e.text(p['phone'],48,195,22,SAGE,'Helvetica')
    qr=QrCodeWidget(p['url']); bounds=qr.getBounds(); size=132
    code=Drawing(size,size,transform=[size/(bounds[2]-bounds[0]),0,0,size/(bounds[3]-bounds[1]),0,0]);code.add(qr)
    e.rect(756,174,size,size,'#ffffff');renderPDF.draw(code,e.c,756,174)
    e.para('扫码阅读在线作品集',756,154,155,10,17,PAPER)
    e.text(p['url'],48,112,12,PAPER,'Helvetica');e.c.linkURL(p['url'],(45,98,715,137),thickness=0)
    e.para('在线阅读 / 交互案例 / 扩展档案 / 简历下载',48,74,750,10,17,PAPER)
    e.end('contact');assert e.page==CONFIG['selectedPageCount']==32;e.c.save()
    web_output=OUT/'sun-yingjie-selected-portfolio-web.pdf'
    subprocess.run([sys.executable,str(ROOT/'scripts/compress_portfolio_pdf.py'),'--input',str(output),'--output',str(web_output),'--max-edge','1800','--quality','87','--report',str(OUT/'selected-compression.json')],check=True)
    target=PUBLIC/'downloads/sun-yingjie-selected-portfolio.pdf';shutil.copyfile(web_output,target)
    manifest={'edition':'selected-v5','pageCount':e.page,'caseCount':len(cases),'caseSlugs':[d['slug'] for d in cases],'pages':e.records,'media':list(e.media.values()),'profileSource':'web/src/data/profile.json','selectionSource':'web/src/data/publication.json','sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'publicSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'publicBytes':target.stat().st_size}
    manifest['sourceHashes']={str(f.relative_to(ROOT)).replace('\\','/'):hashlib.sha256(f.read_bytes()).hexdigest() for f in [ROOT/'web/src/data/profile.json',ROOT/'web/src/data/publication.json',*(ROOT/f'web/src/content/works/{d["slug"]}.zh.md' for d in cases)]}
    (OUT/'selected-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/'qa').mkdir(exist_ok=True);(OUT/'qa/selected-text-bounds.json').write_text(json.dumps(e.bounds,ensure_ascii=False),encoding='utf-8')
    print(json.dumps({'pages':e.page,'cases':len(cases),'output':str(output),'publicBytes':target.stat().st_size}))

if __name__=='__main__':build()
