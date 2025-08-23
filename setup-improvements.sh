#!/bin/bash

# 🚀 Codebase Improvements Setup Script
# This script helps you set up the improved and secured codebase

echo "🚀 Setting up Codebase Improvements & Security Fixes"
echo "=================================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.template .env.local
    echo "✅ .env.local created from template"
    echo "⚠️  IMPORTANT: Edit .env.local with your Firebase credentials"
    echo "   Required variables:"
    echo "   - NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "   - NEXT_PUBLIC_FIREBASE_APP_ID"
    echo "   - NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
else
    echo "✅ .env.local already exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Run linting to check for issues
echo "🔍 Running ESLint to check for issues..."
npm run lint

# Run type checking
echo "🔍 Running TypeScript type checking..."
npm run type-check

# Run build to verify everything works
echo "🏗️  Running build to verify configuration..."
npm run build

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📚 Documentation created:"
echo "   - README-IMPROVEMENTS.md - Overview of all improvements"
echo "   - SECURITY.md - Security measures and best practices"
echo "   - PERFORMANCE.md - Performance optimization guide"
echo "   - MIGRATION.md - Step-by-step migration guide"
echo "   - env.template - Environment variable template"
echo ""
echo "🔧 Next Steps:"
echo "   1. Edit .env.local with your Firebase credentials"
echo "   2. Test the application: npm run dev"
echo "   3. Review the documentation for best practices"
echo "   4. Deploy with confidence!"
echo ""
echo "🚨 Security Reminder:"
echo "   If you had hardcoded credentials before, ROTATE YOUR API KEYS IMMEDIATELY!"
echo ""
echo "📞 Need help? Check the MIGRATION.md guide or SECURITY.md documentation."
