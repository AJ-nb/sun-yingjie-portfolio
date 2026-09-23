"""Create a static-only Sites checkout from the validated allowlisted Vite build."""
from pathlib import Path
import argparse, json, shutil, hashlib, sys
sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--build',type=Path,default=ROOT/'web/dist')
parser.add_argument('--release',type=Path,required=True,help='A new, non-existing directory below .sites-runtime')
args=parser.parse_args()
BUILD=args.build.resolve()
RELEASE=args.release.resolve()
TARGET=RELEASE/'dist'
if not (BUILD/'index.html').is_file(): raise SystemExit('Run the web build first')
config=json.loads((ROOT/'.openai/hosting.json').read_text(encoding='utf-8-sig'))
assert config['static']['directory']=='dist'
# Each release uses a new directory; never remove or overwrite an earlier release.
if not RELEASE.is_relative_to((ROOT/'.sites-runtime').resolve()): raise SystemExit('Release must be inside .sites-runtime')
if RELEASE.exists(): raise SystemExit('Release already exists; choose a new directory')
media=json.loads((BUILD/'media-index.json').read_text(encoding='utf-8'))
expected={row['path'].lstrip('/') for row in media}|{'index.html','media-index.json'}
expected.update(p.relative_to(BUILD).as_posix() for p in (BUILD/'assets').iterdir() if p.is_file())
# Static route generation produces one HTML document per public route (plus the
# root entry). Keep the release boundary explicit while allowing those
# generated documents to be copied into the Sites checkout.
expected.update(p.relative_to(BUILD).as_posix() for p in BUILD.rglob('*.html') if p.is_file())
actual={p.relative_to(BUILD).as_posix() for p in BUILD.rglob('*') if p.is_file()}
if expected!=actual: raise SystemExit(f'Unexpected build contents: {sorted(actual^expected)}')
bundles=list((BUILD/'assets').iterdir())
if not any(p.suffix=='.js' for p in bundles) or not any(p.suffix=='.css' for p in bundles): raise SystemExit('Missing Vite JavaScript or CSS bundle')
shutil.copytree(BUILD,TARGET)
(RELEASE/'.openai').mkdir(parents=True,exist_ok=True)
(RELEASE/'.openai/hosting.json').write_text(json.dumps(config,indent=2)+'\n',encoding='utf-8',newline='\n')
(RELEASE/'package.json').write_text(json.dumps({'name':'sun-yingjie-static-release','private':True,'scripts':{'build':'node -e "console.log(\'Validated static output is in dist\')"'}},indent=2)+'\n',encoding='utf-8',newline='\n')
(RELEASE/'.gitattributes').write_text('* -text\n',encoding='utf-8',newline='\n')
forbidden=[]; files=[]
for p in TARGET.rglob('*'):
    if not p.is_file(): continue
    rel=p.relative_to(TARGET).as_posix()
    if any(part in {'private','avatar/references','scripts','node_modules'} for part in p.parts) or p.suffix in {'.blend','.pptx'}: forbidden.append(rel)
    files.append({'path':rel,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
if forbidden: raise SystemExit(f'Unexpected private/source artifacts: {forbidden}')
(RELEASE.parent/(RELEASE.name+'-files.json')).write_text(json.dumps(files,indent=2),encoding='utf-8',newline='\n')
print(json.dumps({'release':str(RELEASE),'files':len(files),'bytes':sum(f['bytes'] for f in files),'privateArtifactCount':len(forbidden)},ensure_ascii=False))
