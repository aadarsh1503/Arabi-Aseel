const express = require('express');
const multer = require('multer');
const ImageKit = require('imagekit');
const db = require('../db'); // Apne db connection file ka path check kar lein

const router = express.Router();

// Multer ko memory storage use karne ke liye configure karein
const upload = multer({ storage: multer.memoryStorage() });

// ImageKit Configuration
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_RYKRKdzOdcoWnPjzcMpGEj1X78w=',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_W75POQcM70YTIeEzNaHGUUMMGMc=',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/nugjaumnw/Arabiaseel/'
});

// === CRUD OPERATIONS (UPDATED) ===

// CREATE a new Chef
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // UPDATE: Get Arabic fields from body
    const { name, designation, name_ar, designation_ar } = req.body;
    
    // UPDATE: Validation for all fields
    if (!name || !designation || !name_ar || !designation_ar || !req.file) {
      return res.status(400).json({ message: 'All fields (English & Arabic) and image are required.' });
    }

    // Image ko ImageKit par upload karein
    const imageUploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `chef_${Date.now()}_${req.file.originalname}`,
      folder: '/chefs/'
    });

    // UPDATE: SQL Insert Query with Arabic fields
    const [result] = await db.execute(
      'INSERT INTO chefs (name, designation, name_ar, designation_ar, image_url, image_file_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, designation, name_ar, designation_ar, imageUploadResponse.url, imageUploadResponse.fileId]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      designation,
      name_ar,
      designation_ar,
      imageUrl: imageUploadResponse.url
    });
  } catch (error) {
    console.error('Error creating chef:', error);
    res.status(500).json({ message: 'Server error while creating chef.' });
  }
});

// READ all Chefs
router.get('/', async (req, res) => {
  try {
    // UPDATE: Select Arabic fields as well
    const [chefs] = await db.execute('SELECT id, name, designation, name_ar, designation_ar, image_url FROM chefs ORDER BY created_at DESC');
    res.status(200).json(chefs);
  } catch (error) {
    console.error('Error fetching chefs:', error);
    res.status(500).json({ message: 'Server error while fetching chefs.' });
  }
});

// UPDATE a Chef
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    // UPDATE: Get Arabic fields from body
    const { name, designation, name_ar, designation_ar } = req.body;

    try {
        const [rows] = await db.execute('SELECT image_file_id FROM chefs WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Chef not found.' });
        }
        const oldImageFileId = rows[0].image_file_id;

        // UPDATE: Base SQL query and params for all fields
        let sql = 'UPDATE chefs SET name = ?, designation = ?, name_ar = ?, designation_ar = ?';
        const params = [name, designation, name_ar, designation_ar];

        // Agar nayi image upload hui hai (this part remains the same)
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `chef_${Date.now()}_${req.file.originalname}`,
                folder: '/chefs/'
            });
            
            sql += ', image_url = ?, image_file_id = ?';
            params.push(uploadResponse.url, uploadResponse.fileId);

            if (oldImageFileId) {
                await imagekit.deleteFile(oldImageFileId);
            }
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

// DELETE a Chef (No changes needed in this route)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT image_file_id FROM chefs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Chef not found.' });
    }
    const imageFileId = rows[0].image_file_id;
    await imagekit.deleteFile(imageFileId);
    await db.execute('DELETE FROM chefs WHERE id = ?', [id]);
    res.status(200).json({ message: 'Chef deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chef:', error);
    res.status(500).json({ message: 'Server error while deleting chef.' });
  }
});

module.exports = router;