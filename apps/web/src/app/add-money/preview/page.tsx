'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PreviewGatewayPage() {
  const router = useRouter()

  useEffect(() => {
    // read params and show a basic UI; this page is intentionally simple for showcasing
    const params = new URLSearchParams(window.location.search)
    const provider = params.get('provider') || 'bkash'
    const amount = params.get('amount') || '0'
    const tx = params.get('tx') || `TXN_${Date.now()}`

    // Attach handlers to buttons via DOM or use simple timeout to auto-redirect for demo
    // We'll show a short delay then auto-redirect to confirm to simulate a completed payment
    const timer = setTimeout(() => {
      const qp = new URLSearchParams({ provider, amount, tx, status: 'success' })
      router.push(`/add-money/confirm?${qp.toString()}`)
    }, 1200)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Preview Gateway (Showcase)</h2>
        <p className="text-sm text-gray-600 mb-4">Simulating a provider payment — you will be redirected shortly.</p>
        <div className="text-xs text-gray-400">This is a client-side demo only.</div>
      </div>
    </div>
  )
}
