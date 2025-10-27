import db from '../db.js'; // Ensure your db setup uses a promise-based library

export const getMenus = async (req, res) => {
  try {
    const lang = req.params.lang || 'en';

    const query = `
      SELECT c.key_name as category_key, c.ar_name as category_name_ar,
             m.id, m.image_url, m.price_q, m.price_h, m.price_f,
             t.name, t.description
      FROM categories c
      JOIN menu_items m ON c.id = m.category_id
      JOIN menu_item_translations t ON t.menu_item_id = m.id AND t.language_code = ?
      ORDER BY c.display_order, m.display_order
    `;

    const [results] = await db.query(query, [lang]);

    const grouped = {};
    results.forEach(row => {
      // Initialize the category object if it's the first time we see it
      if (!grouped[row.category_key]) {
        grouped[row.category_key] = {
            name_ar: row.category_name_ar, // Store the Arabic name for the category
            items: []                      // Initialize the items array
        };
      }
      
      // Add the current item to its category's items list
      grouped[row.category_key].items.push({
        id: row.id,
        name: row.name,
        description: row.description,
        image: row.image_url,
        price: {
          Q: row.price_q,
          H: row.price_h,
          F: row.price_f
        }
      });
    });

    res.status(200).json(grouped);
    
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: "Server error while fetching menus." });
  }
};