"""Original photo-grounded stylized half-body draft. All geometry is authored here.

Coordinates, facial proportions, folds and hair paths are artistic estimates from
the user's frontal photo. They are not photogrammetric measurements.
"""
import bpy
import math
import random
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'avatar'
IMAGES = ROOT / 'web/public/images/avatar'
MODELS = ROOT / 'web/public/models'
random.seed(4187)
sin, cos, pi, exp, sqrt = math.sin, math.cos, math.pi, math.exp, math.sqrt
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
scene = bpy.context.scene
export_objects = []
mesh_records = []
geometry_parts = []
HEAD_DROP=.15
_head_geometry=True

def object_new(name, data, export=True):
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    if export:
        export_objects.append(obj)
    return obj

def material(name, color, roughness=.5, metallic=0, specular=.3):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = (*color, 1)
    mat.roughness = roughness
    mat.metallic = metallic
    node = next(n for n in mat.node_tree.nodes if n.bl_idname == 'ShaderNodeBsdfPrincipled')
    node.inputs['Base Color'].default_value = (*color,1)
    node.inputs['Roughness'].default_value = roughness
    node.inputs['Metallic'].default_value = metallic
    node.inputs['Specular IOR Level'].default_value = specular
    return mat

skin = material('Skin | warm neutral porcelain', (.60,.367,.255),.67,0,.20)
skin_edge = material('Skin | eyelids and ears',(.57,.315,.225),.68,0,.20)
lip_top = material('Lip | muted rose upper',(.30,.098,.092),.52)
lip_bottom = material('Lip | soft lower vermilion',(.45,.174,.166),.46)
crease = material('Facial creases | warm shadow',(.105,.030,.020),.68)
eye_white = material('Eye | warm sclera',(.59,.555,.51),.34,0,.14)
iris_mat = material('Eye | dark brown iris',(.008,.006,.004),.32,0,.16)
pupil_mat = material('Eye | pupil',(.004,.003,.003),.29,0,.21)
iris_light = material('Eye | iris inner brown',(.018,.011,.008),.34,0,.16)
hair_mats = [material('Hair | dark clump %02d'%i,(.003+i*.0006,.0024+i*.00045,.002+i*.00035),.82+i*.02,0,.09) for i in range(5)]
brow_mat = material('Brow | natural black brown',(.025,.014,.010),.69)
cloth = material('Quarter zip | heather slate',(.150,.161,.170),.90,0,.13)
cloth_dark = material('Quarter zip | seam shadow',(.108,.116,.125),.92)
cloth_light = material('Quarter zip | rib highlights',(.194,.203,.211),.93,0,.08)
metal = material('Zip | brushed silver',(.53,.59,.62),.26,.78)
zip_dark = material('Zip | tape',(.073,.090,.099),.84)
collar_mat=material('Quarter zip | projected folded collar knit',(.15,.16,.17),.92,0,.1)
anatomy_mat=material('Skin | ear and neck side surfaces',(.60,.40,.285),.72,0,.15)

texture_categories={}
runtime_texture_sockets=[]
for category,mats in [
    ('skin',[skin,skin_edge,lip_top,lip_bottom,crease,brow_mat]),
    ('cloth',[cloth,cloth_dark,cloth_light]),('collar',[collar_mat]),
    ('eye',[eye_white,iris_mat,pupil_mat,iris_light]),
]:
    texture_path=OUT/'textures'/('eye-front.jpg' if category=='eye' else 'collar-knit.jpg' if category=='collar' else category+'-projection.jpg')
    texture_image=bpy.data.images.load(str(texture_path),check_existing=True)
    texture_image.pack()
    for mat in mats:
        texture_categories[id(mat)]=category
        node=next(n for n in mat.node_tree.nodes if n.bl_idname=='ShaderNodeBsdfPrincipled')
        tex=mat.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image=texture_image
        tex.extension='EXTEND' if category=='eye' else 'REPEAT'
        uv_node=mat.node_tree.nodes.new('ShaderNodeUVMap')
        uv_node.uv_map='ReferenceProjection'
        socket_names={'texture_inputs':[s.name for s in tex.inputs],'texture_outputs':[s.name for s in tex.outputs],'uv_outputs':[s.name for s in uv_node.outputs]}
        runtime_texture_sockets.append(socket_names)
        assert 'Vector' in socket_names['texture_inputs'] and 'Color' in socket_names['texture_outputs'] and 'UV' in socket_names['uv_outputs']
        mat.node_tree.links.new(tex.inputs['Vector'],uv_node.outputs['UV'])
        mat.node_tree.links.new(node.inputs['Base Color'],tex.outputs['Color'])
(OUT/'evidence/texture-runtime.json').write_text(json.dumps(runtime_texture_sockets,indent=2),encoding='utf8')

def projection_uv(point,category,name):
    x,y,z=point
    if category=='collar': return (x*3.5+.5,(z+y)*6)
    if category=='eye':
        # Mesh data is local to the independently rotating anatomical eye root.
        x+=ex; z+=ez
        knots=[(1.75,570),(1.991,483),(2.133,437),(2.366,351),(2.459,310),(2.60,260),(2.78,164),(3.034,65)]
        yy=351
        for a,b in zip(knots,knots[1:]):
            if a[0]<=z<=b[0]: yy=lerp(a[1],b[1],(z-a[0])/(b[0]-a[0]))
        return ((612+340*x)/1254,1-yy/1254)
    if category=='cloth':
        w,d=body_profile(max(0,min(1.46,z))); c=.07
    elif category=='hair':
        angle=math.atan2(x/.49,(.048-y)/.405)
        return ((angle+pi)/(2*pi),z/3.20)
    else:
        w,d,c=profile(z+.15) if z+.15>=1.75 else (.26,.22,.045)
    angle=math.asin(max(-.99999,min(.99999,x/max(w,.01))))
    if y>c: angle=pi-angle if angle>=0 else -pi-angle
    return ((angle+pi)/(2*pi),z/3.20)

def mesh(name, vertices, faces, mat, export=True):
    if name.startswith(('Brow','Lip |','Mouth |','Nostril','Neck')): return None
    if name.startswith(('Ear','Left ear','Right ear','Neck')): mat=anatomy_mat
    if _head_geometry and not name.startswith('eye') and not name.startswith('Batch'):
        vertices=[(x,y,z-HEAD_DROP) for x,y,z in vertices]
    data = bpy.data.meshes.new(name)
    data.from_pydata(vertices, [], faces, shade_flat=False)
    corrected = data.validate(verbose=True)
    if corrected:
        raise RuntimeError('Invalid generated mesh: '+name)
    data.materials.append(mat)
    if id(mat) in texture_categories:
        category=texture_categories[id(mat)]
        uv_layer=data.uv_layers.new(name='ReferenceProjection')
        loop_index=0
        for texture_face in faces:
            face_uv=[projection_uv(vertices[texture_index],category,name) for texture_index in texture_face]
            crosses_seam=category in ['skin','hair','cloth'] and max(texture_pair[0] for texture_pair in face_uv)-min(texture_pair[0] for texture_pair in face_uv)>.5
            for texture_u,texture_v in face_uv:
                if crosses_seam and texture_u<.5: texture_u+=1
                uv_layer.uv[loop_index].vector=(texture_u,texture_v)
                loop_index+=1
    obj = object_new(name,data,export)
    mesh_records.append({'name':name,'vertices':len(vertices),'faces':len(faces)})
    if export and not name.startswith('eye') and not name.startswith('Batch'):
        geometry_parts.append((obj,vertices,faces,mat))
    return obj

def grid(name, fun, nu, nv, mat, wrap=False):
    v = [fun(i/nu,j/nv) for j in range(nv+1) for i in range(nu if wrap else nu+1)]
    row=nu if wrap else nu+1
    f=[]
    for j in range(nv):
        for i in range(nu):
            a=j*row+i; b=j*row+(i+1)%row
            f.append((a,b,b+row,a+row))
    return mesh(name,v,f,mat)

def lerp(a,b,t): return a*(1-t)+b*t
def mix(a,b,t): return tuple(lerp(x,y,t) for x,y in zip(a,b))
def unit(v):
    length=sqrt(sum(x*x for x in v))
    return tuple(x/max(length,1e-9) for x in v)
def cross(a,b): return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
def add(a,b): return tuple(x+y for x,y in zip(a,b))
def scale(a,k): return tuple(x*k for x in a)
def sub(a,b): return tuple(x-y for x,y in zip(a,b))
def gaussian(x,z,cx,cz,sx,sz): return exp(-((x-cx)/sx)**2-((z-cz)/sz)**2)
def bezier(points,t):
    p=list(points)
    while len(p)>1: p=[mix(p[i],p[i+1],t) for i in range(len(p)-1)]
    return p[0]

def tube(name, points, radii, mat, sides=7, flatten=1):
    verts=[]; faces=[]
    for j,p in enumerate(points):
        tangent=unit(sub(points[min(j+1,len(points)-1)],points[max(0,j-1)]))
        axis=unit(cross(tangent,(0,-1,0)))
        if sum(x*x for x in axis)<.01: axis=unit(cross(tangent,(1,0,0)))
        axis2=unit(cross(tangent,axis))
        r=radii[j] if isinstance(radii,list) else radii
        for i in range(sides):
            a=2*pi*i/sides
            verts.append(add(p,add(scale(axis,r*cos(a)),scale(axis2,r*sin(a)*flatten))))
    for j in range(len(points)-1):
        for i in range(sides):
            a=j*sides+i; b=j*sides+(i+1)%sides
            faces.append((a,b,b+sides,a+sides))
    faces += [tuple(reversed(range(sides))),tuple((len(points)-1)*sides+i for i in range(sides))]
    return mesh(name,verts,faces,mat)

def ellipsoid(name, center, radii, mat, nu=40,nv=24):
    # Non-degenerate poles and explicit closed topology.
    verts=[(center[0],center[1],center[2]+radii[2])]
    for j in range(1,nv):
        p=pi*j/nv
        for i in range(nu):
            a=2*pi*i/nu
            verts.append((center[0]+radii[0]*sin(p)*cos(a),center[1]+radii[1]*sin(p)*sin(a),center[2]+radii[2]*cos(p)))
    verts.append((center[0],center[1],center[2]-radii[2]))
    faces=[]
    for i in range(nu): faces.append((0,1+i,1+(i+1)%nu))
    for j in range(nv-2):
        for i in range(nu):
            a=1+j*nu+i; b=1+j*nu+(i+1)%nu
            faces.append((a,a+nu,b+nu,b))
    bot=len(verts)-1
    for i in range(nu): faces.append((bot,1+(nv-2)*nu+(i+1)%nu,1+(nv-2)*nu+i))
    return mesh(name,verts,faces,mat)

# One uninterrupted cranium/face mesh: jaw, chin, cheek planes, orbital hollows,
# glabella, nasal bridge, nasal tip, alae and philtrum are continuous displacements.
PROFILE=[(1.20,.287,.235,.045),(1.45,.269,.220,.045),(1.68,.253,.205,.045),(1.75,.255,.240,.040),(1.795,.264,.275,.025),(1.86,.295,.300,.020),(1.95,.357,.330,.0),(2.08,.402,.348,.0),(2.23,.438,.354,.0),(2.40,.442,.356,.012),(2.60,.422,.346,.019),(2.78,.365,.313,.035),(2.90,.244,.235,.045),(2.97,.018,.028,.04)]
def profile(z):
    for i,(a,b) in enumerate(zip(PROFILE,PROFILE[1:])):
        if a[0]<=z<=b[0]:
            t=(z-a[0])/(b[0]-a[0]); dz=b[0]-a[0]
            prev=PROFILE[max(0,i-1)]; nxt=PROFILE[min(len(PROFILE)-1,i+2)]
            out=[]
            for k in range(1,4):
                m0=(b[k]-prev[k])/(b[0]-prev[0]); m1=(nxt[k]-a[k])/(nxt[0]-a[0])
                out.append((2*t**3-3*t*t+1)*a[k]+(t**3-2*t*t+t)*m0*dz+(-2*t**3+3*t*t)*b[k]+(t**3-t*t)*m1*dz)
            return tuple(out)
    return PROFILE[0][1:] if z<PROFILE[0][0] else PROFILE[-1][1:]
def face_y(x,z):
    w,d,c=profile(z)
    u=min(.99999,abs(x)/w)
    y=c-d*(1-u*u)**.36
    y-=.047*gaussian(x,z,-.255,2.18,.15,.18)+.047*gaussian(x,z,.255,2.18,.15,.18)
    y+=.016*gaussian(x,z,-.188,2.365,.125,.075)+.016*gaussian(x,z,.188,2.365,.125,.075)
    y-=.025*gaussian(x,z,-.18,2.47,.15,.075)+.025*gaussian(x,z,.18,2.47,.15,.075)
    y-=.059*gaussian(x,z,0,2.30,.069,.19)
    y-=.108*gaussian(x,z,0,2.17,.084,.071)
    y-=.065*gaussian(x,z,-.072,2.133,.052,.042)+.065*gaussian(x,z,.072,2.133,.052,.042)
    y+=.024*gaussian(x,z,0,2.077,.05,.025)
    y-=.020*gaussian(x,z,-.026,2.056,.020,.036)+.020*gaussian(x,z,.026,2.056,.020,.036)
    y-=.034*gaussian(x,z,0,1.998,.15,.052)
    y-=.035*gaussian(x,z,0,1.85,.145,.069)
    return y
def head(u,v):
    z=lerp(1.20,2.97,v); w,d,c=profile(z); a=2*pi*u
    x=w*sin(a)
    y=face_y(x,z) if cos(a)>=0 else c+d*sqrt(max(0,1-(x/w)**2))
    return (x,y,z)
grid('Face | continuous head jaw and neck surface',head,128,144,skin,True)

# Neck grows into the jaw and clavicle, gently wider at its base.
_head_geometry=False
def neck_fun(u,v):
    a=2*pi*u; z=lerp(1.05,1.76+.25*max(-cos(a),0),v)
    r=.251+.045*(1-v)**2
    return (r*sin(a),.045-(.20+.045*(1-v))*cos(a),z)
grid('Neck | tapered anatomical volume',neck_fun,64,28,skin,True)

# Cartilage ear shells: nested helix/antihelix surface, attached to the head sides.
_head_geometry=True
for sign in [-1,1]:
    center=(sign*.404,.005,2.255)
    ellipsoid('Ear | posterior volume '+str(sign),(sign*.462,.003,2.258),(.058,.030,.118),skin_edge,36,24)
    def ear_surface(u,v,s=sign):
        a=2*pi*u; r=v
        x=s*(.438+.092*r*sin(a)+.022*r)
        z=2.258+.142*r*cos(a)
        y=-.008-.038*exp(-((r-.81)/.16)**2)+.030*exp(-(r/.4)**2)
        return (x,y,z)
    grid(('Left' if sign<0 else 'Right')+' ear | cartilage shell',ear_surface,52,16,skin_edge,True)
    pts=[]
    for j in range(35):
        a=lerp(-.9,2.2,j/34)
        pts.append((sign*(.455+.033*sin(a)),-.032,2.26+.088*cos(a)))
    tube('Ear | inner antihelix '+str(sign),pts,.010,skin,8)
    ellipsoid('Ear | tragus '+str(sign),(sign*.438,-.048,2.224),(.018,.022,.030),skin,24,14)

# Almond-shaped eye surfaces contain actual depth; the eyelids match their rim.
for sign in [-1,1]:
    ex=sign*.188; ez=2.366
    ey=face_y(ex,ez)+.065
    def eye_edge(t,upper=True):
        dx=.108*t
        h=(.039 if upper else -.027)*(max(0,1-t*t)**.70)
        z=ez+h+sign*.007*t
        return ex+dx,z
    def eye_surface_y(x,z):
        t=max(-.999,min(.999,(x-ex)/.108))
        top=eye_edge(t,True)[1]; bottom=eye_edge(t,False)[1]
        v=max(0,min(1,(z-bottom)/max(.001,top-bottom)))
        return face_y(x,z)-.0025-.012*(1-t*t)*sin(pi*v)
    def eye_fun(u,v):
        t=lerp(-1,1,u); top=eye_edge(t,True); bot=eye_edge(t,False)
        x=top[0]; z=lerp(bot[1],top[1],v)
        return x-ex,eye_surface_y(x,z)-ey,z-ez
    eye=grid('eye_'+('left' if sign<0 else 'right')+' | curved sclera',eye_fun,52,20,eye_white)
    eye.location=(ex,ey,ez-HEAD_DROP)
    # Closed iris and pupil disks are shallow curved meshes that follow the sclera.
    def iris_disk(name,r,mat,offset):
        def f(u,v):
            dx=lerp(-r*.999,r*.999,u); x=ex+dx
            circle=sqrt(max(0,r*r-dx*dx)); t=dx/.108
            top=min(ez+.003+circle,eye_edge(t,True)[1]-.0003)
            bottom=max(ez+.003-circle,eye_edge(t,False)[1]+.0003)
            z=lerp(bottom,top,v)
            return (x-ex,eye_surface_y(x,z)-offset-ey,z-ez)
        return grid(name,f,42,16,mat,False)
    iris=iris_disk('eye iris '+str(sign),.0405,iris_mat,.0005)
    ring=iris_disk('eye iris inner '+str(sign),.0305,iris_light,.0010)
    pupil=iris_disk('eye pupil '+str(sign),.0230,pupil_mat,.0015)
    iris.parent=eye
    ring.parent=eye
    pupil.parent=eye
    for upper in [True,False]:
        def lid_strip(u,v):
            t=lerp(-.998,.998,u); x,z=eye_edge(t,upper)
            z+=(1 if upper else -1)*.029*(1-t*t)*v
            y=face_y(x,z)-.0015-.003*(1-v)
            return x,y,z
        grid('Eyelid | blended lid plane '+str(sign)+' '+str(upper),lid_strip,48,8,skin)
        points=[]; radii=[]
        for j in range(49):
            t=lerp(-.998,.998,j/48); x,z=eye_edge(t,upper)
            points.append((x,face_y(x,z)-.004,z))
            radii.append((.0034 if upper else .0026)*(.3+.7*(1-t*t)**.5))
        tube('Eyelid '+str(sign)+' '+str(upper),points,radii,skin_edge,7,.70)
    # Upper lash roots are a fine integrated accent, with a separate subtle crease.
    pts=[]
    for j in range(42):
        t=lerp(-.94,.94,j/41); x,z=eye_edge(t,True)
        pts.append((x,face_y(x,z)-.006,z+.0005))
    tube('Upper lash root '+str(sign),pts,.0019,brow_mat,6)
    pts=[]
    for j in range(32):
        t=lerp(-.85,.85,j/31); x,z=eye_edge(t,True); z+=.015*(1-t*t)
        pts.append((x,face_y(x,z)-.003,z))
    tube('Upper eyelid fold '+str(sign),pts,.0017,skin_edge,6)
    # Brows: a tapered silhouette and fine irregular but coherent hairs.
    pts=[]; radii=[]
    for j in range(42):
        t=j/41; x=sign*lerp(.077,.323,t); z=2.459+.026*sin(pi*t*.9)-.017*t
        pts.append((x,face_y(x,z)-.009,z))
        radii.append(.003+.016*sin(pi*t)**.6)
    tube('Brow silhouette '+str(sign),pts,radii,brow_mat,8,.24)
    for k in range(27):
        t=(k+.3)/28; x=sign*lerp(.077,.323,t); z=2.459+.026*sin(pi*t*.9)-.017*t
        pts=[(x,face_y(x,z)-.015,z-.006),(x+sign*.009,face_y(x,z)-.018,z+.010)]
        tube('Brow strand '+str(sign)+' '+str(k),pts,[.0017,.0004],hair_mats[1],5)

# Small underside nostril recesses sit in the integrated nasal alae.
for sign in [-1,1]:
    pts=[]
    for j in range(25):
        a=lerp(.12,pi-.12,j/24); x=sign*.069+.021*cos(a); z=2.116+.006*sin(a)
        pts.append((x,face_y(x,z)-.0015,z))
    tube('Nostril inset '+str(sign),pts,[.002+.003*sin(pi*j/24) for j in range(25)],crease,7,.48)

# Curved, low relief vermilion lips, with a cupid's bow and restrained corners.
def mouth_line(t): return 1.991+.010*t*t+.001*cos(2*pi*t)
for upper in [True,False]:
    def lip_fun(u,v):
        t=lerp(-1,1,u); x=.147*t; seam=mouth_line(t); taper=max(0,1-t*t)
        if upper: border=seam+.021*taper+.007*exp(-((abs(t)-.27)/.16)**2)*taper
        else: border=seam-.030*taper**.75
        z=lerp(seam,border,v)
        return (x,face_y(x,z)-.003-.010*sin(pi*v)*taper,z)
    grid('Lip | '+('upper cupid bow' if upper else 'lower volume'),lip_fun,60,14,lip_top if upper else lip_bottom)
pts=[]
for j in range(61):
    t=lerp(-1,1,j/60); x=.147*t
    z=mouth_line(t); pts.append((x,face_y(x,z)-.006,z))
tube('Mouth | resting central seam',pts,[.0007+.0010*sin(pi*j/60) for j in range(61)],crease,6,.5)

# Garment: substantial half torso, naturally rounded shoulder volume, long sleeves.
_head_geometry=False
BODY=[(0,.91,.35),(.20,.91,.36),(.52,.89,.365),(.80,.85,.36),(1.06,.77,.335),(1.22,.60,.29),(1.37,.35,.245),(1.47,.245,.225)]
def body_profile(z):
    for i,(a,b) in enumerate(zip(BODY,BODY[1:])):
        if a[0]<=z<=b[0]:
            t=(z-a[0])/(b[0]-a[0]); dz=b[0]-a[0]
            prev=BODY[max(0,i-1)]; nxt=BODY[min(len(BODY)-1,i+2)]
            out=[]
            for k in [1,2]:
                m0=(b[k]-prev[k])/(b[0]-prev[0]); m1=(nxt[k]-a[k])/(nxt[0]-a[0])
                out.append((2*t**3-3*t*t+1)*a[k]+(t**3-2*t*t+t)*m0*dz+(-2*t**3+3*t*t)*b[k]+(t**3-t*t)*m1*dz)
            return tuple(out)
    return BODY[0][1:]
def torso(u,v):
    z=1.47*v; w,d=body_profile(z); a=2*pi*u; x=w*sin(a)
    y=.07-d*cos(a)
    fold=.006*sin(24*x+z*3)+.004*sin(48*x-8*z)
    y+=fold*abs(cos(a))*(1-v)
    # Open zipper neckline descends toward the chest in the front center.
    z-=.21*exp(-(x/.17)**2)*max(cos(a),0)**7*v**8
    return x,y,z
grid('Quarter zip | shaped torso knit',torso,96,44,cloth,True)
for sign in [-1,1]:
    def sleeve(u,v,s=sign):
        a=2*pi*u; x=s*(.68+.205*(1-v)); z=.015+1.00*v
        rx=.195*(.75+.25*sin(pi*v)); ry=.265*(.80+.20*sin(pi*v))
        return x+s*rx*cos(a),.055+ry*sin(a),z+.10*cos(a)*v
    # Sleeve volume is integrated in the torso envelope; seam denotes arm boundary.
    pts=[]
    for j in range(42):
        t=j/41; z=.03+t*1.00; x=sign*(.70+.095*(1-t)); w,d=body_profile(z)
        pts.append((x,.07-d*sqrt(max(0,1-(x/w)**2))-.004,z))
    tube('Sleeve | flat seam '+str(sign),pts,.0045,cloth_dark,6)

# Broad folded knit collar: the outer front edge sweeps down toward the zip,
# while the shoulders remain wide and soft instead of forming shirt points.
def collar_pos(a,t):
    opening=lerp(.48,.06,t)
    angle=opening+(2*pi-2*opening)*a
    front=max(0,cos(angle))
    radius=.271+.34*t*front**.30+.020*t
    x=radius*sin(angle)
    y=.055-(.240+.12*t*front**.4)*cos(angle)
    z=lerp(1.532,1.25+.15*(1-front)**2,t)+.020*sin(pi*t)*front
    return x,y,z
grid('Quarter zip | broad folded knit collar',collar_pos,100,24,collar_mat,False)
for t,name in [(0,'inner collar'),(1,'outer collar piping')]:
    pts=[collar_pos(i/90,t) for i in range(91)]
    tube(name,pts,.004,collar_mat,7)
for side in [0,1]:
    pts=[collar_pos(side,j/20) for j in range(21)]
    tube('collar finished front edge '+str(side),pts,.004,collar_mat,7)
for k in range(1,81):
    a=k/81
    pts=[]
    for j in range(25):
        t=j/24
        x,y,z=collar_pos(a+.0008*sin(j*pi+k),t)
        pts.append((x,y-.0015,z+.002))
    tube('Knit | folded collar rib %02d'%k,pts,.0006,collar_mat,4)
# Front zipper tape, teeth and pull tab.
def front_cloth_y(z):
    lo=z; hi=1.47
    for _ in range(25):
        base=(lo+hi)/2
        actual=base-.21*(base/1.47)**8
        if actual<z: lo=base
        else: hi=base
    w,d=body_profile((lo+hi)/2)
    return .07-d
pts=[(0,front_cloth_y(.67+j*.012)-.004,.67+j*.012) for j in range(49)]
tube('Zip | recessed tape',pts,.022,zip_dark,8,.22)
for side in [-1,1]:
    pts=[(side*.011,front_cloth_y(.67+j*.0115)-.008,.67+j*.0115) for j in range(52)]
    tube('Zip | chain '+str(side),pts,.003,metal,6)
for j in range(48):
    z=.69+j*.0115
    tube('Zip tooth %02d'%j,[(-.011,front_cloth_y(z)-.011,z),(.011,front_cloth_y(z+.003)-.011,z+.003)],.0025,metal,5)
tube('Zip | pull tab',[(0,front_cloth_y(1.237)-.016,1.237),(0,front_cloth_y(1.194)-.020,1.194)],.013,metal,8,.34)
# Linked knit loops create restrained grain on the chest, including its upper
# shoulder area. Small alternating stitch offsets avoid long barcode stripes.
for k in range(-45,46):
    base_x=k*.0175
    pts=[]
    for j in range(106):
        z=.022+j*.012
        w,d=body_profile(z)
        x=base_x+.0032*(1 if j%2 else -1)
        if abs(x)<w*.94 and not(abs(x)<.031 and z>.45):
            y=.07-d*sqrt(max(0,1-(x/w)**2))-.002
            y+=(.006*sin(24*x+z*3)+.004*sin(48*x-8*z))*sqrt(max(0,1-(x/w)**2))*(1-z/1.47)
            pts.append((x,y,z))
    if len(pts)>2: tube('Knit | linked stitch column %02d'%k,pts,.0008,cloth_light if k%3 else cloth_dark,4)

# Original asymmetrical cap, broad layers and uneven swept fringe.
_head_geometry=True
def hairline(a):
    front=max(0,cos(a))
    return 1.90+.39*sin(a)**2+.71*front**2+.022*sin(a*3)+.010*sin(a*9+.3)
def hair_point(a,t):
    z=lerp(hairline(a),3.034,t)
    q=(z-2.36)/.675
    horizontal=sqrt(max(.0001,1-q*q))
    volume=.014*sin(5*a+.7)*sin(pi*t)+.007*sin(11*a)*sin(pi*t)
    x=(.51+volume)*horizontal*sin(a)+.010*sin(pi*t)
    y=.018-(.490+volume)*horizontal*cos(a)
    return x,y,z
grid('Hair | full sculpted undercut cap',lambda u,v:hair_point(2*pi*u,v),96,38,hair_mats[0],True)
for k in range(18):
    a=2*pi*(k+.17*sin(k*2.31))/18
    a0=a+.38*sin(a)+.17
    pts=[]; radii=[]
    for j in range(23):
        t=j/22; aa=lerp(a0,a,t)
        p=hair_point(aa,lerp(.91-.08*(k%3),.018+.07*(k%4)/4,t))
        lift=(.014+.006*(k%3))*sin(pi*t)
        p=(p[0]+lift*sin(aa),p[1]-lift*cos(aa),p[2]+.01*sin(pi*t))
        pts.append(p)
        radii.append(.001+(.040+.007*(k%4))*sin(pi*t)**.65)
    tube('Hair | varied crown layer %02d'%k,pts,radii,hair_mats[k%3],9,.36)

# Short overlapping strands vary their origins and sweep along the scalp.
# The supplied profile/back references inform the crown volume and nape taper.
for k in range(180):
    a=2*pi*random.random()
    top=.30+.64*random.random()
    bottom=max(.003,top-.28-.24*random.random())
    a0=a+.19+.26*sin(a)+.09*sin(k)
    pts=[]
    for j in range(15):
        t=j/14; aa=lerp(a0,a,t)+.018*sin(pi*t+k)
        p=hair_point(aa,lerp(top,bottom,t))
        lift=.021+.014*sin(pi*t)
        pts.append((p[0]+lift*sin(aa),p[1]-lift*cos(aa),p[2]+.004*sin(pi*t)))
    widths=[.0002+(.0015+.0012*(k%3)/2)*sin(pi*j/14)**.6 for j in range(15)]
    tube('Hair | overlapping fine strand %03d'%k,pts,widths,hair_mats[k%5],4,.65)

fringe_paths=[
    ([(-.07,-.12,2.98),(-.29,-.26,2.94),(-.44,-.33,2.67),(-.435,-.23,2.39)],.065),
    ([(.01,-.18,3.01),(-.18,-.35,2.99),(-.40,-.40,2.73),(-.365,-.325,2.50)],.073),
    ([(.04,-.18,2.99),(-.14,-.39,2.96),(-.33,-.44,2.68),(-.33,-.36,2.52)],.060),
    ([(.02,-.20,2.98),(-.12,-.42,2.94),(-.23,-.45,2.66),(-.19,-.385,2.47)],.058),
    ([(-.01,-.26,2.94),(-.10,-.43,2.82),(-.10,-.44,2.61),(-.075,-.36,2.49)],.046),
    ([(.08,-.10,3.005),(.23,-.23,2.97),(.47,-.31,2.73),(.435,-.20,2.40)],.071),
    ([(.09,-.17,2.99),(.31,-.32,2.95),(.40,-.42,2.73),(.35,-.30,2.55)],.071),
    ([(.08,-.18,2.96),(.16,-.41,2.86),(.06,-.44,2.66),(.16,-.385,2.52)],.058),
    ([(.10,-.22,2.95),(.32,-.39,2.87),(.30,-.44,2.63),(.34,-.34,2.54)],.060),
    ([(.025,-.27,2.94),(.035,-.43,2.84),(-.018,-.425,2.63),(.053,-.376,2.58)],.038),
    ([(-.10,-.23,2.955),(-.29,-.38,2.84),(-.25,-.454,2.65),(-.29,-.39,2.55)],.050),
    ([(.15,-.22,2.96),(.22,-.42,2.86),(.185,-.466,2.65),(.265,-.40,2.51)],.047),
]
for k,(path,width) in enumerate(fringe_paths):
    pts=[bezier(path,j/34) for j in range(35)]
    widths=[.0005+width*sin(pi*j/34)**.66*(1-.27*j/34) for j in range(35)]
    tube('Hair | irregular fringe layer %02d'%k,pts,widths,hair_mats[(k+1)%4],10,.17)
    if k%2==0:
        strand=[(p[0]+.17*widths[j],p[1]-.012*sin(pi*j/34),p[2]+.003) for j,p in enumerate(pts)]
        tube('Hair | restrained fringe strand %02d'%k,strand,[.0002+.0008*sin(pi*j/34) for j in range(35)],hair_mats[(k+2)%5],4)
    for s in range(7):
        shift=(s-3)/3.3
        strand=[]
        for j,p in enumerate(pts):
            t=j/34
            strand.append((p[0]+shift*widths[j]+.002*sin(pi*t*2+k+s),p[1]-.40*widths[j]*sqrt(max(0,1-shift*shift))-.002,p[2]+.003*sin(pi*t)))
        tube('Hair | layered fringe fiber %02d %02d'%(k,s),strand,[.0002+.0009*sin(pi*j/34) for j in range(35)],hair_mats[(k+s)%5],4)
for k,path in enumerate([
    [(-.14,-.02,3.01),(-.20,-.12,3.10),(-.33,-.16,3.055),(-.35,-.15,3.015)],
    [(.035,.005,3.018),(.02,-.01,3.08),(.07,-.045,3.11),(.115,-.075,3.065)],
    [(.22,-.14,2.95),(.31,-.23,3.015),(.41,-.19,2.97),(.45,-.12,2.89)],
    [(-.075,-.29,2.925),(-.14,-.44,2.79),(-.015,-.47,2.53),(-.045,-.38,2.47)],
]):
    if k<3: continue
    pts=[bezier(path,j/26) for j in range(27)]
    tube('Hair | loose silhouette strand %02d'%k,pts,[.0003+.0023*sin(pi*j/26) for j in range(27)],hair_mats[1],5)

_head_geometry=False
avatar_root=object_new('AvatarRoot | original Sun Yingjie draft',None)
for obj in export_objects[:-1]:
    if obj.parent is None:
        obj.parent=avatar_root
for name,position in [('focus-start',(0,-.15,2.27)),('focus-1',(0,-.1,2.20)),('focus-2',(.10,0,1.65)),('focus-3',(-.5,0,1.6)),('focus-works',(-1.0,0,1.15))]:
    obj=object_new(name,None)
    obj.location=position

def camera_pose(obj,azimuth,distance,target_z,elevation=.12):
    a=math.radians(azimuth)
    obj.location=(distance*sin(a),-distance*cos(a),target_z+elevation)
    obj.rotation_euler=(pi/2-math.atan2(elevation,distance),0,a)

camera_data=bpy.data.cameras.new('Portrait camera optics')
camera_data.lens=63
camera=object_new('Camera',camera_data)
scene.camera=camera
scene.frame_start=1
scene.frame_end=240
scene.render.fps=30
for frame,azimuth,distance,target_z in [(1,-6,5.9,1.82),(70,0,5.7,1.79),(145,10,6.0,1.64),(205,-13,6.4,1.53),(240,-18,6.65,1.51)]:
    camera_pose(camera,azimuth,distance,target_z)
    camera.keyframe_insert(data_path='location',frame=frame)
    camera.keyframe_insert(data_path='rotation_euler',frame=frame)
camera.animation_data.action.name='CameraAction'
scene.frame_set(70)

# Studio lights are kept in the private .blend and omitted from selected GLB export.
for name,position,power,size,color in [('Key',(-3.8,-4.7,5.7),420,4.0,(1.0,.90,.81)),('Fill',(3.2,-3.0,3.4),230,3.1,(.78,.88,1.0)),('Rim',(1.1,2.5,4.8),320,3.0,(.85,.91,1.0)),('Lower bounce',(0,-4,1.1),45,2.5,(1,.91,.85))]:
    data=bpy.data.lights.new(name,'AREA')
    data.energy=power
    data.size=size
    data.color=color
    light=object_new(name,data,False)
    x,y,z=position
    a=math.atan2(x,-y); d=math.hypot(x,y)
    light.location=position
    light.rotation_euler=(pi/2-math.atan2(z-1.8,d),0,a)

scene.render.engine='BLENDER_EEVEE'
scene.render.resolution_x=1200
scene.render.resolution_y=1200
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGBA'
scene.render.film_transparent=True
OUT.mkdir(parents=True,exist_ok=True)
IMAGES.mkdir(parents=True,exist_ok=True)
MODELS.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'sun-yingjie-avatar-draft-v2.blend'),compress=True)
authored_records=list(mesh_records)
# Web export consolidates numerical mesh arrays by material, retaining all eyes
# as independent nodes. Private .blend above retains editable individual parts.
batches={}
for obj,vertices,faces,mat in geometry_parts:
    batch=batches.setdefault(id(mat),{'mat':mat,'v':[],'f':[]})
    offset=len(batch['v'])
    combined_vertices=batch['v']
    combined_faces=batch['f']
    combined_vertices += vertices
    combined_faces += [tuple(i+offset for i in face) for face in faces]
    export_objects.remove(obj)
    bpy.data.objects.remove(obj,do_unlink=True)
for index,batch in enumerate(batches.values()):
    obj=mesh('Batch | surface %02d'%index,batch['v'],batch['f'],batch['mat'])
    obj.parent=avatar_root
for obj in list(bpy.data.objects): obj.select_set(False)
for obj in export_objects: obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(MODELS/'avatar.glb'),export_format='GLB',use_selection=True,export_cameras=True,export_animations=True,export_animation_mode='ACTIONS',export_frame_range=True,export_yup=True,export_copyright='Original geometry authored for Sun Yingjie portfolio; likeness subject to user review.')
review_data=bpy.data.cameras.new('Review optics')
review_data.type='ORTHO'
review_data.ortho_scale=3.5
review=object_new('Review camera',review_data,False)
scene.camera=review
views=[('front',0),('three-quarter',35),('side',90),('back',180)]
if '--front-only' in sys.argv: views=views[:1]
if '--turntable' in sys.argv:
    views += [('turntable-%02d'%i,30*i) for i in range(12)]
for name,angle in views:
    camera_pose(review,angle,6.0,1.55,.08)
    scene.render.filepath=str(IMAGES/(name+'.png'))
    bpy.ops.render.render(write_still=True)
scene.camera=camera
metrics={'draft':True,'source_photo':'作品集/照片1.jpg','geometry_source':'original parameterized surface meshes; no third-party personal assets','authored_mesh_count':len(authored_records),'authored_vertex_count':sum(m['vertices'] for m in authored_records),'mesh_records':authored_records,'glb_bytes':(MODELS/'avatar.glb').stat().st_size,'views':[v[0] for v in views],'animation':'CameraAction','frames':[1,240],'fps':30}
(OUT/'build-report.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2),encoding='utf8')
print('AVATAR_BUILD_REPORT='+json.dumps({k:v for k,v in metrics.items() if k!='mesh_records'},ensure_ascii=False))
