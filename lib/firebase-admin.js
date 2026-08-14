// Firebase Admin SDK Configuration (Server-side only)
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Get admin instance (singleton pattern)
function getAdminApp() {
  if (admin.apps.length) {
    return admin.app();
  }

  try {
    let serviceAccount = null;

    // Try to load from file first (most reliable for development)
    const serviceAccountPath = join(process.cwd(), 'firebase-service-account.json');
    if (existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      console.log('✓ Firebase Admin: Loaded from firebase-service-account.json');
    } 
    // Fallback to environment variable
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      serviceAccount = JSON.parse(envKey);
      
      // Fix newline characters in private_key if needed
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      console.log('✓ Firebase Admin: Loaded from environment variable');
    }

    if (serviceAccount && serviceAccount.project_id && serviceAccount.private_key) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      });
      console.log(`✓ Firebase Admin initialized for project: ${serviceAccount.project_id}`);
    } else {
      throw new Error('No valid Firebase service account found. Please check firebase-service-account.json or FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
    }
  } catch (error) {
    console.error('❌ Firebase admin initialization error:', error.message);
    throw error;
  }

  return admin.app();
}

// Initialize and export
let adminDb, adminAuth, adminStorage;

try {
  getAdminApp();
  adminDb = admin.firestore();
  adminAuth = admin.auth();
  adminStorage = admin.storage();
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK');
  // Create dummy exports to prevent import errors
  adminDb = null;
  adminAuth = null;
  adminStorage = null;
}

export { adminDb, adminAuth, adminStorage };
export default admin;
