require('dotenv').config(); // Ensure dotenv is loaded first
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/authRoutes');
const chefRoutes = require('./routes/chefRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- ROBUST CORS Configuration for Production ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://arabiaseel.com',
  'https://arabiaseel.vercel.app'
];

const corsOptions = {
  // The origin property can take an array directly. This is the safest way.
  origin: allowedOrigins,

  // Specify the methods the frontend is allowed to use.
  methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  
  // Specify the headers the frontend is allowed to send.
  // This is CRITICAL for your authentication to work.
  allowedHeaders: 'Content-Type, Authorization',
  
  // This is needed to allow cookies or authorization headers.
  credentials: true,
  
  // Some legacy browsers (IE11, various SmartTVs) choke on 204.
  // For pre-flight requests, we send 204 No Content.
  optionsSuccessStatus: 204 
};

// Use the new options
app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
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