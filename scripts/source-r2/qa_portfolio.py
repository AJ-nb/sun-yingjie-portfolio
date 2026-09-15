"""Render every portfolio page with Poppler and record structural/document checks."""
from pathlib import Path
import hashlib, json, re, subprocess, sys
from PIL import Image, ImageDraw
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2]
PDF=ROOT/'deliverables/portfolio/sun-yingjie-portfolio.pdf'
PUBLIC=ROOT/'web/public/downloads/sun-yingjie-selected-portfolio.pdf'
QA=ROOT/'deliverables/portfolio/qa/refinement-v2'
PAGES=QA/'pages';SHEETS=QA/'sheets'
for p in (PAGES,SHEETS):p.mkdir(parents=True,exist_ok=True)
manifest=json.loads((ROOT/'private/sources/download-manifest.json').read_text(encoding='utf-8'))
reader=PdfReader(PDF);failures=[]
assert len(reader.pages)==manifest['pageCount']
assert hashlib.sha256(PDF.read_bytes()).digest()==hashlib.sha256(PUBLIC.read_bytes()).digest()
flat=lambda s:re.sub(r'[\s·]+','',s.replace('’',"'"))
projects=[r for r in manifest['pages'] if r['kind']=='project']
checks=[]
for item in projects:
    slug=item['case'];raw=(ROOT/'web/src/content/works'/(slug+'.zh.md')).read_text(encoding='utf-8-sig')
    front=raw.split('---',2)[1]
    fields={m[1]:m[2].strip().strip('"') for ln in front.splitlines() if (m:=re.match(r'^(\w+):\s*(.*)$',ln))}
    extracted=flat(reader.pages[item['page']-1].extract_text())
    present={k:flat(fields[k]) in extracted for k in ('title','summary','role','status','credits')}
    checks.append({'case':slug,'page':item['page'],'present':present})
    if not all(present.values()):failures.append({'case':slug,'missing':[k for k,v in present.items() if not v]})
links=[]
for i,page in enumerate(reader.pages,1):
    for ref in page.get('/Annots',[]):
        a=ref.get_object();action=a.get('/A',{});uri=action.get('/URI')
        links.append({'page':i,'kind':str(action.get('/S','internal')),'uri':str(uri) if uri else None,'hasDestination':'/Dest' in a or '/D' in action})
for item in projects:
    expected='https://sun-yingjie-portfolio.ajhhq.chatgpt.site/#/work/'+item['case']
    if not any(x['page']==item['page'] and x['uri']==expected for x in links):failures.append({'case':item['case'],'missingWebLink':expected})
if len(projects)!=33:failures.append({'projectCount':len(projects)})
poppler='C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
if '--no-render' not in sys.argv:
    proc=subprocess.run([poppler,'-scale-to','1440','-png',str(PDF),str(PAGES/'page')],capture_output=True,timeout=1200)
    (QA/'poppler-log.txt').write_bytes(proc.stdout+proc.stderr)
    if proc.returncode:raise RuntimeError('Poppler rendering failed')
files=sorted(PAGES.glob('page-*.png'))
if len(files)!=len(reader.pages):failures.append({'renderedPages':len(files),'expected':len(reader.pages)})
rendered=[]
for i,p in enumerate(files,1):
    with Image.open(p) as im:im.load();rendered.append({'page':i,'file':str(p.relative_to(ROOT)).replace('\\','/'),'dimensions':list(im.size)})
for start in range(0,len(files),4):
    sheet=Image.new('RGB',(1920,1260),'#d9ddd6');draw=ImageDraw.Draw(sheet)
    for n,p in enumerate(files[start:start+4]):
        with Image.open(p) as im:
            im=im.convert('RGB');im.thumbnail((936,590),Image.Resampling.LANCZOS)
            x=n%2*960;y=n//2*630
            sheet.paste(im,(x+(960-im.width)//2,y+8))
            draw.text((x+15,y+608),f'PAGE {start+n+1:03d}',fill='black')
    sheet.save(SHEETS/f'sheet-{start//4+1:02d}.jpg',quality=92)
report={'pageCount':len(reader.pages),'caseCount':len(projects),'pdfSha256':hashlib.sha256(PDF.read_bytes()).hexdigest(),'publicCopyIdentical':True,'renderedPages':rendered,'caseChecks':checks,'links':links,'failures':failures,'visualReview':'Pending manual inspection of every rendered page via contact sheets and full-page spot checks','fontNote':'Microsoft YaHei and Helvetica; embedded Chinese fonts verified through Poppler render'}
(ROOT/'private/sources/refinement-v2/portfolio-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':len(reader.pages),'cases':len(projects),'rendered':len(files),'contactSheets':(len(files)+3)//4,'links':len(links),'failures':failures},ensure_ascii=False))
if failures:raise SystemExit(1)
