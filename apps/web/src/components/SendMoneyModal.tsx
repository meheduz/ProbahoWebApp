'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, InformationCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { SendMoneyRequest, MFSProvider } from '@/types'
import { formatCurrency, validateAmount, validatePhoneNumber, getMFSProviderName, getMFSProviderColor, calculateTransferFee } from '@/lib/utils'

interface SendMoneyModalProps {
  onClose: () => void
}

const mfsProviders: MFSProvider[] = ['bkash', 'rocket', 'nagad', 'upay', 'tapp', 'mycash']

const recentContacts = [
  { name: 'Ahmed Khan', phone: '+8801712345678', mfs: 'bkash' as MFSProvider },
  { name: 'Fatima Begum', phone: '+8801812345678', mfs: 'rocket' as MFSProvider },
  { name: 'Rahim Ali', phone: '+8801912345678', mfs: 'nagad' as MFSProvider },
  { name: 'Salma Akter', phone: '+8801612345678', mfs: 'bkash' as MFSProvider },
]

export default function SendMoneyModal({ onClose }: SendMoneyModalProps) {
  const [step, setStep] = useState<'recipient' | 'amount' | 'verify' | 'success'>('recipient')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [selectedMfs, setSelectedMfs] = useState<MFSProvider | null>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContacts = recentContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  const handleContactSelect = (contact: typeof recentContacts[0]) => {
    setRecipientPhone(contact.phone)
    setRecipientName(contact.name)
    setSelectedMfs(contact.mfs)
    setStep('amount')
  }

  const handleManualEntry = () => {
    setStep('amount')
  }

  const handleAmountSubmit = () => {
    if (!validateAmount(Number(amount))) {
      setError('Please enter a valid amount (1-100,000 BDT)')
      return
    }
    if (!selectedMfs) {
      setError('Please select recipient MFS provider')
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
      setError('Failed to send money. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    onClose()
    // Reset form
    setStep('recipient')
    setRecipientPhone('')
    setRecipientName('')
    setSelectedMfs(null)
    setAmount('')
    setDescription('')
    setPin('')
    setError('')
    setSearchQuery('')
  }

  const calculateFee = () => {
    const amountNum = Number(amount)
    return calculateTransferFee(amountNum)
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
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 'recipient' && 'Send Money'}
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
            {/* Step 1: Select Recipient */}
            {step === 'recipient' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-600 mb-6">
                  Choose a recent contact or enter recipient details manually.
                </p>

                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contacts..."
                    className="input-primary pl-10"
                  />
                </div>

                {/* Recent Contacts */}
                {filteredContacts.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Recent Contacts</h3>
                    <div className="space-y-2">
                      {filteredContacts.map((contact, index) => (
                        <motion.button
                          key={contact.phone}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleContactSelect(contact)}
                          className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                        >
                          <div className={`w-10 h-10 ${getMFSProviderColor(contact.mfs)} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">
                              {getMFSProviderName(contact.mfs).charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.phone}</p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {getMFSProviderName(contact.mfs)}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual Entry */}
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={handleManualEntry}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="text-primary-600 font-medium mb-1">Enter Details Manually</div>
                      <div className="text-sm text-gray-500">Add new recipient</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Enter Amount */}
            {step === 'amount' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Recipient Info */}
                {(recipientName || recipientPhone) && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 ${selectedMfs ? getMFSProviderColor(selectedMfs) : 'bg-gray-400'} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {selectedMfs ? getMFSProviderName(selectedMfs).charAt(0) : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {recipientName || 'Unknown Recipient'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {recipientPhone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recipient Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Phone Number
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient MFS Provider
                  </label>
                  <select
                    value={selectedMfs || ''}
                    onChange={(e) => setSelectedMfs(e.target.value as MFSProvider)}
                    className="input-primary"
                  >
                    <option value="">Select MFS Provider</option>
                    {mfsProviders.map((provider) => (
                      <option key={provider} value={provider}>
                        {getMFSProviderName(provider)}
                      </option>
                    ))}
                  </select>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this for?"
                    className="input-primary"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Transfer Benefits:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Only 1.5% fee (vs 6-12% cash-out)</li>
                        <li>• Instant delivery to recipient's MFS</li>
                        <li>• No need for recipient to have Probaho</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('recipient')}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleAmountSubmit}
                    disabled={!recipientPhone || !amount || !selectedMfs || !validatePhoneNumber(recipientPhone)}
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
                    Enter your Probaho PIN to complete the transfer
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Recipient</span>
                    <span className="font-semibold">{recipientPhone}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">MFS Provider</span>
                    <span className="font-semibold">{getMFSProviderName(selectedMfs!)}</span>
                  </div>
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
                    Probaho PIN
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
                    {isLoading ? 'Sending...' : 'Send Money'}
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
                    Money Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {formatCurrency(Number(amount))} has been sent to {recipientPhone}
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipient:</span>
                        <span className="font-medium">{recipientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">MFS Provider:</span>
                        <span className="font-medium">{getMFSProviderName(selectedMfs!)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium">TXN_123456789</span>
                      </div>
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
