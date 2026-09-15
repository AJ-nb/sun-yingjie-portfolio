"""Render every web-PDF page and create original/web comparisons for visual review."""
from pathlib import Path
import hashlib,json,subprocess,sys,math
from PIL import Image,ImageDraw,ImageChops,ImageStat
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[2]
folder=ROOT/'private/sources/refinement-v2'
source=ROOT/'deliverables/portfolio/sun-yingjie-portfolio.pdf'
web=ROOT/'deliverables/portfolio/sun-yingjie-portfolio-web.pdf'
QA=ROOT/'deliverables/portfolio/qa/web-optimized'
pages=QA/'pages';sheets=QA/'sheets';comparisons=QA/'comparisons'
for p in (pages,sheets,comparisons):p.mkdir(parents=True,exist_ok=True)
compression=json.loads((folder/'portfolio-web-compression.json').read_text(encoding='utf-8'))
assert hashlib.sha256(source.read_bytes()).hexdigest()==compression['sourceSha256']
assert hashlib.sha256(web.read_bytes()).hexdigest()==compression['outputSha256']
assert web.stat().st_size<20*1024*1024
reader=PdfReader(web)
assert len(reader.pages)==116 and compression['outlineCount']==39 and compression['linkCount']==256
assert all(compression['checks'].values())
if '--no-render' not in sys.argv:
    poppler='C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
    run=subprocess.run([poppler,'-scale-to','1440','-png',str(web),str(pages/'page')],capture_output=True,timeout=600)
    (QA/'poppler-log.txt').write_bytes(run.stdout+run.stderr)
    if run.returncode:raise RuntimeError('Web PDF page rendering failed')
files=sorted(pages.glob('page-*.png'))
assert len(files)==116
rendered=[]
for i,p in enumerate(files,1):
    with Image.open(p) as im:
        im.load();assert im.size==(1440,900)
        rendered.append({'page':i,'file':str(p.relative_to(ROOT)).replace('\\','/'),'dimensions':list(im.size)})
for start in range(0,116,4):
    sheet=Image.new('RGB',(1920,1260),'#d9ddd6');draw=ImageDraw.Draw(sheet)
    for n,p in enumerate(files[start:start+4]):
        with Image.open(p) as im:
            im=im.convert('RGB');im.thumbnail((936,590),Image.Resampling.LANCZOS)
            x=n%2*960;y=n//2*630;sheet.paste(im,(x+(960-im.width)//2,y+8))
            draw.text((x+15,y+608),f'WEB PAGE {start+n+1:03d}',fill='black')
    sheet.save(sheets/f'sheet-{start//4+1:02d}.jpg',quality=94)
key_pages=[5,20,38,41,44,49,51,88,98,101,107,113]
metrics=[]
for n in key_pages:
    with Image.open(ROOT/f'deliverables/portfolio/qa/refinement-v2/pages/page-{n:03d}.png') as orig,Image.open(pages/f'page-{n:03d}.png') as small:
        orig=orig.convert('RGB');small=small.convert('RGB')
        rms=ImageStat.Stat(ImageChops.difference(orig,small)).rms
        mse=sum(x*x for x in rms)/3
        metrics.append({'page':n,'rgbRmse':round(math.sqrt(mse),4),'psnrDb':round(20*math.log10(255/math.sqrt(mse)),3) if mse else None})
        region=(70,110,1370,640)
        pair=Image.new('RGB',(1300,1116),'white');draw=ImageDraw.Draw(pair)
        draw.text((12,6),f'ORIGINAL PDF - PAGE {n:03d}',fill='black');pair.paste(orig.crop(region),(0,24))
        draw.text((12,566),f'WEB PDF - PAGE {n:03d}',fill='black');pair.paste(small.crop(region),(0,586))
        pair.save(comparisons/f'comparison-{n:03d}.png')
report={'pageCount':116,'webBytes':web.stat().st_size,'webMiB':web.stat().st_size/1048576,'webSha256':compression['outputSha256'],'sourceSha256':compression['sourceSha256'],'sourceUnchanged':True,'outlineCount':39,'linkCount':256,'preservationChecks':compression['checks'],'selectedCompression':compression['selected'],'renderedPages':rendered,'contactSheetCount':29,'comparisonPages':key_pages,'imageDifferenceMetrics':metrics,'metricInterpretation':'Pixel differences are expected from JPEG resampling; these values describe the compared pages and do not replace manual legibility checks. Live PDF text and vectors are unchanged.','visualReview':'Pending all-page contact-sheet inspection and original/web comparison checks'}
(folder/'portfolio-web-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':116,'contactSheets':29,'comparisonPages':key_pages,'mib':round(report['webMiB'],3),'preservationChecks':report['preservationChecks']}))
