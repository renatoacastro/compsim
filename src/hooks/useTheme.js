import { useState, useEffect } from 'react'

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('compsim-theme')
      if (stored) return stored === 'dark'
    } catch {}
    return true // default dark
  })

  useEffect(() => {
    const root = document.documentElement
    // Remove both, then add the correct one
    root.classList.remove('dark', 'light')
    root.classList.add(dark ? 'dark' : 'light')
    try { localStorage.setItem('compsim-theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}
