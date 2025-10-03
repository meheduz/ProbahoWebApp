const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Find available port
function findAvailablePort(startPort = 3000) {
    return new Promise((resolve) => {
        const server = http.createServer();
        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            if (startPort < 65535) {
                resolve(findAvailablePort(startPort + 1));
            } else {
                resolve(3000); // Fallback to default port
            }
        });
    });
}

const PORT = parseInt(process.env.PORT) || 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Mock data for development
const mockData = {
    users: [
        { id: '1', phone: '01712345678', pin: '1234', name: 'Probaho User', balance: 12500 }
    ],
    transactions: [
        {
            id: 'TXN_001',
            userId: '1',
            type: 'credit',
            amount: 5000,
            currency: 'BDT',
            description: 'Added money from bKash',
            provider: 'bKash',
            status: 'success',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'TXN_002',
            userId: '1',
            type: 'debit',
            amount: 1500,
            currency: 'BDT',
            description: 'Sent to Nagad user',
            provider: 'Nagad',
            status: 'success',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
    ]
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // Handle API routes
    if (pathname.startsWith('/api/')) {
        handleApiRoute(req, res, parsedUrl);
        return;
    }
    
    // Default to index.html for SPA routing
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }
    
    // Add .html extension if no extension is provided and it's not an API route
    if (!path.extname(pathname) && !pathname.startsWith('/api/')) {
        pathname += '.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found, serve index.html for SPA routing
                fs.readFile(path.join(__dirname, 'index.html'), (err, indexContent) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - Page Not Found</h1><p>The requested page could not be found.</p>');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent);
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

function handleApiRoute(req, res, parsedUrl) {
    const pathname = parsedUrl.pathname;
    
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        handleLogin(req, res);
    } else if (pathname === '/api/auth/logout' && req.method === 'POST') {
        handleLogout(req, res);
    } else if (pathname === '/api/user/profile' && req.method === 'GET') {
        handleGetProfile(req, res);
    } else if (pathname === '/api/wallet/balance' && req.method === 'GET') {
        handleGetBalance(req, res);
    } else if (pathname === '/api/transactions' && req.method === 'GET') {
        handleGetTransactions(req, res);
    } else if (pathname === '/api/payment/create' && req.method === 'POST') {
        handleCreatePayment(req, res);
    } else if (pathname === '/api/payment/mock-gateway' && req.method === 'GET') {
        handleMockGateway(req, res, parsedUrl);
    } else if (pathname === '/api/payment/confirm' && req.method === 'POST') {
        handleConfirmPayment(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
}

function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const { phone, pin } = JSON.parse(body);
            const user = mockData.users.find(u => u.phone === phone && u.pin === pin);
            
            if (user) {
                const token = `jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        phone: user.phone,
                        name: user.name
                    }
                }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

function handleLogout(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
}

function handleGetProfile(req, res) {
    const user = mockData.users[0]; // Mock authenticated user
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        id: user.id,
        phone: user.phone,
        name: user.name,
        balance: user.balance
    }));
}

function handleGetBalance(req, res) {
    const user = mockData.users[0];
    const mfsBalances = [
        { provider: 'bKash', balance: 2500, color: 'bg-pink-500' },
        { provider: 'Nagad', balance: 3000, color: 'bg-orange-500' },
        { provider: 'Rocket', balance: 4000, color: 'bg-blue-500' },
        { provider: 'Upay', balance: 3000, color: 'bg-purple-500' }
    ];
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        totalBalance: user.balance,
        currency: 'BDT',
        mfsBalances,
        lastUpdated: new Date().toISOString()
    }));
}

function handleGetTransactions(req, res) {
    const userTransactions = mockData.transactions.filter(t => t.userId === '1');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userTransactions));
}

function handleCreatePayment(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const sessionId = `sess_${Date.now()}`;
            const tx = `TXN_${Date.now()}`;
            const signature = `sig_${Date.now()}_${Math.random().toString(36).substring(2)}`;
            
            const response = {
                sessionId,
                tx,
                redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/mock-gateway?sessionId=${sessionId}&tx=${tx}&provider=${data.provider || 'bkash'}&amount=${data.amount || 1000}&sig=${signature}`
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

function handleMockGateway(req, res, parsedUrl) {
    const { sessionId, tx, provider, amount } = parsedUrl.query;
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mock Gateway - ${provider}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
            </style>
        </head>
        <body class="flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-white text-2xl font-bold">${provider.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900">Mock ${provider} Payment</h2>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Transaction ID:</span>
                            <span class="font-mono text-sm">${tx}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Amount:</span>
                            <span class="font-bold text-lg text-green-600">${amount} BDT</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Provider:</span>
                            <span class="font-semibold">${provider}</span>
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-600 text-center mb-6">
                    This is a simulated payment page for development purposes.
                </p>
                
                <div class="space-y-3">
                    <button onclick="confirmPayment()" class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                        ✅ Confirm Payment
                    </button>
                    <button onclick="cancelPayment()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200">
                        ❌ Cancel
                    </button>
                </div>
            </div>
            
            <script>
                function confirmPayment() {
                    const url = '${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/add-money/confirm?sessionId=${sessionId}&tx=${tx}&provider=${provider}&amount=${amount}&sig=mock-signature';
                    window.location.href = url;
                }
                
                function cancelPayment() {
                    const url = '${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/add-money';
                    window.location.href = url;
                }
            </script>
        </body>
        </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}

function handleConfirmPayment(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            
            // Add transaction to mock data
            const newTransaction = {
                id: data.tx || `TXN_${Date.now()}`,
                userId: '1',
                type: 'credit',
                amount: parseInt(data.amount) || 0,
                currency: 'BDT',
                description: `Added money from ${data.provider}`,
                provider: data.provider,
                status: 'success',
                timestamp: new Date().toISOString()
            };
            
            mockData.transactions.unshift(newTransaction);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                transaction: newTransaction,
                message: 'Payment confirmed successfully'
            }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

// Start server
async function startServer() {
    const port = await findAvailablePort(PORT);
    
    server.listen(port, () => {
        console.log('🚀 Probaho Development Server Started!');
        console.log('=====================================');
        console.log(`🌐 Server running on: http://localhost:${port}`);
        console.log(`📱 Demo credentials: Phone: 01712345678, PIN: 1234`);
        console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`📁 Serving files from: ${__dirname}`);
        console.log('');
        console.log('📋 Available API Endpoints:');
        console.log('  POST /api/auth/login - User authentication');
        console.log('  POST /api/auth/logout - User logout');
        console.log('  GET  /api/user/profile - Get user profile');
        console.log('  GET  /api/wallet/balance - Get wallet balance');
        console.log('  GET  /api/transactions - Get transaction history');
        console.log('  POST /api/payment/create - Create payment session');
        console.log('  GET  /api/payment/mock-gateway - Mock payment gateway');
        console.log('  POST /api/payment/confirm - Confirm payment');
        console.log('');
        console.log('🎯 Open your browser and navigate to the URL above');
        console.log('💡 Press Ctrl+C to stop the server');
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Probaho server...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down Probaho server...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

startServer().catch(console.error);