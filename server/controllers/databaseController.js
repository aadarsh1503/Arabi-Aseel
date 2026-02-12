import db from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export all data from all tables
export const exportAllData = async (req, res) => {
  try {
    console.log('📊 Exporting all database data...');

    const exportData = {
      exported_at: new Date().toISOString(),
      version: '1.0.0',
      tables: {},
      statistics: {}
    };

    // Get menu items with categories
    try {
      const [menuItems] = await db.query(`
        SELECT m.id, m.category_id, m.image_url, m.price_q, m.price_h, m.price_f, 
               m.price_type, m.price_per_portion, m.status, m.created_at, m.updated_at,
               c.key_name as category_name, c.ar_name as category_name_ar
        FROM menu_items m
        JOIN categories c ON m.category_id = c.id
        ORDER BY c.key_name, m.id
      `);
      exportData.tables.menu_items = menuItems;
      exportData.statistics.total_menu_items = menuItems.length;
    } catch (error) {
      console.log('⚠️  Error fetching menu_items:', error.message);
      exportData.tables.menu_items = [];
      exportData.statistics.total_menu_items = 0;
    }

    // Get menu translations
    try {
      const [menuTranslations] = await db.query('SELECT * FROM menu_item_translations ORDER BY menu_item_id');
      exportData.tables.menu_item_translations = menuTranslations;
      exportData.statistics.total_translations = menuTranslations.length;
    } catch (error) {
      console.log('⚠️  Error fetching menu_item_translations:', error.message);
      exportData.tables.menu_item_translations = [];
      exportData.statistics.total_translations = 0;
    }
    
    // Get categories
    try {
      const [categories] = await db.query('SELECT * FROM categories ORDER BY id');
      exportData.tables.categories = categories;
      exportData.statistics.total_categories = categories.length;
    } catch (error) {
      console.log('⚠️  Error fetching categories:', error.message);
      exportData.tables.categories = [];
      exportData.statistics.total_categories = 0;
    }
    
    // Get registrations
    try {
      const [registrations] = await db.query(`
        SELECT id, name, mobile, email, address_title, address_city, address_block,
               latitude, longitude, coupon_code, coupon_type, is_used, used_at, created_at
        FROM registrations
        ORDER BY created_at DESC
      `);
      exportData.tables.registrations = registrations;
      exportData.statistics.total_registrations = registrations.length;
      console.log(`✓ Exported ${registrations.length} registrations`);
    } catch (error) {
      console.log('⚠️  Error fetching registrations:', error.message);
      exportData.tables.registrations = [];
      exportData.statistics.total_registrations = 0;
    }

    // Get chefs
    try {
      const [chefs] = await db.query('SELECT * FROM chefs ORDER BY id');
      exportData.tables.chefs = chefs;
      exportData.statistics.total_chefs = chefs.length;
    } catch (error) {
      console.log('⚠️  Error fetching chefs:', error.message);
      exportData.tables.chefs = [];
      exportData.statistics.total_chefs = 0;
    }
    
    // Get marketing items (spin game items)
    try {
      const [marketingItems] = await db.query('SELECT * FROM marketing_items ORDER BY sort_order');
      exportData.tables.marketing_items = marketingItems;
      exportData.statistics.total_marketing_items = marketingItems.length;
    } catch (error) {
      console.log('⚠️  Error fetching marketing_items:', error.message);
      exportData.tables.marketing_items = [];
      exportData.statistics.total_marketing_items = 0;
    }

    // Get marketing participants (spin game participants)
    try {
      const [participants] = await db.query('SELECT id, mobile, name, place, is_verified, has_played, created_at FROM marketing_participants ORDER BY created_at DESC');
      exportData.tables.marketing_participants = participants;
      exportData.statistics.total_participants = participants.length;
      console.log(`✓ Exported ${participants.length} marketing participants`);
    } catch (error) {
      console.log('⚠️  Error fetching marketing_participants:', error.message);
      exportData.tables.marketing_participants = [];
      exportData.statistics.total_participants = 0;
    }

    // Get marketing logs (spin game logs)
    try {
      const [logs] = await db.query('SELECT * FROM marketing_logs ORDER BY created_at DESC');
      exportData.tables.marketing_logs = logs;
      exportData.statistics.total_marketing_logs = logs.length;
    } catch (error) {
      console.log('⚠️  Error fetching marketing_logs:', error.message);
      exportData.tables.marketing_logs = [];
      exportData.statistics.total_marketing_logs = 0;
    }

    // Get marketing settings
    try {
      const [settings] = await db.query('SELECT * FROM marketing_settings');
      exportData.tables.marketing_settings = settings;
      exportData.statistics.total_settings = settings.length;
      console.log(`✓ Exported ${settings.length} marketing settings`);
    } catch (error) {
      console.log('⚠️  Error fetching marketing_settings:', error.message);
      exportData.tables.marketing_settings = [];
      exportData.statistics.total_settings = 0;
    }

    // Note: admin_users are excluded for security reasons

    console.log('✅ Export completed successfully');

    res.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('Error exporting all data:', error);
    res.status(500).json({ error: 'Failed to export data', details: error.message });
  }
};

// Create database backup
export const createBackup = async (req, res) => {
  try {
    console.log('💾 Creating database backup...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Get all data
    const [menuItems] = await db.query('SELECT * FROM menu_items');
    const [menuTranslations] = await db.query('SELECT * FROM menu_item_translations');
    const [categories] = await db.query('SELECT * FROM categories');
    const [registrations] = await db.query('SELECT * FROM registrations');
    const [chefs] = await db.query('SELECT * FROM chefs');
    const [spinLogs] = await db.query('SELECT * FROM spin_logs');
    const [users] = await db.query('SELECT * FROM users');

    const backup = {
      backup_date: new Date().toISOString(),
      version: '1.0.0',
      database: process.env.DB_NAME,
      tables: {
        menu_items: menuItems,
        menu_item_translations: menuTranslations,
        categories: categories,
        registrations: registrations,
        chefs: chefs,
        spin_logs: spinLogs,
        users: users
      }
    };

    const filename = `backup_${timestamp}.json`;
    const filepath = path.join(backupDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));

    console.log(`✅ Backup created: ${filename}`);

    res.json({
      success: true,
      message: 'Backup created successfully',
      filename: filename,
      size: fs.statSync(filepath).size,
      tables_backed_up: Object.keys(backup.tables).length
    });

  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ error: 'Failed to create backup', details: error.message });
  }
};

// List all backups
export const listBackups = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '..', 'backups');
    
    if (!fs.existsSync(backupDir)) {
      return res.json({ success: true, backups: [] });
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filepath = path.join(backupDir, file);
        const stats = fs.statSync(filepath);
        return {
          filename: file,
          size: stats.size,
          created_at: stats.birthtime,
          modified_at: stats.mtime
        };
      })
      .sort((a, b) => b.created_at - a.created_at);

    res.json({
      success: true,
      backups: files
    });

  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({ error: 'Failed to list backups' });
  }
};

// Download backup file
export const downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const backupDir = path.join(__dirname, '..', 'backups');
    const filepath = path.join(backupDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Backup file not found' });
    }

    res.download(filepath);

  } catch (error) {
    console.error('Error downloading backup:', error);
    res.status(500).json({ error: 'Failed to download backup' });
  }
};

// Restore from backup
export const restoreBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const backupDir = path.join(__dirname, '..', 'backups');
    const filepath = path.join(backupDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Backup file not found' });
    }

    console.log(`🔄 Restoring from backup: ${filename}`);

    const backupData = JSON.parse(fs.readFileSync(filepath, 'utf8'));

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Clear existing data (be careful!)
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      
      // Restore each table
      for (const [tableName, rows] of Object.entries(backupData.tables)) {
        if (rows.length > 0) {
          await connection.query(`TRUNCATE TABLE ${tableName}`);
          
          const columns = Object.keys(rows[0]);
          const placeholders = columns.map(() => '?').join(',');
          const query = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`;
          
          for (const row of rows) {
            const values = columns.map(col => row[col]);
            await connection.query(query, values);
          }
        }
      }

      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      await connection.commit();
      connection.release();

      console.log('✅ Backup restored successfully');

      res.json({
        success: true,
        message: 'Backup restored successfully',
        tables_restored: Object.keys(backupData.tables).length
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ error: 'Failed to restore backup', details: error.message });
  }
};
