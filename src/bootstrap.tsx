import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
// Self-hosted variable fonts (no external network dependency).
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import App from './App.tsx'
import './index.css'

/**
 * The controlled-preview HTML is already a complete, route-specific first
 * render. Loading the interactive application separately keeps that first
 * response light while preserving the richer client UI once the browser is
 * ready. This deliberately uses the existing client-render path rather than
 * hydrating draft procedures into the page.
 */
export function startInteractiveApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </BrowserRouter>
    </StrictMode>,
  )

  // React has replaced the prerendered content shell, so its scoped styles are
  // now dead weight in the document. Drop them after the interactive app starts.
  document.getElementById('pr-shell-css')?.remove()
}
