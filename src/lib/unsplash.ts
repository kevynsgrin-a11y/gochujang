/**
 * Build an optimized Unsplash CDN URL from a photo id.
 *
 * NOTE: this project is built in a locked-down environment that cannot reach
 * images.unsplash.com, so these URLs are verified only in the visitor's
 * browser. Every <SmartImage> pairs the photo with a palette gradient
 * fallback, and all photo references live in `src/data/images.ts` so they can
 * be swapped for self-hosted / licensed assets in one place.
 */
export interface ImgOpts {
  w?: number
  q?: number
  fit?: 'crop' | 'max'
  ar?: string // e.g. "4:5"
}

export function unsplashUrl(id: string, { w = 1200, q = 70, fit = 'crop', ar }: ImgOpts = {}): string {
  // Accept a bare id ("1504674900247-0877df9cc836"), a "photo-" slug, or a full URL.
  if (id.startsWith('http')) return id
  const slug = id.startsWith('photo-') ? id : `photo-${id}`
  const params = new URLSearchParams({
    auto: 'format',
    fit,
    w: String(w),
    q: String(q),
  })
  if (ar) params.set('ar', ar)
  return `https://images.unsplash.com/${slug}?${params.toString()}`
}

const WIDTHS = [480, 768, 1080, 1600, 2000]

export function unsplashSrcSet(id: string, opts: ImgOpts = {}): string {
  if (id.startsWith('http')) return ''
  return WIDTHS.map((w) => `${unsplashUrl(id, { ...opts, w })} ${w}w`).join(', ')
}
