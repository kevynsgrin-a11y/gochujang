import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollProgress } from '@/components/util/ScrollProgress'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // 'instant' bypasses the global scroll-behavior: smooth — route changes
    // should jump, not animate a full-page scroll.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-pill bg-primary px-4 py-2 text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
