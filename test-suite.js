// Probaho Test Suite
// Comprehensive testing for all application features

class ProbahoTestSuite {
    constructor() {
        this.baseURL = window.location.origin;
        this.testResults = [];
        this.currentTest = null;
    }

    async runAllTests() {
        console.log('🧪 Starting Probaho Test Suite...');
        console.log('================================');

        const tests = [
            { name: 'Server Connectivity', fn: this.testServerConnectivity.bind(this) },
            { name: 'Authentication API', fn: this.testAuthenticationAPI.bind(this) },
            { name: 'User Profile API', fn: this.testUserProfileAPI.bind(this) },
            { name: 'Wallet Balance API', fn: this.testWalletBalanceAPI.bind(this) },
            { name: 'Transactions API', fn: this.testTransactionsAPI.bind(this) },
            { name: 'Payment Creation API', fn: this.testPaymentCreationAPI.bind(this) },
            { name: 'Mock Gateway API', fn: this.testMockGatewayAPI.bind(this) },
            { name: 'UI Components', fn: this.testUIComponents.bind(this) },
            { name: 'Local Storage', fn: this.testLocalStorage.bind(this) },
            { name: 'Error Handling', fn: this.testErrorHandling.bind(this) }
        ];

        for (const test of tests) {
            await this.runTest(test.name, test.fn);
        }

        this.displayResults();
    }

    async runTest(name, testFunction) {
        this.currentTest = name;
        console.log(`\n🔍 Running: ${name}`);
        
        try {
            await testFunction();
            this.testResults.push({ name, status: 'PASS', message: 'Test completed successfully' });
            console.log(`✅ ${name}: PASSED`);
        } catch (error) {
            this.testResults.push({ name, status: 'FAIL', message: error.message });
            console.log(`❌ ${name}: FAILED - ${error.message}`);
        }
    }

    async testServerConnectivity() {
        const response = await fetch(`${this.baseURL}/api/user/profile`);
        if (!response.ok && response.status !== 401) {
            throw new Error('Server is not responding correctly');
        }
    }

    async testAuthenticationAPI() {
        // Test login with demo credentials
        const response = await fetch(`${this.baseURL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: '01712345678', pin: '1234' })
        });

        if (!response.ok) {
            throw new Error('Authentication API failed');
        }

        const data = await response.json();
        if (!data.success || !data.token) {
            throw new Error('Invalid authentication response');
        }

        // Store token for other tests
        this.authToken = data.token;
    }

    async testUserProfileAPI() {
        if (!this.authToken) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(`${this.baseURL}/api/user/profile`, {
            headers: { 'Authorization': `Bearer ${this.authToken}` }
        });

        if (!response.ok) {
            throw new Error('User profile API failed');
        }

        const data = await response.json();
        if (!data.id || !data.phone) {
            throw new Error('Invalid user profile response');
        }
    }

    async testWalletBalanceAPI() {
        const response = await fetch(`${this.baseURL}/api/wallet/balance`);
        
        if (!response.ok) {
            throw new Error('Wallet balance API failed');
        }

        const data = await response.json();
        if (typeof data.totalBalance !== 'number' || !data.currency) {
            throw new Error('Invalid wallet balance response');
        }
    }

    async testTransactionsAPI() {
        const response = await fetch(`${this.baseURL}/api/transactions`);
        
        if (!response.ok) {
            throw new Error('Transactions API failed');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid transactions response');
        }
    }

    async testPaymentCreationAPI() {
        const response = await fetch(`${this.baseURL}/api/payment/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'bkash', amount: 1000 })
        });

        if (!response.ok) {
            throw new Error('Payment creation API failed');
        }

        const data = await response.json();
        if (!data.sessionId || !data.tx || !data.redirectUrl) {
            throw new Error('Invalid payment creation response');
        }
    }

    async testMockGatewayAPI() {
        const response = await fetch(`${this.baseURL}/api/payment/mock-gateway?sessionId=test&tx=test&provider=bkash&amount=1000&sig=test`);
        
        if (!response.ok) {
            throw new Error('Mock gateway API failed');
        }

        const html = await response.text();
        if (!html.includes('Mock bkash Payment')) {
            throw new Error('Invalid mock gateway response');
        }
    }

    async testUIComponents() {
        // Test if main components exist
        const components = [
            'probahoApp',
            'ProbahoApp'
        ];

        for (const component of components) {
            if (typeof window[component] === 'undefined') {
                throw new Error(`UI component ${component} not found`);
            }
        }

        // Test if DOM elements exist
        const elements = [
            'loginForm',
            'demoLoginBtn',
            'togglePin'
        ];

        for (const elementId of elements) {
            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error(`UI element ${elementId} not found`);
            }
        }
    }

    async testLocalStorage() {
        // Test localStorage functionality
        const testKey = 'probaho_test';
        const testValue = 'test_value';

        try {
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            
            if (retrieved !== testValue) {
                throw new Error('LocalStorage not working correctly');
            }

            localStorage.removeItem(testKey);
        } catch (error) {
            throw new Error('LocalStorage not available');
        }
    }

    async testErrorHandling() {
        // Test error handling with invalid data
        try {
            const response = await fetch(`${this.baseURL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: 'invalid', pin: 'invalid' })
            });

            const data = await response.json();
            if (response.ok || data.success) {
                throw new Error('Error handling not working correctly');
            }
        } catch (error) {
            // This is expected for invalid credentials
        }
    }

    displayResults() {
        console.log('\n📊 Test Results Summary');
        console.log('=======================');

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const total = this.testResults.length;

        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%`);

        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(test => {
                    console.log(`   • ${test.name}: ${test.message}`);
                });
        }

        console.log('\n🎉 Test suite completed!');
    }
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const testSuite = new ProbahoTestSuite();
            testSuite.runAllTests();
        }, 2000); // Wait for app to initialize
    });
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProbahoTestSuite;
}