import React from 'react';
import { motion } from 'framer-motion';

const WalletBalance = () => {
  // Mock wallet data - in a real app, this would come from an API or context
  const walletData = {
    balance: 12500,
    currency: 'BDT',
    lastUpdated: new Date().toISOString(),
    mfsBalances: [
      { provider: 'bKash', balance: 2500, color: 'bg-pink-500' },
      { provider: 'Nagad', balance: 3000, color: 'bg-orange-500' },
      { provider: 'Rocket', balance: 4000, color: 'bg-blue-500' },
      { provider: 'Upay', balance: 3000, color: 'bg-purple-500' }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>
        <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {walletData.balance.toLocaleString()} {walletData.currency}
        </div>
        <p className="text-sm text-gray-500">Total Available Balance</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">MFS Balances</h4>
        {walletData.mfsBalances.map((mfs, index) => (
          <motion.div
            key={mfs.provider}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${mfs.color}`}></div>
              <span className="text-sm font-medium text-gray-700">{mfs.provider}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {mfs.balance.toLocaleString()} {walletData.currency}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated</span>
          <span>{new Date(walletData.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletBalance;