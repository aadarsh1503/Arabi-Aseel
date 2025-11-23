import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your route modules, making sure to add the .js extension
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import authRoutes from './routes/authRoutes.js';
import chefRoutes from './routes/chefRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://arabiaseel.com',
  'https://arabiaseel.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
// Replaced deprecated bodyParser with the built-in express.json()
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/marketing', marketingRoutes);
// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});