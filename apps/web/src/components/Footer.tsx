'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white/70 backdrop-blur dark:bg-gray-900/70 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Probaho</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              Unified wallet for seamless cross-MFS transfers in Bangladesh.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">Dashboard</Link></li>
              <li><Link href="/send-money" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">Send Money</Link></li>
              <li><Link href="/add-money" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">Add Money</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">Terms</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Probaho. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 space-x-4 text-xs text-gray-500">
            <a href="#" className="hover:text-primary-600">Status</a>
            <a href="#" className="hover:text-primary-600">Docs</a>
            <a href="#" className="hover:text-primary-600">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
