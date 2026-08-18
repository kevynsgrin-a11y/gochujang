import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Dish } from '@/data/types'
import { categoryName } from '@/data/catalog'
import { categoryGradient, dishPhoto } from '@/data/images'
import { SmartImage } from '@/components/SmartImage'
import { SpiceMeter } from '@/components/graphics/SpiceMeter'
import { fadeUp } from '@/lib/motion'
import { cn } from '@/lib/cn'

function Heart2() {
  const [saved, setSaved] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setSaved((v) => !v)}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={cn(
        'relative z-20 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all',
        saved
          ? 'border-primary/50 bg-primary text-primary-fg'
          : 'border-white/25 bg-black/30 text-white hover:bg-black/50',
      )}
    >
      <Heart className={cn('h-4 w-4 transition-transform', saved && 'fill-current scale-110')} />
    </button>
  )
}

/** Duotone recede overlay — Tier 2 at rest, fades to full color on hover. */
function Duotone({ hue = '#E8542E' }: { hue?: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] opacity-55 mix-blend-color transition-opacity duration-500 ease-edible group-hover:opacity-0"
      style={{ background: `linear-gradient(160deg, #161210, ${hue})` }}
      aria-hidden
    />
  )
}

// index only promotes images to eager/high-priority when the card is known to
// sit above the fold (Explore's grid); the default keeps everything lazy so
// below-fold cards never compete with the route's LCP hero image.
export function DishCard({ dish, index = 99 }: { dish: Dish; index?: number }) {
  return (
    <motion.article
      variants={fadeUp}
      className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-sm transition-all duration-300 ease-edible hover:-translate-y-1 hover:shadow-md"
    >
      <SmartImage
        photo={dishPhoto(dish)}
        gradient={categoryGradient(dish.category)}
        alt={dish.name}
        aspect="aspect-[4/3]"
        priority={index < 3}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        imgClassName="transition-transform duration-[600ms] ease-edible group-hover:scale-[1.06]"
      >
        <Duotone />
        <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between">
          <span className="rounded-pill bg-black/45 px-2.5 py-1 backdrop-blur">
            <SpiceMeter level={dish.spiceLevel} size="xs" showLabel={false} className="text-white" />
          </span>
          <Heart2 />
        </div>
      </SmartImage>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-accent text-eyebrow font-medium uppercase tracking-[0.16em] text-muted">
          {categoryName(dish.category)}
        </p>
        <h3 className="mt-2 line-clamp-2 text-h3 font-semibold text-ink">
          <Link to={`/dish/${dish.id}`} className="after:absolute after:inset-0 after:z-[5] after:content-['']">
            {dish.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-caption text-muted">{dish.shortDesc}</p>

        <div className="mt-4 flex items-center gap-4 border-t border-line/70 pt-3 font-accent text-[0.72rem] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> <span className="tnum">{dish.timeMinutes}</span>m
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ChefHat className="h-3.5 w-3.5" /> {dish.difficulty}
          </span>
          {dish.fermentDays > 0 && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-pill bg-plum/15 px-2 py-0.5 text-plum dark:bg-plum/25 dark:text-persimmon">
              <span className="tnum">{dish.fermentDays}</span>d ferment
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/** Featured variant — 7/5 asymmetric split, title overlaps the image edge. */
export function FeaturedDishCard({ dish, reverse = false }: { dish: Dish; reverse?: boolean }) {
  return (
    <motion.article
      variants={fadeUp}
      className="group relative grid items-center gap-6 overflow-hidden rounded-card border border-line bg-surface p-4 shadow-sm md:grid-cols-12 md:gap-0 md:p-0"
    >
      <div className={cn('md:col-span-7', reverse && 'md:order-2')}>
        <SmartImage
          photo={dishPhoto(dish, 1400, 1000)}
          gradient={categoryGradient(dish.category)}
          alt={dish.name}
          aspect="aspect-[16/11]"
          sizes="(max-width: 768px) 100vw, 58vw"
          scrim="bottom"
          imgClassName="transition-transform duration-[700ms] ease-edible group-hover:scale-[1.05]"
          className="rounded-card md:rounded-none"
        />
      </div>
      <div
        className={cn(
          'relative z-10 md:col-span-5 md:p-8 lg:p-10',
          reverse ? 'md:order-1 md:-mr-16' : 'md:-ml-16',
        )}
      >
        <div className="rounded-card border border-line bg-elevated p-6 shadow-md md:p-7">
          <div className="flex items-center gap-3">
            <span className="eyebrow">Featured</span>
            <SpiceMeter level={dish.spiceLevel} size="xs" />
          </div>
          <h3 className="mt-3 text-h1 font-semibold text-ink">
            <Link to={`/dish/${dish.id}`} className="after:absolute after:inset-0 after:content-['']">
              {dish.name}
            </Link>
          </h3>
          {dish.koreanName && (
            <p className="mt-1 font-display text-lg italic text-muted">{dish.koreanName}</p>
          )}
          <p className="mt-3 max-w-md text-body text-muted">{dish.shortDesc}</p>
          <div className="mt-5 flex items-center gap-4 font-accent text-caption text-muted">
            <span className="tnum">{dish.timeMinutes} min</span>
            <span aria-hidden>·</span>
            <span>{dish.difficulty}</span>
            <span aria-hidden>·</span>
            <span>{dish.region}</span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
