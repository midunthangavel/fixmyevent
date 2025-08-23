# 🚀 Quick Database Setup for FixMyEvent

Your Firebase project is already configured! Here's how to get started quickly:

## ✅ What's Already Set Up

- **Firebase Project**: `fixmyevent-d696b`
- **Real Credentials**: All API keys and configuration are ready
- **Database Structure**: Firestore rules, indexes, and security configured
- **Automated Scripts**: Setup scripts for both Windows and Linux/macOS

## 🎯 Quick Start (Choose One)

### Option 1: Automated Setup (Recommended)

**For Windows:**
```cmd
scripts\setup-databases.bat
```

**For Linux/macOS:**
```bash
chmod +x scripts/setup-databases.sh
./scripts/setup-databases.sh
```

### Option 2: Manual Setup

1. **Copy environment file:**
   ```bash
   cp env.local.example .env.local
   ```

2. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase:**
   ```bash
   firebase login
   ```

4. **Initialize project:**
   ```bash
   firebase init firestore
   firebase init storage
   firebase init functions
   ```

5. **Deploy configuration:**
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   firebase deploy --only storage
   firebase deploy --only functions
   ```

6. **Setup database:**
   ```bash
   npm run db:setup
   ```

## 🔑 Your Firebase Credentials

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 🚀 Start Development

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Start Firebase emulators (optional):**
   ```bash
   firebase emulators:start
   ```

3. **View database status:**
   ```bash
   npm run db:health
   ```

## 📊 Database Status Dashboard

Once running, you can view your database status at:
- **App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore**: http://localhost:8080
- **Storage**: http://localhost:9199

## 🔍 Available Commands

- `npm run db:status` - Check database status
- `npm run db:setup` - Full database setup
- `npm run db:init` - Initialize database
- `npm run db:health` - Health check
- `npm run db:reset` - Reset database (⚠️ destructive)

## 🎉 You're Ready!

Your databases are configured with:
- ✅ Real Firebase credentials
- ✅ Security rules and indexes
- ✅ Sample data structure
- ✅ Development emulators
- ✅ Health monitoring

Start building your event management app! 🚀
