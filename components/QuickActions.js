import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const QuickActions = () => {
  const actions = [
    {
      id: 'send-money',
      title: 'Send Money',
      description: 'Transfer to any MFS',
      icon: '💸',
      href: '/send-money',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      id: 'add-money',
      title: 'Add Money',
      description: 'Top up your wallet',
      icon: '💰',
      href: '/add-money',
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-700'
    },
    {
      id: 'history',
      title: 'History',
      description: 'View transactions',
      icon: '📊',
      href: '/history',
      color: 'from-purple-500 to-violet-600',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700'
    },
    {
      id: 'help',
      title: 'Help',
      description: 'Get support',
      icon: '❓',
      href: '/help',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={action.href}>
              <div className={`bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-xl p-4 text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl`}>
                <div className="flex flex-col items-center text-center">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚡</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Instant Transfers</h4>
            <p className="text-xs text-gray-600">Send money to any MFS in seconds</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;