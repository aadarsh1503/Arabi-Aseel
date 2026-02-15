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

console.log('🔧 [REGISTRATION ROUTES] Initializing registration routes...');

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
console.log('✅ [REGISTRATION] GET /country registered');

router.post('/verify-location', verifyLocation); // Verify location is in eligible areas
console.log('✅ [REGISTRATION] POST /verify-location registered');

router.post('/register', registerCustomer);
console.log('✅ [REGISTRATION] POST /register registered');

// Protected routes - Admin only
router.get('/all', protect, getAllRegistrations);
console.log('✅ [REGISTRATION] GET /all registered (protected)');

router.patch('/:id/use', protect, markCouponUsed);
console.log('✅ [REGISTRATION] PATCH /:id/use registered (protected)');

router.delete('/:id', protect, deleteRegistration);
console.log('✅ [REGISTRATION] DELETE /:id registered (protected)');

router.get('/export/csv', protect, exportRegistrationsCSV);
console.log('✅ [REGISTRATION] GET /export/csv registered (protected)');

router.get('/export/excel', protect, exportRegistrationsExcel);
console.log('✅ [REGISTRATION] GET /export/excel registered (protected)');

export default router;
