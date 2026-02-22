import express from 'express';
import db from '../db.js';
import multer from 'multer';
import ImageKit from 'imagekit';
// Using file-type v17+ which is an ESM module.
import { fileTypeFromBuffer } from 'file-type';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

//Configure multer for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedClientMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedClientMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error('Invalid file type declared by client. Only JPEG, PNG, and WEBP are allowed.'),
        false
      );
    }
  },
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, designation, name_ar, designation_ar } = req.body;

    if (!name || !designation || !name_ar || !designation_ar || !req.file) {
      return res.status(400).json({
        message: 'All fields (English & Arabic) and image are required.',
      });
    }

    const fileType = await fileTypeFromBuffer(req.file.buffer);

    const allowedActualMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!fileType || !allowedActualMimeTypes.includes(fileType.mime)) {
      return res.status(400).json({
        message: 'Invalid file content. Only JPEG, PNG, and WEBP files are allowed.',
      });
    }

    const imageUploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `chef_${Date.now()}_${req.file.originalname}`,
      folder: '/chefs/',
    });

    const [result] = await db.execute(
      `INSERT INTO chefs (name, designation, name_ar, designation_ar, image_url, image_file_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        designation,
        name_ar,
        designation_ar,
        imageUploadResponse.url,
        imageUploadResponse.fileId,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      designation,
      name_ar,
      designation_ar,
      imageUrl: imageUploadResponse.url,
    });

  } catch (error) {
    console.error('❌ Error creating chef:', error);
    res.status(500).json({
      message: error.message || 'Server error while creating chef.',
    });
  }
});
router.get('/', async (req, res) => {
  try {
    const [chefs] = await db.execute(
      'SELECT id, name, designation, name_ar, designation_ar, image_url FROM chefs ORDER BY id DESC'
    );
    res.status(200).json(chefs);
  } catch (error) {
    console.error(' Error fetching chefs:', error);
    res.status(500).json({ message: 'Server error while fetching chefs.' });
  }
});

router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, name_ar, designation_ar } = req.body;

    const [rows] = await db.execute('SELECT image_file_id FROM chefs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Chef not found.' });
    }

    let sql = 'UPDATE chefs SET name = ?, designation = ?, name_ar = ?, designation_ar = ?';
    const params = [name, designation, name_ar, designation_ar];

    if (req.file) {
      const fileType = await fileTypeFromBuffer(req.file.buffer);
      const allowedActualMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!fileType || !allowedActualMimeTypes.includes(fileType.mime)) {
        return res.status(400).json({
          message: 'Invalid file content. Only JPEG, PNG, and WEBP files are allowed.',
        });
      }

      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `chef_${Date.now()}_${req.file.originalname}`,
        folder: '/chefs/',
      });

      sql += ', image_url = ?, image_file_id = ?';
      params.push(uploadResponse.url, uploadResponse.fileId);

      if (rows[0].image_file_id) {
        await imagekit.deleteFile(rows[0].image_file_id);
      }
    }

    sql += ' WHERE id = ?';
    params.push(id);
    await db.execute(sql, params);

    res.status(200).json({ message: 'Chef updated successfully.' });
  } catch (error) {
    console.error(' Error updating chef:', error);
    res.status(500).json({ message: 'Server error while updating chef.' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute('SELECT image_file_id FROM chefs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Chef not found.' });
    }

    if (rows[0].image_file_id) {
      await imagekit.deleteFile(rows[0].image_file_id);
    }

    await db.execute('DELETE FROM chefs WHERE id = ?', [id]);
    res.status(200).json({ message: 'Chef deleted successfully.' });
  } catch (error) {
    console.error(' Error deleting chef:', error);
    res.status(500).json({ message: 'Server error while deleting chef.' });
  }
});

export default router;