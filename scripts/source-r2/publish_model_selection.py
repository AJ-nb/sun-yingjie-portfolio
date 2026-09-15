from extract_sources import *
from PIL import ImageCms

selection={
 'plumber':{
  5:('three-quarter','机器人三分之四视角','Robot three-quarter view'),
  6:('side','机器人侧视','Robot side view'),
  7:('front','机器人正视','Robot front view'),
  21:('top','机器人俯视','Robot top view'),
  3:('rear-detail','外壳与尾部细节','Shell and rear detail'),
  18:('cleaning-head','清理端结构细节','Cleaning-head detail'),
  20:('exploded','机器人部件分解','Robot exploded view'),
  12:('station','地下基站概念','Underground service-station concept'),
  24:('underground-scene','地下环境原始渲染','Original underground scene render'),
  25:('underground-close','地下环境近景','Underground close-up'),
  26:('underground-wide','地下环境远景','Underground wide shot'),
 },
 'huhu':{
  5:('early-form','早期配色与形态方案','Earlier form and color study'),
  23:('mouthpiece','吹嘴与连接位置','Mouthpiece and connection'),
  27:('rim-detail','吹嘴外缘细节','Mouthpiece rim detail'),
  28:('grip','防滑握持区域','Textured grip area'),
  34:('neck-detail','颈部连接与标识','Neck joint and identity detail'),
  37:('three-quarter','最终配色三分之四视角','Final-color three-quarter view'),
  36:('rear','反向视角与气球连接','Reverse view and balloon connection'),
  33:('charging-base','产品与底座组合','Product and base arrangement'),
  31:('base-reverse','底座组合反向视角','Reverse view of product and base'),
  32:('balloon-detail','气球、连接与吹嘴局部','Balloon, connection and mouthpiece detail'),
  40:('product-scene','儿童呼气检测概念场景原始渲染','Original pediatric breath-test concept scene render'),
 }
}
manifest=[]
for slug,picks in selection.items():
 rows=json.loads((PRIVATE/(slug+'-render-index.json')).read_text(encoding='utf-8'))
 out=PUBLIC/slug;out.mkdir(exist_ok=True)
 for n,(name,zh,en) in picks.items():
  r=rows[n-1];src=ROOT/r['sourcePath'];im=Image.open(src)
  profile=im.info.get('icc_profile');color='Original RGB values; no embedded source ICC profile'
  if profile:
   im=ImageCms.profileToProfile(im,ImageCms.ImageCmsProfile(io.BytesIO(profile)),ImageCms.createProfile('sRGB'),outputMode='RGB');color='Embedded source ICC converted to sRGB'
  else:im=im.convert('RGB')
  original_size=list(im.size);im.thumbnail((2560,2560),Image.Resampling.LANCZOS)
  dest=out/(name+'.webp');im.save(dest,'WEBP',quality=92,method=6)
  pub='/'+str(dest.relative_to(ROOT/'web/public')).replace('\\','/')
  r['selection']='published';r['publicPath']=pub;r['captionZh']=zh;r['captionEn']=en
  manifest.append({'id':r['id'],'caseSlug':'huhu-care' if slug=='huhu' else slug,'sourceArchive':'D:/OneDrive/桌面/文件/作品集/完成模型/'+('儿童幽门螺杆菌检测仪.zip' if slug=='huhu' else '管道清淤机器人.zip'),'sourcePath':r['sourcePath'],'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'sourceDimensions':original_size,'publicPath':pub,'webDimensions':list(im.size),'captionZh':zh,'captionEn':en,'provenance':'Existing original render from supplied model archive','newRender':False,'aiImageOperation':False,'colorHandling':color,'credits':'Collaborative concept project; original source-board credits preserved. Third-party texture and component authorship is not claimed.'})
 save_json(slug+'-render-index.json',rows)
save_json('published-model-media.json',manifest)
contact_sheet([(ROOT/'web/public'/r['publicPath'].lstrip('/'),r['id']) for r in manifest],PRIVATE/'selected-model-media.jpg',4)
print(json.dumps({'published':len(manifest),'bytes':sum((ROOT/'web/public'/r['publicPath'].lstrip('/')).stat().st_size for r in manifest)}))
