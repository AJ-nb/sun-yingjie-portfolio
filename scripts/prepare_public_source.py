"""Create a reviewable public source snapshot without copying private Git history."""
import argparse,hashlib,json,re,shutil,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--output',required=True);args=p.parse_args()
dest=Path(args.output).resolve()
if dest==ROOT or ROOT in dest.parents:raise SystemExit('Snapshot must be outside the working repository')
dest.mkdir(parents=True,exist_ok=True)
if any(dest.iterdir()):raise SystemExit('Snapshot directory must be empty')
assets=json.loads((ROOT/'web/dist/media-index.json').read_text(encoding='utf-8'))
downloads=json.loads((ROOT/'web/src/data/downloads.json').read_text(encoding='utf-8'))['items']
public={'web/public'+entry['path'] for entry in assets}
tracked=subprocess.check_output(['git','ls-files','-z'],cwd=ROOT).decode('utf-8').split('\0')
untracked=subprocess.check_output(['git','ls-files','--others','--exclude-standard','-z'],cwd=ROOT).decode('utf-8').split('\0')
root_files={'.gitignore','web/package.json','web/package-lock.json','web/index.html','web/vite.config.ts','web/eslint.config.js','web/tsconfig.json','web/tsconfig.app.json','web/tsconfig.node.json','.github/workflows/pages.yml'}
root_files.update('web/public/fonts/documents/'+name for name in ['DM-Sans-Regular.ttf','DM-Sans-SemiBold.ttf','Epilogue-Medium.ttf'])
download_names={Path(e['path']).name for e in downloads}
records=[];findings=[]
secret=re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,}|sk-proj-[A-Za-z0-9_-]{40,})')
for name in sorted(set(tracked+untracked)):
 if not name:continue
 path=ROOT/name
 keep=name in root_files or name in public or name.startswith(('web/src/','scripts/'))
 if name.startswith(('scripts/source-r2/','scripts/avatar/')):keep=False
 if name.startswith(('deliverables/resume/','deliverables/portfolio/')) and path.name in download_names:keep=True
 if not keep or not path.is_file():continue
 if any(part in ('__pycache__','node_modules','.production-runtime','.sites-runtime','private') for part in Path(name).parts):continue
 data=path.read_bytes()
 if data.startswith(b'version https://git-lfs.github.com/spec/v1'):raise SystemExit(f'Unresolved LFS asset: {name}')
 if len(data)>95*1024*1024:raise SystemExit(f'File too large for ordinary Git: {name}')
 if path.suffix in ('.ts','.tsx','.js','.mjs','.cjs','.json','.md','.py','.ps1','.yml','.html'):
  if secret.search(data.decode('utf-8',errors='replace')):findings.append(name)
 target=dest/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
 records.append({'path':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
if findings:raise SystemExit('Potential credentials found in: '+', '.join(findings))
(dest/'README.md').write_text('''# YINGJIE SUN — Portfolio

Industrial & Product Designer · 工业与产品设计师

[Open the portfolio](https://aj-nb.github.io/sun-yingjie-portfolio/) · [English](https://aj-nb.github.io/sun-yingjie-portfolio/en/) · [Résumé and downloads](https://aj-nb.github.io/sun-yingjie-portfolio/resume/)

32 bilingual projects, eight selected works, and a research library containing a pinned reference index and eight authored method studies. The reference library is not counted as personal project work.

## Run locally

Node.js 24 or later. From `web`, run `npm ci` and `npm run dev`.

For GitHub Pages builds set `PORTFOLIO_BASE_PATH=/sun-yingjie-portfolio/` and `VITE_SITE_ORIGIN=https://aj-nb.github.io`, then run `npm run build`. The workflow publishes only the verified asset allowlist. Nested routes contain static HTML; JavaScript enhances interaction.

## Publications

`web/public/downloads` contains 18 PDFs and eight editable Word résumés in Chinese and English. Generators are in `scripts`; PDF regeneration requires Python with ReportLab, Pillow, pypdf and PyMuPDF. The three licensed document fonts are included in `web/public/fonts/documents`. Chinese fonts can be supplied through `PORTFOLIO_FONT` and `PORTFOLIO_BOLD_FONT`. Editable résumé export uses Microsoft Word on Windows. Existing verified downloads can be published without rebuilding publications.

## Rights and provenance

Public access does not grant a blanket reuse license for portfolio artwork, client identities or project media. Personal responsibility and project maturity are documented in each case. Retrospective studies and concepts are labeled. Third-party license notices are in `web/public/THIRD_PARTY_NOTICES.md` and `web/public/licenses`.

Research curation credits Awesome Seedance / goodcase.ai under CC BY 4.0. Third-party reference videos are loaded from official posts on demand; no repository-wide license grants permission to redistribute their media. Private originals, credentials and archived development history are excluded from this source snapshot.
''',encoding='utf-8')
(dest/'.gitattributes').write_text('* text=auto\n*.pdf binary\n*.docx binary\n*.webp binary\n*.png binary\n*.mp4 binary\nweb/public/licenses/** -text\nweb/src/content/works/*.md -text\nweb/src/data/*.json -text\nscripts/*.py -text\nscripts/resume/*.py -text\n',encoding='utf-8')
report={'files':len(records),'bytes':sum(r['bytes'] for r in records),'credentialsFound':findings,'excluded':['private originals','all previous Git history','runtime caches','unrelated projects','unapproved public-folder assets'],'filesManifest':records}
(ROOT/'.production-runtime/v11/public-source-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='filesManifest'},ensure_ascii=False))
