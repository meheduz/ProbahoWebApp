const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the workspace directory
app.use(express.static(path.join(__dirname)));

// Handle API routes
app.use('/api', (req, res, next) => {
  // Mock API responses for development
  if (req.path === '/payment/create' && req.method === 'POST') {
    const mockResponse = {
      sessionId: `sess_${Date.now()}`,
      tx: `TXN_${Date.now()}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/mock-gateway?sessionId=sess_${Date.now()}&tx=TXN_${Date.now()}&provider=bkash&amount=1000&sig=mock-signature`
    };
    return res.json(mockResponse);
  }
  
  if (req.path === '/payment/mock-gateway' && req.method === 'GET') {
    const { sessionId, tx, provider, amount } = req.query;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Mock Gateway - ${provider}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .card {
              padding: 2rem;
              border-radius: 1rem;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              max-width: 420px;
              background: white;
            }
            .button {
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              border: none;
              background: #2563eb;
              color: white;
              cursor: pointer;
              margin-right: 0.5rem;
            }
            .button:hover {
              background: #1d4ed8;
            }
            .button.secondary {
              background: #6b7280;
              border: 1px solid #d1d5db;
            }
            .button.secondary:hover {
              background: #4b5563;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Mock ${provider} Payment</h2>
            <p><strong>Transaction:</strong> ${tx}</p>
            <p><strong>Amount:</strong> ${amount} BDT</p>
            <p>This is a simulated payment page. Click confirm to return to the app.</p>
            <div style="margin-top: 1rem;">
              <button class="button" onclick="window.location.href='${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/add-money/confirm?sessionId=${sessionId}&tx=${tx}&provider=${provider}&amount=${amount}&sig=mock-signature'">
                Confirm Payment
              </button>
              <button class="button secondary" onclick="window.location.href='${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/add-money'">
                Cancel
              </button>
            </div>
          </div>
        </body>
      </html>
    `;
    return res.send(html);
  }
  
  next();
});

// Handle client-side routing
app.get('*', (req, res) => {
  // Serve index.html for all routes (SPA behavior)
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Probaho development server running on http://localhost:${PORT}`);
  console.log(`📱 Demo credentials: Phone: 01712345678, PIN: 1234`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});