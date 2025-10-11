'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  PlusIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ClockIcon,
  QrCodeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import { MFSProvider } from '@/types'
import { getMFSProviderName, getMFSProviderColor } from '@/lib/utils'

interface QuickActionsProps {
  // No props needed since we're using Link components
}

const quickActions = [
  {
    id: 'add-money',
    title: 'Add Money',
    description: 'Top up from bKash, Rocket, Nagad',
    icon: PlusIcon,
    color: 'bg-green-500',
    action: 'add'
  },
  {
    id: 'send-money',
    title: 'Send Money',
    description: 'Transfer to any MFS instantly',
    icon: ArrowUpIcon,
    color: 'bg-blue-500',
    action: 'send'
  },
  {
    id: 'request-money',
    title: 'Request Money',
    description: 'Request payment from contacts',
    icon: ArrowDownIcon,
    color: 'bg-purple-500',
    action: 'request'
  },
  {
    id: 'pay-bills',
    title: 'Pay Bills',
    description: 'Electricity, water, internet',
    icon: BanknotesIcon,
    color: 'bg-orange-500',
    action: 'bills'
  },
  {
    id: 'qr-payment',
    title: 'QR Payment',
    description: 'Scan & pay with QR code',
    icon: QrCodeIcon,
    color: 'bg-indigo-500',
    action: 'qr'
  },
  {
    id: 'schedule',
    title: 'Schedule Payment',
    description: 'Set recurring transfers',
    icon: ClockIcon,
    color: 'bg-pink-500',
    action: 'schedule'
  }
]

const mfsProviders: MFSProvider[] = ['bkash', 'rocket', 'nagad', 'upay', 'tapp', 'mycash']

export default function QuickActions({}: QuickActionsProps) {
  const handleAction = (action: string) => {
    switch (action) {
      case 'request':
        console.log('Request money')
        break
      case 'bills':
        console.log('Pay bills')
        break
      case 'qr':
        console.log('QR payment')
        break
      case 'schedule':
        console.log('Schedule payment')
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        </div>
        
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {action.action === 'add' || action.action === 'send' ? (
                  <Link href={action.action === 'add' ? '/add-money' : '/send-money'} legacyBehavior>
                    <a className="group block w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-secondary-50 rounded-2xl border border-gray-200 hover:border-primary-200 transition-all duration-300 shadow-sm hover:shadow-lg dark:from-gray-800 dark:to-gray-850 dark:border-gray-700 dark:hover:border-primary-600">
                      <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <action.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900 text-base mb-2 group-hover:text-primary-600 transition-colors duration-200 dark:text-gray-100">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-200 dark:text-gray-400 dark:group-hover:text-gray-300">
                          {action.description}
                        </p>
                      </div>
                    </a>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleAction(action.action)}
                    className="group w-full text-left p-6 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-secondary-50 rounded-2xl border border-gray-200 hover:border-primary-200 transition-all duration-300 shadow-sm hover:shadow-lg dark:from-gray-800 dark:to-gray-850 dark:border-gray-700 dark:hover:border-primary-600"
                  >
                    <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 text-base mb-2 group-hover:text-primary-600 transition-colors duration-200 dark:text-gray-100">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-200 dark:text-gray-400 dark:group-hover:text-gray-300">
                        {action.description}
                      </p>
                    </div>
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Supported MFS Providers */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Supported MFS Providers</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-500 font-medium">All Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mfsProviders.map((provider, index) => (
            <motion.div
              key={provider}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 border border-gray-200 hover:border-primary-200 dark:from-gray-800 dark:to-gray-850 dark:border-gray-700 dark:hover:border-primary-600"
            >
              <div className={`w-12 h-12 ${getMFSProviderColor(provider)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-sm font-bold">
                  {getMFSProviderName(provider).charAt(0)}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm group-hover:text-primary-600 transition-colors duration-200 dark:text-gray-100">
                  {getMFSProviderName(provider)}
                </span>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transfer Benefits */}
      <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl shadow-xl border border-green-200 p-8 relative overflow-hidden dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-blue-100/20"></div>
        <div className="relative">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <ArrowUpIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Choose Probaho?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: "80% lower fees than cash-out method", icon: "💰" },
                  { text: "Instant transfers in seconds", icon: "⚡" },
                  { text: "Bank-grade security & custody", icon: "🔒" },
                  { text: "24/7 availability", icon: "🕐" }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl backdrop-blur-sm"
                  >
                    <span className="text-lg">{benefit.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
