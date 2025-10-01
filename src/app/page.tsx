'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  WalletIcon, 
  ArrowRightLeftIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/Header'
import WalletBalance from '@/components/WalletBalance'
import QuickActions from '@/components/QuickActions'
import RecentTransactions from '@/components/RecentTransactions'
import AddMoneyModal from '@/components/AddMoneyModal'
import SendMoneyModal from '@/components/SendMoneyModal'

export default function HomePage() {
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false)

  const features = [
    {
      icon: WalletIcon,
      title: 'Unified Wallet',
      description: 'Consolidate all your MFS balances in one secure place'
    },
    {
      icon: ArrowRightLeftIcon,
      title: 'Instant Transfers',
      description: 'Send money to any MFS in seconds, not hours'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Bank-Grade Security',
      description: 'Your funds are protected by partner bank custody'
    },
    {
      icon: ClockIcon,
      title: '24/7 Available',
      description: 'Access your money anytime, anywhere'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Low Fees',
      description: 'Save 80% compared to traditional cash-out methods'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'All MFS Support',
      description: 'Works with bKash, Rocket, Nagad and more'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Money, Your Control
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                The unified wallet that breaks down barriers between mobile financial services in Bangladesh
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddMoneyModal(true)}
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wallet Dashboard */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wallet Balance */}
            <div className="lg:col-span-1">
              <WalletBalance />
            </div>
            
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <QuickActions 
                onAddMoney={() => setShowAddMoneyModal(true)}
                onSendMoney={() => setShowSendMoneyModal(true)}
              />
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="mt-12">
            <RecentTransactions />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Probaho?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're solving the fragmentation problem in Bangladesh's mobile financial services ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">130M+</div>
              <div className="text-blue-200">Registered MFS Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">84.7%</div>
              <div className="text-blue-200">Users Face Transfer Problems</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6-12%</div>
              <div className="text-blue-200">Current Transfer Fees</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">~1.5%</div>
              <div className="text-blue-200">Probaho Transfer Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showAddMoneyModal && (
        <AddMoneyModal onClose={() => setShowAddMoneyModal(false)} />
      )}
      
      {showSendMoneyModal && (
        <SendMoneyModal onClose={() => setShowSendMoneyModal(false)} />
      )}
    </div>
  )
}
