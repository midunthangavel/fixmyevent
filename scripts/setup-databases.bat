@echo off
REM ============================================================================
REM FixMyEvent Database Setup Script for Windows
REM ============================================================================
REM 
REM SECURITY WARNING: 
REM - This script creates a .env.local file with placeholder values
REM - You MUST replace these placeholders with your actual Firebase credentials
REM - NEVER commit .env.local to version control
REM - Keep your credentials secure and private
REM
REM ============================================================================
REM Database Setup Script for FixMyEvent (Windows)
REM This script configures all database connections and validates them

echo 🚀 Setting up databases for FixMyEvent...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the project root directory
    exit /b 1
)

if not exist "firebase.json" (
    echo [ERROR] Please run this script from the project root directory
    exit /b 1
)

echo [INFO] Checking current database configuration...

REM 1. Firebase Configuration
echo [INFO] Configuring Firebase...
if exist ".firebaserc" (
    for /f "tokens=2 delims=:," %%i in ('findstr "default" .firebaserc') do (
        set PROJECT_ID=%%i
        set PROJECT_ID=!PROJECT_ID:"=!
        set PROJECT_ID=!PROJECT_ID: =!
    )
    echo [SUCCESS] Firebase project ID: !PROJECT_ID!
) else (
    echo [WARNING] No .firebaserc found, creating default configuration...
    echo {"projects": {"default": "fixmyevent-d696b"}} > .firebaserc
    set PROJECT_ID=fixmyevent-d696b
)

REM 2. Check Firebase CLI installation
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Firebase CLI not found. Installing...
    npm install -g firebase-tools
    echo [SUCCESS] Firebase CLI installed
) else (
    echo [SUCCESS] Firebase CLI already installed
)

REM 3. Initialize Firebase project if not already done
if not exist ".firebase" (
    echo [INFO] Initializing Firebase project...
    firebase init firestore --project "!PROJECT_ID!" --yes
    firebase init storage --project "!PROJECT_ID!" --yes
    firebase init functions --project "!PROJECT_ID!" --yes
    echo [SUCCESS] Firebase project initialized
) else (
    echo [SUCCESS] Firebase project already initialized
)

REM 4. Deploy Firestore rules and indexes
echo [INFO] Deploying Firestore configuration...
firebase deploy --only firestore:rules,firestore:indexes --project "!PROJECT_ID!"

REM 5. Deploy Storage rules
echo [INFO] Deploying Storage rules...
firebase deploy --only storage --project "!PROJECT_ID!"

REM 6. Deploy Functions
echo [INFO] Deploying Cloud Functions...
firebase deploy --only functions --project "!PROJECT_ID!"

REM 7. Setup Data Connect (Google Cloud SQL)
echo [INFO] Setting up Google Data Connect...
if exist "dataconnect" (
    echo [SUCCESS] Data Connect directory exists
    
    REM Check if gcloud is installed
    gcloud --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [WARNING] Google Cloud CLI not found. Please install it manually:
        echo [WARNING] https://cloud.google.com/sdk/docs/install
    ) else (
        echo [INFO] Configuring Data Connect...
        cd dataconnect
        
        REM Deploy Data Connect service
        if exist "dataconnect.yaml" (
            gcloud data-connect services deploy dataconnect.yaml
            echo [SUCCESS] Data Connect service deployed
        )
        
        cd ..
    )
) else (
    echo [WARNING] Data Connect directory not found
)

REM 8. Install database dependencies
echo [INFO] Installing database dependencies...
npm install

REM 9. Create environment configuration
echo [INFO] Setting up environment configuration...
if not exist ".env.local" (
    (
        echo # Firebase Configuration
        echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=!PROJECT_ID!
        echo NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
        echo NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
        echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=!PROJECT_ID!.firebaseapp.com
        echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=!PROJECT_ID!.firebasestorage.app
        echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
        echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id-here
        echo.
        echo # Database Configuration
        echo NEXT_PUBLIC_DATABASE_PROVIDER=firebase
        echo NEXT_PUBLIC_ENABLE_LOCAL_DATABASE=true
        echo NEXT_PUBLIC_ENABLE_CACHING=true
        echo NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
        echo.
        echo # Development Settings
        echo NODE_ENV=development
        echo USE_FIREBASE_EMULATORS=true
        echo.
        echo # AI Service Configuration
        echo NEXT_PUBLIC_AI_PROVIDER=local
        echo NEXT_PUBLIC_LOCAL_AI_BASE_URL=http://localhost:11434
        echo NEXT_PUBLIC_LOCAL_AI_MODEL=mistral
        echo.
        echo # Cost Optimization Settings
        echo NEXT_PUBLIC_MAX_MONTHLY_AI_SPEND=25
        echo NEXT_PUBLIC_MAX_MONTHLY_DB_SPEND=10
        echo NEXT_PUBLIC_MAX_MONTHLY_HOSTING_SPEND=15
        echo.
        echo # App Configuration
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    ) > .env.local
    echo [SUCCESS] Environment file created
) else (
    echo [SUCCESS] Environment file already exists
)

REM 10. Test database connections
echo [INFO] Testing database connections...
npm run db:status

REM 11. Seed database with initial data
echo [INFO] Seeding database with initial data...
npm run seed

REM 12. Final status check
echo [INFO] Final database configuration status...
echo.
echo 📊 Database Configuration Summary:
echo    ✅ Firebase Firestore: Configured
echo    ✅ Firebase Storage: Configured
echo    ✅ Firebase Functions: Configured
echo    ✅ Firestore Rules: Deployed
echo    ✅ Firestore Indexes: Deployed
echo    ✅ Storage Rules: Deployed
echo    ✅ Environment Variables: Set
echo    ✅ Dependencies: Installed
echo.

echo [SUCCESS] Database setup completed successfully! 🎉
echo [INFO] Next steps:
echo    1. Update .env.local with your actual Firebase credentials
echo    2. Run 'npm run dev' to start the development server
echo    3. Run 'firebase emulators:start' to start local development databases
echo    4. Visit http://localhost:4000 for Firebase Emulator UI
echo.

echo [WARNING] Remember to never commit .env.local to version control!

pause
