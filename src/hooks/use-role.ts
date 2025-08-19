import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/types/common';

export function useRole() {
  const { profile } = useAuth();
  
  const userRole = profile?.role || 'user';
  
  const isUser = userRole === 'user';
  const isVendor = userRole === 'vendor';
  const isUserVendor = userRole === 'user_vendor';
  const isAdmin = userRole === 'admin';
  
  const canAccessVendorFeatures = isVendor || isUserVendor || isAdmin;
  const canAccessAdminFeatures = isAdmin;
  
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'user':
        return 'User';
      case 'vendor':
        return 'Vendor';
      case 'user_vendor':
        return 'User & Vendor';
      case 'admin':
        return 'Administrator';
      default:
        return 'Unknown';
    }
  };
  
  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'user':
        return 'Search and book services';
      case 'vendor':
        return 'Provide business services';
      case 'user_vendor':
        return 'Both search and provide services';
      case 'admin':
        return 'Full system access';
      default:
        return '';
    }
  };
  
  return {
    userRole,
    isUser,
    isVendor,
    isUserVendor,
    isAdmin,
    canAccessVendorFeatures,
    canAccessAdminFeatures,
    getRoleDisplayName,
    getRoleDescription,
  };
}
