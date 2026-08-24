import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import catalog from '@/data/catalog.json'
import {
  buildRoutes,
  titleFor,
  canonicalFor,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  normalizePath,
  ORIGIN,
  SITE_NAME,
} from '@/data/seo.js'

interface RouteMeta {
  path: string
  title: string
  description: string
  ogType: string
  indexable: boolean
  rawTitle?: boolean
}

/**
 * Every route's metadata, keyed by pathname — built from the SAME model the
 * build-time prerenderer uses (src/data/seo.js), so the document a crawler
 * fetches and the document a browser ends up with always agree.
 */
const ROUTES: Map<string, RouteMeta> = new Map(
  (buildRoutes(catalog) as RouteMeta[]).map((r) => [normalizePath(r.path), r]),
)

const NOT_FOUND: RouteMeta = {
  path: '/404',
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
  ogType: 'website',
  indexable: false,
}

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute('content', value)
}

/** Create the tag if the prerendered document did not already carry it. */
function ensure(selector: string, create: () => HTMLElement): Element {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

/**
 * Applies the current route's metadata to the live document.
 *
 * The prerendered HTML already carries the correct tags for a hard load; this
 * keeps them correct across client-side navigations, where no new document is
 * ever fetched.
 */
export function usePageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const normalizedPathname = normalizePath(pathname)
    const route = ROUTES.get(normalizedPathname) ?? NOT_FOUND
    const title = route === NOT_FOUND ? `${NOT_FOUND.title} · ${SITE_NAME}` : titleFor(route)
    const desc = route.description || DEFAULT_DESCRIPTION
    const url = route === NOT_FOUND ? ORIGIN + normalizedPathname : canonicalFor(route)

    document.title = title || DEFAULT_TITLE
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[property="og:url"]', url)
    setMeta('meta[property="og:type"]', route.ogType)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[name="twitter:image"]', DEFAULT_OG_IMAGE)

    const canonical = ensure('link[rel="canonical"]', () => {
      const l = document.createElement('link')
      l.setAttribute('rel', 'canonical')
      return l
    })
    canonical.setAttribute('href', url)

    // Preview/unknown routes must not be indexed even when a visitor reaches
    // them through an in-app navigation rather than a fresh document load.
    const robots = ensure('meta[name="robots"]', () => {
      const m = document.createElement('meta')
      m.setAttribute('name', 'robots')
      return m
    })
    robots.setAttribute('content', route.indexable ? 'index, follow' : 'noindex, follow')
  }, [pathname])
}
