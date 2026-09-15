from extract_sources import *
exe='D:/Program Files/PTC/Creo 6.0.3.0/Common Files/x86e_win64/cedirect/binx64/7za.exe'
records=[]
for slug in ('plumber','huhu'):
    index=json.loads((PRIVATE/f'{slug}-archive-index.json').read_text(encoding='utf-8'))
    if slug=='plumber':
        chosen=[r for r in index['files'] if '\\C4D\\render\\' in r['Path'] and '备份' not in r['Path'] and '@' not in r['Path']]
    else:
        chosen=[r for r in index['files'] if ('\\C4D\\PRODUCT\\' in r['Path'] and '备份' not in r['Path'] and '@' not in r['Path']) or r['Path'].endswith(('03rhino5.obj','03rhino5.mtl'))]
        # Existing image exports in the authored product scene's sibling render folder.
        candidates=[r for r in index['files'] if any(t in r['Path'].lower() for t in ('render','渲染')) and r['Path'].lower().endswith(('.png','.jpg','.tif','.jpeg')) and '\\tex\\' not in r['Path'].lower()]
        chosen += [r for r in candidates if r not in chosen]
    selection=PRIVATE/f'{slug}-extract-list.txt'
    selection.write_text('\n'.join(r['Path'] for r in chosen),encoding='utf-8')
    dest=WORK/slug
    dest.mkdir(exist_ok=True)
    proc=subprocess.run([exe,'x','-y','-scsUTF-8','-sccUTF-8',index['source'],'@'+str(selection),'-o'+str(dest)],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    (PRIVATE/f'{slug}-extract-log.txt').write_text(proc.stdout.decode('utf-8',errors='replace')+proc.stderr.decode('utf-8',errors='replace'),encoding='utf-8')
    files=[]
    for item in chosen:
        p=dest/Path(item['Path'])
        files.append({'archivePath':item['Path'],'bytes':int(item['Size']),'extractedPath':str(p.relative_to(ROOT)).replace('\\','/'),'exists':p.exists(),'actualBytes':p.stat().st_size if p.exists() else None,'CRC':item.get('CRC')})
    records.append({'slug':slug,'sourceArchive':index['source'],'returncode':proc.returncode,'selectedBytes':sum(x['bytes'] for x in files),'files':files})
    print(json.dumps({'slug':slug,'returncode':proc.returncode,'selected':len(files),'extracted':sum(x['exists'] for x in files)},ensure_ascii=False),flush=True)
save_json('model-extraction-manifest.json',records)
