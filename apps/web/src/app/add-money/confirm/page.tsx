'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Confirming payment...')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('sessionId') || ''
    const tx = params.get('tx') || ''
    const provider = params.get('provider') || 'unknown'
    const amount = Number(params.get('amount') || '0')
    const sig = params.get('sig') || ''

    // In a real integration, server would verify signature and update wallet.
    // For dev: save the top-up record and redirect to history.
    try {
      const historyJson = localStorage.getItem('probaho_topups')
      const history = historyJson ? JSON.parse(historyJson) : []
      history.unshift({ id: tx, sessionId, provider, amount, status: 'success', createdAt: new Date().toISOString() })
      localStorage.setItem('probaho_topups', JSON.stringify(history))

      // Update wallet balance stored in localStorage (probaho_wallet)
      try {
        const walletJson = localStorage.getItem('probaho_wallet')
        const wallet = walletJson ? JSON.parse(walletJson) : { id: '1', userId: '1', balance: 0, currency: 'BDT' }
        const newBalance = Number(wallet.balance || 0) + Number(amount || 0)
        const updatedWallet = { ...wallet, balance: newBalance }
        localStorage.setItem('probaho_wallet', JSON.stringify(updatedWallet))
      } catch (e) {
        // ignore wallet update errors
      }

      setMessage('Payment confirmed! Redirecting...')
      setTimeout(() => router.push('/history'), 1200)
    } catch (err) {
      setMessage('Failed to record payment. Please contact support.')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">{message}</h2>
        <p className="text-sm text-gray-500">This simulates server confirmation for gateway payment.</p>
      </div>
    </div>
  )
}
