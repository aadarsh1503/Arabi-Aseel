require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0
});

db.getConnection()
  .then(() => console.log('✅ Connected to MySQL Database'))
  .catch(err => {
    console.error('❌ MySQL Connection Error:', err.message);
    console.error('📄 Error Code:', err.code);
    console.error('📦 SQL State:', err.sqlState);
    console.error('🧠 Full Error Object:', err);
    process.exit(1);
  });

module.exports = db;
