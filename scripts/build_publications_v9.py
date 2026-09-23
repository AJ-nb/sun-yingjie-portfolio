"""Bilingual publications driven by the same profile, cases and registry as the web."""
import argparse,copy,hashlib,json,math,re,shutil,sys
from pathlib import Path
from PIL import Image
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.pdfbase import pdfmetrics
from build_selected_portfolio import Edition,ROOT,PUBLIC,OUT,INK,MUTED,SAGE,read_cases

def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def load(name):return json.loads((ROOT/name).read_text(encoding='utf-8'))
def choose(lang,zh,en):return zh if lang=='zh' else en

class Publication(Edition):
    def __init__(self,filename,lang,archive):
        super().__init__(filename);self.lang=lang;self.archive_image_profile=archive
    def text(self,s,x,y,size=10,color=INK,font='CN'):
        if self.lang=='en':font={'CN':'Body','CNB':'BodyBold'}.get(font,font)
        super().text(s,x,y,size,color,font)
    def start(self,label,dark=False):
        self.page+=1;self.rect(0,0,960,600,'#ffffff')
        self.text('YINGJIE SUN',48,563,9,INK,'Helvetica-Bold')
        self.para(label,450,572,462,8.5,12,MUTED)
        self.text('INDUSTRIAL & PRODUCT DESIGN / 2026',48,24,8,MUTED,'Helvetica')
        self.text(f'{self.page:02d}',890,24,9,INK,'Helvetica')
        if self.page>2:
            title=choose(self.lang,'目录','Contents');self.text(title,817,24,8,MUTED)
            self.c.linkRect(title,'contents',(809,17,875,37),thickness=0)

def ratio(src):
    if src.endswith('.svg'):return 1.7
    with Image.open(PUBLIC/src.lstrip('/')) as im:return im.width/im.height

def get_plan(variant,config,mapping,cases,lang='zh'):
    if variant!='full':
        edition=copy.deepcopy(config['editions'][variant]);result=[]
        names={'overview':'Selected work','brand':'Brand and visual systems','physical':'Product form, CMF and use','digital':'Digital products and creative systems'}
        if lang=='en':edition['title']=names[variant]
        for row in edition['cases']:
            lookup={p['id']:p for p in mapping['casePages'][row['slug']]}
            result.append({'slug':row['slug'],'pages':[copy.deepcopy(lookup[id]) for id in row['pageIds']]})
        if lang=='en':
            translations=load('web/src/data/publication-locales.json')
            for row in result:
                for page in row['pages']:
                    en=translations[row['slug']][page['id']];page.update(title=en['title'],body=en['body'])
                    for pic,caption in zip(page['images'],en['captions']):pic['caption']=caption
        return edition,result
    chapter=(ROOT/'web/src/data/chapters.ts').read_text(encoding='utf-8')
    ordered=re.findall(r"'([^']+)'",chapter.split('const sequence:')[1].split('// Dates')[0])
    slugs=[s for s in ordered if s in cases and s not in config['excludedSlugs']]
    if set(slugs)!=set(cases)-set(config['excludedSlugs']) or len(slugs)!=len(set(slugs)):raise ValueError('Archive must cover every public case exactly once')
    result=[]
    for slug in slugs:
        images={p['src']:copy.deepcopy(p) for p in mapping['archiveImages'].get(slug,[])}
        images.setdefault(cases[slug]['cover'],{'src':cases[slug]['cover'],'caption':cases[slug]['title']})
        for pic in cases[slug]['images']:images.setdefault(pic['src'],{'src':pic['src'],'caption':pic['alt']})
        if lang=='en':
            alts={p['src']:p['alt'] for p in cases[slug]['images']}
            for pic in images.values():pic['caption']=alts.get(pic['src'],pic.get('captionEn',cases[slug]['title']))
        pages=[];remaining=list(images.values())
        while remaining:
            first=remaining.pop(0);group=[first]
            if ratio(first['src'])<1.55 and remaining and ratio(remaining[0]['src'])<1.55:group.append(remaining.pop(0))
            pages.append({'id':f'archive-{len(pages)+1}','title':choose(lang,'图像档案','Image archive')+f' {len(pages)+1:02d}','body':'','images':group})
        if slug=='ai-video-systems' and pages:
            study=next(p for p in mapping['casePages'][slug] if p['id']=='evaluation')
            if lang=='en':study=load('web/src/data/publication-locales.json')[slug]['evaluation']
            pages[-1].update(title=study['title'],body=study['body'])
        result.append({'slug':slug,'pages':pages})
    return {'title':choose(lang,'完整作品档案','Complete project archive'),'pageCount':4+sum(1+len(r['pages']) for r in result)},result

def verify_plan(plan,cases):
    for row in plan:
        for pic in [{'src':cases[row['slug']]['cover']},*(im for p in row['pages'] for im in p['images'])]:
            if not (PUBLIC/pic['src'].lstrip('/')).is_file():raise FileNotFoundError(pic['src'])
        if any(not p['images'] or len(p['images'])>2 for p in row['pages']):raise ValueError('One or two mapped images required')

def build(variant='overview',plan_only=False,lang='zh'):
    OUT.mkdir(parents=True,exist_ok=True)
    config=load('web/src/data/publication.json');mapping=load('web/src/data/publication-pages.json');profile=load('web/src/data/profile.json')
    registry=load('.production-runtime/registry-v9.json');cases=read_cases(lang)
    edition,plan=get_plan(variant,config,mapping,cases,lang);verify_plan(plan,cases)
    count=4+sum(1+len(r['pages']) for r in plan)
    if count!=edition['pageCount'] or count>edition.get('maxPages',count):raise ValueError('Page budget mismatch')
    suffix='' if lang=='zh' else '-en';manifest_id=('selected' if variant=='overview' else variant)+suffix
    start=4;starts={}
    for row in plan:starts[row['slug']]=start;start+=1+len(row['pages'])
    (OUT/f'{variant}{suffix}-page-plan.json').write_text(json.dumps({'variant':variant,'lang':lang,'pageCount':count,'casePages':starts,'plan':plan},ensure_ascii=False,indent=2),encoding='utf-8')
    if plan_only:return
    stem={'overview':'sun-yingjie-selected-portfolio','full':'sun-yingjie-full-portfolio'}.get(variant,'sun-yingjie-portfolio-'+variant)+suffix
    output=OUT/(stem+'.pdf');e=Publication(output,lang,variant=='full');t=lambda zh,en:choose(lang,zh,en)
    url=profile['url'].rstrip('/')+('/en/' if lang=='en' else '/')
    e.c.setTitle(profile['name'][lang]+' | '+edition['title']);e.c.setAuthor(profile['name'][lang]);e.c.setSubject(profile['position'][lang]);e.c.setKeywords('Yingjie Sun, industrial design, product design, CMF, portfolio, v9, '+lang)
    e.c.setViewerPreference('DisplayDocTitle','true')
    e.start(edition['title']);e.c.bookmarkPage('cover')
    e.text(t('孙英杰','YINGJIE SUN'),48,494,t(38,31),font='CNB');e.para(profile['position'][lang],48,460,324,15,22)
    e.para(edition['title'],48,374,318,28,36,bold=True);e.para(profile['summary'][lang],48,235,318,11.5,18)
    e.image(cases[plan[0]['slug']]['cover'],412,276,500,255)
    e.image(cases[plan[1]['slug']]['cover'],412,69,242,190);e.image(cases[plan[2]['slug']]['cover'],670,69,242,190)
    e.text(f'{len(plan):02d} PROJECTS / {count:02d} PAGES / V9 / {lang.upper()}',48,58,9,MUTED,'Helvetica');e.end('cover')
    e.start(t('项目目录','Contents'));e.c.bookmarkPage('contents');e.c.addOutlineEntry(t('目录','Contents'),'contents',0)
    e.text(t('项目与阅读路径','Projects and reading paths'),48,499,29,font='CNB')
    e.para(t('点击项目进入案例。图板保留原始内容；职责、阶段与资料背景见各案例及在线档案。','Select a project to open its case. Original boards are preserved; English captions explain their context. Roles, stages and source notes accompany each case.'),48,464,864,11,17,MUTED)
    cols=4 if len(plan)>12 else 2;rows=math.ceil(len(plan)/cols);cell=864/cols;step=min(75,337/max(1,rows))
    for i,row in enumerate(plan):
        x=48+(i//rows)*cell;y=391-(i%rows)*step;d=cases[row['slug']]
        e.text(f'{starts[row["slug"]]:02d}',x,y,10,SAGE,'Helvetica-Bold')
        e.para(d['title'],x+30,y+10,cell-47,9.5 if cols==4 else 13,12 if cols==4 else 18,bold=True)
        e.c.linkRect(d['title'],row['slug'],(x,y-step+9,x+cell-12,y+18),thickness=0)
    e.end('contents')
    e.start(t('设计方法与职业背景','Approach and professional background'));e.text(t('从形态到系统','From form to system'),48,494,30,font='CNB')
    e.para(profile['summary'][lang],48,437,388,14,23)
    e.para(t('先理解使用者与限制，再比较形态、材料、视觉层级和操作。三维与原型让选择可以被讨论；AI 在有帮助时参与参考、变体和流程，人保留判断与核验。','Understand use and constraints, then compare form, materials, hierarchy and interaction. Models and prototypes make choices discussable. AI supports references, variations and workflows; people retain judgment and verification.'),48,285,388,12,20,MUTED)
    e.para('FORM / SYSTEM / INTELLIGENCE',48,111,388,11,18)
    timeline={i['id']:i for i in profile['timeline']};top=497
    for key in ['liling','hannstar','benwu','ouyin','education']:
        item=timeline[key];period=re.sub(r'（.*?）| \(record.*?\)','',item['period'][lang])
        e.text(period,491,top,9,MUTED);bottom=e.para(item['place'][lang],491,top-12,421,13,19,bold=True)
        bottom=e.para(item['role'][lang],491,bottom-4,421,10,15,MUTED);top=bottom-24
    e.end('profile')
    for index,row in enumerate(plan):
        slug=row['slug'];d=cases[slug];r=registry[slug];case_url=url.rstrip('/')+'/work/'+slug
        e.start(d['title']);e.c.bookmarkPage(slug);e.c.addOutlineEntry(d['title'],slug,0,False)
        e.text(f'{index+1:02d}',48,500,30,SAGE,'Helvetica')
        top=e.para(d['title'],48,457,288,22,29,bold=True);top=e.para(d['summary'],48,top-15,288,11,17)-15
        for label,value in [(t('本人职责','My role'),d['role']),(t('项目阶段','Stage'),d['status'])]:
            e.text(label,48,top,9,MUTED);top=e.para(value,48,top-12,288,10,15)-15
        e.para(r['publicBoundary'][lang],48,top,288,9,13)
        e.image(d['cover'],369,256,543,270)
        top=e.para(t('署名与背景','Credits and context')+f' / Level {r["evidenceLevel"]}',369,234,543,11,16,bold=True)-8
        top=e.para(d['credits'],369,top,543,9,13)-9
        top=e.para('AI / Human: '+r['aiRole'][lang],369,top,543,9,13)-5
        e.para(t('人工检查：','Human review: ')+'; '.join(r['humanGates'][lang]),369,top,543,9,13)
        e.text(t('在线完整案例','Read the complete case'),369,53,10,SAGE);e.c.linkURL(case_url,(363,42,913,72),thickness=0)
        e.end('project',slug)
        for spec in row['pages']:
            e.start(d['title']);total=len(spec['images']);width=(864-24*(total-1))/total
            e.para(spec['title'],48,521,864,23,30,bold=True)
            image_y=187 if spec.get('body') else 123;image_h=278 if spec.get('body') else 340
            for j,pic in enumerate(spec['images']):
                x=48+j*(width+24);e.image(pic['src'],x,image_y,width,image_h)
                caption=pic['caption']
                if '/boards/' in pic['src'] and not re.search('retrospective|回顾',caption,re.I):caption+=t(' · 回顾性重建',' · Retrospective reconstruction')
                e.para(caption,x,image_y-10,width,8.5,12,MUTED)
            if spec.get('body'):e.para(spec['body'],48,120,795,11,17)
            if slug=='ai-video-systems' and spec.get('body'):
                e.text(t('研究方法库','Research methods'),48,51,9,SAGE);e.c.linkURL(url.rstrip('/')+'/systems/ai-video-methods',(43,40,245,72),thickness=0)
            e.text(t('在线案例','Online case'),833,51,9,MUTED);e.c.linkURL(case_url,(816,40,918,72),thickness=0)
            e.end('evidence',slug);e.records[-1].update({'pageId':spec['id'],'title':spec['title'],'body':spec.get('body',''),'images':spec['images']})
    e.start(t('联系与完整作品','Contact and complete work'));e.text(t('孙英杰','YINGJIE SUN'),48,451,39,font='CNB');e.para(profile['position'][lang],48,390,700,24,34)
    e.text(profile['email'],48,277,27,INK,'Helvetica');e.c.linkURL('mailto:'+profile['email'],(43,263,682,306),thickness=0)
    e.text(profile['phone'],48,229,20,MUTED,'Helvetica')
    qr=QrCodeWidget(url);bounds=qr.getBounds();size=132
    code=Drawing(size,size,transform=[size/(bounds[2]-bounds[0]),0,0,size/(bounds[3]-bounds[1]),0,0]);code.add(qr);renderPDF.draw(code,e.c,766,210)
    e.para(t('扫码查看案例与交互作品','Scan for cases and interactive work'),723,187,190,10,15,MUTED)
    e.text(url,48,127,11,INK,'Helvetica');e.c.linkURL(url,(43,108,913,145),thickness=0)
    e.para(t('品牌视觉 / 实体产品 / 数字体验 / 职业档案截至 2026.09','Visual systems / physical products / digital experience / record as of September 2026'),48,78,830,10,16,MUTED)
    e.end('contact');e.c.save()
    if e.page!=count:raise ValueError('Generated page count mismatch')
    target=PUBLIC/'downloads'/output.name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(output,target)
    sources=['web/src/data/profile.json','web/src/data/publication.json','web/src/data/publication-pages.json','web/src/data/publication-locales.json','web/src/data/projectRegistry.ts','scripts/build_publications_v9.py','scripts/build_selected_portfolio.py','web/src/data/chapters.ts']+[f'web/src/content/works/{r["slug"]}.{lang}.md' for r in plan]
    manifest={'edition':'v9','variant':variant,'lang':lang,'pageCount':e.page,'caseCount':len(plan),'caseSlugs':[r['slug'] for r in plan],'pages':e.records,'media':list(e.media.values()),'document':output.relative_to(ROOT).as_posix(),'publicPath':'/downloads/'+target.name,'sha256':digest(output),'publicSha256':digest(target),'publicBytes':target.stat().st_size,'url':url,'sourceHashes':{p:digest(ROOT/p) for p in sources}}
    manifest['externalFontHashes']={str(Path(pdfmetrics.getFont(n).face.filename)):digest(Path(pdfmetrics.getFont(n).face.filename)) for n in ['CN','CNB','Body','BodyBold']}
    (OUT/(manifest_id+'-manifest.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/'qa').mkdir(exist_ok=True);(OUT/'qa'/(manifest_id+'-text-bounds.json')).write_text(json.dumps(e.bounds,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'variant':variant,'lang':lang,'pages':e.page,'cases':len(plan),'bytes':target.stat().st_size},ensure_ascii=False),flush=True)

def main():
    if hasattr(sys.stdout,'reconfigure'):sys.stdout.reconfigure(encoding='utf-8')
    p=argparse.ArgumentParser();p.add_argument('--variant',choices=['overview','brand','physical','digital','full'],default='overview');p.add_argument('--all',action='store_true');p.add_argument('--plan',action='store_true');p.add_argument('--lang',choices=['zh','en','both'],default='zh');args=p.parse_args()
    for lang in (['zh','en'] if args.lang=='both' else [args.lang]):
        for variant in (['overview','brand','physical','digital','full'] if args.all else [args.variant]):build(variant,args.plan,lang)
if __name__=='__main__':main()
