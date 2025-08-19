import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData,
  Timestamp,
  writeBatch,
  runTransaction,
  QueryConstraint,
  CollectionReference,
  Firestore,
  Transaction,
  Query
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppError, ERROR_CODES, ErrorHandler, ErrorLogger } from '@/lib/errors';
import type { BaseEntity, PaginationParams, PaginatedResponse } from '@/types/common';
import type { UserProfile } from '@/types/user';

// Collection names
export const COLLECTIONS = {
  LISTINGS: 'listings',
  USERS: 'users',
  BOOKINGS: 'bookings',
  FAVORITES: 'favorites',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
  AVAILABILITY: 'availability',
} as const;

// Generic database service class with improved error handling
export class DatabaseService<T extends BaseEntity> {
  protected collectionName: string;
  protected collectionRef: CollectionReference<DocumentData>;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    
    // Cast to proper Firebase types
    const realDb = db as Firestore;
    this.collectionRef = collection(realDb, collectionName);
  }

  // Create a new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(this.collectionRef, docData);
      
      return docRef.id;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'create', 
        collection: this.collectionName,
        data: { ...data, createdAt: 'timestamp', updatedAt: 'timestamp' }
      });
      throw appError;
    }
  }

  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    try {
      if (!id) {
        throw new AppError('Document ID is required', ERROR_CODES.VALIDATION_REQUIRED_FIELD, 400);
      }

      const realDb = db as Firestore;
      const docRef = doc(realDb, this.collectionName, id);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        return null;
      }

      const data = docSnapshot.data();
      return data ? { ...data, id: docSnapshot.id } as T : null;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getById', 
        collection: this.collectionName,
        id 
      });
      throw appError;
    }
  }

  // Get all documents with optional pagination
  async getAll(pageLimit?: number): Promise<T[]> {
    try {
      let q: Query<DocumentData> = this.collectionRef;
      
      if (pageLimit) {
        q = query(this.collectionRef, limit(pageLimit));
      }

      // Apply ordering
      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          documents.push({ ...data, id: docSnapshot.id } as T);
        }
      });

      return documents;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getAll', 
        collection: this.collectionName,
        pageLimit 
      });
      throw appError;
    }
  }

  // Get many documents with filters and pagination
  async getMany(
    filters: QueryConstraint[] = [], 
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    try {
      const { page = 1, limit: pageLimit = 10 } = pagination || {};
      
      let q: Query<DocumentData> = this.collectionRef;
      
      // Apply filters
      if (filters.length > 0) {
        q = query(this.collectionRef, ...filters);
      }

      if (pageLimit) {
        q = query(q, limit(pageLimit));
      }

      // Apply ordering
      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          documents.push({ ...data, id: docSnapshot.id } as T);
        }
      });

      // Calculate pagination info
      const total = documents.length; // In a real app, you'd get this from a separate count query
      const hasMore = documents.length === pageLimit;
      const nextCursor = hasMore ? documents[documents.length - 1]?.id : undefined;

      return {
        success: true,
        data: documents,
        pagination: {
          page,
          limit: pageLimit,
          total,
          hasMore,
          nextCursor: nextCursor || undefined
        }
      };
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getMany', 
        collection: this.collectionName,
        filters: filters.length,
        pagination 
      });
      throw appError;
    }
  }

  // Update a document
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    try {
      if (!id) {
        throw new AppError('Document ID is required', ERROR_CODES.VALIDATION_REQUIRED_FIELD, 400);
      }

      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      const realDb = db as Firestore;
      const docRef = doc(realDb, this.collectionName, id);
      await updateDoc(docRef, updateData);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'update', 
        collection: this.collectionName,
        id,
        data: { ...data, updatedAt: 'timestamp' }
      });
      throw appError;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new AppError('Document ID is required', ERROR_CODES.VALIDATION_REQUIRED_FIELD, 400);
      }

      const realDb = db as Firestore;
      const docRef = doc(realDb, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'delete', 
        collection: this.collectionName,
        id 
      });
      throw appError;
    }
  }

  // Get documents by field value
  async getByField(field: keyof T, value: unknown): Promise<T[]> {
    try {
      const q = query(this.collectionRef, where(field as string, '==', value));

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          documents.push({ ...data, id: docSnapshot.id } as T);
        }
      });

      return documents;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getByField', 
        collection: this.collectionName,
        field: String(field),
        value 
      });
      throw appError;
    }
  }

  // Get one document by field value
  async getOneByField(field: keyof T, value: unknown): Promise<T | null> {
    try {
      const documents = await this.getByField(field, value);
      return documents.length > 0 ? documents[0] : null;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getOneByField', 
        collection: this.collectionName,
        field: String(field),
        value 
      });
      throw appError;
    }
  }

  // Get documents by category
  async getByCategory(category: string, limitCount?: number): Promise<T[]> {
    try {
      const constraints: QueryConstraint[] = [where('category', '==', category)];
      if (limitCount) {
        constraints.push(limit(limitCount));
      }
      const q = query(this.collectionRef, ...constraints);

      const querySnapshot = await getDocs(q);
      const documents: T[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          documents.push({ ...data, id: docSnapshot.id } as T);
        }
      });

      return documents;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getByCategory', 
        collection: this.collectionName,
        category,
        limitCount 
      });
      throw appError;
    }
  }

  // Improved search implementation with proper indexing strategy
  async search(searchTerm: string, searchFields: (keyof T)[]): Promise<T[]> {
    try {
      if (!searchTerm.trim()) {
        return [];
      }

      // Use database queries instead of client-side filtering
      const searchQueries = searchFields.map(field => 
        where(field as string, '>=', searchTerm.toLowerCase())
      );

      // Use proper query constraints for Firebase
      const realDb = db as Firestore;
      const realCollectionRef = collection(realDb, this.collectionName);
      
      // Use compound queries for better performance
      const q = query(realCollectionRef, ...searchQueries, limit(50));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as T));
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        context: 'database_search',
        collection: this.collectionName,
        searchTerm,
        searchFields
      });
      throw appError;
    }
  }

  // Run a transaction
  async runTransaction<TResult>(
    updateFunction: (transaction: Transaction) => Promise<TResult>
  ): Promise<TResult> {
    try {
      const realDb = db as Firestore;
      return await runTransaction(realDb, updateFunction);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'runTransaction', 
        collection: this.collectionName
      });
      throw appError;
    }
  }

  // Batch operations
  async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete';
    id?: string;
    data?: Partial<T>;
  }>): Promise<void> {
    try {
      const realDb = db as Firestore;
      const batch = writeBatch(realDb);
      
      operations.forEach(operation => {
        if (operation.type === 'create' && operation.data) {
          const docRef = doc(realDb, this.collectionName);
          batch.set(docRef, {
            ...operation.data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        } else if (operation.type === 'update' && operation.id && operation.data) {
          const docRef = doc(realDb, this.collectionName, operation.id);
          batch.update(docRef, {
            ...operation.data,
            updatedAt: Timestamp.now(),
          });
        } else if (operation.type === 'delete' && operation.id) {
          const docRef = doc(realDb, this.collectionName, operation.id);
          batch.delete(docRef);
        }
      });
      
      await batch.commit();
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'batchWrite', 
        collection: this.collectionName,
        operationsCount: operations.length
      });
      throw appError;
    }
  }

  // Subscribe to real-time updates
  subscribeToChanges(
    callback: (documents: T[]) => void,
    filters: QueryConstraint[] = []
  ): () => void {
    try {
      let q: Query<DocumentData> = this.collectionRef;
      
      if (filters.length > 0) {
        q = query(this.collectionRef, ...filters);
      }

      return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const documents: T[] = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          if (data) {
            documents.push({ ...data, id: docSnapshot.id } as T);
          }
        });
        callback(documents);
      });
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'subscribeToChanges', 
        collection: this.collectionName,
        filtersCount: filters.length
      });
      throw appError;
    }
  }
}

// Specialized service instances
export const usersService = new DatabaseService<UserProfile>(COLLECTIONS.USERS);
export const listingsService = new DatabaseService<any>(COLLECTIONS.LISTINGS);
export const bookingsService = new DatabaseService<any>(COLLECTIONS.BOOKINGS);
export const favoritesService = new DatabaseService<any>(COLLECTIONS.FAVORITES);
export const reviewsService = new DatabaseService<any>(COLLECTIONS.REVIEWS);
export const notificationsService = new DatabaseService<any>(COLLECTIONS.NOTIFICATIONS);
export const paymentsService = new DatabaseService<any>(COLLECTIONS.PAYMENTS);
export const availabilityService = new DatabaseService<any>(COLLECTIONS.AVAILABILITY);
