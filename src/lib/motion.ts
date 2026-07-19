import type { Variants } from 'framer-motion'

// Shared Framer Motion presets so animation feels consistent site-wide.
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_SMOOTH },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE_SMOOTH } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_SMOOTH } },
}

/** Stagger container — children should use `fadeUp` / `scaleIn`. */
export function stagger(step = 0.08, delayChildren = 0.05): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: step, delayChildren },
    },
  }
}

/** Standard whileInView viewport config: animate once, a touch before fully visible. */
export const inViewOnce = { once: true, margin: '0px 0px -12% 0px' } as const
