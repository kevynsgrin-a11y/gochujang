import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const [sx, sy] = polar(cx, cy, r, endDeg)
  const [ex, ey] = polar(cx, cy, r, startDeg)
  const large = endDeg - startDeg <= 180 ? 0 : 1
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`
}

/** 270° Scoville / spice-tolerance gauge. value 0..max. */
export function ScovilleGauge({
  value,
  max = 10,
  band,
  scoville,
  size = 200,
  className,
}: {
  value: number
  max?: number
  band?: string
  scoville?: string
  size?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 18
  const START = -135
  const END = 135
  const SWEEP = END - START
  const pct = Math.max(0, Math.min(1, value / max))
  const valueEnd = START + SWEEP * pct

  return (
    <div className={cn('relative grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label={`Spice tolerance ${value.toFixed(1)} of ${max}${band ? `, ${band}` : ''}`}>
        <defs>
          <linearGradient id="gauge-ember" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#C63A20" />
            <stop offset="55%" stopColor="#E8542E" />
            <stop offset="100%" stopColor="#F0873F" />
          </linearGradient>
        </defs>
        <path d={arcPath(cx, cy, r, START, END)} className="fill-none stroke-line/60" strokeWidth={12} strokeLinecap="round" />
        <motion.path
          d={arcPath(cx, cy, r, START, END)}
          className="fill-none"
          stroke="url(#gauge-ember)"
          strokeWidth={12}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? pct : 0 }}
          whileInView={{ pathLength: pct }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* tick */}
        {(() => {
          const [tx, ty] = polar(cx, cy, r, valueEnd)
          return <circle cx={tx} cy={ty} r={5} className="fill-white stroke-primary" strokeWidth={2} />
        })()}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-4xl font-semibold text-ink tnum">{value.toFixed(1)}</div>
          {band && <div className="font-accent text-eyebrow uppercase tracking-[0.16em] text-primary">{band}</div>}
          {scoville && <div className="mt-0.5 text-[0.7rem] text-muted tnum">{scoville}</div>}
        </div>
      </div>
    </div>
  )
}
