import { Link } from 'react-router-dom'
import { BrandGlyph } from '@/components/brand/BrandMark'
import { NewsletterForm } from '@/components/NewsletterForm'
import { FOOTER_LINKS, BRAND } from '@/data/site'

export function Footer() {
  return (
    // Charcoal anchor weight even in light mode; the `dark` class flips tokens.
    <footer className="dark relative mt-24 overflow-hidden bg-bg text-ink grain">
      <div className="container-x relative z-10 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <BrandGlyph id="footer" decorative className="h-10 w-10" />
              <span className="font-display text-2xl font-semibold">
                Gochu<span className="text-gradient">jang</span>
              </span>
            </div>
            <p className="mt-6 font-display text-3xl leading-[1.05] text-ink sm:text-4xl">
              {BRAND.tagline}
            </p>
            <p className="mt-4 max-w-sm text-body text-muted">
              A premium culinary destination for cooks who eat with intent. Discover, cook, and
              collect the dishes worth chasing.
            </p>
            <div className="mt-8 max-w-sm">
              <NewsletterForm compact />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <h3 className="font-accent text-eyebrow font-medium uppercase tracking-[0.18em] text-subtle">
                  {group}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((l) => (
                    <li key={l.label + l.route}>
                      <Link to={l.route} className="link-wipe text-caption text-muted hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line/60 pt-8 text-caption text-subtle sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Gochujang. Bring your appetite.</p>
          <p className="font-accent uppercase tracking-[0.16em]">Global by instinct · Bold by design</p>
        </div>
      </div>
    </footer>
  )
}
