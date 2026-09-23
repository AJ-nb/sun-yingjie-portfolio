import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundled = createRequire('C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json')
const webRequire = createRequire(path.join(root, 'web/package.json'))
const sharp = bundled('sharp'), { optimize } = webRequire('svgo')
const out = path.join(root, 'web/public/media/v7/brand'), editable = path.join(root, 'deliverables/brand-v7/layouts')
await mkdir(out, { recursive: true }); await mkdir(editable, { recursive: true })
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const text = (x,y,value,size=24,fill='#202421',weight=400) => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}">${esc(value)}</text>`
const lines = (x,y,values,size=23,fill='#53605b',step=35) => values.map((value,i)=>text(x,y+i*step,value,size,fill)).join('')
const rect = (x,y,w,h,fill,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${rx}"/>`
const line = (x1,y1,x2,y2,color='#bac2bd') => `<path d="M${x1} ${y1}H${x2}" stroke="${color}" stroke-width="2"/>`
const sourceRecords = []
async function photo(src,x,y,w,h,bg='#fff') {
  const bytes = await readFile(path.join(root,'web/public',src)); const embedded = await sharp(bytes).resize({width:1600,withoutEnlargement:true}).png().toBuffer()
  sourceRecords.push({path:src,sha256:createHash('sha256').update(bytes).digest('hex')})
  return rect(x,y,w,h,bg)+`<image xlink:href="data:image/png;base64,${embedded.toString('base64')}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`
}
function canvas(w,h,body,bg='#f5f5ef') { return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${rect(0,0,w,h,bg)}<g font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif">${body}</g></svg>` }
const assets=[]
async function exportBoard(id,svg) {
  const optimized=optimize(svg,{multipass:true,plugins:['preset-default']}).data
  await writeFile(path.join(editable,id+'.svg'),optimized)
  const target=path.join(out,id+'.webp');await sharp(Buffer.from(optimized)).webp({quality:91}).toFile(target)
  assets.push({id,path:'/media/v7/brand/'+id+'.webp',bytes:(await readFile(target)).length,origin:'original-media-and-authored-diagram',productGeometry:'unaltered',purpose:'Design analysis and application system',sha256:createHash('sha256').update(await readFile(target)).digest('hex')})
}
const cases=[
 {id:'hermes',name:'Hermès',title:'让季节叙事成为商品的观看路径',color:'#006879',pale:'#e3eeec',photo:'/works/legacy/hermes/f1455674fa1906fe49bd555bcad97e9c.webp',other:'/works/legacy/hermes/40379d8484144b6a435498fcf8b9d857.webp',
  decisions:[['识别焦点','白马大轮廓建立远距离识别','黄色包袋留在前景右侧'],['组织层次','鬃毛切片与投影叠出体量','蓝绿背景让白色轮廓清晰'],['延续叙事','小马与滑雪剪影形成尺度差','道具、商品和场景相互呼应']],
  stages:['季节主题','整体设计稿','法国方面沟通','工厂生产衔接','门店与商场展示'],
  palette:[['#e6e7df','白色层面'],['#006879','蓝绿背景'],['#eeb443','商品暖色'],['#d9b6bb','局部点缀']],
  rules:[['图像','完整窗幅优先；道具与商品同时可见'],['文字','置于场景外的独立信息区'],['图形','由现有切片和曲线提取构成节奏'],['适配','调整图文关系，保留原图宽高比例']],
  appTitle:'冬季的空间叙事',appSub:'从完整橱窗，读懂层次与商品位置',appBody:['轮廓建立识别，层次建立故事。','以实际展示为核心，组织品牌、商品与空间的关系。']},
 {id:'arcteryx',name:'Arc’teryx',title:'让环境有张力，让装备被看见',color:'#46594c',pale:'#e5e9e1',photo:'/works/legacy/arcteryx/cb880134dd55b4ea48ac6a2c188bf65b.webp',
  decisions:[['环境语义','岩壁块面与横向线组传递地形','场景聚焦户外装备的使用语境'],['主体识别','人台与登山杖留在前景','紫色上装与岩壁形成色彩区分'],['画幅控制','保留品牌标识和完整窗框','信息排版顺应原有竖向构成']],
  stages:['户外方向','空间方案','法国方面沟通','工厂生产衔接','终端展示协同'],
  palette:[['#252c2e','深色框景'],['#969d9b','岩壁灰色'],['#869054','地面绿色'],['#a1a1c5','服装紫色']],
  rules:[['图像','保留人台、装备和地形的上下文'],['文字','按品牌、主题、装备说明建立三级'],['图形','以现有横向线组作为分析依据'],['适配','竖幅整图嵌入横幅；禁止横向拉伸']],
  appTitle:'装备与地形的关系',appSub:'Alpha Center 空间设计解析',appBody:['岩壁构成背景，线组连接空间，','装备与身体关系成为观看的终点。']},
 {id:'goglow',name:'GO GLOW',title:'让系列一致，让用途一眼可辨',color:'#806794',pale:'#eee9f2',photo:'/works/refinement-v2/rendering-pdf/006.webp',other:'/works/documents/portfolio-51/035.webp',
  decisions:[['识别共性','白紫配色与手柄语言保持系列感','相同视觉秩序降低辨认负担'],['区分用途','牙刷、洁面与头皮护理端部各异','用接触几何区分模块功能'],['连接体验','模块名称与界面模式建立对应','从准备、使用到清洁收纳串联']],
  stages:['旅行情境','护理任务拆解','模块与草图','配套界面','系列与使用表达'],
  palette:[['#f5f5f3','主体白色'],['#c2abd5','护理紫色'],['#29232d','深色文字'],['#e4d493','接口暖色']],
  rules:[['图像','首先显示完整模块，再呈现关系'],['文字','名称、用途、操作信息分层'],['图形','用相同尺度比较模块与握持主体'],['适配','功能说明独立排版；不添加功效数据']],
  appTitle:'日常与出行，一套护理语言',appSub:'模块化个护产品与信息体系',appBody:['牙刷 / 洁面 / 头皮护理','通过共同形态连接系列，通过端部差异区分用途。']}
]
for(const c of cases) {
  let b=text(64,72,c.name,27,c.color,600)+text(64,138,c.title,44,'#202421',600)+text(64,183,'设计逻辑 · 从成品与原稿中展开的决策解析',23)
  b+=await photo(c.photo,64,228,830,620,c.id==='goglow'?'#fff':'#151816')
  c.decisions.forEach((d,i)=>{let y=252+i*193;b+=text(960,y,String(i+1).padStart(2,'0'),22,c.color,600)+text(1010,y,d[0],28,'#202421',600)+lines(960,y+54,d.slice(1),24)+line(960,y+137,1536,y+137)})
  b+=text(64,906,c.id==='goglow'?'从需求情境到系统表达':'从设计方向到展示落地',26,'#202421',600)
  c.stages.forEach((s,i)=>{const x=64+i*301;b+=rect(x,941,269,67,c.pale,8)+text(x+18,983,s,23,c.color,500);if(i<4)b+=text(x+279,984,'→',23,c.color)})
  b+=text(64,1060,c.id==='goglow'?'产品形态与原稿保持一致；方案阶段为概念设计。':'职责范围：方向与整体设计稿 / 约 8 人团队 / 方案沟通 / 生产与展示衔接',20)
  await exportBoard(c.id+'-logic',canvas(1600,1100,b))
  b=text(64,73,c.name,27,c.color,600)+text(64,142,'从单张作品，到可复用的视觉秩序',44,'#202421',600)+text(64,189,'案例应用规范 · 图像、色彩、文字与跨画幅规则',23)
  b+=await photo(c.photo,64,233,600,583,c.id==='goglow'?'#fff':'#151816')
  b+=text(64,854,'完整图像作为主资产',24,'#202421',600)+text(64,893,'保留造型、比例和关键展示细节。',23)
  c.palette.forEach((v,i)=>{let x=736+i*199;b+=rect(x,239,177,99,v[0],4)+text(x,372,v[1],21)+text(x,406,v[0].toUpperCase(),18)})
  c.rules.forEach((r,i)=>{let y=479+i*104;b+=text(736,y,r[0],23,c.color,600)+text(846,y,r[1],22)+line(736,y+33,1536,y+33)})
  b+=rect(64,945,1472,93,c.pale,8)+text(86,986,'复用方式',24,c.color,600)+text(252,986,'原图资产 → 规范规则 → 横幅 / 竖幅 / 详情说明 → 版本归档',24,c.color)+text(252,1018,'色彩为展示图的视觉归纳，用于本案例的叙事版式。',18,c.color)
  await exportBoard(c.id+'-system',canvas(1600,1100,b))
  b=text(64,90,c.name,32,c.color,600)+text(64,168,c.appTitle,42,'#202421',600)+text(64,217,c.appSub,24)
  b+=await photo(c.photo,64,269,1072,891,c.id==='goglow'?'#fff':'#151816')
  b+=lines(64,1238,c.appBody,28,'#202421',46)+line(64,1340,1136,1340)+text(64,1393,'Yingjie Sun / 品牌、产品与展示体验',22,c.color)+text(64,1435,'应用延展 · 原图与独立信息区',20)
  await exportBoard(c.id+'-application',canvas(1200,1500,b))
}
// Other identity / digital cases use their exact original logo and UI assets.
try {
  const inputs=JSON.parse(await readFile(path.join(root,'docs/visual-logic-inputs-v7.json'),'utf8'))
  for(const c of (Array.isArray(inputs)?inputs:inputs.cases).filter(c=>['biyuan','periastra','yelisi'].includes(c.slug))) {
    let b=text(64,72,c.title,32,'#235b49',600)+text(64,142,'从品牌方向，到界面与应用系统',44,'#202421',600)
    b+=await photo(c.image,64,210,810,650)
    c.decisions.slice(0,4).forEach((d,i)=>{const y=233+i*164;const body=String(d.body).split('。')[0]+'。';b+=text(940,y,d.title,26,'#235b49',600)+lines(940,y+47,body.match(/.{1,23}/gu).slice(0,3),23)})
    b+=text(64,916,'系统组织',26,'#202421',600)
    ;['目标与定位','识别规则','界面与产品表达','应用比较','规范与交付'].forEach((s,i)=>{const x=64+i*301;b+=rect(x,947,269,70,'#e3ece7',8)+text(x+16,991,s,22,'#235b49')})
    b+=text(64,1060,'设计解析 / 原始标志、界面和产品形态保持不变',20)
    await exportBoard(c.slug+'-logic',canvas(1600,1100,b))
  }
} catch(error) { if(error.code!=='ENOENT') throw error }
await writeFile(path.join(root,'web/public/media/v7/manifest.json'),JSON.stringify({edition:'v7',assets},null,2))
await writeFile(path.join(root,'deliverables/brand-v7/layout-evidence.json'),JSON.stringify({edition:'v7',principle:'Original product and installed images are primary; shapes and aspect ratios are unchanged. These are authored design analyses and application layouts, not historical sketch or testing records.',sources:[...new Map(sourceRecords.map(x=>[x.path,x])).values()],assets},null,2))
console.log(`Exported ${assets.length} original-media design boards`)
