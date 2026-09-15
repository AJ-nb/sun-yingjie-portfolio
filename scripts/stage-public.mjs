import { readFile, readdir, mkdir, copyFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(root, 'web/public'), dist = path.join(root, 'web/dist')
const contentRoot = path.join(root, 'web/src/content/works')
const allow = new Set(['/models/avatar.glb', '/avatar/portrait.webp', '/downloads/sun-yingjie-selected-portfolio.pdf', '/downloads/sun-yingjie-resume.pdf'])
for (const file of await readdir(contentRoot)) {
  if (!/\.(zh|en)\.md$/.test(file)) continue
  const raw = await readFile(path.join(contentRoot, file), 'utf8')
  for (const match of raw.matchAll(/\/(?:works|downloads)\/[^\s"'<>\)]+/g)) allow.add(match[0])
  allow.add(`/thumbnails/${file.replace(/\.(zh|en)\.md$/, '')}.webp`)
}
const records = []
for (const relative of [...allow].sort()) {
  if (relative.includes('..') || relative.includes('\\')) throw new Error(`Unsafe media path: ${relative}`)
  const source = path.resolve(publicRoot, `.${relative}`)
  if (!source.startsWith(publicRoot + path.sep)) throw new Error('Asset escaped public directory')
  const target = path.resolve(dist, `.${relative}`)
  await mkdir(path.dirname(target), { recursive: true })
  await copyFile(source, target)
  records.push({ path: relative, bytes: (await stat(source)).size })
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
for (const file of await filesBelow(path.join(dist, 'assets'), 'assets/')) expected.add(file)
const actual = new Set(await filesBelow(dist))
const extra = [...actual].filter(file => !expected.has(file))
const missing = [...expected].filter(file => !actual.has(file))
if (extra.length || missing.length) {
  throw new Error(`Build differs from selected assets; extra=${JSON.stringify(extra)}, missing=${JSON.stringify(missing)}. Run a complete fresh build.`)
}
console.log(`Staged ${records.length} explicitly selected assets (${(records.reduce((n, r) => n + r.bytes, 0) / 1048576).toFixed(1)} MiB).`)
