import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

// Secure random number generation
function getSecureRandomBytes(length: number): Uint8Array {
  const array = new Uint8Array(length)
  
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(array)
  } else {
    // More secure fallback using multiple entropy sources
    const entropy = [
      Date.now().toString(),
      Math.random().toString(),
      performance.now().toString(),
      navigator.userAgent || '',
      window.location.href || ''
    ].join('')
    
    // Use a simple hash-like function for better distribution
    for (let i = 0; i < length; i++) {
      const hash = entropy.charCodeAt(i % entropy.length) + 
                   entropy.charCodeAt((i * 7) % entropy.length) + 
                   entropy.charCodeAt((i * 13) % entropy.length)
      array[i] = hash % 256
    }
  }
  
  return array
}

// Generate transaction ID
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36)
  const array = getSecureRandomBytes(8) // Increased from 6 to 8 for better security
  const random = Array.from(array, b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
  return `TXN_${timestamp}_${random}`.toUpperCase()
}

// Generate OTP
export function generateOTP(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  const array = getSecureRandomBytes(length)
  
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
    bkash: 'bg-pink-500',
    rocket: 'bg-blue-500',
    nagad: 'bg-green-500',
    upay: 'bg-purple-500',
    tapp: 'bg-orange-500',
    mycash: 'bg-red-500',
  }
  return colors[provider] || 'bg-gray-500'
}

// Fee calculation utilities
export function calculateTransferFee(amount: number): number {
  // 1% transfer fee with minimum 5 BDT as per user requirement
  return Math.max(5, Math.ceil(amount * 0.01))
}

export function calculateAddMoneyFee(amount: number): number {
  // Tiered fee structure for adding money
  if (amount <= 1000) return 5
  if (amount <= 5000) return 10
  if (amount <= 10000) return 15
  return 20
}

// Validation utilities
export function validateAmount(amount: number): boolean {
  return amount > 0 && amount <= 100000 // Max 1 lakh BDT
}

export function validatePIN(pin: string): boolean {
  return /^\d{4,6}$/.test(pin)
}

// Local storage utilities
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Handle storage errors silently
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
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

// Error handling
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

// API response handler
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch {
      document.body.removeChild(textArea)
      return false
    }
  }
  
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// URL utilities
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

export function getQueryParam(url: string, param: string): string | null {
  const urlObj = new URL(url)
  return urlObj.searchParams.get(param)
}
