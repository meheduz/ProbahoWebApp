#!/bin/bash

# Probaho Perfect Development Server Startup Script
# This script sets up and starts the complete Probaho application

echo "🚀 Starting Probaho Perfect Development Server..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    echo "   Or use: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION is installed"

# Check if npm is installed
print_status "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm $NPM_VERSION is installed"

# Set environment variables
print_status "Setting up environment variables..."
export NEXT_PUBLIC_BASE_URL="http://localhost:3000"
export PAYMENT_SECRET="probaho-dev-secret-key-2024"
export NODE_ENV="development"

print_success "Environment variables configured"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    print_status "Creating .env.local file..."
    cp .env.example .env.local
    print_success "Created .env.local file"
else
    print_status ".env.local already exists"
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    print_error "index.html not found. Please run this script from the Probaho project directory."
    exit 1
fi

# Check for existing processes on port 3000
print_status "Checking for existing processes on port 3000..."
if netstat -tlnp 2>/dev/null | grep -q ":3000 " || ss -tlnp 2>/dev/null | grep -q ":3000 "; then
    print_warning "Port 3000 is already in use. Finding alternative port..."
    PORT=3001
    while netstat -tlnp 2>/dev/null | grep -q ":$PORT " || ss -tlnp 2>/dev/null | grep -q ":$PORT "; do
        PORT=$((PORT + 1))
        if [ $PORT -gt 3010 ]; then
            print_error "Could not find available port. Please free up some ports."
            exit 1
        fi
    done
    export NEXT_PUBLIC_BASE_URL="http://localhost:$PORT"
else
    PORT=3000
fi

print_success "Using port $PORT"

# Start the development server
print_status "Starting Probaho development server..."
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    🚀 PROBAHO SERVER STARTED 🚀              ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  🌐 Server URL: http://localhost:$PORT                        ║${NC}"
echo -e "${CYAN}║  📱 Demo Phone: 01712345678                                 ║${NC}"
echo -e "${CYAN}║  🔐 Demo PIN: 1234                                          ║${NC}"
echo -e "${CYAN}║  🔧 Environment: development                                ║${NC}"
echo -e "${CYAN}║  📁 Serving from: $(pwd)${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  📋 Available Features:                                     ║${NC}"
echo -e "${CYAN}║     ✅ Interactive Dashboard                                 ║${NC}"
echo -e "${CYAN}║     ✅ Authentication System                                 ║${NC}"
echo -e "${CYAN}║     ✅ Mock Payment Gateway                                  ║${NC}"
echo -e "${CYAN}║     ✅ Real-time Data Updates                                ║${NC}"
echo -e "${CYAN}║     ✅ Responsive Design                                     ║${NC}"
echo -e "${CYAN}║     ✅ Error Handling                                        ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  🎯 Quick Start:                                            ║${NC}"
echo -e "${CYAN}║     1. Open http://localhost:$PORT in your browser           ║${NC}"
echo -e "${CYAN}║     2. Click "Try Demo Login" button                        ║${NC}"
echo -e "${CYAN}║     3. Explore the dashboard and features                    ║${NC}"
echo -e "${CYAN}║     4. Try adding money or sending transactions              ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  💡 Press Ctrl+C to stop the server                         ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Start the server
node dev-server.js

# Handle cleanup on exit
cleanup() {
    echo ""
    print_status "Shutting down Probaho server..."
    print_success "Server stopped successfully"
    exit 0
}

trap cleanup SIGINT SIGTERM