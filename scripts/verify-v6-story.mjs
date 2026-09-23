import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const storyPath = path.join(root, 'web/src/data/portfolioV6.json')
const story = JSON.parse(await readFile(storyPath, 'utf8'))
const profile = JSON.parse(await readFile(path.join(root, 'web/src/data/profile.json'), 'utf8'))
const caseFiles = await readdir(path.join(root, 'web/src/content/works'))
const publicSlugs = new Set(caseFiles.filter(file => file.endsWith('.zh.md')).map(file => file.replace(/\.zh\.md$/, '')))

assert.equal(story.edition, 'v7')
assert.deepEqual(story.representatives.map(item => item.id), ['brand-design', 'product-design'])
assert.deepEqual(new Set(story.representatives[0].slugs), new Set(['hermes', 'arcteryx', 'periastra', 'yelisi']))
assert.ok(story.representatives[1].slugs.every(slug => !story.representatives[0].slugs.includes(slug)))
assert.deepEqual(story.careerChapters.map(item => item.id), ['liling', 'benwu', 'hannstar', 'ouyin', 'ai-open-source', 'academic-modeling'])
assert.deepEqual(story.openSource.map(item => item.slug), ['resume-formatter', 'xintiao'])

const timelineIds = new Set(profile.timeline.map(item => item.id))
for (const chapter of story.careerChapters) {
  assert.ok(chapter.title?.zh && chapter.title?.en, `${chapter.id}: bilingual title required`)
  assert.ok(chapter.role?.zh && chapter.role?.en, `${chapter.id}: bilingual role required`)
  assert.ok(chapter.summary?.zh && chapter.summary?.en, `${chapter.id}: bilingual summary required`)
  assert.ok(chapter.period, `${chapter.id}: period required`)
  assert.ok(Array.isArray(chapter.slugs), `${chapter.id}: slugs list required`)
  for (const slug of chapter.slugs) assert.ok(publicSlugs.has(slug), `${chapter.id}: unknown public case ${slug}`)
  if (chapter.timelineId) assert.ok(timelineIds.has(chapter.timelineId), `${chapter.id}: unknown timeline id ${chapter.timelineId}`)
}

for (const representative of story.representatives) {
  assert.ok(representative.title?.zh && representative.title?.en, `${representative.id}: bilingual title required`)
  assert.ok(representative.statement?.zh && representative.statement?.en, `${representative.id}: bilingual statement required`)
  for (const slug of representative.slugs) assert.ok(publicSlugs.has(slug), `${representative.id}: unknown case ${slug}`)
}

for (const project of story.openSource) {
  assert.ok(publicSlugs.has(project.slug), `${project.slug}: public case required`)
  assert.match(project.upstreamUrl, /^https:\/\/github\.com\//, `${project.slug}: upstream URL required`)
  assert.ok(project.upstream && project.license, `${project.slug}: upstream and license required`)
  for (const field of ['retained', 'contribution', 'result', 'boundary']) assert.ok(project[field]?.zh && project[field]?.en, `${project.slug}: bilingual ${field} required`)
}

const chapterSlugs = story.careerChapters.flatMap(item => item.slugs)
assert.equal(chapterSlugs.length, new Set(chapterSlugs).size, 'A case may appear in only one career chapter')
assert.deepEqual(new Set(story.capabilityEvidence.map(item => item.id)), new Set(['brand-systems', 'space-product', 'ai-open-source', 'model-render']))

console.log(`PASS: ${story.careerChapters.length} career chapters, ${story.representatives.length} representative lines, ${story.openSource.length} open-source records.`)
