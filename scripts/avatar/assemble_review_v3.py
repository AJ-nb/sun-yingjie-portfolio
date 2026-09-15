"""Arrange unchanged actual render outputs; encode 72 distinct camera views."""
from pathlib import Path
import hashlib
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[2]
images=root/'web/public/images/avatar'
cache=root/'avatar/render-cache-v3'
def intermediate(name):
    cached=cache/name
    return cached if cached.exists() else images/name
bg=(240,239,234)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',25)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',17)
def tile(path,size=(1080,1080)):
    im=Image.open(path).convert('RGBA')
    if im.size!=size: im=im.resize(size,Image.Resampling.LANCZOS)
    canvas=Image.new('RGB',size,bg);canvas.paste(im,(0,0),im)
    return canvas
sheet=Image.new('RGB',(2160,2220),bg)
draw=ImageDraw.Draw(sheet)
for index,name in enumerate(['front','three-quarter','side','back']):
    x=(index%2)*1080;y=(index//2)*1110
    sheet.paste(tile(images/(name+'.png')),(x,y+30))
    draw.text((x+32,y+10),name.upper(),fill=(65,65,65),font=small)
sheet.save(images/'multi-angle.png')
comparison=Image.new('RGB',(2160,1140),bg)
comparison.paste(tile(root/'avatar/review-v2/front.png'),(0,60))
comparison.paste(tile(images/'front.png'),(1080,60))
draw=ImageDraw.Draw(comparison)
draw.text((32,20),'REVISION 2',fill=(55,55,55),font=font)
draw.text((1112,20),'REVISION 3 - REVIEW DRAFT',fill=(55,55,55),font=font)
comparison.save(images/'before-after-v3.png')
poster=Image.new('RGBA',(1280,720),(0,0,0,0))
poster.paste(Image.open(intermediate('home-camera-v3-square.png')).convert('RGBA'),(280,0))
poster.save(images/'home-camera-v3.png')
encoder=subprocess.Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','720x720','-framerate','24','-i','pipe:0','-frames:v','144','-vf','format=yuv420p','-c:v','libx264','-crf','19','-movflags','+faststart',str(images/'turntable.mp4')],stdin=subprocess.PIPE)
for i in range(72):
    pixels=tile(intermediate('turntable-%02d.png'%i),(720,720)).tobytes()
    encoder.stdin.write(pixels)
    encoder.stdin.write(pixels)
encoder.stdin.close()
assert encoder.wait()==0
video=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,width,height,r_frame_rate,nb_frames','-of','json',str(images/'turntable.mp4')],encoding='utf8'))
assert video['streams'][0]['width']==720
assert abs(float(video['format']['duration'])-6)<.06
files=[root/'avatar/sun-yingjie-avatar-draft-v3.blend',root/'web/public/models/avatar.glb']
files += [images/(n+'.png') for n in ['front','three-quarter','side','back','multi-angle','before-after-v3','home-camera-v3']]
files += [images/'turntable.mp4']
records=[]
for p in files:
    r={'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
    if p.suffix=='.png':
        im=Image.open(p);r['dimensions']=list(im.size)
        if im.mode=='RGBA':r['content_bounds']=list(im.getchannel('A').getbbox())
    records.append(r)
report={'revision':3,'status':'Technical and visual review draft; personal likeness awaits user review','actual_rendered_turntable_angles':72,'video':video,'files':records,'local_intermediates':{'publication':'Excluded; retained locally for reproducibility','paths':[intermediate('turntable-%02d.png'%i).relative_to(root).as_posix() for i in range(72)]+[intermediate('home-camera-v3-square.png').relative_to(root).as_posix()]},'glb_validation':json.loads((root/'avatar/evidence/glb-validation-v3.json').read_text()),'reopen_validation':json.loads((root/'avatar/evidence/reopen-report-v3.json').read_text())}
assert report['glb_validation']['passed'] and report['reopen_validation']['passed']
(root/'avatar/evidence/delivery-v3.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps({'passed':True,'files':len(records),'video_seconds':video['format']['duration']},indent=2))
