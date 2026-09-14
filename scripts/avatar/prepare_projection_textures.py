"""Bake user-authorized reference pixels into cylindrical surface atlases.

This is texture preparation for existing solid geometry, not a portrait plane.
Projection alignment is an artistic approximation; source images are generated
references and cannot establish unobserved anatomical measurements.
"""
from pathlib import Path
import ast
import math
import json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
REF=ROOT/'avatar/references/user-generated'
OUT=ROOT/'avatar/textures'
OUT.mkdir(exist_ok=True)
script=ast.parse((ROOT/'scripts/avatar/build_avatar.py').read_text(encoding='utf8'))
scope={k:getattr(math,k) for k in ['sin','cos','pi','exp','sqrt']}
for item in script.body:
    wanted=isinstance(item,ast.FunctionDef) and item.name in ['profile','face_y','gaussian','body_profile','lerp']
    wanted=wanted or (isinstance(item,ast.Assign) and any(isinstance(t,ast.Name) and t.id in ['PROFILE','BODY'] for t in item.targets))
    if wanted: exec(compile(ast.Module(body=[item],type_ignores=[]),'<geometry>','exec'),scope)
photos={name:np.asarray(Image.open(REF/(name+'.png')).convert('RGB'),dtype=np.float32) for name in ['front','side','back']}
W=2048; H=1536; HEIGHT=3.20
angles=np.linspace(-math.pi,math.pi,W,dtype=np.float32)
si=np.sin(angles); co=np.cos(angles)
deg=np.abs(angles)*180/math.pi
# Face-dominant projection preserves the important eyes/nose/mouth alignment.
side_weight=np.clip((deg-50)/35,0,1)*np.clip((155-deg)/45,0,1)
back_weight=np.clip((deg-110)/45,0,1)
front_weight=1-side_weight-back_weight
zhead=[1.75,1.991,2.133,2.366,2.459,2.60,2.78,3.034,3.15]
yfront=[570,483,437,351,310,260,164,65,52]
yside=[578,491,435,347,305,251,160,62,48]
def sample(name,x,y,hair=False,skin=False):
    arr=photos[name]
    x=np.clip(np.rint(x).astype(int),2,arr.shape[1]-3)
    y=np.clip(np.rint(np.broadcast_to(y,x.shape)).astype(int),2,arr.shape[0]-3)
    if hair:
        # Avoid transferring background or skin across the hair silhouette.
        for _ in range(12):
            rgb=arr[y,x]
            bad=(rgb.mean(axis=1)>88)
            y=np.where(bad,np.clip(y+np.where(y<200,8,-8),65,480),y)
        rgb=arr[y,x]
        bad=rgb.mean(axis=1)>88
        rgb[bad]=arr[200,620]
        return rgb
    rgb=arr[y,x]
    if skin:
        bad=(rgb[:,0]<rgb[:,1]*1.075)&(rgb.mean(axis=1)>80)
        if name!='front': bad=bad|(rgb.mean(axis=1)<78)
        rgb[bad]=photos['front'][445,555]
    return rgb

for category in ['skin','hair','cloth']:
    atlas=np.empty((H,W,3),dtype=np.uint8)
    for row in range(H):
        z=(1-row/(H-1))*HEIGHT
        raw=z+.15
        if category=='cloth':
            w,d=scope['body_profile'](min(1.46,max(0,z)))
            x=w*si; y=.07-d*co
            xf=612+540*x
            yf=1254-381*z if z<1.25 else np.interp(z,[1.25,1.47,1.55],[778,611,548])
            xb=612-540*x
            yb=1254-320*z
            xs=635+650*y
            ys=1254-400*z
        else:
            if raw<1.75:
                w,d,c=.26,.22,.045
            else:
                w,d,c=scope['profile'](raw)
            if category=='hair':
                q=(raw-2.36)/.675
                h=math.sqrt(max(.0001,1-q*q))
                w,d,c=.49*h,.405*h,.048
            x=w*si
            if category=='skin' and raw>=1.75:
                y=np.array([scope['face_y'](float(xx),raw) if cc>=0 else c+d*math.sqrt(max(0,1-(float(xx)/w)**2)) for xx,cc in zip(x,co)])
            else: y=c-d*co
            xf=612+(385 if category=='hair' else 340)*x
            if z>=1.60: yf=np.interp(raw,zhead,yfront)
            else: yf=np.interp(z,[1.05,1.25,1.53,1.60],[779,777,596,570])
            xs=656+570*y
            ys=np.interp(raw,zhead,yside) if z>=1.60 else np.interp(z,[1.05,1.53,1.60],[798,647,578])
            xb=611-365*x
            if category=='hair': yb=55+(3.034-raw)*542
            else: yb=550-(z-1.53)*150
        if category=='skin':
            clean_skin=sample('side',555+20*si,455+(z-2)*24,skin=True)
            extent=.94 if raw>2.48 else .78
            keep_front=np.clip((extent-np.abs(si))/.20,0,1)*np.clip(co*4,0,1)
            if z<1.58: keep_front*=np.clip((z-1.35)/.23,0,1)
            rgb=sample('front',xf,yf,skin=True)*keep_front[:,None]+clean_skin*(1-keep_front[:,None])
        else:
            rgb=(sample('front',xf,yf,category=='hair')*front_weight[:,None]+sample('side',xs,ys,category=='hair')*side_weight[:,None]+sample('back',xb,yb,category=='hair')*back_weight[:,None])
        # Texture contains reference lighting, so avoid further contrast boosting.
        atlas[row]=np.clip(rgb,0,255).astype(np.uint8)
    Image.fromarray(atlas).save(OUT/(category+'-projection.jpg'),quality=92,subsampling=0)
Image.open(REF/'front.png').convert('RGB').save(OUT/'eye-front.jpg',quality=95,subsampling=0)
Image.open(REF/'front.png').convert('RGB').crop((290,850,450,1010)).resize((512,512)).save(OUT/'collar-knit.jpg',quality=92,subsampling=0)
(OUT/'projection-notes.json').write_text(json.dumps({'method':'Original surface geometry with manually aligned front/side/back image projection, blended in cylindrical atlas coordinates','source':'../references/user-generated/manifest.json','atlas_dimensions':[W,H],'height_units':HEIGHT,'blend_degrees':{'front_to_side':[50,85],'side_to_back':[110,155]},'limitation':'Generated reference views are artistic guidance; color atlas includes source illumination and is not a measured albedo scan.'},indent=2),encoding='utf8')
print('Prepared three multi-view surface atlases and a front eye texture.')
