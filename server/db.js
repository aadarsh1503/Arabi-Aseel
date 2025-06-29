// db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "menu_management_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection()
  .then(() => console.log('✅ Connected to MySQL Database'))
  .catch(err => {
    console.error('❌ MySQL Connection Error:', err.message);
    process.exit(1);
  });

module.exports = db;
