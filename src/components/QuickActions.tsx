'use client'

import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ClockIcon,
  QrCodeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import { MFSProvider, getMFSProviderName, getMFSProviderColor } from '@/types'

interface QuickActionsProps {
  onAddMoney: () => void
  onSendMoney: () => void
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

export default function QuickActions({ onAddMoney, onSendMoney }: QuickActionsProps) {
  const handleAction = (action: string) => {
    switch (action) {
      case 'add':
        onAddMoney()
        break
      case 'send':
        onSendMoney()
        break
      case 'request':
        // TODO: Implement request money
        console.log('Request money')
        break
      case 'bills':
        // TODO: Implement bill payment
        console.log('Pay bills')
        break
      case 'qr':
        // TODO: Implement QR payment
        console.log('QR payment')
        break
      case 'schedule':
        // TODO: Implement scheduled payments
        console.log('Schedule payment')
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction(action.action)}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 leading-tight">
                  {action.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Supported MFS Providers */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Supported MFS Providers</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {mfsProviders.map((provider, index) => (
            <motion.div
              key={provider}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className={`w-8 h-8 ${getMFSProviderColor(provider)} rounded-full flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">
                  {getMFSProviderName(provider).charAt(0)}
                </span>
              </div>
              <span className="font-medium text-gray-900 text-sm">
                {getMFSProviderName(provider)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transfer Benefits */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ArrowUpIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Why Choose Probaho?
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>80% lower fees than cash-out method</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Instant transfers in seconds</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Bank-grade security & custody</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>24/7 availability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
