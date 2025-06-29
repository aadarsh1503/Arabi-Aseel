// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/admin', adminRoutes); // POST/PUT/DELETE for admin
app.use('/api/public', publicRoutes); // GET for frontend users
app.use('/api/auth', authRoutes);
// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
