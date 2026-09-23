import { createRequire } from 'node:module'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const webRoot = path.join(root, 'web')
const publicDir = path.join(webRoot, 'public')
const requireFromWeb = createRequire(path.join(webRoot, 'package.json'))
const { createServer } = await import(pathToFileURL(requireFromWeb.resolve('vite')).href)
const server = await createServer({ root: webRoot, appType: 'custom', server: { middlewareMode: true } })
let site
try {
  const module = await server.ssrLoadModule('/src/data/staticSiteData.ts')
  site = module.getStaticSiteData()
} finally {
  await server.close()
}

await mkdir(publicDir, { recursive: true })
await mkdir(path.join(publicDir, 'downloads'), { recursive: true })
await copyFile(path.join(webRoot, 'src/data/downloads.json'), path.join(publicDir, 'downloads/manifest.json'))
await writeFile(path.join(publicDir, 'route-manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), ...site }, null, 2) + '\n')
await writeFile(path.join(publicDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`)
// Keep aliases available as static pages, but publish only canonical URLs in
// the sitemap so readable aliases do not create duplicate index entries.
const urls = site.routes
  .filter(route => !site.metadata[route].noindex && site.metadata?.[route]?.canonical === `${site.origin}${route}`)
  .map(route => `  <url><loc>${site.origin}${route}</loc>${Object.entries(site.metadata[route].alternates ?? {}).map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`).join('')}</url>`)
  .join('\n')
await writeFile(path.join(publicDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`)
await writeFile(path.join(publicDir, 'manifest.webmanifest'), JSON.stringify({
  name: 'Yingjie Sun Design OS', short_name: 'Yingjie Design OS', start_url: process.env.PORTFOLIO_BASE_PATH || '/', display: 'standalone',
  background_color: '#0c0c0c', theme_color: '#0c0c0c', description: 'Industrial & Product Designer. From form to system.', lang: 'zh-CN',
}, null, 2) + '\n')
console.log(`Generated ${site.routes.length} route entries from the typed project registry`)
