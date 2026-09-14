from pathlib import Path
import hashlib
import json
import re
from PIL import Image, ImageChops, ImageStat

ROOT=Path(__file__).resolve().parents[3]
public=ROOT/'web/public'
cases=json.loads((ROOT/'private/sources/pdf-cases.json').read_text(encoding='utf-8'))
errors=[]
md_records=[]
for case in cases:
    for lang in ['zh','en']:
        file=ROOT/'web/src/content/works'/f'{case["id"]}.{lang}.md'
        text=file.read_text(encoding='utf-8')
        parts=text.split('---',2)
        assert len(parts)==3,(file,'frontmatter fences')
        fm={}
        for line in parts[1].strip().splitlines():
            key,value=line.split(':',1)
            fm[key]=json.loads(value.strip())
        assert set(fm)=={'title','category','summary','role','credits','status','cover','tags'},file
        assert fm['category'] in ['product','digital','experiments'],file
        assert all(isinstance(v,str) for k,v in fm.items() if k!='tags'),file
        assert isinstance(fm['tags'],list) and all(isinstance(t,str) for t in fm['tags']),file
        assert len(re.findall(r'^## ',parts[2],re.M))==6,file
        refs=re.findall(r'!\[[^\]]*\]\(([^)]+)\)',parts[2])
        videos=re.findall(r'<video[^>]*src="([^"]+)"',parts[2])
        assert len(refs)==len(set(refs)),(file,'body duplicate')
        assert set(refs)==set(case['galleries']),(file,'gallery parity')
        assert set(videos)=={v['path'] for v in case.get('videos',[])},(file,'video parity')
        for path in [fm['cover']]+refs+videos:
            target=public/path.lstrip('/')
            if not target.is_file(): errors.append(f'{file.name}: missing {path}')
        for token in ['private/','D:\\','D:/','evidenceLimits','SHA256','恢复一张','从PDF中恢复','21090303','21090315']:
            assert token not in text,(file,token)
        md_records.append({'file':file.relative_to(ROOT).as_posix(),'category':fm['category'],'images':len(refs),'videos':len(videos),'credits':fm['credits']})
    czh=(ROOT/'web/src/content/works'/f'{case["id"]}.zh.md').read_text(encoding='utf-8')
    cen=(ROOT/'web/src/content/works'/f'{case["id"]}.en.md').read_text(encoding='utf-8')
    for credit in ['邓志成','张成承','陶裕仿','孙英杰']:
        assert (credit in czh)==(credit in cen),(case['id'],'credit mismatch',credit)

dedup=[]
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
oldjson=json.loads((ROOT/'private/sources/documents/legacy-full-portfolio.json').read_text(encoding='utf-8-sig'))
mainjson=json.loads((ROOT/'private/sources/documents/portfolio-51.json').read_text(encoding='utf-8-sig'))
officejson=json.loads((ROOT/'private/sources/documents/office-fitness.json').read_text(encoding='utf-8-sig'))
for oldnum in range(1,64):
    slug='portfolio-51' if oldnum<=51 else 'office-fitness'
    number=oldnum if oldnum<=51 else oldnum-51
    current=public/f'works/documents/{slug}/{number:03d}.webp'
    old=public/f'works/documents/legacy-full-portfolio/{oldnum:03d}.webp'
    ca,oa=Image.open(current).convert('RGB'),Image.open(old).convert('RGB')
    dimensions_match=ca.size==oa.size
    diff=ImageChops.difference(ca,oa) if dimensions_match else None
    samepixels=dimensions_match and diff.getbbox() is None
    currentpage=(mainjson if oldnum<=51 else officejson)['pages'][number-1]
    text_match=currentpage['text']==oldjson['pages'][oldnum-1]['text']
    dedup.append({'oldPage':oldnum,'canonical':f'{slug}/{number:03d}.webp','bytesIdentical':sha(current)==sha(old),'pixelsIdentical':samepixels,'textIdentical':text_match,'meanAbsoluteRgbDifference':ImageStat.Stat(diff).mean if diff is not None else None})
assert sum(x['pixelsIdentical'] for x in dedup)==57,'dedup changed'
assert sum(x['bytesIdentical'] for x in dedup)==57,'byte dedup changed'
assert all(x['textIdentical'] for x in dedup),'text dedup changed'
assert [x['oldPage'] for x in dedup if not x['pixelsIdentical']]==[10,13,17,22,23,30]

embedded=[]
mapping={1:('baobab-glow','local-02'),2:('bat-quad','local-01'),3:('cloudwing','local-06'),4:('little-orange','local-07'),5:('water-guardian','local-08'),6:('yuju','local-04'),7:('ecological-harvest',None),8:('purewater-rolling-filter',None),9:('polar-wing',None)}
for n,(case_id,local) in mapping.items():
    original=ROOT/f'private/sources/embedded-boards/X{n}.jp2'
    display=public/f'works/documents/embedded-boards/x{n}.webp'
    with Image.open(original) as im: dimensions=im.size
    with Image.open(display) as im: display_dimensions=im.size
    assert max(display_dimensions)==3600,display
    entry={'object':f'X{n}','case':case_id,'local':local,'originalDimensions':dimensions,'displayDimensions':display_dimensions,'sha256':sha(original),'publicPath':f'/works/documents/embedded-boards/x{n}.webp'}
    if local:
        with Image.open(display) as a,Image.open(public/f'works/local/{local}.webp') as b:
            ar=a.convert('RGB').resize((800,1000),Image.Resampling.LANCZOS)
            br=b.convert('RGB').resize((800,1000),Image.Resampling.LANCZOS)
            entry['normalizedMeanAbsoluteRgbDifference']=ImageStat.Stat(ImageChops.difference(ar,br)).mean
    embedded.append(entry)
assert len(list((ROOT/'private/sources/embedded-boards').glob('X*.jp2')))==9
assert len(list((public/'works/documents/embedded-boards').glob('x*.webp')))==9
assert not errors,errors
report={'cases':18,'markdownFiles':len(md_records),'uniqueGalleryImages':len({p for c in cases for p in c['galleries']}),'videoCount':sum(len(c.get('videos',[])) for c in cases),'files':md_records,'portfolioComparison':dedup,'embeddedBoards':embedded,'errors':errors}
(ROOT/'private/sources/embedded-boards/validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:report[k] for k in ['cases','markdownFiles','uniqueGalleryImages','videoCount','errors']},ensure_ascii=False))
print(json.dumps({'exactBytesAndPixels':57,'matchingExtractedTexts':63,'variantPages':[10,13,17,22,23,30],'embeddedBoards':len(embedded)},ensure_ascii=False))
