import bpy
import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
scene=bpy.context.scene
names=list(bpy.data.objects.keys())
required=['Camera','eye_left | curved sclera','eye_right | curved sclera','focus-start','focus-1','focus-2','focus-3','focus-works']
assert all(name in names for name in required)
camera=bpy.data.objects.get('Camera')
assert camera.animation_data.action.name=='CameraAction'
poses=[]
for frame in [1,70,145,205,240]:
    scene.frame_set(frame)
    poses.append({'frame':frame,'position':list(camera.location),'rotation':list(camera.rotation_euler)})
assert poses[0]['position'] != poses[-1]['position']
assert scene.camera.name=='Camera'
report={'passed':True,'check':'Fresh Blender process reopened original saved .blend','object_count':len(names),'required_objects':required,'camera_action':camera.animation_data.action.name,'camera_poses':poses}
(root/'avatar/evidence/reopen-report.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report))
