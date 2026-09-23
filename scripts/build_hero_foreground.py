"""Extract a pose-specific alpha foreground from the author's calibrated film.

Each frame is segmented independently within a tracked contour band. No generated
replacement imagery: RGB pixels come directly from the original video.
"""
from pathlib import Path
import json
import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'web/public/media/v10/hero'
OUT.mkdir(parents=True, exist_ok=True)
cap = cv2.VideoCapture(str(ROOT / 'web/public/media/v7/hero-follow.mp4'))
# Contour landmarks at left / front / right, in a 960 x 543 reference frame.
left = np.array([[543,136],[690,129],[745,139],[755,179],[768,321],[744,350],[716,355],[748,370],[800,398],[844,429],[866,481],[880,543],[449,543],[465,454],[480,414],[523,381],[579,358],[585,351],[560,344],[540,326]],float)
right = np.array([[574,140],[644,125],[768,138],[779,179],[780,327],[754,352],[716,356],[747,373],[800,399],[838,432],[854,480],[868,543],[437,543],[449,451],[466,413],[505,383],[564,355],[583,341],[557,334],[534,316]],float)
for frame in range(18, 73):
    cap.set(cv2.CAP_PROP_POS_MSEC, frame / 24 * 1000)
    ok, rgb = cap.read()
    if not ok: raise RuntimeError(f'Missing source frame {frame}')
    rgb = cv2.resize(rgb, (960,543))
    contour = np.round(left + (right-left) * ((frame-18)/54)).astype(np.int32)
    inside = np.zeros((543,960),np.uint8)
    cv2.fillPoly(inside,[contour],255)
    core = cv2.erode(inside,np.ones((21,21),np.uint8))
    extent = cv2.dilate(inside,np.ones((35,35),np.uint8))
    mask = np.where(extent>0,cv2.GC_PR_BGD,cv2.GC_BGD).astype(np.uint8)
    mask[inside>0]=cv2.GC_PR_FGD
    mask[core>0]=cv2.GC_FGD
    cv2.grabCut(rgb,mask,None,np.zeros((1,65)),np.zeros((1,65)),3,cv2.GC_INIT_WITH_MASK)
    alpha = np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD),255,0).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    contours,_=cv2.findContours(alpha,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    outline=cv2.approxPolyDP(max(contours,key=cv2.contourArea),1.35,True)
    alpha[:]=0
    cv2.fillPoly(alpha,[outline],255)
    alpha=cv2.erode(alpha,np.ones((2,2),np.uint8))
    alpha = cv2.GaussianBlur(alpha,(3,3),.55)
    rgba=cv2.cvtColor(rgb,cv2.COLOR_BGR2RGBA);rgba[:,:,3]=alpha
    image=Image.fromarray(rgba[110:543,420:900]).resize((800,722),Image.Resampling.LANCZOS)
    image.save(OUT/f'{frame:02}.webp',quality=87,method=6)
    if frame==32:image.save(OUT/'poster.webp',quality=90,method=6)
cap.release()
(OUT/'manifest.json').write_text(json.dumps({'source':'/media/v7/hero-follow.mp4','fps':24,'first':18,'center':32,'last':72,'width':800,'height':722,'method':'Original video frames with per-frame GrabCut alpha; no generated imagery'},indent=2)+'\n')
print('55 original pose frames and static foreground written')
