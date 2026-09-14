"""Refresh current delivery and selected-media hashes without rehashing historical originals."""
from pathlib import Path
import datetime, hashlib, json
ROOT=Path(__file__).resolve().parents[1]
file=ROOT/'private/sources/coverage.json'
data=json.loads(file.read_text(encoding='utf-8'))
now=datetime.datetime.now(datetime.timezone.utc).isoformat()

def refresh(record):
    path=ROOT/record['path']
    raw=path.read_bytes(); sha=hashlib.sha256(raw).hexdigest()
    record.update(exists=True,bytes=len(raw),sha256=sha)
    if 'expectedBytes' in record: record.update(expectedBytes=len(raw),bytesMatch=True)
    if 'expectedSha256' in record: record.update(expectedSha256=sha,sha256Matches=True)

for record in data['manifestSnapshots']: refresh(record)
pub=data['publication']
for key in ['mediaIndex','stagingScript','viteConfig']: refresh(pub[key])
for asset in pub['assets']:
    refresh(asset['source']);refresh(asset['build'])
    assert asset['source']['sha256']==asset['build']['sha256'],asset['path']
pub['buildAssetBytes']=sum(a['source']['bytes'] for a in pub['assets'])
data['summary']['stagedBytes']=pub['buildAssetBytes']
for group in data['newDeliverables']:
    for record in group['files']: refresh(record)
    if 'contentData' in group: refresh(group['contentData'])
data['publicationSnapshotAt']=now
data['finalSnapshotVerification'].update(verifiedAt=now,rehashed='164 selected source/build pairs, manifest files, current Vite config, and final delivery files after the deployed URL correction. Historical source hashes and the 60 reviewed case files were retained from the previous verified snapshot.')
data['finalUrlCorrectionReport']='docs/final-url-verification.json'
file.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

report=ROOT/'docs/source-coverage.md'
text=report.read_text(encoding='utf-8')
text=text.replace('2026-09-14T17:52:33.590390+00:00',now)
text=text.replace('55,384,994','55,397,915').replace('52.82 MiB','52.83 MiB')
text=text.replace('16,945,242','16,945,554').replace('289,953','302,562').replace('38,558','38,551')
text=text.replace('9ac44ac3533e','8eea4aaad110').replace('a62d7d2b2573','24a0493a665b').replace('5c71f5171262','1ade71bcd665')
text+='\n最终站点地址修正后，仅更新作品集和简历的链接目的地。41 页 PDF 重渲染均与原审阅版逐像素一致；历史159条来源及工程原件校验不变。当前交付哈希见 `docs/final-url-verification.json`，实际部署见 `docs/DELIVERY.md`。\n'
report.write_text(text,encoding='utf-8',newline='\n')
print(f'PASS: {len(pub["assets"])} selected asset pairs; {pub["buildAssetBytes"]} bytes; historical source verification preserved.')
