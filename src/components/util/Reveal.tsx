import { motion, type Variants } from 'framer-motion'
import { fadeUp, inViewOnce } from '@/lib/motion'

/**
 * Scroll-reveal wrapper. Animates once when it enters the viewport. Reduced
 * motion is honored globally via <MotionConfig reducedMotion="user"> in main.tsx.
 * Defaults to a gentle fade-up.
 */
export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  variants?: Variants
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
}) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  )
}
