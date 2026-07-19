import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Explore from '@/pages/Explore'
import DishDetail from '@/pages/DishDetail'
import Kitchen from '@/pages/Kitchen'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dish/:id" element={<DishDetail />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
