
/**
 * To seed the database, run the following command from your terminal:
 * npx tsx src/lib/seed.ts
 * 
 * Make sure you have tsx installed globally or as a dev dependency.
 */
import { listingsService, usersService, favoritesService } from '@/services/database';
import { storageService } from '@/services/storage';
import type { Listing, ListingFormValues } from '@/types/listing';
import type { UserProfile } from '@/types/user';

// Sample data for seeding the database
const sampleUsers: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    email: 'john.doe@example.com',
    phone: '+1234567890',
    role: 'user',
    badges: ['verified'],
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: {
        city: 'New York',
        state: 'NY',
        country: 'USA',
      },
    },
  },
  {
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    role: 'vendor',
    badges: ['verified', 'premium'],
    profile: {
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      location: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
      },
    },
    vendorProfile: {
      businessName: 'Elegant Events',
      businessType: 'company',
    },
  },
];

const sampleListings: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    category: 'Venue',
    name: 'Grand Ballroom at The Plaza',
    email: 'events@theplaza.com',
    phone: '+1234567890',
    address: '768 5th Ave, New York, NY 10019',
    description: 'An elegant and spacious ballroom perfect for weddings, corporate events, and special celebrations. Features include crystal chandeliers, marble floors, and panoramic city views.',
    photos: [],
    slug: 'grand-ballroom-plaza',
    ownerId: 'user-2',
    location: 'New York',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    hint: 'Luxury venue with city views',
    rating: 4.8,
    reviewCount: 127,
    price: '$5,000 - $15,000',
    priceValue: 10000,
    guestCapacity: 300,
    amenities: ['Parking', 'Catering', 'Audio/Visual', 'WiFi', 'Accessibility'],
    guestFavorite: true,
    reviews: [
      {
        rating: 5,
        comment: 'Absolutely stunning venue! Our wedding was perfect.',
        authorName: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      },
      {
        rating: 4,
        comment: 'Great service and beautiful space. Highly recommend!',
        authorName: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      },
    ],
  },
  {
    category: 'Venue',
    name: 'Riverside Garden Pavilion',
    email: 'info@riversidegarden.com',
    phone: '+1987654321',
    address: '123 River Rd, Los Angeles, CA 90210',
    description: 'A beautiful outdoor venue surrounded by lush gardens and flowing water features. Perfect for intimate gatherings and outdoor celebrations.',
    photos: [],
    slug: 'riverside-garden-pavilion',
    ownerId: 'user-2',
    location: 'Los Angeles',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
    hint: 'Outdoor garden venue',
    rating: 4.6,
    reviewCount: 89,
    price: '$2,500 - $8,000',
    priceValue: 5250,
    guestCapacity: 150,
    amenities: ['Garden', 'Outdoor Space', 'Parking', 'Restrooms', 'Kitchen'],
    guestFavorite: false,
    reviews: [
      {
        rating: 5,
        comment: 'Beautiful outdoor setting, perfect for our summer wedding!',
        authorName: 'Emily Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      },
    ],
  },
  {
    category: 'Catering',
    name: 'Gourmet Delights Catering',
    email: 'catering@gourmetdelights.com',
    phone: '+1555123456',
    address: '456 Food St, New York, NY 10001',
    description: 'Professional catering service specializing in gourmet cuisine for all types of events. From intimate dinners to large corporate functions.',
    photos: [],
    slug: 'gourmet-delights-catering',
    ownerId: 'user-2',
    location: 'New York',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    hint: 'Gourmet catering service',
    rating: 4.7,
    reviewCount: 203,
    price: '$45 - $85 per person',
    priceValue: 65,
    guestCapacity: 500,
    amenities: ['Full Service', 'Custom Menus', 'Dietary Options', 'Staff', 'Equipment'],
    guestFavorite: true,
    reviews: [
      {
        rating: 5,
        comment: 'Exceptional food and service. Our guests were impressed!',
        authorName: 'David Wilson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      },
    ],
  },
];

/**
 * Seed the database with sample data
 */
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed users
    console.log('Seeding users...');
    for (const userData of sampleUsers) {
      try {
        await usersService.create(userData);
        console.log(`Created user: ${userData.email}`);
      } catch (error) {
        console.log(`User ${userData.email} already exists or error:`, error);
      }
    }

    // Seed listings
    console.log('Seeding listings...');
    for (const listingData of sampleListings) {
      try {
        await listingsService.create(listingData);
        console.log(`Created listing: ${listingData.name}`);
      } catch (error) {
        console.log(`Listing ${listingData.name} already exists or error:`, error);
      }
    }

    // Seed some favorites
    console.log('Seeding favorites...');
    try {
      await favoritesService.create({
        userId: 'user-1',
        listingId: 'grand-ballroom-plaza',
        createdAt: new Date(),
      });
      console.log('Created favorite: Grand Ballroom');
    } catch (error) {
      console.log('Favorite already exists or error:', error);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

/**
 * Clear all data from the database (use with caution!)
 */
export async function clearDatabase() {
  try {
    console.log('Starting database cleanup...');

    // Get all documents from each collection
    const listings = await listingsService.getAll();
    const users = await usersService.getAll();
    const favorites = await favoritesService.getAll();

    // Delete all documents
    for (const listing of listings) {
      await listingsService.delete(listing.id!);
    }
    console.log(`Deleted ${listings.length} listings`);

    for (const user of users) {
      await usersService.delete(user.id!);
    }
    console.log(`Deleted ${users.length} users`);

    for (const favorite of favorites) {
      await favoritesService.delete(favorite.id!);
    }
    console.log(`Deleted ${favorites.length} favorites`);

    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

/**
 * Check database status
 */
export async function checkDatabaseStatus() {
  try {
    const listingsCount = (await listingsService.getAll()).length;
    const usersCount = (await usersService.getAll()).length;
    const favoritesCount = (await favoritesService.getAll()).length;

    console.log('Database Status:');
    console.log(`- Listings: ${listingsCount}`);
    console.log(`- Users: ${usersCount}`);
    console.log(`- Favorites: ${favoritesCount}`);

    return { listingsCount, usersCount, favoritesCount };
  } catch (error) {
    console.error('Error checking database status:', error);
    return { listingsCount: 0, usersCount: 0, favoritesCount: 0 };
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
