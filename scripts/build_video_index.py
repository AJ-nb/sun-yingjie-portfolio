"""Publish pinned reference metadata, never third-party prompts or media files."""
import json
import urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
cache=ROOT/'.production-runtime/v10/upstream'
cache.mkdir(parents=True,exist_ok=True)
revision='9927d9b5bc2d1c305b2945917e461b3547642497'
for local,remote in [('cases.json','data/cases.json'),('taxonomy.json','data/case-taxonomy.json')]:
 if not (cache/local).exists():
  with urllib.request.urlopen(f'https://raw.githubusercontent.com/LearnPrompt/awesome-seedance/{revision}/{remote}',timeout=60) as response:
   (cache/local).write_bytes(response.read())
source=json.loads((cache/'cases.json').read_text(encoding='utf-8'))
taxonomy=json.loads((cache/'taxonomy.json').read_text(encoding='utf-8'))['assignments']
methods=json.loads((ROOT/'web/src/data/aiVideoMethods.json').read_text(encoding='utf-8'))
groups={
 'product-commercial-shotlist':('visual','product','产品识别与镜头任务','Product identity and shot objectives'),
 'car-vehicle':('physical','product','车辆运动与结构一致性','Vehicle movement and structural continuity'),
 'travel-city-walk':('camera','space','行进路径与空间节点','Paths and spatial waypoints'),
 'character-reference-lock':('visual','narrative','角色特征与状态约束','Character identity and state constraints'),
 'storyboard-grid-to-video':('temporal','narrative','分镜状态与镜头交接','Storyboard states and shot handoffs'),
 'pov-continuous-take':('camera','space','连续视点与遮挡关系','Continuous viewpoint and occlusion'),
 'sports-extreme':('physical','product','接触、支撑与动作链','Contact, support and action chains'),
 'combat-choreography':('physical','narrative','动作因果与空间连续性','Action causality and spatial continuity'),
 'time-freeze-rewind':('evaluation','narrative','时间操作与前后状态','Time operations and boundary states'),
 'anime-style-lock':('visual','narrative','风格规则与角色一致性','Style rules and character consistency'),
 'handheld-ugc-vlog':('camera','narrative','手持视点与日常动作','Handheld viewpoint and everyday actions'),
 'cinematic-narrative-short':('temporal','narrative','叙事节拍与镜头顺序','Narrative beats and shot order'),
 'process-transformation-montage':('temporal','product','变化过程与状态检查','Transformation sequences and state checks'),
 'ugc-creator-review':('intent','product','使用场景与信息优先级','Use context and information priorities'),
 'meme-comedy':('intent','narrative','笑点时机与视觉信息','Comic timing and visual information'),
 '3d-cartoon':('visual','narrative','三维风格与角色比例','3D style and character proportions'),
 'dialogue-performance-beats':('temporal','narrative','对白、表演与节奏','Dialogue, performance and timing'),
 'epic-fantasy-scifi':('visual','space','世界观尺度与空间线索','World scale and spatial cues'),
 'fashion-lookbook':('visual','cmf','服装材质与造型一致性','Fabric and styling consistency'),
 'horror-suspense':('intent','narrative','信息揭示与悬念节拍','Information reveals and suspense beats'),
 'music-beat-sync-mv':('temporal','narrative','节拍与镜头同步','Beat and shot synchronization'),
 'pet-animal':('physical','narrative','动物动作与接触关系','Animal movement and contact'),
 'retro-found-footage':('visual','narrative','摄影介质与年代风格','Recording medium and period style'),
 'stop-motion-cadence':('temporal','product','逐帧节奏与物件变化','Frame cadence and object changes'),
 'timeline-shot-script':('temporal','narrative','时间线与镜头任务','Timeline and shot objectives'),
}
translations={
 'vlog-9decd38e99a4':'Korean outdoor pool vlog',
 'case-c290f40d8f85':'Sunset on a Korean school rooftop',
 'vlog-83f1f069fe6a':'Japanese holiday preparation vlog',
 'doc2-biscuit-ad':'Fruit biscuit product commercial',
 'seedance-1-c67289c7c2f0':'Continuous sword choreography and action-driven transitions',
 'seedance-seedance-2-5-dc01b3250bb4':'Phone-controlled outfit transitions',
}
entries=[]
for item in source['cases']:
 if item.get('isFixture') or item['slug'].startswith(('test-fixture','fixture-')):continue
 template=taxonomy.get(item['slug'])
 layer,app,zh,en=groups.get(template,('evaluation','narrative','生成意图、连续性与审阅条件','Generation intent, continuity and review conditions'))
 entries.append({'id':item['slug'],'title':{'zh':item['title'],'en':item.get('titleEn') or translations.get(item['slug'],item['slug'].replace('-',' '))},'focus':{'zh':zh,'en':en},'layer':layer,'application':app,'template':template,'classification':'editorial' if template in groups else 'general-review','models':item.get('models',[]),'sourceUrl':item['sourceUrl'],'recordUrl':item['goodcaseUrl'],'creator':item.get('creator',''),'mediaMode':'official-embed' if 'x.com/' in item['sourceUrl'] else 'source-link','rights':'No repository-wide media redistribution license','videoReviewed':False,'personallyRetested':False})
assert len(entries)==len({e['id'] for e in entries})
output={'source':methods['source'],'entries':entries}
output['source']['caseCount']=len(entries)
(ROOT/'web/src/data/aiVideoIndex.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for e in methods['entries']:
 e['evidenceStatus']='document-analysis';e['mediaRights']='Individual creator rights; official embed only';e['sourceRevision']=methods['source']['revision']
(ROOT/'web/src/data/aiVideoMethods.json').write_text(json.dumps(methods,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Indexed {len(entries)} references; no third-party prompts, posters or video files copied.')
