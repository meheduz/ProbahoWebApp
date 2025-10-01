import { 
  User, 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest, 
  VerifyOTPRequest,
  ApiResponse 
} from '@probaho/shared'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api'

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  private async authenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return this.request<{ user: User; tokens: AuthTokens }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(data: RegisterRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return this.request<{ user: User; tokens: AuthTokens }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }

  async logout(accessToken: string): Promise<ApiResponse<{ message: string }>> {
    return this.authenticatedRequest<{ message: string }>('/auth/logout', accessToken, {
      method: 'POST',
    })
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await this.authenticatedRequest<{ valid: boolean }>('/auth/verify', token, {
        method: 'GET',
      })
      return response.success && response.data?.valid === true
    } catch {
      return false
    }
  }

  async updateProfile(userData: Partial<User>, accessToken: string): Promise<ApiResponse<User>> {
    return this.authenticatedRequest<User>('/auth/profile', accessToken, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async sendOTP(phoneNumber: string, type: 'registration' | 'login' | 'transaction'): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        type,
      }),
    })
  }

  async changePIN(
    currentPIN: string,
    newPIN: string,
    accessToken: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.authenticatedRequest<{ message: string }>('/auth/change-pin', accessToken, {
      method: 'POST',
      body: JSON.stringify({
        currentPIN,
        newPIN,
      }),
    })
  }
}

export const authService = new AuthService()
