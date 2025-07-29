require('dotenv').config(); // Ensure dotenv is loaded first
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/authRoutes');
const chefRoutes = require('./routes/chefRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://arabiaseel.com',
  'https://arabiaseel.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// --- CRITICAL: Correct Middleware Setup ---
// Use the built-in Express middleware. This should come BEFORE your routes.
// express.json() is for parsing application/json
app.use(express.json()); 
// express.urlencoded() is for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
console.log('[Server Start] JWT_SECRET:', process.env.JWT_SECRET);
// Multer (which you use in your routes) will handle multipart/form-data.
// By NOT using a global body-parser that conflicts, we allow multer to work correctly.

// --- Routes ---
// Mount your routes AFTER the middleware.
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chefs', chefRoutes);

// --- Simple Root Route for Health Check ---
app.get('/', (req, res) => {
    res.send('Arabi Aseel API is running!');
});

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});