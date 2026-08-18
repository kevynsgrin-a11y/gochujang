import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { categories, dishes } from '@/data/catalog'
import { DishCard } from '@/components/DishCard'
import { CategoryGlyph } from '@/components/graphics/CategoryGlyph'
import { GenerativeHeroArt } from '@/components/decor/GenerativeHeroArt'
import { stagger } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { usePageMeta } from '@/lib/usePageMeta'

const HEAT_FILTERS = [
  { id: 'all', label: 'Any heat', test: () => true },
  { id: 'mild', label: 'Mild (≤2)', test: (n: number) => n <= 2 },
  { id: 'hot', label: 'Hot (3+)', test: (n: number) => n >= 3 },
  { id: 'fiery', label: 'Fiery (4+)', test: (n: number) => n >= 4 },
]
const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'quick', label: 'Quickest' },
  { id: 'heat', label: 'Hottest' },
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-1.5 font-accent text-[0.72rem] font-medium uppercase tracking-[0.12em] transition-all',
        active
          ? 'border-primary/50 bg-grad-ember text-primary-fg shadow-ember'
          : 'border-line bg-surface-alt text-muted hover:border-accent/50 hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? 'all'
  const heat = params.get('heat') ?? 'all'
  const sort = params.get('sort') ?? 'featured'

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all' || value === 'featured') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const heatTest = HEAT_FILTERS.find((h) => h.id === heat)?.test ?? (() => true)
    let list = dishes.filter(
      (d) => (category === 'all' || d.category === category) && heatTest(d.spiceLevel),
    )
    if (sort === 'quick') list = [...list].sort((a, b) => a.timeMinutes - b.timeMinutes)
    else if (sort === 'heat') list = [...list].sort((a, b) => b.spiceLevel - a.spiceLevel)
    else list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
    return list
  }, [category, heat, sort])

  const activeCat = categories.find((c) => c.id === category)
  const hasFilters = category !== 'all' || heat !== 'all'
  usePageMeta()

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-line bg-bg pt-28">
        <GenerativeHeroArt seed="explore" base={false} className="opacity-60" />
        <div className="container-x relative z-10 pb-12">
          <p className="eyebrow">Explore the catalog</p>
          <h1 className="mt-3 max-w-3xl text-display-xl font-semibold">
            {activeCat ? (
              <>
                {activeCat.name.split('&')[0].trim()}{' '}
                <span className="text-gradient">&amp; more.</span>
              </>
            ) : (
              <>
                Every dish worth <span className="text-gradient">chasing.</span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-xl text-body-lg text-muted">
            {activeCat?.blurb ?? 'Filter by craving, heat, and time. Curated, never dumped.'}
          </p>
        </div>
      </section>

      {/* Filter bar — sticky only from md up; at phone widths the wrapped
          chip rows would otherwise pin ~half the viewport. */}
      <div className="z-30 border-b border-line glass md:sticky md:top-[68px]">
        <fieldset className="container-x flex flex-wrap items-center gap-3 border-0 py-4">
          <legend className="sr-only">Filter dishes</legend>
          <span className="inline-flex items-center gap-2 font-accent text-eyebrow uppercase tracking-[0.16em] text-muted">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Category">
            <Chip active={category === 'all'} onClick={() => setParam('category', 'all')}>
              All
            </Chip>
            {categories.map((c) => (
              <Chip key={c.id} active={category === c.id} onClick={() => setParam('category', c.id)}>
                <CategoryGlyph id={c.id} className="h-4 w-4" />
                {c.name.split('&')[0].trim()}
              </Chip>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2" role="group" aria-label="Heat level">
            {HEAT_FILTERS.map((h) => (
              <Chip key={h.id} active={heat === h.id} onClick={() => setParam('heat', h.id)}>
                {h.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Results */}
      <section className="container-x py-12" aria-label="Dishes">
        <h2 className="sr-only">Dishes</h2>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-caption text-muted" aria-live="polite">
            <span className="tnum font-semibold text-ink">{results.length}</span>{' '}
            {results.length === 1 ? 'dish' : 'dishes'}
            {hasFilters && (
              <button
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="ml-3 inline-flex items-center gap-1 text-primary hover:underline"
              >
                <X className="h-3.5 w-3.5" /> Clear all
              </button>
            )}
          </p>
          <div className="flex items-center gap-2" role="group" aria-label="Sort dishes">
            <span className="font-accent text-eyebrow uppercase tracking-[0.16em] text-muted">Sort</span>
            {SORTS.map((s) => (
              <Chip key={s.id} active={sort === s.id} onClick={() => setParam('sort', s.id)}>
                {s.label}
              </Chip>
            ))}
          </div>
        </div>

        {results.length > 0 ? (
          <motion.div
            key={`${category}-${heat}-${sort}`}
            variants={stagger(0.05)}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {results.map((dish, i) => (
              <DishCard key={dish.id} dish={dish} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="grid place-items-center rounded-card border border-dashed border-line bg-surface-alt py-24 text-center grain">
            <div className="text-primary/50">
              <CategoryGlyph id="charred-smoky" className="h-14 w-14" />
            </div>
            <h3 className="mt-4 text-h3 font-semibold text-ink">Nothing that hot yet.</h3>
            <p className="mt-2 max-w-sm text-caption text-muted">
              No dishes match these filters. Loosen the heat or pick another craving.
            </p>
            <button
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="btn-primary mt-6"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </>
  )
}
