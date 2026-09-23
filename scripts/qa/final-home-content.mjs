import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../..')
const read = relative => readFile(resolve(root, relative), 'utf8')

const home = await read('web/src/ui/HomeDesignOS.tsx')
const homeStyles = await read('web/src/ui/home-design-os.css')
const profile = await read('web/src/data/profile.json')
const registry = await read('web/src/data/projectRegistry.ts')
const metadata = await read('web/src/data/siteMetadata.ts')
const staticRouteData = await read('web/src/data/staticSiteData.ts')
const shell = await read('web/index.html')
const builtShell = await read('web/dist/index.html').catch(() => '')

function assert(condition, message) {
  if (!condition) throw new Error(`final-home-content: ${message}`)
}

assert(home.includes("role: 'Design Lead'"), 'homepage must expose the locked English role')
assert(home.includes("roleDetail: 'Industrial & Product Design'"), 'homepage must expose the locked discipline')
assert(home.includes("tagline: 'From form to system.'"), 'homepage must expose the locked design statement')
assert(home.includes('integrating AI, research and cross-market insight where they improve the design'), 'homepage must expose the evidence-led introduction')
assert(home.includes("href={href('/contact', lang)}") && home.includes('mailto:${profile.contact.email}'), 'homepage must expose contact in the header and hero')
const primaryOrder = ['hermes', 'arcteryx', 'karimoku', 'lighting', 'plumber', 'huhu-care', 'plant-companion', 'go-glow', 'lingmu', 'jimu-studio', 'biyuan', 'rendering-studies', 'yelisi', 'periastra']
assert(home.includes('getPrimaryWorkProjects'), 'homepage must derive primary work from the registry')
assert(registry.includes(`export const PRIMARY_WORK_ORDER = [\n${primaryOrder.map(slug => `  '${slug}',`).join('\n')}`), 'registry primary order must match the reviewed 14-project sequence')
assert(registry.includes('function orderProjectsByPrimaryWork'), '/work must be able to preserve the primary order')
for (const section of ['home-os-selected', 'home-os-evolution', 'home-os-capabilities', 'home-os-ai', 'home-os-contact']) {
  assert(home.includes(section), `homepage must retain ${section}`)
}

for (const token of ['.home-os-hero-actions', '.home-os-secondary', '@media (max-width: 620px)', '@media (prefers-reduced-motion: reduce)']) {
  assert(homeStyles.includes(token), `homepage stylesheet must include ${token}`)
}
assert(profile.includes('Design Lead | Industrial & Product Design') && profile.includes('Design Lead｜工业与产品设计'), 'profile must use the locked positioning')
assert(!profile.includes('Brand & Product Designer') && !profile.includes('品牌与产品设计师'), 'profile must not retain the superseded primary role')

for (const slug of ['karimoku', 'hermes', 'yelisi', 'arcteryx', 'periastra']) {
  assert(registry.includes(`'${slug}'`), `registry must include ${slug}`)
}
for (const alias of ['hermes-seasonal-window-worlds', 'mountain-performance-field', 'karimoku-benwu-design-study']) {
  assert(registry.includes(`'${alias}'`), `registry must retain readable alias ${alias}`)
}
assert(registry.includes('const aliasRoutes = Object.keys(PROJECT_SLUG_ALIASES)'), 'readable aliases must be included in static route generation')
assert(metadata.includes('projectPathname(route, project.slug)'), 'aliases must canonicalize to stable project URLs')
assert(staticRouteData.includes('getPublicProjectRoutes()'), 'static route manifest must derive from the typed registry')
assert(/periastra:\s*\{[^}]*maturity:\s*'research'/.test(registry), 'Periastra must remain a research-stage record until adoption is verified')
assert(!shell.includes('Brand &amp; Product Designer') && !shell.includes('品牌与产品设计师'), 'static shell must not advertise the superseded role')

if (builtShell && builtShell.includes('home-os-secondary')) {
  assert(builtShell.includes('Design Lead') && builtShell.includes('Industrial &amp; Product Design'), 'built root must expose the locked role and discipline')
  assert(builtShell.includes('/contact'), 'built root must expose a contact route')
  assert(!builtShell.includes('Brand &amp; Product Designer') && !builtShell.includes('品牌与产品设计师'), 'built root must not expose the superseded role')
}

console.log('final-home-content: PASS')
