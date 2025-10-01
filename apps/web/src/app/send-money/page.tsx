'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  UserIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import MFSLogo from '@/components/MFSLogo'
import { MFSProvider } from '@/types'
import { getMFSProviderName, getMFSProviderColor, formatCurrency, validateAmount, validatePhoneNumber } from '@/lib/utils'

const mfsProviders: MFSProvider[] = ['bkash', 'rocket', 'nagad', 'upay', 'tapp', 'mycash']

// Mock contacts for demonstration
const mockContacts = [
  { id: '1', name: 'Rahim Ahmed', phone: '01712345678', mfs: 'bkash' as MFSProvider },
  { id: '2', name: 'Fatima Begum', phone: '01823456789', mfs: 'rocket' as MFSProvider },
  { id: '3', name: 'Karim Uddin', phone: '01934567890', mfs: 'nagad' as MFSProvider },
  { id: '4', name: 'Ayesha Khan', phone: '01645678901', mfs: 'bkash' as MFSProvider },
  { id: '5', name: 'Mohammad Ali', phone: '01556789012', mfs: 'upay' as MFSProvider },
]

export default function SendMoneyPage() {
  const router = useRouter()
  const [step, setStep] = useState<'recipient' | 'amount' | 'confirm' | 'success'>('recipient')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [manualEntry, setManualEntry] = useState({
    phone: '',
    name: '',
    mfs: '' as MFSProvider | ''
  })
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isValidatingMfs, setIsValidatingMfs] = useState(false)
  const [mfsValidationResult, setMfsValidationResult] = useState<{
    isValid: boolean
    message: string
    verifiedMfs?: MFSProvider
  } | null>(null)

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  const handleContactSelect = async (contact: any) => {
    // Validate that the contact actually has the MFS they claim to have
    const isValid = await validateRecipientMfs(contact.phone, contact.mfs)
    
    if (isValid) {
      setSelectedContact(contact)
      setManualEntry({
        phone: contact.phone,
        name: contact.name,
        mfs: contact.mfs
      })
      setStep('amount')
    }
  }

  const validateRecipientMfs = async (phone: string, selectedMfs: MFSProvider) => {
    setIsValidatingMfs(true)
    setError('')
    setMfsValidationResult(null)

    try {
      // Simulate API call to check if recipient has the selected MFS
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock validation logic - in real app, this would check actual MFS APIs
      const mockValidationResults: Record<string, { hasMfs: MFSProvider[], message: string }> = {
        '01712345678': { hasMfs: ['bkash'], message: 'Recipient has bKash account' },
        '01823456789': { hasMfs: ['rocket'], message: 'Recipient has Rocket account' },
        '01934567890': { hasMfs: ['nagad'], message: 'Recipient has Nagad account' },
        '01645678901': { hasMfs: ['bkash', 'rocket'], message: 'Recipient has bKash and Rocket accounts' },
        '01556789012': { hasMfs: ['upay'], message: 'Recipient has Upay account' },
      }

      const validation = mockValidationResults[phone]
      
      if (!validation) {
        setMfsValidationResult({
          isValid: false,
          message: 'Recipient not found in MFS system. Please verify phone number.'
        })
        return false
      }

      if (validation.hasMfs.includes(selectedMfs)) {
        setMfsValidationResult({
          isValid: true,
          message: validation.message,
          verifiedMfs: selectedMfs
        })
        return true
      } else {
        setMfsValidationResult({
          isValid: false,
          message: `Recipient does not have ${getMFSProviderName(selectedMfs)} account. Available: ${validation.hasMfs.map(mfs => getMFSProviderName(mfs)).join(', ')}`
        })
        return false
      }
    } catch (err) {
      setMfsValidationResult({
        isValid: false,
        message: 'Failed to validate recipient MFS. Please try again.'
      })
      return false
    } finally {
      setIsValidatingMfs(false)
    }
  }

  const handleManualEntry = async () => {
    if (!manualEntry.phone || !manualEntry.name || !manualEntry.mfs) {
      setError('Please fill in all fields')
      return
    }
    if (!validatePhoneNumber(manualEntry.phone)) {
      setError('Please enter a valid phone number')
      return
    }

    // Validate recipient's MFS
    const isValid = await validateRecipientMfs(manualEntry.phone, manualEntry.mfs)
    
    if (isValid) {
      setSelectedContact({
        id: 'manual',
        name: manualEntry.name,
        phone: manualEntry.phone,
        mfs: manualEntry.mfs
      })
      setStep('amount')
    }
  }

  const handleAmountSubmit = () => {
    if (!validateAmount(Number(amount))) {
      setError('Please enter a valid amount (1-100,000 BDT)')
      return
    }
    setStep('confirm')
  }

  const handleTransfer = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call for transfer
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success
      setStep('success')
    } catch (err) {
      setError('Transfer failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateFee = () => {
    return 20 // Fixed fee of 20 taka for all transactions
  }

  const getTotalAmount = () => {
    return Number(amount) + calculateFee()
  }

  const handleSuccess = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Send Money</h1>
                <p className="text-sm text-gray-500">
                  {step === 'recipient' && 'Select recipient'}
                  {step === 'amount' && 'Enter amount'}
                  {step === 'confirm' && 'Confirm transfer'}
                  {step === 'success' && 'Transfer complete'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select Recipient */}
        {step === 'recipient' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Recipient</h2>
              
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or phone number"
                  className="input-primary pl-10"
                />
              </div>

              {/* Contacts List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    disabled={isValidatingMfs}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MFSLogo provider={contact.mfs} size="sm" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Validation Status */}
              {isValidatingMfs && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-600 text-sm">Validating recipient MFS account...</p>
                  </div>
                </motion.div>
              )}

              {/* MFS Validation Result for Contacts */}
              {mfsValidationResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg p-3 mt-4 ${
                    mfsValidationResult.isValid 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {mfsValidationResult.isValid ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    )}
                    <p className={`text-sm ${
                      mfsValidationResult.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {mfsValidationResult.message}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Manual Entry */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Or Enter Manually</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={manualEntry.name}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter recipient name"
                    className="input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={manualEntry.phone}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                    className="input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MFS Provider
                  </label>
                  <select
                    value={manualEntry.mfs}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, mfs: e.target.value as MFSProvider }))}
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

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* MFS Validation Result */}
                {mfsValidationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-3 ${
                      mfsValidationResult.isValid 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {mfsValidationResult.isValid ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                      )}
                      <p className={`text-sm ${
                        mfsValidationResult.isValid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {mfsValidationResult.message}
                      </p>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={handleManualEntry}
                  disabled={!manualEntry.name || !manualEntry.phone || !manualEntry.mfs || isValidatingMfs}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {isValidatingMfs ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Validating MFS...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 'amount' && selectedContact && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Recipient Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                  <p className="text-gray-500">{selectedContact.phone}</p>
                  <div className="mt-1">
                    <MFSLogo provider={selectedContact.mfs} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Entry */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Amount</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (BDT)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="input-primary pl-10 text-lg"
                      min="1"
                      max="100000"
                    />
                  </div>
                  {amount && (
                    <div className="mt-2 text-sm text-gray-500">
                      Fee: {formatCurrency(calculateFee())} | 
                      Total: {formatCurrency(getTotalAmount())}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note for this transfer"
                    className="input-primary resize-none"
                    rows={3}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
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
                    disabled={!amount}
                    className="btn-primary flex-1"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm Transfer */}
        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Confirm Transfer</h3>
              
              {/* Transfer Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedContact?.name}</p>
                    <p className="text-gray-500">{selectedContact?.phone}</p>
                    <div className="mt-1">
                      <MFSLogo provider={selectedContact?.mfs} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold">{formatCurrency(Number(amount))}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Transfer Fee</span>
                    <span className="font-semibold">{formatCurrency(calculateFee())}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(getTotalAmount())}</span>
                  </div>
                </div>

                {note && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> {note}
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('amount')}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={isLoading}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Money</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transfer Successful!
              </h3>
              <p className="text-gray-600 mb-4">
                {formatCurrency(Number(amount))} has been sent to {selectedContact?.name}
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">TXN{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Time</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSuccess}
                  className="btn-primary flex-1"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => {
                    setStep('recipient')
                    setSelectedContact(null)
                    setAmount('')
                    setNote('')
                    setError('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Send More
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
