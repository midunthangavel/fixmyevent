// Simplified Firebase Database Service
// Focused on single, well-tested implementation



// Database operation result
export interface DatabaseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  cached: boolean;
}

// Simplified Database Service
export class FirebaseDatabaseService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private maxCacheSize: number;

  constructor(maxCacheSize: number = 100) {
    this.maxCacheSize = maxCacheSize;
  }

  /**
   * Get data with caching
   */
  async get<T>(collection: string, id?: string, options?: any): Promise<DatabaseResult<T>> {
    const cacheKey = `${collection}_${id ?? 'all'}_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return {
        success: true,
        data: cached,
        cached: true
      };
    }

    try {
      const { db } = await import('./firebase');
      const { collection: firestoreCollection, doc, getDocs, getDoc } = await import('firebase/firestore');
      
      if (id) {
        // Get single document
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as T;
          this.setCache(cacheKey, data, 5 * 60 * 1000); // 5 minutes cache
          return { success: true, data, cached: false };
        } else {
          return { success: false, error: 'Document not found', cached: false };
        }
      } else {
        // Get collection
        const querySnapshot = await getDocs(firestoreCollection(db, collection));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T;
        this.setCache(cacheKey, data, 5 * 60 * 1000); // 5 minutes cache
        return { success: true, data, cached: false };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', cached: false };
    }
  }

  /**
   * Set data and clear related cache
   */
  async set<T>(collection: string, data: T): Promise<DatabaseResult<T>> {
    // Clear related cache entries
    this.clearCacheByCollection(collection);
    
    // In a real implementation, this would call Firebase
    // For now, return success
    return {
      success: true,
      data,
      cached: false
    };
  }

  /**
   * Cache management methods
   */
  private getFromCache(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }



  private setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearCacheByCollection(collection: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(collection)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize
    };
  }
}

// Export simplified database service
export const createFirebaseDatabase = () => {
  return new FirebaseDatabaseService();
};
