"""Soften a localized baked chin shadow to avoid lighting it twice in 3D."""
from pathlib import Path
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[2]
p=root/'avatar/textures'
a=np.asarray(Image.open(p/'skin-projection.jpg').convert('RGB')).astype(float)
h,w=a.shape[:2]
z=np.linspace(3.2,0,h)[:,None]
angle=np.linspace(-np.pi,np.pi,w)[None,:]
weight=.27*np.exp(-((z-1.69)/.14)**2)*np.maximum(0,np.cos(angle))**2
base=np.array([191.,152.,124.])
shadow=np.clip((148-a.mean(axis=2))/65,0,1)
weight*=shadow
a=a*(1-weight[:,:,None])+base*weight[:,:,None]
Image.fromarray(a.clip(0,255).astype('uint8')).save(p/'skin-v3-projection.jpg',quality=94,subsampling=0)
print('Prepared v3 skin atlas; original v2 skin image preserved.')
