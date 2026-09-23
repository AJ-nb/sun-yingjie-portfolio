"""Apply the approved v9 shared-content and routing migration once."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
def read(p):return (ROOT/p).read_text(encoding='utf-8-sig')
def write(p,s):(ROOT/p).write_text(s,encoding='utf-8')
def load(p):return json.loads(read(p))
def save(p,d):write(p,json.dumps(d,ensure_ascii=False,indent=2)+'\n')
publication=load('web/src/data/publication.json')
selection=['hermes','arcteryx','karimoku','lighting','yelisi','periastra','biyuan','ai-video-systems']
publication.update(edition='portfolio-v9',homepageSelection=selection,portfolioPdfDeferredSlugs=[],portfolioPdfSnapshotExemptions={},portfolioPdfDeferralReason='All current public cases are included in the complete bilingual archive.')
overview=[('hermes',['summer','autumn','winter','delivery']),('arcteryx',['layers','coordination','installation']),('karimoku',['foundation','material','space']),('lighting',['family','materials']),('yelisi',['identity','product']),('periastra',['exploration','wordmark']),('biyuan',['home','models','mobile']),('ai-video-systems',['control','evaluation'])]
publication['editions']['overview'].update(title='工业与产品设计师 · 精选作品',cases=[{'slug':s,'pageIds':p} for s,p in overview],pageCount=33)
publication['selected']=[{'slug':s,'pages':1+len(p),'focus':s} for s,p in overview]
publication['selectedPageCount']=33
publication['editions']['digital']['cases'][0]['pageIds']=['interface','models']
publication['editions']['digital']['cases'].append({'slug':'ai-video-systems','pageIds':['control','evaluation']})
publication['editions']['digital']['pageCount']=24
save('web/src/data/publication.json',publication)

p=load('web/src/data/profile.json')
p['position']={'zh':'工业与产品设计师','en':'Industrial & Product Designer'}
p['summary']={'zh':'我设计实体产品、视觉系统与 AI 工作流，连接形态、CMF、三维与品牌。以使用情境和材料为起点，通过模型、原型与方案比较推进设计。','en':'I design physical products, visual systems and AI-native workflows, connecting form, CMF, 3D and brand. I start with use and materials, then develop ideas through models, prototypes and comparison.'}
p['about']={'zh':['我关注物件如何被使用，也关注它如何进入更大的视觉和空间系统。形态、比例、材料与触感必须回应具体情境。','在产品、商业空间与品牌之间工作，让我习惯同时比较局部细节和整体关系：一个截面如何形成系列，一套识别如何进入产品，一种空间语言如何服务商品。','我把 AI 当作研究和制作流程的一部分：整理参考、生成变体、辅助实现，再由人判断和核验。设计的价值最终体现在选择与取舍中。'],'en':['I care about how an object is used and how it belongs to a larger visual or spatial system. Form, proportion, materials and touch need to respond to a particular context.','Working across products, commercial spaces and brands has taught me to compare details with the whole: how a section becomes a family, an identity reaches a product, or a spatial language supports merchandise.','I use AI within research and production: organising references, exploring variants and supporting implementation, then reviewing the results. The value of design lies in the choices we make.']}
experiences={
'liling':{'zh':['负责彼源 AI 的 VI/UI 设计与迭代。','与团队推进 Periastra 品牌识别与信息系统、夜礼司品牌视觉、产品概念与 CMF 研究。'],'en':['Design and iterate Biyuan AI’s visual identity and UI.','Collaborate on Periastra identity and information systems, and YELISI brand, product concepts and CMF studies.']},
'benwu':{'zh':['参与 Hermès、Arc’teryx 橱窗项目的三维设计和视觉呈现。','参与铝型材灯具的三维表达与材料比较；整理 Karimoku × BENWU 设计研究。'],'en':['Contributed 3D design and visual presentation to Hermès and Arc’teryx window projects.','Developed lighting visualisations and material comparisons; organised the Karimoku × BENWU design study.']},
'hannstar':{'zh':['在 PCB 制造环境中从事设计系统工程工作，关注标准化、工程约束、质量与跨部门协作。'],'en':['Worked on design-systems engineering in PCB manufacturing, within standardisation, engineering and quality constraints.']},
'ouyin':{'zh':['整理市场调研与用户反馈，制作 Figma 交互原型，支持需求比较与体验迭代。'],'en':['Organised market research and user feedback; built Figma prototypes to support design comparisons and iteration.']}}
p['resume']['experience']={k:v['zh'] for k,v in experiences.items()}
p['resume']['experienceLocalized']={lang:{k:v[lang] for k,v in experiences.items()} for lang in ['zh','en']}
p['resume']['summary']=p['summary']['zh']
for item in p['timeline']:
 if item['id'] in experiences:item['description']={lang:' '.join(experiences[item['id']][lang]) for lang in ['zh','en']}
titles={'general':('工业与产品设计师','Industrial & Product Designer'),'brand':('工业与产品设计师 · 品牌视觉方向','Industrial & Product Designer | Visual Systems'),'product':('工业与产品设计师 · 实体产品方向','Industrial & Product Designer | Physical Products'),'digital':('工业与产品设计师 · 数字体验方向','Industrial & Product Designer | Digital Experience')}
for variant in p['resume']['variants']:
 variant['title']=dict(zip(['zh','en'],titles[variant['id']]))
 variant['summary']=p['summary']
save('web/src/data/profile.json',p)

s=read('web/src/data/profile.ts')
s=s.replace("const details = zh ? canonicalProfile.resume.experience : editorial.en.experienceDetails", "const details = canonicalProfile.resume.experienceLocalized[lang]")
s=s.replace('narrative: copy.narrative,','narrative: canonicalProfile.about[lang],')
s=s.replace('capabilities: copy.capabilities,','capabilities: [copy.capabilities.find(item => item.id === \'product-system\') ?? copy.capabilities[1], copy.capabilities[0], copy.capabilities.find(item => item.id.includes(\'ai\')) ?? copy.capabilities[copy.capabilities.length - 1]],')
s=s.replace('statement: copy.statement,','statement: canonicalProfile.summary[lang],')
s=s.replace('title: copy.title,',"title: zh ? '从形态到系统。' : 'From form to system.',")
write('web/src/data/profile.ts',s)

s=read('web/src/data/projectRegistry.ts').replace("import { FEATURED", "import publication from './publication.json'\nimport { FEATURED")
s=s.replace('return PRIMARY_WORK_ORDER.flatMap(slug => {','return publication.homepageSelection.flatMap(slug => {',1)
s=s.replace('return getDesignOSFeaturedProjects()','return PRIMARY_WORK_ORDER.flatMap(slug => { const project = getProject(slug); return project ? [project] : [] })')
write('web/src/data/projectRegistry.ts',s)

s=read('web/src/ui/DesignOSRoutes.tsx')
s=s.replace("import './design-os-routes.css'", "import { SiteHeader, SiteFooter } from './SiteChrome'\nimport { localePath } from '../data/locale'")
s=s.replace("const routeHref = (path: string, lang: Lang) => `${path}${lang === 'en' ? '?lang=en' : ''}`",'const routeHref = localePath')
s=re.sub(r'  const toggle =.*?  return <div className="design-os-shell">','  return <div className="design-os-shell">',s,flags=re.S)
s=re.sub(r'    <header className="design-os-header">.*?</header>', '    <SiteHeader lang={lang} pathname={route.pathname}/>',s,flags=re.S)
s=re.sub(r'    <footer className="design-os-footer">.*?</footer>', '    <SiteFooter lang={lang}/>',s,flags=re.S)
s=re.sub(r'function isRouteInSection\(.*?\n}\n','',s,flags=re.S)
s=s.replace("  if (route.name === '404')", "  if (route.name === 'systems') return <Systems lang={lang}/>\n  if (route.name === '404')",1)
credit='<div className="design-os-detail-credit"><span>{lang === \'zh\' ? \'署名与边界\' : \'Credits & boundary\'}</span><p>{b(lang, project.credits)}</p></div>'
s=s.replace('    '+credit+'\n','')
s=s.replace('    {links.length > 0 && <div className="design-os-detail-source">','    <section className="design-os-detail-credit"><span>{lang === \'zh\' ? \'署名与背景\' : \'Credits & Context\'}</span><p>{b(lang, project.credits)}</p><p>{b(lang, project.provenance)}</p><p>{lang === \'zh\' ? \'资料等级\' : \'Evidence\'}: Level {project.evidenceLevel} · {project.sourceKind}</p><p>{b(lang, project.publicBoundary)}</p><p>AI / Human: {b(lang, project.aiRole)} {b(lang, project.humanGates).join(\'; \')}</p></section>\n    {links.length > 0 && <div className="design-os-detail-source">')
s=s.replace('quickSummary.map(([label, value])','quickSummary.filter(([, value]) => value !== \'—\').map(([label, value])')
s=s.replace("getRelatedProjects(project.slug, lang).filter(item => baseAllowsProject(basePath, item)).slice(0, 3)","getRelatedProjects(project.slug, lang).filter(item => baseAllowsProject(basePath, item)).slice(0, 2)")
s=s.replace("const files = downloads.items.filter(item => item.variant === 'overview' && (item.type === 'resume' || item.id === 'portfolio-overview'))", "const files = downloads.items.filter(item => (('lang' in item ? item.lang : 'zh') === lang))")
s=s.replace("intro={lang === 'zh' ? `Design Lead｜工业与产品设计 · 3D · CMF · 品牌。${profile.asOf}。` : `Design Lead | Industrial & Product Design · 3D · CMF · Brand. ${profile.asOf}.`}","intro={profile.position + ' · 3D · CMF · ' + (lang === 'zh' ? '品牌。' : 'Brand. ') + profile.asOf}")
s=s.replace("title={lang === 'zh' ? '孙英杰 / YINGJIE SUN' : 'YINGJIE SUN / 孙英杰'}", "title={lang === 'zh' ? '孙英杰 / YINGJIE SUN' : 'YINGJIE SUN'}")
s=s.replace("title={lang === 'zh' ? 'OBJECT NOT FOUND' : 'OBJECT NOT FOUND'}", "title={lang === 'zh' ? '页面未找到' : 'Page not found'}")
s += '''\nfunction Systems({ lang }: { lang: Lang }) {
  const slugs = ['ai-video-systems', 'resume-formatter', 'lensflow', 'formline', 'xintiao']
  return <RouteFrame eyebrow={lang === 'zh' ? '系统与工作流' : 'Systems & workflows'} title={lang === 'zh' ? '让方法可以复用。' : 'Make the method reusable.'} intro={lang === 'zh' ? '从故事与镜头控制，到可审阅的内容改写和可恢复的任务流程。工具服务于设计判断。' : 'From story and camera control to reviewable writing and recoverable tasks. Tools support design judgment.'} lang={lang}>
    <div className="systems-grid">{slugs.map(slug => { const project = getProject(slug)!; return <article key={slug}><a href={routeHref('/work/' + slug, lang)}><img src={asset(project.cover)} alt={project.title[lang]} loading="lazy"/><h2>{project.title[lang]}</h2><p>{project.summary[lang]}</p><span className="design-os-card-link">{lang === 'zh' ? '阅读方法与案例' : 'Explore the method'}<ArrowUpRight size={16}/></span></a><p>{maturityLabels[project.maturity][lang]} · {project.demoMode === 'precomputed' ? (lang === 'zh' ? '预计算演示' : 'Precomputed demo') : project.roleScope[lang]}</p></article> })}</div>
    <a className="design-os-text-link" href={routeHref('/research', lang)}>{lang === 'zh' ? '继续阅读研究档案' : 'Explore the research archive'}<ArrowUpRight size={16}/></a>
  </RouteFrame>
}\n'''
write('web/src/ui/DesignOSRoutes.tsx',s)
write('web/src/ui/HomeDesignOS.tsx',"export { HomeDesignOS } from './HomePortfolio'\n")

s=read('web/src/data/siteMetadata.ts')
s="import { localePath, languageAlternates } from './locale'\nimport profile from './profile.json'\n"+s
s=s.replace("  type: PageType\n}","  type: PageType\n  alternates?: Record<string, string>\n}")
s=s.replace("const DEFAULT_TITLE = { zh: '孙英杰 Yingjie Sun | Design Lead｜工业与产品设计', en: 'Yingjie Sun | Design Lead — Industrial & Product Design' }", "const DEFAULT_TITLE = { zh: '孙英杰 | 工业与产品设计师', en: 'Yingjie Sun | Industrial & Product Designer' }")
s=re.sub(r'const DEFAULT_DESCRIPTION = \{.*?\n}', 'const DEFAULT_DESCRIPTION = profile.summary', s, count=1,flags=re.S)
s=s.replace("const pageCopy: Record", "const pageCopy: Record")
s=s.replace("  '/work':", "  '/systems': { title: { zh: '系统与工作流 | 孙英杰', en: 'Systems & workflows | Yingjie Sun' }, description: { zh: '用于创作、比较和审阅的设计工具与 AI 工作流。', en: 'Design tools and AI workflows for creation, comparison and review.' }, type: 'CollectionPage' },\n  '/work':",1)
s=s.replace('Design Lead｜工业与产品设计','工业与产品设计师').replace('About Yingjie Sun | Design Lead','About Yingjie Sun | Industrial & Product Designer')
s=s.replace('`${SITE_ORIGIN}${pathname}`','`${SITE_ORIGIN}${localePath(pathname, lang)}`')
s=s.replace('`${SITE_ORIGIN}${projectPathname(route, project.slug)}`','`${SITE_ORIGIN}${localePath(`/work/${project.slug}`, lang)}`')
s=s.replace("`${SITE_ORIGIN}${pathname === '/' ? '/' : pathname}`",'`${SITE_ORIGIN}${localePath(pathname, lang)}`')
s=s.replace("    type: 'CreativeWork',","    type: 'CreativeWork', alternates: languageAlternates(`/work/${project.slug}`, SITE_ORIGIN),")
s=s.replace('noindex: Boolean(item.noindex), type: item.type,','noindex: Boolean(item.noindex), type: item.type, alternates: languageAlternates(pathname, SITE_ORIGIN),')
s=re.sub(r'function projectPathname\(.*?\n}\n','',s,flags=re.S)
s=s.replace("jobTitle: lang === 'zh' ? '工业与产品设计师' : 'Design Lead | Industrial & Product Design'", "jobTitle: profile.position[lang]")
write('web/src/data/siteMetadata.ts',s)
print('Updated shared profile, selection, route shell and metadata sources')
