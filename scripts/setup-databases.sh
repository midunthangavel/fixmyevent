#!/bin/bash
# ============================================================================
# FixMyEvent Database Setup Script for Linux/macOS
# ============================================================================
# 
# SECURITY WARNING: 
# - This script creates a .env.local file with placeholder values
# - You MUST replace these placeholders with your actual Firebase credentials
# - NEVER commit .env.local to version control
# - Keep your credentials secure and private
#
# ============================================================================

# Database Setup Script for FixMyEvent
# This script configures all database connections and validates them

set -e

echo "🚀 Setting up databases for FixMyEvent..."

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
if [ ! -f "package.json" ] || [ ! -f "firebase.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Checking current database configuration..."

# 1. Firebase Configuration
print_status "Configuring Firebase..."
if [ -f ".firebaserc" ]; then
    PROJECT_ID=$(grep -o '"default": "[^"]*"' .firebaserc | cut -d'"' -f4)
    print_success "Firebase project ID: $PROJECT_ID"
else
    print_warning "No .firebaserc found, creating default configuration..."
    echo '{"projects": {"default": "fixmyevent-d696b"}}' > .firebaserc
fi

# 2. Check Firebase CLI installation
if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    print_success "Firebase CLI installed"
else
    print_success "Firebase CLI already installed"
fi

# 3. Initialize Firebase project if not already done
if [ ! -d ".firebase" ]; then
    print_status "Initializing Firebase project..."
    firebase init firestore --project "$PROJECT_ID" --yes
    firebase init storage --project "$PROJECT_ID" --yes
    firebase init functions --project "$PROJECT_ID" --yes
    print_success "Firebase project initialized"
else
    print_success "Firebase project already initialized"
fi

# 4. Deploy Firestore rules and indexes
print_status "Deploying Firestore configuration..."
firebase deploy --only firestore:rules,firestore:indexes --project "$PROJECT_ID"

# 5. Deploy Storage rules
print_status "Deploying Storage rules..."
firebase deploy --only storage --project "$PROJECT_ID"

# 6. Deploy Functions
print_status "Deploying Cloud Functions..."
firebase deploy --only functions --project "$PROJECT_ID"

# 7. Setup Data Connect (Google Cloud SQL)
print_status "Setting up Google Data Connect..."
if [ -d "dataconnect" ]; then
    print_success "Data Connect directory exists"
    
    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        print_warning "Google Cloud CLI not found. Please install it manually:"
        print_warning "https://cloud.google.com/sdk/docs/install"
    else
        print_status "Configuring Data Connect..."
        cd dataconnect
        
        # Deploy Data Connect service
        if [ -f "dataconnect.yaml" ]; then
            gcloud data-connect services deploy dataconnect.yaml
            print_success "Data Connect service deployed"
        fi
        
        cd ..
    fi
else
    print_warning "Data Connect directory not found"
fi

# 8. Install database dependencies
print_status "Installing database dependencies..."
npm install

# 9. Create environment configuration
print_status "Setting up environment configuration..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$PROJECT_ID.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id-here

# Database Configuration
NEXT_PUBLIC_DATABASE_PROVIDER=firebase
NEXT_PUBLIC_ENABLE_LOCAL_DATABASE=true
NEXT_PUBLIC_ENABLE_CACHING=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true

# Development Settings
NODE_ENV=development
USE_FIREBASE_EMULATORS=true

# AI Service Configuration
NEXT_PUBLIC_AI_PROVIDER=local
NEXT_PUBLIC_LOCAL_AI_BASE_URL=http://localhost:11434
NEXT_PUBLIC_LOCAL_AI_MODEL=mistral

# Cost Optimization Settings
NEXT_PUBLIC_MAX_MONTHLY_AI_SPEND=25
NEXT_PUBLIC_MAX_MONTHLY_DB_SPEND=10
NEXT_PUBLIC_MAX_MONTHLY_HOSTING_SPEND=15

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    print_success "Environment file created"
else
    print_success "Environment file already exists"
fi

# 10. Start Firebase emulators for development
print_status "Starting Firebase emulators..."
firebase emulators:start --only firestore,storage,auth,functions --project "$PROJECT_ID" &
EMULATOR_PID=$!

# Wait a bit for emulators to start
sleep 5

# 11. Test database connections
print_status "Testing database connections..."
npm run db:status

# 12. Seed database with initial data
print_status "Seeding database with initial data..."
npm run seed

# 13. Stop emulators
kill $EMULATOR_PID 2>/dev/null || true

# 14. Final status check
print_status "Final database configuration status..."
echo ""
echo "📊 Database Configuration Summary:"
echo "   ✅ Firebase Firestore: Configured"
echo "   ✅ Firebase Storage: Configured"
echo "   ✅ Firebase Functions: Configured"
echo "   ✅ Firestore Rules: Deployed"
echo "   ✅ Firestore Indexes: Deployed"
echo "   ✅ Storage Rules: Deployed"
echo "   ✅ Environment Variables: Set"
echo "   ✅ Dependencies: Installed"
echo ""

print_success "Database setup completed successfully! 🎉"
print_status "Next steps:"
echo "   1. Update .env.local with your actual Firebase credentials"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Run 'firebase emulators:start' to start local development databases"
echo "   4. Visit http://localhost:4000 for Firebase Emulator UI"
echo ""

print_warning "Remember to never commit .env.local to version control!"
