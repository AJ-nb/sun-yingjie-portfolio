import { rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const buildDirectory = path.resolve(process.env.PORTFOLIO_BUILD_DIR || path.join(root, 'web', 'dist'))
const protectedDirectory = path.join(root, 'web', 'dist-v6')

if (buildDirectory === protectedDirectory) {
  throw new Error('Refusing to clean the retained web/dist-v6 release snapshot.')
}

await rm(buildDirectory, { recursive: true, force: true })
console.log(`Prepared clean portfolio build directory: ${buildDirectory}`)
