import { useEffect } from 'react'
import { getPageMetadata, getStructuredData } from '../data/siteMetadata'
import type { Lang } from '../data/workDocs'
import type { DesignOSRoute } from '../data/routeResolver'

type Props = { route: DesignOSRoute | null; lang: Lang }

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[data-design-os-seo="${key}"], meta[${attribute}="${key}"]`)
  if (!node) {
    node = document.createElement('meta')
    node.dataset.designOsSeo = key
    document.head.appendChild(node)
  }
  node.setAttribute(attribute, key)
  node.content = content
}

function setCanonical(url: string): void {
  let node = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!node) { node = document.createElement('link'); node.rel = 'canonical'; document.head.appendChild(node) }
  node.href = url
}

function setStructuredData(data: Record<string, unknown>): void {
  let node = document.head.querySelector<HTMLScriptElement>('script[data-design-os-seo-jsonld]')
  if (!node) {
    node = document.createElement('script')
    node.type = 'application/ld+json'
    node.dataset.designOsSeoJsonld = 'true'
    document.head.appendChild(node)
  }
  node.textContent = JSON.stringify(data)
}

export function DesignOSSeo({ route, lang }: Props) {
  useEffect(() => {
    const page = getPageMetadata(route, lang)
    const image = page.image
    document.title = page.title
    setMeta('name', 'description', page.description)
    setMeta('name', 'robots', page.noindex ? 'noindex,follow' : 'index,follow')
    setMeta('property', 'og:title', page.title)
    setMeta('property', 'og:description', page.description)
    setMeta('property', 'og:url', page.canonical)
    setMeta('property', 'og:type', page.type === 'CreativeWork' ? 'article' : 'website')
    setMeta('property', 'og:locale', lang === 'zh' ? 'zh_CN' : 'en_US')
    if (image) setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', page.title)
    setMeta('name', 'twitter:description', page.description)
    if (image) setMeta('name', 'twitter:image', image)
    setCanonical(page.canonical)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    for (const node of document.head.querySelectorAll('link[rel="alternate"][hreflang]')) node.remove()
    for (const [locale, url] of Object.entries(page.alternates ?? {})) {
      const node = document.createElement('link')
      node.rel = 'alternate'; node.hreflang = locale; node.href = url
      document.head.appendChild(node)
    }
    setStructuredData(getStructuredData(page, lang))
  }, [lang, route])
  return null
}
