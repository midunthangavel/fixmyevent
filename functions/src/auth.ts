import { onCall, HttpsError } from "firebase-functions/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

const auth = getAuth();
const db = getFirestore();

// User creation function
export const createUser = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { uid, email, displayName, phoneNumber } = request.data;

    // Validate input
    if (!uid || !email) {
      throw new HttpsError('invalid-argument', 'UID and email are required');
    }

    // Create user profile in Firestore
    const userProfile = {
      uid,
      email,
      displayName: displayName || null,
      phoneNumber: phoneNumber || null,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisible: true, showLocation: true, showContactInfo: false },
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      lastActive: new Date()
    };

    await db.collection('users').doc(uid).set(userProfile);

    logger.info('User profile created successfully', { uid, email });

    return {
      success: true,
      message: 'User profile created successfully',
      user: userProfile
    };

  } catch (error) {
    logger.error('Error creating user:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to create user profile');
  }
});

// Update user profile function
export const updateUserProfile = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { updates } = request.data;
    const uid = request.auth.uid;

    // Validate input
    if (!updates || typeof updates !== 'object') {
      throw new HttpsError('invalid-argument', 'Updates object is required');
    }

    // Remove sensitive fields that shouldn't be updated
    const { uid: _, role: __, createdAt: ___, ...safeUpdates } = updates;

    // Add updated timestamp
    safeUpdates.updatedAt = new Date();

    // Update user profile
    await db.collection('users').doc(uid).update(safeUpdates);

    logger.info('User profile updated successfully', { uid });

    return {
      success: true,
      message: 'User profile updated successfully'
    };

  } catch (error) {
    logger.error('Error updating user profile:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to update user profile');
  }
});

// Get user profile function
export const getUserProfile = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const uid = request.auth.uid;

    // Get user profile from Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User profile not found');
    }

    const userProfile = userDoc.data();

    logger.info('User profile retrieved successfully', { uid });

    return {
      success: true,
      user: userProfile
    };

  } catch (error) {
    logger.error('Error getting user profile:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to get user profile');
  }
});

// Delete user account function
export const deleteUserAccount = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const uid = request.auth.uid;

    // Delete user profile from Firestore
    await db.collection('users').doc(uid).delete();

    // Delete user from Firebase Auth
    await auth.deleteUser(uid);

    logger.info('User account deleted successfully', { uid });

    return {
      success: true,
      message: 'User account deleted successfully'
    };

  } catch (error) {
    logger.error('Error deleting user account:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to delete user account');
  }
});

// Update last active timestamp
export const updateLastActive = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const uid = request.auth.uid;

    // Update last active timestamp
    await db.collection('users').doc(uid).update({
      lastActive: new Date()
    });

    return {
      success: true,
      message: 'Last active timestamp updated'
    };

  } catch (error) {
    logger.error('Error updating last active timestamp:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    // Don't throw error for last active update - it's not critical
    return {
      success: false,
      message: 'Failed to update last active timestamp'
    };
  }
});

