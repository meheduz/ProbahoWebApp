"use client";
import { useState } from "react";
import { z } from "zod";
import { storage } from "../../lib/storage";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import MFSLogo from '@/components/MFSLogo';

const mfsLimits = {
  bkash: { min: 10, max: 50000, daily: 100000, prefix: '01', length: 11 },
  nagad: { min: 10, max: 40000, daily: 80000, prefix: '01', length: 11 },
  rocket: { min: 10, max: 30000, daily: 60000, prefix: '018', length: 11 },
  upay: { min: 10, max: 25000, daily: 50000, prefix: '01', length: 11 }
} as const;

const mfsOptions = [
  { 
    id: 'bkash' as const,
    name: 'bKash',
    color: 'bg-pink-50 hover:bg-pink-100',
    selectedColor: 'bg-pink-100',
    borderColor: 'border-pink-500'
  },
  { 
    id: 'nagad' as const,
    name: 'Nagad',
    color: 'bg-orange-50 hover:bg-orange-100',
    selectedColor: 'bg-orange-100',
    borderColor: 'border-orange-500'
  },
  { 
    id: 'rocket' as const,
    name: 'Rocket',
    color: 'bg-blue-50 hover:bg-blue-100',
    selectedColor: 'bg-blue-100',
    borderColor: 'border-blue-500'
  },
  { 
    id: 'upay' as const,
    name: 'Upay',
    color: 'bg-purple-50 hover:bg-purple-100',
    selectedColor: 'bg-purple-100',
    borderColor: 'border-purple-500'
  }
];

const generateTxnId = () => {
  return `TXN${Date.now()}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
};

const AddMoneyPage = () => {
  const [step, setStep] = useState<'method' | 'details' | 'confirm'>('method');
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedMfs, setSelectedMfs] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [txnId, setTxnId] = useState<string>("");
  const router = useRouter();

  const validateStep = (currentStep: 'method' | 'details' | 'confirm') => {
    setError("");

    if (currentStep === 'method') {
      if (!selectedMfs) {
        setError("Please select a payment method");
        return false;
      }
      return true;
    }

    if (currentStep === 'details') {
      const numAmount = Number(amount);
      const limits = mfsLimits[selectedMfs as keyof typeof mfsLimits];
      
      if (!amount || isNaN(numAmount)) {
        setError("Please enter a valid amount");
        return false;
      }

      if (numAmount < limits.min) {
        setError(`Minimum amount is ${limits.min} BDT`);
        return false;
      }

      if (numAmount > limits.max) {
        setError(`Maximum amount is ${limits.max.toLocaleString()} BDT`);
        return false;
      }

      if (!account) {
        setError(`Please enter your ${selectedMfs} account number`);
        return false;
      }

      if (!account.startsWith(limits.prefix)) {
        setError(`${selectedMfs} number should start with ${limits.prefix}`);
        return false;
      }

      if (account.length !== limits.length) {
        setError(`${selectedMfs} number should be ${limits.length} digits`);
        return false;
      }

      return true;
    }

    if (currentStep === 'confirm') {
      if (!otp || otp.length !== 6) {
        setError("Please enter the 6-digit OTP");
        return false;
      }
      return true;
    }

    return false;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 'method') {
        setStep('details');
      } else if (step === 'details') {
        // Generate transaction ID and simulate OTP send
        const newTxnId = generateTxnId();
        setTxnId(newTxnId);
        setStep('confirm');
        // Simulate OTP send
        console.log(`OTP sent to ${account} for transaction ${newTxnId}`);
      }
    }
  };

  const handleTopup = () => {
    try {
      if (!validateStep('confirm')) {
        return;
      }

      setLoading(true);
      const numAmount = Number(amount);
      
      // Get current daily stats to check limits
      const dailyStats = storage.getDailyStats();
      const limits = mfsLimits[selectedMfs as keyof typeof mfsLimits];
      
      if (dailyStats.received + numAmount > limits.daily) {
        setError(`Daily deposit limit (${limits.daily.toLocaleString()} BDT) exceeded for ${selectedMfs}`);
        setLoading(false);
        return;
      }

      // Simulate API call delay
      const timer = setTimeout(() => {
              const timer = setTimeout(() => {
        try {
          // Create a transaction record and update wallet
          storage.addTransaction({
            userId: '1', // In a real app, this would come from auth
            type: 'credit',
            amount: numAmount,
            currency: 'BDT',
            status: 'success',
            description: `Added money from ${mfsOptions.find(m => m.id === selectedMfs)?.name}`,
            mfsProvider: selectedMfs,
            account: account,
            note: `TxnID: ${txnId}`
          });

          // Reset form and redirect
          setAmount("");
          setError("");
          setSelectedMfs("");
          setAccount("");
          setOtp("");
          setTxnId("");
          router.push('/');
        } catch (err) {
          console.error('Transaction failed:', err);
          setError("Transaction failed. Please try again.");
        } finally {
          setLoading(false);
        }
      }, 1500);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMethodStep = () => (
    <div>
      <h2 className="text-lg font-medium text-gray-700 mb-4">Select Payment Method</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {mfsOptions.map((mfs) => (
          <button
            key={mfs.id}
            onClick={() => {
              setError("");
              setSelectedMfs(mfs.id);
            }}
            disabled={loading}
            className={`relative flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200
              ${selectedMfs === mfs.id 
                ? mfs.selectedColor + ' ' + mfs.borderColor
                : 'border-gray-200 ' + mfs.color
              }
            `}
          >
            <div className="text-center">
              <MFSLogo provider={mfs.id} className="mx-auto mb-2" />
              <span className="block text-sm font-medium text-gray-700">
                {mfs.name}
              </span>
            </div>
            {selectedMfs === mfs.id && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => setStep('method')}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-700">Enter Payment Details</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
            {selectedMfs?.toUpperCase()} Account Number
          </label>
          <input
            type="tel"
            id="account"
            value={account}
            onChange={(e) => {
              setError("");
              setAccount(e.target.value.replace(/\D/g, ''));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter your ${selectedMfs} number`}
            maxLength={11}
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Format: {mfsLimits[selectedMfs as keyof typeof mfsLimits].prefix}XXXXXXXX
          </p>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (BDT)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => {
              setError("");
              setAmount(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            min={mfsLimits[selectedMfs as keyof typeof mfsLimits].min}
            max={mfsLimits[selectedMfs as keyof typeof mfsLimits].max}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => setStep('details')}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-700">Confirm Payment</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-medium">{txnId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Method</span>
            <span className="font-medium">{mfsOptions.find(m => m.id === selectedMfs)?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account</span>
            <span className="font-medium">{account}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">{Number(amount).toLocaleString()} BDT</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
          Enter OTP
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => {
            setError("");
            setOtp(e.target.value.replace(/\D/g, ''));
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          disabled={loading}
        />
        <p className="mt-1 text-sm text-gray-500">
          Please enter the OTP sent to your {selectedMfs} account
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add Money to Wallet</h1>
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Step Progress */}
        <div className="flex items-center mb-8">
          {(['method', 'details', 'confirm'] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full 
                ${step === s 
                  ? 'bg-blue-600 text-white' 
                  : step > s 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
              `}>
                {step > s ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div className={`w-full h-1 mx-2 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 'method' && renderMethodStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'confirm' && renderConfirmStep()}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {step === 'confirm' ? (
            <button
              onClick={handleTopup}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-200
                ${!selectedMfs 
                  ? 'bg-gray-300 cursor-not-allowed'
                  : loading 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }
              `}
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
          )}
          
          <button
            onClick={() => router.push('/')}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {/* Important Notes */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Important Notes:</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            {selectedMfs ? (
              <>
                <li>Selected Provider: {mfsOptions.find(m => m.id === selectedMfs)?.name}</li>
                <li>Minimum amount: {mfsLimits[selectedMfs as keyof typeof mfsLimits].min.toLocaleString()} BDT</li>
                <li>Maximum amount: {mfsLimits[selectedMfs as keyof typeof mfsLimits].max.toLocaleString()} BDT</li>
                <li>Daily deposit limit: {mfsLimits[selectedMfs as keyof typeof mfsLimits].daily.toLocaleString()} BDT</li>
              </>
            ) : (
              <li>Please select a payment method to see limits</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyPage;