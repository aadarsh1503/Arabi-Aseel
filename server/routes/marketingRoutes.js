import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js'; 
import { 
    addItem, 
    getAdminData, 
    updateSettings, 
    deleteItem,
    startGame, // Changed from requestOtp/verifyOtp
    spinWheel,
    getSpinLogs
} from '../controllers/marketingController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- Admin Routes (Protected) ---
router.get('/admin/config', protect, getAdminData);
router.put('/admin/config', protect, updateSettings);
router.post('/admin/items', protect, upload.single('image'), addItem);
router.delete('/admin/items/:id', protect, deleteItem);
router.get('/admin/logs', protect, getSpinLogs); 
// --- Public Routes (User Facing) ---
router.post('/start', startGame); // New Route: Registers user and returns items
router.post('/spin', spinWheel);


export default router;