"""Synchronize v7 publication sources, attribution and supporting diagrams."""
from pathlib import Path
import json,re,hashlib,shutil
ROOT=Path(__file__).resolve().parents[1]
def load(path):return json.loads(path.read_text(encoding='utf-8-sig'))
def save(path,value):path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for slug in ['biyuan','periastra','yelisi']:
 for lang in ['zh','en']:
  p=ROOT/f'web/src/content/works/{slug}.{lang}.md';s=p.read_text(encoding='utf-8')
  src=f'/media/v7/brand/{slug}-logic.webp'
  if src not in s:
   heading='## 设计过程' if lang=='zh' else '## Design process'
   if heading not in s:
    headings=re.findall(r'^## .+$',s,re.M);heading=headings[3]
   alt='从方向判断到系统应用的设计解析' if lang=='zh' else 'Design decisions and system applications (Chinese diagram)'
   s=s.replace(heading,heading+f'\n\n![{alt}]({src})',1);p.write_text(s,encoding='utf-8')
p=ROOT/'deliverables/brand-v7/asset-manifest.json';manifest=load(p)
for asset in manifest['assets']:
 asset['review']='excluded from publication: replaced the original product / scene geometry; superseded by the user requirement'
 asset['status']='excluded';asset.pop('webPath',None)
save(p,manifest)
p=ROOT/'web/package-lock.json';data=load(p);data['version']='0.7.0';data['packages']['']['version']='0.7.0';save(p,data)
p=ROOT/'web/public/licenses/inventory.json';inventory=load(p)
pkg=load(ROOT/'web/node_modules/svgo/package.json')
source=ROOT/'web/node_modules/svgo/LICENSE';target=ROOT/'web/public/licenses/packages'/('svgo-'+pkg['version'])/'LICENSE'
target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,target)
entry={'name':'svgo','version':pkg['version'],'license_metadata':pkg['license'],'kind':'build-time SVG optimizer','installed_locations':['node_modules/svgo'],'repository':pkg['repository'],'files':[{'path':target.relative_to(ROOT/'web/public/licenses').as_posix(),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'source':'node_modules/svgo/LICENSE','origin':'exact installed package file'}]}
inventory['packages']=[p for p in inventory['packages'] if p['name']!='svgo']+[entry];save(p,inventory)
p=ROOT/'web/public/THIRD_PARTY_NOTICES.md';s=p.read_text(encoding='utf-8')
if '## v7 design production' not in s:s+='\n\n## v7 design production\n\nSVGO (MIT) optimizes authored SVG analysis boards at build time. Sharp (Apache-2.0) renders the boards. FFmpeg is used as an external production tool for original-image editorial films; its binary is not distributed. Original brand marks and project images retain their owners and project credits. No third-party demonstration film is included in the v7 release.\n'
p.write_text(s,encoding='utf-8')
print('Synchronized diagrams, source boundaries, release metadata and SVGO notice')
