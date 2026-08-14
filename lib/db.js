import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const isVercel = !!process.env.VERCEL;
const dbDir = isVercel
  ? path.join('/tmp', 'databases')
  : path.join(process.cwd(), 'databases');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'pos_admin_central.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Admin users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Restaurants table
  db.exec(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      pan_number TEXT,
      gst_number TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Licenses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      license_key TEXT UNIQUE NOT NULL,
      plan_type TEXT NOT NULL,
      plan_duration INTEGER NOT NULL,
      start_date DATE NOT NULL,
      expiry_date DATE NOT NULL,
      grace_period_days INTEGER DEFAULT 7,
      status TEXT DEFAULT 'active',
      last_verified DATETIME,
      cloud_backup_enabled INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    )
  `);

  // Payments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      license_id INTEGER,
      amount REAL NOT NULL,
      plan_type TEXT NOT NULL,
      plan_duration INTEGER NOT NULL,
      payment_method TEXT,
      payment_id TEXT,
      payment_status TEXT DEFAULT 'pending',
      payment_date DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
      FOREIGN KEY (license_id) REFERENCES licenses(id)
    )
  `);

  // License verification logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS verification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_key TEXT NOT NULL,
      restaurant_id INTEGER,
      verification_status TEXT,
      ip_address TEXT,
      verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    )
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database initialized successfully');
}

// Generate unique license key
export function generateLicenseKey(restaurantId) {
  const prefix = 'POS';
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${year}-${restaurantId}-${random}`;
}

// Calculate expiry date based on plan
export function calculateExpiryDate(startDate, duration) {
  const start = new Date(startDate);
  const expiry = new Date(start);
  expiry.setMonth(expiry.getMonth() + duration);
  return expiry.toISOString().split('T')[0];
}

export default db;
