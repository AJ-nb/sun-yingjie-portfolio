from pathlib import Path
import json
root=Path(__file__).resolve().parents[2]
p=root/'scripts/avatar'
s=(p/'validate_glb.py').read_text(encoding='utf8')
s=s.replace("'focus-3','focus-works'", "'focus-3','focus-4','focus-5','focus-works'")
s=s.replace("a['duration_seconds']>7", "abs(a['duration_seconds']-350/24)<0.001")
s=s.replace('8*1024*1024','12*1024*1024').replace('Below 8 MiB','Below 12 MiB')
s=s.replace('glb-validation.json','glb-validation-v3.json')
s=s.replace("animations=[]",'''# Check exact left/right roots, child iris/pupil/globe ownership and finite transforms.
eye_roots=['eye_left | curved sclera','eye_right | curved sclera']
for root_name in eye_roots:
    index=names.index(root_name)
    children=doc['nodes'][index].get('children',[])
    child_names=[names[i] for i in children]
    assert any(n.startswith('eye iris ') for n in child_names)
    assert any(n.startswith('eye pupil ') for n in child_names)
    assert any(n.startswith('eye ocular volume ') for n in child_names)
    assert 'mesh' in doc['nodes'][index]
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
animations=[]''')
s=s.replace("'Independent eyes'", "'Exact eye roots with parented iris, pupil and closed ocular volume'")
(p/'validate_glb_v3.py').write_text(s,encoding='utf8')
s=(p/'verify_saved.py').read_text(encoding='utf8')
s=s.replace("'focus-3','focus-works'", "'focus-3','focus-4','focus-5','focus-works'")
s=s.replace('[1,70,145,205,240]', '[0,50,100,150,200,250,300,350]')
s=s.replace('reopen-report.json','reopen-report-v3.json')
(p/'verify_saved_v3.py').write_text(s,encoding='utf8')
plan=json.loads((root/'avatar/evidence/verify-plan.json').read_text(encoding='utf8'))
(root/'avatar/evidence/verify-plan-v3.json').write_text(json.dumps(plan,indent=2),encoding='utf8')
