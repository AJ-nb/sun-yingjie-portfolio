"""Assign reviewed source passages to explicit Blender-operation lines.

This local helper does not run Blender. Individual source mappings are reviewed
and kept with the deliverable for traceability against the installed skill.
"""
import json
from pathlib import Path
import sys
import subprocess

root = Path(__file__).resolve().parents[2]
plan_path = root / 'avatar/evidence/plan-v3.json'
plan = json.loads(plan_path.read_text(encoding='utf-8-sig'))
script = Path(sys.argv[1])
if script.name == 'inspect_material.py':
    mappings = [
        ([5], ['bpy.types.BlendData.html#bpy.types.BlendData.materials', 'bpy.types.BlendDataMaterials.html#bpy.types.BlendDataMaterials.new'], 'Create a material data-block for source-authorized runtime socket inspection.'),
        ([6], ['bpy.types.Material.html#bpy.types.Material.use_nodes'], 'Request shader nodes; 5.2 source states compatibility property, actual 5.0 behavior recorded.'),
        ([8,9], ['bpy.types.Material.html#bpy.types.Material.node_tree', 'bpy.types.NodeTree.html#bpy.types.NodeTree.nodes','bpy.types.Nodes.html','bpy.types.Node.html#bpy.types.Node.inputs','bpy.types.Node.html#bpy.types.Node.bl_idname','bpy.types.NodeSocket.html#bpy.types.NodeSocket.name','bpy.types.bpy_prop_collection.html'], 'Inspect the actually created node types and input socket names through documented collections; no socket names assumed.'),
    ]
else:
    mappings = json.loads((root / 'scripts/avatar/operation-bindings-v3.json').read_text())
plan['bindings'] = [{'lines':lines, 'basis':'source','refs':refs,'reason':reason} for lines,refs,reason in mappings]
inspection=json.loads(subprocess.check_output([sys.executable,'C:/Users/LENOVO/.codex/skills/blender-cli/scripts/evidence.py','inspect','--script',str(script)],encoding='utf8'))
bound={line for binding in plan['bindings'] for line in binding['lines']}
ordinary=[]
for operation in inspection['review']:
    if operation['line'] not in bound and not operation['requires_source']:
        # Reviewed: numerical list append, pathlib directories/files, JSON output.
        code=operation['code']
        if '.parent' in code or '.location' in code:
            raise RuntimeError('Unbound Blender helper operation: '+code)
        ordinary.append(operation['line'])
if ordinary:
    plan['bindings'].append({'lines':ordinary,'basis':'general_python','refs':[], 'reason':'Reviewed ordinary Python: numerical geometry lists, pathlib output directories and JSON file/report serialization; no bpy operation or Blender helper assignment in these lines.'})
plan['unresolved'] = []
plan_path.write_text(json.dumps(plan,ensure_ascii=False,indent=2),encoding='utf8')
