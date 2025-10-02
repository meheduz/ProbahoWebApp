// Shared utility functions for both web and mobile apps

// Currency formatting
export function formatCurrency(amount: number, currency: string = 'BDT'): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Number formatting
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-BD').format(num)
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Handle Bangladesh phone numbers
  if (cleaned.startsWith('880')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
  } else if (cleaned.startsWith('01')) {
    return `+880 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)}`
  }
  
  return phone
}

// Validate Bangladesh phone number
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return /^(880|0)?1[3-9]\d{8}$/.test(cleaned)
}

// Generate transaction ID
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36)
  const array = new Uint8Array(6)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(array)
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  const random = Array.from(array, b => b.toString(16).padStart(2, '0')).join('').slice(0, 12)
  return `TXN_${timestamp}_${random}`.toUpperCase()
}

// Generate OTP
export function generateOTP(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  const array = new Uint8Array(length)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(array)
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  for (let i = 0; i < length; i++) {
    otp += digits[array[i] % digits.length]
  }
  return otp
}

// Mask sensitive data
export function maskPhoneNumber(phone: string): string {
  if (phone.length < 4) return phone
  return phone.slice(0, 3) + '*'.repeat(phone.length - 6) + phone.slice(-3)
}

export function maskAccountNumber(account: string): string {
  if (account.length < 4) return account
  return '*'.repeat(account.length - 4) + account.slice(-4)
}

// Date formatting
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(d)
}

// MFS provider utilities
export function getMFSProviderName(provider: string): string {
  const names: Record<string, string> = {
    bkash: 'bKash',
    rocket: 'Rocket',
    nagad: 'Nagad',
    upay: 'Upay',
    tapp: 'Tapp',
    mycash: 'MyCash',
  }
  return names[provider] || provider
}

export function getMFSProviderColor(provider: string): string {
  const colors: Record<string, string> = {
    bkash: '#E2136E', // Pink
    rocket: '#1E40AF', // Blue
    nagad: '#059669', // Green
    upay: '#7C3AED', // Purple
    tapp: '#EA580C', // Orange
    mycash: '#DC2626', // Red
  }
  return colors[provider] || '#6B7280' // Gray fallback
}

// Validation utilities
export function validateAmount(amount: number): boolean {
  return amount > 0 && amount <= 100000 // Max 1 lakh BDT
}

export function validatePIN(pin: string): boolean {
  return /^\d{4,6}$/.test(pin)
}

// Error handling
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Fee calculation
export function calculateTransferFee(amount: number): number {
  // 1.5% fee with minimum 5 BDT
  return Math.max(5, amount * 0.015)
}

// Security utilities
export function generateSecureToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Platform detection
export function isWeb(): boolean {
  return typeof window !== 'undefined'
}

export function isMobile(): boolean {
  if (isWeb()) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  return true // Assume mobile in React Native
}
