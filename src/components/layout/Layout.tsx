import { useEffect, useRef, useState, type RefObject } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollProgress } from '@/components/util/ScrollProgress'

function routeAnnouncement(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname === '/explore') return 'the dish catalog'
  if (pathname === '/kitchen') return 'the Kitchen preview'
  if (pathname === '/about') return 'About'
  if (pathname === '/privacy') return 'Privacy'
  if (pathname === '/terms') return 'Terms'
  if (pathname === '/contact') return 'Contact'
  if (pathname === '/editorial-policy') return 'the Editorial Policy'
  if (pathname.startsWith('/dish/')) return 'dish details'
  return 'the requested page'
}

function ScrollToTop({ mainRef }: { mainRef: RefObject<HTMLElement> }) {
  const { pathname } = useLocation()
  const initialNavigation = useRef(true)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    // 'instant' bypasses the global scroll-behavior: smooth — route changes
    // should jump, not animate a full-page scroll.
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (initialNavigation.current) {
      initialNavigation.current = false
      return
    }

    // React Router keeps the document loaded, so explicitly place a keyboard
    // or screen-reader user at the new page landmark after route navigation.
    // Query-string-only filter changes intentionally retain the active control.
    mainRef.current?.focus({ preventScroll: true })
    setAnnouncement(`Navigated to ${routeAnnouncement(pathname)}.`)
  }, [mainRef, pathname])

  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {announcement}
    </p>
  )
}

export function Layout() {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-pill bg-primary px-4 py-2 text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <ScrollToTop mainRef={mainRef} />
      <Navbar />
      <main ref={mainRef} id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
