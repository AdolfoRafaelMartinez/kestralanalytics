
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let db;
let firebaseStatus;

try {
  const serviceAccount = require('../serviceAccountKey.json');

  // Check if the service account key is the placeholder
  if (serviceAccount.project_id === 'your-project-id') {
    firebaseStatus = 'Firebase connection not configured. Please replace serviceAccountKey.json with your actual service account key.';
    console.warn(firebaseStatus);
  } else {
    initializeApp({
      credential: cert(serviceAccount)
    });
  
    db = getFirestore();
    firebaseStatus = 'Successfully connected to Firebase and Firestore.';
    console.log(firebaseStatus);
  }
} catch (error) {
  firebaseStatus = `Failed to connect to Firebase: ${error.message}`;
  console.error(firebaseStatus);
}

module.exports = { db, firebaseStatus };
