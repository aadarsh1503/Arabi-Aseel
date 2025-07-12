const express = require('express');
const multer = require('multer');
const ImageKit = require('imagekit');
const db = require('../db'); // Apne db connection file ka path check kar lein

const router = express.Router();
console.log('Router initialized');

// Multer ko memory storage use karne ke liye configure karein
const upload = multer({ storage: multer.memoryStorage() });
console.log('Multer configured with memory storage');

// ImageKit Configuration
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_RYKRKdzOdcoWnPjzcMpGEj1X78w=',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_W75POQcM70YTIeEzNaHGUUMMGMc=',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/nugjaumnw/Arabiaseel/'
});
console.log('ImageKit configured with:', {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? '***' : 'using default',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? '***' : 'using default'
});

// === CRUD OPERATIONS (UPDATED) ===

// CREATE a new Chef
router.post('/', upload.single('image'), async (req, res) => {
  console.log('POST / - Creating new chef');
  try {
    // UPDATE: Get Arabic fields from body
    console.log('Request body:', req.body);
    const { name, designation, name_ar, designation_ar } = req.body;
    
    // UPDATE: Validation for all fields
    console.log('Validating fields...');
    if (!name || !designation || !name_ar || !designation_ar || !req.file) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ message: 'All fields (English & Arabic) and image are required.' });
    }

    // Image ko ImageKit par upload karein
    console.log('Uploading image to ImageKit...');
    const imageUploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `chef_${Date.now()}_${req.file.originalname}`,
      folder: '/chefs/'
    });
    console.log('Image uploaded to ImageKit:', imageUploadResponse);

    // UPDATE: SQL Insert Query with Arabic fields
    console.log('Inserting chef into database...');
    const [result] = await db.execute(
      'INSERT INTO chefs (name, designation, name_ar, designation_ar, image_url, image_file_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, designation, name_ar, designation_ar, imageUploadResponse.url, imageUploadResponse.fileId]
    );
    console.log('Database insert result:', result);

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
  console.log('GET / - Fetching all chefs');
  try {
    // UPDATE: Select Arabic fields as well
    console.log('Executing database query...');
    const [chefs] = await db.execute('SELECT id, name, designation, name_ar, designation_ar, image_url FROM chefs ORDER BY created_at DESC');
    console.log('Fetched chefs:', chefs.length);
    res.status(200).json(chefs);
  } catch (error) {
    console.error('Error fetching chefs:', error);
    res.status(500).json({ message: 'Server error while fetching chefs.' });
  }
});

// UPDATE a Chef
router.put('/:id', upload.single('image'), async (req, res) => {
    console.log(`PUT /${req.params.id} - Updating chef`);
    const { id } = req.params;
    // UPDATE: Get Arabic fields from body
    console.log('Request body:', req.body);
    const { name, designation, name_ar, designation_ar } = req.body;

    try {
        console.log('Fetching existing chef data...');
        const [rows] = await db.execute('SELECT image_file_id FROM chefs WHERE id = ?', [id]);
        if (rows.length === 0) {
            console.log('Chef not found with id:', id);
            return res.status(404).json({ message: 'Chef not found.' });
        }
        const oldImageFileId = rows[0].image_file_id;
        console.log('Old image file ID:', oldImageFileId);

        // UPDATE: Base SQL query and params for all fields
        let sql = 'UPDATE chefs SET name = ?, designation = ?, name_ar = ?, designation_ar = ?';
        const params = [name, designation, name_ar, designation_ar];
        console.log('Base SQL:', sql);
        console.log('Base params:', params);

        // Agar nayi image upload hui hai (this part remains the same)
        if (req.file) {
            console.log('New image detected, uploading...');
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `chef_${Date.now()}_${req.file.originalname}`,
                folder: '/chefs/'
            });
            console.log('New image uploaded:', uploadResponse);
            
            sql += ', image_url = ?, image_file_id = ?';
            params.push(uploadResponse.url, uploadResponse.fileId);

            if (oldImageFileId) {
                console.log('Deleting old image from ImageKit...');
                await imagekit.deleteFile(oldImageFileId);
            }
        }
        
        sql += ' WHERE id = ?';
        params.push(id);
        console.log('Final SQL:', sql);
        console.log('Final params:', params);

        console.log('Executing update query...');
        await db.execute(sql, params);
        
        res.status(200).json({ message: 'Chef updated successfully.' });

    } catch (error) {
        console.error('Error updating chef:', error);
        res.status(500).json({ message: 'Server error while updating chef.' });
    }
});

// DELETE a Chef (No changes needed in this route)
router.delete('/:id', async (req, res) => {
  console.log(`DELETE /${req.params.id} - Deleting chef`);
  try {
    const { id } = req.params;
    console.log('Fetching chef to delete...');
    const [rows] = await db.execute('SELECT image_file_id FROM chefs WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.log('Chef not found with id:', id);
      return res.status(404).json({ message: 'Chef not found.' });
    }
    const imageFileId = rows[0].image_file_id;
    console.log('Deleting image from ImageKit...');
    await imagekit.deleteFile(imageFileId);
    console.log('Deleting chef from database...');
    await db.execute('DELETE FROM chefs WHERE id = ?', [id]);
    res.status(200).json({ message: 'Chef deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chef:', error);
    res.status(500).json({ message: 'Server error while deleting chef.' });
  }
});

console.log('Chef routes setup completed');
module.exports = router;