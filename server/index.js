import express from 'express';
import dotenv from 'dotenv';

// Import route modules for /api routes (without trailing slash)
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import authRoutes from './routes/authRoutes.js';
import chefRoutes from './routes/chefRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Disable strict routing to handle trailing slashes
app.set('strict routing', false);
app.set('case sensitive routing', false);

// Middleware
app.use(express.json());

// Fix trailing slash issues - Normalize URLs
app.use((req, res, next) => {
  // Remove trailing slash except for root
  if (req.path !== '/' && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});

// Routes - These work with /api proxy (no trailing slash)
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chefs', chefRoutes);

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
  console.log(`🚀 Main Server (index.js) running on http://localhost:${PORT}`);
  console.log(`📋 Routes: /api/admin, /api/public, /api/auth, /api/chefs`);
});
