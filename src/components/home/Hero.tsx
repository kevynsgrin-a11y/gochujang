import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { BRAND } from '@/data/site'
import { HERO, heroPhoto } from '@/data/images'
import { SmartImage } from '@/components/SmartImage'
import { GenerativeHeroArt } from '@/components/decor/GenerativeHeroArt'

export function Hero() {
  const reduce = useReducedMotion()
  const line1 = BRAND.hero.headline.split(' ')
  const line2 = BRAND.hero.headlineAccent.split(' ')

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  }
  const word = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  }

  return (
    <section className="dark relative flex h-[100svh] max-h-[940px] min-h-[600px] w-full items-end overflow-hidden">
      <GenerativeHeroArt seed="home-hero" drift={!reduce} className="z-0" />
      <div className="absolute inset-0 z-[1]">
        <SmartImage
          photo={heroPhoto('home')}
          gradient={HERO.home.gradient}
          alt="Gochujang-lacquered short ribs charring over live fire"
          priority
          aspect=""
          className="h-full w-full"
          imgClassName={reduce ? '' : 'animate-ken-burns'}
          sizes="100vw"
        />
      </div>
      {/* Legibility scrim + edge seat into the charcoal ground */}
      <div className="absolute inset-0 z-[2] scrim-ink" aria-hidden />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/55 via-black/10 to-transparent" aria-hidden />

      <div className="container-x relative z-10 pb-16 pt-28 sm:pb-20">
        <motion.div initial="hidden" animate="show" variants={container} className="max-w-3xl">
          <motion.p
            variants={word}
            className="flex items-center gap-3 font-accent text-eyebrow font-medium uppercase tracking-[0.22em] text-white/85"
          >
            <span className="h-px w-8 bg-persimmon" aria-hidden />
            {BRAND.hero.eyebrow}
          </motion.p>

          <h1 className="mt-5 font-display text-display-hero font-semibold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
            <span className="block overflow-hidden">
              <span className="flex flex-wrap gap-x-[0.28em]">
                {line1.map((w, i) => (
                  <motion.span key={i} variants={word} className="inline-block">
                    {w}
                  </motion.span>
                ))}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="flex flex-wrap gap-x-[0.28em]">
                {line2.map((w, i) => (
                  <motion.span key={i} variants={word} className="inline-block text-gradient">
                    {w}
                  </motion.span>
                ))}
              </span>
            </span>
          </h1>

          <motion.p variants={word} className="mt-6 max-w-xl text-body-lg text-white/85">
            {BRAND.hero.subhead}
          </motion.p>

          <motion.div variants={word} className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/kitchen" className="btn-primary text-base">
              {BRAND.hero.primaryCTA} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/explore"
              className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:border-white/60 hover:bg-white/20"
            >
              {BRAND.hero.secondaryCTA}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex"
        aria-hidden
      >
        <span className="flex flex-col items-center gap-2 font-accent text-[0.65rem] uppercase tracking-[0.2em] text-white/60">
          Scroll
          <ArrowDown className="h-4 w-4 animate-float-slow" />
        </span>
      </motion.div>
    </section>
  )
}
