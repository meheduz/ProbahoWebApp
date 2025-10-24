'use client';

interface StorageKeys {
  wallet: 'probaho_wallet'
  topups: 'probaho_topups'
  transactions: 'probaho_transactions'
  user: 'probaho_user'
  settings: 'probaho_settings'
}

const STORAGE_KEYS: StorageKeys = {
  wallet: 'probaho_wallet',
  topups: 'probaho_topups',
  transactions: 'probaho_transactions',
  user: 'probaho_user',
  settings: 'probaho_settings'
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed'
  description: string
  mfsProvider?: string
  recipientMfs?: string
  account?: string
  note?: string
  createdAt: string
  updatedAt: string
}

// Smart storage management
class StorageManager {
  private static instance: StorageManager
  private subscribers: { [key: string]: Function[] } = {}

  private isClient: boolean;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
    
    // Initialize with default data if empty
    if (this.isClient && !this.getWallet()) {
      this.setWallet({
        id: '1',
        userId: '1',
        balance: 0,
        currency: 'BDT',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  // Subscribe to data changes
  subscribe(key: keyof StorageKeys, callback: Function) {
    if (!this.subscribers[key]) {
      this.subscribers[key] = []
    }
    this.subscribers[key].push(callback)
    return () => this.unsubscribe(key, callback)
  }

  private unsubscribe(key: keyof StorageKeys, callback: Function) {
    this.subscribers[key] = this.subscribers[key]?.filter(cb => cb !== callback) || []
  }

  private notify(key: keyof StorageKeys, data: any) {
    this.subscribers[key]?.forEach(callback => callback(data))
  }

  // Validation helpers
  private validateWallet(data: any): data is Wallet {
    return data && 
           typeof data.id === 'string' &&
           typeof data.userId === 'string' &&
           typeof data.balance === 'number' &&
           typeof data.currency === 'string' &&
           typeof data.isActive === 'boolean' &&
           typeof data.createdAt === 'string' &&
           typeof data.updatedAt === 'string'
  }

  private validateTransaction(data: any): data is Transaction {
    return data &&
           typeof data.id === 'string' &&
           typeof data.userId === 'string' &&
           ['credit', 'debit'].includes(data.type) &&
           typeof data.amount === 'number' &&
           typeof data.currency === 'string' &&
           ['pending', 'success', 'failed'].includes(data.status) &&
           typeof data.description === 'string' &&
           typeof data.createdAt === 'string' &&
           typeof data.updatedAt === 'string'
  }

  // Wallet Management
  getWallet(): Wallet | null {
    if (!this.isClient) return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.wallet)
      if (!data) return null;
      
      const parsed = JSON.parse(data)
      if (this.validateWallet(parsed)) {
        return parsed
      } else {
        console.warn('Invalid wallet data in localStorage, resetting...')
        this.clearWallet()
        return null
      }
    } catch (error) {
      console.error('Error parsing wallet data:', error)
      this.clearWallet()
      return null
    }
  }

  setWallet(wallet: Wallet) {
    if (!this.isClient) return;
    
    if (!this.validateWallet(wallet)) {
      console.error('Invalid wallet data provided')
      return
    }
    
    try {
      localStorage.setItem(STORAGE_KEYS.wallet, JSON.stringify(wallet))
      this.notify('wallet', wallet)
      window.dispatchEvent(new CustomEvent('walletUpdated', { detail: wallet }))
    } catch (error) {
      console.error('Error saving wallet data:', error)
      // Try to clear corrupted data
      this.clearWallet()
    }
  }

  updateWalletBalance(amount: number, type: 'credit' | 'debit' = 'credit') {
    if (!this.isClient) return null;
    const wallet = this.getWallet()
    if (!wallet) return null

    const newBalance = type === 'credit' 
      ? Number(wallet.balance || 0) + Number(amount)
      : Number(wallet.balance || 0) - Number(amount)

    const updatedWallet = {
      ...wallet,
      balance: newBalance,
      updatedAt: new Date().toISOString()
    }

    this.setWallet(updatedWallet)
    return updatedWallet
  }

  // Transaction Management
  getTransactions(): Transaction[] {
    if (!this.isClient) return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.transactions)
      if (!data) return [];
      
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        // Filter out invalid transactions
        const validTransactions = parsed.filter(tx => this.validateTransaction(tx))
        
        // If we filtered out any transactions, save the cleaned data
        if (validTransactions.length !== parsed.length) {
          console.warn(`Filtered out ${parsed.length - validTransactions.length} invalid transactions`)
          this.setTransactions(validTransactions)
        }
        
        return validTransactions
      } else {
        console.warn('Invalid transactions data in localStorage, resetting...')
        this.clearTransactions()
        return []
      }
    } catch (error) {
      console.error('Error parsing transactions data:', error)
      this.clearTransactions()
      return []
    }
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!this.isClient) return null;
    
    // Validate transaction data
    if (!transaction || 
        typeof transaction.amount !== 'number' || 
        transaction.amount <= 0 ||
        !['credit', 'debit'].includes(transaction.type) ||
        !['pending', 'success', 'failed'].includes(transaction.status)) {
      console.error('Invalid transaction data provided')
      return null
    }
    
    const transactions = this.getTransactions()
    const newTransaction = {
      ...transaction,
      id: `TXN_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedTransactions = [newTransaction, ...transactions]
    
    try {
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(updatedTransactions))
      this.notify('transactions', updatedTransactions)

      // Update wallet balance
      if (newTransaction.status === 'success') {
        this.updateWalletBalance(newTransaction.amount, newTransaction.type)
      }

      return newTransaction
    } catch (error) {
      console.error('Error saving transaction:', error)
      return null
    }
  }

  // Get daily stats
  getDailyStats() {
    const transactions = this.getTransactions()
    const today = new Date()
    const todayTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.createdAt)
      return txDate.toDateString() === today.toDateString()
    })

    return {
      sent: todayTransactions
        .filter(tx => tx.type === 'debit')
        .reduce((sum, tx) => sum + tx.amount, 0),
      received: todayTransactions
        .filter(tx => tx.type === 'credit')
        .reduce((sum, tx) => sum + tx.amount, 0),
      transactions: todayTransactions.length
    }
  }

  // Helper methods for clearing corrupted data
  private clearWallet() {
    if (!this.isClient) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.wallet)
      this.notify('wallet', null)
    } catch (error) {
      console.error('Error clearing wallet data:', error)
    }
  }

  private clearTransactions() {
    if (!this.isClient) return;
    try {
      localStorage.removeItem(STORAGE_KEYS.transactions)
      this.notify('transactions', [])
    } catch (error) {
      console.error('Error clearing transactions data:', error)
    }
  }

  private setTransactions(transactions: Transaction[]) {
    if (!this.isClient) return;
    try {
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
      this.notify('transactions', transactions)
    } catch (error) {
      console.error('Error saving transactions data:', error)
    }
  }

  // Clear all data
  clearAllData() {
    if (!this.isClient) return;
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.error('Error clearing all data:', error)
    }
  }
}

export const storage = StorageManager.getInstance()