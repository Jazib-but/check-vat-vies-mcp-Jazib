#!/bin/bash

# VIES VAT Checker MCP Server Setup Script

set -e

echo "🚀 Setting up VIES VAT Checker MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Make scripts executable
chmod +x scripts/setup.sh
chmod +x scripts/test-server.js

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Add the server to your MCP client configuration"
echo "2. Use the examples in the 'examples/' directory"
echo "3. Test the server with: node scripts/test-server.js"
echo ""
echo "🔧 Development commands:"
echo "  npm run dev     - Watch mode for development"
echo "  npm run build   - Build the project"
echo "  npm run test    - Run tests"
echo "  npm run lint    - Check code quality"
echo ""
echo "📖 See README.md for detailed usage instructions"
