import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'databases', 'pos_admin_central.db');
const db = new Database(dbPath);

console.log('Adding cloud_backup_enabled column to licenses table...');

try {
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(licenses)").all();
  const columnExists = tableInfo.some(col => col.name === 'cloud_backup_enabled');
  
  if (columnExists) {
    console.log('✓ Column cloud_backup_enabled already exists in licenses table');
  } else {
    // Add the column
    db.exec(`
      ALTER TABLE licenses 
      ADD COLUMN cloud_backup_enabled INTEGER DEFAULT 0
    `);
    console.log('✓ Successfully added cloud_backup_enabled column to licenses table');
  }
  
  // Verify the column was added
  const updatedTableInfo = db.prepare("PRAGMA table_info(licenses)").all();
  console.log('\nLicenses table structure:');
  updatedTableInfo.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
  // Show current data
  const licenses = db.prepare("SELECT id, license_key, cloud_backup_enabled FROM licenses").all();
  console.log(`\nTotal licenses: ${licenses.length}`);
  if (licenses.length > 0) {
    console.log('License data:');
    licenses.forEach(lic => {
      console.log(`  - ${lic.license_key}: cloud_backup_enabled = ${lic.cloud_backup_enabled}`);
    });
  }
  
} catch (error) {
  console.error('Error adding column:', error.message);
  process.exit(1);
}

db.close();
console.log('\n✓ Migration complete!');
