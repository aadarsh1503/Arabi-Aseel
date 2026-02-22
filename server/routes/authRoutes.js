import express from 'express';
import db from '../db.js'; // Added .js extension
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js'; // Added .js extension

const router = express.Router();

// --- Pre-flight Check for JWT Secret ---
// This ensures your application won't run with a weak, default secret.
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1);
}

// =========================================================================
// DANGER: A public signup route for an admin panel is a major security risk.
// =========================================================================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    
    const [existingUser] = await db.query('SELECT email FROM admin_users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
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
    
    const [users] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user.id, email: user.email, name: user.name };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' } 
    );

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


// @desc    Verify if a token is valid
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
    res.json({ valid: false, message: error.message });
  }
});


// @desc    Get the current logged-in user's profile
// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please provide an email address.' });
    }

    const [users] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.query(
      'UPDATE admin_users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [hashedToken, resetExpires, user.id]
    );

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <!DOCTYPE html>
      <html lang="en">
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #121212;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                  <td style="padding: 20px 0;">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #000000; border-radius: 8px; border: 1px solid #222222;">
                          <tr><td align="center" style="padding: 40px 0 30px 0;"><img src="https://www.arabiaseel.com/assets/i2-BYeRhIhH.png" alt="Arabiaseel Logo" width="180" style="display: block;" /></td></tr>
                          <tr><td style="padding: 0 40px 20px 40px;"><h1 style="font-size: 24px; margin: 0; color: #FFFFFF; text-align: center;">Password Reset Request</h1></td></tr>
                          <tr><td style="padding: 0 40px 30px 40px; font-size: 16px; line-height: 1.5; color: #FFFFFF; text-align: center;"><p style="margin: 0 0 15px 0;">You are receiving this email because a password reset was requested for your account. If you did not request this, you can safely ignore this email.</p><p style="margin: 0;">To reset your password, please click the button below:</p></td></tr>
                          <tr><td align="center" style="padding: 0 0 40px 0;"><a href="${resetURL}" style="display: inline-block; padding: 14px 28px; font-size: 16px; color: #ffffff; text-decoration: none; background-color: #724F38; border-radius: 5px; font-weight: bold;">Reset Your Password</a></td></tr>
                          <tr><td style="padding: 0 40px 20px 40px; font-size: 14px; line-height: 1.5; color: #AAAAAA; text-align: center;"><p style="margin: 0 0 10px 0;">This link is only valid for the next 10 minutes.</p><p style="margin: 0;">If you're having trouble, copy and paste this URL into your browser:<br><a href="${resetURL}" style="color: #724F38; text-decoration: underline; word-break: break-all;">${resetURL}</a></p></td></tr>
                          <tr><td align="center" style="padding: 20px 40px; background-color: #1c1c1c; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;"><p style="margin: 0; font-size: 12px; color: #777777;">&copy; ${new Date().getFullYear()} Arabiaseel. All rights reserved.</p></td></tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Link (Valid for 10 min)',
      html: message,
    });

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});


// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required.' });
        }
        
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const [users] = await db.query(
            'SELECT * FROM admin_users WHERE password_reset_token = ? AND password_reset_expires > NOW()',
            [hashedToken]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        const user = users[0];
        const hashedPassword = await bcrypt.hash(password, 12);

        await db.query(
            'UPDATE admin_users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.json({ message: 'Password has been reset successfully. You can now log in.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
});

export default router;