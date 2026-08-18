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
 * Fermentation carries real food-safety risk, and this recipe does not yet
 * carry the numbers that would make it safe to follow blindly.
 *
 * Deliberately states the decision points a cook must settle rather than
 * inventing salt percentages, pH values, or hold temperatures we have not
 * measured — publishing invented figures for a ferment would be worse than
 * publishing none.
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
        This draft calls for about {fermentDays} {fermentDays === 1 ? 'day' : 'days'} of
        fermentation but does not yet specify the checkpoints a ferment needs. We have not
        measured them, and we will not print numbers we have not verified. Before you start,
        settle and write down:
      </p>
      <ul className="mt-3 ml-5 list-disc space-y-1.5 text-caption text-muted">
        <li>Salt as a percentage of the weight of vegetables and brine.</li>
        <li>The temperature range you will hold, and for how long.</li>
        <li>Jar headspace, and whether you will burp the jar or use an airlock.</li>
        <li>Where the batch moves to cold storage, and how long it keeps there.</li>
      </ul>
      <p className="mt-3 text-caption text-muted">
        Keep everything under the brine. Discard the batch for fuzzy or coloured mould, a slimy or
        pink brine, or any smell that is off rather than cleanly sour — when in doubt, throw it
        out. Follow the fermentation and food-safety guidance published by the food-safety
        authority where you live.
      </p>
      <p className="mt-3 text-caption text-muted">
        Tested figures will be published with this recipe once it has been through a test kitchen.
        See our{' '}
        <Link className="text-primary hover:underline" to="/editorial-policy">
          editorial policy
        </Link>
        .
      </p>
    </aside>
  )
}
