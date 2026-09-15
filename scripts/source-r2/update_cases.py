from extract_sources import *
content=ROOT/'web/src/content/works'
models=json.loads((PRIVATE/'published-model-media.json').read_text(encoding='utf-8'))
for slug in ('plumber','huhu-care'):
 for lang in ('zh','en'):
  path=content/(slug+'.'+lang+'.md');text=path.read_text(encoding='utf-8')
  marker='### 原始项目渲染' if lang=='zh' else '### Original project renders'
  if marker in text:continue
  intro=('以下视角来自原始模型工作集，记录产品形态、部件关系与场景表达。本轮对既有渲染进行选片和网页适配；团队署名与原提案中的成果边界继续保留。' if lang=='zh' else 'These views come from the original model worksets and document form, component relationships and scene visualization. Existing renders were selected and prepared for this edition; the collaborative credits and the proposal’s stated scope remain applicable.')
  images='\n\n'.join('!['+r['captionZh' if lang=='zh' else 'captionEn']+']('+r['publicPath']+')' for r in models if r['caseSlug']==slug)
  final='## 最终作品' if lang=='zh' else '## Final work'
  text=text.replace(final,marker+'\n\n'+intro+'\n\n'+images+'\n\n'+final)
  newcover='/works/refinement-v2/'+('plumber/underground-scene.webp' if slug=='plumber' else 'huhu/product-scene.webp')
  import re
  text=re.sub(r'^cover: .*$',f'cover: "{newcover}"',text,flags=re.M)
  path.write_text(text,encoding='utf-8')

pdf_selected=[(38,'GO GLOW 材质、灯光与静物组合','GO GLOW materials, lighting and still-life arrangement'),(40,'GO GLOW 水面镜头','GO GLOW water-scene camera study'),(41,'GO GLOW 暗场产品组合','GO GLOW low-key product arrangement'),(22,'HUHU CARE 圆环与球体场景','HUHU CARE circular and spherical scene'),(24,'植遇相伴产品与显示底座','Plant Companion products and display base'),(14,'生态丰收漫游者外景','Ecological Harvester exterior scene'),(17,'手腕支撑产品视觉习作','Wrist-support visualization study'),(34,'引渡者地下设施灯光','PLUMBER underground-facility lighting'),(36,'机器人地下环境构图','Robot underground-environment composition')]
for lang in ('zh','en'):
 path=content/('rendering-studies.'+lang+'.md');text=path.read_text(encoding='utf-8')
 if '/works/refinement-v2/rendering-pdf/' in text:continue
 old='![个护、健身、灯具、装备与科幻形态的完整渲染长卷](/works/documents/rendering-sheet/001.webp)' if lang=='zh' else '![Complete render collection of personal care, fitness, lighting, equipment and science-fiction forms](/works/documents/rendering-sheet/001.webp)'
 intro='以下独立画面提取自原始渲染作品集的高清内嵌图，按材质、灯光和场景组织观看。产品项目的设计职责见对应案例；来源尚未明确的参考画面与装饰纹理不计入本组选片。' if lang=='zh' else 'These individual views are extracted from high-resolution images embedded in the original rendering portfolio, organized around materials, lighting and scenes. Design responsibilities are documented in the corresponding project cases; unverified reference images and decorative textures are excluded from this selection.'
 images='\n\n'.join(f'![{zh if lang=="zh" else en}](/works/refinement-v2/rendering-pdf/{n:03d}.webp)' for n,zh,en in pdf_selected)
 link='[查看原始渲染长卷存档](/works/documents/rendering-sheet/001.webp)' if lang=='zh' else '[View the original long-format collection archive](/works/documents/rendering-sheet/001.webp)'
 text=text.replace(old,intro+'\n\n'+images+'\n\n'+link)
 if lang=='zh':
  text=text.replace('产品场景长卷','产品场景选集').replace('产品与场景长卷','产品与场景选片').replace('长卷包含 GO GLOW','选片包含 GO GLOW').replace('产品长卷通过','产品选集通过')
 else:
  text=text.replace('a long-format product-render collection','a selection of product renders').replace('The long collection includes','The selected collection includes')
 path.write_text(text,encoding='utf-8')
print('Updated six bilingual case files')
