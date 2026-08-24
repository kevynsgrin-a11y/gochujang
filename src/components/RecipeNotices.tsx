import { Link } from 'react-router-dom'
import { FlaskConical, Info } from 'lucide-react'

/**
 * A visible marker that a recipe is preview content.
 *
 * Every recipe on the site is currently an untested editorial draft, and the
 * page must say so where a reader will actually see it — not only in body copy
 * further down the page.
 */
export function DraftBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-warning/50 bg-warning/10 px-3 py-1 font-accent text-[0.68rem] font-medium uppercase tracking-[0.14em] text-warning">
      <Info className="h-3.5 w-3.5" aria-hidden />
      Not kitchen-tested
    </span>
  )
}

/**
 * Fermentation carries real food-safety risk. A draft without validated
 * process controls must not imply that a reader can safely complete the work
 * by filling in the missing values themselves.
 */
export function FermentationSafetyNote({ fermentDays }: { fermentDays: number }) {
  return (
    <aside
      className="mt-6 rounded-card border border-warning/40 bg-warning/[0.07] p-5"
      aria-labelledby="ferment-safety-heading"
    >
      <h3
        id="ferment-safety-heading"
        className="flex items-center gap-2 font-accent text-eyebrow font-medium uppercase tracking-[0.16em] text-warning"
      >
        <FlaskConical className="h-4 w-4" aria-hidden />
        Fermentation safety
      </h3>
      <p className="mt-3 text-caption text-muted">
        This draft references about {fermentDays} {fermentDays === 1 ? 'day' : 'days'} of
        fermentation, but it lacks documented, validated process controls and storage guidance.
        Do not use this page to start, manage, or assess a ferment.
      </p>
      <p className="mt-3 text-caption text-muted">
        Procedure details remain withheld until test-kitchen, food-safety, cultural, and editorial
        evidence has been recorded. See the{' '}
        <Link className="text-primary hover:underline" to="/editorial-policy">
          editorial policy
        </Link>
        .
      </p>
    </aside>
  )
}
