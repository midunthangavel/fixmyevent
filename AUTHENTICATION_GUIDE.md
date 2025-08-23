# FixMyEvent Authentication System Guide

## 🚀 Overview

The FixMyEvent authentication system provides a comprehensive, secure, and user-friendly way for users to access the platform. It includes multiple authentication methods, role-based access control, and a complete user management system.

## ✨ Features

### 🔐 Authentication Methods
- **Email & Password**: Traditional email-based authentication
- **Social Authentication**: Google, Facebook, and Apple OAuth
- **Multi-Factor Authentication**: Enhanced security options
- **Password Reset**: Secure password recovery system

### 👥 User Roles
- **User**: Event planners and service seekers
- **Vendor**: Service providers and venue owners
- **Admin**: Platform administrators

### 🛡️ Security Features
- **JWT Tokens**: Secure session management
- **Password Hashing**: Bcrypt encryption
- **Rate Limiting**: Protection against brute force attacks
- **Email Verification**: Account validation
- **Session Management**: Secure logout and session handling

## 📁 Page Structure

### Authentication Pages
```
src/app/(auth)/
├── page.tsx                 # Main authentication landing page
├── layout.tsx              # Authentication layout with navigation
├── login/
│   └── page.tsx           # Login form with social options
├── signup/
│   └── page.tsx           # Registration form
├── forgot-password/
│   └── page.tsx           # Password reset request
├── verify-email/
│   └── page.tsx           # Email verification
├── social-auth/
│   └── page.tsx           # Social authentication options
├── role-selection/
│   └── page.tsx           # User role selection
└── profile/
    └── page.tsx           # User profile management
```

## 🎯 Quick Start

### 1. Access Authentication
Navigate to `/auth` to see the main authentication landing page with all options.

### 2. Choose Authentication Method
- **Email & Password**: Click "Continue with Email" for traditional login
- **Social Auth**: Click any social provider button
- **Demo Mode**: Use demo credentials for testing

### 3. Complete Registration/Login
- Fill in required information
- Verify email (if required)
- Select user role
- Access the platform

## 🔧 Usage Guide

### Email Authentication

#### Login
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected to role selection or home

#### Registration
1. Navigate to `/signup`
2. Fill in all required fields
3. Click "Create Account"
4. Verify email (optional)
5. Select user role

#### Password Reset
1. Navigate to `/forgot-password`
2. Enter email address
3. Click "Send Reset Link"
4. Check email for reset instructions
5. Create new password

### Social Authentication

#### Available Providers
- **Google**: OAuth 2.0 with Google accounts
- **Facebook**: Facebook Login integration
- **Apple**: Sign in with Apple ID

#### Process
1. Click social provider button
2. Authorize with provider
3. Grant permissions
4. Account created/authenticated
5. Redirected to role selection

### Role Selection

#### User Role
- **User**: Access to event planning tools, venue booking, service search
- **Vendor**: Access to vendor dashboard, service management, booking management

#### Selection Process
1. After authentication, redirected to `/role-selection`
2. Choose preferred role
3. Role saved to user profile
4. Redirected to appropriate dashboard

### Profile Management

#### Access Profile
Navigate to `/profile` to manage account settings.

#### Available Tabs
- **Profile**: Personal information and bio
- **Security**: Password changes and security settings
- **Preferences**: Notification and privacy settings
- **Account**: Account information and management

## 🛠️ Technical Implementation

### Authentication Context
```typescript
// src/context/auth-context.tsx
interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: UserSession | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile: ProfileData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshSession: () => Promise<void>;
}
```

### Authentication Service
```typescript
// src/services/auth.ts
export class AuthService {
  async signIn(email: string, password: string): Promise<UserCredential>
  async signUp(userData: CreateUserData): Promise<UserCredential>
  async signOut(): Promise<void>
  async sendPasswordResetEmail(email: string): Promise<void>
  async verifyEmail(code: string): Promise<void>
  async updatePassword(currentPassword: string, newPassword: string): Promise<void>
}
```

### User Types
```typescript
// src/types/user.ts
interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  phoneNumber?: string;
}

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  profile: ProfileData;
  phone?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Security Features

### Password Requirements
- Minimum 6 characters
- Recommended: uppercase, lowercase, numbers, symbols
- Secure hashing with bcrypt

### Session Management
- JWT tokens with expiration
- Secure cookie storage
- Automatic session refresh
- Secure logout process

### Rate Limiting
- Login attempts limited
- Password reset requests limited
- API endpoint protection

### Data Protection
- HTTPS encryption
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🎨 UI Components

### Authentication Components
- **AuthNavigation**: Consistent navigation across auth pages
- **SocialAuthButtons**: Social provider buttons
- **PasswordInput**: Secure password input with visibility toggle
- **FormValidation**: Real-time form validation

### Styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Automatic theme switching
- **Accessibility**: WCAG 2.1 AA compliance
- **Loading States**: User feedback during operations

## 🚦 Development Mode

### Demo Credentials
```
Email: demo@fixmyevent.com
Password: demo123
```

### Mock Authentication
- Firebase emulators for local development
- Mock social authentication
- Simulated email verification
- Demo user profiles

### Testing
- Jest unit tests for auth logic
- Playwright E2E tests for auth flows
- Component testing with React Testing Library

## 🔧 Configuration

### Environment Variables
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com

# Authentication Settings
NEXT_PUBLIC_ENABLE_SOCIAL_AUTH=true
NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION=true
NEXT_PUBLIC_ENABLE_MFA=false
```

### Firebase Configuration
```typescript
// src/lib/firebase.ts
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

## 🚀 Deployment

### Production Setup
1. Configure Firebase project
2. Set environment variables
3. Enable authentication providers
4. Configure domain allowlist
5. Set up email templates

### Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Firebase rules configured
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Monitoring enabled

## 🆘 Troubleshooting

### Common Issues

#### Authentication Failed
1. Check Firebase configuration
2. Verify environment variables
3. Check Firebase console for errors
4. Review browser console logs

#### Social Auth Not Working
1. Verify OAuth app configuration
2. Check redirect URIs
3. Verify API keys and secrets
4. Check provider status

#### Email Verification Issues
1. Check email template configuration
2. Verify sender email
3. Check spam folder
4. Verify email domain

### Debug Mode
Enable debug logging:
```typescript
// In development
console.log('Auth Debug:', { user, profile, session });
```

## 📚 Additional Resources

### Documentation
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [OAuth 2.0](https://oauth.net/2/)

### Security Best Practices
- [OWASP Authentication](https://owasp.org/www-project-cheat-sheets/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Security](https://jwt.io/introduction)

### UI/UX Guidelines
- [Material Design](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

## 🎉 Getting Started

1. **Explore the System**: Visit `/auth` to see all authentication options
2. **Try Demo Mode**: Use demo credentials to experience the platform
3. **Create Account**: Sign up with email or social provider
4. **Select Role**: Choose between user and vendor roles
5. **Access Platform**: Start using FixMyEvent features

For technical support or questions, please refer to the development team or create an issue in the project repository.

---

*This guide covers the complete authentication system for FixMyEvent. For specific implementation details, refer to the source code and API documentation.*
