import { GenerativeHeroArt } from '@/components/decor/GenerativeHeroArt'
import { usePageMeta } from '@/lib/usePageMeta'
import { POLICY_VERSION } from '@/data/seo.js'

/**
 * Shared shell for the governance pages (privacy, terms, contact, editorial
 * policy). Deliberately plain and text-forward — these pages are read, not
 * browsed — while still carrying the brand's type and palette.
 */
export function PolicyPage({
  eyebrow,
  title,
  titleAccent,
  intro,
  children,
  showVersion = true,
}: {
  eyebrow: string
  title: string
  titleAccent?: string
  intro?: string
  children: React.ReactNode
  showVersion?: boolean
}) {
  usePageMeta()
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-bg pt-28">
        <GenerativeHeroArt seed={`policy-${title}`} base={false} className="opacity-50" />
        <div className="container-x relative z-10 pb-12">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-display-xl font-semibold">
            {title} {titleAccent && <span className="text-gradient">{titleAccent}</span>}
          </h1>
          {intro && <p className="mt-4 max-w-2xl text-body-lg text-muted">{intro}</p>}
          {showVersion && (
            <p className="mt-6 font-accent text-eyebrow uppercase tracking-[0.16em] text-muted">
              Version {POLICY_VERSION}
            </p>
          )}
        </div>
      </section>

      <section className="container-x py-16 lg:py-20">
        <div className="policy-prose mx-auto max-w-prose">{children}</div>
      </section>
    </>
  )
}

/** A titled block within a policy page. */
export function PolicySection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="font-display text-h3 font-semibold text-ink">{heading}</h2>
      <div className="mt-4 space-y-4 text-body text-muted">{children}</div>
    </section>
  )
}
