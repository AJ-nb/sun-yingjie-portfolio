import json
import sys
import subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[2]
path=root/'avatar/evidence/plan.json'
main=json.loads(path.read_text(encoding='utf8'))
other=json.loads((root/'avatar/evidence/texture-plan.json').read_text(encoding='utf8'))
for key in ['selected_features','seed_refs']:
    main[key]=list(dict.fromkeys(main[key]+other[key]))
main['reads']+=other['reads']
features=list(dict.fromkeys(main['selected_features']+['api:bpy.types.ShaderNodeUVMap','api:bpy.types.Image']))
fresh=root/'avatar/evidence/combined-texture-plan.json'
command=[sys.executable,'C:/Users/LENOVO/.codex/skills/blender-cli/scripts/features.py','plan','--request','Original true 3D avatar with multiview user-reference surface projection, independent eyes and camera animation','--output',str(fresh)]
for feature in features: command+=['--feature',feature]
subprocess.run(command,check=True)
generated=json.loads(fresh.read_text(encoding='utf8'))
generated['reads']=main['reads']
generated['bindings']=main['bindings']
path.write_text(json.dumps(generated,indent=2),encoding='utf8')
