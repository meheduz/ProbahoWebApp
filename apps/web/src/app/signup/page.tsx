'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  UserCircleIcon,
  LockClosedIcon,
  PhoneIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<'info' | 'kyc' | 'verify' | 'pin' | 'success'>('info')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    confirmPin: '',
    nidNumber: '',
    address: '',
    occupation: ''
  })
  const [otp, setOtp] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
    setError('')
  }

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      setError('Name and Phone Number are required.')
      return
    }
    setError('')
    setStep('kyc')
  }

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nidNumber || !formData.address || !formData.occupation) {
      setError('All KYC fields are required.')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStep('verify')
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (otp === '1234') { // Demo OTP
        setStep('pin')
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError('OTP verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match')
      setIsLoading(false)
      return
    }

    if (formData.pin.length < 4) {
      setError('PIN must be at least 4 digits')
      setIsLoading(false)
      return
    }

    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const userData = {
        id: '1',
        phone: formData.phone,
        name: formData.name,
        email: formData.email
      }
      
      login(userData, 'mock_jwt_token')
      setStep('success')
    } catch (err) {
      setError('Account creation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center space-x-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">Probaho</span>
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'info' && 'Create Account'}
            {step === 'kyc' && 'KYC Verification'}
            {step === 'verify' && 'Verify Phone'}
            {step === 'pin' && 'Set PIN'}
            {step === 'success' && 'Welcome!'}
          </h1>
          <p className="text-gray-600">
            {step === 'info' && 'Join Probaho and unify your MFS experience'}
            {step === 'kyc' && 'Complete KYC verification as required by Bangladesh Bank'}
            {step === 'verify' && 'Enter the OTP sent to your phone'}
            {step === 'pin' && 'Create a secure PIN for your account'}
            {step === 'success' && 'Your account has been created successfully'}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Step 1: Personal Information */}
          {step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="input-primary pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01XXXXXXXXX"
                    className="input-primary pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="input-primary"
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

              <button
                type="submit"
                disabled={isLoading || !formData.name || !formData.phone}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: KYC Verification */}
          {step === 'kyc' && (
            <form onSubmit={handleKycSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">ℹ️</span>
                  </div>
                  <h3 className="font-semibold text-blue-900">KYC Requirements</h3>
                </div>
                <p className="text-sm text-blue-800">
                  As per Bangladesh Bank regulations, all financial service users must complete KYC verification.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NID/Passport Number
                </label>
                <input
                  type="text"
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your NID or Passport number"
                  className="input-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your complete address"
                  className="input-primary h-20 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input-primary"
                  required
                >
                  <option value="">Select your occupation</option>
                  <option value="student">Student</option>
                  <option value="employee">Employee</option>
                  <option value="business">Business Owner</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="retired">Retired</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Required Documents:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Valid NID/Passport copy (front & back)</li>
                  <li>• Recent photograph</li>
                  <li>• Proof of address (utility bill, bank statement)</li>
                  <li>• Income proof (salary certificate, business license)</li>
                </ul>
                <p className="text-xs text-yellow-700 mt-2">
                  Documents will be verified after account creation.
                </p>
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

              <button
                type="submit"
                disabled={isLoading || !formData.nidNumber || !formData.address || !formData.occupation}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Phone Verification</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('info')}
                className="btn-secondary w-full"
              >
                Back to Personal Info
              </button>
            </form>
          )}

          {/* Step 3: OTP Verification */}
          {step === 'verify' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhoneIcon className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  We've sent a 4-digit code to <strong>{formData.phone}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="1234"
                  className="input-primary text-center text-lg tracking-widest"
                  maxLength={4}
                  required
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

              <button
                type="submit"
                disabled={isLoading || !otp}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Resend OTP
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep('kyc')}
                className="btn-secondary w-full"
              >
                Back to KYC
              </button>
            </form>
          )}

          {/* Step 4: Set PIN */}
          {step === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LockClosedIcon className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  Create a secure PIN for your Probaho account
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPin ? 'text' : 'password'}
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    placeholder="Enter 4-6 digit PIN"
                    className="input-primary pl-10 pr-10"
                    maxLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPin ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    name="confirmPin"
                    value={formData.confirmPin}
                    onChange={handleInputChange}
                    placeholder="Confirm your PIN"
                    className="input-primary pl-10 pr-10"
                    maxLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPin ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
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

              <button
                type="submit"
                disabled={isLoading || !formData.pin || !formData.confirmPin}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Created Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Welcome to Probaho, {formData.name}! Your account is ready to use.
                </p>
              </div>

              <button
                onClick={handleSuccess}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {/* Back to Login */}
          {step !== 'success' && (
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Already have an account? Sign in
              </Link>
            </div>
          )}
        </motion.div>

        {/* Demo Info */}
        {step === 'verify' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 className="font-medium text-blue-900 mb-2">Demo OTP:</h3>
            <p className="text-sm text-blue-800">Use <strong>1234</strong> as the OTP</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
