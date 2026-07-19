import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { unsplashSrcSet, unsplashUrl, type ImgOpts } from '@/lib/unsplash'

export interface SmartImageProps {
  /** Unsplash photo id / slug, a full URL, or a local /path. Empty = gradient only. */
  photo?: string
  alt: string
  /** CSS gradient used as blur-up placeholder AND error/empty fallback. */
  gradient: string
  className?: string
  imgClassName?: string
  /** Tailwind aspect ratio class, e.g. "aspect-[4/5]". */
  aspect?: string
  priority?: boolean
  sizes?: string
  opts?: ImgOpts
  /** Optional dark scrim for text legibility over the image. */
  scrim?: 'none' | 'bottom' | 'full' | 'top'
  children?: React.ReactNode
}

const scrimClass: Record<NonNullable<SmartImageProps['scrim']>, string> = {
  none: '',
  bottom: 'bg-gradient-to-t from-black/70 via-black/20 to-transparent',
  top: 'bg-gradient-to-b from-black/60 via-black/10 to-transparent',
  full: 'bg-black/35',
}

/**
 * Progressive image with a guaranteed-beautiful fallback. The gradient renders
 * instantly; the photo fades in on load; on error (or when no photo is given)
 * the gradient remains, so a slot never looks broken.
 */
export function SmartImage({
  photo,
  alt,
  gradient,
  className,
  imgClassName,
  aspect,
  priority = false,
  sizes = '100vw',
  opts,
  scrim = 'none',
  children,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const isLocal = photo?.startsWith('/') || photo?.startsWith('http')
  const src = photo ? (isLocal ? photo : unsplashUrl(photo, opts)) : undefined
  const srcSet = photo && !isLocal ? unsplashSrcSet(photo, opts) : undefined
  const showImg = Boolean(photo) && !failed

  // Reset load/error state when the source changes (e.g. the reused dish-detail
  // hero across navigations) so a new photo always gets a fresh attempt + fade.
  useEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [src])

  return (
    <div
      className={cn('relative overflow-hidden bg-surface-alt grain isolate', aspect, className)}
      style={{ background: gradient }}
    >
      {showImg && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-[900ms] ease-smooth',
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105',
            imgClassName,
          )}
        />
      )}
      {scrim !== 'none' && <div className={cn('absolute inset-0', scrimClass[scrim])} aria-hidden />}
      {children}
    </div>
  )
}
