// Quick test to verify Firebase configuration
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔍 Checking Firebase Configuration...\n');

// Check .env.local
if (!existsSync('.env.local')) {
  console.log('❌ .env.local file not found!');
  console.log('   Create it by copying .env.example:\n');
  console.log('   copy .env.example .env.local\n');
  process.exit(1);
}

console.log('✓ .env.local file exists\n');

// Check Firebase config
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('Checking Firebase Client Config:');
let allPresent = true;
for (const varName of requiredEnvVars) {
  if (process.env[varName]) {
    console.log(`  ✓ ${varName}`);
  } else {
    console.log(`  ❌ ${varName} - NOT SET`);
    allPresent = false;
  }
}

console.log('\nChecking Firebase Admin Config:');
let hasServiceAccount = false;

// Check for service account file
const serviceAccountPath = join(__dirname, 'firebase-service-account.json');
if (existsSync(serviceAccountPath)) {
  console.log('  ✓ firebase-service-account.json file exists');
  hasServiceAccount = true;
} else {
  console.log('  ⚠ firebase-service-account.json not found');
}

// Check for environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.log('  ✓ FIREBASE_SERVICE_ACCOUNT_KEY environment variable set');
  hasServiceAccount = true;
} else {
  console.log('  ⚠ FIREBASE_SERVICE_ACCOUNT_KEY not set in .env.local');
}

console.log('\n' + '='.repeat(60));

if (allPresent && hasServiceAccount) {
  console.log('\n✅ Firebase configuration looks good!');
  console.log('\nNext steps:');
  console.log('  1. Run: node init-firebase.js');
  console.log('  2. Run: npm run dev\n');
} else {
  console.log('\n⚠️  Firebase configuration incomplete!');
  console.log('\nWhat you need to do:');
  
  if (!allPresent) {
    console.log('\n📝 Add Firebase config to .env.local:');
    console.log('   - Go to Firebase Console');
    console.log('   - Get your web app config');
    console.log('   - Add all NEXT_PUBLIC_FIREBASE_* variables');
  }
  
  if (!hasServiceAccount) {
    console.log('\n🔑 Add service account:');
    console.log('   Option 1: Download firebase-service-account.json from Firebase');
    console.log('   Option 2: Add FIREBASE_SERVICE_ACCOUNT_KEY to .env.local');
  }
  
  console.log('\n📖 See QUICK_START.md for detailed instructions!\n');
}
