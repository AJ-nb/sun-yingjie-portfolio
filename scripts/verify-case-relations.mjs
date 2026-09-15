import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { getCaseRelations, CASE_CONNECTIONS } from '../web/src/data/caseRelations.ts'
import { editorialMetadata } from '../web/src/data/chapters.ts'

// Load the actual profile data without executing the browser-only work document loader.
const requireWeb = createRequire(new URL('../web/package.json', import.meta.url))
const ts = requireWeb('typescript')
const profileSource = await readFile(new URL('../web/src/data/profile.ts', import.meta.url), 'utf8')
const profileFacts = JSON.parse(await readFile(new URL('../web/src/data/profile.json', import.meta.url), 'utf8'))
const compiled = ts.transpileModule(profileSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
const exported = {}
runInNewContext(compiled, { exports: exported, require: name => {
  assert.equal(name, './profile.json', 'Profile must not acquire an unreviewed runtime dependency in this data check')
  return profileFacts
} })
const { profileCopy } = exported

const directory = new URL('../web/src/content/works/', import.meta.url)
const works = []
for (const file of await readdir(directory)) {
  if (!file.endsWith('.zh.md')) continue
  const slug = file.slice(0, -6)
  const raw = await readFile(new URL(file, directory), 'utf8')
  const category = /^category:\s*"([^"]+)"/m.exec(raw)?.[1]
  assert(category, `${slug}: category missing`)
  works.push({ slug, ...editorialMetadata(slug, category) })
  await readFile(new URL(`${slug}.en.md`, directory), 'utf8')
}
const catalog = new Map(works.map(work => [work.slug, work]))
for (const pair of CASE_CONNECTIONS) {
  assert.notEqual(pair.slugs[0], pair.slugs[1], 'A curated pair cannot connect a case to itself')
  for (const slug of pair.slugs) assert(catalog.has(slug), `Curated connection has missing case: ${slug}`)
  assert(pair.reason.zh && pair.reason.en, 'Curated connections require both languages')
}

let recommendations = 0
for (const lang of ['zh', 'en']) {
  const capabilities = profileCopy[lang].capabilities
  for (const capability of capabilities) for (const slug of capability.caseSlugs) assert(catalog.has(slug), `Capability has missing case: ${slug}`)
  for (const work of works) {
    const related = getCaseRelations(work, works, capabilities, lang)
    assert.equal(related.length, 2, `${lang}/${work.slug}: expected two justified recommendations`)
    assert.equal(new Set(related.map(item => item.slug)).size, related.length, `${work.slug}: duplicate recommendation`)
    assert.deepEqual(related, getCaseRelations(work, [...works].reverse(), capabilities, lang), `${work.slug}: catalog order must not change recommendations`)
    for (const relation of related) {
      assert.notEqual(relation.slug, work.slug, `${work.slug}: self recommendation`)
      assert(catalog.has(relation.slug), `${work.slug}: missing destination`)
      assert(relation.reason.length > 15, `${work.slug}: explanation is missing`)
      assert.equal(/[\u3400-\u9fff]/.test(relation.reason), lang === 'zh', `${work.slug}: reason language mismatch`)
      const curated = CASE_CONNECTIONS.some(pair => pair.slugs.includes(work.slug) && pair.slugs.includes(relation.slug))
      const capability = capabilities.some(item => item.caseSlugs.includes(work.slug) && item.caseSlugs.includes(relation.slug))
      const chapter = catalog.get(relation.slug).chapter === work.chapter
      assert(({ curated, capability, chapter })[relation.basis], `${work.slug}: recommendation has no stated basis`)
      recommendations++
    }
    assert.deepEqual(related.map(item => item.slug), getCaseRelations(work, works, profileCopy[lang === 'zh' ? 'en' : 'zh'].capabilities, lang === 'zh' ? 'en' : 'zh').map(item => item.slug), `${work.slug}: translation changes the recommended projects`)
  }
}

const hermes = catalog.get('hermes')
assert.deepEqual(getCaseRelations(hermes, works, profileCopy.zh.capabilities, 'zh').map(item => item.slug), ['arcteryx', 'lighting'])
const removedDestination = works.filter(item => item.slug !== 'arcteryx')
assert(!getCaseRelations(hermes, removedDestination, profileCopy.zh.capabilities, 'zh').some(item => item.slug === 'arcteryx'), 'Removed destinations must never be recommended')
const isolated = { slug: 'isolated-case', chapter: 'windows', order: 0 }
const unrelated = { slug: 'unrelated-case', chapter: 'ai', order: 0 }
assert.deepEqual(getCaseRelations(isolated, [isolated, unrelated], [], 'zh'), [], 'No unrelated fallback for a case without a connection')
assert.deepEqual(getCaseRelations(isolated, works, profileCopy.zh.capabilities, 'zh'), [], 'An unknown source case has no recommendations')
const guardian = getCaseRelations(catalog.get('water-guardian'), works, profileCopy.zh.capabilities, 'zh')
assert(guardian.every(item => !['periastra', 'lensflow'].includes(item.slug)), 'Equipment cases must not return the old unrelated fallback')

console.log(`PASS: ${works.length} cases, ${recommendations} bilingual recommendations; justified destinations, deterministic order, no self/duplicate/missing/unrelated fallback.`)
