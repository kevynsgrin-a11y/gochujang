import type { PassportStamp } from '@/data/kitchen'
import { cn } from '@/lib/cn'

/** Faux rubber-stamp cuisine seal. Ember ring = unlocked, celadon = mastery, dashed/desaturated = locked. */
export function PassportStampSeal({ stamp }: { stamp: PassportStamp }) {
  const mastery = stamp.mastery >= 3
  const ring = !stamp.unlocked
    ? 'text-subtle/50'
    : mastery
      ? 'text-celadon'
      : 'text-primary'

  return (
    <div
      className={cn(
        'group relative grid aspect-square place-items-center rounded-full border p-2 text-center transition-transform',
        stamp.unlocked ? 'border-transparent hover:scale-105' : 'opacity-55',
      )}
      role="img"
      aria-label={
        stamp.unlocked
          ? `${stamp.region}, ${stamp.cuisine} — ${stamp.dishesCooked} cooked${mastery ? ', mastered' : ''}`
          : `${stamp.region}, ${stamp.cuisine} — locked`
      }
    >
      <svg viewBox="0 0 100 100" className={cn('absolute inset-0 h-full w-full', ring)} aria-hidden>
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray={stamp.unlocked ? '0' : '4 4'} opacity="0.9" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
      <div className="relative z-10 px-1">
        <div className={cn('font-display text-sm font-semibold leading-tight', stamp.unlocked ? 'text-ink' : 'text-subtle')}>
          {stamp.region}
        </div>
        <div className="mt-0.5 font-accent text-[0.55rem] uppercase tracking-[0.14em] text-muted">
          {stamp.cuisine}
        </div>
        {stamp.unlocked && (
          <div className="mt-1 font-accent text-[0.6rem] text-subtle tnum">×{stamp.dishesCooked}</div>
        )}
      </div>
    </div>
  )
}
