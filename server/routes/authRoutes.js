// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Pre-flight Check for JWT Secret ---
// This ensures your application won't run with a weak, default secret.
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1);
}

// =========================================================================
// DANGER: A public signup route for an admin panel is a major security risk.
// It allows anyone to create an administrator account.
// In a real production environment, you should either:
// 1. REMOVE this endpoint after creating your initial admin user(s).
// 2. Protect this route so only an existing, logged-in admin can create new users.
// =========================================================================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    
    // Check if user exists
    const [existingUser] = await db.query('SELECT email FROM admin_users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Use a cost factor of 12 for better security
    
    // Create user
    await db.query(
      'INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @desc    Log in an admin user and return a JWT
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user by email
    const [users] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Use a generic message
    }

    const user = users[0];
    
    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Use a generic message
    }

    // 3. Create JWT
    const payload = { userId: user.id, email: user.email, name: user.name };
    console.log('[Login] Signing token with secret:', process.env.JWT_SECRET);
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // CRITICAL: Always use the secret from environment variables
      { expiresIn: '8h' } 
    );

    // 4. Respond with token and user info
    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// @desc    Verify if a token is valid (lightweight check for frontend)
// @route   GET /api/auth/verify
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ valid: false, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    // Catches expired tokens, invalid signatures, etc.
    res.json({ valid: false, message: error.message });
  }
});


// @desc    Get the current logged-in user's profile from their token
// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user data from the database using the ID from the token
    const [users] = await db.query('SELECT id, name, email, created_at FROM admin_users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// This single export at the end fixes the issue of overwritten routes.
module.exports = router;