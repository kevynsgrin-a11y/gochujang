import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Users, ChefHat, MapPin, FlaskConical, Check, ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { getDish, relatedDishes, categoryName } from '@/data/catalog'
import { dishPhoto, categoryGradient } from '@/data/images'
import { SmartImage } from '@/components/SmartImage'
import { SpiceMeter } from '@/components/graphics/SpiceMeter'
import { FlavorRadar, type RadarAxis } from '@/components/graphics/FlavorRadar'
import { DishCard } from '@/components/DishCard'
import { SectionHeader } from '@/components/SectionHeader'
import { DraftBadge, FermentationSafetyNote } from '@/components/RecipeNotices'
import { fadeUp, stagger, inViewOnce } from '@/lib/motion'
import { usePageMeta } from '@/lib/usePageMeta'
import type { Dish } from '@/data/types'
import NotFound from './NotFound'

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

// A plausible flavor profile derived from a dish's own attributes.
function deriveFlavor(dish: Dish): RadarAxis[] {
  const h = hash(dish.id)
  const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n)))
  const funk = dish.fermentDays > 0 ? 6 + Math.min(4, dish.fermentDays / 3) : 2 + (h % 3)
  const sweet = dish.category === 'sweet-heat' ? 8 : 3 + (h % 4)
  const acid = dish.tags.some((t) => /sour|kimchi|vinegar/i.test(t)) ? 7 : 2 + (h % 4)
  return [
    { label: 'Heat', value: clamp(dish.spiceLevel * 2) },
    { label: 'Umami', value: clamp(6 + (h % 4)) },
    { label: 'Acidity', value: clamp(acid) },
    { label: 'Sweet', value: clamp(sweet) },
    { label: 'Funk', value: clamp(funk) },
    { label: 'Texture', value: clamp(6 + ((h >> 3) % 4)) },
  ]
}

export default function DishDetail() {
  const { id } = useParams()
  const dish = id ? getDish(id) : undefined
  usePageMeta()
  if (!dish) return <NotFound />

  const related = relatedDishes(dish)
  const radar = deriveFlavor(dish)

  return (
    <>
      {/* Hero */}
      <section className="relative h-[62svh] max-h-[680px] min-h-[440px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            photo={dishPhoto(dish, 1800, 1200)}
            gradient={categoryGradient(dish.category)}
            alt={dish.name}
            priority
            aspect=""
            className="h-full w-full"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 scrim-ink" aria-hidden />
        <div className="container-x absolute inset-x-0 bottom-0 z-10 pb-10">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 font-accent text-[0.7rem] uppercase tracking-[0.14em] text-white/70">
              <li>
                <Link to="/explore" className="inline-flex items-center gap-1 hover:text-white">
                  <ArrowLeft className="h-3 w-3" /> Explore
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to={`/explore?category=${dish.category}`} className="hover:text-white">
                  {categoryName(dish.category)}
                </Link>
              </li>
            </ol>
          </nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex flex-wrap items-center gap-3">
              <SpiceMeter level={dish.spiceLevel} size="sm" className="text-white [&_.text-muted]:text-white/80" />
              <DraftBadge />
            </div>
            <h1 className="mt-3 max-w-3xl font-display text-display-xl font-semibold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.45)]">
              {dish.name}
            </h1>
            {dish.koreanName && <p className="mt-1 font-display text-2xl italic text-white/80">{dish.koreanName}</p>}
          </motion.div>
        </div>
      </section>

      {/* Meta strip */}
      <div className="border-b border-line bg-surface-alt">
        <div className="container-x grid grid-cols-2 gap-4 py-5 sm:grid-cols-4">
          {[
            { icon: Clock, label: 'Time', value: `${dish.timeMinutes} min` },
            { icon: Users, label: 'Serves', value: String(dish.servings) },
            { icon: ChefHat, label: 'Difficulty', value: dish.difficulty },
            { icon: MapPin, label: 'Origin', value: dish.region },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-glyph bg-primary/10 text-primary">
                <m.icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <div className="font-accent text-[0.65rem] uppercase tracking-[0.14em] text-muted">{m.label}</div>
                <div className="truncate text-caption font-semibold text-ink">{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <section className="container-x grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="max-w-prose text-body-lg text-muted">{dish.longDesc}</p>

          <div className="mt-10">
            <h2 className="text-h2 font-semibold">Ingredients</h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {dish.ingredients.map((ing) => (
                <li key={ing} className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-celadon" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-h2 font-semibold">Method</h2>
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-surface-alt px-4 py-3 text-caption text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>
                This recipe is an editorial draft and has not yet been kitchen-tested. Use your own
                judgement on timing, seasoning, and food safety.
              </span>
            </p>
            {dish.fermentDays > 0 && <FermentationSafetyNote fermentDays={dish.fermentDays} />}
            <motion.ol
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={inViewOnce}
              className="mt-6 space-y-5"
            >
              {dish.method.map((step, i) => (
                <motion.li key={i} variants={fadeUp} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-grad-ember font-display text-lg font-semibold text-primary-fg shadow-ember">
                    {i + 1}
                  </span>
                  <p className="max-w-prose pt-1 text-body text-ink">{step}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {dish.tags.map((t) => (
              <span key={t} className="rounded-pill border border-line bg-surface-alt px-3 py-1 font-accent text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card grain p-6">
            <h2 className="text-h3 font-semibold">Flavor profile</h2>
            <div className="mt-2 grid place-items-center">
              <FlavorRadar axes={radar} size={240} />
            </div>
            <div className="mt-4 space-y-3 border-t border-line/70 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-caption text-muted">Heat</span>
                <SpiceMeter level={dish.spiceLevel} size="xs" />
              </div>
              {dish.fermentDays > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-caption text-muted">Fermentation</span>
                  <span className="tnum text-caption font-semibold text-plum">{dish.fermentDays} days</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-caption text-muted">Origin</span>
                <span className="text-caption font-semibold text-ink">{dish.region}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Link to="/kitchen" className="btn-primary w-full">
                I made this
              </Link>
              {dish.fermentDays > 0 && (
                <Link to="/kitchen" className="btn-ghost w-full">
                  <FlaskConical className="h-4 w-4" /> Start a batch
                </Link>
              )}
            </div>
          </div>
        </aside>
      </section>

      {/* Related */}
      <section className="container-x py-12">
        <SectionHeader eyebrow="Keep chasing" title="You might also" titleAccent="crave." className="mb-10" />
        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {related.map((d) => (
            <DishCard key={d.id} dish={d} />
          ))}
        </motion.div>
        <div className="mt-10">
          <Link to="/explore" className="inline-flex items-center gap-2 font-accent text-eyebrow uppercase tracking-[0.16em] text-primary hover:underline">
            Back to all dishes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </>
  )
}
