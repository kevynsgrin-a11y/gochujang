import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

/** Animated numeral that counts up on view; preserves prefix/suffix (240+, 12.4k). */
export function CountUp({ value, className }: { value: string; className?: string }) {
  // Memoize so the parse keeps a stable reference — otherwise the effect below
  // re-runs on every setDisplay frame and the animation restarts from 0 forever.
  const match = useMemo(() => value.match(/^([^0-9-]*)(-?[\d.,]+)(.*)$/), [value])
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(() => (reduce || !match ? value : match[1] + '0' + match[3]))

  useEffect(() => {
    if (!match) return
    if (reduce) {
      setDisplay(value)
      return
    }
    if (!inView) return
    const target = parseFloat(match[2].replace(/,/g, ''))
    const decimals = (match[2].split('.')[1] || '').length
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const num = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()
        setDisplay(match[1] + num + match[3])
      },
    })
    return () => controls.stop()
  }, [inView, reduce, match, value])

  return (
    <span ref={ref} className={cn('tnum', className)}>
      {display}
    </span>
  )
}
