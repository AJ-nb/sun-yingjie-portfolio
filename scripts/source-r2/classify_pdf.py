from extract_sources import *
from collections import defaultdict
index=json.loads((PRIVATE/'pdf-embedded-index.json').read_text(encoding='utf-8'))
labels={
1:('plant-companion','植遇相伴模块组合','Plant Companion modular arrangement'),
2:('go-glow','GO GLOW 个护产品组合','GO GLOW personal-care arrangement'),
4:('go-glow','牙刷与镜面模块','Toothbrush and mirror module'),
6:('go-glow','模块与握持手柄分解','Care modules and handle arrangement'),
8:('go-glow','可替换护理模块','Interchangeable care module'),
9:('go-glow','产品与底座系列','Product and base family'),
11:('lighting','线性吊灯渲染','Linear pendant light render'),
12:('lighting','壁灯空间渲染','Wall-light interior render'),
13:('lighting','壁灯发光细节','Wall-light illumination detail'),
14:('ecological-harvest','生态丰收漫游者环境渲染','Ecological Harvester environment render'),
15:('huhu-care','HUHU CARE 组合场景','HUHU CARE product arrangement'),
17:('rendering-studies','手腕支撑产品视觉习作','Wrist-support product visualization study'),
18:('rendering-studies','手腕支撑产品材质对比','Wrist-support material comparison'),
19:('huhu-care','HUHU CARE 产品外观','HUHU CARE product form'),
20:('huhu-care','HUHU CARE 握持关系','HUHU CARE grip relationship'),
21:('huhu-care','HUHU CARE 与底座','HUHU CARE and base'),
22:('huhu-care','HUHU CARE 圆环场景','HUHU CARE circular scene'),
23:('lighting','线性灯具室内场景','Linear-light interior scene'),
24:('plant-companion','植遇相伴模块与显示底座','Plant Companion modules and display base'),
25:('lighting','灯具与型材分解','Light and extrusion study'),
26:('lighting','落地灯完整视图','Complete floor-light view'),
27:('hermes','夏季橱窗空间方案','Summer window spatial proposal'),
28:('hermes','季节橱窗空间方案','Seasonal window spatial proposal'),
29:('hermes','灯塔主题橱窗方案','Lighthouse-themed window proposal'),
31:('ecological-harvest','生态丰收漫游者正面场景','Ecological Harvester frontal scene'),
33:('plumber','引渡者机器人动作场景','PLUMBER robot action scene'),
34:('plumber','机器人地下基站空间','Robot underground station scene'),
35:('plant-companion','植遇相伴低视角组合','Plant Companion low-angle arrangement'),
36:('plumber','地下设施环境渲染','Underground facility render'),
37:('go-glow','桌面个护场景','Desktop care scene'),
38:('go-glow','个护产品与花卉静物','Care products and floral still life'),
39:('go-glow','模块组合俯视构图','Overhead care-module composition'),
40:('go-glow','牙刷与水面场景','Toothbrush and water scene'),
41:('go-glow','岩石场景中的产品组合','Care arrangement in a rock scene'),
42:('go-glow','洁面模块水面近景','Face-care module over water'),
43:('plumber','管道环境远景','Pipe-environment wide view'),
44:('go-glow','护理模块与花卉构图','Care modules and floral composition')
}
exclude={3:'Portrait/product composite; person-image origin and authorization not established',5:'Portrait/product composite; person-image origin and authorization not established',7:'Portrait/product composite; person-image origin and authorization not established',10:'Reference landscape image with visible watermark; not presented as authored rendering',16:'Graphic symbol rather than a render; retained in source index',30:'Decorative material texture rather than final project image',32:'Duplicate of pdf-030 decorative texture'}
groups=defaultdict(list)
for n,r in enumerate(index['images'],1):
 groups[r['sourceImageSha256']].append(r['id'])
 r['mediaType']='portfolio-embedded-image';r.pop('aiGenerated',None)
 r['aiAssistance']='Not independently established from PDF; no AI image operation was performed in this extraction'
 pub=ROOT/'web/public'/r['publicPath'].lstrip('/')
 if n in exclude:
  r['classification']='excluded-from-site';r['exclusionReason']=exclude[n];r['publicPath']=None
  if pub.exists():pub.unlink()
  continue
 slug,zh,en=labels[n]
 r.update({'classification':'visual-review-matched','recommendedCase':slug,'captionZh':zh,'captionEn':en,'authorship':'Rendering/visual presentation from supplied portfolio. Collaborative project and original source-board credits remain applicable; third-party model/brand authorship is not claimed.'})
 im=Image.open(ROOT/r['rawPath']).convert('RGBA')
 bbox=im.getchannel('A').getbbox()
 r['alphaContentBounds']=list(bbox) if bbox else None
 if bbox:im=im.crop(bbox)
 bg=Image.new('RGBA',im.size,'white');bg.alpha_composite(im)
 rgb=bg.convert('RGB');rgb.thumbnail((2560,2560),Image.Resampling.LANCZOS)
 rgb.save(pub,'WEBP',quality=92,method=6)
 r['webDimensions']=list(rgb.size);r['processing']='Transparent border removed using original PDF alpha mask; composited on white; resized within 2560 px; no generative change'
index['uniqueImageCount']=len(groups);index['duplicateGroups']=[v for v in groups.values() if len(v)>1];index['publishedImageCount']=len(labels)
save_json('pdf-embedded-index.json',index)
save_json('pdf-case-mapping.json',{'source':index['source'],'referenceCount':len(index['images']),'uniqueImageCount':len(groups),'published':[{k:r[k] for k in ('id','recommendedCase','captionZh','captionEn','publicPath','webDimensions')} for r in index['images'] if r.get('publicPath')]})
contact_sheet([(ROOT/'web/public'/r['publicPath'].lstrip('/'),r['id']+' '+r['recommendedCase']) for r in index['images'] if r.get('publicPath')],PRIVATE/'pdf-published-contact-sheet.jpg')
print(json.dumps({'unique':len(groups),'published':len(labels),'excluded':len(exclude)}))
