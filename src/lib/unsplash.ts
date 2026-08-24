/**
 * Legacy image helpers retained only to keep older local imports from failing.
 * The controlled preview permits self-hosted assets under `/` and never
 * constructs a third-party image URL in a visitor's browser.
 */
export interface ImgOpts {
  w?: number
  q?: number
  fit?: 'crop' | 'max'
  ar?: string // e.g. "4:5"
}

export function unsplashUrl(id: string, _opts: ImgOpts = {}): string {
  return id.startsWith('/') ? id : ''
}

export function unsplashSrcSet(_id: string, _opts: ImgOpts = {}): string {
  return ''
}
