import { cn } from '@/lib/cn'

// Deterministic pseudo-random from a seed string → stable per route/dish.
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/**
 * Seeded molten-ember backdrop: a warm-charcoal field with an off-center ember
 * bloom and a couple of soft blobs. Renders behind SmartImage so the crimson
 * accent lands in-viewport even if the photo CDN fails. Pure CSS/SVG, cheap.
 */
export function GenerativeHeroArt({
  seed = 'gochujang',
  className,
  drift = false,
  base = true,
}: {
  seed?: string
  className?: string
  drift?: boolean
  /** Paint the opaque charcoal ground (for dark full-bleed heroes). Set false
   *  when layering faintly over a light section so it doesn't muddy the paper. */
  base?: boolean
}) {
  const h = hash(seed)
  const b1x = 55 + (h % 30)
  const b1y = 70 + ((h >> 3) % 25)
  const b2x = 8 + ((h >> 5) % 30)
  const b2y = 12 + ((h >> 7) % 30)
  const b3x = 30 + ((h >> 9) % 40)
  const b3y = 40 + ((h >> 11) % 30)

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', base && 'bg-[#161210]', className)} aria-hidden>
      <div
        className={cn('absolute h-[80%] w-[80%] rounded-full blur-[80px]', drift && 'animate-float-slow')}
        style={{
          left: `${b1x - 40}%`,
          top: `${b1y - 40}%`,
          background: 'radial-gradient(circle, rgba(240,135,63,0.55), rgba(198,58,32,0.35) 45%, transparent 70%)',
        }}
      />
      <div
        className={cn('absolute h-[55%] w-[55%] rounded-full blur-[90px]', drift && 'animate-float-slow')}
        style={{
          left: `${b2x - 25}%`,
          top: `${b2y - 25}%`,
          background: 'radial-gradient(circle, rgba(122,30,18,0.5), transparent 68%)',
          animationDelay: '-3s',
        }}
      />
      <div
        className="absolute h-[45%] w-[45%] rounded-full blur-[70px]"
        style={{
          left: `${b3x - 22}%`,
          top: `${b3y - 22}%`,
          background: 'radial-gradient(circle, rgba(217,98,44,0.35), transparent 66%)',
        }}
      />
    </div>
  )
}
