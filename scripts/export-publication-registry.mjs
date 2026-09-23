import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const web = path.join(root, 'web')
const require = createRequire(path.join(web, 'package.json'))
const { createServer } = await import(pathToFileURL(require.resolve('vite')).href)
const server = await createServer({ root: web, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { filterProjects } = await server.ssrLoadModule('/src/data/projectRegistry.ts')
  const records = Object.fromEntries(filterProjects().map(p => [p.slug, p]))
  await mkdir(path.join(root, '.production-runtime'), { recursive: true })
  await writeFile(path.join(root, '.production-runtime/registry-v9.json'), JSON.stringify(records, null, 2))
  console.log(`Exported ${Object.keys(records).length} shared project records for publication`)
} finally { await server.close() }
