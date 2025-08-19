// Simple test to check if Firebase mock is working
import { db } from './firebase';

async function testFirebase() {
  console.log('Testing Firebase mock...');
  console.log('db object:', typeof db);
  console.log('db.collection:', typeof db.collection);

  try {
    // Test basic collection access
    const testCollection = db.collection('test');
    console.log('Collection created:', testCollection);
    
    // Test adding a document
    const result = await testCollection.addDoc({ name: 'test', value: 123 });
    console.log('Document added:', result);
    
    // Test getting documents
    const docs = await testCollection.getDocs();
    console.log('Documents retrieved:', docs);
    
    console.log('✅ Basic Firebase mock test passed!');
  } catch (error) {
    console.error('❌ Firebase mock test failed:', error);
  }
}

// Run the test
testFirebase().catch(console.error);
