import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import path from 'node:path'

const cleanRoutePreview = {
  name: 'portfolio-clean-route-preview',
  configurePreviewServer(server: { config: { root: string; base: string; build: { outDir: string } }; middlewares: { use: (handler: (request: { method?: string; url?: string }, response: unknown, next: () => void) => void) => void } }) {
    server.middlewares.use((request, _response, next) => {
      if (request.method !== 'GET' || !request.url) return next()
      let url: URL
      try { url = new URL(request.url, 'http://preview.local') } catch { return next() }
      if (url.pathname.includes('.') || url.pathname.startsWith('/@')) return next()
      const prefix = server.config.base.replace(/\/$/, '')
      const local = prefix && url.pathname.startsWith(prefix + '/') ? url.pathname.slice(prefix.length) : url.pathname
      const route = local.replace(/\/$/, '') || '/'
      const output = path.resolve(server.config.root, server.config.build.outDir)
      const routeFile = path.join(output, route === '/' ? 'index.html' : route.slice(1), route === '/' ? '' : 'index.html')
      const target = existsSync(routeFile) ? routeFile : path.join(output, '404', 'index.html')
      request.url = `${server.config.base}${path.relative(output, target).replaceAll('\\', '/')}${url.search}`
      next()
    })
  },
}

export default defineConfig(({ command }) => ({
  // Production is served at the domain root; absolute assets keep clean
  // pathname routes from resolving scripts and media under /work or /lab.
  base: process.env.PORTFOLIO_BASE_PATH || '/',
  plugins: [react(), cleanRoutePreview],
  publicDir: command === 'serve' ? 'public' : false,
  // Ignore retained release snapshots during development dependency discovery.
  optimizeDeps: { entries: ['index.html'] },
  // Keep reproducible builds outside desktop sync folders when needed.
  build: { emptyOutDir: true, outDir: process.env.PORTFOLIO_BUILD_DIR || 'dist' },
  server: { host: '127.0.0.1', port: 5173, fs: { strict: true } },
}))
