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

skin = material('Skin | warm neutral porcelain', (.60,.367,.255),.52)
skin_edge = material('Skin | eyelids and ears',(.57,.315,.225),.55)
lip_top = material('Lip | muted rose upper',(.30,.098,.092),.52)
lip_bottom = material('Lip | soft lower vermilion',(.45,.174,.166),.46)
crease = material('Facial creases | warm shadow',(.105,.030,.020),.68)
eye_white = material('Eye | warm sclera',(.80,.76,.70),.24)
iris_mat = material('Eye | dark brown iris',(.008,.006,.004),.24)
pupil_mat = material('Eye | pupil',(.004,.003,.003),.17)
iris_light = material('Eye | iris inner brown',(.022,.013,.010),.29)
hair_mats = [material('Hair | dark clump %02d'%i,(.007+i*.0017,.005+i*.0012,.004+i*.001),.69+i*.025,0,.13) for i in range(5)]
brow_mat = material('Brow | natural black brown',(.025,.014,.010),.69)
cloth = material('Quarter zip | heather slate',(.19,.235,.26),.88)
cloth_dark = material('Quarter zip | seam shadow',(.105,.14,.16),.92)
cloth_light = material('Quarter zip | rib highlights',(.245,.28,.292),.9)
metal = material('Zip | brushed silver',(.53,.59,.62),.26,.78)
zip_dark = material('Zip | tape',(.073,.090,.099),.84)

def mesh(name, vertices, faces, mat, export=True):
    data = bpy.data.meshes.new(name)
    data.from_pydata(vertices, [], faces, shade_flat=False)
    corrected = data.validate(verbose=True)
    if corrected:
        raise RuntimeError('Invalid generated mesh: '+name)
    data.materials.append(mat)
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
PROFILE=[(1.75,.035,.14,.04),(1.795,.155,.24,.02),(1.86,.255,.29,.012),(1.95,.322,.328,.0),(2.08,.365,.35,.0),(2.23,.396,.361,.0),(2.40,.408,.36,.012),(2.60,.397,.348,.019),(2.78,.348,.313,.035),(2.90,.23,.235,.045),(2.97,.018,.028,.04)]
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
    y-=.038*gaussian(x,z,-.23,2.20,.13,.17)+.038*gaussian(x,z,.23,2.20,.13,.17)
    y+=.027*gaussian(x,z,-.18,2.365,.12,.078)+.027*gaussian(x,z,.18,2.365,.12,.078)
    y-=.025*gaussian(x,z,-.18,2.47,.15,.075)+.025*gaussian(x,z,.18,2.47,.15,.075)
    y-=.059*gaussian(x,z,0,2.30,.069,.19)
    y-=.108*gaussian(x,z,0,2.17,.084,.071)
    y-=.059*gaussian(x,z,-.066,2.133,.044,.039)+.059*gaussian(x,z,.066,2.133,.044,.039)
    y+=.024*gaussian(x,z,0,2.077,.05,.025)
    y-=.020*gaussian(x,z,-.026,2.056,.020,.036)+.020*gaussian(x,z,.026,2.056,.020,.036)
    y-=.034*gaussian(x,z,0,1.998,.15,.052)
    y-=.035*gaussian(x,z,0,1.85,.145,.069)
    return y
def head(u,v):
    z=lerp(1.75,2.97,v); w,d,c=profile(z); a=2*pi*u
    x=w*sin(a)
    y=face_y(x,z) if cos(a)>=0 else c+d*sqrt(max(0,1-(x/w)**2))
    return (x,y,z)
grid('Face | integrated craniofacial surface',head,128,110,skin,True)

# Neck grows into the jaw and clavicle, gently wider at its base.
def neck_fun(u,v):
    z=lerp(1.05,1.91,v); a=2*pi*u
    r=.215+.07*(1-v)**2
    return (r*sin(a),.045-(.20+.045*(1-v))*cos(a),z)
grid('Neck | tapered anatomical volume',neck_fun,64,28,skin,True)

# Cartilage ear shells: nested helix/antihelix surface, attached to the head sides.
for sign in [-1,1]:
    center=(sign*.404,.005,2.255)
    ellipsoid('Ear | posterior volume '+str(sign),(sign*.431,.003,2.258),(.064,.030,.124),skin_edge,36,24)
    def ear_surface(u,v,s=sign):
        a=2*pi*u; r=v
        x=s*(.407+.102*r*sin(a)+.025*r)
        z=2.258+.142*r*cos(a)
        y=-.008-.038*exp(-((r-.81)/.16)**2)+.030*exp(-(r/.4)**2)
        return (x,y,z)
    grid(('Left' if sign<0 else 'Right')+' ear | cartilage shell',ear_surface,52,16,skin_edge,True)
    pts=[]
    for j in range(35):
        a=lerp(-.9,2.2,j/34)
        pts.append((sign*(.425+.036*sin(a)),-.032,2.26+.093*cos(a)))
    tube('Ear | inner antihelix '+str(sign),pts,.010,skin,8)
    ellipsoid('Ear | tragus '+str(sign),(sign*.402,-.048,2.224),(.023,.027,.036),skin,24,14)

# Almond-shaped eye surfaces contain actual depth; the eyelids match their rim.
for sign in [-1,1]:
    ex=sign*.183; ez=2.366
    ey=face_y(ex,ez)+.065
    def eye_edge(t,upper=True):
        dx=.104*t
        h=(.043 if upper else -.032)*(max(0,1-t*t)**.67)
        z=ez+h+sign*.012*t
        return ex+dx,z
    def eye_fun(u,v):
        t=lerp(-1,1,u); top=eye_edge(t,True); bot=eye_edge(t,False)
        x=top[0]; z=lerp(bot[1],top[1],v)
        bulge=.030*(1-t*t)*sin(pi*v)
        return x-ex,face_y(x,z)-.007-bulge-ey,z-ez
    eye=grid('eye_'+('left' if sign<0 else 'right')+' | curved sclera',eye_fun,52,20,eye_white)
    eye.location=(ex,ey,ez)
    # Closed iris and pupil disks are shallow curved meshes that follow the sclera.
    def iris_disk(name,r,mat,offset):
        def f(u,v):
            a=2*pi*u; rr=max(.0001,v)*r; x=ex+rr*cos(a); z=ez+.005+rr*sin(a)
            return (x-ex,face_y(x,z)-.047-offset+.004*(rr/r)**2-ey,z-ez)
        return grid(name,f,48,10,mat,True)
    iris=iris_disk('eye iris '+str(sign),.0415,iris_mat,.002)
    ring=iris_disk('eye iris inner '+str(sign),.0315,iris_light,.003)
    pupil=iris_disk('eye pupil '+str(sign),.0260,pupil_mat,.004)
    iris.parent=eye
    ring.parent=eye
    pupil.parent=eye
    for upper in [True,False]:
        points=[]; radii=[]
        for j in range(49):
            t=lerp(-.998,.998,j/48); x,z=eye_edge(t,upper)
            points.append((x,face_y(x,z)-.012,z))
            radii.append((.0095 if upper else .007)*(.3+.7*(1-t*t)**.5))
        tube('Eyelid '+str(sign)+' '+str(upper),points,radii,skin_edge,8,.70)
    # Upper lash roots are a fine integrated accent, with a separate subtle crease.
    pts=[]
    for j in range(42):
        t=lerp(-.94,.94,j/41); x,z=eye_edge(t,True)
        pts.append((x,face_y(x,z)-.015,z+.002))
    tube('Upper lash root '+str(sign),pts,.0027,brow_mat,6)
    pts=[]
    for j in range(32):
        t=lerp(-.85,.85,j/31); x,z=eye_edge(t,True); z+=.024*(1-t*t)
        pts.append((x,face_y(x,z)-.003,z))
    tube('Upper eyelid fold '+str(sign),pts,.0026,skin_edge,6)
    # Brows: a tapered silhouette and fine irregular but coherent hairs.
    pts=[]; radii=[]
    for j in range(42):
        t=j/41; x=sign*lerp(.073,.31,t); z=2.484+.020*sin(pi*t)-.025*t
        pts.append((x,face_y(x,z)-.009,z))
        radii.append(.003+.016*sin(pi*t)**.6)
    tube('Brow silhouette '+str(sign),pts,radii,brow_mat,8,.24)
    for k in range(27):
        t=(k+.3)/28; x=sign*lerp(.073,.31,t); z=2.484+.020*sin(pi*t)-.025*t
        pts=[(x,face_y(x,z)-.015,z-.006),(x+sign*.009,face_y(x,z)-.018,z+.010)]
        tube('Brow strand '+str(sign)+' '+str(k),pts,[.0017,.0004],hair_mats[1],5)

# Small underside nostril recesses sit in the integrated nasal alae.
for sign in [-1,1]:
    pts=[]
    for j in range(25):
        a=lerp(.12,pi-.12,j/24); x=sign*.060+.022*cos(a); z=2.119+.005*sin(a)
        pts.append((x,face_y(x,z)-.0015,z))
    tube('Nostril inset '+str(sign),pts,[.002+.003*sin(pi*j/24) for j in range(25)],crease,7,.48)

# Curved, low relief vermilion lips, with a cupid's bow and restrained corners.
def mouth_line(t): return 1.993+.005*cos(pi*t)-.004*exp(-(t/.18)**2)
for upper in [True,False]:
    def lip_fun(u,v):
        t=lerp(-1,1,u); x=.139*t; seam=mouth_line(t); taper=max(0,1-t*t)
        if upper: border=seam+.030*taper+.008*exp(-((abs(t)-.27)/.16)**2)*taper
        else: border=seam-.039*taper**.75
        z=lerp(seam,border,v)
        return (x,face_y(x,z)-.003-.010*sin(pi*v)*taper,z)
    grid('Lip | '+('upper cupid bow' if upper else 'lower volume'),lip_fun,60,14,lip_top if upper else lip_bottom)
pts=[]
for j in range(61):
    t=lerp(-1,1,j/60); x=.139*t
    z=mouth_line(t); pts.append((x,face_y(x,z)-.006,z))
tube('Mouth | resting central seam',pts,[.001+.0015*sin(pi*j/60) for j in range(61)],crease,6,.5)

# Garment: substantial half torso, naturally rounded shoulder volume, long sleeves.
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

# Folded standing collar is a real open shell, swept around the neck.
def collar_pos(a,t):
    opening=.40
    angle=opening+(2*pi-2*opening)*a
    front=cos(angle)
    radius=.25+.24*t*max(front,0)**.4+.015*t
    x=radius*sin(angle)
    y=.070-(.225+.085*t*max(front,0))*cos(angle)
    z=1.45+.10*(1-t)-.16*t*max(front,0)**2
    return x,y,z
grid('Quarter zip | turned standing collar',collar_pos,90,16,cloth,False)
for t,name in [(0,'inner collar'),(1,'outer collar piping')]:
    pts=[collar_pos(i/90,t) for i in range(91)]
    tube(name,pts,.007,cloth_dark if t==0 else cloth_light,7)
for side in [0,1]:
    pts=[collar_pos(side,j/20) for j in range(21)]
    tube('collar finished front edge '+str(side),pts,.008,cloth_light,7)
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
# Fine knit ribs are geometry near the silhouette/chest; no portrait bitmap.
for k in range(-28,29):
    x=k*.027
    pts=[]
    for j in range(18):
        z=.03+j*.05
        w,d=body_profile(z)
        if abs(x)<w*.97 and not(abs(x)<.025 and z>.45):
            y=.07-d*sqrt(max(0,1-(x/w)**2))-.002
            pts.append((x+.0015*sin(j*1.9+k),y,z))
    if len(pts)>2: tube('Knit | fine rib %02d'%k,pts,.0011,cloth_light,5)

# Original hair cap and broad tapered clumps with coherent swept fine strands.
def hairline(a):
    front=max(0,cos(a))
    return 2.26+.33*front**2+.037*sin(a*3)*front
def hair_point(a,t):
    z=lerp(hairline(a),3.0699,t)
    q=(z-2.53)/.54
    horizontal=sqrt(max(.0001,1-q*q))
    volume=.010*sin(5*a+.7)*sin(pi*t)+.005*sin(11*a)*sin(pi*t)
    x=(.452+volume)*horizontal*sin(a)
    y=.048-(.397+volume)*horizontal*cos(a)
    return x,y,z
grid('Hair | full sculpted undercut cap',lambda u,v:hair_point(2*pi*u,v),96,38,hair_mats[0],True)
for k in range(42):
    a=2*pi*k/42
    # Sweep from crown to perimeter, with asymmetry at the slight centre part.
    a0=a+.30*sin(a)+.12
    pts=[]; radii=[]
    for j in range(23):
        t=j/22; aa=lerp(a0,a,t)
        p=hair_point(aa,lerp(.91,.025,t))
        lift=.018*sin(pi*t)
        p=(p[0]+lift*sin(aa),p[1]-lift*cos(aa),p[2]+.01*sin(pi*t))
        pts.append(p)
        radii.append(.003+.020*sin(pi*t)**.65)
    tube('Hair | swept crown clump %02d'%k,pts,radii,hair_mats[k%5],7,.31)
    for s in [-.45,.45]:
        strand=[]
        for j,p in enumerate(pts):
            t=j/(len(pts)-1); a1=lerp(a0,a,t); shift=s*.03*sin(pi*t)**.65
            strand.append((p[0]+shift*cos(a1),p[1]+shift*sin(a1)-.006*cos(a1),p[2]+.005))
        tube('Hair | crown strand %02d %s'%(k,s),strand,[.0004+.0012*sin(pi*j/22) for j in range(23)],hair_mats[(k+2)%5],4)
# Fringe lock paths create recognisable curtains with a modest central separation.
for sign in [-1,1]:
    for k in range(9):
        t=k/8
        start=(sign*lerp(.012,.16,t),-.24,2.96-.04*t)
        c1=(sign*lerp(.06,.32,t),-.38,2.89)
        c2=(sign*lerp(.15,.37,t),-.401,2.65-.10*t)
        end=(sign*lerp(.038,.39,t),-.354+.10*t,2.49+.06*t+.022*sin(k*1.7))
        pts=[bezier([start,c1,c2,end],j/28) for j in range(29)]
        widths=[.001+.031*sin(pi*j/28)**.70*(1-.30*t) for j in range(29)]
        tube('Hair | fringe lock %s %s'%(sign,k),pts,widths,hair_mats[k%4],8,.27)
        for q in [-.45,.45]:
            strand=[(p[0]+q*widths[j],p[1]-.010*sin(pi*j/28),p[2]+.002) for j,p in enumerate(pts)]
            tube('Hair | fringe groove %s %s %s'%(sign,k,q),strand,[.0003+.0010*sin(pi*j/28) for j in range(29)],hair_mats[(k+2)%5],4)

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
for name,position,power,size,color in [('Key',(-3.8,-4.7,5.7),800,4.0,(1.0,.90,.81)),('Fill',(3.2,-3.0,3.4),450,3.1,(.78,.88,1.0)),('Rim',(1.1,2.5,4.8),650,3.0,(.85,.91,1.0)),('Lower bounce',(0,-4,1.1),100,2.5,(1,.91,.85))]:
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
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'sun-yingjie-avatar-draft.blend'),compress=True)
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
