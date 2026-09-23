import { readFile, readdir, mkdir, copyFile, writeFile } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { experiments } from '../web/src/data/experiments.ts'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(root, 'web/public')
const dist = path.resolve(process.env.PORTFOLIO_BUILD_DIR || path.join(root, 'web/dist'))
const contentRoot = path.join(root, 'web/src/content/works')
const publication = JSON.parse(await readFile(path.join(root, 'web/src/data/publication.json'), 'utf8'))
const downloads = JSON.parse(await readFile(path.join(root, 'web/src/data/downloads.json'), 'utf8'))
const routeManifest = JSON.parse(await readFile(path.join(publicRoot, 'route-manifest.json'), 'utf8'))
const designAssets = JSON.parse(await readFile(path.join(publicRoot, 'media/v7/manifest.json'), 'utf8'))
const allow = new Set([
  '/media/v7/hero-follow.mp4', '/media/v5/hero-original.mp4', '/media/v5/hero-poster.webp', '/media/v7/reference-sources.json',
  '/media/v7/films/hermes-process.mp4', '/media/v7/films/arcteryx-process.mp4', '/media/v7/films/sources.json', '/media/v7/manifest.json',
  '/media/v6/portrait-cutout.png', '/media/v6/product-plumber-cutout.png', '/media/v6/product-huhu-cutout.png', '/media/v6/product-lighting-cutout.png',
  '/media/v7/profile-portrait-cutout.png', '/media/v7/resume-portrait.png',
  '/downloads/sun-yingjie-selected-portfolio.pdf', '/downloads/sun-yingjie-full-portfolio.pdf',
  '/downloads/sun-yingjie-resume.pdf', '/downloads/sun-yingjie-resume.docx',
  '/downloads/manifest.json',
  '/media/v7/resume-preview.webp', '/media/v7/resume-preview-brand.webp',
  '/media/v7/resume-preview-physical.webp', '/media/v7/resume-preview-digital.webp',
  '/THIRD_PARTY_NOTICES.md',
  '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/route-manifest.json',
  '/OPEN_SOURCE_REFERENCES.md',
  '/licenses/inventory.json',
  '/licenses/font-sources/Epilogue/OFL.txt', '/licenses/font-sources/DM-Sans/OFL.txt', '/licenses/font-sources/Noto-Sans-SC/OFL.txt',
  '/licenses/font-sources/Geist/OFL.txt', '/licenses/font-sources/Geist-Mono/OFL.txt',
  '/licenses/sen/LICENSE.sen', '/licenses/sen/NOTICE.sen',
])
for (const name of ['poster.webp','manifest.json',...Array.from({length:55},(_,i)=>`${i+18}.webp`)]) allow.add(`/media/v10/hero/${name}`)
for (const file of downloads.items) {
  if (!/^\/downloads\/[a-z0-9-]+\.(pdf|docx)$/.test(file.path)) throw new Error(`Unsafe download: ${file.path}`)
  allow.add(file.path)
  if (file.preview) {
    if (!/^\/media\/v9\/downloads\/[a-z0-9-]+\.webp$/.test(file.preview)) throw new Error(`Unsafe preview: ${file.preview}`)
    allow.add(file.preview)
  }
}
for (const file of designAssets.assets) {
  if (!/^\/media\/v7\/(?:brand\/[a-z0-9-]+\.webp|profile-portrait-cutout\.png)$/.test(file.path)) throw new Error(`Unsafe design asset: ${file.path}`)
  allow.add(file.path)
}
for (const experiment of Object.values(experiments)) {
  for (const view of experiment.views) allow.add(view.image)
}
const licenseInventory = JSON.parse(await readFile(path.join(publicRoot, 'licenses/inventory.json'), 'utf8'))
const licenseHashes = new Map()
for (const dependency of licenseInventory.packages) {
  for (const file of dependency.files) {
    if (typeof file.path !== 'string' || !file.path.startsWith('packages/') || file.path.includes('..') || file.path.includes('\\')) throw new Error(`Unsafe inventory license path: ${file.path}`)
    if (typeof file.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error(`Invalid inventory license digest: ${file.path}`)
    allow.add(`/licenses/${file.path}`)
    licenseHashes.set(`/licenses/${file.path}`, file.sha256)
  }
}
for (const file of await readdir(contentRoot)) {
  if (!/\.(zh|en)\.md$/.test(file)) continue
  if (publication.excludedSlugs.includes(file.replace(/\.(zh|en)\.md$/, ''))) continue
  const raw = await readFile(path.join(contentRoot, file), 'utf8')
  for (const match of raw.matchAll(/\/(?:works|downloads|media\/v7)\/[^\s"'<>\)]+/g)) allow.add(match[0])
  allow.add(`/thumbnails/${file.replace(/\.(zh|en)\.md$/, '')}.webp`)
}
const records = []
async function verifyAndHash(file, relative) {
  const hash = createHash('sha256')
  let bytes = 0
  for await (const chunk of createReadStream(file)) {
    if (bytes === 0) {
      if (chunk.subarray(0, 128).toString('utf8').startsWith('version https://git-lfs.github.com/spec/v1')) throw new Error(`Unresolved Git LFS pointer: ${relative}. Restore the LFS content before building.`)
      if (relative.endsWith('.pdf') && chunk.subarray(0, 5).toString('ascii') !== '%PDF-') throw new Error(`Invalid PDF header: ${relative}`)
    }
    bytes += chunk.length
    hash.update(chunk)
  }
  if (bytes === 0) throw new Error(`Empty published asset: ${relative}`)
  return { bytes, sha256: hash.digest('hex') }
}
for (const relative of [...allow].sort()) {
  if (relative.includes('..') || relative.includes('\\')) throw new Error(`Unsafe media path: ${relative}`)
  const source = path.resolve(publicRoot, `.${relative}`)
  if (!source.startsWith(publicRoot + path.sep)) throw new Error('Asset escaped public directory')
  const target = path.resolve(dist, `.${relative}`)
  await mkdir(path.dirname(target), { recursive: true })
  await copyFile(source, target)
  const fingerprint = await verifyAndHash(target, relative)
  if (licenseHashes.has(relative) && fingerprint.sha256 !== licenseHashes.get(relative)) throw new Error(`License differs from its inventory digest: ${relative}`)
  records.push({ path: relative, ...fingerprint })
}
await writeFile(path.join(dist, 'media-index.json'), JSON.stringify(records))
async function filesBelow(directory, prefix = '') {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name
    if (entry.isDirectory()) files.push(...await filesBelow(path.join(directory, entry.name), relative + '/'))
    else if (entry.isFile()) files.push(relative)
    else throw new Error(`Unexpected non-regular build entry: ${relative}`)
  }
  return files
}
const expected = new Set([...allow].map(relative => relative.slice(1)))
expected.add('index.html')
expected.add('media-index.json')
for (const route of routeManifest.routes ?? []) {
  if (typeof route !== 'string' || !route.startsWith('/') || route.includes('..') || route.includes('\\')) throw new Error(`Unsafe route in route-manifest.json: ${route}`)
  expected.add(route === '/' ? 'index.html' : `${route.slice(1).replace(/\/$/, '')}/index.html`)
}
for (const file of await filesBelow(path.join(dist, 'assets'), 'assets/')) expected.add(file)
const actual = new Set(await filesBelow(dist))
const extra = [...actual].filter(file => !expected.has(file))
const missing = [...expected].filter(file => !actual.has(file))
if (extra.length || missing.length) {
  throw new Error(`Build differs from selected assets; extra=${JSON.stringify(extra)}, missing=${JSON.stringify(missing)}. Run a complete fresh build.`)
}
console.log(`Staged ${records.length} explicitly selected assets (${(records.reduce((n, r) => n + r.bytes, 0) / 1048576).toFixed(1)} MiB).`)
