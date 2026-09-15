"""Clean multiview reference hair atlas on volumetric geometry, not a cutout."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
import math
root=Path(__file__).resolve().parents[2]
refs=root/'avatar/references/user-generated'
sources={}
polygons={
 'front':[(409,222),(439,128),(531,65),(625,76),(714,65),(800,151),(822,240),(782,325),(746,288),(690,292),(632,260),(591,273),(520,299),(463,344),(438,304)],
 'side':[(362,260),(355,170),(435,80),(582,48),(742,60),(825,118),(890,227),(875,341),(792,441),(751,502),(711,433),(713,341),(646,306),(607,326),(565,322),(513,269),(427,317)],
 'back':[(431,214),(454,138),(535,69),(625,78),(713,56),(802,149),(833,249),(803,370),(730,475),(642,455),(563,474),(488,376)]
}
for name,polygon in polygons.items():
    a=np.asarray(Image.open(refs/(name+'.png')).convert('RGB')).copy()
    m=Image.new('L',(1254,1254));ImageDraw.Draw(m).polygon(polygon,fill=255)
    rgb=a.astype(float)
    valid=(np.asarray(m)>0)&(rgb.mean(axis=2)<102)&(rgb[:,:,0]<rgb[:,:,1]*1.35+3)&(rgb[:,:,2]>rgb[:,:,1]*.66)
    valid_rows=np.where(valid.any(axis=1))[0]
    filled=a.copy()
    xx=np.arange(1254)
    for yy in range(1254):
        rr=yy if valid[yy].any() else valid_rows[np.argmin(abs(valid_rows-yy))]
        cc=np.where(valid[rr])[0]
        ii=np.searchsorted(cc,xx).clip(0,len(cc)-1)
        low=cc[np.maximum(0,ii-1)];high=cc[ii]
        near=np.where(abs(xx-low)<abs(xx-high),low,high)
        filled[yy]=a[rr,near]
    a=filled
    sources[name]=a
W,H=2048,1536
angle=np.linspace(-math.pi,math.pi,W)
si,co=np.sin(angle),np.cos(angle)
deg=np.abs(angle)*180/math.pi
ws=np.clip((deg-45)/40,0,1)*np.clip((153-deg)/42,0,1)
wb=np.clip((deg-111)/42,0,1);wf=1-ws-wb
def sample(name,x,y):
    return sources[name][np.clip(np.rint(y).astype(int),0,1253),np.clip(np.rint(x).astype(int),0,1253)].astype(float)
atlas=np.empty((H,W,3),np.uint8)
for row in range(H):
    z=(1-row/(H-1))*3.20+.15
    h=math.sqrt(max(.0001,1-((z-2.37)/.710)**2))
    x=.51*h*si;y=.025-.449*h*co
    yf=np.interp(z,[2.14,2.38,2.48,2.60,2.78,3.075],[480,344,303,254,166,62])
    ys=np.interp(z,[2.14,2.38,2.48,2.60,2.78,3.075],[491,358,303,248,157,52])
    yb=np.interp(z,[2.14,2.38,2.60,2.78,3.075],[478,365,260,164,59])
    rgb=sample('front',612+430*x,yf)*wf[:,None]+sample('side',630+565*y,ys)*ws[:,None]+sample('back',617-400*x,yb)*wb[:,None]
    atlas[row]=np.clip(rgb*.76,0,255).astype(np.uint8)
Image.fromarray(atlas).save(root/'avatar/textures/hair-v3-projection.jpg',quality=92,subsampling=0)
print('Hair color is sampled only from masked reference hair areas; no face/background pixels retained.')
p=root/'scripts/avatar/build_avatar_v3.py'
s=p.read_text(encoding='utf8')
if "('hair',hair_mats)" not in s:
    s=s.replace("('eye',[eye_white,iris_mat,pupil_mat,iris_light]),", "('eye',[eye_white,iris_mat,pupil_mat,iris_light]),('hair',hair_mats),")
if "'hair-v3-projection.jpg'" not in s:
    s=s.replace("'eye-front.jpg' if category=='eye' else", "'hair-v3-projection.jpg' if category=='hair' else 'eye-front.jpg' if category=='eye' else")
s=s.replace("math.atan2(x/.49,(.048-y)/.405)", "math.atan2(x/.51,(.025-y)/.449)")
# The tubes supply separation and silhouette. Smaller radius avoids a combed wig.
s=s.replace('r=.0020+.0025*(k%5)/4','r=.0012+.0014*(k%5)/4')
s=s.replace('r=.009+.006*(k%5)/4','r=.007+.005*(k%5)/4')
p.write_text(s,encoding='utf8')
