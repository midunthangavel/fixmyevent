
import type { Timestamp } from "firebase/firestore";
import type { BaseEntity, UserRole } from "./common";

export interface UserProfile extends BaseEntity {
  email: string;
  phone?: string;
  role: UserRole;
  badges?: string[];
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    location: {
        city: string;
        state: string;
        country: string;
    };
    bio?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  vendorProfile?: {
    businessName: string;
    businessType: 'individual' | 'company';
    businessLicense?: string;
    taxId?: string;
    specialties?: string[];
    yearsInBusiness?: number;
  };
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisible: boolean;
      showLocation: boolean;
      showContactInfo: boolean;
    };
    language: string;
    timezone: string;
  };
  lastActive?: Timestamp;
  isVerified?: boolean;
  verificationDate?: Timestamp;
}

// Extended user types for different contexts
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
}

export interface UserSession {
  user: AuthUser;
  profile: UserProfile;
  token: string;
  expiresAt: number;
}

// User creation and update types
export interface CreateUserData {
  email: string;
  password: string;
  profile: Omit<UserProfile['profile'], 'avatar'>;
  phone?: string;
}

export interface UpdateUserData {
  profile?: Partial<UserProfile['profile']>;
  phone?: string;
  preferences?: Partial<UserProfile['preferences']>;
  vendorProfile?: Partial<UserProfile['vendorProfile']>;
}

// User statistics
export interface UserStats {
  totalBookings: number;
  totalFavorites: number;
  totalReviews: number;
  averageRating: number;
  memberSince: Date;
  lastActivity: Date;
}
