"""Independent GLB container, mesh geometry, hierarchy and animation checks."""
import json
import math
import struct
import hashlib
from collections import Counter
from pathlib import Path
root=Path(__file__).resolve().parents[2]
path=root/'web/public/models/avatar.glb'
raw=path.read_bytes()
magic,version,length=struct.unpack_from('<4sII',raw)
assert magic==b'glTF' and version==2 and length==len(raw)
offset=12; chunks={}
while offset<len(raw):
    n,kind=struct.unpack_from('<II',raw,offset); offset+=8
    chunks[kind]=raw[offset:offset+n]; offset+=n
doc=json.loads(chunks[0x4E4F534A]); binary=chunks[0x004E4942]
assert doc['buffers'][0]['byteLength']<=len(binary)
for view in doc['bufferViews']:
    assert view.get('byteOffset',0)+view['byteLength']<=len(binary)
def values(accessor_index):
    a=doc['accessors'][accessor_index]; v=doc['bufferViews'][a['bufferView']]
    width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']]
    code,size={5120:('b',1),5121:('B',1),5122:('h',2),5123:('H',2),5125:('I',4),5126:('f',4)}[a['componentType']]
    stride=v.get('byteStride',width*size)
    start=v.get('byteOffset',0)+a.get('byteOffset',0)
    out=[]
    for i in range(a['count']):
        p=struct.unpack_from('<'+code*width,binary,start+i*stride)
        assert all(math.isfinite(x) for x in p)
        out.append(p)
    return out
triangle_count=0; vertex_count=0; spans=[]
textured_primitives=0
for mesh in doc['meshes']:
    for primitive in mesh['primitives']:
        p=values(primitive['attributes']['POSITION'])
        for attribute_accessor in primitive['attributes'].values():
            values(attribute_accessor)
        indices=values(primitive['indices'])
        assert primitive.get('mode',4)==4 and len(indices)%3==0
        assert all(0<=i[0]<len(p) for i in indices)
        vertex_count+=len(p); triangle_count+=len(indices)//3
        spans.append([max(t[k] for t in p)-min(t[k] for t in p) for k in range(3)])
        material=doc['materials'][primitive['material']]
        if 'baseColorTexture' in material.get('pbrMetallicRoughness',{}):
            assert 'TEXCOORD_0' in primitive['attributes']
            coordinates=values(primitive['attributes']['TEXCOORD_0'])
            assert len(coordinates)==len(p)
            textured_primitives+=1
assert textured_primitives>=4
assert len(doc.get('images',[]))==5
for embedded_image in doc['images']:
    assert 'bufferView' in embedded_image and 'uri' not in embedded_image
    assert embedded_image['mimeType'] in ['image/jpeg','image/png']
assert max(s[2] for s in spans)>.5, 'Actual front/back depth is required'
names=[n.get('name','') for n in doc['nodes']]
for anchor in ['focus-start','focus-1','focus-2','focus-3','focus-4','focus-5','focus-works']:
    assert anchor in names
eye_nodes=[n for n in names if n.startswith('eye')]
assert any('left' in n for n in eye_nodes) and any('right' in n for n in eye_nodes)
# Check exact left/right roots, child iris/pupil/globe ownership and finite transforms.
eye_roots=['eye_left | curved sclera','eye_right | curved sclera']
closed_eye_reports=[]
for root_name in eye_roots:
    index=names.index(root_name)
    children=doc['nodes'][index].get('children',[])
    child_names=[names[i] for i in children]
    assert any(n.startswith('eye iris ') for n in child_names)
    assert any(n.startswith('eye pupil ') for n in child_names)
    assert any(n.startswith('eye ocular volume ') for n in child_names)
    assert 'mesh' in doc['nodes'][index]
    ocular_index=next(i for i in children if names[i].startswith('eye ocular volume '))
    primitive=doc['meshes'][doc['nodes'][ocular_index]['mesh']]['primitives'][0]
    xyz=values(primitive['attributes']['POSITION'])
    tri=[i[0] for i in values(primitive['indices'])]
    canonical={}; remap=[]
    for point in xyz:
        key=tuple(round(v,6) for v in point)
        remap.append(canonical.setdefault(key,len(canonical)))
    edges=Counter()
    for i in range(0,len(tri),3):
        a,b,c=[remap[j] for j in tri[i:i+3]]
        for u,v in [(a,b),(b,c),(c,a)]: edges[tuple(sorted((u,v)))]+=1
    assert all(count==2 for count in edges.values()), 'Ocular volume must be closed'
    assert all(max(p[k] for p in xyz)-min(p[k] for p in xyz)>.05 for k in range(3))
    closed_eye_reports.append({'root':root_name,'volume_node':names[ocular_index],'closed_surface':True})
for node in doc['nodes']:
    for key in ['translation','rotation','scale','matrix']:
        assert all(math.isfinite(v) for v in node.get(key,[]))
def finite_json(item):
    if isinstance(item,float): assert math.isfinite(item)
    elif isinstance(item,list):
        for value in item: finite_json(value)
    elif isinstance(item,dict):
        for value in item.values(): finite_json(value)
finite_json(doc.get('materials',[]))
animations=[]
for animation in doc['animations']:
    ends=[]
    for sampler in animation['samplers']:
        times=[p[0] for p in values(sampler['input'])]
        assert times==sorted(times) and len(times)>1
        values(sampler['output'])
        ends.append(times[-1])
    animations.append({'name':animation['name'],'duration_seconds':max(ends),'channel_count':len(animation['channels'])})
    assert all(names[c['target']['node']]=='Camera' for c in animation['channels'])
    assert {c['target']['path'] for c in animation['channels']}=={'translation','rotation'}
assert any(a['name']=='CameraAction' and abs(a['duration_seconds']-350/24)<0.001 for a in animations)
assert len(raw)<12*1024*1024
report={'passed':True,'file_bytes':len(raw),'file_mib':round(len(raw)/1024/1024,3),'mesh_count':len(doc['meshes']),'material_count':len(doc['materials']),'node_count':len(doc['nodes']),'exported_vertex_count':vertex_count,'triangle_count':triangle_count,'embedded_reference_textures':len(doc['images']),'textured_primitives':textured_primitives,'independent_eye_nodes':eye_nodes,'animations':animations,'max_mesh_axis_spans':list(map(max,zip(*spans))),'checks':['GLB header and binary bounds','Finite mesh and UV coordinates','Triangle indices in range','Non-flat three-axis geometry','Exact eye roots with parented iris, pupil and closed ocular volume','Semantic anchors','Animation times and outputs','Embedded source-derived surface textures','Below 12 MiB']}
report.update({'sha256':hashlib.sha256(raw).hexdigest(),'closed_ocular_volumes':closed_eye_reports,'narrative_anchors':{'focus-1':'Education','focus-2':'Ouyin','focus-3':'BENWU','focus-4':'Liling','focus-5':'AI practice'},'timeline':{'fps':24,'total_frame_intervals':350,'narrative_node_frames':[50,100,150,200,250],'works_entrance':[250,300],'works_tail':[300,350]}})
(root/'avatar/evidence/glb-validation-v3.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report,indent=2))
