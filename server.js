import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(compression());
app.use(express.json());

// Static assets for Next.js export
const staticDir = path.join(__dirname);
app.use('/_next', express.static(path.join(staticDir, '_next'), { maxAge: '1y', immutable: true }));
app.use('/images', express.static(path.join(staticDir, 'images'), { maxAge: '30d' }));

// API routes re-implemented from compiled Next output
// POST /api/payment/create
app.post('/api/payment/create', (req, res) => {
  try {
    const { provider = 'bkash', amount = 0 } = req.body || {};
    const sessionId = `sess_${Date.now()}`;
    const tx = `TXN_${Date.now()}`;
    const secret = process.env.PAYMENT_SECRET || 'dev-secret';
    const payload = `${sessionId}|${tx}|${provider}|${amount}`;
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`;
    const qs = new URLSearchParams({ sessionId, tx, provider, amount: String(amount), sig });
    const redirectUrl = `${baseUrl}/api/payment/mock-gateway?${qs.toString()}`;

    res.json({ sessionId, tx, redirectUrl });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/payment/mock-gateway
app.get('/api/payment/mock-gateway', (req, res) => {
  const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
  const sessionId = url.searchParams.get('sessionId') || '';
  const tx = url.searchParams.get('tx') || '';
  const provider = url.searchParams.get('provider') || 'bkash';
  const amount = url.searchParams.get('amount') || '0';
  const sig = url.searchParams.get('sig') || '';

  const secret = process.env.PAYMENT_SECRET || 'dev-secret';
  const payload = `${sessionId}|${tx}|${provider}|${amount}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (sig !== expected) {
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${port}`;
  const confirmUrl = `${baseUrl}/add-money/confirm?sessionId=${encodeURIComponent(sessionId)}&tx=${encodeURIComponent(tx)}&provider=${encodeURIComponent(provider)}&amount=${encodeURIComponent(amount)}&sig=${encodeURIComponent(sig)}`;

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
            <a href="${baseUrl}/add-money" style="padding:8px 12px;border-radius:8px;border:1px solid #ddd">Cancel</a>
          </div>
        </div>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Fallback for HTML routes from static export
const htmlRoutes = [
  '/',
  '/login',
  '/signup',
  '/send-money',
  '/add-money',
  '/add-money/preview',
  '/add-money/confirm',
];

for (const route of htmlRoutes) {
  app.get(route, (req, res, next) => {
    const htmlPath = path.join(staticDir, route === '/' ? 'index.html' : `${route.replace(/^\//,'')}.html`);
    res.sendFile(htmlPath, err => {
      if (err) next();
    });
  });
}

// Serve other exported HTML by direct file path if exists
app.get('*', (req, res, next) => {
  const cleanPath = req.path.replace(/^\/+/, '');
  const candidate = path.join(staticDir, cleanPath);
  if (candidate.endsWith('.html')) {
    res.sendFile(candidate, err => (err ? next() : undefined));
    return;
  }
  next();
});

// Finally, serve index.html for unknown routes if present
app.use((req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
