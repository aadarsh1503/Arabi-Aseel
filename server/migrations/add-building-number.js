import db from '../db.js';

async function addBuildingNumberColumn() {
  try {
    console.log('Adding building_number column to registrations table...');
    
    // Check if column already exists
    const [columns] = await db.query(`
      SHOW COLUMNS FROM registrations LIKE 'building_number'
    `);
    
    if (columns.length > 0) {
      console.log('✅ building_number column already exists');
      process.exit(0);
    }
    
    // Add the column after address_title
    await db.query(`
      ALTER TABLE registrations 
      ADD COLUMN building_number VARCHAR(255) AFTER address_title
    `);
    
    console.log('✅ building_number column added successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error adding building_number column:', error);
    process.exit(1);
  }
}

addBuildingNumberColumn();
