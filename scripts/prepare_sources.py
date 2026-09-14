"""Archive user-owned source material and produce traceable web derivatives."""
from pathlib import Path
import concurrent.futures
import hashlib
import json
import re
import shutil
import sys
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from PIL import Image, ImageOps, ImageDraw, ImageFont
import pypdf
import pypdfium2 as pdfium

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parents[1]
INPUT = Path('D:/OneDrive/桌面/文件/作品集')
PRIVATE = ROOT / 'private/sources'
PUBLIC = ROOT / 'web/public/works'
BASE = 'https://69aeabebed37723301011cec--shiny-sunshine-72b10e.netlify.app/'

def digest(path):
    sha = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b''):
            sha.update(chunk)
    return sha.hexdigest()

def save_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')

def rel(path):
    return path.relative_to(ROOT).as_posix()

def image_derivative(source, dest, max_size=(2000,6000)):
    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        original_size = image.size
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        image.save(dest, 'WEBP', quality=88, method=6)
        return {'sourceDimensions': original_size, 'displayDimensions': image.size}

def source_record(source, archived):
    return {'source': str(source), 'archive': rel(archived), 'bytes': archived.stat().st_size,
            'sha256': digest(archived)}

def archive_file(source, archived):
    archived.parent.mkdir(parents=True, exist_ok=True)
    if not archived.exists():
        shutil.copy2(source, archived)
    return source_record(source, archived)

def download(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        request = urllib.request.Request(url, headers={'User-Agent':'SunYingjie-Portfolio-Archive/1.0'})
        with urllib.request.urlopen(request, timeout=120) as response, dest.with_suffix(dest.suffix+'.part').open('wb') as output:
            shutil.copyfileobj(response, output, 1024*1024)
        dest.with_suffix(dest.suffix+'.part').replace(dest)
    return dest

def archive_legacy():
    legacy = PRIVATE / 'legacy'
    for name in ['index.html','app.js','styles.css']:
        download(BASE + ('' if name=='index.html' else name), legacy/name)
    source = (legacy/'app.js').read_text(encoding='utf-8')
    data = source.split('const I18N')[0]
    paths = sorted(set(re.findall(r'''["']([^"']+\.(?:png|jpg|jpeg|webp|mp4|pdf))["']''', data)))
    groups = {'爱马仕':'hermes','设计上海与米兰设计周':'lighting','始祖鸟':'arcteryx','渲染作品':'rendering','孙英杰个人作品集':'portfolio','证件照.png':'portrait'}
    records=[]
    def item(path):
        url=BASE+urllib.parse.quote(path, safe='/')
        dest=download(url, legacy/'assets'/path)
        record={'sourceUrl':url,'sourcePath':path,**source_record(url,dest),'category':groups[path.split('/')[0]]}
        if dest.suffix.lower()!='.pdf' and record['category']!='portrait':
            out=PUBLIC/'legacy'/record['category']/(dest.stem+'.webp')
            record.update(image_derivative(dest,out))
            record['publicPath']='/works/'+out.relative_to(PUBLIC).as_posix()
        return record
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for record in pool.map(item,paths):
            records.append(record)
            print('Archived legacy:',record['sourcePath'],flush=True)
    save_json(PRIVATE/'legacy-manifest.json',records)
    return records

def process_pdf(source, slug, archived=None):
    archived=archived or PRIVATE/'documents'/(slug+'.pdf')
    record=archive_file(source,archived) if source!=archived else source_record(source,source)
    reader=pypdf.PdfReader(archived)
    pdf=pdfium.PdfDocument(archived)
    pages=[]
    for idx in range(len(pdf)):
        page=pdf[idx]
        dest=PUBLIC/'documents'/slug/f'{idx+1:03}.webp'
        dest.parent.mkdir(parents=True,exist_ok=True)
        if not dest.exists():
            w,h=page.get_size()
            bitmap=page.render(scale=min(1700/w,6000/h))
            image=bitmap.to_pil().convert('RGB')
            image.save(dest,'WEBP',quality=87,method=5)
            bitmap.close()
        text=reader.pages[idx].extract_text() or ''
        pages.append({'page':idx+1,'image':'/works/'+dest.relative_to(PUBLIC).as_posix(),'text':text})
        page.close()
    pdf.close()
    record.update({'id':slug,'pageCount':len(pages),'pages':pages})
    save_json(PRIVATE/'documents'/(slug+'.json'),record)
    print('Rendered PDF:',slug,len(pages),flush=True)
    return record

def process_local():
    docs=[]
    for name,slug in [('孙英杰个人作品集.pdf','portfolio-51'),('静态渲染师 孙英杰作品集.pdf','rendering-sheet'),('孙英杰简历.pdf','resume-source'),('项目.pdf','office-fitness')]:
        docs.append(process_pdf(INPUT/name,slug))
    assets=[]
    files=list((INPUT/'作品集展板').glob('*'))+list(INPUT.glob('*.png'))+list(INPUT.glob('*.jpg'))+list(INPUT.glob('*.mp4'))
    for idx,source in enumerate(files):
        archived=PRIVATE/'local-media'/source.parent.name/source.name
        record=archive_file(source,archived)
        record['id']=f'local-{idx+1:02}'
        if source.name.startswith('照片'):
            record['disposition']='portrait-reference-private'
        elif source.suffix.lower()=='.mp4':
            out=PUBLIC/'local'/source.name
            out.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(source,out)
            record['publicPath']='/works/'+out.relative_to(PUBLIC).as_posix()
        else:
            out=PUBLIC/'local'/(record['id']+'.webp')
            record.update(image_derivative(source,out))
            record['publicPath']='/works/'+out.relative_to(PUBLIC).as_posix()
        assets.append(record)
    presentations=[]
    for index,source in enumerate(INPUT.glob('*.pptx')):
        archived=PRIVATE/'presentations'/source.name
        record=archive_file(source,archived)
        slides=[]
        with zipfile.ZipFile(archived) as package:
            for name in sorted(n for n in package.namelist() if re.match(r'ppt/slides/slide\d+\.xml$',n)):
                tree=ET.fromstring(package.read(name))
                slides.append({'name':name,'text':'\n'.join(t.text for t in tree.iter() if t.tag.endswith('}t') and t.text)})
            for name in package.namelist():
                if name.startswith('ppt/media/') and Path(name).suffix.lower() in ['.png','.jpg','.jpeg']:
                    target=PRIVATE/'presentations'/f'media-{index+1}'/Path(name).name
                    target.parent.mkdir(parents=True,exist_ok=True)
                    target.write_bytes(package.read(name))
        record['slides']=slides
        presentations.append(record)
    save_json(PRIVATE/'local-media-manifest.json',assets)
    save_json(PRIVATE/'presentations-manifest.json',presentations)
    save_json(PRIVATE/'documents-manifest.json',[{k:v for k,v in d.items() if k!='pages'} for d in docs])

def engineering_inventory():
    records=[]
    for source in (INPUT/'完成模型').iterdir():
        if source.is_file():
            record={'source':str(source),'bytes':source.stat().st_size,'sha256':digest(source),'disposition':'original-remains-local'}
            records.append(record)
            print('Hashed original:',source.name,flush=True)
    save_json(PRIVATE/'engineering-originals.json',records)

if __name__=='__main__':
    mode=sys.argv[1] if len(sys.argv)>1 else 'all'
    if mode in ['legacy','all']:
        legacy=archive_legacy()
        for item in legacy:
            if item['sourcePath'].endswith('.pdf'):
                path=ROOT/item['archive']
                process_pdf(path,'legacy-full-portfolio',path)
    if mode in ['local','all']:process_local()
    if mode in ['engineering','all']:engineering_inventory()
