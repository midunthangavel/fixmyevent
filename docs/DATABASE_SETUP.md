# Database Configuration Guide for FixMyEvent

This guide covers the complete database setup for the FixMyEvent application using Firebase Firestore, Storage, Functions, and Google Data Connect.

## 🗄️ Database Architecture Overview

The FixMyEvent application uses Firebase as its primary database:

- **Primary Database**: Firebase Firestore (NoSQL)
- **File Storage**: Firebase Storage
- **Serverless Functions**: Firebase Cloud Functions
- **Relational Data**: Google Data Connect (PostgreSQL) - for advanced analytics
- **Caching**: In-memory and offline storage

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

#### For Linux/macOS:
```bash
chmod +x scripts/setup-databases.sh
./scripts/setup-databases.sh
```

#### For Windows:
```cmd
scripts\setup-databases.bat
```

### Option 2: Manual Setup

Follow the step-by-step instructions below.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** (v9 or higher)
3. **Firebase CLI**
4. **Google Cloud CLI** (for Data Connect)

## 🔧 Step-by-Step Setup

### 1. Firebase Configuration

#### Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### Login to Firebase
```bash
firebase login
```

#### Initialize Firebase Project
```bash
firebase init firestore
firebase init storage
firebase init functions
```

#### Configure Project
- Select your Firebase project: `fixmyevent-d696b`
- Use existing Firestore rules: `firestore.rules`
- Use existing Firestore indexes: `firestore.indexes.json`
- Use existing Storage rules: `storage.rules`

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Database Configuration
NEXT_PUBLIC_DATABASE_PROVIDER=firebase
NEXT_PUBLIC_ENABLE_CACHING=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true

# Development Settings
NODE_ENV=development
USE_FIREBASE_EMULATORS=true
```

### 3. Firebase Project Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `fixmyevent`
4. Enable Google Analytics (optional)
5. Click "Create project"

#### Enable Services
1. **Firestore Database**: Click "Create database" → Start in test mode
2. **Storage**: Click "Get started" → Start in test mode
3. **Authentication**: Click "Get started" → Enable Email/Password
4. **Functions**: Click "Get started" → Install CLI if prompted

#### Get Configuration
1. Click project settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web app
4. Copy the configuration object
5. Update your `.env.local` file

### 4. Firestore Rules

Your Firestore security rules are already configured in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || resource.data.role == 'vendor');
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // ... other collections
  }
}
```

### 5. Deploy Configuration

#### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

#### Deploy Storage Rules
```bash
firebase deploy --only storage
```

#### Deploy Functions
```bash
firebase deploy --only functions
```

### 6. Google Data Connect (Optional)

For advanced analytics and reporting:

#### Install Google Cloud CLI
```bash
# macOS
brew install google-cloud-sdk

# Windows
# Download from https://cloud.google.com/sdk/docs/install
```

#### Initialize and Authenticate
```bash
gcloud init
gcloud auth application-default login
```

#### Enable Data Connect API
```bash
gcloud services enable dataconnect.googleapis.com
```

#### Deploy Data Connect Schema
```bash
gcloud dataconnect connectors deploy \
  --location=us-central1 \
  --connector-id=studio-master \
  --config-file=dataconnect/dataconnect.yaml
```

## 🔍 Verification

### 1. Check Firebase Connection
```bash
npm run dev
# Check browser console for Firebase initialization logs
```

### 2. Test Authentication
1. Go to your app's signup page
2. Create a test account
3. Check Firebase Console → Authentication → Users

### 3. Test Database
1. Sign in with test account
2. Create a test listing
3. Check Firebase Console → Firestore → Data

### 4. Test Storage
1. Upload a test image
2. Check Firebase Console → Storage → Files

## 🚨 Troubleshooting

### Common Issues

#### Firebase Configuration Error
```
Error: Firebase configuration incomplete
```
**Solution**: Ensure all required environment variables are set in `.env.local`

#### Firestore Permission Denied
```
Error: Missing or insufficient permissions
```
**Solution**: Deploy updated Firestore rules: `firebase deploy --only firestore:rules`

#### Storage Upload Failed
```
Error: Storage bucket not found
```
**Solution**: Verify storage bucket name in Firebase Console and `.env.local`

#### Functions Deploy Failed
```
Error: Billing account not linked
```
**Solution**: Link billing account in Firebase Console → Usage and billing

### Performance Optimization

#### Enable Offline Persistence
```typescript
// Already configured in src/lib/firebase.ts
db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});
```

#### Enable Caching
```typescript
// Configure in .env.local
NEXT_PUBLIC_ENABLE_CACHING=true
```

#### Optimize Queries
```typescript
// Use indexes for complex queries
// Check firestore.indexes.json for existing indexes
```

## 📊 Monitoring

### Firebase Console
- **Usage**: Monitor API calls, storage, and bandwidth
- **Performance**: Track app performance metrics
- **Crashlytics**: Monitor app crashes and errors

### Cost Monitoring
- Set up billing alerts in Firebase Console
- Monitor usage in Google Cloud Console
- Use cost optimization features in `src/config/cost-optimization.ts`

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use environment-specific rules** for development/production
3. **Regularly review Firestore rules** for security
4. **Monitor authentication logs** for suspicious activity
5. **Enable Firebase App Check** for production apps

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Google Data Connect](https://cloud.google.com/dataconnect)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Firebase Console logs
3. Check browser console for errors
4. Verify environment variables
5. Ensure Firebase services are enabled

For additional help, refer to the Firebase documentation or create an issue in the project repository.
