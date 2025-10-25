'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PaperAirplaneIcon, PlusIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useSmartFeatures } from '@/hooks/useSmartFeatures'
import { useResponsive } from '@/hooks/useResponsive'
import { formatCurrency } from '@/lib/utils'

export default function SmartQuickActions() {
  const { quickSend, frequentAmounts, smartSuggestions } = useSmartFeatures()
  const { isMobile } = useResponsive()

  const actions = [
    {
      icon: PaperAirplaneIcon,
      label: 'Send Money',
      href: '/send-money',
      color: 'bg-blue-500 hover:bg-blue-600',
      smart: quickSend.length > 0 ? `${quickSend.length} frequent contacts` : null
    },
    {
      icon: PlusIcon,
      label: 'Add Money',
      href: '/add-money',
      color: 'bg-green-500 hover:bg-green-600',
      smart: null
    },
    {
      icon: ClockIcon,
      label: 'History',
      href: '/history',
      color: 'bg-purple-500 hover:bg-purple-600',
      smart: null
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`${action.color} text-white p-6 rounded-3xl shadow-2xl transition-all duration-300 block relative overflow-hidden group cursor-pointer`}
            >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3">
                <action.icon className="h-8 w-8" />
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{action.label}</h3>
                  {action.smart && (
                    <p className="text-sm opacity-90 mt-1">{action.smart}</p>
                  )}
                </div>
              </div>
            </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-3">
            <SparklesIcon className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Smart Suggestions</h3>
          </div>
          <div className="space-y-2">
            {smartSuggestions.map((suggestion, index) => (
              <div key={index} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Frequent Amounts */}
      {frequentAmounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">Quick Amounts</h3>
          <div className="flex flex-wrap gap-2">
            {frequentAmounts.slice(0, isMobile ? 3 : 5).map((amount, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}