import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ORIGIN = 'https://gochujang.net'
const DEFAULT_TITLE = 'Gochujang — Cook bold. Track what you love.'
const DEFAULT_DESCRIPTION =
  'Gochujang is a premium culinary destination for bold, fire-forward cooking — discover standout dishes, master fermentation, and track every bite worth remembering.'

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute('content', value)
}

/**
 * Per-route document metadata for the SPA. Always writes title, description,
 * canonical, and og/twitter equivalents so nothing goes stale across
 * client-side navigations — and so every route canonicalizes to ITS OWN URL
 * rather than the homepage.
 */
export function usePageMeta(title?: string, description?: string) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} · Gochujang` : DEFAULT_TITLE
    const desc = description ?? DEFAULT_DESCRIPTION
    const url = ORIGIN + (pathname === '/' ? '/' : pathname)

    document.title = fullTitle
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[property="og:url"]', url)
    setMeta('meta[name="twitter:title"]', fullTitle)
    setMeta('meta[name="twitter:description"]', desc)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
  }, [title, description, pathname])
}
