'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

interface User {
  id: string
  phone: string
  name: string
  email?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const timeoutRef = useRef<number | null>(null)
  const INACTIVITY_MS = 60 * 1000 // 60 seconds

  useEffect(() => {
    // Always set loading to false after a short delay to prevent infinite loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    // Check for existing auth data
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('probaho_token')
      const userData = localStorage.getItem('probaho_user')
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('probaho_token')
          localStorage.removeItem('probaho_user')
        }
      }
    }

    return () => clearTimeout(timer)
  }, [])

  // Inactivity logout: reset timer on user activity and logout after inactivity
  useEffect(() => {
    function clearInactivityTimer() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    function startInactivityTimer() {
      clearInactivityTimer()
      if (user) {
        timeoutRef.current = window.setTimeout(() => {
          // auto logout on inactivity
          logout()
        }, INACTIVITY_MS) as unknown as number
      }
    }

    function handleActivity() {
      if (user) startInactivityTimer()
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] as const
    events.forEach((ev) => window.addEventListener(ev, handleActivity))

    // Start timer if user is already logged in
    if (user) startInactivityTimer()

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity))
      clearInactivityTimer()
    }
  }, [user])

  const login = (userData: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('probaho_token', token)
      localStorage.setItem('probaho_user', JSON.stringify(userData))
    }
    setUser(userData)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('probaho_token')
      localStorage.removeItem('probaho_user')
    }
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
