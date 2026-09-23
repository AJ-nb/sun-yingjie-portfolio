/**
 * Keeps the user-supplied visual-board archive consistent across public case
 * studies, the full PDF source mapping and the evidence register.
 *
 * Source files are copied into web/public/works/boards by the intake step.
 * This script deliberately never makes a client, production or commercial
 * claim: every board is retained as Level C retrospective reconstruction.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = path.join(ROOT, 'web', 'src', 'content', 'works')
const PUBLIC = path.join(ROOT, 'web', 'public')
const evidencePath = path.join(ROOT, 'web', 'src', 'data', 'evidence-register.json')
const publicationPath = path.join(ROOT, 'web', 'src', 'data', 'publication-pages.json')
const evidenceDocPath = path.join(ROOT, 'docs', 'evidence-register.md')
const CHECK = process.argv.includes('--check')

const projects = [
  { slug: 'karimoku', zh: 'Karimoku × BENWU', en: 'Karimoku × BENWU', groups: [{ id: 'all', zh: '完整档案', en: 'Complete archive', count: 20, prefix: '/works/boards/karimoku/karimoku-' }] },
  { slug: 'periastra', zh: 'Periastra', en: 'Periastra', groups: [{ id: 'all', zh: '完整档案', en: 'Complete archive', count: 15, prefix: '/works/boards/periastra/periastra-' }] },
  { slug: 'arcteryx', zh: 'Arc’teryx Mountain Performance Field', en: 'Arc’teryx Mountain Performance Field', groups: [{ id: 'all', zh: '完整档案', en: 'Complete archive', count: 10, prefix: '/works/boards/arcteryx/arcteryx-' }] },
  { slug: 'yelisi', zh: 'YELISI', en: 'YELISI', groups: [{ id: 'all', zh: '完整档案', en: 'Complete archive', count: 20, prefix: '/works/boards/yelisi/yelisi-' }] },
  { slug: 'hermes', zh: 'Hermès Seasonal Window Worlds', en: 'Hermès Seasonal Window Worlds', groups: [
    { id: 'summer', zh: '夏季 / Graphic Energy', en: 'Summer / Graphic Energy', count: 10, prefix: '/works/boards/hermes/summer/hermes-summer-' },
    { id: 'autumn', zh: '秋季 / Surreal Domestic World', en: 'Autumn / Surreal Domestic World', count: 10, prefix: '/works/boards/hermes/autumn/hermes-autumn-' },
    { id: 'winter', zh: '冬季 / Equestrian Frozen Landscape', en: 'Winter / Equestrian Frozen Landscape', count: 10, prefix: '/works/boards/hermes/winter/hermes-winter-' },
  ] },
]

function assetsFor(project) {
  return project.groups.flatMap(group => Array.from({ length: group.count }, (_, i) => ({
    src: `${group.prefix}${String(i + 1).padStart(2, '0')}.webp`,
    group,
    index: i + 1,
  })))
}

function archiveMarkdown(project, lang) {
  const label = lang === 'zh' ? '完整视觉档案' : 'Complete visual archive'
  const boundary = lang === 'zh'
    ? `以下 ${assetsFor(project).length} 张图像由作品集作者提供并授权用于本网站展示。它们均为 Level C 回顾性重建版式，不作为官方委托、生产、装置落地或商业结果的证据。`
    : `The ${assetsFor(project).length} images below were supplied by the portfolio author for display on this site. They are all Level C retrospective boards and do not establish an official commission, production, installation or commercial outcome.`
  const groups = project.groups.map(group => {
    const groupHeading = project.groups.length > 1 ? `\n#### ${lang === 'zh' ? group.zh : group.en}\n` : ''
    const items = assetsFor(project).filter(asset => asset.group === group).map(asset => {
      const caption = lang === 'zh'
        ? `${project.zh}｜用户提供回顾性版式 ${String(asset.index).padStart(2, '0')} / ${String(group.count).padStart(2, '0')}`
        : `${project.en} | user-supplied retrospective board ${String(asset.index).padStart(2, '0')} / ${String(group.count).padStart(2, '0')}`
      return `<img src="${asset.src}" alt="${caption}" loading="lazy" />`
    }).join('\n')
    return `${groupHeading}\n<div class="design-os-board-archive" data-board-project="${project.slug}" data-board-group="${group.id}">\n${items}\n</div>`
  }).join('\n')
  return `<!-- BOARD-ARCHIVE:${project.slug}:START -->\n### ${label}\n\n${boundary}\n${groups}\n<!-- BOARD-ARCHIVE:${project.slug}:END -->`
}

function replaceBlock(source, start, end, block) {
  const startIndex = source.indexOf(start)
  const endIndex = source.indexOf(end)
  if (startIndex === -1 && endIndex === -1) return `${source.trimEnd()}\n\n${block}\n`
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) throw new Error(`Malformed generated archive markers: ${start}`)
  return `${source.slice(0, startIndex)}${block}${source.slice(endIndex + end.length)}`
}

function writeIfChanged(file, content) {
  const current = fs.readFileSync(file, 'utf8')
  if (current !== content && !CHECK) fs.writeFileSync(file, content, 'utf8')
  return current !== content
}

function updateCaseStudies() {
  let changed = 0
  for (const project of projects) {
    for (const lang of ['zh', 'en']) {
      const file = path.join(CONTENT, `${project.slug}.${lang}.md`)
      const source = fs.readFileSync(file, 'utf8')
      const start = `<!-- BOARD-ARCHIVE:${project.slug}:START -->`
      const end = `<!-- BOARD-ARCHIVE:${project.slug}:END -->`
      const next = replaceBlock(source, start, end, archiveMarkdown(project, lang))
      if (writeIfChanged(file, next)) changed++
    }
  }
  return changed
}

function boardCaption(project, asset) {
  const group = project.groups.length > 1 ? ` / ${asset.group.en}` : ''
  return `${project.en}${group} / user-supplied retrospective board ${String(asset.index).padStart(2, '0')} of ${String(asset.group.count).padStart(2, '0')} / Level C`
}

function updatePublicationMap() {
  const mapping = JSON.parse(fs.readFileSync(publicationPath, 'utf8'))
  for (const project of projects) {
    const boards = assetsFor(project).map(asset => ({ src: asset.src, caption: boardCaption(project, asset) }))
    const existing = mapping.archiveImages[project.slug] ?? []
    mapping.archiveImages[project.slug] = [...existing.filter(item => !item.src.startsWith('/works/boards/')), ...boards]
  }
  const addBoard = (slug, pageId, src, caption) => {
    const page = mapping.casePages[slug]?.find(item => item.id === pageId)
    if (!page) throw new Error(`Missing publication page ${slug}/${pageId}`)
    page.images = [{ src, caption }, ...page.images.filter(item => !item.src.startsWith('/works/boards/'))].slice(0, 2)
  }
  addBoard('periastra', 'exploration', '/works/boards/periastra/periastra-01.webp', 'Periastra / user-supplied retrospective board 01 of 15 / Level C')
  addBoard('arcteryx', 'layers', '/works/boards/arcteryx/arcteryx-01.webp', 'Arc’teryx / user-supplied retrospective board 01 of 10 / Level C')
  addBoard('yelisi', 'product', '/works/boards/yelisi/yelisi-01.webp', 'YELISI / user-supplied retrospective board 01 of 20 / Level C')
  const kari = mapping.casePages.karimoku
  for (const [page, index] of [[kari.find(item => item.id === 'foundation'), 1], [kari.find(item => item.id === 'material'), 7], [kari.find(item => item.id === 'space'), 15]]) {
    if (!page) throw new Error('Missing Karimoku publication page')
    page.images = [{ src: `/works/boards/karimoku/karimoku-${String(index).padStart(2, '0')}.webp`, caption: `Karimoku × BENWU / user-supplied retrospective board ${String(index).padStart(2, '0')} of 20 / Level C` }]
  }
  const next = `${JSON.stringify(mapping, null, 2)}\n`
  return writeIfChanged(publicationPath, next)
}

function publicPathFor(record) {
  const index = String(record.id.match(/-(\d+)$/)?.[1] ?? '').padStart(2, '0')
  if (!index) return null
  if (record.projectSlug === 'hermes') {
    const season = String(record.groupId).replace(/^hermes-/, '')
    return `/works/boards/hermes/${season}/hermes-${season}-${index}.webp`
  }
  if (['karimoku', 'periastra', 'arcteryx', 'yelisi'].includes(record.projectSlug)) return `/works/boards/${record.projectSlug}/${record.projectSlug}-${index}.webp`
  return null
}

function updateEvidenceRegister() {
  const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'))
  const archiveRecords = evidence.assets ?? []
  let updated = 0
  for (const record of archiveRecords) {
    const publicPath = publicPathFor(record)
    if (!publicPath) continue
    if (!fs.existsSync(path.join(PUBLIC, publicPath.slice(1)))) throw new Error(`Missing public board: ${publicPath}`)
    Object.assign(record, {
      availability: 'public-portfolio',
      public: true,
      publicPath,
      publicBoundary: 'User-authorized portfolio display as a Level C retrospective board; not evidence of official commission, production, installation or commercial outcome.',
      rightsStatus: 'Supplied by the portfolio author for public portfolio display; third-party/client rights and project identity remain unverified.',
      altStatus: 'Authored in the bilingual public visual archive.',
    })
    updated++
  }
  for (const group of evidence.groups ?? []) {
    if (!projects.some(project => project.slug === group.projectSlug)) continue
    group.evidence = {
      ...group.evidence,
      publicBoundary: 'User-authorized portfolio display as a Level C retrospective board; not evidence of official commission, production, installation or commercial outcome.',
    }
    if (!String(group.note ?? '').includes('Public display is authorized by the portfolio author')) {
      group.note = `${group.note ?? ''} Public display is authorized by the portfolio author; the original provenance boundary remains.`.trim()
    }
  }
  evidence.releaseRule = 'User-supplied boards may be published when the portfolio author directs public display, each board has an authored caption and alt text, and the public copy preserves the Level C retrospective boundary. Publication does not establish client rights, commission, production, installation or commercial outcome.'
  evidence.publicBoardArchive = { count: updated, evidenceLevel: 'C', publicBoundary: 'user-authorized portfolio display; retrospective reconstruction only', updatedAt: '2026-09-22' }
  const next = `${JSON.stringify(evidence, null, 2)}\n`
  return { changed: writeIfChanged(evidencePath, next), updated }
}

function updateEvidenceDoc() {
  const start = '<!-- USER-BOARD-ARCHIVE:START -->'
  const end = '<!-- USER-BOARD-ARCHIVE:END -->'
  const rows = projects.map(project => `| ${project.en} | ${assetsFor(project).length} | ${project.groups.map(group => group.en).join('; ')} | Level C / user-authorized portfolio display |`).join('\n')
  const block = `${start}\n\n## User-supplied visual-board archive\n\nThe portfolio author directed public display of these 95 supplied boards on 2026-09-22. WebP derivatives preserve the supplied image sequence while reducing web-delivery weight. They remain **Level C / Retrospective Reconstruction**. The publication authorization does not verify client ownership, official commission, production, installation, or commercial outcome. Captions and image alt text in the bilingual case studies preserve this boundary.\n\n| Project | Boards | Groups | Public boundary |\n| --- | ---: | --- | --- |\n${rows}\n\n${end}`
  const source = fs.readFileSync(evidenceDocPath, 'utf8')
  return writeIfChanged(evidenceDocPath, replaceBlock(source, start, end, block))
}

function verify() {
  const expected = projects.flatMap(project => assetsFor(project))
  for (const asset of expected) {
    if (!fs.existsSync(path.join(PUBLIC, asset.src.slice(1)))) throw new Error(`Missing board ${asset.src}`)
  }
  const mapping = JSON.parse(fs.readFileSync(publicationPath, 'utf8'))
  for (const project of projects) {
    const actual = mapping.archiveImages[project.slug].filter(item => item.src.startsWith('/works/boards/'))
    if (actual.length !== assetsFor(project).length) throw new Error(`${project.slug}: expected ${assetsFor(project).length} archive boards, found ${actual.length}`)
  }
  for (const project of projects) for (const lang of ['zh', 'en']) {
    const body = fs.readFileSync(path.join(CONTENT, `${project.slug}.${lang}.md`), 'utf8')
    const count = [...body.matchAll(/\/works\/boards\//g)].length
    if (count !== assetsFor(project).length) throw new Error(`${project.slug}.${lang}: expected ${assetsFor(project).length} board images, found ${count}`)
  }
}

const changedCases = updateCaseStudies()
const changedPublication = updatePublicationMap()
const evidence = updateEvidenceRegister()
const changedEvidenceDoc = updateEvidenceDoc()
verify()
console.log(JSON.stringify({ check: CHECK, changedCaseStudies: changedCases, changedPublication, changedEvidenceRegister: evidence.changed, changedEvidenceDoc, publicBoards: projects.reduce((total, project) => total + assetsFor(project).length, 0), evidenceRecords: evidence.updated }, null, 2))
