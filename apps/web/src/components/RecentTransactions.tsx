'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Transaction, MFSProvider } from '@/types'
import { formatCurrency, getRelativeTime, getMFSProviderName, getMFSProviderColor } from '@/lib/utils'

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all')

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            userId: '1',
            type: 'credit',
            amount: 5000,
            currency: 'BDT',
            status: 'completed',
            description: 'Received from bKash',
            mfsProvider: 'bkash',
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 30)
          },
          {
            id: '2',
            userId: '1',
            type: 'debit',
            amount: 2500,
            currency: 'BDT',
            status: 'completed',
            description: 'Sent to Rocket',
            recipientPhone: '+8801712345678',
            recipientMfs: 'rocket',
            fee: 37.5,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
          },
          {
            id: '3',
            userId: '1',
            type: 'credit',
            amount: 10000,
            currency: 'BDT',
            status: 'completed',
            description: 'Received from Nagad',
            mfsProvider: 'nagad',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
          }
        ]
        
        setTransactions(mockTransactions)
        setIsLoading(false)
      }, 1000)
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'sent') return transaction.type === 'debit'
    if (filter === 'received') return transaction.type === 'credit'
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'failed':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        <a href="/history" className="text-primary-600 text-sm hover:text-primary-700">
          View All
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All' },
          { key: 'sent', label: 'Sent' },
          { key: 'received', label: 'Received' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              filter === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* Transaction Icon */}
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  transaction.type === 'credit' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowDownIcon className="h-6 w-6" />
                  ) : (
                    <ArrowUpIcon className="h-6 w-6" />
                  )}
                </div>
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  {getStatusIcon(transaction.status)}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{getRelativeTime(transaction.createdAt)}</span>
                  
                  {transaction.mfsProvider && (
                    <>
                      <span>•</span>
                      <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${getMFSProviderColor(transaction.mfsProvider)} text-white`}>
                        <span>{getMFSProviderName(transaction.mfsProvider)}</span>
                      </div>
                    </>
                  )}
                  
                  {transaction.recipientMfs && (
                    <>
                      <span>•</span>
                      <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${getMFSProviderColor(transaction.recipientMfs)} text-white`}>
                        <span>to {getMFSProviderName(transaction.recipientMfs)}</span>
                      </div>
                    </>
                  )}
                </div>

                {transaction.recipientPhone && (
                  <p className="text-xs text-gray-400 mt-1">
                    {transaction.recipientPhone}
                  </p>
                )}
              </div>

              {/* Amount and Status */}
              <div className="flex flex-col items-end space-y-1">
                <div className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </div>
                
                {transaction.fee && (
                  <div className="text-xs text-gray-400">
                    Fee: {formatCurrency(transaction.fee)}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
