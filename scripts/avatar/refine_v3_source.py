"""Numerical refinement of original v2 generator. No external mesh is used."""
from pathlib import Path
root=Path(__file__).resolve().parents[2]
p=root/'scripts/avatar/build_avatar_v3.py'
s=(root/'scripts/avatar/build_avatar.py').read_text(encoding='utf8')
s=s.replace("random.seed(4187)","random.seed(4187)\nPREVIEW='--preview' in sys.argv\nif PREVIEW: IMAGES=OUT/'preview-v3'\n")
s=s.replace("(.003+i*.0006,.0024+i*.00045,.002+i*.00035),.82+i*.02,0,.09", "(.012+i*.0020,.0085+i*.0014,.0065+i*.0011),.54+i*.035,0,.27")
s=s.replace("(.60,.40,.285),.72,0,.15", "(.62,.415,.305),.72,0,.15")
# Retain original UV authoring coordinates while widening the shoulders.
s=s.replace("data = bpy.data.meshes.new(name)","if not _head_geometry and not name.startswith(('eye','Batch')):\n        vertices=[(x*1.23,y*1.10,z) for x,y,z in vertices]\n    data = bpy.data.meshes.new(name)")
s=s.replace("x,y,z=point\n    if category", "x,y,z=point\n    if category=='cloth': x/=1.23; y/=1.10\n    if category")
s=s.replace("PROFILE=[(1.20,.287,.235,.045),(1.45,.269,.220,.045),(1.68,.253,.205,.045),(1.75,.255,.240,.040),(1.795,.264,.275,.025),(1.86,.295,.300,.020),(1.95,.357,.330,.0)","PROFILE=[(1.20,.325,.235,.060),(1.45,.304,.220,.065),(1.68,.287,.205,.060),(1.75,.275,.225,.050),(1.795,.275,.260,.035),(1.86,.306,.300,.020),(1.95,.366,.330,.0)")
s=s.replace("y-=.035*gaussian(x,z,0,1.85,.145,.069)","y-=.049*gaussian(x,z,0,1.85,.160,.083)")
s=s.replace("(.039 if upper else -.027)","(.045 if upper else -.032)")
# The ear projects sideways but is tilted so its cartilage has a visible side profile.
s=s.replace("vertices=[(x,y,z-HEAD_DROP) for x,y,z in vertices]", "vertices=[(x,y,z-HEAD_DROP) for x,y,z in vertices]\n    if name.startswith(('Ear','Left ear','Right ear')):\n        vertices=[(x,y-.35*(abs(x)-.438),z) for x,y,z in vertices]")
start=s.index('def collar_pos(a,t):')
end=s.index("grid('Quarter zip | broad folded knit collar'",start)
s=s[:start]+'''def collar_pos(a,t):
    # The spread collar is broad at the shoulders and joined at the zipper apex.
    opening=lerp(.84,.055,t)
    angle=opening+(2*pi-2*opening)*a
    front=max(0,cos(angle))
    side=abs(sin(angle))
    radius=.278+.29*t*(.33+.67*side)
    x=radius*sin(angle)
    y=.06-(.245+.065*t)*cos(angle)
    inner=1.50-.065*front
    outer=1.25+.105*side+.095*max(0,-cos(angle))
    z=lerp(inner,outer,t)+.013*sin(pi*t)
    return x,y,z
''' + s[end:]
# Rebuild crown and fringe from tapered small solid tubes with a short nape.
start=s.index('# Original asymmetrical cap')
end=s.index('_head_geometry=False\navatar_root',start)
hair='''# Original short, soft layered haircut. Every strand is volumetric mesh.
_head_geometry=True
def hairline(a):
    front=max(0,cos(a))
    rear=max(0,-cos(a))
    return 2.17+.21*sin(a)**2+.48*front**3-.045*rear+.009*sin(13*a)
def hair_point(a,t):
    z=lerp(hairline(a),3.055,t)
    q=(z-2.37)/.685
    horizontal=sqrt(max(.0001,1-q*q))
    volume=(.012*sin(5*a+.7)+.006*sin(11*a))*sin(pi*t)
    x=(.495+volume)*horizontal*sin(a)+.007*sin(pi*t)
    y=.025-(.405+volume)*horizontal*cos(a)
    return x,y,z
grid('Hair | close fitted scalp volume',lambda u,v:hair_point(2*pi*u,v),96,44,hair_mats[0],True)
# Dense but light layered locks replace the twelve broad leaf-shaped pieces.
for k in range(780):
    a=2*pi*random.random()
    top=.12+.85*random.random()
    bottom=max(.003,top-.16-.28*random.random())
    a0=a+.11+.29*sin(a)+.11*sin(k)
    pts=[]
    for j in range(13):
        t=j/12; aa=lerp(a0,a,t)+.024*sin(pi*t+k)
        p=hair_point(aa,lerp(top,bottom,t))
        lift=.012+(.016+.010*(k%3))*sin(pi*t)
        pts.append((p[0]+lift*sin(aa),p[1]-lift*cos(aa),p[2]+.007*sin(pi*t)))
    r=.0025+.003*(k%5)/4
    widths=[.00015+r*sin(pi*j/12)**.65 for j in range(13)]
    tube('Hair | soft layered lock %04d'%k,pts,widths,hair_mats[k%5],5,.58)
# Irregular off-centre curtain fringe, each lock has a distinct tip and sweep.
for k in range(100):
    t=(k+.3)/100
    side=-1 if t<.52 else 1
    u=t/.52 if side<0 else (t-.52)/.48
    endx=lerp(-.455,.045,u) if side<0 else lerp(.065,.455,u)
    endz=2.47+.09*abs(endx)/.455+.032*sin(k*2.4)
    rootx=lerp(-.10,.07,u) if side<0 else lerp(.04,.18,u)
    rootz=3.015+.025*sin(k*1.71)
    endy=-.382+.17*(abs(endx)/.455)**2
    path=[(rootx,-.08-.06*random.random(),rootz),
          (rootx+side*.11,-.31,3.02),
          (endx-side*.03,-.46+.06*abs(endx),2.71),
          (endx,endy,endz)]
    pts=[bezier(path,j/20) for j in range(21)]
    r=.0045+.004*(k%7)/6
    widths=[.00012+r*sin(pi*j/20)**.6 for j in range(21)]
    tube('Hair | wispy swept fringe %03d'%k,pts,widths,hair_mats[k%5],5,.65)
    for q in range(3):
        shift=(q-1)*.75
        strand=[(p[0]+shift*widths[j],p[1]-.006*sin(pi*j/20),p[2]+.003*sin(pi*j/20)) for j,p in enumerate(pts)]
        tube('Hair | fringe fiber %03d %d'%(k,q),strand,[.00010+.0009*sin(pi*j/20) for j in range(21)],hair_mats[(k+q)%5],4)
# Restrained flyaways break the crown silhouette without forming closed loops.
for k in range(58):
    a=2*pi*random.random(); start=.65+.24*random.random(); end=max(.3,start-.2)
    pts=[]
    for j in range(14):
        t=j/13; aa=a+.26*t
        p=hair_point(aa,lerp(start,end,t)); lift=.02+.055*sin(pi*t)
        pts.append((p[0]+lift*sin(aa),p[1]-lift*cos(aa),p[2]+.014*sin(pi*t)))
    tube('Hair | crown flyaway %03d'%k,pts,[.0001+.0010*sin(pi*j/13) for j in range(14)],hair_mats[k%5],4)

'''
s=s[:start]+hair+s[end:]
s=s.replace("('focus-3',(-.5,0,1.6)),('focus-works',(-1.0,0,1.15))", "('focus-3',(.08,0,1.85)),('focus-4',(-.05,0,1.90)),('focus-5',(0,0,1.70)),('focus-works',(-.65,0,1.35))")
s=s.replace('scene.frame_start=1\nscene.frame_end=240\nscene.render.fps=30', 'scene.frame_start=0\nscene.frame_end=350\nscene.render.fps=24')
s=s.replace("[(1,-6,5.9,1.82),(70,0,5.7,1.79),(145,10,6.0,1.64),(205,-13,6.4,1.53),(240,-18,6.65,1.51)]", "[(0,-5,6.8,1.65),(50,-9,6.3,1.85),(100,10,6.05,1.83),(150,19,6.3,1.70),(200,-13,6.5,1.69),(250,-20,6.7,1.61),(300,-27,7.25,1.48),(350,-34,8.05,1.37)]")
s=s.replace("scene.render.resolution_x=1200", "scene.render.resolution_x=540 if PREVIEW else 1080")
s=s.replace("scene.render.resolution_y=1200", "scene.render.resolution_y=540 if PREVIEW else 1080")
s=s.replace("'sun-yingjie-avatar-draft-v2.blend'", "'sun-yingjie-avatar-draft-v3.blend'")
s=s.replace("review_data.ortho_scale=3.5", "review_data.ortho_scale=3.4")
s=s.replace("if '--front-only' in sys.argv: views=views[:1]", "if '--front-only' in sys.argv: views=views[:1]\nif PREVIEW: views=[('front',0),('side',90)]")
s=s.replace("[('turntable-%02d'%i,30*i) for i in range(12)]", "[('turntable-%02d'%i,15*i) for i in range(24)]")
s=s.replace("'frames':[1,240],'fps':30", "'frames':[0,350],'fps':24")
s=s.replace("(OUT/'build-report.json')", "(OUT/'build-report-v3.json')")
s=s.replace("(OUT/'evidence/texture-runtime.json')", "(OUT/'evidence/texture-runtime-v3.json')")
p.write_text(s,encoding='utf8')
print('Created original v3 source')
