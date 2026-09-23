"""Record Word's actual outputs and their canonical source snapshot."""
import hashlib,json
from pathlib import Path
from datetime import datetime,timezone
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[2]
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
build=json.loads((ROOT/'deliverables/resume/resume-build.json').read_text(encoding='utf-8'))
for entry in build['variants']:
    docx=ROOT/entry['docx'];pdf=docx.with_suffix('.pdf')
    entry.update({'pdf':pdf.relative_to(ROOT).as_posix(),'pageCount':len(PdfReader(pdf).pages),'pdfSha256':digest(pdf),'pdfBytes':pdf.stat().st_size,'docxBytes':docx.stat().st_size})
    for source in ['scripts/resume/export_word.ps1','scripts/resume/finalize_resumes.py']:
        entry['sourceHashes'][source]=digest(ROOT/source)
    if entry['pageCount']!=1:raise ValueError(entry['id']+': must be one page')
build.update({'renderer':'Microsoft Word native fixed-format export','updatedAt':datetime.now(timezone.utc).isoformat()})
(ROOT/'deliverables/resume/resume-manifest.json').write_text(json.dumps(build,ensure_ascii=False,indent=2),encoding='utf-8')
print('Recorded eight bilingual one-page resume outputs')
