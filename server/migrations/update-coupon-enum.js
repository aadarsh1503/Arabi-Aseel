import db from '../db.js';

async function updateCouponEnum() {
  try {
    console.log('Updating coupon_type ENUM column...\n');
    
    // Step 1: Modify ENUM to include BUY_1_GET_1
    console.log('Step 1: Adding BUY_1_GET_1 to ENUM values...');
    await db.query(`
      ALTER TABLE registrations 
      MODIFY COLUMN coupon_type ENUM('FREE_MEAL', 'BUY_1_GET_1', 'DISCOUNT_50') NOT NULL
    `);
    console.log('✅ ENUM updated');
    
    // Step 2: Update existing FREE_MEAL records to BUY_1_GET_1
    console.log('\nStep 2: Updating FREE_MEAL records to BUY_1_GET_1...');
    const [result] = await db.query(`
      UPDATE registrations 
      SET coupon_type = 'BUY_1_GET_1' 
      WHERE coupon_type = 'FREE_MEAL'
    `);
    console.log(`✅ Updated ${result.affectedRows} records`);
    
    // Step 3: Remove FREE_MEAL from ENUM (optional, but cleaner)
    console.log('\nStep 3: Removing FREE_MEAL from ENUM...');
    await db.query(`
      ALTER TABLE registrations 
      MODIFY COLUMN coupon_type ENUM('BUY_1_GET_1', 'DISCOUNT_50') NOT NULL
    `);
    console.log('✅ FREE_MEAL removed from ENUM');
    
    // Verify final state
    const [columns] = await db.query(`
      SHOW COLUMNS FROM registrations WHERE Field = 'coupon_type'
    `);
    
    console.log('\nFinal column definition:');
    console.log(`  Type: ${columns[0].Type}`);
    
    const [distribution] = await db.query(`
      SELECT coupon_type, COUNT(*) as count 
      FROM registrations 
      GROUP BY coupon_type
    `);
    
    console.log('\nCurrent distribution:');
    distribution.forEach(row => {
      console.log(`  ${row.coupon_type}: ${row.count}`);
    });
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCouponEnum();
