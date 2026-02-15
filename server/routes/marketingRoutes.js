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

console.log('🔧 [MARKETING ROUTES] Initializing marketing routes...');

// ================= ADMIN ROUTES (Protected) =================
// Only logged-in admins can access these
router.get('/admin/config', protect, getAdminData);
console.log('✅ [MARKETING] GET /admin/config registered (protected)');

router.put('/admin/config', protect, updateSettings);
console.log('✅ [MARKETING] PUT /admin/config registered (protected)');

// Create Item
router.post('/admin/items', protect, upload.single('image'), addItem);
console.log('✅ [MARKETING] POST /admin/items registered (protected)');

// --- NEW ROUTES FOR EDIT & REORDER ---
// Note: "reorder" must come BEFORE ":id" to avoid conflict
router.put('/admin/items/reorder', protect, reorderItems); 
console.log('✅ [MARKETING] PUT /admin/items/reorder registered (protected)');

router.put('/admin/items/:id', protect, upload.single('image'), updateItem); 
console.log('✅ [MARKETING] PUT /admin/items/:id registered (protected)');
// -------------------------------------

// Delete Item
router.delete('/admin/items/:id', protect, deleteItem);
console.log('✅ [MARKETING] DELETE /admin/items/:id registered (protected)');

router.get('/admin/logs', protect, getSpinLogs); 
console.log('✅ [MARKETING] GET /admin/logs registered (protected)');

// Dangerous actions (Deleting logs) must be protected
router.delete('/participants/:id', protect, deleteParticipant);
console.log('✅ [MARKETING] DELETE /participants/:id registered (protected)');

router.delete('/participants', protect, deleteAllParticipants);
console.log('✅ [MARKETING] DELETE /participants registered (protected)');

// ================= PUBLIC ROUTES (User Facing) =================
// No login required
router.get('/config', getPublicConfig); // Frontend checks game status
console.log('✅ [MARKETING] GET /config registered (public)');

router.post('/start', startGame);       // Register user
console.log('✅ [MARKETING] POST /start registered (public)');

router.post('/spin', spinWheel);        // Spin logic
console.log('✅ [MARKETING] POST /spin registered (public)');

router.post('/geocode', getGeoLocation); // Google Maps Proxy
console.log('✅ [MARKETING] POST /geocode registered (public)');

export default router;