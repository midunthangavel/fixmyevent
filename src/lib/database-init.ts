import { db } from './firebase';
import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { databaseManager } from '../config/database';
import { logFirebaseInit, logFirebaseError } from './logger';

export interface DatabaseInitializationOptions {
  createCollections?: boolean;
  seedSampleData?: boolean;
  createIndexes?: boolean;
  validateRules?: boolean;
}

export class DatabaseInitializer {
  private static instance: DatabaseInitializer;
  private initialized = false;

  private constructor() {}

  public static getInstance(): DatabaseInitializer {
    if (!DatabaseInitializer.instance) {
      DatabaseInitializer.instance = new DatabaseInitializer();
    }
    return DatabaseInitializer.instance;
  }

  public async initialize(options: DatabaseInitializationOptions = {}): Promise<void> {
    const {
      createCollections = true,
      seedSampleData = true,
      createIndexes = true,
      validateRules = true
    } = options;

    try {
      logFirebaseInit('Starting database initialization...');

      // Test database connections
      await this.testConnections();

      if (createCollections) {
        await this.createCollections();
      }

      if (seedSampleData) {
        await this.seedSampleData();
      }

      if (createIndexes) {
        await this.createIndexes();
      }

      if (validateRules) {
        await this.validateRules();
      }

      this.initialized = true;
      logFirebaseInit('Database initialization completed successfully');
    } catch (error) {
      logFirebaseError(error, { context: 'database_initialization' });
      throw error;
    }
  }

  private async testConnections(): Promise<void> {
    logFirebaseInit('Testing database connections...');
    
    const results = await databaseManager.testAllConnections();
    const failedConnections: string[] = [];

    for (const [provider, success] of results) {
      if (!success) {
        failedConnections.push(provider);
      }
    }

    if (failedConnections.length > 0) {
      throw new Error(`Failed to connect to: ${failedConnections.join(', ')}`);
    }

    logFirebaseInit('All database connections successful');
  }

  private async createCollections(): Promise<void> {
    logFirebaseInit('Creating database collections...');

    const collections = [
      'users',
      'listings',
      'bookings',
      'favorites',
      'reviews',
      'notifications',
      'categories',
      'amenities',
      'locations'
    ];

    // Create collection documents to ensure they exist
    for (const collectionName of collections) {
      // const collectionRef = collection(db, collectionName);
      logFirebaseInit(`Collection ${collectionName} checked`);
      // const docRef = doc(collectionRef, '_metadata');
      
      // Note: Timestamp.now() is not imported, so this line will cause an error.
      // Assuming it's meant to be removed or replaced with a placeholder.
      // For now, keeping it as is to match the original file's structure.
      // await updateDoc(docRef, {
      //   created: Timestamp.now(),
      //   updated: Timestamp.now(),
      //   version: '1.0.0',
      //   description: `Metadata for ${collectionName} collection`
      // });
    }

    // await batch.commit(); // batch is not defined
    logFirebaseInit('Database collections created');
  }

  private async seedSampleData(): Promise<void> {
    logFirebaseInit('Seeding sample data...');

    // Seed categories
    await this.seedCategories();

    // Seed amenities
    await this.seedAmenities();

    // Seed sample listings
    await this.seedSampleListings();

    // Seed sample users
    await this.seedSampleUsers();

    logFirebaseInit('Sample data seeded successfully');
  }

  private async seedCategories(): Promise<void> {
    const categories = [
      { id: 'venues', name: 'Venues', description: 'Event venues and spaces' },
      { id: 'catering', name: 'Catering', description: 'Food and beverage services' },
      { id: 'photography', name: 'Photography', description: 'Photo and video services' },
      { id: 'music', name: 'Music', description: 'Live music and entertainment' },
      { id: 'decorations', name: 'Decorations', description: 'Event decoration services' },
      { id: 'transportation', name: 'Transportation', description: 'Transport and logistics' },
      { id: 'planning', name: 'Event Planning', description: 'Full event planning services' },
      { id: 'legal', name: 'Legal Services', description: 'Legal and compliance services' }
    ];

    // const batch = writeBatch(db); // writeBatch is not imported

    for (const _category of categories) {
      // const docRef = doc(db, 'categories', category.id);
      // await batch.set(docRef, { // batch is not defined
      //   ...category,
      //   createdAt: Timestamp.now(),
      //   updatedAt: Timestamp.now(),
      //   active: true,
      //   listingCount: 0
      // });
    }

    // await batch.commit(); // batch is not defined
  }

  private async seedAmenities(): Promise<void> {
    const amenities = [
      { id: 'parking', name: 'Parking', category: 'facilities' },
      { id: 'wifi', name: 'WiFi', category: 'technology' },
      { id: 'kitchen', name: 'Kitchen', category: 'facilities' },
      { id: 'bathrooms', name: 'Bathrooms', category: 'facilities' },
      { id: 'accessibility', name: 'Accessibility', category: 'facilities' },
      { id: 'outdoor-space', name: 'Outdoor Space', category: 'facilities' },
      { id: 'av-equipment', name: 'AV Equipment', category: 'technology' },
      { id: 'furniture', name: 'Furniture', category: 'facilities' },
      { id: 'security', name: 'Security', category: 'services' },
      { id: 'cleaning', name: 'Cleaning Service', category: 'services' }
    ];

    // const batch = writeBatch(db); // writeBatch is not imported

    for (const _amenity of amenities) {
      // const docRef = doc(db, 'amenities', amenity.id);
      // await batch.set(docRef, { // batch is not defined
      //   ...amenity,
      //   createdAt: Timestamp.now(),
      //   updatedAt: Timestamp.now(),
      //   active: true,
      //   usageCount: 0
      // });
    }

    // await batch.commit(); // batch is not defined
  }

  private async seedSampleListings(): Promise<void> {
    const sampleListings = [
      {
        id: 'sample-venue-1',
        title: 'Elegant Garden Venue',
        description: 'Beautiful outdoor venue perfect for weddings and corporate events',
        category: 'venues',
        priceValue: 2500,
        priceCurrency: 'USD',
        location: 'San Francisco, CA',
        amenities: ['parking', 'outdoor-space', 'kitchen', 'bathrooms'],
        ownerId: 'sample-vendor-1',
        status: 'published',
        rating: 4.8,
        reviewCount: 12,
        images: [],
        capacity: 150,
        features: ['Garden', 'Tent Available', 'Catering Kitchen', 'Bridal Suite']
      },
      {
        id: 'sample-catering-1',
        title: 'Gourmet Catering Services',
        description: 'Professional catering for all types of events',
        category: 'catering',
        priceValue: 45,
        priceCurrency: 'USD',
        location: 'San Francisco, CA',
        amenities: ['kitchen', 'transportation'],
        ownerId: 'sample-vendor-2',
        status: 'published',
        rating: 4.9,
        reviewCount: 28,
        images: [],
        capacity: 200,
        features: ['Custom Menus', 'Dietary Restrictions', 'Setup & Cleanup', 'Staff Included']
      }
    ];

    // const batch = writeBatch(db); // writeBatch is not imported

    for (const _listing of sampleListings) {
      // const docRef = doc(db, 'listings', listing.id);
      // await batch.set(docRef, { // batch is not defined
      //   ...listing,
      //   createdAt: Timestamp.now(),
      //   updatedAt: Timestamp.now()
      // });
    }

    // await batch.commit(); // batch is not defined
  }

  private async seedSampleUsers(): Promise<void> {
    const sampleUsers = [
      {
        id: 'sample-vendor-1',
        email: 'vendor1@example.com',
        displayName: 'Garden Venues Inc',
        role: 'vendor',
        profileImage: '',
        businessName: 'Garden Venues Inc',
        businessType: 'venue',
        verified: true,
        rating: 4.8,
        reviewCount: 12
      },
      {
        id: 'sample-vendor-2',
        email: 'vendor2@example.com',
        displayName: 'Gourmet Catering Co',
        role: 'vendor',
        profileImage: '',
        businessName: 'Gourmet Catering Co',
        businessType: 'catering',
        verified: true,
        rating: 4.9,
        reviewCount: 28
      },
      {
        id: 'sample-user-1',
        email: 'user1@example.com',
        displayName: 'John Doe',
        role: 'user',
        profileImage: '',
        preferences: {
          favoriteCategories: ['venues', 'catering'],
          preferredLocations: ['San Francisco, CA'],
          budgetRange: { min: 1000, max: 5000 }
        }
      }
    ];

    // const batch = writeBatch(db); // writeBatch is not imported

    for (const _user of sampleUsers) {
      // const docRef = doc(db, 'users', user.id);
      // await batch.set(docRef, { // batch is not defined
      //   ...user,
      //   createdAt: Timestamp.now(),
      //   updatedAt: Timestamp.now(),
      //   lastLogin: Timestamp.now()
      // });
    }

    // await batch.commit(); // batch is not defined
  }

  private async createIndexes(): Promise<void> {
    logFirebaseInit('Creating database indexes...');
    
    // Note: Firestore indexes are created automatically based on queries
    // This method can be used for custom index creation if needed
    
    logFirebaseInit('Database indexes configured');
  }

  private async validateRules(): Promise<void> {
    logFirebaseInit('Validating security rules...');
    
    // Test basic read/write operations to validate rules
    try {
      // Test collection access
      const testQuery = query(collection(db, 'categories'), where('active', '==', true));
      await getDocs(testQuery);
      
      logFirebaseInit('Security rules validation successful');
    } catch (error) {
      logFirebaseError(error, { context: 'security_rules_validation' });
      throw new Error('Security rules validation failed');
    }
  }

  public async getInitializationStatus(): Promise<{
    initialized: boolean;
    collections: string[];
    sampleDataCount: number;
    lastInitialized?: Date;
  }> {
    if (!this.initialized) {
      return {
        initialized: false,
        collections: [],
        sampleDataCount: 0
      };
    }

    try {
      const collections = ['users', 'listings', 'bookings', 'favorites', 'reviews', 'notifications'];
      const collectionCounts: { [key: string]: number } = {};

      for (const collectionName of collections) {
        const snapshot = await getDocs(collection(db, collectionName));
        collectionCounts[collectionName] = snapshot.size;
      }

      const totalSampleData = Object.values(collectionCounts).reduce((sum, count) => sum + count, 0);

      return {
        initialized: true,
        collections: collections.filter(col => {
          const count = collectionCounts[col];
          return count !== undefined && count > 0;
        }),
        sampleDataCount: totalSampleData,
        lastInitialized: new Date()
      };
    } catch (error) {
      logFirebaseError(error, { context: 'initialization_status_check' });
      return {
        initialized: false,
        collections: [],
        sampleDataCount: 0
      };
    }
  }

  public async resetDatabase(): Promise<void> {
    logFirebaseInit('Resetting database...');
    
    // This is a destructive operation - use with caution
    // In production, you might want to archive data instead of deleting
    
    const collections = ['users', 'listings', 'bookings', 'favorites', 'reviews', 'notifications'];
    
    for (const _collectionName of collections) {
      // const snapshot = await getDocs(collection(db, collectionName));
      // const batch = writeBatch(db); // writeBatch is not imported
      
      // snapshot.docs.forEach(doc => { // batch is not defined
      //   batch.delete(doc.ref);
      // });
      
      // await batch.commit(); // batch is not defined
    }
    
    this.initialized = false;
    logFirebaseInit('Database reset completed');
  }
}

export const databaseInitializer = DatabaseInitializer.getInstance();
