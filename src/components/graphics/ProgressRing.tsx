import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

/**
 * Batch progress ring. The arc draws from 0 → pct on mount; a "ready" ring
 * switches to celadon. role=progressbar with a text value for AT.
 */
export function ProgressRing({
  pct,
  size = 64,
  stroke = 7,
  ready = false,
  label,
  children,
  className,
}: {
  pct: number
  size?: number
  stroke?: number
  ready?: boolean
  label?: string
  children?: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const uid = useId()
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, pct))
  const offset = c - (clamped / 100) * c
  const emberId = `ring-ember-${uid}`
  const celadonId = `ring-celadon-${uid}`
  const gradId = ready ? celadonId : emberId

  return (
    <div
      className={cn('relative grid place-items-center', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={label ?? `${Math.round(clamped)}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={emberId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0873F" />
            <stop offset="100%" stopColor="#C63A20" />
          </linearGradient>
          <linearGradient id={celadonId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7FBF9E" />
            <stop offset="100%" stopColor="#3E7C63" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-line/60" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={`url(#${gradId})`}
          className="fill-none"
          style={{ strokeDasharray: c }}
          initial={{ strokeDashoffset: reduce ? offset : c }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}
