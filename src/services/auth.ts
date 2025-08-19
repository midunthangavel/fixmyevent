import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usersService } from './database';
import { AppError, ERROR_CODES, ErrorHandler, ErrorLogger } from '@/lib/errors';
import { ValidationUtils, userSchemas } from '@/lib/validation';
import type { 
  UserProfile, 
  AuthUser, 
  CreateUserData, 
  UpdateUserData,
  UserSession 
} from '@/types/user';

export class AuthService {
  private auth = auth;

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      // Validate input
      if (!email || !password) {
        throw new AppError('Email and password are required', ERROR_CODES.VALIDATION_REQUIRED_FIELD, 400);
      }

      if (!ValidationUtils.validateEmail(email)) {
        throw new AppError('Invalid email format', ERROR_CODES.VALIDATION_INVALID_FORMAT, 400);
      }

      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Update last active timestamp
      if (result.user) {
        await this.updateLastActive(result.user.uid);
      }

      return result;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'signIn', email });
      throw appError;
    }
  }

  // Create new user account
  async signUp(userData: CreateUserData): Promise<UserCredential> {
    try {
      // Validate user data
      const validatedData = ValidationUtils.validate(userSchemas.profile, userData.profile);
      
      if (!ValidationUtils.validateEmail(userData.email)) {
        throw new AppError('Invalid email format', ERROR_CODES.VALIDATION_INVALID_FORMAT, 400);
      }

      if (!ValidationUtils.validatePassword(userData.password)) {
        throw new AppError('Password does not meet requirements', ERROR_CODES.VALIDATION_INVALID_VALUE, 400);
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        userData.email, 
        userData.password
      );
      
      // Create user profile in Firestore
      if (userCredential.user) {
        const userProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
          email: userCredential.user.email!,
          role: 'user',
          profile: validatedData,
          phone: userData.phone,
          preferences: {
            notifications: { email: true, push: true, sms: false },
            privacy: { profileVisible: true, showLocation: true, showContactInfo: false },
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        };

        await usersService.create(userProfile);
      }

      return userCredential;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'signUp', email: userData.email });
      throw appError;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'signOut' });
      throw appError;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Get current user as AuthUser
  getCurrentAuthUser(): AuthUser | null {
    const user = this.auth.currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
    };
  }

  // Listen to authentication state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      if (!email) {
        throw new AppError('Email is required', ERROR_CODES.VALIDATION_REQUIRED_FIELD, 400);
      }

      if (!ValidationUtils.validateEmail(email)) {
        throw new AppError('Invalid email format', ERROR_CODES.VALIDATION_INVALID_FORMAT, 400);
      }

      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'sendPasswordResetEmail', email });
      throw appError;
    }
  }

  // Update user profile
  async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new AppError('No user is currently signed in', ERROR_CODES.AUTH_UNAUTHORIZED, 401);
      }

      const updates: { displayName?: string; photoURL?: string } = {};
      
      if (displayName !== undefined) {
        if (displayName && !ValidationUtils.validateMinLength(displayName, 2, 'Display name')) {
          throw new AppError('Display name must be at least 2 characters', ERROR_CODES.VALIDATION_TOO_SHORT, 400);
        }
        updates.displayName = displayName;
      }

      if (photoURL !== undefined) {
        if (photoURL && !ValidationUtils.validateUrl(photoURL)) {
          throw new AppError('Invalid photo URL format', ERROR_CODES.VALIDATION_INVALID_FORMAT, 400);
        }
        updates.photoURL = photoURL;
      }

      await updateProfile(this.auth.currentUser, updates);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'updateUserProfile' });
      throw appError;
    }
  }

  // Update user email
  async updateUserEmail(newEmail: string): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new AppError('No user is currently signed in', ERROR_CODES.AUTH_UNAUTHORIZED, 401);
      }

      if (!ValidationUtils.validateEmail(newEmail)) {
        throw new AppError('Invalid email format', ERROR_CODES.VALIDATION_INVALID_FORMAT, 400);
      }

      await updateEmail(this.auth.currentUser, newEmail);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'updateUserEmail', newEmail });
      throw appError;
    }
  }

  // Update user password
  async updateUserPassword(newPassword: string): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new AppError('No user is currently signed in', ERROR_CODES.AUTH_UNAUTHORIZED, 401);
      }

      if (!ValidationUtils.validatePassword(newPassword)) {
        throw new AppError('Password does not meet requirements', ERROR_CODES.VALIDATION_INVALID_VALUE, 400);
      }

      await updatePassword(this.auth.currentUser, newPassword);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'updateUserPassword' });
      throw appError;
    }
  }

  // Delete user account
  async deleteUserAccount(password: string): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new AppError('No user is currently signed in', ERROR_CODES.AUTH_UNAUTHORIZED, 401);
      }

      if (!password) {
        throw new AppError('Password is required for account deletion', ERROR_CODES.VALIDATION_REQUIRED_FIELD, 400);
      }

      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(
        this.auth.currentUser.email!,
        password
      );
      
      await reauthenticateWithCredential(this.auth.currentUser, credential);
      
      // Delete user profile from Firestore first
      await usersService.delete(this.auth.currentUser.uid);
      
      // Delete Firebase auth user
      await deleteUser(this.auth.currentUser);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'deleteUserAccount' });
      throw appError;
    }
  }

  // Update last active timestamp
  private async updateLastActive(uid: string): Promise<void> {
    try {
      await usersService.update(uid, {
        lastActive: new Date()
      } as any);
    } catch (error) {
      // Don't throw error for last active update - it's not critical
      console.warn('Failed to update last active timestamp:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  // Check if user email is verified
  isEmailVerified(): boolean {
    return this.auth.currentUser?.emailVerified ?? false;
  }

  // Get user session data
  async getUserSession(): Promise<UserSession | null> {
    try {
      const user = this.getCurrentAuthUser();
      if (!user) return null;

      const profile = await usersService.getById(user.uid);
      if (!profile) return null;

      // Get ID token for session
      const token = await this.auth.currentUser!.getIdToken();
      const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour

      return {
        user,
        profile,
        token,
        expiresAt
      };
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { operation: 'getUserSession' });
      return null;
    }
  }
}

// Password validation helper
export function validatePassword(password: string): boolean {
  return password.length >= 8 && 
         /[a-z]/.test(password) && 
         /[A-Z]/.test(password) && 
         /\d/.test(password);
}

// Export singleton instance
export const authService = new AuthService();
