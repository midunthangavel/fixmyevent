import type { Listing } from '@/types/listing';

// Mock data for development when Firebase is not configured
export const mockVenues: Listing[] = [
  {
    id: 'venue-1',
    slug: 'grand-hotel-ballroom',
    name: 'Grand Hotel Ballroom',
    category: 'Venue',
    description: 'Elegant ballroom perfect for weddings and corporate events. Features crystal chandeliers, marble floors, and stunning city views.',
    location: 'Downtown City Center',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop',
    hint: 'luxury hotel ballroom wedding venue',
    rating: 4.8,
    reviewCount: 127,
    price: 'From $5,000',
    priceValue: 5000,
    guestCapacity: 300,
    amenities: ['Parking', 'Catering', 'AV Equipment', 'Bridal Suite'],
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [
      {
        rating: 5,
        comment: 'Absolutely stunning venue! Our wedding was perfect here.',
        authorName: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        rating: 4,
        comment: 'Great service and beautiful space. Highly recommend!',
        authorName: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    ]
  },
  {
    id: 'venue-2',
    slug: 'garden-pavilion',
    name: 'Garden Pavilion',
    category: 'Venue',
    description: 'Outdoor venue surrounded by beautiful gardens. Perfect for summer weddings and outdoor celebrations.',
    location: 'Botanical Gardens',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
    hint: 'outdoor garden wedding venue',
    rating: 4.6,
    reviewCount: 89,
    price: 'From $3,500',
    priceValue: 3500,
    guestCapacity: 150,
    amenities: ['Outdoor Space', 'Garden Access', 'Restrooms', 'Parking'],
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [
      {
        rating: 5,
        comment: 'The gardens were absolutely magical for our wedding!',
        authorName: 'Emma Davis',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    ]
  },
  {
    id: 'venue-3',
    slug: 'industrial-loft',
    name: 'Industrial Loft',
    category: 'Venue',
    description: 'Modern industrial space with exposed brick and high ceilings. Perfect for contemporary events and art exhibitions.',
    location: 'Arts District',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    hint: 'modern industrial event space',
    rating: 4.4,
    reviewCount: 56,
    price: 'From $2,800',
    priceValue: 2800,
    guestCapacity: 120,
    amenities: ['High Ceilings', 'Exposed Brick', 'Modern Lighting', 'Kitchen'],
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [
      {
        rating: 4,
        comment: 'Great space for our art gallery opening!',
        authorName: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      }
    ]
  },
  {
    id: 'venue-4',
    slug: 'beachfront-resort',
    name: 'Beachfront Resort',
    category: 'Venue',
    description: 'Stunning beachfront location with ocean views. Perfect for destination weddings and beach events.',
    location: 'Coastal Paradise',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
    hint: 'beachfront resort wedding venue',
    rating: 4.9,
    reviewCount: 203,
    price: 'From $8,000',
    priceValue: 8000,
    guestCapacity: 250,
    amenities: ['Beach Access', 'Ocean Views', 'Resort Amenities', 'Catering'],
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [
      {
        rating: 5,
        comment: 'Breathtaking views and perfect service!',
        authorName: 'Jennifer Lee',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
      }
    ]
  }
];

export const mockPhotographers: Listing[] = [
  {
    id: 'photo-1',
    slug: 'elite-photography',
    name: 'Elite Photography Studio',
    category: 'Photography',
    description: 'Professional photography services specializing in weddings, corporate events, and portraits.',
    location: 'Downtown',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop',
    hint: 'professional wedding photography',
    rating: 4.9,
    reviewCount: 156,
    price: 'From $2,500',
    priceValue: 2500,
    guestCapacity: 0,
    amenities: ['Professional Equipment', 'Editing Services', 'Online Gallery', 'Prints'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'photo-2',
    slug: 'creative-lens',
    name: 'Creative Lens Photography',
    category: 'Photography',
    description: 'Creative and artistic photography with a modern style. Perfect for unique and memorable events.',
    location: 'Arts District',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
    hint: 'creative artistic photography',
    rating: 4.7,
    reviewCount: 89,
    price: 'From $1,800',
    priceValue: 1800,
    guestCapacity: 0,
    amenities: ['Artistic Style', 'Digital Delivery', 'Custom Albums', 'Drone Photography'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockInvitationDesigners: Listing[] = [
  {
    id: 'invite-1',
    slug: 'elegant-invitations',
    name: 'Elegant Invitations',
    category: 'Invitations',
    description: 'Custom-designed invitations for all occasions. From elegant weddings to corporate events.',
    location: 'Design District',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=400&fit=crop',
    hint: 'custom wedding invitations',
    rating: 4.8,
    reviewCount: 67,
    price: 'From $3.50',
    priceValue: 3.5,
    guestCapacity: 0,
    amenities: ['Custom Design', 'Premium Paper', 'Digital Proofs', 'Rush Orders'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock data functions
export const getMockListings = (category?: string, count: number = 4): Listing[] => {
  if (category === 'Photography') {
    return mockPhotographers.slice(0, count);
  }
  if (category === 'Invitations') {
    return mockInvitationDesigners.slice(0, count);
  }
  return mockVenues.slice(0, count);
};

export const getMockListingBySlug = (slug: string): Listing | null => {
  const allListings = [...mockVenues, ...mockPhotographers, ...mockInvitationDesigners];
  return allListings.find(listing => listing.slug === slug) || null;
};
