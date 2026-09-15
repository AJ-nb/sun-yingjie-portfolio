from pathlib import Path
import hashlib, io, json, subprocess, sys
from PIL import Image, ImageDraw, ImageOps
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
PRIVATE = ROOT / 'private/sources/refinement-v2'
WORK = ROOT / '.production-runtime/model-worksets'
PUBLIC = ROOT / 'web/public/works/refinement-v2'
for folder in (PRIVATE, WORK, PUBLIC):
    folder.mkdir(parents=True, exist_ok=True)

def save_json(name, data):
    (PRIVATE / name).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

def contact_sheet(items, output, cols=5):
    cell_w, cell_h = 320, 240
    out = Image.new('RGB', (cell_w*cols, cell_h*((len(items)+cols-1)//cols)), '#e6e6e6')
    draw = ImageDraw.Draw(out)
    for n, (path, label) in enumerate(items):
        with Image.open(path) as im:
            im = im.convert('RGB')
            im.thumbnail((cell_w-16, cell_h-38))
            x, y = n%cols*cell_w, n//cols*cell_h
            out.paste(im, (x+(cell_w-im.width)//2, y+8+(cell_h-38-im.height)//2))
            draw.text((x+8,y+cell_h-25), label, fill='black')
    out.save(output)

def pdf_images():
    source = Path('D:/OneDrive/桌面/文件/作品集/静态渲染师 孙英杰作品集.pdf')
    reader = PdfReader(source)
    raw = WORK / 'pdf-embedded-originals'
    out = PUBLIC / 'rendering-pdf'
    raw.mkdir(exist_ok=True); out.mkdir(exist_ok=True)
    records=[]
    for page_num,page in enumerate(reader.pages,1):
        for n,img in enumerate(page.images,1):
            im = img.image
            seq=len(records)+1
            raw_path=raw/f'{seq:03d}-{img.name}'
            raw_path.write_bytes(img.data)
            rgb=im.convert('RGB')
            rgb.thumbnail((2560,2560),Image.Resampling.LANCZOS)
            web_path=out/f'{seq:03d}.webp'
            rgb.save(web_path,'WEBP',quality=91,method=6)
            records.append({'id':f'pdf-{seq:03d}','sourceFile':str(source),'sourcePage':page_num,'embeddedName':img.name,'indirectReference':str(img.indirect_reference),'originalDimensions':list(im.size),'sourceImageSha256':hashlib.sha256(img.data).hexdigest(),'rawPath':str(raw_path.relative_to(ROOT)).replace('\\','/'),'publicPath':'/'+str(web_path.relative_to(ROOT/'web/public')).replace('\\','/'),'webDimensions':list(rgb.size),'mediaType':'original-embedded-render','newRender':False,'aiGenerated':False,'classification':'pending-visual-review','authorship':'Visual rendering portfolio supplied by Sun Yingjie; product and third-party asset authorship requires per-image classification.'})
    save_json('pdf-embedded-index.json',{'source':str(source),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'pageCount':len(reader.pages),'imageCount':len(records),'images':records})
    contact_sheet([(ROOT/'web/public'/r['publicPath'].lstrip('/'),r['id']+' '+str(r['originalDimensions'])) for r in records],PRIVATE/'pdf-contact-sheet.jpg')
    print(json.dumps({'pages':len(reader.pages),'images':len(records),'contactSheet':str(PRIVATE/'pdf-contact-sheet.jpg')},ensure_ascii=False))

def archive_index():
    exe='D:/Program Files/PTC/Creo 6.0.3.0/Common Files/x86e_win64/cedirect/binx64/7za.exe'
    for stem in ('管道清淤机器人','儿童幽门螺杆菌检测仪'):
        archive=Path('D:/OneDrive/桌面/文件/作品集/完成模型')/(stem+'.zip')
        run=subprocess.run([exe,'l','-slt','-sccUTF-8',str(archive)],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        listing=run.stdout.decode('utf-8',errors='replace').replace('\r\n','\n')
        (PRIVATE/(('plumber' if '管道' in stem else 'huhu')+'-archive-listing.txt')).write_text(listing,encoding='utf-8')
        files=[]
        for block in listing.split('\n\n'):
            entry={}
            for line in block.splitlines():
                if ' = ' in line:
                    k,v=line.split(' = ',1);entry[k]=v
            if entry.get('Folder')=='-': files.append(entry)
        save_json(('plumber' if '管道' in stem else 'huhu')+'-archive-index.json',{'source':str(archive),'files':files})
        chosen=[r for r in files if ('\\C4D\\render\\' in r.get('Path','') and '备份' not in r['Path'] and '@' not in r['Path'])] if '管道' in stem else [r for r in files if ('\\C4D\\PRODUCT\\' in r.get('Path','') and '备份' not in r['Path'] and '@' not in r['Path']) or r.get('Path','').endswith(('03rhino5.obj','03rhino5.mtl'))]
        print(json.dumps({'archive':stem,'files':len(files),'selectedCount':len(chosen),'selectedBytes':sum(int(x['Size']) for x in chosen),'selected':[{k:r[k] for k in ('Path','Size')} for r in chosen]},ensure_ascii=False))

if __name__=='__main__':
    {'pdf':pdf_images,'index':archive_index}[sys.argv[1]]()
