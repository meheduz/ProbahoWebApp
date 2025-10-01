 'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  WalletIcon, 
  ArrowsRightLeftIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/Header'
const WalletBalance = dynamic(() => import('@/components/WalletBalance'), {
  ssr: false,
  loading: () => <div className="h-40 bg-white/50 rounded-lg animate-pulse" />,
})
const QuickActions = dynamic(() => import('@/components/QuickActions'), {
  ssr: false,
  loading: () => <div className="h-40 bg-white/50 rounded-lg animate-pulse" />,
})
const RecentTransactions = dynamic(() => import('@/components/RecentTransactions'), {
  ssr: false,
  loading: () => <div className="h-40 bg-white/50 rounded-lg animate-pulse" />,
})
import ProtectedRoute from '@/components/ProtectedRoute'

export default function HomePage() {
  const features = [
    {
      icon: WalletIcon,
      title: 'Unified Wallet',
      description: 'Consolidate all your MFS balances in one secure place'
    },
    {
      icon: ArrowsRightLeftIcon,
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
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-800/20 to-secondary-800/20"></div>
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center space-x-3 mb-8"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                    <span className="text-white font-bold text-2xl">P</span>
                  </div>
                  <span className="text-4xl font-bold">Probaho</span>
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Your Money, Your Control
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                  The unified wallet that breaks down barriers between mobile financial services in Bangladesh. 
                  <span className="block mt-2 text-lg text-blue-200">
                    Send money to any MFS instantly, save 80% on fees, and enjoy bank-grade security.
                  </span>
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link href="/add-money" prefetch={true}>
                    <motion.a
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-primary-600 hover:bg-gray-50 text-lg px-6 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 inline-flex items-center justify-center w-full sm:w-auto"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Get Started</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </span>
                    </motion.a>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-white/50 text-white hover:bg-white hover:text-primary-600 text-lg px-6 py-4 rounded-2xl font-semibold backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 left-20 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
          />
        </section>

        {/* Wallet Dashboard */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Probaho Dashboard
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Manage your unified wallet, send money instantly, and track all your transactions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Wallet Balance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <WalletBalance />
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <QuickActions />
              </motion.div>
            </div>
            
            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12"
            >
              <RecentTransactions />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Probaho?
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We're solving the fragmentation problem in Bangladesh's mobile financial services ecosystem
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-10 h-10 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-800/20 to-secondary-800/20"></div>
            <div className="absolute inset-0 opacity-60">
              <div className="absolute inset-0 bg-gradient-to-r from-white/3 to-transparent"></div>
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Numbers Don't Lie
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Bangladesh's mobile financial services landscape in numbers
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: "130M+", label: "Registered MFS Users", icon: "👥" },
                { value: "84.7%", label: "Users Face Transfer Problems", icon: "😤" },
                { value: "6-12%", label: "Current Transfer Fees", icon: "💸" },
                { value: "~1.5%", label: "Probaho Transfer Fee", icon: "💰" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-blue-200 font-medium leading-relaxed">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  )
}