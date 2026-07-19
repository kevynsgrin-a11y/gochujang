import { Flame, Timer, Globe, Sparkles, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CountUp } from '@/components/CountUp'

const GLYPHS: Record<string, LucideIcon> = {
  flame: Flame,
  timer: Timer,
  streak: Flame,
  globe: Globe,
  sparkle: Sparkles,
  trending: TrendingUp,
}

export function StatTile({
  value,
  label,
  caption,
  glyph = 'flame',
  tone = 'ember',
  className,
}: {
  value: string
  label: string
  caption?: string
  glyph?: string
  tone?: 'ember' | 'celadon'
  className?: string
}) {
  const Icon = GLYPHS[glyph] ?? Flame
  return (
    <div className={cn('card grain relative overflow-hidden p-6', className)}>
      <div className="relative z-10">
        <span
          className={cn(
            'inline-grid h-10 w-10 place-items-center rounded-glyph',
            tone === 'celadon' ? 'bg-celadon/15 text-celadon' : 'bg-primary/12 text-primary',
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="mt-4 text-4xl font-semibold text-ink">
          <CountUp value={value} />
        </div>
        <div className="mt-1 text-body font-medium text-ink">{label}</div>
        {caption && <div className="mt-0.5 text-caption text-muted">{caption}</div>}
      </div>
    </div>
  )
}
