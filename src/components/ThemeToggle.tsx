import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '@/lib/useTheme'
import { cn } from '@/lib/cn'

export function ThemeToggle({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  const reduce = useReducedMotion()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={cn(
        'relative grid h-11 w-11 place-items-center rounded-full border backdrop-blur transition-colors',
        onDark
          ? 'border-white/30 bg-white/10 text-white hover:border-white/60'
          : 'border-line bg-surface/60 text-muted hover:border-primary/50 hover:text-primary',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: reduce ? 0 : -40, scale: reduce ? 1 : 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: reduce ? 0 : 40, scale: reduce ? 1 : 0.6 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="grid place-items-center"
        >
          {isDark ? <Sun aria-hidden className="h-[18px] w-[18px]" /> : <Moon aria-hidden className="h-[18px] w-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
