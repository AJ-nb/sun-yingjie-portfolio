from pathlib import Path
import shutil
import hashlib
import json

root=Path(__file__).resolve().parents[1]
source=Path('D:/OneDrive/桌面/文件/项目/sen-3d-resume')
web=root/'web'
records=[]
for path in (source/'web').rglob('*'):
    relative=path.relative_to(source/'web')
    if any(part in {'node_modules','dist','.git','public'} for part in relative.parts):
        continue
    if not path.is_file() or path.suffix=='.tsbuildinfo' or path.name=='.gitignore':
        continue
    destination=web/relative
    destination.parent.mkdir(parents=True,exist_ok=True)
    if not destination.exists():shutil.copy2(path,destination)
    records.append({'path':'web/'+relative.as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
for name in ['LICENSE','NOTICE','CLAUDE.md','AGENTS.md']:
    path=source/name
    destination=root/('LICENSE.sen' if name=='LICENSE' else ('NOTICE.sen' if name=='NOTICE' else 'private/sources/sen/'+name))
    destination.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(path,destination)
(root/'private/sources/sen/source-files.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print('Copied source files:',len(records),'Personal stock assets excluded.')
