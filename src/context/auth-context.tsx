'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { authService } from '@/services/auth';
import { profileService } from '@/services/profile';
import { ErrorHandler } from '@/lib/errors';
import { useToast } from '@/hooks/use-toast';
import type { 
  UserProfile, 
  AuthUser, 
  UserSession
} from '@/types/user';
import type { UserRole } from '@/types/common';

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: UserSession | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profile: Omit<UserProfile['profile'], 'avatar'>) => Promise<void>;
  signOut: () => Promise<void>;
  becomeVendor: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  becomeVendor: async () => {},
  updateProfile: async () => {},
  updateUserRole: async () => {},
  refreshSession: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check if user is already signed in
        const currentUser = authService.getCurrentAuthUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Get user session
          const userSession = await authService.getUserSession();
          if (userSession) {
            setSession(userSession);
            setProfile(userSession.profile);
          }
        }
      } catch (err) {
        const appError = ErrorHandler.handle(err);
        setError(appError.message);
        console.error('Auth initialization error:', appError);
      } finally {
        setLoading(false);
      }
    };

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          phoneNumber: firebaseUser.phoneNumber,
        };
        
        setUser(authUser);
        
        try {
          const userSession = await authService.getUserSession();
          if (userSession) {
            setSession(userSession);
            setProfile(userSession.profile);
          }
        } catch (err) {
          console.error('Failed to get user session:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
      
      setLoading(false);
    });

    initializeAuth();
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signIn(email, password);
      
      toast({
        title: 'Success',
        description: 'Signed in successfully',
      });
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError.message);
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: appError.message,
      });
      throw appError;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string, profileData: Omit<UserProfile['profile'], 'avatar'>) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signUp({
        email,
        password,
        profile: profileData,
      });
      
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError.message);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: appError.message,
      });
      throw appError;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signOut();
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError.message);
      toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: appError.message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const becomeVendor = useCallback(async () => {
    try {
      if (!user) {
        throw new Error('You must be logged in to become a vendor');
      }
      
      setLoading(true);
      setError(null);
      
      // Update user role to vendor
      if (profile && profile.role === 'user') {
        const updatedProfile = { ...profile, role: 'user_vendor' as UserRole };
        setProfile(updatedProfile);
        
        // Update in database using profile service
        await profileService.updateRole(user.uid, 'user_vendor');
        
        toast({
          title: 'Congratulations!',
          description: 'You now have access to vendor tools.',
        });
      }
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: appError.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, profile, toast]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to update your profile');
      }
      
      setLoading(true);
      setError(null);
      
      // Update local state
      if (profile) {
        const updatedProfile = { ...profile, ...data };
        setProfile(updatedProfile);
      }
      
      // Update in database using profile service
      await profileService.update(user.uid, data);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError.message);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: appError.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, profile, toast]);

  const updateUserRole = useCallback(async (role: UserRole) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to update your role');
      }

      setLoading(true);
      setError(null);

      // Update local state
      if (profile) {
        const updatedProfile = { ...profile, role };
        setProfile(updatedProfile);
      }

      // Update in database using profile service
      await profileService.updateRole(user.uid, role as UserProfile['role']);

      toast({
        title: 'Success',
        description: `Role updated to ${role}`,
      });
    } catch (err) {
      const appError = ErrorHandler.handle(err);
      setError(appError.message);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: appError.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, profile, toast]);

  const refreshSession = useCallback(async () => {
    try {
      if (!user) return;
      
      const userSession = await authService.getUserSession();
      if (userSession) {
        setSession(userSession);
        setProfile(userSession.profile);
      }
    } catch (err) {
      console.error('Failed to refresh session:', err);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    becomeVendor,
    updateProfile,
    updateUserRole,
    refreshSession,
    clearError,
  }), [
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    becomeVendor,
    updateProfile,
    updateUserRole,
    refreshSession,
    clearError,
  ]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility hooks
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useProfile() {
  const { profile } = useAuth();
  return profile;
}

export function useSession() {
  const { session } = useAuth();
  return session;
}

export function useIsAuthenticated() {
  const { user } = useAuth();
  return !!user;
}

export function useIsVendor() {
  const { profile } = useAuth();
  return profile?.role === 'vendor' || profile?.role === 'user_vendor';
}

export function useIsAdmin() {
  const { profile } = useAuth();
  return profile?.role === 'admin';
}
