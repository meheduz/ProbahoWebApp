'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { AddMoneyRequest, MFSProvider } from '@/types'
import { formatCurrency, validateAmount, validatePhoneNumber, getMFSProviderName, getMFSProviderColor } from '@/lib/utils'

interface AddMoneyModalProps {
  onClose: () => void
}

const mfsProviders: MFSProvider[] = ['bkash', 'rocket', 'nagad', 'upay', 'tapp', 'mycash']

export default function AddMoneyModal({ onClose }: AddMoneyModalProps) {
  const [step, setStep] = useState<'select' | 'amount' | 'verify' | 'success'>('select')
  const [selectedMfs, setSelectedMfs] = useState<MFSProvider | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMfsSelect = (provider: MFSProvider) => {
    setSelectedMfs(provider)
    setStep('amount')
  }

  const handleAmountSubmit = () => {
    if (!validateAmount(Number(amount))) {
      setError('Please enter a valid amount (1-100,000 BDT)')
      return
    }
    setStep('verify')
  }

  const handleVerification = async () => {
    if (!pin || pin.length < 4) {
      setError('Please enter a valid PIN')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success
      setStep('success')
    } catch (err) {
      setError('Failed to add money. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    onClose()
    // Reset form
    setStep('select')
    setSelectedMfs(null)
    setPhoneNumber('')
    setAmount('')
    setPin('')
    setOtp('')
    setError('')
  }

  const calculateFee = () => {
    const amountNum = Number(amount)
    if (amountNum <= 1000) return 5
    if (amountNum <= 5000) return 10
    if (amountNum <= 10000) return 15
    return 20
  }

  const getTotalAmount = () => {
    return Number(amount) + calculateFee()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:text-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 'select' && 'Select MFS Provider'}
              {step === 'amount' && 'Enter Amount'}
              {step === 'verify' && 'Verify Transaction'}
              {step === 'success' && 'Success!'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Select MFS Provider */}
            {step === 'select' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-600 mb-6">
                  Choose your mobile financial service provider to add money to your Probaho wallet.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {mfsProviders.map((provider) => (
                    <button
                      key={provider}
                      onClick={() => handleMfsSelect(provider)}
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-gray-800"
                    >
                      <div className={`w-10 h-10 ${getMFSProviderColor(provider)} rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {getMFSProviderName(provider).charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {getMFSProviderName(provider)}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Enter Amount */}
            {step === 'amount' && selectedMfs && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                  <div className={`w-10 h-10 ${getMFSProviderColor(selectedMfs)} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">
                      {getMFSProviderName(selectedMfs).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Adding from {getMFSProviderName(selectedMfs)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {phoneNumber || 'Enter your phone number'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (BDT)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="input-primary text-lg"
                    min="1"
                    max="100000"
                  />
                  {amount && (
                    <div className="mt-2 text-sm text-gray-500">
                      Fee: {formatCurrency(calculateFee())} | 
                      Total: {formatCurrency(getTotalAmount())}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950/30 dark:border-blue-900">
                  <div className="flex items-start space-x-2">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">How it works:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Enter your {getMFSProviderName(selectedMfs)} PIN to authorize</li>
                        <li>• Money will be transferred to your Probaho wallet</li>
                        <li>• You can then send to any MFS instantly</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('select')}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleAmountSubmit}
                    disabled={!phoneNumber || !amount || !validatePhoneNumber(phoneNumber)}
                    className="btn-primary flex-1"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Verify Transaction */}
            {step === 'verify' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-600">P</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verify Transaction
                  </h3>
                  <p className="text-gray-600">
                    Enter your {getMFSProviderName(selectedMfs!)} PIN to complete the transaction
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold">{formatCurrency(Number(amount))}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Fee</span>
                    <span className="font-semibold">{formatCurrency(calculateFee())}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(getTotalAmount())}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getMFSProviderName(selectedMfs!)} PIN
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-6 digit PIN"
                    className="input-primary text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('amount')}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerification}
                    disabled={!pin || isLoading}
                    className="btn-primary flex-1"
                  >
                    {isLoading ? 'Processing...' : 'Add Money'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Money Added Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {formatCurrency(Number(amount))} has been added to your Probaho wallet
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">New Balance</span>
                      <span className="font-bold text-green-600 text-lg">
                        {formatCurrency(15750.50 + Number(amount))}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSuccess}
                  className="btn-primary w-full"
                >
                  Done
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
