import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Globe, Sprout, Heart } from 'lucide-react'
import { GenerativeHeroArt } from '@/components/decor/GenerativeHeroArt'
import { SectionHeader } from '@/components/SectionHeader'
import { StatTile } from '@/components/StatTile'
import { BRAND } from '@/data/site'
import { stats } from '@/data/catalog'
import { fadeUp, stagger, inViewOnce } from '@/lib/motion'
import { usePageMeta } from '@/lib/usePageMeta'

const PRINCIPLES = [
  { icon: Flame, title: 'Bold by design', body: 'Flavor with a point of view. We chase the dishes that make you sit up, not the safe ones that fade into the feed.' },
  { icon: Globe, title: 'Global by instinct', body: 'Korean-forward, world-wide. Fermentation is our throughline, but the map has no borders.' },
  { icon: Sprout, title: 'Patience is a flavor', body: "Real gochujang takes a year. We honor slow food — ferments, cures, and the techniques worth the wait." },
  { icon: Heart, title: 'Respect the cook', body: 'Clear guidance that trusts your palate and your time. No 2,000-word preambles, no ad walls.' },
]

export default function About() {
  usePageMeta('About', 'Gochujang starts with a jar of fermented chili paste — the story behind the platform for cooks who eat with intent.')
  return (
    <>
      {/* Manifesto hero */}
      <section className="dark relative flex min-h-[70svh] items-center overflow-hidden pt-20">
        <GenerativeHeroArt seed="about-hero" drift className="z-0" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
        <div className="container-x relative z-10 py-20 text-white">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 font-accent text-eyebrow uppercase tracking-[0.22em] text-white/85"
          >
            <span className="h-px w-8 bg-persimmon" /> Our story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-4xl font-display text-display-hero font-semibold [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]"
          >
            It starts with a jar of <span className="text-gradient">fermented chili.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 max-w-2xl text-body-lg text-white/85"
          >
            {BRAND.tagline} — a culinary destination for cooks who eat with intent.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="container-x py-20 lg:py-28">
        <div className="mx-auto max-w-prose">
          <p className="eyebrow">The manifesto</p>
          <p className="mt-6 font-display text-2xl leading-relaxed text-ink sm:text-3xl">
            {BRAND.story}
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="relative overflow-hidden bg-surface-alt py-20 grain lg:py-24">
        <div className="container-x">
          <SectionHeader eyebrow="What we believe" title="Four" titleAccent="principles." align="center" />
          <motion.div
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="show"
            viewport={inViewOnce}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PRINCIPLES.map((p) => (
              <motion.div key={p.title} variants={fadeUp} className="card p-6">
                <span className="inline-grid h-11 w-11 place-items-center rounded-glyph bg-primary/12 text-primary">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-h3 font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-caption text-muted">{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-x py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatTile key={s.label} value={s.value} label={s.label} caption={s.caption} glyph={['flame', 'globe', 'sparkle', 'timer'][i]} tone={i === 3 ? 'celadon' : 'ember'} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-grad-ember-radial p-10 text-center text-white shadow-lg grain sm:p-16">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-display text-display-xl font-semibold">Bring your appetite.</h2>
            <p className="mx-auto mt-4 max-w-lg text-body-lg text-white/90">We'll bring the heat. Start cooking and build your living map of flavor.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/kitchen" className="btn bg-white text-[#1A1310] hover:-translate-y-0.5 hover:shadow-lift">
                Start cooking
              </Link>
              <Link to="/explore" className="btn border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                Explore dishes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
