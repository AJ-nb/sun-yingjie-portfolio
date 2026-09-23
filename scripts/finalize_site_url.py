"""Update an assigned Site URL without changing document artwork or editable text."""
from pathlib import Path
from zipfile import ZipFile
import argparse, datetime, hashlib, json, shutil, subprocess, sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject
from PIL import Image, ImageChops

ROOT=Path(__file__).resolve().parents[1]
sys.stdout.reconfigure(encoding='utf-8')
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--old',required=True)
p.add_argument('--new',required=True)
p.add_argument('--scratch',type=Path,required=True)
args=p.parse_args()
scratch=args.scratch.resolve()
if not scratch.is_relative_to((ROOT/'.sites-runtime').resolve()): raise SystemExit('Scratch must be inside .sites-runtime')
scratch.mkdir(parents=True,exist_ok=False)
poppler=Path('C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
reports=[]
pdfs=[('portfolio',ROOT/'deliverables/portfolio/sun-yingjie-portfolio.pdf',ROOT/'web/public/downloads/sun-yingjie-selected-portfolio.pdf',31),('resume',ROOT/'deliverables/resume/sun-yingjie-resume.pdf',ROOT/'web/public/downloads/sun-yingjie-resume.pdf',1)]
for kind,source,public,expected in pdfs:
    original=scratch/(kind+'-before.pdf'); updated=scratch/(kind+'-after.pdf')
    shutil.copyfile(source,original)
    reader=PdfReader(original); writer=PdfWriter(clone_from=reader); count=0
    for page in writer.pages:
        for ref in page.get('/Annots',[]):
            action=ref.get_object().get('/A')
            if action and '/URI' in action and args.old in str(action['/URI']):
                action[NameObject('/URI')]=TextStringObject(str(action['/URI']).replace(args.old,args.new)); count+=1
    assert count==expected,(kind,count,expected)
    writer.write(updated)
    after=PdfReader(updated)
    assert len(reader.pages)==len(after.pages)
    for before_page,after_page in zip(reader.pages,after.pages):
        assert before_page.get_contents().get_data()==after_page.get_contents().get_data()
        assert before_page.extract_text()==after_page.extract_text()
        assert len(before_page.get('/Annots',[]))==len(after_page.get('/Annots',[]))
    # Re-render every page. URI-only edits must preserve every pixel.
    for tag,pdf in [('before',original),('after',updated)]:
        subprocess.run([str(poppler),'-r','60','-png',str(pdf),str(scratch/(kind+'-'+tag))],check=True,capture_output=True)
    comparisons=[]
    for before_png in sorted(scratch.glob(kind+'-before-*.png')):
        after_png=before_png.with_name(before_png.name.replace('-before-','-after-'))
        with Image.open(before_png) as a,Image.open(after_png) as b:
            assert a.size==b.size and ImageChops.difference(a.convert('RGB'),b.convert('RGB')).getbbox() is None,before_png.name
        comparisons.append(before_png.name)
    assert len(comparisons)==len(reader.pages)
    shutil.copyfile(updated,source);shutil.copyfile(updated,public)
    reports.append({'path':str(source.relative_to(ROOT)),'pages':len(after.pages),'updatedLinks':count,'allPagePixelsUnchanged':True,'bytes':source.stat().st_size,'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})

docx=ROOT/'deliverables/resume/sun-yingjie-resume.docx'
before_docx=scratch/'resume-before.docx'; after_docx=scratch/'resume-after.docx'
shutil.copyfile(docx,before_docx)
with ZipFile(before_docx) as source,ZipFile(after_docx,'w') as target:
    changed=[]
    for info in source.infolist():
        payload=source.read(info.filename)
        if info.filename=='word/_rels/document.xml.rels':
            assert args.old.encode() in payload
            payload=payload.replace(args.old.encode(),args.new.encode());changed.append(info.filename)
        target.writestr(info,payload)
assert changed==['word/_rels/document.xml.rels']
with ZipFile(before_docx) as a,ZipFile(after_docx) as b:
    assert a.namelist()==b.namelist()
    assert all(a.read(name)==b.read(name) for name in a.namelist() if name not in changed)
shutil.copyfile(after_docx,docx)
reports.append({'path':str(docx.relative_to(ROOT)),'onlyChangedZipEntries':changed,'bytes':docx.stat().st_size,'sha256':hashlib.sha256(docx.read_bytes()).hexdigest()})

for relative in ['README.md','web/index.html','scripts/build_portfolio.py','deliverables/resume/resume-content.json']:
    file=ROOT/relative; text=file.read_text(encoding='utf-8');assert args.old in text,relative
    file.write_text(text.replace(args.old,args.new),encoding='utf-8',newline='\n')
manifest=ROOT/'private/sources/download-manifest.json'
data=json.loads(manifest.read_text(encoding='utf-8'))
data.update(bytes=reports[0]['bytes'],sha256=reports[0]['sha256'],siteUrl=args.new)
manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
report={'verifiedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'previousReservedUrl':args.old,'deployedUrl':args.new,'files':reports,'note':'Only link destinations changed. All 41 PDF pages were re-rendered at 60 dpi and are pixel-identical; all DOCX entries except the hyperlink relationship are byte-identical.'}
(ROOT/'docs/final-url-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
