"""Create a size-bounded web PDF by replacing only embedded raster images.

Usage: python scripts/compress_portfolio_pdf.py --input INPUT.pdf --output OUTPUT.pdf
The source stays unchanged. Text, vectors, page content, links and outlines are cloned.
"""
from pathlib import Path
from datetime import datetime,timezone
import argparse,hashlib,json,tempfile,sys
from pypdf import PdfReader,PdfWriter
from PIL import Image

def digest(path):
    with Path(path).open('rb') as stream:return hashlib.file_digest(stream,'sha256').hexdigest()

def structure(reader):
    ids={p.indirect_reference.idnum:i for i,p in enumerate(reader.pages,1)}
    def destination(dest):
        if isinstance(dest,(list,tuple)):
            first=dest[0]
            page=ids.get(first.idnum) if hasattr(first,'idnum') else str(first)
            return [page]+[str(v) for v in dest[1:]]
        return str(dest)
    outlines=[]
    def walk(items,level=0):
        for item in items:
            if isinstance(item,list):walk(item,level+1)
            else:outlines.append({'title':item.title,'page':reader.get_destination_page_number(item)+1,'level':level})
    walk(reader.outline)
    links=[]
    for i,page in enumerate(reader.pages,1):
        for ref in page.get('/Annots',[]):
            a=ref.get_object();act=a.get('/A',{})
            links.append({'page':i,'subtype':str(a.get('/Subtype')),'rect':[float(x) for x in a.get('/Rect',[])],'kind':str(act.get('/S','internal')),'uri':str(act.get('/URI','')),'destination':destination(a.get('/Dest',act.get('/D')))})
    return {'pageCount':len(reader.pages),'pageSizes':[[float(p.mediabox.width),float(p.mediabox.height)] for p in reader.pages],'pageText':[p.extract_text() for p in reader.pages],'pageContentHashes':[hashlib.sha256(p.get_contents().get_data()).hexdigest() for p in reader.pages],'outlines':outlines,'links':links}

def compress(args):
    source=Path(args.input).resolve();target=Path(args.output).resolve()
    if source==target:raise ValueError('Input and output must differ; the original is preserved')
    target.parent.mkdir(parents=True,exist_ok=True)
    initial_hash=digest(source)
    baseline=structure(PdfReader(source))
    byte_limit=int(args.max_mib*1024*1024)
    attempts=[]
    candidates=[(args.max_edge,args.quality),(min(args.max_edge,1800),min(args.quality,82)),(min(args.max_edge,1600),min(args.quality,80))]
    accepted=None
    for max_edge,quality in dict.fromkeys(candidates):
        writer=PdfWriter(clone_from=source)
        seen=set();rows=[]
        for page_number,page in enumerate(writer.pages,1):
            for image in page.images:
                ref=image.indirect_reference
                if ref is None:raise ValueError('Inline raster encountered; no safe replacement policy configured')
                if ref.idnum in seen:continue
                seen.add(ref.idnum)
                im=image.image
                if im.mode not in ('RGB','L'):raise ValueError(f'Unsupported image mode {im.mode}; alpha/color policy needs review')
                before_size=list(im.size);before_bytes=len(image.data)
                im=im.copy();im.thumbnail((max_edge,max_edge),Image.Resampling.LANCZOS)
                image.replace(im,quality=quality,subsampling=0,optimize=True)
                rows.append({'objectId':ref.idnum,'firstPage':page_number,'sourceDimensions':before_size,'webDimensions':list(im.size),'sourceEncodedBytes':before_bytes,'webEncodedBytes':len(image.data)})
        with tempfile.NamedTemporaryFile(prefix='portfolio-web-',suffix='.pdf',dir=target.parent,delete=False) as stream:
            temp=Path(stream.name);writer.write(stream)
        size=temp.stat().st_size
        attempt={'maxImageEdge':max_edge,'jpegQuality':quality,'subsampling':'4:4:4','optimizeHuffman':True,'imageCount':len(rows),'bytes':size,'underLimit':size<byte_limit}
        attempts.append(attempt);print(json.dumps(attempt),flush=True)
        if size<byte_limit:
            check=structure(PdfReader(temp))
            checks={k:check[k]==baseline[k] for k in baseline}
            if not all(checks.values()):
                temp.unlink();raise ValueError('Preservation failed: '+str([k for k,v in checks.items() if not v]))
            if digest(source)!=initial_hash:
                temp.unlink();raise ValueError('Original source hash changed')
            temp.replace(target)
            accepted={'checks':checks,'images':rows,'selected':attempt};break
        temp.unlink()
    if accepted is None:raise ValueError('No conservative candidate meets the strict size limit; original/output preserved')
    report={'createdAt':datetime.now(timezone.utc).isoformat(),'input':str(source),'output':str(target),'sourceSha256':initial_hash,'sourceBytes':source.stat().st_size,'outputSha256':digest(target),'outputBytes':target.stat().st_size,'maxBytesExclusive':byte_limit,'sourceUnchanged':True,'pageCount':baseline['pageCount'],'outlineCount':len(baseline['outlines']),'linkCount':len(baseline['links']),'attempts':attempts,**accepted,'method':'pypdf document clone; Pillow JPEG 4:4:4 resampling of raster XObjects only. Page content streams, extracted text, page geometry, outline destinations and link actions/rectangles remain identical. No page rasterization.'}
    report_path=Path(args.report).resolve() if args.report else target.with_suffix('.compression.json')
    report_path.parent.mkdir(parents=True,exist_ok=True);report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'output':str(target),'bytes':report['outputBytes'],'mib':round(report['outputBytes']/1048576,3),'sha256':report['outputSha256'],'pages':report['pageCount'],'outlines':report['outlineCount'],'links':report['linkCount'],'report':str(report_path)},ensure_ascii=False),flush=True)

if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input',required=True);parser.add_argument('--output',required=True)
    parser.add_argument('--report');parser.add_argument('--max-mib',type=float,default=20)
    parser.add_argument('--max-edge',type=int,default=1800);parser.add_argument('--quality',type=int,default=80)
    options=parser.parse_args()
    if options.max_mib<=0 or options.max_edge<600 or not 40<=options.quality<=95:parser.error('Invalid size or quality bounds')
    compress(options)
