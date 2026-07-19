import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface RadarAxis {
  label: string
  value: number // 0-10
}

/**
 * Six-axis flavor hexagon. Grid hairlines + an ember-filled plotted area that
 * draws on view. role=img with a full text description so it is never
 * color-only.
 */
export function FlavorRadar({
  axes,
  size = 260,
  className,
}: {
  axes: RadarAxis[]
  size?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 34
  const n = axes.length
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2

  const point = (i: number, radiusFactor: number) => {
    const a = angle(i)
    return [cx + Math.cos(a) * R * radiusFactor, cy + Math.sin(a) * R * radiusFactor] as const
  }

  const rings = [0.25, 0.5, 0.75, 1]
  const gridPoly = (factor: number) =>
    axes.map((_, i) => point(i, factor).join(',')).join(' ')

  const dataPoly = axes.map((ax, i) => point(i, Math.max(0.04, ax.value / 10)).join(',')).join(' ')
  const label = axes.map((a) => `${a.label} ${a.value} of 10`).join(', ')

  return (
    <div className={cn('relative', className)} role="img" aria-label={`Flavor profile: ${label}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.42" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        {rings.map((f) => (
          <polygon key={f} points={gridPoly(f)} className="fill-none stroke-line/70" strokeWidth={1} />
        ))}
        {axes.map((_, i) => {
          const [x, y] = point(i, 1)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="stroke-line/50" strokeWidth={1} />
        })}
        <motion.polygon
          points={dataPoly}
          fill="url(#radar-fill)"
          stroke="rgb(var(--accent))"
          strokeWidth={1.75}
          strokeLinejoin="round"
          initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {axes.map((ax, i) => {
          const [x, y] = point(i, Math.max(0.04, ax.value / 10))
          return <circle key={i} cx={x} cy={y} r={3} className="fill-accent" />
        })}
        {axes.map((ax, i) => {
          const [x, y] = point(i, 1.2)
          return (
            <text
              key={ax.label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted font-accent text-[10px] uppercase tracking-wider"
            >
              {ax.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
