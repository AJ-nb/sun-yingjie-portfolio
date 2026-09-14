import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
plan=json.loads((root/'avatar/evidence/plan.json').read_text(encoding='utf8'))
def ref(cls,p): return f'bpy.types.{cls}.html#bpy.types.{cls}.{p}'
bindings=[
    ([5],['bpy.context.html',ref('Context','scene')],'Access scene loaded by the documented skill CLI wrapper in a fresh Blender process.'),
    ([6,9],[ref('BlendData','objects'),'bpy.types.bpy_prop_collection.html'],'Read names and retrieve saved camera from documented object collection.'),
    ([10,17],[ref('Object','animation_data'),ref('AnimData','action'),ref('ID','name')],'Check the persisted active camera action name.'),
    ([13],[ref('Scene','frame_set')],'Evaluate saved scene at representative camera transition frames.'),
    ([14],[ref('Object','location'),ref('Object','rotation_euler')],'Read evaluated camera poses for numerical persistence verification.'),
    ([16],[ref('Scene','camera'),ref('ID','name')],'Confirm original scene active camera persists.'),
]
plan['bindings']=[{'lines':l,'basis':'source','refs':r,'reason':why} for l,r,why in bindings]
plan['bindings'].append({'lines':[4,18,19],'basis':'general_python','refs':[],'reason':'Ordinary pathlib root resolution and JSON verification report serialization.'})
plan['unresolved']=[]
(root/'avatar/evidence/verify-plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2),encoding='utf8')
