import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'databases', 'pos_admin_central.db');
const db = new Database(dbPath);

console.log('Adding updated_at column to licenses table...');

try {
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(licenses)").all();
  const columnExists = tableInfo.some(col => col.name === 'updated_at');
  
  if (columnExists) {
    console.log('✓ Column updated_at already exists in licenses table');
  } else {
    // Add the column without default (SQLite limitation with ALTER TABLE)
    db.exec(`
      ALTER TABLE licenses 
      ADD COLUMN updated_at DATETIME
    `);
    
    // Update existing rows with current timestamp
    db.exec(`
      UPDATE licenses 
      SET updated_at = created_at
    `);
    
    console.log('✓ Successfully added updated_at column to licenses table');
  }
  
  // Verify the column was added
  const updatedTableInfo = db.prepare("PRAGMA table_info(licenses)").all();
  console.log('\nLicenses table structure:');
  updatedTableInfo.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
} catch (error) {
  console.error('Error adding column:', error.message);
  process.exit(1);
}

db.close();
console.log('\n✓ Migration complete!');
