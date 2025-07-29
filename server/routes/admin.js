const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const ImageKit = require('imagekit');
const { fileTypeFromBuffer } = require('file-type'); // <-- Import for validation
const { protect } = require('../middleware/authMiddleware'); // <-- Import auth middleware

// Configure ImageKit (no changes here)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// --- UPDATED & SECURE Multer Configuration ---
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage to access the file buffer
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  },
  fileFilter: async (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    // 1. Check the provided mimetype from the client
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.'), false);
    }
    
    // 2. Verify the actual file type from its content (magic numbers)
    // This is much more secure than just checking the mimetype or extension.
    const fileType = await fileTypeFromBuffer(file.buffer);
    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
        return cb(new Error('File content does not match allowed image types!'), false);
    }

    cb(null, true); // File is valid
  }
});

// Helper to parse form fields (no changes here)
const parseFormDataFields = (body) => {
  try {
    return {
      ...body,
      price: body.price ? JSON.parse(body.price) : { Q: '', H: '', F: '', per_portion: '' },
      translations: body.translations ? JSON.parse(body.translations) : [],
      price_type: body.price_type || 'portion'
    };
  } catch (err) {
    console.error('Error parsing form data:', err);
    throw new Error('Invalid JSON data in form fields');
  }
};

// --- SECURED ROUTES ---
// All routes that create, update, or delete data are now protected by the 'protect' middleware.

// POST: Add new menu item
router.post('/menu', protect, upload.single('image'), async (req, res) => {
  try {
    const formData = parseFormDataFields(req.body);
    const { category_name, category_name_ar, price, translations, price_type } = formData;
    const imageFile = req.file;

    if (!category_name || !price || !translations) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let image_url = '';
    if (imageFile) {
      const result = await imagekit.upload({
        file: imageFile.buffer,
        fileName: imageFile.originalname,
        folder: "/menu_items",
        useUniqueFileName: true
      });
      image_url = result.url;
    }

    // Category handling
    const [categoryRows] = await db.execute('SELECT id FROM categories WHERE key_name = ?', [category_name]);
    let category_id;
    if (categoryRows.length > 0) {
      category_id = categoryRows[0].id;
      if (category_name_ar) {
        await db.execute('UPDATE categories SET ar_name = ? WHERE id = ?', [category_name_ar, category_id]);
      }
    } else {
      const [insertCategory] = await db.execute('INSERT INTO categories (key_name, ar_name) VALUES (?, ?)', [category_name, category_name_ar || '']);
      category_id = insertCategory.insertId;
    }

    // Insert menu item
    const [menuResult] = await db.execute(
      'INSERT INTO menu_items (category_id, image_url, price_q, price_h, price_f, price_type, price_per_portion) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        category_id, image_url,
        price_type === 'portion' ? (price.Q || null) : null,
        price_type === 'portion' ? (price.H || null) : null,
        price_type === 'portion' ? (price.F || null) : null,
        price_type,
        price_type === 'per_portion' ? (price.per_portion || null) : null
      ]
    );
    const menu_id = menuResult.insertId;

    // Insert translations
    for (const t of translations) {
      await db.execute('INSERT INTO menu_item_translations (menu_item_id, language_code, name, description) VALUES (?, ?, ?, ?)', [menu_id, t.language, t.name, t.description]);
    }

    res.status(201).json({ message: 'Menu item added successfully', data: { menu_id, image_url } });
  } catch (err) {
    console.error('Error in /menu POST:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// GET: Get all menu items (This can remain public for the admin panel to load)
router.get('/menu', async (req, res) => {
  // ... (Your GET logic remains the same)
  // No need to protect this if the admin panel needs to fetch data before a user is technically logged in
  // Or, if you prefer, you can add `protect` here as well.
  try {
    const [menuItems] = await db.execute(`
      SELECT m.id AS menu_id, m.image_url, m.price_q, m.price_h, m.price_f, m.price_type, m.price_per_portion, m.status, m.created_at,
             c.id AS category_id, c.key_name AS category_name, c.ar_name AS category_name_ar
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      ORDER BY c.key_name, m.id
    `);

    const [translations] = await db.execute(`SELECT * FROM menu_item_translations`);
    const menuWithTranslations = menuItems.map(item => ({
      ...item,
      translations: translations.filter(t => t.menu_item_id === item.menu_id).map(t => ({
          language: t.language_code, name: t.name, description: t.description
      }))
    }));
    res.json(menuWithTranslations);
  } catch (err) {
    console.error('Error in /menu GET:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// PATCH: Update menu item status
router.patch('/menu/:id/status', protect, async (req, res) => {
  // ... (Your PATCH logic remains the same)
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !['available', 'not available'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided.' });
  }
  try {
    const [result] = await db.execute('UPDATE menu_items SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Menu item not found.' });
    res.json({ message: 'Status updated successfully.' });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// DELETE: Delete a menu item
router.delete('/menu/:id', protect, async (req, res) => {
  // ... (Your DELETE logic remains the same)
  try {
    const { id } = req.params;
    const [menuRows] = await db.execute('SELECT category_id, image_url FROM menu_items WHERE id = ?', [id]);
    if (menuRows.length === 0) return res.status(404).json({ error: 'Menu item not found' });
    
    const categoryId = menuRows[0].category_id;
    await db.execute('DELETE FROM menu_item_translations WHERE menu_item_id = ?', [id]);
    await db.execute('DELETE FROM menu_items WHERE id = ?', [id]);

    const [categoryUsage] = await db.execute('SELECT COUNT(*) AS count FROM menu_items WHERE category_id = ?', [categoryId]);
    if (categoryUsage[0].count === 0) {
      await db.execute('DELETE FROM categories WHERE id = ?', [categoryId]);
    }
    res.json({ message: 'Menu item and related data deleted successfully' });
  } catch (err) {
    console.error('Error in /menu DELETE:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// PUT: Update a menu item
router.put('/menu/:id', protect, upload.single('image'), async (req, res) => {
  // ... (Your PUT logic remains the same)
  try {
    const { id } = req.params;
    const formData = parseFormDataFields(req.body);
    const { category_name, category_name_ar, price, translations, current_image_url, price_type } = formData;
    const imageFile = req.file;

    if (!category_name || !price || !translations) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let image_url = current_image_url || '';
    if (imageFile) {
      const result = await imagekit.upload({
        file: imageFile.buffer, fileName: imageFile.originalname, folder: "/menu_items", useUniqueFileName: true
      });
      image_url = result.url;
    }

    const [categoryRows] = await db.execute('SELECT id FROM categories WHERE key_name = ?', [category_name]);
    let category_id;
    if (categoryRows.length > 0) {
      category_id = categoryRows[0].id;
      if (category_name_ar) {
        await db.execute('UPDATE categories SET ar_name = ? WHERE id = ?', [category_name_ar, category_id]);
      }
    } else {
      const [insertCategory] = await db.execute('INSERT INTO categories (key_name, ar_name) VALUES (?, ?)', [category_name, category_name_ar || '']);
      category_id = insertCategory.insertId;
    }

    const [updateResult] = await db.execute(
      `UPDATE menu_items SET category_id = ?, image_url = ?, price_q = ?, price_h = ?, price_f = ?, price_type = ?, price_per_portion = ? WHERE id = ?`,
      [
        category_id, image_url,
        price_type === 'portion' ? (price.Q || null) : null,
        price_type === 'portion' ? (price.H || null) : null,
        price_type === 'portion' ? (price.F || null) : null,
        price_type,
        price_type === 'per_portion' ? (price.per_portion || null) : null,
        id
      ]
    );

    if (updateResult.affectedRows === 0) return res.status(404).json({ error: 'Menu item not found' });

    await db.execute('DELETE FROM menu_item_translations WHERE menu_item_id = ?', [id]);
    for (const t of translations) {
      await db.execute('INSERT INTO menu_item_translations (menu_item_id, language_code, name, description) VALUES (?, ?, ?, ?)', [id, t.language, t.name, t.description]);
    }
    res.json({ message: 'Menu item updated successfully', data: { menu_id: id, image_url } });
  } catch (err) {
    console.error('Error in /menu PUT:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;