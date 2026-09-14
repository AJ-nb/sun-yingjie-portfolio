"""Record the final review snapshot without changing model or rendered pixels."""
from pathlib import Path
import hashlib
import json
import subprocess
from PIL import Image

root=Path(__file__).resolve().parents[2]
files=[root/'avatar/sun-yingjie-avatar-draft.blend',root/'avatar/sun-yingjie-avatar-draft-v2.blend',root/'web/public/models/avatar.glb']
image_root=root/'web/public/images/avatar'
files += [image_root/(name+'.png') for name in ['front','three-quarter','side','back','multi-angle','before-after-v2']]
files += [image_root/('turntable-%02d.png'%i) for i in range(12)]
files += [image_root/'turntable.mp4',root/'scripts/avatar/build_avatar.py',root/'avatar/README.md']
records=[]
for path in files:
    raw=path.read_bytes()
    entry={'path':str(path.relative_to(root)).replace('\\','/'),'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
    if path.suffix=='.png':
        with Image.open(path) as image:
            entry.update({'dimensions':list(image.size),'mode':image.mode})
            if image.mode=='RGBA':
                box=image.getchannel('A').getbbox()
                assert box is not None
                entry['content_bounds']=list(box)
    records.append(entry)
video=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,width,height,r_frame_rate,nb_frames','-of','json',str(image_root/'turntable.mp4')],encoding='utf8'))
assert video['streams'][0]['width']==1200 and video['streams'][0]['height']==1200
assert abs(float(video['format']['duration'])-4)<.05
report={'revision':2,'status':'Stable review snapshot; user likeness confirmation pending','geometry':'Original continuous head/jaw/neck and substantial torso, separate eye roots, authored hair clumps','texture_sources':'User-provided generated references; see references/user-generated/manifest.json','reference_count':5,'embedded_model_texture_count':4,'unique_turntable_angles':12,'video':video,'files':records,'glb_validation':json.loads((root/'avatar/evidence/glb-validation.json').read_text(encoding='utf8')),'saved_blend_validation':json.loads((root/'avatar/evidence/reopen-report.json').read_text(encoding='utf8'))}
assert report['glb_validation']['passed'] and report['saved_blend_validation']['passed']
(root/'avatar/evidence/delivery-v2.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'passed':True,'recorded_files':len(records),'video_duration':video['format']['duration'],'v2_blend_sha256':records[1]['sha256'],'glb_sha256':records[2]['sha256']},indent=2))
