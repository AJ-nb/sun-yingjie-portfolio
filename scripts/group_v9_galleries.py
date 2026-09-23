"""Keep every image while exposing useful seasonal groups and accurate captions."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
for lang in ['zh','en']:
    p=ROOT/f'web/src/content/works/hermes.{lang}.md';s=p.read_text(encoding='utf-8')
    match=re.search(r'<details>.*?</details>',s,re.S)
    pics=re.findall(r'!\[([^\]]*)\]\(([^\s)]+)\)',match[0]);groups={x:[] for x in ['summer','autumn','winter','other']}
    legacy={'summer':['40379d','51a7ab','a8d210'],'autumn':['043e01','34aa99','b1d7e5'],'winter':['54f3c9','776d28','8c4f37','bfdc3c','e8d955','f14556']}
    for alt,src in pics:
        group=next((key for key in legacy if '/'+key+'/' in src or any(code in src for code in legacy[key])),'other')
        groups[group].append(f'![{alt}]({src})')
    titles={'summer':('夏季图像档案','Summer image archive'),'autumn':('秋季图像档案','Autumn image archive'),'winter':('冬季图像档案','Winter image archive'),'other':('补充资料与分析','Additional material and analysis')}
    gallery=[]
    for key,pictures in groups.items():
        if not pictures:continue
        note='季节设计图板为回顾性重建，原始项目视图与图板分别保留图注。' if lang=='zh' else 'Seasonal design boards are retrospective reconstructions. Source captions distinguish project views from boards.'
        gallery.append('<details>\n<summary>'+titles[key][lang=='en']+'</summary>\n\n'+note+'\n\n'+'\n\n'.join(pictures)+'\n\n</details>')
    # Only replace the original single archive, so reruns do not discard other groups.
    if 'Complete image archive' in match[0] or '完整图像档案' in match[0]:
        s=s[:match.start()]+'\n\n'.join(gallery)+s[match.end():]
        p.write_text(s,encoding='utf-8')
    p=ROOT/f'web/src/content/works/periastra.{lang}.md';s=p.read_text(encoding='utf-8');a=s.index('### '+('让图形形成规则' if '### 让图形形成规则' in s else 'Turn graphics into rules')) if lang=='en' or '### 让图形形成规则' in s else -1
    if a>=0:
        z=s.index('<details>',a);piece=s[a:z]
        caption='识别与应用关系的回顾性分析图' if lang=='zh' else 'Retrospective analysis of identity and application relationships'
        piece=re.sub(r'!\[[^\]]*\]\([^)]+\)',f'![{caption}](/media/v7/brand/periastra-logic.webp)',piece)
        s=s[:a]+piece+s[z:];p.write_text(s,encoding='utf-8')
print('Seasonal archives grouped without dropping source images.')
