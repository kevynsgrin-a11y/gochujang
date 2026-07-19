import { cn } from '@/lib/cn'
import { spiceWord } from '@/data/catalog'

export function ChiliGlyph({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M7 9c5.2 0 9 3.8 9 8.6 0 2.9-2.1 5.4-5.2 5.4C6.4 23 3 18.4 3 13.2"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}
      />
      <path
        d="M16 9.5c.9-2 2.9-2.8 4.6-2.4M15 10c1.4-1.4 2-3 1.6-4.6"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Heat as a chili-glyph ramp. Never color-only: the count + word band carry
 * the meaning too. `level` and `max` default to the 0-5 catalog scale.
 */
export function SpiceMeter({
  level,
  max = 5,
  size = 'sm',
  showLabel = true,
  className,
}: {
  level: number
  max?: number
  size?: 'xs' | 'sm' | 'md'
  showLabel?: boolean
  className?: string
}) {
  const dim = size === 'xs' ? 'h-3 w-3' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4'
  const word = spiceWord(level)
  return (
    <div
      className={cn('inline-flex items-center gap-1.5', className)}
      role="img"
      aria-label={`Heat ${level} of ${max} — ${word}`}
    >
      <span className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <ChiliGlyph
            key={i}
            filled={i < level}
            className={cn(
              dim,
              i < level ? 'text-primary drop-shadow-[0_0_3px_rgba(240,135,63,0.5)]' : 'text-line',
            )}
          />
        ))}
      </span>
      {showLabel && (
        <span className="font-accent text-[0.66rem] font-medium uppercase tracking-[0.14em] text-muted">
          {word}
        </span>
      )}
    </div>
  )
}
