import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  Package, 
 
  PackageBooking, 
  PackageTemplate,
  PackageComparison,
  PackageRecommendation 
} from '@/types/package';

// Collection names
export const COLLECTIONS = {
  PACKAGES: 'packages',
  PACKAGE_BOOKINGS: 'package_bookings',
  PACKAGE_TEMPLATES: 'package_templates',
  PACKAGE_COMPARISONS: 'package_comparisons',
  PACKAGE_RECOMMENDATIONS: 'package_recommendations',
} as const;

// Package service class
export class PackageService {
  private packagesRef = collection(db, COLLECTIONS.PACKAGES);
  private packageBookingsRef = collection(db, COLLECTIONS.PACKAGE_BOOKINGS);
  private packageTemplatesRef = collection(db, COLLECTIONS.PACKAGE_TEMPLATES);
  private packageComparisonsRef = collection(db, COLLECTIONS.PACKAGE_COMPARISONS);
  private packageRecommendationsRef = collection(db, COLLECTIONS.PACKAGE_RECOMMENDATIONS);

  // Create a package
  async createPackage(packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const packageObj = {
        ...packageData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.packagesRef, {
        ...packageObj,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  }

  // Get package by ID
  async getPackageById(packageId: string): Promise<Package | null> {
    try {
      const docRef = doc(this.packagesRef, packageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Package;
      }
      return null;
    } catch (error) {
      console.error('Error getting package by ID:', error);
      return null;
    }
  }

  // Get all packages for a vendor
  async getVendorPackages(vendorId: string): Promise<Package[]> {
    try {
      const q = query(
        this.packagesRef,
        where('vendorId', '==', vendorId),
        where('status', 'in', ['active', 'draft']),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Package[];
    } catch (error) {
      console.error('Error getting vendor packages:', error);
      return [];
    }
  }

  // Get all active packages
  async getActivePackages(type?: string): Promise<Package[]> {
    try {
      let q = query(
        this.packagesRef,
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );

      if (type) {
        q = query(q, where('type', '==', type));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Package[];
    } catch (error) {
      console.error('Error getting active packages:', error);
      return [];
    }
  }

  // Update package
  async updatePackage(packageId: string, updateData: Partial<Package>): Promise<void> {
    try {
      const docRef = doc(this.packagesRef, packageId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  }

  // Delete package
  async deletePackage(packageId: string): Promise<void> {
    try {
      const docRef = doc(this.packagesRef, packageId);
      await updateDoc(docRef, {
        status: 'archived',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }

  // Create package booking
  async createPackageBooking(bookingData: Omit<PackageBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const booking = {
        ...bookingData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.packageBookingsRef, {
        ...booking,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating package booking:', error);
      throw error;
    }
  }

  // Get package bookings for a user
  async getUserPackageBookings(userId: string): Promise<PackageBooking[]> {
    try {
      const q = query(
        this.packageBookingsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as PackageBooking[];
    } catch (error) {
      console.error('Error getting user package bookings:', error);
      return [];
    }
  }

  // Get package bookings for a vendor
  async getVendorPackageBookings(vendorId: string): Promise<PackageBooking[]> {
    try {
      const q = query(
        this.packageBookingsRef,
        where('vendorId', '==', vendorId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as PackageBooking[];
    } catch (error) {
      console.error('Error getting vendor package bookings:', error);
      return [];
    }
  }

  // Update package booking status
  async updatePackageBookingStatus(bookingId: string, status: string): Promise<void> {
    try {
      const docRef = doc(this.packageBookingsRef, bookingId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating package booking status:', error);
      throw error;
    }
  }

  // Create package template
  async createPackageTemplate(templateData: Omit<PackageTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const template = {
        ...templateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.packageTemplatesRef, {
        ...template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating package template:', error);
      throw error;
    }
  }

  // Get package templates
  async getPackageTemplates(category?: string): Promise<PackageTemplate[]> {
    try {
      let q = query(
        this.packageTemplatesRef,
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );

      if (category) {
        q = query(q, where('category', '==', category));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as PackageTemplate[];
    } catch (error) {
      console.error('Error getting package templates:', error);
      return [];
    }
  }

  // Create package comparison
  async createPackageComparison(comparisonData: Omit<PackageComparison, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const comparison = {
        ...comparisonData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.packageComparisonsRef, {
        ...comparison,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating package comparison:', error);
      throw error;
    }
  }

  // Get package comparisons for a user
  async getUserPackageComparisons(userId: string): Promise<PackageComparison[]> {
    try {
      const q = query(
        this.packageComparisonsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as PackageComparison[];
    } catch (error) {
      console.error('Error getting user package comparisons:', error);
      return [];
    }
  }

  // Create package recommendation
  async createPackageRecommendation(recommendationData: Omit<PackageRecommendation, 'id' | 'createdAt'>): Promise<string> {
    try {
      const recommendation = {
        ...recommendationData,
        createdAt: new Date(),
      };

      const docRef = await addDoc(this.packageRecommendationsRef, {
        ...recommendation,
        createdAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating package recommendation:', error);
      throw error;
    }
  }

  // Get package recommendations for a user
  async getUserPackageRecommendations(userId: string): Promise<PackageRecommendation[]> {
    try {
      const q = query(
        this.packageRecommendationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as PackageRecommendation[];
    } catch (error) {
      console.error('Error getting user package recommendations:', error);
      return [];
    }
  }

  // Search packages
  async searchPackages(
    searchQuery: string,
    type?: string,
    minPrice?: number,
    maxPrice?: number,
    _location?: string
  ): Promise<Package[]> {
    try {
      let q = query(
        this.packagesRef,
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );

      // In a real implementation, you would use Firestore's text search capabilities
      // or integrate with a search service like Algolia
      
      const querySnapshot = await getDocs(q);
      let packages = querySnapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Package;
      });

      // Filter by search criteria
      if (searchQuery) {
        packages = packages.filter(pkg => 
          pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (type) {
        packages = packages.filter(pkg => pkg.type === type);
      }

      if (minPrice !== undefined) {
        packages = packages.filter(pkg => pkg.pricing.discountedPrice >= minPrice);
      }

      if (maxPrice !== undefined) {
        packages = packages.filter(pkg => pkg.pricing.discountedPrice <= maxPrice);
      }

      return packages;
    } catch (error) {
      console.error('Error searching packages:', error);
      return [];
    }
  }

  // Get package statistics
  async getPackageStats(vendorId?: string): Promise<{
    totalPackages: number;
    activePackages: number;
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
  }> {
    try {
      let packagesQuery = query(this.packagesRef);
      let bookingsQuery = query(this.packageBookingsRef);
      
      if (vendorId) {
        packagesQuery = query(packagesQuery, where('vendorId', '==', vendorId));
        bookingsQuery = query(bookingsQuery, where('vendorId', '==', vendorId));
      }
      
      const packagesSnapshot = await getDocs(packagesQuery);
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      const stats = {
        totalPackages: 0,
        activePackages: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
      };

      let totalRating = 0;
      let ratingCount = 0;

      packagesSnapshot.docs.forEach(doc => {
        const pkg = doc.data();
        stats.totalPackages++;
        
        if (pkg.status === 'active') {
          stats.activePackages++;
        }
        
        if (pkg.rating > 0) {
          totalRating += pkg.rating;
          ratingCount++;
        }
      });

      bookingsSnapshot.docs.forEach(doc => {
        const booking = doc.data();
        stats.totalBookings++;
        
        if (booking.paymentStatus === 'completed') {
          stats.totalRevenue += booking.pricing.total;
        }
      });

      if (ratingCount > 0) {
        stats.averageRating = totalRating / ratingCount;
      }

      return stats;
    } catch (error) {
      console.error('Error getting package stats:', error);
      return {
        totalPackages: 0,
        activePackages: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
      };
    }
  }

  // Real-time package updates
  subscribeToVendorPackages(vendorId: string, callback: (packages: Package[]) => void) {
    const q = query(
      this.packagesRef,
      where('vendorId', '==', vendorId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const packages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Package[];
      
      callback(packages);
    });
  }

  // Real-time package booking updates
  subscribeToPackageBookings(userId: string, callback: (bookings: PackageBooking[]) => void) {
    const q = query(
      this.packageBookingsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as PackageBooking[];
      
      callback(bookings);
    });
  }
}

// Export singleton instance
export const packageService = new PackageService();
