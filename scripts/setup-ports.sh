#!/bin/bash

# FixMyEvent Port Configuration Setup Script
# This script sets up the new port configuration system

set -e

echo "🚀 Setting up FixMyEvent Port Configuration System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the FixMyEvent project root directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Install concurrently if not already installed
if ! npm list concurrently &> /dev/null; then
    print_status "Installing concurrently package..."
    npm install concurrently
fi

# Make scripts executable
print_status "Making scripts executable..."
chmod +x scripts/manage-ports.js
chmod +x scripts/validate-ports.js

# Validate port configuration
print_status "Validating port configuration..."
if node scripts/validate-ports.js; then
    print_success "Port configuration validation passed!"
else
    print_error "Port configuration validation failed!"
    exit 1
fi

# Generate ports summary
print_status "Generating ports summary..."
npm run ports:summary

# Check if all required files exist
print_status "Checking configuration files..."
REQUIRED_FILES=(
    "ports.config.js"
    "scripts/manage-ports.js"
    "scripts/validate-ports.js"
    "PORTS_SUMMARY.md"
    "PORTS_DOCUMENTATION.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file"
    else
        print_error "✗ $file (missing)"
        exit 1
    fi
done

# Test port management commands
print_status "Testing port management commands..."
if npm run ports:status &> /dev/null; then
    print_success "Port management commands working correctly!"
else
    print_warning "Port management commands may have issues"
fi

# Show next steps
echo ""
print_success "Port configuration setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Review the generated PORTS_SUMMARY.md file"
echo "2. Read PORTS_DOCUMENTATION.md for detailed usage instructions"
echo "3. Test the port management system:"
echo "   - npm run ports:status"
echo "   - npm run ports:start"
echo "   - npm run ports:stop"
echo ""
echo "🔧 Available Commands:"
echo "  npm run ports:start      - Start all services"
echo "  npm run ports:stop       - Stop all services"
echo "  npm run ports:status     - Show service status"
echo "  npm run ports:summary    - Generate ports summary"
echo "  npm run ports:validate   - Validate configuration"
echo "  npm run dev:all          - Start all development services"
echo ""
echo "📚 Documentation:"
echo "  - PORTS_DOCUMENTATION.md - Complete usage guide"
echo "  - PORTS_SUMMARY.md       - Port assignments summary"
echo "  - ports.config.js        - Port configuration source"
echo ""
print_success "Setup complete! 🎉"
