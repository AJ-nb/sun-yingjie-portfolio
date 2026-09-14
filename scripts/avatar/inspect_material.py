import bpy
import json
from pathlib import Path

material = bpy.data.materials.new('runtime_socket_inspection')
material.use_nodes = True
records = []
for node in material.node_tree.nodes:
    records.append({'node': node.bl_idname, 'inputs': [socket.name for socket in node.inputs]})
Path('D:/OneDrive/桌面/文件/项目/sun-yingjie-portfolio/avatar/evidence/material-runtime.json').write_text(json.dumps(records, indent=2), encoding='utf8')
print(json.dumps(records))
