import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getVersion, updateVersion } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/version', getVersion); // Public route - no auth needed

router.put('/version', protect, updateVersion);

export default router;
