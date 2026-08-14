// Migration Script: SQLite to Firebase
// This script migrates existing data from SQLite to Firebase

import Database from 'better-sqlite3';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
let serviceAccount;
try {
  // Try to read from file first
  const serviceAccountPath = join(__dirname, 'firebase-service-account.json');
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  console.log('✓ Loaded service account from file\n');
} catch (error) {
  // Fallback to environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('✓ Loaded service account from environment variable\n');
  } else {
    console.error('❌ Error: No service account found!');
    console.error('Please either:');
    console.error('1. Place firebase-service-account.json in this folder, OR');
    console.error('2. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local\n');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const firestore = admin.firestore();

async function migrateData() {
  console.log('🔄 Starting migration from SQLite to Firebase...\n');

  try {
    // Connect to SQLite
    const dbPath = path.join(__dirname, 'databases', 'admin_central.db');
    const db = new Database(dbPath);

    // Migrate admin users
    console.log('Migrating admin users...');
    const adminUsers = db.prepare('SELECT * FROM admin_users').all();
    for (const user of adminUsers) {
      await firestore.collection('admin_users').doc(user.username).set({
        username: user.username,
        password: user.password,
        email: user.email || '',
        role: user.role || 'admin',
        created_at: user.created_at || new Date().toISOString()
      });
      console.log(`  ✓ Migrated user: ${user.username}`);
    }

    // Migrate restaurants
    console.log('\nMigrating restaurants...');
    const restaurants = db.prepare('SELECT * FROM restaurants').all();
    const restaurantIdMap = {}; // Map old ID to new Firestore ID

    for (const restaurant of restaurants) {
      const docRef = firestore.collection('restaurants').doc();
      restaurantIdMap[restaurant.id] = docRef.id;

      await docRef.set({
        name: restaurant.name,
        location: restaurant.location || '',
        contact_number: restaurant.contact_number || '',
        contact_email: restaurant.contact_email || '',
        owner_name: restaurant.owner_name || '',
        status: restaurant.status || 'active',
        created_at: restaurant.created_at || new Date().toISOString(),
        updated_at: restaurant.updated_at || new Date().toISOString()
      });
      console.log(`  ✓ Migrated restaurant: ${restaurant.name}`);
    }

    // Migrate licenses
    console.log('\nMigrating licenses...');
    const licenses = db.prepare('SELECT * FROM licenses').all();
    for (const license of licenses) {
      const newRestaurantId = restaurantIdMap[license.restaurant_id];
      if (!newRestaurantId) {
        console.log(`  ⚠ Skipping license ${license.license_key} - restaurant not found`);
        continue;
      }

      await firestore.collection('licenses').doc(license.license_key).set({
        restaurant_id: newRestaurantId,
        license_key: license.license_key,
        plan_type: license.plan_type || 'monthly',
        start_date: license.start_date || new Date().toISOString(),
        expiry_date: license.expiry_date,
        status: license.status || 'active',
        grace_period_days: license.grace_period_days || 5,
        last_verified: license.last_verified || null,
        created_at: license.created_at || new Date().toISOString()
      });
      console.log(`  ✓ Migrated license: ${license.license_key}`);
    }

    // Migrate payments
    console.log('\nMigrating payments...');
    const payments = db.prepare('SELECT * FROM payments').all();
    for (const payment of payments) {
      const newRestaurantId = restaurantIdMap[payment.restaurant_id];
      if (!newRestaurantId) {
        console.log(`  ⚠ Skipping payment ${payment.id} - restaurant not found`);
        continue;
      }

      await firestore.collection('payments').add({
        restaurant_id: newRestaurantId,
        license_key: payment.license_key || '',
        amount: payment.amount || 0,
        plan_type: payment.plan_type || 'monthly',
        payment_date: payment.payment_date || new Date().toISOString(),
        payment_method: payment.payment_method || 'unknown',
        status: payment.status || 'completed',
        created_at: payment.created_at || new Date().toISOString()
      });
      console.log(`  ✓ Migrated payment: ₹${payment.amount}`);
    }

    // Migrate verification logs (optional, recent only)
    console.log('\nMigrating recent verification logs...');
    const logs = db.prepare('SELECT * FROM verification_logs ORDER BY verified_at DESC LIMIT 1000').all();
    for (const log of logs) {
      const newRestaurantId = restaurantIdMap[log.restaurant_id];
      if (newRestaurantId) {
        await firestore.collection('verification_logs').add({
          license_key: log.license_key || '',
          restaurant_id: newRestaurantId,
          verification_status: log.verification_status || 'unknown',
          ip_address: log.ip_address || 'unknown',
          timestamp: log.verified_at || new Date().toISOString()
        });
      }
    }
    console.log(`  ✓ Migrated ${logs.length} verification logs`);

    db.close();

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - ${adminUsers.length} admin users`);
    console.log(`   - ${restaurants.length} restaurants`);
    console.log(`   - ${licenses.length} licenses`);
    console.log(`   - ${payments.length} payments`);
    console.log(`   - ${logs.length} verification logs`);
    console.log('\n⚠️  You can now switch to using Firebase APIs!');

  } catch (error) {
    console.error('❌ Migration error:', error);
  }

  process.exit(0);
}

migrateData();
