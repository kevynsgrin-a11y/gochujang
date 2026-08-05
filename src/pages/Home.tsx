import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Compass, Bookmark, TrendingUp, Sparkles, NotebookPen, Camera, FlaskConical,
  type LucideIcon,
} from 'lucide-react'
import { Hero } from '@/components/home/Hero'
import { SectionHeader } from '@/components/SectionHeader'
import { DishCard, FeaturedDishCard } from '@/components/DishCard'
import { StatTile } from '@/components/StatTile'
import { Marquee } from '@/components/util/Marquee'
import { CategoryGlyph } from '@/components/graphics/CategoryGlyph'
import { SmartImage } from '@/components/SmartImage'
import { categories, dishes, stats, stories, featuredDishes } from '@/data/catalog'
import { FLAVOR_PULSE, VALUE_PROPS, BRAND } from '@/data/site'
import { categoryGradient } from '@/data/images'
import { stagger, fadeUp, inViewOnce } from '@/lib/motion'
import { usePageMeta } from '@/lib/usePageMeta'

const VP_ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  bookmark: Bookmark,
  trending: TrendingUp,
  sparkle: Sparkles,
}

// Stated plainly rather than implied. These claims must stay true —
// update them as the site earns the right to say otherwise.
const TRANSPARENCY = [
  {
    icon: NotebookPen,
    title: 'The recipes are drafts',
    body: 'Every dish here is an editorial draft written for this collection. They have not yet been kitchen-tested, so treat them as a starting point rather than a proven method.',
  },
  {
    icon: Camera,
    title: 'The photography is placeholder',
    body: 'Imagery is sourced or generated while original photography is shot. Where a photo cannot load, you are seeing the palette artwork the site falls back to by design.',
  },
  {
    icon: FlaskConical,
    title: 'The Kitchen is a preview',
    body: 'Mise — the batch timers, streaks, and Flavor Passport — runs on sample data to demonstrate the experience. Accounts and real tracking are not live yet.',
  },
]

export default function Home() {
  usePageMeta()
  const featured = featuredDishes()
  const spotlight = featured[0]
  const featuredRest = featured.slice(1, 3)
  const grid = dishes.filter((d) => !featured.slice(0, 3).includes(d)).slice(0, 6)

  return (
    <>
      <Hero />

      {/* Flavor Pulse ticker */}
      <div className="relative border-y border-line bg-surface-alt py-4 grain">
        <div className="flex items-center gap-4">
          <span className="ml-5 hidden shrink-0 font-accent text-eyebrow uppercase tracking-[0.2em] text-primary sm:block">
            Flavor Pulse
          </span>
          <Marquee
            items={FLAVOR_PULSE}
            className="font-accent text-sm uppercase tracking-[0.14em] text-muted"
          />
        </div>
      </div>

      {/* Value props */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeader
          eyebrow="Why Gochujang"
          title="Not a database."
          titleAccent="A destination."
          dek="Recipe sites feel like spreadsheets. Gochujang feels like a magazine you cook from — curated, opinionated, and built to make your taste braver."
        />
        <motion.div
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUE_PROPS.map((vp) => {
            const Icon = VP_ICONS[vp.glyph] ?? Sparkles
            return (
              <motion.div key={vp.title} variants={fadeUp} className="card grain p-6">
                <span className="inline-grid h-11 w-11 place-items-center rounded-glyph bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-h3 font-semibold text-ink">{vp.title}</h3>
                <p className="mt-2 text-caption text-muted">{vp.body}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Featured spotlight */}
      {spotlight && (
        <section className="container-x pb-6">
          <SectionHeader
            eyebrow="The one to make first"
            title="This week's"
            titleAccent="spotlight."
            className="mb-10"
          />
          <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={inViewOnce}>
            <FeaturedDishCard dish={spotlight} />
          </motion.div>
        </section>
      )}

      {/* Category glyph grid */}
      <section className="container-x py-20 lg:py-24">
        <SectionHeader
          eyebrow="Browse by mood"
          title="Follow your"
          titleAccent="craving."
          action={
            <Link to="/explore" className="btn-ghost text-sm">
              All dishes <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <Link
                to={`/explore?category=${cat.id}`}
                className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-card border border-line p-5 text-white shadow-sm transition-all duration-300 ease-edible hover:-translate-y-1 hover:shadow-md grain"
                style={{ background: categoryGradient(cat.id) }}
              >
                {/* Legibility scrim — white text fails contrast on the mid-tone gradients without it. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/65 via-black/25 to-transparent"
                />
                <span className="absolute right-4 top-4 z-10 text-white/85 transition-transform duration-500 ease-edible group-hover:scale-110 group-hover:text-white">
                  <CategoryGlyph id={cat.id} className="h-9 w-9" />
                </span>
                <h3 className="relative z-10 font-display text-xl font-semibold leading-tight">
                  {cat.name}
                </h3>
                <p className="relative z-10 mt-1 line-clamp-2 text-[0.78rem] text-white/80">
                  {cat.blurb}
                </p>
              </Link>
            </motion.div>
          ))}
          <motion.div variants={fadeUp}>
            <Link
              to="/explore"
              className="group flex h-44 flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line bg-surface text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              <span className="font-accent text-eyebrow uppercase tracking-[0.16em]">See all</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured dishes (asymmetric) */}
      <section className="container-x space-y-6 pb-8">
        <SectionHeader eyebrow="Editor's picks" title="Dishes worth" titleAccent="chasing." className="mb-10" />
        <div className="space-y-16">
          {featuredRest.map((dish, i) => (
            <motion.div key={dish.id} variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={inViewOnce}>
              <FeaturedDishCard dish={dish} reverse={i % 2 === 1} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dish grid */}
      <section className="container-x py-16">
        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {grid.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </motion.div>
        <div className="mt-10 flex justify-center">
          <Link to="/explore" className="btn-primary">
            Explore the full catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden bg-grad-paper-sheen py-20 grain">
        <div className="container-x">
          <SectionHeader eyebrow="By the numbers" title="A living, growing" titleAccent="catalog." align="center" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <StatTile
                key={s.label}
                value={s.value}
                label={s.label}
                caption={s.caption}
                glyph={['flame', 'globe', 'sparkle', 'timer'][i]}
                tone={i === 3 ? 'celadon' : 'ember'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial stories */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeader
          eyebrow="The Journal"
          title="Read before you"
          titleAccent="cook."
          dek="Field notes on fermentation, travel, and the techniques behind the heat."
        />
        <motion.div
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {stories.map((story, i) => (
            <motion.article
              key={story.title}
              variants={fadeUp}
              className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <SmartImage
                photo={undefined}
                gradient={categoryGradient(['fermented-funky', 'charred-smoky', 'rice-bowls'][i])}
                alt={story.title}
                aspect="aspect-[16/10]"
                scrim="bottom"
              >
                <span className="absolute left-4 top-4 rounded-pill bg-black/40 px-3 py-1 font-accent text-[0.65rem] uppercase tracking-[0.16em] text-white backdrop-blur">
                  {story.category}
                </span>
              </SmartImage>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-h3 font-semibold text-ink">
                  <Link to="/about" className="after:absolute after:inset-0 after:content-['']">
                    {story.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-caption text-muted">{story.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-accent text-eyebrow uppercase tracking-[0.16em] text-primary">
                  Read story <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Transparency — what this site is, honestly stated */}
      <section className="relative overflow-hidden bg-surface-alt py-20 grain lg:py-24">
        <div className="container-x">
          <SectionHeader
            eyebrow="How this site is made"
            title="An honest"
            titleAccent="note."
            align="center"
            dek="Gochujang is early. Rather than dress that up, here is exactly where it stands."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TRANSPARENCY.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={inViewOnce}
                className="flex flex-col rounded-card border border-line bg-surface p-7 shadow-sm"
              >
                <item.icon className="h-7 w-7 text-primary/60" />
                <h3 className="mt-4 text-h3 font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-caption leading-relaxed text-muted">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-x py-20 lg:py-28">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-grad-ember-radial p-10 text-center text-white shadow-lg grain sm:p-16">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-display text-display-xl font-semibold [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]">
              {BRAND.tagline}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-body-lg text-white/90">
              Start your Mise, track your first ferment, and build a living map of the flavors worth chasing.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/kitchen" className="btn bg-white text-[#1A1310] hover:-translate-y-0.5 hover:shadow-lift">
                Start cooking <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/explore"
                className="btn border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                Browse dishes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
