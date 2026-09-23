"""Build brief editorial films using unchanged original photographs and analysis boards."""
from pathlib import Path
import subprocess, shutil, json
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'web/public/media/v7/films'
TMP=ROOT/'deliverables/brand-v7/film-frames'
OUT.mkdir(parents=True,exist_ok=True);TMP.mkdir(parents=True,exist_ok=True)
films={
 'hermes': ['/works/legacy/hermes/f1455674fa1906fe49bd555bcad97e9c.webp','/works/legacy/hermes/40379d8484144b6a435498fcf8b9d857.webp','/works/legacy/hermes/043e019544984416521bf2009313a5fb.webp'],
 'arcteryx': ['/works/legacy/arcteryx/cb880134dd55b4ea48ac6a2c188bf65b.webp','/media/v7/brand/arcteryx-logic.webp','/media/v7/brand/arcteryx-system.webp']}
for case, images in films.items():
 frames=[]
 for i,source in enumerate(images):
  image=Image.open(ROOT/'web/public'/source.lstrip('/')).convert('RGB')
  frame=Image.new('RGB',(1280,720),'#141815');image=ImageOps.contain(image,(1280,720),Image.Resampling.LANCZOS)
  frame.paste(image,((1280-image.width)//2,(720-image.height)//2))
  p=TMP/f'{case}-{i}.png';frame.save(p);frames.append(p)
 cmd=[shutil.which('ffmpeg'),'-hide_banner','-loglevel','error','-y']
 for f in frames:cmd+=['-loop','1','-t','3.6','-i',str(f)]
 cmd+=['-filter_complex','[0:v][1:v][2:v]concat=n=3:v=1:a=0,format=yuv420p[v]','-map','[v]','-r','24','-c:v','libx264','-crf','22','-preset','fast','-g','12','-movflags','+faststart',str(OUT/f'{case}-process.mp4')]
 subprocess.run(cmd,check=True)
 print(case, (OUT/f'{case}-process.mp4').stat().st_size)
(OUT/'sources.json').write_text(json.dumps({'edition':'v7','type':'Editorial sequences of original images and authored design analyses','films':films},indent=2),encoding='utf-8')
