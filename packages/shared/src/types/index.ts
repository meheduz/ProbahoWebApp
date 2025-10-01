import { z } from 'zod'

// Core application types for Probaho
export const UserSchema = z.object({
  id: z.string(),
  phoneNumber: z.string(),
  email: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const WalletSchema = z.object({
  id: z.string(),
  userId: z.string(),
  balance: z.number(),
  currency: z.literal('BDT'),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['credit', 'debit']),
  amount: z.number(),
  currency: z.literal('BDT'),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
  description: z.string(),
  referenceId: z.string().optional(),
  mfsProvider: z.string().optional(),
  recipientPhone: z.string().optional(),
  recipientMfs: z.string().optional(),
  fee: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const MFSProviderSchema = z.enum(['bkash', 'rocket', 'nagad', 'upay', 'tapp', 'mycash'])

export const MFSAccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  provider: MFSProviderSchema,
  phoneNumber: z.string(),
  accountName: z.string(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const AddMoneyRequestSchema = z.object({
  amount: z.number().min(1).max(100000),
  sourceMfs: MFSProviderSchema,
  sourcePhone: z.string(),
  pin: z.string().min(4).max(6),
  otp: z.string().optional(),
})

export const SendMoneyRequestSchema = z.object({
  amount: z.number().min(1).max(100000),
  recipientPhone: z.string(),
  recipientMfs: MFSProviderSchema,
  description: z.string().optional(),
  pin: z.string().min(4).max(6),
})

export const LoginRequestSchema = z.object({
  phoneNumber: z.string(),
  pin: z.string().min(4).max(6),
  otp: z.string().optional(),
})

export const RegisterRequestSchema = z.object({
  phoneNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  pin: z.string().min(4).max(6),
  otp: z.string(),
})

export const VerifyOTPRequestSchema = z.object({
  phoneNumber: z.string(),
  otp: z.string(),
  type: z.enum(['registration', 'login', 'transaction']),
})

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  code: z.string().optional(),
})

// Type exports
export type User = z.infer<typeof UserSchema>
export type Wallet = z.infer<typeof WalletSchema>
export type Transaction = z.infer<typeof TransactionSchema>
export type MFSProvider = z.infer<typeof MFSProviderSchema>
export type MFSAccount = z.infer<typeof MFSAccountSchema>
export type AddMoneyRequest = z.infer<typeof AddMoneyRequestSchema>
export type SendMoneyRequest = z.infer<typeof SendMoneyRequestSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type VerifyOTPRequest = z.infer<typeof VerifyOTPRequestSchema>
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data?: T }

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
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

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
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

export interface AppError {
  code: string
  message: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
}

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
