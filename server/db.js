import 'dotenv/config'; // Cleaner way to load .env variables for ES Modules
import mysql from 'mysql2/promise';

// Create the connection pool using environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  connectTimeout: 60000, // 60 seconds timeout
  acquireTimeout: 60000,
  timeout: 60000
});

// Immediately invoked async function to test the database connection on startup.
// This provides instant feedback if credentials are wrong and prevents the app from running in a broken state.
(async () => {
  try {
    // Get a connection from the pool to verify credentials
    const connection = await db.getConnection();
    console.log('✅ Connected to MySQL Database');
    // Release the connection back to the pool
    connection.release();
  } catch (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    // Exit the process with a failure code if the connection fails
    process.exit(1);
  }
})();

// Export the pool as the default export of this module
export default db;