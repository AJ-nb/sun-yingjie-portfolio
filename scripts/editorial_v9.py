"""Publish the approved bilingual editorial text while retaining every case asset."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/'web/src/data'; CASES=ROOT/'web/src/content/works'
editorial=json.loads((DATA/'case-editorial.json').read_text(encoding='utf-8'))
mapping=json.loads((DATA/'publication-pages.json').read_text(encoding='utf-8'))
report=[]
for slug,pair in editorial.items():
 for lang,copy in pair.items():
  path=CASES/f'{slug}.{lang}.md';raw=path.read_text(encoding='utf-8-sig');front,body=raw.split('---',2)[1:]
  old_assets=set(re.findall(r'/(?:works|media)/[^\s\"\'<>\)]+',raw))
  for key in ['title','summary','role']:front=re.sub(r'^'+key+r':.*$',key+': '+json.dumps(copy[key],ensure_ascii=False),front,flags=re.M)
  if slug=='karimoku':front=re.sub(r'^status:.*$', 'status: "'+('设计研究 · 回顾性整理' if lang=='zh' else 'Design study · Retrospective analysis')+'"',front,flags=re.M)
  front=re.sub(r'^tags:.*$',lambda m:m[0].replace(', "证据边界"',''),front,flags=re.M)
  # Preserve exact asset paths and original captions, including all seasonal boards.
  pictures=[]
  for m in re.finditer(r'!\[([^\]]*)\]\(([^)\s]+)\)|<img\b[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>',body):
   src=m[2] or m[3];alt=m[1] if m[2] else m[4]
   if src not in [p['src'] for p in pictures]:pictures.append({'src':src,'alt':alt})
  hero=re.search(r'^cover: "([^"]+)"',front,re.M)[1]
  # Use the existing curated publication media for the three decision illustrations.
  media=[page['images'][0] for page in mapping['casePages'][slug]]
  used=[];decisions=[]
  for i,(title,text) in enumerate(copy['decisions']):
   pic=media[min(i,len(media)-1)];alt=next((p['alt'] for p in pictures if p['src']==pic['src']),title)
   decisions.append(f'### {title}\n\n{text}\n\n![{alt}]({pic["src"]})')
   used.append(pic['src'])
  labels=['项目背景','本人职责','核心问题','设计判断','成果与阶段','反思','署名与背景'] if lang=='zh' else ['Context','My role','Design problem','Design decisions','Outcome & stage','Reflection','Credits & Context']
  credits=re.search(r'^credits: "(.*)"',front,re.M)[1]
  boundary={'karimoku':('BENWU 期间的设计研究与回顾性整理。项目身份与个人职责以设计研究档案为准。','A design study and retrospective analysis from the BENWU period. Official commission, collaboration and final delivery scope have not been independently verified.'),'yelisi':('团队共同创作；产品为概念阶段，未声明制造或上市。','Collaborative work; the products are concepts, with no claim of manufacture or market launch.'),'periastra':('团队共同创作；Hasselblad 内容为 Reference Study，原品牌资产归其权利人。','Collaborative work. Hasselblad content is a reference study; its assets remain with their owners.'),'hermes':('BENWU 团队协作。个人统筹、法国沟通、工厂与门店交付范围需项目记录支持。新增季节图板为回顾性重建。','BENWU team collaboration. Leadership, communication with France, factory and store-delivery responsibilities require project records. Added seasonal boards are retrospective reconstructions.'),'arcteryx':('BENWU 团队协作。补充图片呈现落地效果，不推导个人施工责任或工程性能。','BENWU team collaboration. Additional images show installation outcomes, without establishing personal construction responsibility or engineering performance.')}.get(slug,('职责与阶段以当前项目档案为范围。','Role and stage are limited to the current project record.'))[lang=='en']
  gallery_title='完整图像档案' if lang=='zh' else 'Complete image archive'
  note=('保留原始项目视图与补充资料。新增设计图板属于回顾性重建，参考研究与概念图以原图说明为准。' if lang=='zh' else 'Original project views and supplementary material. Boards are retrospective reconstructions; reference studies and concepts retain their source captions.')
  archive='\n\n'.join(f'![{pic["alt"]}]({pic["src"]})' for pic in pictures)
  gallery=f'\n\n<details>\n<summary>{gallery_title}</summary>\n\n{note}\n\n{archive}\n\n</details>'
  sections=[copy['summary'],copy['role']+'.' if lang=='en' else copy['role']+'。',copy['problem'],'\n\n'.join(decisions)+gallery,copy['outcome'],copy['reflection'],credits+'\n\n'+boundary]
  updated='---'+front+'---\n\n'+'\n\n'.join('## '+label+'\n\n'+text for label,text in zip(labels,sections))+'\n'
  new_assets=set(re.findall(r'/(?:works|media)/[^\s\"\'<>\)]+',updated))
  if old_assets-new_assets:raise ValueError((slug,lang,'lost assets',old_assets-new_assets))
  path.write_text(updated,encoding='utf-8');report.append({'slug':slug,'lang':lang,'retainedAssets':len(old_assets),'publishedAssets':len(new_assets)})
  # Archive mapping includes all public imagery and localized source captions.
  if lang=='zh':mapping['archiveImages'][slug]=[{'src':hero,'caption':copy['title']},*[{'src':p['src'],'caption':p['alt']} for p in pictures if p['src']!=hero]]
# Keep the video case's detailed controls and references; move the opening to first-person design practice.
for lang in ['zh','en']:
 p=CASES/f'ai-video-systems.{lang}.md';s=p.read_text(encoding='utf-8-sig')
 s=s.replace('Independent applied research | author-recorded process','Independent applied research').replace('独立应用研究｜作者过程记录','独立应用研究')
 if lang=='en':
  s=re.sub(r'This is neither a commercial commission.*?\n\n', 'I developed an independent AI-video workflow to translate a story, camera-language reference and two character inputs into controllable shots. The work connects storyboard writing, Blender blocking, visual inputs and render review.\n\n',s,count=1,flags=re.S)
  s=s.replace('The author records two protagonist images as inputs', 'My process log records two protagonist images as inputs').replace('The 22-second film is described as containing','My process log describes the 22-second film as containing')
  s=s.replace('## Evidence and references','## Reflection\n\nThe useful output is a set of controllable relationships, not a promise that every scene can be generated reliably in one pass. The next step is to compare repeat runs against the same storyboard criteria.\n\n## Credits & Context')
 else:
  s=s.replace('## 证据与参考','## 反思\n\n这次研究的可复用部分是对输入、镜头与评估的控制。下一步需要在相同分镜标准下比较重复生成结果，检查方法的稳定性。\n\n## 署名与背景')
 p.write_text(s,encoding='utf-8')
(DATA/'publication-pages.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'docs/editorial-v9-media-retention.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Re-edited seven bilingual cases with exact media retention; refined AI-video copy.')
