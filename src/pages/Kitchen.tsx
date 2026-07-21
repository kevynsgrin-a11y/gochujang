import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Flame, Globe, Plus, FlaskConical, Zap, Award, Trophy, Star, Bell, ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { GenerativeHeroArt } from '@/components/decor/GenerativeHeroArt'
import { SectionHeader } from '@/components/SectionHeader'
import { StatTile } from '@/components/StatTile'
import { ProgressRing } from '@/components/graphics/ProgressRing'
import { ScovilleGauge } from '@/components/graphics/ScovilleGauge'
import { FlavorRadar } from '@/components/graphics/FlavorRadar'
import { StreakHeatmap } from '@/components/graphics/StreakHeatmap'
import { PassportStampSeal } from '@/components/graphics/PassportStamp'
import {
  profile, kitchenStats, batches, spiceTolerance, flavorRadar, achievements, passport,
  recentCooks, insights, type Batch,
} from '@/data/kitchen'
import { fadeUp, stagger, inViewOnce } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { usePageMeta } from '@/lib/usePageMeta'

const ACH_ICONS: Record<string, LucideIcon> = {
  jar: FlaskConical, chili: Flame, globe: Globe, flame: Flame, crock: FlaskConical, bolt: Zap,
}

function BatchRow({ batch }: { batch: Batch }) {
  const ready = batch.status === 'ready'
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-4 rounded-card border border-line bg-surface p-4 shadow-sm">
      <ProgressRing pct={batch.progressPct} ready={ready} size={62} label={`${batch.name}: ${batch.readyLabel}`}>
        <span className="tnum text-[0.7rem] font-semibold text-ink">{batch.progressPct}%</span>
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-ink">{batch.name}</h3>
          <span className="shrink-0 rounded-pill bg-surface-alt px-2 py-0.5 font-accent text-[0.6rem] uppercase tracking-[0.12em] text-muted">
            {batch.type}
          </span>
        </div>
        <p className="mt-0.5 truncate text-caption text-muted">{batch.vessel} · {batch.note}</p>
        <p className={cn('mt-1 font-accent text-[0.72rem] font-medium tnum', ready ? 'text-celadon' : 'text-primary')}>
          {batch.readyLabel}
        </p>
      </div>
      <button
        type="button"
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-pill px-3 py-2 text-[0.72rem] font-semibold transition-colors',
          ready ? 'bg-celadon text-white hover:brightness-105' : 'border border-line text-muted hover:border-primary hover:text-primary',
        )}
      >
        {ready ? <><Bell className="h-3.5 w-3.5" /> Taste</> : 'Log note'}
      </button>
    </motion.div>
  )
}

export default function Kitchen() {
  usePageMeta('Mise — your kitchen', 'Your living culinary journal: batches, streaks, spice tolerance, and the Flavor Passport.')
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pt-20 text-white">
        <GenerativeHeroArt seed="kitchen-hero" drift className="z-0" />
        <div className="container-x relative z-10 py-14">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <ProgressRing pct={profile.levelProgress} size={80} stroke={6} label={`Kitchen level ${profile.level}, ${profile.levelProgress}% to next`}>
                <div className="text-center">
                  <div className="font-accent text-[0.55rem] uppercase tracking-wider text-white/70">Lvl</div>
                  <div className="tnum text-2xl font-semibold leading-none">{profile.level}</div>
                </div>
              </ProgressRing>
              <div>
                <p className="font-accent text-eyebrow uppercase tracking-[0.2em] text-white/70">Welcome back</p>
                <h1 className="font-display text-display-xl font-semibold leading-none [text-shadow:0_2px_18px_rgba(0,0,0,0.4)]">
                  {profile.name}
                </h1>
                <p className="mt-1 text-white/80">{profile.kitchenTitle} · since {profile.joined}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <Flame className="mx-auto h-8 w-8 animate-flame-flicker text-persimmon" />
                <div className="tnum text-2xl font-semibold">{profile.currentStreak}</div>
                <div className="font-accent text-[0.6rem] uppercase tracking-[0.14em] text-white/70">Day streak</div>
              </div>
              <div className="hidden h-14 w-px bg-white/20 sm:block" />
              <div className="hidden sm:block">
                <div className="font-accent text-[0.6rem] uppercase tracking-[0.14em] text-white/70">Weekly goal</div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  {Array.from({ length: profile.weeklyGoal }).map((_, i) => (
                    <span key={i} className={cn('h-2.5 w-6 rounded-pill', i < profile.weeklyProgress ? 'bg-persimmon' : 'bg-white/20')} />
                  ))}
                </div>
                <div className="mt-1.5 tnum text-caption text-white/80">{profile.weeklyProgress} / {profile.weeklyGoal} cooks</div>
              </div>
              <Link to="/explore" className="btn bg-white text-[#1A1310] hover:-translate-y-0.5 hover:shadow-lift">
                <Plus className="h-4 w-4" /> Log a cook
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-x -mt-2 py-10">
        <motion.div variants={stagger(0.07)} initial="hidden" whileInView="show" viewport={inViewOnce} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kitchenStats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp}>
              <StatTile value={s.value} label={s.label} caption={s.caption} glyph={s.glyph} tone={i === 3 ? 'celadon' : 'ember'} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Batches + Spice */}
      <section className="container-x grid gap-6 py-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <SectionHeader eyebrow="Ticking down" title="Active" titleAccent="batches." className="mb-6" />
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inViewOnce} className="space-y-3">
            {batches.map((b) => (
              <BatchRow key={b.id} batch={b} />
            ))}
          </motion.div>
          <button type="button" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line py-3 font-accent text-eyebrow uppercase tracking-[0.14em] text-muted transition-colors hover:border-primary hover:text-primary">
            <Plus className="h-4 w-4" /> Start a new batch
          </button>
        </div>

        <div className="card grain flex flex-col items-center p-6">
          <SectionHeader eyebrow="Palate check" title="Spice" titleAccent="tolerance." className="mb-4 self-start" />
          <ScovilleGauge value={spiceTolerance.currentLevel} max={spiceTolerance.max} band={spiceTolerance.band} scoville={spiceTolerance.scoville} size={210} />
          <p className="mt-4 text-center text-caption text-muted">
            <span className="tnum font-semibold text-ink">{spiceTolerance.heatDishesLogged}</span> hot dishes logged. Next tier:{' '}
            <span className="font-semibold text-primary">{spiceTolerance.nextTier}</span>.
          </p>
          {/* trend sparkline */}
          <div
            className="mt-4 flex h-10 w-full items-end gap-1"
            role="img"
            aria-label={`Spice-tolerance trend rising from ${spiceTolerance.trend[0]} to ${spiceTolerance.trend[spiceTolerance.trend.length - 1]} of ${spiceTolerance.max} over your recent hot cooks`}
          >
            {spiceTolerance.trend.map((t, i) => (
              <div key={i} className="flex-1 rounded-t bg-grad-ember" style={{ height: `${(t / spiceTolerance.max) * 100}%`, opacity: 0.35 + (i / spiceTolerance.trend.length) * 0.65 }} aria-hidden />
            ))}
          </div>
        </div>
      </section>

      {/* Streak + Flavor radar */}
      <section className="container-x grid gap-6 py-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <SectionHeader eyebrow="Consistency" title="Cooking" titleAccent="streak." className="mb-2" />
          <StreakHeatmap className="mt-4" />
        </div>
        <div className="card grain flex flex-col p-6">
          <SectionHeader eyebrow="Your signature" title="Flavor" titleAccent="fingerprint." className="mb-2 self-start" />
          <div className="grid flex-1 place-items-center">
            <FlavorRadar axes={flavorRadar.axes} size={230} />
          </div>
          <p className="text-center text-caption text-muted">Averaged across your logged {flavorRadar.dish} cooks.</p>
        </div>
      </section>

      {/* Passport */}
      <section className="container-x py-10">
        <SectionHeader
          eyebrow="Places on your plate"
          title="Flavor"
          titleAccent="passport."
          dek={`The regions you've cooked, stamped. ${passport.filter((s) => !s.unlocked).length} more in this set waiting for a first stamp.`}
          className="mb-8"
        />
        <motion.div variants={stagger(0.05)} initial="hidden" whileInView="show" viewport={inViewOnce} className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-10">
          {passport.map((s) => (
            <motion.div key={s.region} variants={fadeUp}>
              <PassportStampSeal stamp={s} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Achievements */}
      <section className="container-x py-10">
        <SectionHeader eyebrow="Unlocked" title="Kitchen" titleAccent="achievements." className="mb-8" />
        <motion.div variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={inViewOnce} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const Icon = ACH_ICONS[a.glyph] ?? Trophy
            return (
              <motion.div
                key={a.key}
                variants={fadeUp}
                className={cn('flex items-center gap-4 rounded-card border p-5', a.unlocked ? 'border-line bg-surface shadow-sm' : 'border-line/60 bg-surface-alt/50')}
              >
                <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-full border-2', a.unlocked ? 'border-primary/60 bg-primary/10 text-primary' : 'border-line text-subtle')}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={cn('font-semibold', a.unlocked ? 'text-ink' : 'text-muted')}>{a.title}</h3>
                    {a.unlocked && <Award className="h-4 w-4 text-celadon" />}
                  </div>
                  <p className="mt-0.5 text-caption text-muted">{a.description}</p>
                  {!a.unlocked && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-line">
                        <div className="h-full rounded-pill bg-grad-ember" style={{ width: `${(a.progress / a.target) * 100}%` }} />
                      </div>
                      <span className="tnum text-[0.65rem] text-subtle">{a.progress}/{a.target}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Recent + insights */}
      <section className="container-x grid gap-6 py-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <SectionHeader eyebrow="Lately" title="Recent" titleAccent="cooks." className="mb-6" />
          <ul className="divide-y divide-line/70">
            {recentCooks.map((c) => (
              <li key={c.dishId + c.when} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <Link to={`/dish/${c.dishId}`} className="link-wipe font-semibold text-ink">{c.dishName}</Link>
                  <p className="text-caption text-muted">{c.when}</p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5" aria-label={`Rated ${c.rating} of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('h-4 w-4', i < c.rating ? 'fill-primary text-primary' : 'text-line')} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4">
          {insights.map((ins) => (
            <div key={ins.label} className="card flex items-center justify-between p-5">
              <div>
                <div className="font-accent text-eyebrow uppercase tracking-[0.14em] text-muted">{ins.label}</div>
                <div className="mt-1 text-caption text-muted">{ins.caption}</div>
              </div>
              <div className="font-display text-2xl font-semibold text-gradient">{ins.value}</div>
            </div>
          ))}
          <Link to="/explore" className="btn-primary justify-center">
            Find your next cook <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
