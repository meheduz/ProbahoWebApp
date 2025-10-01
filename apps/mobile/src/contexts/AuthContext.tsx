import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User, AuthTokens, LoginRequest, RegisterRequest, VerifyOTPRequest } from '@probaho/shared'
import { authService } from '../services/authService'

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  verifyOTP: (data: VerifyOTPRequest) => Promise<boolean>
  logout: () => Promise<void>
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
        const storedTokens = await AsyncStorage.getItem('auth_tokens')
        const storedUser = await AsyncStorage.getItem('user')

        if (storedTokens && storedUser) {
          const parsedTokens = JSON.parse(storedTokens)
          const parsedUser = JSON.parse(storedUser)
          
          setTokens(parsedTokens)
          setUser(parsedUser)

          // Verify token is still valid
          const isValid = await authService.verifyToken(parsedTokens.accessToken)
          if (!isValid) {
            // Try to refresh token
            const refreshed = await refreshToken()
            if (!refreshed) {
              await logout()
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        await logout()
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
        await AsyncStorage.setItem('user', JSON.stringify(userData))
        await AsyncStorage.setItem('auth_tokens', JSON.stringify(authTokens))
        
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authService.register(data)
      return response.success
    } catch (error) {
      console.error('Registration error:', error)
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
        await AsyncStorage.setItem('user', JSON.stringify(userData))
        await AsyncStorage.setItem('auth_tokens', JSON.stringify(authTokens))
        
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (tokens?.accessToken) {
        await authService.logout(tokens.accessToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setTokens(null)
      await AsyncStorage.removeItem('user')
      await AsyncStorage.removeItem('auth_tokens')
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!tokens?.refreshToken) return false

      const response = await authService.refreshToken(tokens.refreshToken)
      
      if (response.success && response.data) {
        setTokens(response.data)
        await AsyncStorage.setItem('auth_tokens', JSON.stringify(response.data))
        return true
      } else {
        await logout()
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      await logout()
      return false
    }
  }

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!tokens?.accessToken) return false

      const response = await authService.updateProfile(userData, tokens.accessToken)
      
      if (response.success && response.data) {
        setUser(response.data)
        await AsyncStorage.setItem('user', JSON.stringify(response.data))
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Profile update error:', error)
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
