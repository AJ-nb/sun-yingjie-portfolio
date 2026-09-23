import { useId, useState } from 'react'
import { asset, type Lang } from '../data/workDocs'

type Copy = { zh: string; en: string }
type Application = { id: string; label: Copy; image: string; description: Copy; ratio: string; language?: 'zh' }
type Brand = { name: string; title: Copy; intro: Copy; applications: Application[] }
type OpenPhoto = (photos: { src: string; alt: string }[], index: number) => void
const b = (zh: string, en: string): Copy => ({ zh, en })
const brands: Record<string, Brand> = {
  hermes: {
    name: 'Hermès', title: b('从空间判断，到可以复用的视觉规则。', 'From spatial decisions to reusable visual rules.'),
    intro: b('先分析商品、道具与观看层次，再整理视觉规范和跨画幅应用。原始场景作为共同参照，保留产品与道具的完整造型。', 'Analyze products, props and viewing layers, then organize visual rules and applications. The original scene remains the reference, with objects and props intact.'),
    applications: [
      { id: 'logic', label: b('设计逻辑', 'Design logic'), image: '/media/v7/brand/hermes-logic.webp', ratio: '16 / 11', language: 'zh', description: b('把观看层次拆成前景、中景与背景，说明道具节奏如何服务于商品呈现。', 'Break the scene into foreground, middle ground and background to explain how prop rhythm supports product presentation.') },
      { id: 'system', label: b('视觉规范', 'Visual rules'), image: '/media/v7/brand/hermes-system.webp', ratio: '16 / 11', language: 'zh', description: b('以原始项目为依据整理层级、画幅与留白，明确主体、辅助信息和应用边界。', 'Derive hierarchy, format and spacing from the original project, defining the subject, supporting information and application limits.') },
      { id: 'application', label: b('应用延展', 'Application'), image: '/media/v7/brand/hermes-application.webp', ratio: '4 / 5', language: 'zh', description: b('重组原图与文字的阅读顺序，保留场景完整比例，让视觉叙事进入竖向画幅。', 'Reorganize original imagery and text for a vertical format while preserving the complete proportions of the scene.') },
      { id: 'scene', label: b('空间构成', 'Spatial composition'), image: '/works/legacy/hermes/f1455674fa1906fe49bd555bcad97e9c.webp', ratio: '16 / 9', description: b('保留完整场景，先理解道具节奏、商品位置与观看层次。', 'Keep the complete scene to understand prop rhythm, merchandise placement and viewing layers.') },
    ],
  },
  arcteryx: {
    name: 'Arc’teryx', title: b('环境建立气氛，装备保持主角。', 'Set the atmosphere. Keep the equipment in focus.'),
    intro: b('比较全景与竖幅中的岩壁、曲线和人台位置，观察环境线条如何引导视线。', 'Compare rock, curves and mannequins across formats to see how environmental lines guide attention.'),
    applications: [
      { id: 'logic', label: b('设计逻辑', 'Design logic'), image: '/media/v7/brand/arcteryx-logic.webp', ratio: '16 / 11', language: 'zh', description: b('从环境轮廓、导向曲线到装备主体，分析视线如何穿过空间，以及哪些位置需要减少遮挡。', 'Trace attention from environmental contours and guiding curves to the equipment, identifying where overlap needs restraint.') },
      { id: 'system', label: b('信息组织', 'Information hierarchy'), image: '/media/v7/brand/arcteryx-system.webp', ratio: '16 / 11', language: 'zh', description: b('确定环境、商品与信息各自的位置，让不同触点遵守相同的主次关系。', 'Define the roles of environment, product and information so that the same hierarchy holds across touchpoints.') },
      { id: 'application', label: b('应用延展', 'Application'), image: '/media/v7/brand/arcteryx-application.webp', ratio: '4 / 5', language: 'zh', description: b('通过版式重排适配竖向阅读，保留原场景与装备轮廓，不用拉伸或裁去关键结构换取画幅。', 'Recompose the layout for vertical reading while retaining the original scene and equipment silhouettes without stretching or removing key structures.') },
      { id: 'scene', label: b('空间构成', 'Spatial composition'), image: '/works/legacy/arcteryx/cb880134dd55b4ea48ac6a2c188bf65b.webp', ratio: '16 / 9', description: b('先建立岩壁、层叠曲线与装备之间的前后关系，再检视遮挡与留白。', 'Establish depth between rock, layered curves and equipment, then review overlaps and breathing room.') },
    ],
  },
  'go-glow': {
    name: 'GO GLOW', title: b('产品系统设计解析：从模块组合到使用。', 'Product system analysis: from modules to use.'),
    intro: b('把产品结构、旅行场景与功能说明放进同一阅读顺序，说明共同机身、护理模块与产品界面如何形成完整系统。', 'Place product structure, travel context and function in one reading order, showing how the shared body, care modules and interface form a complete system.'),
    applications: [
      { id: 'logic', label: b('设计逻辑', 'Design logic'), image: '/media/v7/brand/goglow-logic.webp', ratio: '16 / 11', language: 'zh', description: b('围绕旅行中的携带、组合与使用顺序，说明共同机身与不同护理模块之间的关系。', 'Explain the common body and care modules through carrying, combining and using them during travel.') },
      { id: 'system', label: b('信息组织', 'Information hierarchy'), image: '/media/v7/brand/goglow-system.webp', ratio: '16 / 11', language: 'zh', description: b('将产品名称、组合关系和使用场景分层，使说明与实体产品结构保持一致。', 'Separate product names, combinations and use contexts so that the information reflects the physical system.') },
      { id: 'application', label: b('应用延展', 'Application'), image: '/media/v7/brand/goglow-application.webp', ratio: '4 / 5', language: 'zh', description: b('以原始产品图建立详情阅读顺序，先整体、后模块、再场景，避免功能说明掩盖产品。', 'Build the detail-page sequence from original product visuals: the whole system, then modules and context, keeping the product visible.') },
      { id: 'overview', label: b('产品总览', 'Product overview'), image: '/works/documents/portfolio-51/036.webp', ratio: '4 / 3', description: b('先辨认产品组合与共同形态，再进入不同模块的使用。', 'Recognize the shared form and product set before exploring each module.') },
    ],
  },
}

export function BrandWorkbench({ slug, lang, openPhoto }: { slug: string; lang: Lang; openPhoto: OpenPhoto }) {
  const brand = brands[slug]
  return brand ? <ApplicationBody key={slug} brand={brand} lang={lang} openPhoto={openPhoto}/> : null
}

function ApplicationBody({ brand, lang, openPhoto }: { brand: Brand; lang: Lang; openPhoto: OpenPhoto }) {
  const [selected, setSelected] = useState(0), id = useId(), current = brand.applications[selected]
  const imageTitle = `${brand.name} — ${current.label[lang]}`
  const photos = brand.applications.map(application => ({ src: application.image, alt: `${brand.name} — ${application.label[lang]}` }))
  return <section className="brand-workbench" aria-labelledby={`${id}-title`}>
    <header><span>{lang === 'zh' ? '设计延展 / 2026.09' : 'Design extensions / 2026.09'}</span><h2 id={`${id}-title`}>{brand.title[lang]}</h2><p>{brand.intro[lang]}</p></header>
    <div className="brand-workbench-body"><div className="brand-format-controls" role="group" aria-label={lang === 'zh' ? '比较应用画幅' : 'Compare application formats'}>{brand.applications.map((application, index) => <button type="button" key={application.id} aria-pressed={selected === index} aria-controls={`${id}-application`} onClick={() => setSelected(index)}>{application.label[lang]}</button>)}</div>
      <div id={`${id}-application`} className={`brand-application brand-format-${current.id}`}>
        <figure><button type="button" className="media-button brand-image-trigger" aria-label={`${lang === 'zh' ? '放大图片' : 'Enlarge image'}: ${imageTitle}`} onClick={() => openPhoto(photos, selected)}><img src={asset(current.image)} alt={imageTitle} loading="lazy" decoding="async"/></button><figcaption className="image-caption"><span>{imageTitle}</span><small>{lang === 'zh' ? '查看大图' : 'View full image'} <span aria-hidden="true">↗</span></small></figcaption></figure>
        <div className="brand-application-copy" aria-live="polite"><h3>{current.label[lang]}</h3><p>{current.description[lang]}</p>{lang === 'en' && current.language === 'zh' && <p className="brand-language-note">Chinese diagram; the design rationale is summarized here in English.</p>}</div>
      </div>
    </div>
  </section>
}
