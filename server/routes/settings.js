import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getVersion, updateVersion } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/version', protect, getVersion);
router.put('/version', protect, updateVersion);

export default router;
