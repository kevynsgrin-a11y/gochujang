import { useMemo } from 'react'
import { buildActivity } from '@/data/kitchen'
import { cn } from '@/lib/cn'

const LEVELS = ['bg-surface-alt', 'bg-primary/25', 'bg-primary/50', 'bg-primary/75', 'bg-primary']

/** GitHub-style cooking calendar. Never bare color: includes a text summary + per-cell titles. */
export function StreakHeatmap({ className }: { className?: string }) {
  const data = useMemo(() => buildActivity(18), [])
  const lead = data.length ? data[0].date.getDay() : 0
  const totalCooks = data.reduce((s, d) => s + d.count, 0)
  const activeDays = data.filter((d) => d.count > 0).length

  return (
    <div className={cn('', className)}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-caption text-muted">
            <span className="tnum font-semibold text-ink">{activeDays}</span> active days ·{' '}
            <span className="tnum font-semibold text-ink">{totalCooks}</span> cooks logged
          </p>
        </div>
        <div className="hidden items-center gap-1.5 text-[0.65rem] text-subtle sm:flex">
          <span>Less</span>
          {LEVELS.map((l, i) => (
            <span key={i} className={cn('h-2.5 w-2.5 rounded-[3px]', l)} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ width: 'max-content' }} aria-hidden>
          {Array.from({ length: lead }).map((_, i) => (
            <span key={`lead-${i}`} className="h-3 w-3" />
          ))}
          {data.map((d, i) => (
            <span
              key={i}
              title={`${d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: ${d.count} ${d.count === 1 ? 'cook' : 'cooks'}`}
              className={cn('h-3 w-3 rounded-[3px] transition-colors', LEVELS[d.count])}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
