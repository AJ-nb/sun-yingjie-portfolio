from pathlib import Path
import json,hashlib,subprocess
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[2]
folder=ROOT/'private/sources/refinement-v2'
pdf=ROOT/'deliverables/portfolio/sun-yingjie-portfolio.pdf'
baseline=json.loads((folder/'portfolio-final-refinement-baseline.json').read_text(encoding='utf-8'))
reader=PdfReader(pdf)
assert len(reader.pages)==116
stream_changes=[i for i,p in enumerate(reader.pages,1) if hashlib.sha256(p.get_contents().get_data()).hexdigest()!=baseline['pages'][i-1]['contentSha256']]
pages=ROOT/'deliverables/portfolio/qa/refinement-v2/pages'
pixel_baseline={i:hashlib.sha256((pages/f'page-{i:03d}.png').read_bytes()).hexdigest() for i in range(1,117)}
poppler='C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
subprocess.run([poppler,'-scale-to','1440','-png',str(pdf),str(pages/'page')],check=True,capture_output=True)
changed=[i for i in range(1,117) if hashlib.sha256((pages/f'page-{i:03d}.png').read_bytes()).hexdigest()!=pixel_baseline[i]]
assert changed==[1,101],changed
(folder/'portfolio-final-refinement-check.json').write_text(json.dumps({'priorSha256':baseline['sha256'],'sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pageCount':116,'encodedStreamsChanged':stream_changes,'visuallyChangedPages':changed,'pixelIdenticalPageCount':114,'renderedPages':116,'visualReview':'Pending full-page inspection of updated pages 1 and 101'},indent=2),encoding='utf-8')
print(json.dumps({'changed':changed,'otherPagesPixelIdentical':114}))
