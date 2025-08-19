// Common form options used across different service types

// Amenities for venues
export const VENUE_AMENITIES = [
  'WiFi',
  'Parking', 
  'In-house Catering',
  'AV Equipment',
  'Outdoor Space',
  'Bridal Suite',
  'Kitchen Facilities',
  'Bar/Lounge',
  'Dance Floor',
  'Stage',
  'Sound System',
  'Lighting',
  'Security',
  'Accessibility Features',
  'Climate Control'
] as const;

// Cuisine types for catering
export const CUISINE_TYPES = [
  'Italian',
  'Mexican', 
  'Asian',
  'American',
  'Mediterranean',
  'Indian',
  'French',
  'Spanish',
  'Greek',
  'Thai',
  'Japanese',
  'Chinese',
  'Korean',
  'Vietnamese',
  'Middle Eastern',
  'Caribbean',
  'African',
  'Other'
] as const;

// Dietary accommodations
export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Nut-Free',
  'Dairy-Free',
  'Low-Sodium',
  'Low-Carb',
  'Keto-Friendly',
  'Paleo-Friendly',
  'Raw Food',
  'Organic',
  'Local Sourcing'
] as const;

// Service types for catering
export const CATERING_SERVICE_TYPES = [
  { value: 'full-service', label: 'Full Service (Staff, Setup, Cleanup)' },
  { value: 'drop-off', label: 'Drop-off Only' },
  { value: 'partial', label: 'Partial Service' },
  { value: 'buffet', label: 'Buffet Service' },
  { value: 'plated', label: 'Plated Service' },
  { value: 'family-style', label: 'Family Style' }
] as const;

// Music genres for entertainment
export const MUSIC_GENRES = [
  'Pop',
  'Rock',
  'Jazz',
  'Classical',
  'Country',
  'Hip-Hop',
  'R&B',
  'Electronic',
  'Folk',
  'Blues',
  'Reggae',
  'Latin',
  'World Music',
  'Acoustic',
  'Cover Bands',
  'DJ Services'
] as const;

// Photography styles
export const PHOTOGRAPHY_STYLES = [
  'Traditional',
  'Photojournalistic',
  'Contemporary',
  'Vintage',
  'Artistic',
  'Candid',
  'Portrait',
  'Landscape',
  'Street',
  'Fashion',
  'Documentary',
  'Fine Art'
] as const;

// Transportation types
export const TRANSPORTATION_TYPES = [
  'Luxury Sedan',
  'Limousine',
  'SUV',
  'Van',
  'Bus',
  'Coach',
  'Trolley',
  'Vintage Car',
  'Motorcycle',
  'Bicycle',
  'Boat',
  'Helicopter'
] as const;

// Decoration styles
export const DECORATION_STYLES = [
  'Modern',
  'Traditional',
  'Rustic',
  'Vintage',
  'Bohemian',
  'Minimalist',
  'Luxury',
  'Romantic',
  'Industrial',
  'Tropical',
  'Garden',
  'Beach',
  'Mountain',
  'Urban',
  'Countryside'
] as const;

// Event types
export const EVENT_TYPES = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Anniversary',
  'Graduation',
  'Conference',
  'Trade Show',
  'Product Launch',
  'Fundraiser',
  'Holiday Party',
  'Reunion',
  'Baby Shower',
  'Bridal Shower',
  'Engagement Party',
  'Retirement Party',
  'Memorial Service',
  'Other'
] as const;

// Guest capacity ranges
export const GUEST_CAPACITY_RANGES = [
  { value: '1-50', label: '1-50 guests' },
  { value: '51-100', label: '51-100 guests' },
  { value: '101-200', label: '101-200 guests' },
  { value: '201-500', label: '201-500 guests' },
  { value: '501-1000', label: '501-1000 guests' },
  { value: '1000+', label: '1000+ guests' }
] as const;

// Price ranges
export const PRICE_RANGES = [
  { value: 'budget', label: 'Budget ($)', min: 0, max: 1000 },
  { value: 'moderate', label: 'Moderate ($$)', min: 1001, max: 5000 },
  { value: 'premium', label: 'Premium ($$$)', min: 5001, max: 15000 },
  { value: 'luxury', label: 'Luxury ($$$$)', min: 15001, max: 50000 },
  { value: 'ultra-luxury', label: 'Ultra-Luxury ($$$$$)', min: 50001, max: 100000 }
] as const;

// Time slots
export const TIME_SLOTS = [
  'Morning (6 AM - 12 PM)',
  'Afternoon (12 PM - 6 PM)',
  'Evening (6 PM - 12 AM)',
  'Late Night (12 AM - 6 AM)',
  'Full Day (24 hours)',
  'Custom Hours'
] as const;

// Payment terms
export const PAYMENT_TERMS = [
  'Full payment upfront',
  '50% deposit, balance due 30 days before',
  '25% deposit, balance due 14 days before',
  'Payment plans available',
  'Net 30',
  'Net 60',
  'Custom terms'
] as const;

// Cancellation policies
export const CANCELLATION_POLICIES = [
  'Full refund up to 30 days before',
  'Full refund up to 14 days before',
  'Full refund up to 7 days before',
  '50% refund up to 7 days before',
  'No refunds',
  'Custom policy'
] as const;

// Insurance types
export const INSURANCE_TYPES = [
  'General Liability',
  'Professional Liability',
  'Property Insurance',
  'Workers Compensation',
  'Auto Insurance',
  'Event Insurance',
  'Not Required'
] as const;

// Certification types
export const CERTIFICATION_TYPES = [
  'Food Safety',
  'Alcohol Service',
  'First Aid/CPR',
  'Professional Photography',
  'Music Licensing',
  'Transportation License',
  'Business License',
  'Health Department',
  'Other'
] as const;
