import { Link } from 'react-router-dom'
import { GenerativeHeroArt } from '@/components/decor/GenerativeHeroArt'
import { BrandGlyph } from '@/components/brand/BrandMark'
import { usePageMeta } from '@/lib/usePageMeta'

export default function NotFound() {
  usePageMeta()
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden pt-20">
      <GenerativeHeroArt seed="404" base={false} className="opacity-70" />
      <div className="container-x relative z-10 text-center">
        <BrandGlyph id="nf" className="mx-auto h-16 w-16 animate-ember-pulse" />
        <p className="mt-6 font-display text-display-hero font-semibold text-gradient">404</p>
        <h1 className="mt-2 text-h1 font-semibold">This dish is off the menu.</h1>
        <p className="mx-auto mt-3 max-w-md text-body-lg text-muted">
          The page you're chasing doesn't exist — but there's plenty more heat where that came from.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            Back home
          </Link>
          <Link to="/explore" className="btn-ghost">
            Explore dishes
          </Link>
        </div>
      </div>
    </section>
  )
}
