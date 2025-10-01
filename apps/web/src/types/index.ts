// Core application types for Probaho

export interface User {
  id: string
  phoneNumber: string
  email?: string
  firstName: string
  lastName: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: 'BDT'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  userId: string
  type: 'credit' | 'debit'
  amount: number
  currency: 'BDT'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  referenceId?: string
  mfsProvider?: MFSProvider
  recipientPhone?: string
  recipientMfs?: MFSProvider
  fee?: number
  createdAt: Date
  updatedAt: Date
}

export type MFSProvider = 'bkash' | 'rocket' | 'nagad' | 'upay' | 'tapp' | 'mycash'

export interface MFSAccount {
  id: string
  userId: string
  provider: MFSProvider
  phoneNumber: string
  accountName: string
  isVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AddMoneyRequest {
  amount: number
  sourceMfs: MFSProvider
  sourcePhone: string
  pin: string
  otp?: string
}

export interface SendMoneyRequest {
  amount: number
  recipientPhone: string
  recipientMfs: MFSProvider
  description?: string
  pin: string
}

export interface MFSConfig {
  provider: MFSProvider
  apiUrl: string
  apiKey: string
  apiSecret: string
  merchantId: string
  isActive: boolean
}

export interface CustodyBankConfig {
  bankName: string
  apiUrl: string
  apiKey: string
  apiSecret: string
  accountNumber: string
  isActive: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginRequest {
  phoneNumber: string
  pin: string
  otp?: string
}

export interface RegisterRequest {
  phoneNumber: string
  firstName: string
  lastName: string
  pin: string
  otp: string
}

export interface VerifyOTPRequest {
  phoneNumber: string
  otp: string
  type: 'registration' | 'login' | 'transaction'
}

export interface ChangePinRequest {
  currentPin: string
  newPin: string
  confirmPin: string
}

export interface NotificationSettings {
  sms: boolean
  email: boolean
  push: boolean
  transactionAlerts: boolean
  lowBalanceAlerts: boolean
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'bn'
  currency: 'BDT'
  notifications: NotificationSettings
}

export interface SecurityLog {
  id: string
  userId: string
  action: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  success: boolean
  details?: any
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
}

// Dashboard analytics types
export interface DashboardStats {
  totalBalance: number
  monthlyTransactions: number
  monthlyVolume: number
  activeMfsAccounts: number
}

export interface TransactionAnalytics {
  totalTransactions: number
  totalVolume: number
  averageTransaction: number
  topMfsProviders: Array<{
    provider: MFSProvider
    count: number
    volume: number
  }>
}
