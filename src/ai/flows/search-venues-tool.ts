
'use server';
/**
 * @fileOverview A tool for searching event listings in Firestore.
 */

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { categories } from '@/types/listing';

const SearchVenuesToolInputSchema = z.object({
  category: z.enum(categories).optional().describe('The category of service to search for (e.g., "Venue", "Catering").'),
  location: z.string().optional().describe('The desired city or location for the service.'),
  guestCapacity: z.number().optional().describe('The minimum number of guests the venue should accommodate.'),
});

// This function now works with the AI service through API routes
export async function searchVenues(input: z.infer<typeof SearchVenuesToolInputSchema>): Promise<string> {
  const { category, location, guestCapacity } = input;
  
  // Start with a base query on the 'listings' collection
  let q = query(collection(db, 'listings'));

  // Dynamically add constraints based on the input
  if (category) {
    q = query(q, where('category', '==', category));
  }
  if (location) {
    // Note: Firestore's default querying is case-sensitive and doesn't support partial text search easily.
    // A more robust solution would use a search service like Algolia or MeiliSearch.
    // For this demo, we'll rely on vendors hopefully inputting consistent location data.
    q = query(q, where('address', '>=', location), where('address', '<=', location + '\uf8ff'));
  }
  if (guestCapacity) {
    q = query(q, where('guestCapacity', '>=', guestCapacity));
  }

  // Limit results to avoid returning too much data
  q = query(q, limit(5));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return "I couldn't find any listings that match your criteria. You could try searching with fewer filters.";
    }

    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return `- ${data.name} in ${data.address}. Category: ${data.category}.`;
    });
    
    return `I found a few options for you:\n${results.join('\n')}`;

  } catch (error) {
    console.error("Error searching venues:", error);
    return "I encountered an error while searching. Please try again.";
  }
}
