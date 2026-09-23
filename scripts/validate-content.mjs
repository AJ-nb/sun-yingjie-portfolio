import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const directory = path.join(root, 'web/src/content/works'), pairs = new Map(), media = new Set()
for (const file of await readdir(directory)) {
  if (!/\.(zh|en)\.md$/.test(file)) continue
  const raw = (await readFile(path.join(directory, file), 'utf8')).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const name = /^(.*)\.(zh|en)\.md$/.exec(file), header = /^---\n([\s\S]*?)\n---\n/.exec(raw)
  assert(header, `${file}: frontmatter required`)
  const fields = Object.fromEntries([...header[1].matchAll(/^([\w-]+):\s*(.*)$/gm)].map(m => [m[1], m[2].trim().replace(/^"(.*)"$/, '$1')]))
  for (const field of ['title','category','summary','role','credits','status','cover','tags']) assert(fields[field], `${file}: ${field} required`)
  assert(['commercial','product','brand','digital','experiments'].includes(fields.category), `${file}: category`)
  assert(Array.isArray(JSON.parse(fields.tags)), `${file}: tags must be JSON array`)
  assert.ok([6,7].includes((raw.match(/^## /gm) || []).length), `${file}: expected six archive or seven editorial sections`)
  assert(!/Lorem ipsum|About Sen|郑越升|你的作品介绍|D:\\|C:\\|private\/sources/.test(raw), `${file}: private/template content`)
  const assets = [...new Set([...raw.matchAll(/\/(?:works|downloads)\/[^\s"'<>\)]+/g)].map(m => m[0]))].sort()
  for (const resource of assets) {
    assert(!resource.includes('..'), `${file}: unsafe resource`)
    assert((await stat(path.join(root, 'web/public', resource))).isFile(), `${file}: missing ${resource}`)
    media.add(resource)
  }
  const pair = pairs.get(name[1]) || {}; pair[name[2]] = { fields, assets }; pairs.set(name[1], pair)
}
for (const [slug, pair] of pairs) {
  assert(pair.zh && pair.en, `${slug}: missing translation`)
  assert.equal(pair.zh.fields.category, pair.en.fields.category, `${slug}: category mismatch`)
  assert.equal(pair.zh.fields.cover, pair.en.fields.cover, `${slug}: cover mismatch`)
  assert.deepEqual(pair.zh.assets, pair.en.assets, `${slug}: translated media mismatch`)
}
const publication = JSON.parse(await readFile(path.join(root, 'web/src/data/publication.json'), 'utf8'))
const primaryWorkOrder = ['hermes', 'arcteryx', 'karimoku', 'lighting', 'plumber', 'huhu-care', 'plant-companion', 'go-glow', 'lingmu', 'jimu-studio', 'biyuan', 'rendering-studies', 'yelisi', 'periastra']
assert.deepEqual(publication.primaryWorkOrder, primaryWorkOrder, 'primary work order must remain explicit and stable')
for (const slug of primaryWorkOrder) assert(pairs.has(slug), `Primary work must be public: ${slug}`)
for (const item of publication.selected) assert(pairs.has(item.slug), `Missing selected case ${item.slug}`)
for (const slug of publication.excludedSlugs) assert(!pairs.has(slug), `Uncleared case ${slug} is public`)
assert.equal(publication.selected.reduce((n, item) => n + item.pages, publication.frontMatterPages), publication.selectedPageCount)
assert(publication.selectedPageCount <= publication.editions.overview.maxPages)
for (const [id, edition] of Object.entries(publication.editions)) {
  assert.equal(edition.cases.reduce((n, item) => n + 1 + item.pageIds.length, 4), edition.pageCount, id + ': page map budget')
  assert(edition.pageCount <= edition.maxPages, id + ': page maximum')
  for (const item of edition.cases) assert(pairs.has(item.slug), id + ': missing case ' + item.slug)
}
assert.deepEqual(new Set(publication.editions.brand.cases.map(item => item.slug)), new Set(['hermes','arcteryx','periastra','yelisi']))
const homepage = ['hermes','arcteryx','karimoku','lighting','yelisi','periastra','biyuan','ai-video-systems']
assert.deepEqual(publication.homepageSelection, homepage)
assert.deepEqual(publication.selected.map(item => item.slug), homepage)
assert.deepEqual(publication.editions.overview.cases.map(item => item.slug), homepage)
assert.equal(pairs.size, 32)
console.log(`PASS: ${pairs.size} bilingual public cases, ${media.size} media references; v9 bilingual editions with explicit page budgets; uncleared cases withheld.`)
