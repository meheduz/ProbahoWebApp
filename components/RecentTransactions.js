import React from 'react';
import { motion } from 'framer-motion';

const RecentTransactions = () => {
  // Mock transaction data - in a real app, this would come from an API
  const transactions = [
    {
      id: 'TXN_001',
      type: 'credit',
      amount: 5000,
      currency: 'BDT',
      description: 'Added money from bKash',
      provider: 'bKash',
      status: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      icon: '💰'
    },
    {
      id: 'TXN_002',
      type: 'debit',
      amount: 1500,
      currency: 'BDT',
      description: 'Sent to Nagad user',
      provider: 'Nagad',
      status: 'success',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      icon: '💸'
    },
    {
      id: 'TXN_003',
      type: 'credit',
      amount: 3000,
      currency: 'BDT',
      description: 'Received from Rocket',
      provider: 'Rocket',
      status: 'success',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      icon: '📥'
    },
    {
      id: 'TXN_004',
      type: 'debit',
      amount: 800,
      currency: 'BDT',
      description: 'Payment to Upay',
      provider: 'Upay',
      status: 'pending',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      icon: '⏳'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">{transaction.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {transaction.description}
                </h4>
                <span className={`text-sm font-semibold ${getTypeColor(transaction.type)}`}>
                  {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()} {transaction.currency}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{transaction.provider}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatTimeAgo(transaction.timestamp)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">📊</span>
          </div>
          <h4 className="text-gray-500 font-medium mb-2">No transactions yet</h4>
          <p className="text-sm text-gray-400">Your transaction history will appear here</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Total transactions: {transactions.length}</span>
          <span>Last 30 days</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentTransactions;