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
console.log(`Staged ${records.length} explicitly selected assets (${(records.reduce((n, r) => n + r.bytes, 0) / 1048576).toFixed(1)} MiB).`)
