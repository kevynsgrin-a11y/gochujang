import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

export function NewsletterForm({ compact = false, className }: { compact?: boolean; className?: string }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  /*
   * There is no mail provider, API route, or network call behind this form —
   * and until there is, the UI must not imply that an address was captured.
   * The submit handler only flips local state, and the copy says exactly that.
   */
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
  }

  return (
    <form onSubmit={submit} className={cn('w-full', className)} aria-label="Newsletter signup">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-pill border border-line bg-surface-alt px-5 py-3"
            role="status"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-subtle/30 text-ink">
              <Info className="h-4 w-4" />
            </span>
            <p className="text-caption text-ink">
              Newsletter preview — no email is sent, and nothing was stored.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={false}
            className={cn('flex gap-2', compact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row')}
          >
            <label htmlFor={compact ? 'nl-compact' : 'nl'} className="sr-only">
              Email address
            </label>
            <input
              id={compact ? 'nl-compact' : 'nl'}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@appetite.com"
              className="min-w-0 flex-1 rounded-pill border border-line bg-elevated px-5 py-3 text-body text-ink transition-colors placeholder:text-subtle focus:border-accent"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
            <p className="basis-full text-eyebrow text-subtle sm:mt-2">
              Newsletter preview — no email is sent.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
