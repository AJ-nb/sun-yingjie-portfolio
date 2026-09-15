from extract_sources import *
import re
records=json.loads((PRIVATE/'published-psd-media.json').read_text(encoding='utf-8'))
for slug in ('lingmu','jimu-studio'):
 rows=[r for r in records if r['caseSlug']==slug]
 for lang in ('zh','en'):
  path=ROOT/'web/src/content/works'/(slug+'.'+lang+'.md')
  text=path.read_text(encoding='utf-8')
  if '### PSD' in text:continue
  heading='### PSD 原生版块与产品细节' if lang=='zh' else '### PSD boards and product details'
  intro=('以下素材由原始多图层文件在 Photoshop 中导出并转换为 sRGB。独立图层补充产品细节，原生版块保留草图和布局过程；原有合作项目属性与署名信息继续保留。' if lang=='zh' else 'These images were exported from the original layered files in Photoshop and converted to sRGB. Isolated layers reveal product details, while native boards retain sketches and layout development. The collaborative status and original credit information remain applicable.')
  images='\n\n'.join('!['+r['captionZh' if lang=='zh' else 'captionEn']+']('+r['publicPath']+')' for r in rows)
  section='## 最终作品' if lang=='zh' else '## Final work'
  text=text.replace(section,heading+'\n\n'+intro+'\n\n'+images+'\n\n'+section)
  cover=next(r['publicPath'] for r in rows if r['publicPath'].endswith('/usage.webp' if slug=='lingmu' else '/product-arrangement.webp'))
  text=re.sub(r'^cover: .*$',f'cover: "{cover}"',text,flags=re.M)
  path.write_text(text,encoding='utf-8')
print('Updated LINGMU and JiMu bilingual cases')
