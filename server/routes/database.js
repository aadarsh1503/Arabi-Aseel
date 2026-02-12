import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  exportAllData,
  createBackup,
  listBackups,
  downloadBackup,
  restoreBackup
} from '../controllers/databaseController.js';

const router = express.Router();

// All routes are protected (admin only)
router.get('/export-all', protect, exportAllData);
router.post('/backup', protect, createBackup);
router.get('/backups', protect, listBackups);
router.get('/backups/:filename', protect, downloadBackup);
router.post('/restore/:filename', protect, restoreBackup);

export default router;
