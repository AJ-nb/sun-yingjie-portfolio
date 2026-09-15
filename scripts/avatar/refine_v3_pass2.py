from pathlib import Path
p=Path(__file__).with_name('build_avatar_v3.py')
s=p.read_text(encoding='utf8')
s=s.replace("(.012+i*.0020,.0085+i*.0014,.0065+i*.0011),.54+i*.035,0,.27", "(.007+i*.0014,.0048+i*.0010,.0039+i*.0008),.65+i*.03,0,.20")
s=s.replace('(1.68,.287,.205,.060),(1.75,.275,.225,.050),(1.795,.275,.260,.035)', '(1.68,.287,.201,.085),(1.75,.278,.213,.080),(1.795,.278,.248,.057)')
s=s.replace("eye.location=(ex,ey,ez-HEAD_DROP)", "eye.location=(ex,ey,ez-HEAD_DROP)\n    globe=ellipsoid('eye ocular volume '+str(sign),(0,0,0),(.094,.058,.086),eye_white,32,20)\n    globe.parent=eye")
s=s.replace('radius=.278+.29*t*(.33+.67*side)', 'radius=.283+.245*t*(.82+.18*side)')
s=s.replace('(.245+.065*t)', '(.242+.12*t)')
s=s.replace('inner=1.50-.065*front', 'inner=1.55-.04*front')
s=s.replace('outer=1.25+.105*side+.095*max(0,-cos(angle))', 'outer=1.25+.15*side+.12*max(0,-cos(angle))')
s=s.replace('z=lerp(inner,outer,t)+.013*sin(pi*t)', 'z=lerp(inner,outer,t)+.040*sin(pi*t)')
s=s.replace('return 2.17+.21*sin(a)**2+.48*front**3-.045*rear+.009*sin(13*a)', 'return 2.20+.16*sin(a)**2+.48*front**3-.06*rear+.012*sin(13*a)')
s=s.replace('z=lerp(hairline(a),3.055,t)', 'z=lerp(hairline(a),3.075,t)')
s=s.replace('q=(z-2.37)/.685', 'q=(z-2.37)/.710')
s=s.replace("(.495+volume)*horizontal", "(.510+volume)*horizontal")
s=s.replace("(.405+volume)*horizontal", "(.449+volume)*horizontal")
s=s.replace('a0=a+.11+.29*sin(a)+.11*sin(k)', 'a0=a+.28+.44*sin(a)+.15*sin(k)')
s=s.replace('lift=.012+(.016+.010*(k%3))*sin(pi*t)', 'lift=.016+(.033+.015*(k%3))*sin(pi*t)')
s=s.replace('r=.0025+.003*(k%5)/4', 'r=.0020+.0025*(k%5)/4')
start=s.index('# Irregular off-centre curtain fringe')
end=s.index('# Restrained flyaways',start)
s=s[:start]+'''# Interleaved curved fringe groups with staggered, tapered tips.
for k in range(42):
    t=(k+.5)/42
    side=-1 if t<.54 else 1
    endx=lerp(-.45,.45,t)
    endz=2.48+.11*(abs(endx)/.45)**1.5+.040*sin(k*1.8)
    rootx=endx*.55-side*.06
    rootz=2.92+.08*sin(pi*t)+.020*sin(k*1.71)
    endy=-.373+.16*(abs(endx)/.455)**2
    path=[(rootx,-.23+.055*abs(endx)/.45,rootz),
          (rootx+side*.12,-.39,rootz+.055),
          (endx-side*.09,-.468+.09*abs(endx),2.69+.040*sin(k)),
          (endx,endy,endz)]
    pts=[bezier(path,j/22) for j in range(23)]
    r=.009+.006*(k%5)/4
    widths=[.00012+r*sin(pi*j/22)**.7 for j in range(23)]
    tube('Hair | curved fringe lock %03d'%k,pts,widths,hair_mats[k%5],6,.50)
    for q in range(10):
        shift=(q-4.5)/5
        strand=[]
        for j,p in enumerate(pts):
            t=j/22
            strand.append((p[0]+shift*widths[j]*1.35+.003*sin(pi*t*2+k+q),
                p[1]-.005-.010*sin(pi*t)*sqrt(max(0,1-shift*shift)),p[2]+.003*sin(pi*t)))
        tube('Hair | fringe fiber %03d %02d'%(k,q),strand,[.00009+.00095*sin(pi*j/22) for j in range(23)],hair_mats[(k+q)%5],4)
''' + s[end:]
p.write_text(s,encoding='utf8')
