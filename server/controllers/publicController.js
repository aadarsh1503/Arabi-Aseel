const db = require("../db");

exports.getMenus = (req, res) => {
  const lang = req.params.lang || 'en';

  const query = `
    SELECT c.key_name as category_key, m.id, m.key_name, m.image_url, m.price_q, m.price_h, m.price_f,
           t.name, t.description
    FROM categories c
    JOIN menu_items m ON c.id = m.category_id
    JOIN menu_item_translations t ON t.menu_item_id = m.id AND t.language_code = ?
    ORDER BY c.id, m.id
  `;

  db.query(query, [lang], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = {};
    results.forEach(row => {
      if (!grouped[row.category_key]) grouped[row.category_key] = [];
      grouped[row.category_key].push({
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

    res.json(grouped);
  });
};
