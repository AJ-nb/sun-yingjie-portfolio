import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../web/src/data/capabilities.ts', import.meta.url), 'utf8')
const research = await readFile(new URL('../web/src/data/globalResearch.ts', import.meta.url), 'utf8')
const expectedTerritories = ['brand-visual', 'product-industrial', 'three-d', 'digital', 'aigc-automation', 'global-research', 'delivery-systems']
for (const id of expectedTerritories) {
  if (!source.includes(`id: '${id}'`)) throw new Error(`Missing capability territory: ${id}`)
}
if (!source.includes("'demonstrated-expertise'") || !source.includes("'professional-proficiency'")) {
  throw new Error('Capability levels must use the brief-defined values')
}
if (!source.includes('Input → Research → Direction → Generate → Compare → Edit → Validate → Deliver')) {
  throw new Error('AIGC workflow pipeline is missing')
}
for (const marker of ['sourceRegisterFields', 'researchPipeline', 'priorityMarkets']) {
  if (!research.includes(marker)) throw new Error(`Global research contract is missing: ${marker}`)
}
console.log(JSON.stringify({ passed: true, territories: expectedTerritories.length }))
