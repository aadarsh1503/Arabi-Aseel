import db from '../db.js';

async function updateCouponTypes() {
  try {
    console.log('Updating old coupon types to new naming convention...\n');
    
    // Show current state
    const [before] = await db.query(`
      SELECT coupon_type, COUNT(*) as count 
      FROM registrations 
      GROUP BY coupon_type
    `);
    
    console.log('Before update:');
    before.forEach(row => {
      console.log(`  ${row.coupon_type}: ${row.count}`);
    });
    
    // Update FREE_MEAL to BUY_1_GET_1
    const [result1] = await db.query(`
      UPDATE registrations 
      SET coupon_type = 'BUY_1_GET_1' 
      WHERE coupon_type = 'FREE_MEAL'
    `);
    
    console.log(`\n✅ Updated ${result1.affectedRows} records from FREE_MEAL to BUY_1_GET_1`);
    
    // Show updated state
    const [after] = await db.query(`
      SELECT coupon_type, COUNT(*) as count 
      FROM registrations 
      GROUP BY coupon_type
    `);
    
    console.log('\nAfter update:');
    after.forEach(row => {
      console.log(`  ${row.coupon_type}: ${row.count}`);
    });
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error updating coupon types:', error);
    process.exit(1);
  }
}

updateCouponTypes();
