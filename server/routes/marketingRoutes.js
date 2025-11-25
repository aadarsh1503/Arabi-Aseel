import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js'; 
import { 
    addItem, 
    updateItem,   // <--- 1. Import Update Controller
    reorderItems, // <--- 2. Import Reorder Controller
    getAdminData, 
    updateSettings,
    deleteItem,
    startGame, 
    spinWheel,
    getSpinLogs,
    deleteParticipant,
    deleteAllParticipants,
    getPublicConfig,
    getGeoLocation 
} from '../controllers/marketingController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ================= ADMIN ROUTES (Protected) =================
// Only logged-in admins can access these
router.get('/admin/config', protect, getAdminData);
router.put('/admin/config', protect, updateSettings);

// Create Item
router.post('/admin/items', protect, upload.single('image'), addItem);

// --- NEW ROUTES FOR EDIT & REORDER ---
// Note: "reorder" must come BEFORE ":id" to avoid conflict
router.put('/admin/items/reorder', protect, reorderItems); 
router.put('/admin/items/:id', protect, upload.single('image'), updateItem); 
// -------------------------------------

// Delete Item
router.delete('/admin/items/:id', protect, deleteItem);

router.get('/admin/logs', protect, getSpinLogs); 

// Dangerous actions (Deleting logs) must be protected
router.delete('/participants/:id', protect, deleteParticipant);
router.delete('/participants', protect, deleteAllParticipants);

// ================= PUBLIC ROUTES (User Facing) =================
// No login required
router.get('/config', getPublicConfig); // Frontend checks game status
router.post('/start', startGame);       // Register user
router.post('/spin', spinWheel);        // Spin logic
router.post('/geocode', getGeoLocation); // Google Maps Proxy

export default router;