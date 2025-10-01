'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthTokens, LoginRequest, RegisterRequest, VerifyOTPRequest } from '@/types'
import { authService } from '@/services/authService'
import { getFromStorage, setToStorage, removeFromStorage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  verifyOTP: (data: VerifyOTPRequest) => Promise<boolean>
  logout: () => void
  refreshToken: () => Promise<boolean>
  updateUser: (userData: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!tokens

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokens = getFromStorage<AuthTokens>('auth_tokens', null)
        const storedUser = getFromStorage<User>('user', null)

        if (storedTokens && storedUser) {
          setTokens(storedTokens)
          setUser(storedUser)

          // Verify token is still valid
          const isValid = await authService.verifyToken(storedTokens.accessToken)
          if (!isValid) {
            // Try to refresh token
            const refreshed = await refreshToken()
            if (!refreshed) {
              logout()
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)
      
      if (response.success && response.data) {
        const { user: userData, tokens: authTokens } = response.data
        
        setUser(userData)
        setTokens(authTokens)
        setToStorage('user', userData)
        setToStorage('auth_tokens', authTokens)
        
        toast.success('Welcome back!')
        return true
      } else {
        toast.error(response.message || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authService.register(data)
      
      if (response.success) {
        toast.success('Registration successful! Please verify your OTP.')
        return true
      } else {
        toast.error(response.message || 'Registration failed')
        return false
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (data: VerifyOTPRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authService.verifyOTP(data)
      
      if (response.success && response.data) {
        const { user: userData, tokens: authTokens } = response.data
        
        setUser(userData)
        setTokens(authTokens)
        setToStorage('user', userData)
        setToStorage('auth_tokens', authTokens)
        
        toast.success('Account verified successfully!')
        return true
      } else {
        toast.error(response.message || 'OTP verification failed')
        return false
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error('OTP verification failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setTokens(null)
    removeFromStorage('user')
    removeFromStorage('auth_tokens')
    toast.success('Logged out successfully')
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!tokens?.refreshToken) return false

      const response = await authService.refreshToken(tokens.refreshToken)
      
      if (response.success && response.data) {
        setTokens(response.data)
        setToStorage('auth_tokens', response.data)
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
      return false
    }
  }

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!tokens?.accessToken) return false

      const response = await authService.updateProfile(userData, tokens.accessToken)
      
      if (response.success && response.data) {
        setUser(response.data)
        setToStorage('user', response.data)
        toast.success('Profile updated successfully')
        return true
      } else {
        toast.error(response.message || 'Update failed')
        return false
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Update failed. Please try again.')
      return false
    }
  }

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    register,
    verifyOTP,
    logout,
    refreshToken,
    updateUser,
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
