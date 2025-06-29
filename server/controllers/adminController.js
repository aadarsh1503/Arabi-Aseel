exports.addMenuItem = (req, res) => {
  const { category_name, category_name_ar, image_url, price_q, price_h, price_f, translations } = req.body;

  // First handle the category (check if exists or create new)
  db.query(
    "SELECT id FROM categories WHERE key_name = ?",
    [category_name],
    (err, categoryRows) => {
      if (err) return res.status(500).json({ error: err.message });

      let category_id;
      
      if (categoryRows.length > 0) {
        // Category exists - update Arabic name if provided
        category_id = categoryRows[0].id;
        db.query(
          "UPDATE categories SET ar_name = ? WHERE id = ?",
          [category_name_ar || null, category_id], // Use NULL if empty/undefined
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            proceedWithMenuItem();
          }
        );
      } else {
        // Category doesn't exist - create new with Arabic name
        db.query(
          "INSERT INTO categories (key_name, ar_name) VALUES (?, ?)",
          [category_name, category_name_ar || null], // Use NULL if empty/undefined
          (err, insertResult) => {
            if (err) return res.status(500).json({ error: err.message });
            category_id = insertResult.insertId;
            proceedWithMenuItem();
          }
        );
      }

      function proceedWithMenuItem() {
        // Then insert the menu item
        db.query(
          "INSERT INTO menu_items (category_id, image_url, price_q, price_h, price_f) VALUES (?, ?, ?, ?, ?)",
          [category_id, image_url, price_q, price_h, price_f],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const menuItemId = result.insertId;

            // Insert translations
            const translationValues = translations.map(t => [
              menuItemId, 
              t.language, 
              t.name || null, 
              t.description || null
            ]);
            
            db.query(
              "INSERT INTO menu_item_translations (menu_item_id, language_code, name, description) VALUES ?",
              [translationValues],
              (err) => {
                if (err) return res.status(500).json({ error: err.message });
                
                // Verify what was stored
                db.query(
                  "SELECT key_name, ar_name FROM categories WHERE id = ?",
                  [category_id],
                  (err, verifyResult) => {
                    if (err) console.error("Verification error:", err);
                    
                    res.json({ 
                      success: true,
                      menu_id: menuItemId,
                      category_info: verifyResult[0],
                      message: "Menu item and translations added successfully"
                    });
                  }
                );
              }
            );
          }
        );
      }
    }
  );
};