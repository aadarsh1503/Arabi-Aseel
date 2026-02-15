import express from 'express';
// import cors from 'cors';
import dotenv from 'dotenv';

// Import your route modules, making sure to add the .js extension
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import authRoutes from './routes/authRoutes.js';
import chefRoutes from './routes/chefRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';
import registrationRoutes from './routes/registration.js';
import databaseRoutes from './routes/database.js';
import settingsRoutes from './routes/settings.js';
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
// const allowedOrigins = [
//   'https://arabiaseel.vercel.app',
//   'http://localhost:5173'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Middleware
// Replaced deprecated bodyParser with the built-in express.json()
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/settings', settingsRoutes);
// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});