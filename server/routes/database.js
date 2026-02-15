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

console.log('🔧 [DATABASE ROUTES] Initializing database routes...');

// All routes are protected (admin only)
router.get('/export-all', protect, exportAllData);
console.log('✅ [DATABASE] GET /export-all registered');

router.post('/backup', protect, createBackup);
console.log('✅ [DATABASE] POST /backup registered');

router.get('/backups', protect, listBackups);
console.log('✅ [DATABASE] GET /backups registered');

router.get('/backups/:filename', protect, downloadBackup);
console.log('✅ [DATABASE] GET /backups/:filename registered');

router.post('/restore/:filename', protect, restoreBackup);
console.log('✅ [DATABASE] POST /restore/:filename registered');

export default router;
