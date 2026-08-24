import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import { cn } from '@/lib/cn'
import { PREVIEW_STATUS } from '@/data/site'

export function NewsletterForm({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <aside
      className={cn(
        'rounded-card border border-line bg-surface-alt',
        compact ? 'p-4' : 'p-5',
        className,
      )}
      aria-label="Newsletter availability"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-subtle/30 text-ink" aria-hidden="true">
          <Info className="h-4 w-4" />
        </span>
        <div>
          <p className="font-medium text-ink">Newsletter signup is unavailable during preview.</p>
          <p className="mt-1 text-caption text-muted">{PREVIEW_STATUS.description}</p>
          <Link to="/privacy" className="mt-3 inline-block text-caption text-primary hover:underline">
            Read the preview privacy notice
          </Link>
        </div>
      </div>
    </aside>
  )
}
