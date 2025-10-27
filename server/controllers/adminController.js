import db from '../db.js'; // Ensure your db setup uses a promise-based library

export const addMenuItem = async (req, res) => {
  try {
    const { 
      category_name, 
      category_name_ar, 
      image_url, 
      price_q, 
      price_h, 
      price_f, 
      translations 
    } = req.body;

    // 1. Check if the category exists
    const [categoryRows] = await db.query(
      "SELECT id FROM categories WHERE key_name = ?",
      [category_name]
    );

    let category_id;

    if (categoryRows.length > 0) {
      // 2a. If category exists, get its ID and update the Arabic name
      category_id = categoryRows[0].id;
      await db.query(
        "UPDATE categories SET ar_name = ? WHERE id = ?",
        [category_name_ar || null, category_id]
      );
    } else {
      // 2b. If category does not exist, create it and get the new ID
      const [insertResult] = await db.query(
        "INSERT INTO categories (key_name, ar_name) VALUES (?, ?)",
        [category_name, category_name_ar || null]
      );
      category_id = insertResult.insertId;
    }

    // 3. Insert the new menu item
    const [menuItemResult] = await db.query(
      "INSERT INTO menu_items (category_id, image_url, price_q, price_h, price_f) VALUES (?, ?, ?, ?, ?)",
      [category_id, image_url, price_q, price_h, price_f]
    );
    const menuItemId = menuItemResult.insertId;

    // 4. Prepare and insert the translations for the new menu item
    if (translations && translations.length > 0) {
      const translationValues = translations.map(t => [
        menuItemId,
        t.language,
        t.name || null,
        t.description || null
      ]);

      await db.query(
        "INSERT INTO menu_item_translations (menu_item_id, language_code, name, description) VALUES ?",
        [translationValues]
      );
    }
    
    // 5. Get the final category info to return
    const [finalCategory] = await db.query(
        "SELECT key_name, ar_name FROM categories WHERE id = ?",
        [category_id]
    );

    // 6. Send a successful response
    res.status(201).json({
      success: true,
      menu_id: menuItemId,
      category_info: finalCategory[0],
      message: "Menu item and translations added successfully"
    });

  } catch (error) {
    // Centralized error handling
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: "Server error while adding menu item.", error: error.message });
  }
};