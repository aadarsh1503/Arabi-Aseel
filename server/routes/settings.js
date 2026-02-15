import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getVersion, updateVersion } from '../controllers/settingsController.js';

const router = express.Router();

console.log('🔧 [SETTINGS ROUTES] Initializing settings routes...');

router.get('/version', protect, getVersion);
console.log('✅ [SETTINGS] GET /version registered');

router.put('/version', protect, updateVersion);
console.log('✅ [SETTINGS] PUT /version registered');

export default router;
