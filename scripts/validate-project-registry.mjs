import { readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const worksDir = path.join(root, 'web', 'src', 'content', 'works')
const registryPath = path.join(root, 'web', 'src', 'data', 'projectRegistry.ts')
const workDocsPath = path.join(root, 'web', 'src', 'data', 'workDocs.ts')
const publicationPath = path.join(root, 'web', 'src', 'data', 'publication.json')
const relationsPath = path.join(root, 'web', 'src', 'data', 'caseRelations.ts')
const reportPath = path.join(root, '.production-runtime', 'registry-validator-report.md')
await mkdir(path.dirname(reportPath), { recursive: true })

const errors = []
const warnings = []
const missingEvidence = []
const missingAssets = []
const contentHashes = {}
const licenseBoundaries = []
const addError = (code, message, extra = {}) => errors.push({ code, message, ...extra })
const addWarning = (code, message, extra = {}) => warnings.push({ code, message, ...extra })

function parseFrontmatter(raw) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/m.exec(raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n'))
  if (!match) return null
  const fields = Object.fromEntries([...match[1].matchAll(/^([\w-]+):\s*(.*)$/gm)].map((m) => [m[1], m[2].trim().replace(/^"(.*)"$/, '$1')]))
  return { fields, body: match[2] }
}

function publicPathToFile(resource) {
  if (typeof resource !== 'string' || !resource.startsWith('/') || resource.includes('..')) return null
  return path.join(root, 'web', 'public', resource.slice(1).replaceAll('/', path.sep))
}

function dimensions(buffer, ext) {
  if (buffer.length >= 24 && buffer.readUInt32BE(0) === 0x89504e47) return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)]
  if (ext === '.gif' && buffer.length >= 10) return [buffer.readUInt16LE(6), buffer.readUInt16LE(8)]
  if (ext === '.webp' && buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const kind = buffer.toString('ascii', 12, 16)
    if (kind === 'VP8X') return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)]
    if (kind === 'VP8 ' && buffer.length >= 30) return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff]
    if (kind === 'VP8L' && buffer.length >= 25) return [1 + (((buffer[21] | (buffer[22] << 8) | (buffer[23] << 16) | (buffer[24] << 24)) & 0x3fff)), 1 + (((buffer[22] >> 6 | (buffer[23] << 2) | (buffer[24] << 10) | (buffer[25] << 18)) & 0x3fff))]
  }
  if (ext === '.jpg' || ext === '.jpeg' || (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8)) {
    let offset = 2
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset++; continue }
      const marker = buffer[offset + 1]
      const length = buffer.readUInt16BE(offset + 2)
      if (marker >= 0xc0 && marker <= 0xc3) return [buffer.readUInt16BE(offset + 7), buffer.readUInt16BE(offset + 5)]
      offset += 2 + length
    }
  }
  return null
}

async function checkAsset(resource, slug, kind = 'cover') {
  const file = publicPathToFile(resource)
  if (!file) {
    addError('invalid-public-path', `${slug}: ${kind} must be an absolute public path`, { slug, path: resource })
    missingAssets.push({ slug, path: resource, reason: 'invalid-path' })
    return
  }
  if (/(^|[\\/])private([\\/]|$)|(^|[\\/])\.git([\\/]|$)|(^|[\\/])source([\\/]|$)/i.test(resource)) addError('private-path-exposed', `${slug}: ${kind} exposes a private/source path`, { slug, path: resource })
  try {
    const info = await stat(file)
    if (!info.isFile() || info.size === 0) throw new Error('not a non-empty file')
    const bytes = await readFile(file)
    const ext = path.extname(file).toLowerCase()
    const size = dimensions(bytes, ext)
    if (size && (size[0] <= 0 || size[1] <= 0)) addError('invalid-dimensions', `${slug}: ${kind} has non-positive intrinsic dimensions`, { slug, path: resource, dimensions: size })
    if (!size && ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) addWarning('dimensions-unreadable', `${slug}: ${kind} image dimensions could not be read`, { slug, path: resource })
    contentHashes[resource] = { bytes: info.size, dimensions: size }
  } catch (error) {
    addError('missing-asset', `${slug}: ${kind} does not exist under web/public`, { slug, path: resource, reason: error.message })
    missingAssets.push({ slug, path: resource, reason: error.message })
  }
}

const publication = JSON.parse(await readFile(publicationPath, 'utf8'))
const registrySource = await readFile(registryPath, 'utf8')
const workDocsSource = await readFile(workDocsPath, 'utf8')
const relationsSource = await readFile(relationsPath, 'utf8')
const excluded = new Set(publication.excludedSlugs)
const docs = new Map()
for (const file of await readdir(worksDir)) {
  const match = /^(.*)\.(zh|en)\.md$/.exec(file)
  if (!match) continue
  const parsed = parseFrontmatter(await readFile(path.join(worksDir, file), 'utf8'))
  if (!parsed) addError('frontmatter', `${file}: frontmatter required`)
  const slug = match[1], lang = match[2]
  const pair = docs.get(slug) ?? {}
  pair[lang] = { file, ...parsed }
  docs.set(slug, pair)
}
const publicSlugs = [...docs.keys()].filter((slug) => !excluded.has(slug))
const expectedPublic = new Set(publicSlugs)
const classificationSlugs = new Set([...registrySource.matchAll(/^\s*(['\"]?)([a-z0-9][a-z0-9-]*)\1:\s*\{\s*category:/gm)].map((m) => m[2]))
const allowlistedBrands = new Set(['hermes', 'arcteryx', 'karimoku', 'periastra', 'yelisi'])
const allowedCategories = new Set(['commercial', 'product', 'brand', 'visual', 'digital', 'ai', 'experimental', 'research'])
const categoryEntries = [...registrySource.matchAll(/^\s*(['\"]?)([a-z0-9][a-z0-9-]*)\1:\s*\{\s*category:\s*['\"]([^'\"]+)['\"],\s*track:\s*['\"]([^'\"]+)['\"],\s*maturity:\s*['\"]([^'\"]+)['\"]/gm)]
const categoryBySlug = new Map(categoryEntries.map((m) => [m[2], { category: m[3], track: m[4], maturity: m[5] }]))

if (publicSlugs.length !== 32) addError('public-count', `Expected 32 public bilingual slugs, found ${publicSlugs.length}`, { expected: 32, actual: publicSlugs.length })
for (const slug of expectedPublic) {
  const pair = docs.get(slug)
  if (!pair?.zh || !pair?.en) addError('missing-translation', `${slug}: both zh and en work documents are required`, { slug })
  if (!classificationSlugs.has(slug)) addError('missing-classification', `${slug}: no registry classification`, { slug })
  if (pair?.zh?.fields?.cover) await checkAsset(pair.zh.fields.cover, slug)
  else addError('missing-cover', `${slug}: cover is required`, { slug })
  if (pair?.zh?.fields?.cover !== pair?.en?.fields?.cover) addError('cover-mismatch', `${slug}: translated covers differ`, { slug })
  if (![6,7].includes(pair?.zh?.body?.match(/(?:^|\n)## /g)?.length) || ![6,7].includes(pair?.en?.body?.match(/(?:^|\n)## /g)?.length)) addWarning('section-count', `${slug}: expected six archive or seven editorial sections`, { slug })
  if (!pair?.zh?.body?.trim() || !pair?.en?.body?.trim()) missingEvidence.push({ slug, reason: 'no case body evidence' })
  if (/(D:\\|C:\\|private\/|source archive|Lorem ipsum|example\.com)/i.test(`${pair?.zh?.body ?? ''}\n${pair?.en?.body ?? ''}`)) addError('private-or-placeholder-content', `${slug}: content contains private path or placeholder text`, { slug })
}
for (const slug of excluded) if (docs.has(slug)) addError('excluded-slug-public', `${slug}: excluded private slug has a public work document`, { slug })
for (const slug of classificationSlugs) if (!expectedPublic.has(slug)) addError('registry-slug-mismatch', `${slug}: registry classification is not a public bilingual case`, { slug })
for (const [slug, config] of categoryBySlug) {
  if (!allowedCategories.has(config.category)) addError('category-contract', `${slug}: category "${config.category}" is outside the schema discipline enum`, { slug, category: config.category })
  if (config.category === 'brand' && !allowlistedBrands.has(slug)) addError('brand-allowlist', `${slug}: brand category is outside the four-brand allowlist`, { slug })
  if (config.category === 'brand' && config.maturity === 'live') addError('brand-maturity', `${slug}: brand entries cannot claim live maturity without release evidence`, { slug })
  if (config.maturity === 'live') {
    const body = `${docs.get(slug)?.zh?.body ?? ''}\n${docs.get(slug)?.en?.body ?? ''}`
    if (!/https?:\/\//.test(body)) addError('live-link', `${slug}: live maturity requires a public URL`, { slug })
  }
}
for (const match of registrySource.matchAll(/seo:\s*\{[^}]*noindex:\s*(true|false)/g)) if (match[1] === 'true') addError('public-noindex', 'A public registry entry is marked noindex', { value: match[0] })
if (!/availability:\s*['\"]public['\"]/.test(registrySource) || !/visibility:\s*['\"]public['\"]/.test(registrySource)) addError('visibility-consistency', 'Generated registry entries must expose public availability and visibility')
if (/visibility:\s*['\"]private['\"]/.test(registrySource) && /noindex:\s*false/.test(registrySource)) addError('private-indexed', 'Private registry entries must be noindex')
if (/featured:\s*selectedSlugs\.has\(slug\)/.test(registrySource) && !/selected:\s*selectedSlugs\.has\(slug\)/.test(registrySource)) addError('selection-consistency', 'Featured registry entries must also be selected')
for (const match of registrySource.matchAll(/(?:liveDemoUrl|githubUrl|documentationUrl|researchUrl|figmaUrl|externalUrl|caseStudyUrl):\s*['\"]([^'\"]+)['\"]/g)) {
  const href = match[1]
  if (/example\.com|localhost|127\.0\.0\.1|invalid|^javascript:/i.test(href)) addError('fake-link', `Registry contains a placeholder or unsafe link: ${href}`, { href })
}
const selected = new Set(publication.selected.map((item) => item.slug))
for (const slug of selected) if (!expectedPublic.has(slug)) addError('selected-slug', `${slug}: selected slug is not public`, { slug })
const featuredSource = workDocsSource.match(/export const FEATURED = publication\.selected\.map\(item => item\.slug\)/)
if (!featuredSource) addWarning('featured-source', 'Could not prove featured entries are sourced from publication.selected')
for (const slug of selected) if (excluded.has(slug)) addError('featured-private', `${slug}: featured/selected entry is private`, { slug })
for (const match of relationsSource.matchAll(/slugs:\s*\[['\"]([^'\"]+)['\"],\s*['\"]([^'\"]+)['\"]\]/g)) {
  const [a, b] = [match[1], match[2]]
  if (a === b) addError('self-relation', `${a}: relation points to itself`, { slug: a })
  for (const slug of [a, b]) if (!expectedPublic.has(slug)) addError('missing-related-slug', `${slug}: relation points to missing/private slug`, { slug })
}
if (/rel:\s*['\"]next['\"]/.test(registrySource)) addWarning('next-links-unvalidated', 'Registry next links require explicit link objects before they can be validated')
if (/https?:\/\/(?:example\.com|localhost|127\.0\.0\.1|invalid)/i.test(registrySource)) addError('fake-link', 'Registry contains a placeholder or local live/demo/code link')
for (const slug of publicSlugs) {
  const body = `${docs.get(slug)?.zh?.body ?? ''}\n${docs.get(slug)?.en?.body ?? ''}`
  for (const href of body.matchAll(/\]\(([^)]+)\)/g)) {
    const url = href[1].trim()
    if (/^(?:https?:\/\/)?(?:example\.com|localhost|127\.0\.0\.1|invalid)/i.test(url) || /^javascript:/i.test(url)) addError('fake-link', `${slug}: placeholder or unsafe link ${url}`, { slug, href: url })
  }
  if (!/responsib|role|参与|负责|协作/i.test(body)) missingEvidence.push({ slug, reason: 'responsibility evidence wording not detected' })
}
for (const slug of publicSlugs) {
  const body = `${docs.get(slug)?.zh?.body ?? ''}\n${docs.get(slug)?.en?.body ?? ''}`
  if (/open-source|开源|license|许可证|AGPL|MIT/i.test(body)) licenseBoundaries.push({ slug, note: 'license or source boundary appears in case content' })
}

let sourceCommit = 'public-snapshot'
try { sourceCommit = (await (await import('node:child_process')).execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' })).trim() } catch { /* A Pages source snapshot may intentionally omit .git. */ }
const result = {
  schemaVersion: 1,
  sourceCommit,
  entryCount: classificationSlugs.size,
  publicCount: publicSlugs.length,
  errors,
  warnings,
  missingEvidence,
  missingAssets,
  licenseBoundaries,
  contentHashes,
}
await writeFile(reportPath, `# Project registry validator report\n\nGenerated ${new Date().toISOString()}.\n\n- Result: **${errors.length ? 'FAIL' : 'PASS'}**\n- Public bilingual cases: ${publicSlugs.length}\n- Registry classifications: ${classificationSlugs.size}\n- Errors: ${errors.length}\n- Warnings: ${warnings.length}\n- Missing evidence warnings: ${missingEvidence.length}\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`\n`)
if (errors.length) {
  console.error(JSON.stringify(result, null, 2))
  process.exitCode = 1
} else {
  console.log(JSON.stringify(result, null, 2))
}
