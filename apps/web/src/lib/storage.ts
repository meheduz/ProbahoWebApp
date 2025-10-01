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

  // Wallet Management
  getWallet(): Wallet | null {
    if (!this.isClient) return null;
    const data = localStorage.getItem(STORAGE_KEYS.wallet)
    return data ? JSON.parse(data) : null
  }

  setWallet(wallet: Wallet) {
    if (!this.isClient) return;
    localStorage.setItem(STORAGE_KEYS.wallet, JSON.stringify(wallet))
    this.notify('wallet', wallet)
    window.dispatchEvent(new CustomEvent('walletUpdated', { detail: wallet }))
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
    const data = localStorage.getItem(STORAGE_KEYS.transactions)
    return data ? JSON.parse(data) : []
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    const transactions = this.getTransactions()
    const newTransaction = {
      ...transaction,
      id: `TXN_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedTransactions = [newTransaction, ...transactions]
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(updatedTransactions))
    this.notify('transactions', updatedTransactions)

    // Update wallet balance
    if (newTransaction.status === 'success') {
      this.updateWalletBalance(newTransaction.amount, newTransaction.type)
    }

    return newTransaction
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

  // Clear all data
  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    window.dispatchEvent(new Event('storage'))
  }
}

export const storage = StorageManager.getInstance()