import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { fadeUp, inViewOnce } from '@/lib/motion'

export function SectionHeader({
  eyebrow,
  title,
  titleAccent,
  dek,
  align = 'left',
  className,
  action,
}: {
  eyebrow?: string
  title: string
  titleAccent?: string
  dek?: string
  align?: 'left' | 'center'
  className?: string
  action?: React.ReactNode
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
        action ? 'sm:flex-row sm:items-end sm:justify-between' : '',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
            <span className="rule" aria-hidden />
            <span className="eyebrow">{eyebrow}</span>
          </div>
        )}
        <h2 className="mt-3 text-h2 font-semibold">
          {title}
          {titleAccent && <span className="text-gradient"> {titleAccent}</span>}
        </h2>
        {dek && <p className="mt-3 text-body-lg text-muted">{dek}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}
