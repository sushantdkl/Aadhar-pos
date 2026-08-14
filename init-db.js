// Initialize Admin Database with sample data
import db, { initializeDatabase, generateLicenseKey, calculateExpiryDate } from './lib/db.js';
import { hashPassword } from './lib/auth.js';

console.log('🚀 Initializing POS Admin Central Database...\n');

// Initialize schema
initializeDatabase();

// Create default super admin
console.log('Creating super admin...');
const existingAdmin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');

if (!existingAdmin) {
  db.prepare(`
    INSERT INTO admin_users (username, password_hash, full_name, email, role)
    VALUES (?, ?, ?, ?, ?)
  `).run('admin', hashPassword('admin123'), 'Super Admin', 'admin@poscentral.com', 'superadmin');
  console.log('✅ Admin created: admin / admin123');
} else {
  console.log('✅ Admin already exists');
}

// Add sample restaurants
console.log('\nAdding sample restaurants...');

const sampleRestaurants = [
  {
    name: 'The Wild Stars Restaurant',
    owner: 'John Doe',
    phone: '9876543210',
    email: 'wildstars@example.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    plan: 'ANNUAL',
    duration: 12,
    amount: 8999
  },
  {
    name: 'Spice Garden',
    owner: 'Jane Smith',
    phone: '9876543211',
    email: 'spicegarden@example.com',
    city: 'Delhi',
    state: 'Delhi',
    plan: 'SEMI_ANNUAL',
    duration: 6,
    amount: 4999
  },
  {
    name: 'Ocean View Cafe',
    owner: 'Mike Johnson',
    phone: '9876543212',
    email: 'oceanview@example.com',
    city: 'Goa',
    state: 'Goa',
    plan: 'MONTHLY',
    duration: 1,
    amount: 999
  }
];

sampleRestaurants.forEach((rest, index) => {
  const existing = db.prepare('SELECT * FROM restaurants WHERE phone = ?').get(rest.phone);
  
  if (!existing) {
    // Insert restaurant
    const result = db.prepare(`
      INSERT INTO restaurants (name, owner_name, phone, email, city, state, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `).run(rest.name, rest.owner, rest.phone, rest.email, rest.city, rest.state);

    const restaurantId = result.lastInsertRowid;

    // Generate license
    const licenseKey = generateLicenseKey(restaurantId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (index * 30)); // Stagger start dates
    const startDateStr = startDate.toISOString().split('T')[0];
    const expiryDate = calculateExpiryDate(startDateStr, rest.duration);

    db.prepare(`
      INSERT INTO licenses (restaurant_id, license_key, plan_type, plan_duration, start_date, expiry_date, status, last_verified)
      VALUES (?, ?, ?, ?, ?, ?, 'active', datetime('now'))
    `).run(restaurantId, licenseKey, rest.plan, rest.duration, startDateStr, expiryDate);

    // Record payment
    db.prepare(`
      INSERT INTO payments (restaurant_id, license_id, amount, plan_type, plan_duration, payment_method, payment_status, payment_date)
      VALUES (?, ?, ?, ?, ?, 'manual', 'completed', datetime('now'))
    `).run(restaurantId, restaurantId, rest.amount, rest.plan, rest.duration);

    console.log(`✅ ${rest.name} - License: ${licenseKey}`);
  } else {
    console.log(`⏭️  ${rest.name} already exists`);
  }
});

console.log('\n✅ Database initialization complete!');
console.log('\n📊 Summary:');
console.log(`   Total Restaurants: ${db.prepare('SELECT COUNT(*) as count FROM restaurants').get().count}`);
console.log(`   Active Licenses: ${db.prepare('SELECT COUNT(*) as count FROM licenses WHERE status = \'active\'').get().count}`);
console.log(`   Total Payments: ${db.prepare('SELECT COUNT(*) as count FROM payments').get().count}`);
console.log('\n🚀 Start the admin panel: npm run dev');
console.log('🔐 Login: admin / admin123\n');

db.close();
