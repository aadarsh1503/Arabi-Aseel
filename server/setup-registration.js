import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupRegistrationTable() {
  try {
    console.log('🔧 Setting up registrations table...');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'migrations', 'create_registrations_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute SQL
    await db.query(sql);

    console.log('✅ Registrations table created successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Add your Google Maps API key to .env file:');
    console.log('   GOOGLE_MAPS_API_KEY=your_api_key_here');
    console.log('');
    console.log('2. Share the registration link with customers:');
    console.log('   https://arabiaseel.com/register');
    console.log('');
    console.log('3. Access admin panel at:');
    console.log('   https://arabiaseel.com/admin/registrations');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up registrations table:', error.message);
    process.exit(1);
  }
}

setupRegistrationTable();
