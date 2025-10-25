'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  WalletIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { formatCurrency } from '@/lib/utils'
import { storage } from '../lib/storage'
import type { Wallet, Transaction } from '../lib/storage'

export default function WalletBalance() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [todayStats, setTodayStats] = useState({
    sent: 0,
    received: 0,
    transactions: 0
  })

  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);
        const wallet = storage.getWallet();
        const txns = storage.getTransactions();
        const stats = storage.getDailyStats();
        
        if (wallet) {
          setWallet(wallet);
        }
        
        if (txns) {
          setRecentTransactions(txns);
        }

        if (stats) {
          setTodayStats(stats);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Listen for wallet updates
    const unsubWallet = storage.subscribe('wallet', (wallet: any) => {
      if (wallet) {
        setWallet(wallet);
      }
    });

    // Listen for transaction updates
    const unsubTxns = storage.subscribe('transactions', (txns: Transaction[]) => {
      if (txns) {
        setRecentTransactions(txns);
        const stats = storage.getDailyStats();
        setTodayStats(stats);
      }
    });

    return () => {
      unsubWallet();
      unsubTxns();
    };
  }, [])

  // Format date string to localized time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Unable to load wallet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-3xl p-8 shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/20 rounded-full -translate-y-8 -translate-x-8 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <WalletIcon className="h-6 w-6" />
              <span className="font-medium">Probaho Balance</span>
            </div>
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              {isBalanceVisible ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="mb-6">
          <div className="text-3xl font-bold mb-1">
            {isBalanceVisible ? formatCurrency(wallet.balance) : '••••••'}
          </div>
          <div className="text-blue-100 text-sm">
            Available Balance
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-300" />
            <span className="text-green-300">
              +{formatCurrency(todayStats.received)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-300" />
            <span className="text-red-300">
              -{formatCurrency(todayStats.sent)}
            </span>
          </div>
        </div>
        </div>
      </motion.div>

      {/* Today's Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today's Activity</h3>
        
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(todayStats.received)}
            </div>
            <div className="text-sm text-gray-500">Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(todayStats.sent)}
            </div>
            <div className="text-sm text-gray-500">Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {todayStats.transactions}
            </div>
            <div className="text-sm text-gray-500">Transactions</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <Link href="/send-money" className="text-indigo-600 text-sm hover:text-indigo-700 font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowTrendingUpIcon className="h-5 w-5" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(transaction.createdAt)}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
