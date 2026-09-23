"""Rasterize the actual resume PDF exports for QA and full-page website previews."""
import hashlib
import json
import os
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
RUNTIME = Path(os.environ.get('PORTFOLIO_RUNTIME', Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies'))
POPPLER = RUNTIME/'native/poppler/Library/bin/pdftoppm.exe'
QA = ROOT/'deliverables/resume/qa/v77'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def run():
    if not POPPLER.is_file():
        raise FileNotFoundError('Set PORTFOLIO_RUNTIME to the bundled runtime containing Poppler.')
    QA.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((ROOT/'deliverables/resume/resume-manifest.json').read_text(encoding='utf-8'))
    records=[]
    for entry in manifest['variants']:
        source=ROOT/entry['pdf']
        prefix=QA/entry['stem']
        subprocess.run([str(POPPLER), '-png', '-r', '150', '-singlefile', str(source), str(prefix)], check=True)
        png=prefix.with_suffix('.png')
        suffix='' if entry['id']=='overview' else '-'+entry['id']
        preview=ROOT/f'web/public/media/v7/resume-preview{suffix}.webp'
        with Image.open(png) as im:
            preview_size=(640, round(im.height*640/im.width))
            im.convert('RGB').resize(preview_size, Image.Resampling.LANCZOS).save(preview, 'WEBP', quality=92, method=6)
        records.append({'id':entry['id'],'pdf':entry['pdf'],'pdfSha256':digest(source),'qaPage':png.relative_to(ROOT).as_posix(),'qaSha256':digest(png),'preview':preview.relative_to(ROOT).as_posix(),'previewSha256':digest(preview),'previewSize':preview_size,'pages':1})
    (ROOT/'deliverables/resume/resume-previews-v77.json').write_text(json.dumps({'renderer':'Bundled Poppler 150 dpi from Microsoft Word native PDF export','previewWidth':640,'pages':records},ensure_ascii=False,indent=2),encoding='utf-8')
    print('Rendered four full-page resumes and four 640 px website previews')

if __name__=='__main__':
    run()
