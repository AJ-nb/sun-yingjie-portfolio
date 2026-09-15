from extract_sources import *
import re
failures=[];images=[]
for p in sorted(PUBLIC.rglob('*')):
 if p.is_file() and p.suffix.lower() in ('.webp','.jpg','.png'):
  try:
   with Image.open(p) as im:
    im.load();images.append({'path':str(p.relative_to(ROOT)).replace('\\','/'),'dimensions':list(im.size),'mode':im.mode,'bytes':p.stat().st_size})
  except Exception as e:failures.append({'path':str(p),'error':str(e)})
refs=[]
for slug in ('plumber','huhu-care','rendering-studies','lingmu','jimu-studio'):
 for lang in ('zh','en'):
  p=ROOT/'web/src/content/works'/(slug+'.'+lang+'.md')
  for ref in re.findall(r'/works/refinement-v2/[^\s)"<>]+',p.read_text(encoding='utf-8')):
   exists=(ROOT/'web/public'/ref.lstrip('/')).is_file();refs.append({'case':p.name,'path':ref,'exists':exists})
   if not exists:failures.append({'case':p.name,'missing':ref})
workset=json.loads((PRIVATE/'model-extraction-manifest.json').read_text(encoding='utf-8'))
for ws in workset:
 for r in ws['files']:
  p=ROOT/r['extractedPath']
  if not p.exists() or p.stat().st_size!=r['bytes']:failures.append({'modelFile':r['extractedPath'],'problem':'missing or size mismatch'})
result={'imageCount':len(images),'totalPublicBytes':sum(r['bytes'] for r in images),'referenceCount':len(refs),'failures':failures,'images':images,'references':refs,'visualReview':['selected-model-media.jpg','pdf-published-contact-sheet.jpg','psd-selected-contact-sheet.jpg'],'verification':'Full decode of all published image files; all modified-case media links resolve; extracted model-workset bytes match archive listing.'}
save_json('validation.json',result)
print(json.dumps({k:result[k] for k in ('imageCount','totalPublicBytes','referenceCount','failures')}))
if failures:raise SystemExit(1)
