import db from './db.js';

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...\n');
    
    // Get all tables in the database
    const [tables] = await db.query('SHOW TABLES');
    
    console.log('📊 Available tables:');
    console.log('─'.repeat(60));
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      
      // Get row count for each table
      const [count] = await db.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      
      // Get table structure
      const [structure] = await db.query(`DESCRIBE ${tableName}`);
      
      console.log(`\n✓ ${tableName}`);
      console.log(`  Rows: ${count[0].count}`);
      console.log(`  Columns: ${structure.map(col => col.Field).join(', ')}`);
    }
    
    console.log('\n' + '─'.repeat(60));
    console.log(`\nTotal tables: ${tables.length}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTables();
