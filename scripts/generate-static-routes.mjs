import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const webRoot = path.join(root, 'web')
const dist = path.resolve(process.env.PORTFOLIO_BUILD_DIR || path.join(webRoot, 'dist'))
const manifest = JSON.parse(await readFile(path.join(webRoot, 'public', 'route-manifest.json'), 'utf8'))
const shell = await readFile(path.join(dist, 'index.html'), 'utf8')
const requireFromWeb = createRequire(path.join(webRoot, 'package.json'))
const { createServer } = await import(pathToFileURL(requireFromWeb.resolve('vite')).href)
const server = await createServer({ root: webRoot, appType: 'custom', server: { middlewareMode: true } })
let renderStaticRoute
try {
  ;({ renderStaticRoute } = await server.ssrLoadModule('/src/entry-server.tsx'))
  for (const rawRoute of manifest.routes ?? []) {
    const route = safeRoute(rawRoute)
    const metadata = manifest.metadata?.[route]
    if (!metadata) throw new Error(`Missing metadata for static route: ${route}`)
    const html = renderRoute(shell, route, metadata, renderStaticRoute(route))
    const target = path.resolve(dist, route === '/' ? 'index.html' : path.join(route.slice(1), 'index.html'))
    if (target !== path.join(dist, 'index.html') && !target.startsWith(`${dist}${path.sep}`)) throw new Error(`Route escaped build directory: ${route}`)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, html)
  }
} finally {
  await server.close()
}
console.log(`Rendered ${manifest.routes.length} static route pages from the production components`)

function safeRoute(route) {
  if (typeof route !== 'string' || !route.startsWith('/') || route.includes('..') || route.includes('\\') || /[<>"']/.test(route)) throw new Error(`Unsafe route: ${route}`)
  return route
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character])
}

function replaceMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`
  const pattern = new RegExp(`<meta\\s+${attribute}="${escapedKey}"[^>]*>`, 'i')
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function renderRoute(template, route, metadata, appHtml) {
  const title = metadata.title
  const description = metadata.description
  let html = template.replace(/<html\s+lang="[^"]*"/i, `<html lang="${metadata.lang}"`)
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
  html = replaceMeta(html, 'name', 'description', description)
  html = replaceMeta(html, 'name', 'robots', metadata.robots)
  html = replaceMeta(html, 'property', 'og:title', title)
  html = replaceMeta(html, 'property', 'og:description', description)
  html = replaceMeta(html, 'property', 'og:url', metadata.canonical)
  html = replaceMeta(html, 'property', 'og:type', metadata.type === 'CreativeWork' ? 'article' : 'website')
  html = replaceMeta(html, 'property', 'og:locale', metadata.lang === 'en' ? 'en_US' : 'zh_CN')
  if (metadata.image) html = replaceMeta(html, 'property', 'og:image', metadata.image)
  html = replaceMeta(html, 'name', 'twitter:card', metadata.image ? 'summary_large_image' : 'summary')
  html = replaceMeta(html, 'name', 'twitter:title', title)
  html = replaceMeta(html, 'name', 'twitter:description', description)
  if (metadata.image) html = replaceMeta(html, 'name', 'twitter:image', metadata.image)
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`)
  html = html.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '')
  html = html.replace(/<link\b[^>]*rel="alternate"[^>]*>/gi, '')
  const alternateLinks = Object.entries(metadata.alternates ?? {}).map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${escapeHtml(href)}" />`).join('\n')
  html = html.replace('</head>', alternateLinks + '\n</head>')
  const jsonLd = JSON.stringify(metadata.structuredData).replace(/</g, '\\u003c')
  html = html.replace('</head>', `    <script type="application/ld+json" data-design-os-seo-jsonld>${jsonLd}</script>\n  </head>`)
  html = html.replace('<div id="root"></div>', `<div id="root" data-route="${escapeHtml(route)}">${appHtml}</div>`)
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, `<noscript><p>${metadata.lang === 'en' ? 'Page content is available above. Enable JavaScript for filters, gallery controls and copy feedback.' : '页面内容已完整显示。开启 JavaScript 可使用筛选、画廊与复制反馈。'}</p></noscript>`)
  return html
}
