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

const router = express.Router();

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
