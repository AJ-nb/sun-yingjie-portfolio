from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[2]
folder=ROOT/'private/sources/refinement-v2'
rows=json.loads((folder/'psd-source-hashes.json').read_text(encoding='utf-8'))
for row in rows:
    path=Path(row['sourceFile'])
    with path.open('rb') as stream:row['unchanged']=hashlib.file_digest(stream,'sha256').hexdigest()==row['sha256']
    row['sizeUnchanged']=path.stat().st_size==row['bytes']
    row['mtimeUnchanged']=path.stat().st_mtime_ns==row['mtimeNs']
(folder/'psd-source-preservation.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'files':len(rows),'hashesUnchanged':all(r['unchanged'] for r in rows),'sizeUnchanged':all(r['sizeUnchanged'] for r in rows),'mtimeUnchanged':all(r['mtimeUnchanged'] for r in rows)}))
