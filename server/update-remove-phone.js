import db from './db.js';

async function removePhoneColumn() {
  try {
    console.log('🔧 Removing phone column from registrations table...\n');
    
    await db.query('ALTER TABLE registrations DROP COLUMN phone');
    
    console.log('✅ Phone column removed successfully!\n');
    
    const [rows] = await db.query('DESCRIBE registrations');
    console.log('Updated table structure:');
    console.log('─'.repeat(60));
    rows.forEach(row => {
      console.log(`  ${row.Field.padEnd(20)} ${row.Type.padEnd(20)}`);
    });
    console.log('─'.repeat(60));
    console.log('\n✅ Database updated!\n');
    
    process.exit(0);
  } catch (error) {
    if (error.message.includes("check that it exists")) {
      console.log('⚠️  Phone column already removed or does not exist\n');
      process.exit(0);
    }
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removePhoneColumn();
