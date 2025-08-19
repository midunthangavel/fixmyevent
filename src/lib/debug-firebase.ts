// Debug Firebase mock detection
import { db } from './firebase';

console.log('=== Firebase Debug Info ===');
console.log('db type:', typeof db);
console.log('db keys:', Object.keys(db));
console.log('db.collection type:', typeof db.collection);
console.log('db.collection exists:', !!db.collection);
console.log('db.collection is function:', typeof db.collection === 'function');

if (db.collection) {
  console.log('db.collection.toString():', db.collection.toString().substring(0, 100));
}

// Test if we can call collection
try {
  const testCollection = db.collection('test');
  console.log('✅ db.collection("test") works');
  console.log('testCollection type:', typeof testCollection);
  console.log('testCollection keys:', Object.keys(testCollection));
} catch (error) {
  console.error('❌ db.collection("test") failed:', error);
}

// Test if we can call doc
try {
  const testDoc = db.doc('test/doc1');
  console.log('✅ db.doc("test/doc1") works');
  console.log('testDoc type:', typeof testDoc);
} catch (error) {
  console.error('❌ db.doc("test/doc1") failed:', error);
}

console.log('=== End Debug Info ===');
