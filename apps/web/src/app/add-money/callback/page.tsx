'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddMoneyCallback() {
  const router = useRouter()
  const [message, setMessage] = useState('Processing payment...')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const provider = params.get('provider') || 'unknown'
    const status = params.get('status') || 'failed'
    const amount = Number(params.get('amount') || '0')
    const tx = params.get('tx') || `TXN_${Date.now()}`

    // Simulate saving the top-up record in localStorage
    try {
      const historyJson = localStorage.getItem('probaho_topups')
      const history = historyJson ? JSON.parse(historyJson) : []
      history.unshift({ id: tx, provider, amount, status, createdAt: new Date().toISOString() })
      localStorage.setItem('probaho_topups', JSON.stringify(history))

      setMessage('Payment processed successfully! Redirecting...')

      setTimeout(() => {
        // Redirect back to history or wallet
        router.push('/history')
      }, 1500)
    } catch (err) {
      setMessage('Failed to save payment. Please contact support.')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">{message}</h2>
        <p className="text-sm text-gray-500">This simulates the gateway callback flow for development.</p>
      </div>
    </div>
  )
}
