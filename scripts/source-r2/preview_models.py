from extract_sources import *
records=[]
for slug in ('plumber','huhu'):
    model=WORK/slug
    imgs=[p for p in model.rglob('*') if p.suffix.lower() in ('.png','.jpg','.tif','.jpeg') and 'tex' not in p.parts]
    previews=WORK/(slug+'-previews'); previews.mkdir(exist_ok=True)
    rows=[]
    for i,p in enumerate(imgs,1):
        im=Image.open(p)
        out=previews/f'{i:03d}.jpg'
        rgb=im.convert('RGB'); rgb.thumbnail((1000,1000))
        rgb.save(out,quality=85)
        row={'id':slug+f'-{i:03d}','sourcePath':str(p.relative_to(ROOT)).replace('\\','/'),'previewPath':str(out.relative_to(ROOT)).replace('\\','/'),'originalDimensions':list(im.size),'originalMode':im.mode,'filename':p.name,'selection':'pending'}
        rows.append(row)
    save_json(slug+'-render-index.json',rows)
    contact_sheet([(ROOT/r['previewPath'],r['id']+' '+r['filename']) for r in rows],PRIVATE/(slug+'-contact-sheet.jpg'))
    print(slug,len(rows))
