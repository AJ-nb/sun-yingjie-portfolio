"""Verify exported portfolio/CV integrity without regenerating or mutating sources."""
from pathlib import Path
import hashlib
import json
import re
import sys
from docx import Document
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run():
    profile = json.loads((ROOT/'web/src/data/profile.json').read_text(encoding='utf-8'))
    checks = []
    artifacts = []

    def check(name, condition):
        checks.append({'check': name, 'passed': bool(condition)})

    for edition, expected_pages, expected_cases in [('selected', 28, 8), ('full', None, 33)]:
        manifest = json.loads((ROOT/f'deliverables/portfolio/{edition}-manifest.json').read_text(encoding='utf-8'))
        pdf = ROOT/'web/public'/manifest['publicPath'].lstrip('/')
        reader = PdfReader(pdf)
        page_text = [p.extract_text() or '' for p in reader.pages]
        check(edition+' page count',len(reader.pages)==manifest['pageCount'] and (expected_pages is None or len(reader.pages)==expected_pages))
        check(edition+' case count',manifest['caseCount']==expected_cases)
        check(edition+' public hash',digest(pdf)==manifest['publicSha256'])
        check(edition+' below 20 MiB',pdf.stat().st_size<20*1024*1024)
        check(edition+' searchable Chinese',profile['name']['zh'] in page_text[0])
        check(edition+' every page has text',all(len(t.strip())>20 for t in page_text))
        check(edition+' no replacement glyphs',all('\ufffd' not in t for t in page_text))
        check(edition+' no leaked Markdown',all('<details>' not in t and '<summary>' not in t and '###' not in t for t in page_text))
        check(edition+' source snapshot matches',all(digest(ROOT/p)==value for p,value in manifest['sourceHashes'].items()))
        check(edition+' original media matches',all(digest(ROOT/'web/public'/m['publicPath'].lstrip('/'))==m['sha256'] for m in manifest['media']))
        links = sum(len(page.get('/Annots',[])) for page in reader.pages)
        check(edition+' clickable navigation',links>=expected_cases*2)
        compression=json.loads((ROOT/f'deliverables/portfolio/{edition}-compression.json').read_text(encoding='utf-8'))
        check(edition+' compression retains text and navigation',all(compression['checks'].values()))
        artifacts.append({'path':str(pdf.relative_to(ROOT)).replace('\\','/'),'pages':len(reader.pages),'cases':expected_cases,'links':links,'bytes':pdf.stat().st_size,'sha256':digest(pdf)})

    docx=ROOT/'deliverables/resume/sun-yingjie-resume.docx'
    pdf=ROOT/'deliverables/resume/sun-yingjie-resume.pdf'
    doc=Document(docx);doc_text='\n'.join(p.text for p in doc.paragraphs)
    reader=PdfReader(pdf);pdf_text='\n'.join(p.extract_text() or '' for p in reader.pages)
    check('resume is one page',len(reader.pages)==1)
    check('resume is A4',abs(float(reader.pages[0].mediabox.width)-595.28)<1 and abs(float(reader.pages[0].mediabox.height)-841.89)<1)
    check('resume editable paragraphs',len(doc.paragraphs)>20)
    check('resume semantic title',doc.paragraphs[0].style.name=='Title')
    check('resume shared name',profile['name']['zh'] in doc_text and profile['name']['zh'] in pdf_text)
    for key in ['phone','email']:
        check('resume shared '+key,profile[key] in doc_text and profile[key] in pdf_text)
    for item in profile['timeline']:
        if item['id']=='ai':
            continue
        check('resume canonical period '+item['id'],item['period']['zh'].replace('—','-') in doc_text)
    for ext in ['docx','pdf']:
        source=ROOT/f'deliverables/resume/sun-yingjie-resume.{ext}'
        public=ROOT/f'web/public/downloads/sun-yingjie-resume.{ext}'
        check('resume public '+ext+' matches',digest(source)==digest(public))
        artifacts.append({'path':str(public.relative_to(ROOT)).replace('\\','/'),'pages':1,'bytes':source.stat().st_size,'sha256':digest(source)})

    result={'passed':all(c['passed'] for c in checks),'checkCount':len(checks),'checks':checks,'artifacts':artifacts,'visualReview':'Recorded separately in docs/document-refinement-v3.md; text checks do not substitute for visual inspection.'}
    target=ROOT/'deliverables/document-verification.json'
    target.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'passed':result['passed'],'checks':len(checks),'report':str(target),'failures':[c['check'] for c in checks if not c['passed']]},ensure_ascii=False))
    if not result['passed']:
        raise SystemExit(1)


if __name__=='__main__':
    if hasattr(sys.stdout,'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    run()
