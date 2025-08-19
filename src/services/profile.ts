import { doc, updateDoc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logServiceError, logUserAction } from '@/lib/logger';
import type { UserProfile, UpdateUserData } from '@/types/user';

export class ProfileService {
  /**
   * Update user profile
   */
  async update(userId: string, updates: UpdateUserData): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(userRef, updateData);
      
      logUserAction('profile_updated', userId, { updates });
    } catch (error) {
      logServiceError('ProfileService', 'update', error, { userId, updates });
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Update user role
   */
  async updateRole(userId: string, role: UserProfile['role']): Promise<void> {
    try {
      await this.update(userId, { role });
      logUserAction('role_updated', userId, { newRole: role });
    } catch (error) {
      logServiceError('ProfileService', 'updateRole', error, { userId, role });
      throw new Error('Failed to update user role');
    }
  }

  /**
   * Get user profile by ID
   */
  async getById(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      logServiceError('ProfileService', 'getById', error, { userId });
      throw new Error('Failed to get user profile');
    }
  }

  /**
   * Create or update user profile
   */
  async createOrUpdate(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp(),
      };
      
      if (userSnap.exists()) {
        await updateDoc(userRef, updateData);
      } else {
        await setDoc(userRef, {
          ...profileData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      
      logUserAction('profile_created_or_updated', userId, { profileData });
    } catch (error) {
      logServiceError('ProfileService', 'createOrUpdate', error, { userId, profileData });
      throw new Error('Failed to create or update profile');
    }
  }

  /**
   * Update vendor profile
   */
  async updateVendorProfile(userId: string, vendorProfile: UserProfile['vendorProfile']): Promise<void> {
    try {
      await this.update(userId, { vendorProfile });
      logUserAction('vendor_profile_updated', userId, { vendorProfile });
    } catch (error) {
      logServiceError('ProfileService', 'updateVendorProfile', error, { userId, vendorProfile });
      throw new Error('Failed to update vendor profile');
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: UserProfile['preferences']): Promise<void> {
    try {
      await this.update(userId, { preferences });
      logUserAction('preferences_updated', userId, { preferences });
    } catch (error) {
      logServiceError('ProfileService', 'updatePreferences', error, { userId, preferences });
      throw new Error('Failed to update preferences');
    }
  }

  /**
   * Verify user account
   */
  async verifyUser(userId: string): Promise<void> {
    try {
      await this.update(userId, { 
        isVerified: true, 
        verificationDate: serverTimestamp() 
      });
      logUserAction('user_verified', userId);
    } catch (error) {
      logServiceError('ProfileService', 'verifyUser', error, { userId });
      throw new Error('Failed to verify user');
    }
  }

  /**
   * Update last active timestamp
   */
  async updateLastActive(userId: string): Promise<void> {
    try {
      await this.update(userId, { lastActive: serverTimestamp() });
    } catch (error) {
      // Don't throw error for last active updates as they're not critical
      logServiceError('ProfileService', 'updateLastActive', error, { userId });
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();
