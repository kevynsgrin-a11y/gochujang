import { cn } from '@/lib/cn'

/**
 * The Gochujang ember glyph — a stylized flame/chili rising from a bowl,
 * drawn with the brand ember gradient. Pure SVG, scales crisply, uses a
 * unique gradient id per size so multiple marks can coexist.
 */
export function BrandGlyph({
  className,
  id = 'brand',
  decorative = false,
}: {
  className?: string
  id?: string
  decorative?: boolean
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'Gochujang' })}
    >
      <defs>
        <linearGradient id={`${id}-ember`} x1="12" y1="6" x2="52" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--persimmon))" />
          <stop offset="0.5" stopColor="rgb(var(--accent))" />
          <stop offset="1" stopColor="rgb(var(--primary))" />
        </linearGradient>
      </defs>
      <path
        d="M32 6c4.2 7.4 2.2 12.4-1.4 17-3.6 4.5-5.9 8.5-4.1 13.5 1.1 3 3.6 5 3.6 5s-5.5-.7-8.4-5c-1.2-1.9-1.8-4-1.7-6.2-3.7 3.1-6 7.8-6 13.2C14 62 21.8 68 32 68s18-7 18-16.9c0-8.9-4.8-15-9.8-20.7C42.4 34.4 44.8 39.2 41.8 44.3c0 0 1.6-7.2-2.9-14.6C34.4 22.9 29.4 16.4 32 6Z"
        fill={`url(#${id}-ember)`}
        transform="scale(0.86) translate(5 2)"
      />
    </svg>
  )
}

export function BrandMark({
  className,
  glyphClassName,
  showWord = true,
  onDark = false,
  id = 'brand',
}: {
  className?: string
  glyphClassName?: string
  showWord?: boolean
  onDark?: boolean
  id?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-display', className)}>
      <BrandGlyph id={id} decorative={showWord} className={cn('h-8 w-8 shrink-0', glyphClassName)} />
      {showWord && (
        <span className={cn('text-[1.35rem] font-semibold tracking-tight', onDark ? 'text-white' : 'text-ink')}>
          Gochu<span className="text-gradient">jang</span>
        </span>
      )}
    </span>
  )
}
