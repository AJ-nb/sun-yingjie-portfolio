import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.resolve(process.env.PORTFOLIO_BUILD_DIR || path.join(root, 'web', 'dist'))
const manifest = JSON.parse(await readFile(path.join(root, 'web', 'public', 'route-manifest.json'), 'utf8'))
const failures = []
for (const route of manifest.routes) {
  const file = path.join(dist, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`)
  const html = await readFile(file, 'utf8').catch(() => '')
  if (!/<div id="root"[^>]*><div/.test(html)) failures.push(`${route}: no rendered root`)
  if (!html.includes('data-design-os-seo-jsonld')) failures.push(`${route}: no structured data`)
  if (!html.includes(`href="${manifest.metadata[route].canonical}"`)) failures.push(`${route}: wrong canonical`)
}
const hermes = await readFile(path.join(dist, 'work/hermes/index.html'), 'utf8')
if (!hermes.includes('Hermès') || !hermes.includes('职责') || !hermes.includes('三维设计与视觉呈现')) failures.push('/work/hermes: core case content missing')
const resume = await readFile(path.join(dist, 'resume/index.html'), 'utf8')
if (!resume.includes('简历') || !resume.includes('/downloads/sun-yingjie-resume.pdf')) failures.push('/resume: resume content missing')
const notFound = await readFile(path.join(dist, '404/index.html'), 'utf8')
if (!notFound.includes('页面未找到') || !notFound.includes('noindex,follow')) failures.push('/404: not-found content missing')
if (failures.length) throw new Error(`Static route verification failed:\n${failures.join('\n')}`)
console.log(`PASS: ${manifest.routes.length} static routes include rendered content, metadata and canonical URLs.`)
