const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const ImageKit = require('imagekit');

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_RYKRKdzOdcoWnPjzcMpGEj1X78w=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_W75POQcM70YTIeEzNaHGUUMMGMc=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/nugjaumnw/Arabiaseel/'
});

// Configure multer for file upload
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper to parse form fields
const parseFormDataFields = (body) => {
  try {
    return {
      ...body,
      price: body.price ? JSON.parse(body.price) : { Q: '', H: '', F: '' },
      translations: body.translations ? JSON.parse(body.translations) : []
    };
  } catch (err) {
    throw new Error('Invalid JSON data in form fields');
  }
};

// POST: Add new menu item
router.post('/menu', upload.single('image'), async (req, res) => {
  try {
    console.log('--- Incoming Request ---');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const formData = parseFormDataFields(req.body);
    const { category_name, category_name_ar, price, translations } = formData;

    console.log('Parsed formData:', formData);

    const imageFile = req.file;

    if (!category_name || !price || !translations) {
      console.warn('Missing required fields:', { category_name, price, translations });
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
      console.log('Image uploaded to:', image_url);
    }

    // Category handling - Updated to include Arabic name
    console.log('Checking if category exists for key_name:', category_name);

    const [categoryRows] = await db.execute(
      'SELECT id FROM categories WHERE key_name = ?',
      [category_name]
    );
    
    let category_id;
    if (categoryRows.length > 0) {
      category_id = categoryRows[0].id;
      console.log('Category exists with ID:', category_id);

      if (category_name_ar) {
        console.log('Updating Arabic name for category ID:', category_id, '->', category_name_ar);
        await db.execute(
          'UPDATE categories SET ar_name = ? WHERE id = ?',
          [category_name_ar, category_id]
        );
      } else {
        console.warn('Arabic category name not provided, skipping update');
      }
    } else {
      console.log('Inserting new category:', category_name, category_name_ar);
      const [insertCategory] = await db.execute(
        'INSERT INTO categories (key_name, ar_name) VALUES (?, ?)',
        [category_name, category_name_ar || '']
      );
      category_id = insertCategory.insertId;
      console.log('New category created with ID:', category_id);
    }

    // Insert menu item
    const [menuResult] = await db.execute(
      'INSERT INTO menu_items (category_id, image_url, price_q, price_h, price_f) VALUES (?, ?, ?, ?, ?)',
      [category_id, image_url, price.Q || '', price.H || '', price.F || '']
    );

    const menu_id = menuResult.insertId;
    console.log('New menu item inserted with ID:', menu_id);

    for (const t of translations) {
      console.log('Inserting translation:', t);
      await db.execute(
        'INSERT INTO menu_item_translations (menu_item_id, language_code, name, description) VALUES (?, ?, ?, ?)',
        [menu_id, t.language, t.name, t.description]
      );
    }

    console.log('All translations inserted.');

    res.status(201).json({ 
      message: 'Menu item added successfully',
      data: { menu_id, image_url }
    });
  } catch (err) {
    console.error('Error in /menu POST:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// GET: Get all menu items
router.get('/menu', async (req, res) => {
  try {
    const [menuItems] = await db.execute(`
      SELECT m.id AS menu_id, m.image_url, m.price_q, m.price_h, m.price_f,
             c.id AS category_id, c.key_name AS category_name, m.status, c.ar_name AS category_name_ar
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      ORDER BY c.key_name, m.id
    `);

    const [translations] = await db.execute(`SELECT * FROM menu_item_translations`);

    const menuWithTranslations = menuItems.map(item => {
      const itemTranslations = translations.filter(t => t.menu_item_id === item.menu_id);
      return {
        ...item,
        translations: itemTranslations.map(t => ({
          language: t.language_code,
          name: t.name,
          description: t.description
        }))
      };
    });

    res.json(menuWithTranslations);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});
router.patch('/menu/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['available', 'not available'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided.' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE menu_items SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.json({ message: 'Status updated successfully.' });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// DELETE: Delete a menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [menuRows] = await db.execute(
      'SELECT category_id, image_url FROM menu_items WHERE id = ?',
      [id]
    );

    if (menuRows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const categoryId = menuRows[0].category_id;
    const imageUrl = menuRows[0].image_url;

    await db.execute('DELETE FROM menu_item_translations WHERE menu_item_id = ?', [id]);
    await db.execute('DELETE FROM menu_items WHERE id = ?', [id]);

    const [categoryUsage] = await db.execute(
      'SELECT COUNT(*) AS count FROM menu_items WHERE category_id = ?',
      [categoryId]
    );

    if (categoryUsage[0].count === 0) {
      await db.execute('DELETE FROM categories WHERE id = ?', [categoryId]);
    }

    res.json({ 
      message: 'Menu item and related data deleted successfully',
      deleted_image_url: imageUrl 
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// PUT: Update a menu item
router.put('/menu/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const formData = parseFormDataFields(req.body);
    const { category_name, category_name_ar, price, translations, current_image_url } = formData;
    const imageFile = req.file;

    if (!category_name || !price || !translations) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let image_url = current_image_url || '';
    if (imageFile) {
      const result = await imagekit.upload({
        file: imageFile.buffer,
        fileName: imageFile.originalname,
        folder: "/menu_items",
        useUniqueFileName: true
      });
      image_url = result.url;
    }

    const [categoryRows] = await db.execute(
      'SELECT id FROM categories WHERE key_name = ?',
      [category_name]
    );

    let category_id;
    if (categoryRows.length > 0) {
      category_id = categoryRows[0].id;
      // Update Arabic name if it exists
      if (category_name_ar) {
        await db.execute(
          'UPDATE categories SET ar_name = ? WHERE id = ?',
          [category_name_ar, category_id]
        );
      }
    } else {
      const [insertCategory] = await db.execute(
        'INSERT INTO categories (key_name, ar_name) VALUES (?, ?)',
        [category_name, category_name_ar || '']
      );
      category_id = insertCategory.insertId;
    }

    const [updateResult] = await db.execute(
      `UPDATE menu_items 
       SET category_id = ?, image_url = ?, price_q = ?, price_h = ?, price_f = ?
       WHERE id = ?`,
      [
        category_id,
        image_url,
        price.Q || '',
        price.H || '',
        price.F || '',
        id
      ]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    await db.execute('DELETE FROM menu_item_translations WHERE menu_item_id = ?', [id]);

    for (const t of translations) {
      await db.execute(
        'INSERT INTO menu_item_translations (menu_item_id, language_code, name, description) VALUES (?, ?, ?, ?)',
        [id, t.language, t.name, t.description]
      );
    }

    res.json({ 
      message: 'Menu item updated successfully',
      data: { menu_id: id, image_url }
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;
