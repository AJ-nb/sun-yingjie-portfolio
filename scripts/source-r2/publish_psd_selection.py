from extract_sources import *
configs={
 'lingmu':[
  ('lingmu-group-00.jpg','opening','LINGMU 原生扉页','LINGMU native opening board'),
  ('lingmu-group-01.jpg','background','原始设计背景与用户画像版块','Original design context and persona board'),
  ('lingmu-group-02.jpg','journey','原始用户旅程与故事板','Original user journey and storyboard'),
  ('lingmu-group-04.jpg','sketches','洗浴设备原始草图版块','Original bathing-equipment sketch board'),
  ('lingmu-group-05.jpg','cmf','原始 CMF 与效果图版块','Original CMF and rendering board'),
  ('lingmu-group-06.jpg','usage','原始使用场景版块','Original usage-scenario board'),
  ('lingmu-head-module.jpg','head-module','头部清洁模块独立图层','Isolated head-cleaning module layer'),
  ('lingmu-body-module.jpg','body-module','身体清洁模块独立图层','Isolated body-cleaning module layer'),
  ('lingmu-front-view.jpg','front-view','正视图独立图层','Isolated front-view layer'),
 ],
 'jimu':[
  ('jimu-group-00.jpg','opening','JiMu Studio 原生扉页','JiMu Studio native opening board'),
  ('jimu-group-01.jpg','materials-research','玉米芯材料研究与原始构思版块','Original corn-cob material research and ideation board'),
  ('jimu-group-03.jpg','sketches','原始画像与草图版块','Original persona and sketch board'),
  ('jimu-group-04.jpg','product-board','家具结构与效果图原生版块','Native furniture structure and rendering board'),
  ('jimu-group-05.jpg','scene-board','原始家具场景版块；室内背景不归为原创设计','Original furniture scenario board; interior assets are not claimed as original design'),
  ('jimu-materials-exploded.jpg','materials-exploded','材料与部件分解独立图层','Isolated material and component diagram'),
  ('jimu-product-arrangement.jpg','product-arrangement','家具组合独立图层','Isolated furniture arrangement layer'),
  ('jimu-dimension-view.jpg','dimension-view','尺寸视图独立图层','Isolated dimension-view layer'),
 ]
}
records=[]
for slug,rows in configs.items():
 native=json.loads((PRIVATE/(slug+'-photoshop-exports.json')).read_text(encoding='utf-8'))
 layers=json.loads((PRIVATE/(slug+'-photoshop-layers.json')).read_text(encoding='utf-8'))
 out=PUBLIC/('psd-'+slug);out.mkdir(exist_ok=True)
 for filename,name,zh,en in rows:
  p=WORK/'psd-native'/filename
  im=Image.open(p).convert('RGB');original_dimensions=list(im.size)
  im.thumbnail((2560,2560),Image.Resampling.LANCZOS)
  dest=out/(name+'.webp');im.save(dest,'WEBP',quality=93,method=6)
  native_source=next((x for x in native['groups']+native['isolatedLayers'] if x['file']==filename),None)
  records.append({'caseSlug':'jimu-studio' if slug=='jimu' else slug,'sourceFile':native['source'],'sourceMode':layers['mode'],'sourceProfile':layers['profile'],'nativeEngine':native['engine'],'outputProfile':native['profile'],'sourceLayer':native_source,'nativeExportPath':str(p.relative_to(ROOT)).replace('\\','/'),'nativeExportSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'nativeDimensions':original_dimensions,'publicPath':'/'+str(dest.relative_to(ROOT/'web/public')).replace('\\','/'),'webDimensions':list(im.size),'captionZh':zh,'captionEn':en,'provenance':'Native Photoshop layer/group export from supplied PSD','newRender':False,'aiImageOperation':False,'credits':'Collaborative concept project; existing original boards and credits remain. Reference interiors and background assets are not claimed as original design.'})
save_json('published-psd-media.json',records)
contact_sheet([(ROOT/'web/public'/r['publicPath'].lstrip('/'),r['caseSlug']+' '+Path(r['publicPath']).stem) for r in records],PRIVATE/'psd-selected-contact-sheet.jpg',4)
print(json.dumps({'published':len(records)}))
