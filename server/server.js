import express from 'express';
import dotenv from 'dotenv';

// Import route modules for /api/ routes (with trailing slash)
import marketingRoutes from './routes/marketingRoutes.js';
import registrationRoutes from './routes/registration.js';
import databaseRoutes from './routes/database.js';
import settingsRoutes from './routes/settings.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT_SECONDARY || 5001;

// Disable strict routing to handle trailing slashes
app.set('strict routing', false);
app.set('case sensitive routing', false);

// Middleware
app.use(express.json());

// NO trailing slash redirect middleware here - allow trailing slashes

// Routes - These work with /api/ proxy (with trailing slash)
app.use('/api/marketing', marketingRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.url
  });
});

// Server
app.listen(PORT, () => {
  console.log(`🚀 Secondary Server (server.js) running on http://localhost:${PORT}`);
  console.log(`📋 Routes: /api/marketing, /api/registration, /api/database, /api/settings`);
});
