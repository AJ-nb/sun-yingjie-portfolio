import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
const require = createRequire(new URL('../../web/package.json', import.meta.url))
const {createServer} = await import(pathToFileURL(require.resolve('vite')))
process.env.PORTFOLIO_BASE_PATH='/sun-yingjie-portfolio/'
process.env.VITE_SITE_ORIGIN='https://aj-nb.github.io'
const server=await createServer({root:fileURLToPath(new URL('../../web',import.meta.url)),server:{middlewareMode:true},appType:'custom'})
try {
  const locale=await server.ssrLoadModule('/src/data/locale.ts')
  assert.equal(locale.localePath('/work/hermes','en'),'/sun-yingjie-portfolio/en/work/hermes')
  assert.equal(locale.routeLocale('/sun-yingjie-portfolio/en/work/hermes'),'en')
  assert.equal(locale.unlocalizedPath('/sun-yingjie-portfolio/en/work/hermes'),'/work/hermes')
  assert.equal(locale.localePath('/sun-yingjie-portfolio/en/work/hermes?q=test','zh'),'/sun-yingjie-portfolio/work/hermes?q=test')
  const {renderStaticRoute}=await server.ssrLoadModule('/src/entry-server.tsx')
  const html=renderStaticRoute('/')
  assert.match(html,/motion-preference/)
  const {getPageMetadata}=await server.ssrLoadModule('/src/data/siteMetadata.ts')
  assert.equal(getPageMetadata(null,'en').canonical,'https://aj-nb.github.io/sun-yingjie-portfolio/en/')
  console.log('v11 subpath, language, SSR settings and canonical contracts passed')
} finally { await server.close() }

