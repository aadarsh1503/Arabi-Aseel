// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const [existingUser] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    await db.query(
      'INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Add to your auth.js routes
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ valid: false });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
});
// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user
    const [users] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    
    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Create token that expires in 1 minute (for testing)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'your_jwt_secret', // In production, use process.env.JWT_SECRET
      { expiresIn: '1h' } // 1 minute expiration
    );

    // 4. Respond with token and basic user info
    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      expiresIn: 3600  // Tell frontend the token expires in 60 seconds
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// In your auth.js routes
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Fetch user data from database
    const [user] = await db.query('SELECT id, name, email FROM admin_users WHERE id = ?', [decoded.userId]);
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
});
module.exports = router;