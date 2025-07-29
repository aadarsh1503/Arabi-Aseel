const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const chefRoutes = require('./routes/chefRoutes');
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
app.use(bodyParser.json());
// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chefs', chefRoutes);
// Server
app.listen(PORT, () => {
console.log(`🚀 Server running on http://localhost:${PORT}`);
});