"use client"

import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme') as 'light' | 'dark' | null
  if (stored) return stored
  return 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-yellow-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  )
}
