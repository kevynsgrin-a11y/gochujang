import { useCallback, useEffect, useRef, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'gochujang-theme'

// localStorage can throw (blocked cookies, sandboxed iframes, some webviews) —
// never let theme persistence take the whole app down.
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* persistence is best-effort */
  }
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = safeGet(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function apply(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  // Keep mobile browser chrome in step with the active palette.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#161210' : '#F5EFE6')
}

/**
 * Theme hook. The inline script in index.html sets the class before first
 * paint; this hook keeps it in sync afterwards. The choice is persisted ONLY
 * when the user explicitly toggles — an untouched preference keeps following
 * the OS setting on future visits.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const userChose = useRef(false)

  useEffect(() => {
    apply(theme)
    if (userChose.current) safeSet(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    userChose.current = true
    setThemeState(t)
  }, [])

  const toggle = useCallback(() => {
    userChose.current = true
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, setTheme, toggle }
}
