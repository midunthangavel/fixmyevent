import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore, DocumentData, QueryDocumentSnapshot, DocumentSnapshot, QuerySnapshot, CollectionReference, DocumentReference, Query, QueryConstraint } from 'firebase/firestore';
import type { StorageReference, UploadResult } from 'firebase/storage';

// Firebase App Types
export interface FirebaseAppInstance extends FirebaseApp {}

// Auth Types
export interface FirebaseAuth extends Auth {
  currentUser: User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
  signOut: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<{ user: User }>;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<{ user: User }>;
}

// Firestore Types
export interface FirebaseDocumentData extends DocumentData {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FirebaseDocumentSnapshot<T = FirebaseDocumentData> extends DocumentSnapshot<T> {
  exists(): boolean;
  data(): T | undefined;
  id: string;
}

export interface FirebaseQueryDocumentSnapshot<T = FirebaseDocumentData> extends QueryDocumentSnapshot<T> {
  data(): T;
  id: string;
}

export interface FirebaseQuerySnapshot<T = FirebaseDocumentData> extends QuerySnapshot<T> {
  empty: boolean;
  docs: FirebaseQueryDocumentSnapshot<T>[];
}

export interface FirebaseCollectionReference<T = FirebaseDocumentData> extends CollectionReference<T> {
  doc(id?: string): FirebaseDocumentReference<T>;
  getDocs(): Promise<FirebaseQuerySnapshot<T>>;
  addDoc(data: Omit<T, 'id'>): Promise<{ id: string }>;
  where(field: string, op: string, value: unknown): FirebaseQuery<T>;
  orderBy(field: string, direction?: 'asc' | 'desc'): FirebaseQuery<T>;
  limit(count: number): FirebaseQuery<T>;
  onSnapshot(callback: (snapshot: FirebaseQuerySnapshot<T>) => void): () => void;
}

export interface FirebaseDocumentReference<T = FirebaseDocumentData> {
  get(): Promise<FirebaseDocumentSnapshot<T>>;
  set(data: T): Promise<{ id: string }>;
  update(data: Partial<T>): Promise<{ id: string }>;
  delete(): Promise<{ id: string }>;
  onSnapshot(callback: (snapshot: FirebaseDocumentSnapshot<T>) => void): () => void;
}

export interface FirebaseQuery<T = FirebaseDocumentData> {
  getDocs(): Promise<FirebaseQuerySnapshot<T>>;
  onSnapshot(callback: (snapshot: FirebaseQuerySnapshot<T>) => void): () => void;
  where(field: string, op: string, value: unknown): FirebaseQuery<T>;
  orderBy(field: string, direction?: 'asc' | 'desc'): FirebaseQuery<T>;
  limit(count: number): FirebaseQuery<T>;
}

export interface FirebaseFirestore extends Firestore {
  collection(path: string): FirebaseCollectionReference;
  doc(path: string): FirebaseDocumentReference;
}

// Storage Types
export interface FirebaseStorageReference extends StorageReference {
  put(file: File): Promise<UploadResult>;
  getDownloadURL(): Promise<string>;
}

export interface FirebaseStorage {
  ref(path: string): FirebaseStorageReference;
}

// Mock Types for Development
export interface MockFirebaseCollection<T = FirebaseDocumentData> {
  get(id: string): T | undefined;
  set(id: string, data: T): void;
  delete(id: string): boolean;
  values(): IterableIterator<T>;
  size: number;
  has(path: string): boolean;
}

export interface MockFirebaseDB {
  collection: (path: string) => FirebaseCollectionReference;
  doc: (path: string) => FirebaseDocumentReference;
}

// Union Types
export type FirebaseDB = FirebaseFirestore | MockFirebaseDB;
export type FirebaseStorageInstance = FirebaseStorage;
export type FirebaseAuthInstance = FirebaseAuth;
export type FirebaseAppInstanceType = FirebaseAppInstance;
