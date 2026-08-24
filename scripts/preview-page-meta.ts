import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import catalog from '../src/data/catalog.json'
import {
  buildRoutes,
  canonicalFor,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  normalizePath,
  ORIGIN,
  SITE_NAME,
  titleFor,
} from '../src/data/seo.js'

const PREVIEW_ROBOTS = 'noindex, nofollow, noarchive'

interface RouteMeta {
  path: string
  title: string
  description: string
  ogType: string
  rawTitle?: boolean
}

const ROUTES = new Map<string, RouteMeta>(
  (buildRoutes(catalog) as RouteMeta[]).map((route) => [normalizePath(route.path), route]),
)

const NOT_FOUND: RouteMeta = {
  path: '/404',
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
  ogType: 'website',
}

function ensureMeta(attribute: 'name' | 'property', value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    document.head.appendChild(element)
  }
  return element
}

function setMeta(attribute: 'name' | 'property', name: string, content: string) {
  ensureMeta(attribute, name).setAttribute('content', content)
}

function ensureCanonical() {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  return element
}

function webpageSchema(route: RouteMeta, url: string, title: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${ORIGIN}/`,
    },
  }
}

function breadcrumbSchema(route: RouteMeta, url: string) {
  if (route.path === '/') return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: route.title, item: url },
    ],
  }
}

function replaceJsonLd(route: RouteMeta, url: string, title: string, description: string) {
  // The static document may contain route-level JSON-LD from a previous page
  // view. Replace every block so a client-side navigation cannot retain a
  // stale recipe or breadcrumb entity.
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((node) => node.remove())

  const schemas = [webpageSchema(route, url, title, description), breadcrumbSchema(route, url)].filter(
    Boolean,
  )

  for (const schema of schemas) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.previewJsonld = 'true'
    script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c')
    document.head.appendChild(script)
  }
}

/**
 * Preview-only runtime metadata. Vite aliases the app's production import to
 * this module, ensuring client-side navigation cannot re-enable indexing or
 * introduce recipe rich-result markup after a prerendered page has hydrated.
 */
export function usePageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const normalizedPathname = normalizePath(pathname)
    const route = ROUTES.get(normalizedPathname) ?? NOT_FOUND
    const title = route === NOT_FOUND ? `${NOT_FOUND.title} · ${SITE_NAME}` : titleFor(route)
    const description = route.description || DEFAULT_DESCRIPTION
    const url = route === NOT_FOUND ? `${ORIGIN}${normalizedPathname}` : canonicalFor(route)

    document.title = title || DEFAULT_TITLE
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', route.ogType)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:image', DEFAULT_OG_IMAGE)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', DEFAULT_OG_IMAGE)
    ensureCanonical().setAttribute('href', url)
    setMeta('name', 'robots', PREVIEW_ROBOTS)
    replaceJsonLd(route, url, title, description)
  }, [pathname])
}
