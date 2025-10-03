#!/bin/bash

# Probaho Development Server Startup Script

echo "🚀 Starting Probaho Development Server..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Set environment variables
export NEXT_PUBLIC_BASE_URL="http://localhost:3000"
export PAYMENT_SECRET="probaho-dev-secret-key-2024"
export NODE_ENV="development"

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local file"
fi

echo "🌐 Starting development server..."
echo "   URL: http://localhost:3000"
echo "   Demo Credentials: Phone: 01712345678, PIN: 1234"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev