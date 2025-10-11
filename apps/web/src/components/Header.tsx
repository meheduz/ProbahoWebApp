 'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import ThemeToggle from '@/components/ThemeToggle'
import { 
  Bars3Icon, 
  XMarkIcon, 
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Send Money', href: '/send-money' },
    { name: 'Add Money', href: '/add-money' },
    { name: 'History', href: '/history' },
    { name: 'Help', href: '/help' },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
              <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Probaho</span>
            </motion.div>
          </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-2">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} prefetch={true} legacyBehavior>
                    <a className="text-gray-700 hover:text-primary-600 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-primary-50 transition-all duration-200">
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 dark:hover:bg-gray-800"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.name || 'Guest User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.phone || '+880 1XXX XXX XXX'}
                  </p>
                </div>
              </button>

              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 dark:bg-gray-900 dark:border-gray-800"
                >
                  <Link href="/profile" legacyBehavior>
                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                    <UserCircleIcon className="h-4 w-4 mr-3" />
                    Profile
                    </a>
                  </Link>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-3" />
                    Settings
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      logout()
                      setIsProfileOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-500"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800"
        >
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
                  <Link key={item.name} href={item.href} legacyBehavior>
                    <a
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200 dark:text-gray-200 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  )
}
