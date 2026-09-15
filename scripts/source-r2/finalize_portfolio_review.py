"""Seal this edition's completed visual review; do not run before manual review."""
from pathlib import Path
import hashlib,json
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[2]
folder=ROOT/'private/sources/refinement-v2'
report=json.loads((folder/'portfolio-qa.json').read_text(encoding='utf-8'))
pdf=ROOT/'deliverables/portfolio/sun-yingjie-portfolio.pdf'
assert report['pdfSha256']==hashlib.sha256(pdf.read_bytes()).hexdigest()
continuity=json.loads((folder/'portfolio-review-continuity.json').read_text(encoding='utf-8'))
inherited={r['page'] for r in continuity if r['reviewedOriginalPage'] is not None}
updated={1,2,36,37,38,39,47,69,70,71,72,73,77,78,79,101}
independent=set(range(81,117))
assert inherited|updated|independent==set(range(1,117))
reader=PdfReader(pdf)
manifest=json.loads((ROOT/'private/sources/download-manifest.json').read_text(encoding='utf-8'))
projects=[r for r in manifest['pages'] if r['kind']=='project']
page_ids={p.indirect_reference.idnum:i for i,p in enumerate(reader.pages,1)}
toc=[]
for a in reader.pages[1]['/Annots']:
    dest=a.get_object().get('/Dest')
    if dest:toc.append(page_ids[dest[0].idnum])
assert toc==[r['page'] for r in projects]
report['indexTargetsVerified']={'links':len(toc),'allMatchCaseIntroductionPages':True}
report['visualReview']={
    'status':'passed','reviewedPages':list(range(1,117)),
    'method':'Every page visually reviewed in 4-page contact sheets. Previously reviewed unchanged content confirmed by pixel hashes excluding only footer; changed pages and complete final brand/digital section inspected again.',
    'initialReviewer':'r2_source_media, initial pages 1–76 and 105',
    'revisedPagesReviewed':sorted(updated),
    'independentReviewer':'r2_digital_brand, final pages 81–116, full-page checks 98, 101, 102 and 113',
    'fullPageChecks':[1,2,98,101,102,113],
    'fixedFindings':['Wide boards are placed separately from portrait images','PSD case covers show product visuals','Embedded WebP logos converted to PNG before SVG rasterization','Yantai screenshot split into three source-faithful readable sections','Xintiao demo amounts and observed dark-theme limitation retained','Image experiment usability count and P2/S3/texture-drift findings retained'],
    'remainingFindings':[]}
refinement_path=folder/'portfolio-final-refinement-check.json'
if refinement_path.exists():
    refinement=json.loads(refinement_path.read_text(encoding='utf-8'))
    assert refinement['sha256']==report['pdfSha256']
    refinement['visualReview']='Passed full-page inspection of final pages 1 and 101; other 114 rendered pages are byte-identical PNGs to the previously approved edition.'
    refinement_path.write_text(json.dumps(refinement,ensure_ascii=False,indent=2),encoding='utf-8')
    report['finalRefinement']=refinement
(folder/'portfolio-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':116,'visuallyReviewed':116,'indexTargets':len(toc),'sha256':report['pdfSha256'],'failures':report['failures']}))
