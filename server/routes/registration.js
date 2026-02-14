import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerCustomer,
  getAllRegistrations,
  markCouponUsed,
  exportRegistrationsCSV,
  exportRegistrationsExcel,
  getCountryFromIP,
  deleteRegistration,
  verifyLocation
} from '../controllers/registrationController.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Middleware to log all registration API requests
router.use((req, res, next) => {
  logger.info('REGISTRATION_API', `${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Public routes
router.get('/country', getCountryFromIP); // Get country from IP
router.post('/verify-location', verifyLocation); // Verify location is in eligible areas
router.post('/register', registerCustomer);

// Protected routes - Admin only
router.get('/all', protect, getAllRegistrations);
router.patch('/:id/use', protect, markCouponUsed);
router.delete('/:id', protect, deleteRegistration);
router.get('/export/csv', protect, exportRegistrationsCSV);
router.get('/export/excel', protect, exportRegistrationsExcel);

export default router;
