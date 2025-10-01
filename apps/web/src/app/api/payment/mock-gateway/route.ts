import { NextResponse } from 'next/server'
import crypto from 'crypto'

// GET /api/payment/mock-gateway?sessionId=...&tx=...&provider=...&amount=...&sig=...
export async function GET(req: Request) {
  const url = new URL(req.url)
  const sessionId = url.searchParams.get('sessionId') || ''
  const tx = url.searchParams.get('tx') || ''
  const provider = url.searchParams.get('provider') || 'bkash'
  const amount = url.searchParams.get('amount') || '0'
  const sig = url.searchParams.get('sig') || ''

  // Validate signature
  const secret = process.env.PAYMENT_SECRET || 'dev-secret'
  const payload = `${sessionId}|${tx}|${provider}|${amount}`
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  if (sig !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Show a simple HTML page to simulate payment (the user clicks confirm to complete)
  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/add-money/confirm?sessionId=${encodeURIComponent(sessionId)}&tx=${encodeURIComponent(tx)}&provider=${encodeURIComponent(provider)}&amount=${encodeURIComponent(amount)}&sig=${encodeURIComponent(sig)}`

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mock Gateway - ${provider}</title>
        <style>body{font-family:system-ui,Segoe UI,Roboto,Arial;display:flex;align-items:center;justify-content:center;height:100vh;margin:0} .card{padding:24px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.08);max-width:420px}</style>
      </head>
      <body>
        <div class="card">
          <h2>Mock ${provider} Payment</h2>
          <p>Transaction: <strong>${tx}</strong></p>
          <p>Amount: <strong>${amount} BDT</strong></p>
          <p>This is a simulated payment page. Click confirm to return to the app.</p>
          <div style="display:flex;gap:8px;margin-top:16px">
            <form method="GET" action="${confirmUrl}">
              <button type="submit" style="padding:8px 12px;border-radius:8px;border:none;background:#2563eb;color:white">Confirm Payment</button>
            </form>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/add-money" style="padding:8px 12px;border-radius:8px;border:1px solid #ddd">Cancel</a>
          </div>
        </div>
      </body>
    </html>
  `

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
