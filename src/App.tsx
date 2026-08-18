import { Suspense, lazy } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Home from '@/pages/Home'
import { RouteSkeleton } from '@/components/util/RouteSkeleton'

/*
 * Home ships in the entry chunk — it is the most common landing route, so
 * paying for a second round trip there would be a regression. Every other
 * route is split out, so a first visit no longer downloads Explore, the
 * Kitchen dashboard, the dish detail view, and the policy pages before it can
 * paint.
 */
const Explore = lazy(() => import('@/pages/Explore'))
const DishDetail = lazy(() => import('@/pages/DishDetail'))
const Kitchen = lazy(() => import('@/pages/Kitchen'))
const About = lazy(() => import('@/pages/About'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const Terms = lazy(() => import('@/pages/Terms'))
const Contact = lazy(() => import('@/pages/Contact'))
const EditorialPolicy = lazy(() => import('@/pages/EditorialPolicy'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          element={
            <Suspense fallback={<RouteSkeleton />}>
              <RouteOutlet />
            </Suspense>
          }
        >
          <Route path="/explore" element={<Explore />} />
          <Route path="/dish/:id" element={<DishDetail />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/editorial-policy" element={<EditorialPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}

/** Pathless layout route whose only job is to host the shared <Suspense>. */
function RouteOutlet() {
  return <Outlet />
}
