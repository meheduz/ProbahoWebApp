// Simple API test script
const http = require('http');

const testAPI = async () => {
    const baseURL = 'http://localhost:3000';
    
    console.log('🧪 Testing Probaho API Endpoints...');
    console.log('=====================================');
    
    const tests = [
        {
            name: 'Health Check',
            method: 'GET',
            path: '/health',
            expectedStatus: 200
        },
        {
            name: 'Wallet Balance',
            method: 'GET',
            path: '/api/wallet/balance',
            expectedStatus: 200
        },
        {
            name: 'Transactions',
            method: 'GET',
            path: '/api/transactions',
            expectedStatus: 200
        },
        {
            name: 'Login (Demo)',
            method: 'POST',
            path: '/api/auth/login',
            body: JSON.stringify({ phone: '01712345678', pin: '1234' }),
            headers: { 'Content-Type': 'application/json' },
            expectedStatus: 200
        }
    ];
    
    for (const test of tests) {
        try {
            console.log(`\n🔍 Testing: ${test.name}`);
            
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: test.path,
                method: test.method,
                headers: test.headers || {}
            };
            
            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === test.expectedStatus) {
                        console.log(`✅ ${test.name}: PASSED (${res.statusCode})`);
                        if (test.name === 'Login (Demo)') {
                            try {
                                const response = JSON.parse(data);
                                if (response.success && response.token) {
                                    console.log(`   Token: ${response.token.substring(0, 20)}...`);
                                }
                            } catch (e) {
                                console.log(`   Response: ${data.substring(0, 100)}...`);
                            }
                        }
                    } else {
                        console.log(`❌ ${test.name}: FAILED (Expected ${test.expectedStatus}, got ${res.statusCode})`);
                    }
                });
            });
            
            req.on('error', (error) => {
                console.log(`❌ ${test.name}: ERROR - ${error.message}`);
            });
            
            if (test.body) {
                req.write(test.body);
            }
            
            req.end();
            
            // Wait a bit between requests
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.log(`❌ ${test.name}: EXCEPTION - ${error.message}`);
        }
    }
    
    console.log('\n🎉 API testing completed!');
};

// Run the tests
testAPI().catch(console.error);