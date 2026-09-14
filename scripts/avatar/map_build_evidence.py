import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
lines=(root/'scripts/avatar/build_avatar.py').read_text(encoding='utf8').splitlines()
groups=[]
def bind(needles,refs,reason):
    hits=[i for i,line in enumerate(lines,1) if any(n in line for n in needles)]
    if hits: groups.append([hits,refs,reason])
def ref(cls,prop): return f'bpy.types.{cls}.html#bpy.types.{cls}.{prop}'
bind(['list(bpy.data.objects)'],[ref('BlendData','objects'),'bpy.types.bpy_prop_collection.html',ref('Object','select_set')],'Iterate the current object collection and inspect or change documented selection state.')
bind(['bpy.data.objects.remove'],[ref('BlendData','objects'),ref('BlendDataObjects','remove')],'Remove only the factory startup objects from this freshly launched process, unlinking their uses.')
bind(['scene = bpy.context.scene'],['bpy.context.html',ref('Context','scene')],'Access active scene from context, runtime probe confirms background object mode.')
bind(['bpy.data.objects.new'],[ref('BlendData','objects'),ref('BlendDataObjects','new')],'Create object using authored mesh/camera/light data or None for semantic empty anchors.')
bind(['scene.collection.objects.link'],[ref('Scene','collection'),ref('Collection','objects'),ref('CollectionObjects','link')],'Link created objects to the active scene collection.')
bind(['bpy.data.materials.new'],[ref('BlendData','materials'),ref('BlendDataMaterials','new')],'Create original surface materials.')
for p in ['use_nodes','diffuse_color','roughness','metallic']:
    bind(['mat.'+p+' ='],[ref('Material',p)],'Assign documented material property using requested artistic value. Shader-node creation has been observed on runtime 5.0.1.')
bind(['node = next(n for n in mat.node_tree.nodes'],[ref('Material','node_tree'),ref('NodeTree','nodes'),'bpy.types.Nodes.html',ref('Node','bl_idname'),'bpy.types.bpy_prop_collection.html'],'Select actually observed Principled shader; material-runtime.json records node identity and inputs on Blender 5.0.1.')
bind(["node.inputs['Base Color']"],[ref('Node','inputs'),ref('NodeSocketColor','default_value'),'bpy.types.bpy_prop_collection.html'],'Set four color values on runtime-observed Base Color socket; source establishes color socket default contract.')
bind(["node.inputs['Roughness']","node.inputs['Metallic']","node.inputs['Specular IOR Level']"],[ref('Node','inputs'),ref('NodeSocketFloat','default_value'),'bpy.types.bpy_prop_collection.html'],'Set scalar values on Roughness/Metallic/Specular sockets actually recorded in material-runtime.json.')
bind(['bpy.data.meshes.new'],[ref('BlendData','meshes'),ref('BlendDataMeshes','new')],'Create mesh data-blocks for original explicit coordinates and topology.')
bind(['data.from_pydata'],[ref('Mesh','from_pydata')],'Build surfaces from explicit vertex and face arrays with inferred edges and smooth shading, followed by validation.')
bind(['data.validate'],[ref('Mesh','validate')],'Check generated geometry and stop if Blender corrected invalid data.')
bind(['data.materials.append'],[ref('Mesh','materials'),ref('IDMaterials','append')],'Assign original material to each mesh data-block.')
bind(['iris.parent','ring.parent','pupil.parent','obj.parent'],[ref('Object','parent')],'Set object hierarchy; both parent transforms are identity at parenting so coordinate geometry is retained.')
bind(['obj.location=','light.location=','eye.location='],[ref('Object','location')],'Set object location from authored coordinates; this also supports camera and anchor helpers and positions eye pivot centers correctly.')
bind(['obj.rotation_euler=','light.rotation_euler='],[ref('Object','rotation_euler')],'Assign geometric Euler orientation chosen by analytic orbit convention, verified by actual renders.')
bind(['bpy.data.cameras.new'],[ref('BlendData','cameras'),ref('BlendDataCameras','new')],'Create photographic and orthographic review camera data.')
bind(['camera_data.lens='],[ref('Camera','lens')],'Assign perspective focal length in millimeters.')
bind(['scene.camera='],[ref('Scene','camera')],'Select active rendering camera.')
for p in ['frame_start','frame_end']:
    bind(['scene.'+p+'='],[ref('Scene',p)],'Set playback range for an eight-second portrait transition at 30 fps.')
bind(['camera.keyframe_insert'],[ref('bpy_struct','keyframe_insert'),ref('Object','location'),ref('Object','rotation_euler')],'Insert location and rotation values at frames; source creates F-Curves and animation data automatically.')
bind(['camera.animation_data.action.name'],[ref('Object','animation_data'),ref('AnimData','action'),ref('ID','name')],'Name automatically created active action CameraAction.')
bind(['scene.frame_set'],[ref('Scene','frame_set')],'Evaluate all objects at the selected frame.')
bind(['bpy.data.lights.new'],[ref('BlendData','lights'),ref('BlendDataLights','new'),'bpy_types_enum_items/light_type_items.html'],'Create documented directional area sources for the private studio scene.')
bind(['data.energy='],[ref('AreaLight','energy')],'Assign artistic radiant power in watts; final illumination checked in render.')
bind(['data.size='],[ref('AreaLight','size')],'Assign area emitter dimensions; final appearance requires render verification.')
bind(['data.color='],[ref('Light','color')],'Assign studio source color.')
for p in ['fps','engine','resolution_x','resolution_y','resolution_percentage','film_transparent','filepath']:
    bind(['scene.render.'+p+'='],[ref('Scene','render'),ref('RenderSettings',p)],'Assign documented scene rendering property. BLENDER_EEVEE confirmed by actual runtime probe; dimensions chosen for user review.')
for p in ['file_format','color_mode']:
    bind(['scene.render.image_settings.'+p+'='],[ref('Scene','render'),ref('RenderSettings','image_settings'),ref('ImageFormatSettings',p)],'Set documented PNG image format and RGBA channels for transparent review renders.')
bind(['bpy.ops.wm.save_as_mainfile'],['bpy.ops.wm.html#bpy.ops.wm.save_as_mainfile'],'Save original private .blend with compression at the assigned task output path.')
bind(['for obj in export_objects: obj.select_set'],[ref('Object','select_set')],'Select authored avatar, eyes, semantic anchors and camera for export while omitting studio lights.')
bind(['bpy.ops.export_scene.gltf'],['bpy.ops.export_scene.html#bpy.ops.export_scene.gltf'],'Export requested GLB binary using documented format string contract, selected objects, cameras and active actions. Runtime enum is dynamic and empty in RNA; GLB output acceptance must be established by operator result and file validation.')
for p in ['type','ortho_scale']:
    bind(['review_data.'+p+'='],[ref('Camera',p)],'Set documented orthographic review optics for proportion comparisons.')
bind(['bpy.ops.render.render'],['bpy.ops.render.html#bpy.ops.render.render'],'Render selected front/three-quarter/side/back camera views and write to specified output path.')
bind(['bpy.data.images.load'],[ref('BlendData','images'),ref('BlendDataImages','load')],'Load the actual user-reference projection texture image from the local authored texture directory.')
bind(['texture_image.pack()'],[ref('Image','pack')],'Embed source texture pixels in the editable blend file.')
bind(['node=next(n for n in mat.node_tree.nodes'],[ref('Material','node_tree'),ref('NodeTree','nodes'),ref('Node','bl_idname'),'bpy.types.bpy_prop_collection.html'],'Select the actually observed Principled material node.')
bind(['tex=mat.node_tree.nodes.new','uv_node=mat.node_tree.nodes.new'],['bpy.types.Nodes.html',ref('Material','node_tree'),ref('NodeTree','nodes'),ref('ShaderNodeTexImage','ShaderNodeTexImage').replace('.ShaderNodeTexImage.ShaderNodeTexImage','.ShaderNodeTexImage'),ref('ShaderNodeUVMap','ShaderNodeUVMap').replace('.ShaderNodeUVMap.ShaderNodeUVMap','.ShaderNodeUVMap')],'Create source-described image texture sampling and explicit UV-map retrieval nodes.')
bind(['tex.image=','tex.extension='],[ref('ShaderNodeTexImage','image'),ref('ShaderNodeTexImage','extension')],'Assign the loaded image and source-described EXTEND sampling behavior.')
bind(['uv_node.uv_map='],[ref('ShaderNodeUVMap','uv_map')],'Request the explicitly authored ReferenceProjection UV layer.')
bind(['socket_names='],[ref('Node','inputs'),ref('Node','outputs'),ref('NodeSocket','name'),'bpy.types.bpy_prop_collection.html'],'Inspect and record the actual runtime socket names before connecting them.')
bind(['mat.node_tree.links.new'],[ref('Material','node_tree'),ref('NodeTree','links'),'bpy.types.NodeLinks.html',ref('Node','inputs'),ref('Node','outputs')],'Link runtime-checked UV output into texture vector, and runtime-checked texture color into previously probed Principled Base Color input.')
bind(['data.uv_layers.new'],[ref('Mesh','uv_layers'),ref('UVLoopLayers','new')],'Create the named explicit face-corner UV map.')
bind(['enumerate(data.loops)'],[ref('Mesh','loops'),'bpy.types.bpy_prop_collection.html'],'Iterate mesh face corners in aligned loop order.')
bind(['uv_layer.uv[loop_index].vector'],[ref('MeshUVLoopLayer','uv'),ref('Float2AttributeValue','vector'),ref('MeshLoop','vertex_index')],'Assign two-dimensional coordinates to each face corner using its referenced explicit vertex, preserving real geometry.')
(root/'scripts/avatar/operation-bindings.json').write_text(json.dumps(groups,indent=2),encoding='utf8')
