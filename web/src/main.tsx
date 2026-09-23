import { stripBase } from './data/sitePaths'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource/geist/latin-400.css'
import '@fontsource/geist/latin-500.css'
import '@fontsource/geist/latin-600.css'
import '@fontsource/geist-mono/latin-400.css'
import '@fontsource/geist-mono/latin-500.css'
import './styles/design-os-tokens.css'
import '@fontsource/kanit/latin-400.css'
import '@fontsource/kanit/latin-600.css'
import '@fontsource/kanit/latin-800.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/600.css'
import './ui/design-os-v9.css'
import './ui/home-v9.css'
import App from './App'

const root = document.getElementById('root')!
const path = stripBase(location.pathname).replace(/\/$/, '') || '/'
const renderedPath = root.dataset.route?.replace(/\/$/, '') || '/'
const legacy = location.hash.startsWith('#/') || location.hash === '#works'
if (root.hasChildNodes() && path === renderedPath && !legacy) hydrateRoot(root, <App />)
else createRoot(root).render(<App />)
