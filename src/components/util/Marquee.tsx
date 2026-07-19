import { cn } from '@/lib/cn'

/**
 * Seamless CSS marquee (no JS). Two identical rows each span the full width and
 * translate by -100% in lockstep, so the loop is gapless. Pauses on hover and
 * honors reduced-motion (the global override freezes the animation).
 */
export function Marquee({
  items,
  className,
  speed = 34,
  separator = '✦',
}: {
  items: string[]
  className?: string
  speed?: number
  separator?: string
}) {
  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <div
      className="flex min-w-full shrink-0 items-center justify-around gap-8 pr-8 [animation:marquee_linear_infinite] group-hover:[animation-play-state:paused]"
      style={{ animationDuration: `${speed}s` }}
      aria-hidden={hidden || undefined}
    >
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span>{it}</span>
          <span className="text-primary/70">{separator}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={cn('group flex overflow-hidden', className)}>
      <Row />
      <Row hidden />
      <style>{`@keyframes marquee { to { transform: translateX(-100%); } }`}</style>
    </div>
  )
}
