import { NextResponse } from 'next/server'
import crypto from 'crypto'

// POST /api/payment/create
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { provider = 'bkash', amount = 0 } = body

  // Create a simple payment session (dev). In production replace this with provider API calls.
  const sessionId = `sess_${Date.now()}`
  const tx = `TXN_${Date.now()}`

  // For security, sign the payload so the mock gateway can return a verified response
  const secret = process.env.PAYMENT_SECRET || 'dev-secret'
  const payload = `${sessionId}|${tx}|${provider}|${amount}`
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  // Build a redirect URL to our mock gateway route (for dev). Production would redirect to provider URL.
  const params = new URLSearchParams({ sessionId, tx, provider, amount: String(amount), sig: signature })
  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/mock-gateway?${params.toString()}`

  return NextResponse.json({ sessionId, tx, redirectUrl })
}
