import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV } from '@/data/site'
import { cn } from '@/lib/cn'
import { BrandMark } from '@/components/brand/BrandMark'
import { ThemeToggle } from '@/components/ThemeToggle'

// Routes whose hero is a dark, full-bleed backdrop — the transparent nav must
// go white over them (in BOTH themes) so it never reads dark-on-dark.
function isDarkHeroRoute(pathname: string): boolean {
  return pathname === '/' || pathname === '/about' || pathname === '/kitchen' || pathname.startsWith('/dish/')
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const { pathname } = useLocation()
  const overHero = !scrolled && isDarkHeroRoute(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  /*
   * Focus contract for the mobile menu: Escape closes it, opening moves focus
   * to the first item inside it, and closing returns focus to the trigger —
   * so a keyboard or screen-reader user is never stranded behind a panel they
   * cannot see or dismiss.
   */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      // Wait for the panel to mount before reaching into it.
      const id = window.setTimeout(() => {
        menuRef.current?.querySelector<HTMLElement>('a, button')?.focus()
      }, 0)
      return () => window.clearTimeout(id)
    }
    // Only pull focus back if it is still inside the panel we just closed.
    if (wasOpen.current && menuRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus()
    }
    return undefined
  }, [open])

  useEffect(() => {
    wasOpen.current = open
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-edible',
        scrolled
          ? 'glass border-b border-line/70 shadow-sm'
          : overHero
            ? 'border-b border-transparent bg-gradient-to-b from-black/35 via-black/10 to-transparent'
            : 'border-b border-transparent',
      )}
    >
      <nav className="container-x flex h-[68px] items-center justify-between" aria-label="Primary">
        <Link to="/" className="shrink-0" aria-label="Gochujang home">
          <BrandMark onDark={overHero} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              end={item.route === '/'}
              className={({ isActive }) =>
                cn(
                  'link-wipe inline-flex min-h-11 items-center font-accent text-[0.8rem] font-medium uppercase tracking-[0.16em] transition-colors',
                  overHero
                    ? isActive
                      ? 'text-white [background-size:100%_1.5px]'
                      : 'text-white/75 hover:text-white'
                    : isActive
                      ? 'text-ink [background-size:100%_1.5px]'
                      : 'text-muted hover:text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle onDark={overHero} />
          <Link to="/explore" className="btn-primary hidden text-[0.8rem] sm:inline-flex">
            Browse drafts
          </Link>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={cn(
              'grid h-11 w-11 place-items-center rounded-full border backdrop-blur transition-colors md:hidden',
              overHero ? 'border-white/30 bg-white/10 text-white' : 'border-line bg-surface/60 text-ink',
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass overflow-hidden border-t border-line/60 md:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.route}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={item.route}
                    end={item.route === '/'}
                    className={({ isActive }) =>
                      cn('flex min-h-11 items-center rounded-lg px-3 py-3 font-display text-2xl', isActive ? 'text-primary' : 'text-ink')
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link to="/explore" className="btn-primary mt-3 justify-center">
                Browse drafts
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
