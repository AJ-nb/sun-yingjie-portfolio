"""Independent GLB container, mesh geometry, hierarchy and animation checks."""
import json
import math
import struct
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
assert len(doc.get('images',[]))==4
for embedded_image in doc['images']:
    assert 'bufferView' in embedded_image and 'uri' not in embedded_image
    assert embedded_image['mimeType'] in ['image/jpeg','image/png']
assert max(s[2] for s in spans)>.5, 'Actual front/back depth is required'
names=[n.get('name','') for n in doc['nodes']]
for anchor in ['focus-start','focus-1','focus-2','focus-3','focus-works']:
    assert anchor in names
eye_nodes=[n for n in names if n.startswith('eye')]
assert any('left' in n for n in eye_nodes) and any('right' in n for n in eye_nodes)
animations=[]
for animation in doc['animations']:
    ends=[]
    for sampler in animation['samplers']:
        times=[p[0] for p in values(sampler['input'])]
        assert times==sorted(times) and len(times)>1
        values(sampler['output'])
        ends.append(times[-1])
    animations.append({'name':animation['name'],'duration_seconds':max(ends),'channel_count':len(animation['channels'])})
assert any(a['name']=='CameraAction' and a['duration_seconds']>7 for a in animations)
assert len(raw)<8*1024*1024
report={'passed':True,'file_bytes':len(raw),'file_mib':round(len(raw)/1024/1024,3),'mesh_count':len(doc['meshes']),'material_count':len(doc['materials']),'node_count':len(doc['nodes']),'exported_vertex_count':vertex_count,'triangle_count':triangle_count,'embedded_reference_textures':len(doc['images']),'textured_primitives':textured_primitives,'independent_eye_nodes':eye_nodes,'animations':animations,'max_mesh_axis_spans':list(map(max,zip(*spans))),'checks':['GLB header and binary bounds','Finite mesh and UV coordinates','Triangle indices in range','Non-flat three-axis geometry','Independent eyes','Semantic anchors','Animation times and outputs','Embedded source-derived surface textures','Below 8 MiB']}
(root/'avatar/evidence/glb-validation.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report,indent=2))
