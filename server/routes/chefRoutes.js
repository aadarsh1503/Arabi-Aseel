const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const ImageKit = require('imagekit');
const { fileTypeFromBuffer } = require('file-type');
const { protect } = require('../middleware/authMiddleware');

// ImageKit Configuration
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// SECURE Multer Configuration for Chefs
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: async (req, file, cb) => {
    // FIX: First, check if a file was even provided.
    // If not, it's a valid request (e.g., updating text fields), so allow it.
    if (!file) {
      return cb(null, true);
    }

    // Now that we know a file exists, we can safely check its type.
    try {
      // NOTE: Using file.mimetype is faster and safer than reading the buffer here.
      // The browser sends this, and while it can be spoofed, it's a good first check.
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
      } else {
        // For extra security, you could still check fileTypeFromBuffer here as a fallback
        const fileType = await fileTypeFromBuffer(file.buffer);
        if (fileType && allowedMimeTypes.includes(fileType.mime)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'), false); // Reject the file
        }
      }
    } catch (error) {
      cb(error);
    }
  }
});
// --- SECURED CRUD OPERATIONS ---

// CREATE a new Chef
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, designation, name_ar, designation_ar } = req.body;
    if (!name || !designation || !name_ar || !designation_ar || !req.file) {
      return res.status(400).json({ message: 'All fields (English & Arabic) and image are required.' });
    }
    const imageUploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `chef_${Date.now()}_${req.file.originalname}`,
      folder: '/chefs/'
    });
    const [result] = await db.execute(
      'INSERT INTO chefs (name, designation, name_ar, designation_ar, image_url, image_file_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, designation, name_ar, designation_ar, imageUploadResponse.url, imageUploadResponse.fileId]
    );
    res.status(201).json({ id: result.insertId, name, designation, name_ar, designation_ar, imageUrl: imageUploadResponse.url });
  } catch (error) {
    console.error('Error creating chef:', error);
    res.status(500).json({ message: 'Server error while creating chef.' });
  }
});

// READ all Chefs (Public is okay)
router.get('/', async (req, res) => {
  try {
    const [chefs] = await db.execute('SELECT id, name, designation, name_ar, designation_ar, image_url FROM chefs ORDER BY created_at DESC');
    res.status(200).json(chefs);
  } catch (error) {
    console.error('Error fetching chefs:', error);
    res.status(500).json({ message: 'Server error while fetching chefs.' });
  }
});

// UPDATE a Chef
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, designation, name_ar, designation_ar } = req.body;
    try {
        const [rows] = await db.execute('SELECT image_file_id FROM chefs WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Chef not found.' });
        
        let sql = 'UPDATE chefs SET name = ?, designation = ?, name_ar = ?, designation_ar = ?';
        const params = [name, designation, name_ar, designation_ar];

        if (req.file) {
            const uploadResponse = await imagekit.upload({ file: req.file.buffer, fileName: `chef_${Date.now()}_${req.file.originalname}`, folder: '/chefs/' });
            sql += ', image_url = ?, image_file_id = ?';
            params.push(uploadResponse.url, uploadResponse.fileId);
            if (rows[0].image_file_id) await imagekit.deleteFile(rows[0].image_file_id);
        }
        
        sql += ' WHERE id = ?';
        params.push(id);
        await db.execute(sql, params);
        res.status(200).json({ message: 'Chef updated successfully.' });
    } catch (error) {
        console.error('Error updating chef:', error);
        res.status(500).json({ message: 'Server error while updating chef.' });
    }
});

// DELETE a Chef
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT image_file_id FROM chefs WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Chef not found.' });
    
    if(rows[0].image_file_id) await imagekit.deleteFile(rows[0].image_file_id);
    await db.execute('DELETE FROM chefs WHERE id = ?', [id]);
    res.status(200).json({ message: 'Chef deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chef:', error);
    res.status(500).json({ message: 'Server error while deleting chef.' });
  }
});

module.exports = router;