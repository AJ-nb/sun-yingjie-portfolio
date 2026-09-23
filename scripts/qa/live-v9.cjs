// Read-only release smoke test: verify the deployed HTML and every download
// against the same manifests used for the local production build.
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const root = path.resolve(__dirname, '../..')
const routes = JSON.parse(fs.readFileSync(path.join(root, 'web/public/route-manifest.json')))
const downloads = JSON.parse(fs.readFileSync(path.join(root, 'web/src/data/downloads.json')))
const origin = (process.env.PORTFOLIO_QA_URL || JSON.parse(fs.readFileSync(path.join(root, 'web/src/data/profile.json'))).url).replace(/\/$/, '')
const output = path.join(root, '.production-runtime/qa-v9/live.json')
const previous = process.argv.includes('--retry-failed') && fs.existsSync(output) ? JSON.parse(fs.readFileSync(output)) : null
assert(!previous || previous.origin === origin, 'Retry must target the same release origin')
const checks = previous ? previous.checks.filter(c => c.passed) : []
const completed = new Set(checks.map(c => c.name))
async function get(url) {
  // Complete archives are ~18 MiB. Allow transfer time independently of the
  // page-load performance targets; this test compares every byte of each file.
  const response = await fetch(url, { signal: AbortSignal.timeout(240000), cache: 'no-store' })
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}`)
  return response
}
async function check(name, run) {
  try { await run(); checks.push({ name, passed: true }); if (name.endsWith('exact download')) console.log('PASS', name) }
  catch (error) { checks.push({ name, passed: false, error: error.message }); console.error('FAIL', name, error.message) }
}
async function pool(items, run) {
  const queue = [...items]
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) await run(queue.shift())
  }))
}
async function main() {
  // Stop before the larger verification if the public endpoint is unavailable.
  const home = await (await get(origin + '/')).text()
  assert(home.includes('工业与产品设计师') && home.includes('home-tv-figure'), 'Deployed homepage is not v9')
  await pool(routes.routes.filter(route => !completed.has(route + ' static identity')), route => check(route + ' static identity', async () => {
    const html = await (await get(origin + route)).text()
    const expected = routes.metadata[route]
    const escape = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    assert(html.includes(`<title>${escape(expected.title)}</title>`), 'title')
    assert(html.includes(`rel="canonical" href="${escape(expected.canonical)}"`), 'canonical')
    assert(html.includes(`<html lang="${expected.lang}"`), 'document language')
    for (const [lang, href] of Object.entries(expected.alternates || {})) {
      assert(html.includes(`hreflang="${lang}" href="${escape(href)}"`), 'language alternate')
    }
    assert(/<main\b[^>]*>[\s\S]{250,}<\/main>/.test(html), 'static body')
  }))
  console.log(`Verified ${routes.routes.length} deployed route documents`)
  await pool(downloads.items.filter(file => !completed.has(file.id + ' exact download')), file => check(file.id + ' exact download', async () => {
    const response = await get(origin + file.path)
    const hash = crypto.createHash('sha256')
    let bytes = 0
    for await (const chunk of response.body) { hash.update(chunk); bytes += chunk.length }
    assert.equal(bytes, file.bytes, 'download size')
    assert.equal(hash.digest('hex'), file.sha256, 'download hash')
  }))
  const result = { origin, verifiedAt: new Date().toISOString(), initialVerifiedAt: previous?.initialVerifiedAt || previous?.verifiedAt, priorFailures: previous?.checks.filter(c => !c.passed) || [], passed: checks.every(c => c.passed), checks }
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, JSON.stringify(result, null, 2))
  console.log(JSON.stringify({ passed: result.passed, checks: checks.length, failures: checks.filter(c => !c.passed) }))
  if (!result.passed) process.exitCode = 1
}
main().catch(error => { console.error(error); process.exitCode = 1 })
