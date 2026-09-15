"""Measure recorded pupil positions for every source frame; never synthesize gaze."""
from pathlib import Path
import json, math, subprocess
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
frame_dir=ROOT/'.cache/v5/footer-frames'
frame_dir.mkdir(parents=True,exist_ok=True)
frames = sorted(frame_dir.glob('*.png'))
if len(frames)!=169:
    subprocess.run(['ffmpeg','-y','-i',str(ROOT/'web/public/media/v5/footer-original.mp4'),'-vf','crop=380:180:750:325','-fps_mode','passthrough',str(frame_dir/'%04d.png')],check=True,capture_output=True)
    frames=sorted(frame_dir.glob('*.png'))
if len(frames)!=169:raise ValueError('Expected all 169 frames of the supplied original')
rows=[]
for i, frame in enumerate(frames):
    a=np.asarray(Image.open(frame).convert('RGB'))
    pupils=[]
    for x0,x1 in [(65,200),(200,345)]:
        region=a[25:155,x0:x1]
        mask=np.max(region,axis=2)<85
        ys,xs=np.nonzero(mask)
        if len(xs)<10:raise ValueError(f'Pupil measurement missing at frame {i}')
        y,x=float(ys.mean()),float(xs.mean())
        pupils.append([float(x+x0),float(y+25)])
    rows.append({'frame':i,'time':i/24,'pupils':pupils,'center':np.mean(pupils,axis=0).tolist()})
centers=np.array([r['center'] for r in rows])
# Normalize the measured horizontal/vertical travel independently: pupil paths are elliptical.
lo,hi=centers.min(axis=0),centers.max(axis=0)
origin=(lo+hi)/2; radius=(hi-lo)/2
for r in rows:
    v=(np.array(r['center'])-origin)/radius
    r['angle']=math.atan2(v[1],v[0])%(2*math.pi)
    r['travel']=float(np.linalg.norm(v))
data={'sourceWidth':1920,'sourceHeight':1080,'eyeCenter':[948,418],
      'fps':24,'frameCount':len(rows),'method':'Dark pupil pixels below RGB85 within each eye ROI, all source frames; ellipse-normalized centroid displacement. Time is frame start; consumer adds 1/240 second.',
      'crop':[750,325,380,180],'measuredCenter':origin.tolist(),'measuredRadius':radius.tolist(),
      'samples':[{'angle':r['angle'],'time':r['time']} for r in rows if r['travel']>.5]}
(ROOT/'web/public/media/v5/footer-gaze.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
(ROOT/'.cache/v5/gaze-measurements.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
sheet=Image.new('RGB',(4*380,4*215),'#f0eefa');draw=ImageDraw.Draw(sheet)
for j,target in enumerate(np.arange(16)*2*math.pi/16):
    r=min(rows,key=lambda r:abs(math.atan2(math.sin(r['angle']-target),math.cos(r['angle']-target))))
    x,y=j%4*380,j//4*215
    sheet.paste(Image.open(frames[r['frame']]),(x,y+30))
    draw.text((x+8,y+8),f'{round(target*180/math.pi)} deg | frame {r["frame"]} | {r["time"]:.4f}s',fill='black')
sheet.save(ROOT/'.cache/v5/gaze-calibration.png')
print(json.dumps({'frames':len(rows),'samples':len(data['samples']),'origin':origin.tolist(),'radius':radius.tolist(),
    'cardinal':[{ 'time':t,'angleDegrees':round(rows[round(t*24)]['angle']*180/math.pi,1)} for t in [2.54167,.33333,1,1.70833]]}))
