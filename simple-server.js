const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

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
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
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
    
    // Add .html extension if no extension is provided
    if (!path.extname(pathname)) {
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
                        res.end('<h1>404 - Page Not Found</h1>');
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
    
    if (pathname === '/api/payment/create' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const mockResponse = {
                    sessionId: `sess_${Date.now()}`,
                    tx: `TXN_${Date.now()}`,
                    redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/mock-gateway?sessionId=sess_${Date.now()}&tx=TXN_${Date.now()}&provider=${data.provider || 'bkash'}&amount=${data.amount || 1000}&sig=mock-signature`
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(mockResponse));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (pathname === '/api/payment/mock-gateway' && req.method === 'GET') {
        const { sessionId, tx, provider, amount } = parsedUrl.query;
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
                            text-decoration: none;
                            display: inline-block;
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
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/add-money/confirm?sessionId=${sessionId}&tx=${tx}&provider=${provider}&amount=${amount}&sig=mock-signature" class="button">
                                Confirm Payment
                            </a>
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/add-money" class="button secondary">
                                Cancel
                            </a>
                        </div>
                    </div>
                </body>
            </html>
        `;
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
}

server.listen(PORT, () => {
    console.log(`🚀 Probaho development server running on http://localhost:${PORT}`);
    console.log(`📱 Demo credentials: Phone: 01712345678, PIN: 1234`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌐 Open your browser and navigate to: http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Probaho server...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});