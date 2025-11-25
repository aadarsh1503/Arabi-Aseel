import db from '../db.js';
import ImageKit from 'imagekit';
import axios from 'axios';
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Helper to get settings
const getSettingsMap = async () => {
    const [settingsRows] = await db.execute("SELECT * FROM marketing_settings");
    return settingsRows.reduce((acc, curr) => ({ ...acc, [curr.setting_key]: curr.setting_value }), {});
};

// ================= ADMIN CONTROLLERS =================

export const getSpinLogs = async (req, res) => {
    try {
        const query = `
            SELECT 
                l.id as log_id,
                l.created_at,
                l.result_type,
                p.id as participant_id,
                p.name as user_name, 
                p.mobile, 
                p.place,
                i.label as prize_label, 
                i.image_url
            FROM marketing_logs l
            JOIN marketing_participants p ON l.participant_id = p.id
            LEFT JOIN marketing_items i ON l.item_won_id = i.id
            ORDER BY l.created_at DESC
        `;
        const [logs] = await db.execute(query);
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching logs" });
    }
};
// UPDATED: Handle Game Active & Google Maps Key
export const updateSettings = async (req, res) => {
    try {
        const { win_percentage, lose_percentage, game_active, google_maps_api_key } = req.body;
        
        const updates = [];
        if(win_percentage !== undefined) updates.push(['win_percentage', win_percentage]);
        if(lose_percentage !== undefined) updates.push(['lose_percentage', lose_percentage]);
        if(game_active !== undefined) updates.push(['game_active', String(game_active)]);
        if(google_maps_api_key !== undefined) updates.push(['google_maps_api_key', google_maps_api_key]);

        for (const [key, value] of updates) {
            await db.execute(
                "INSERT INTO marketing_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?", 
                [key, value, value]
            );
        }

        res.json({ message: "Settings updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
export const addItem = async (req, res) => {
    try {
        const { label, type, color, text_color } = req.body;
        if (!req.file || !label || !type) return res.status(400).json({ message: "Image, Label and Type required" });

        // Get the highest sort_order currently in DB
        const [maxOrder] = await db.execute("SELECT MAX(sort_order) as maxVal FROM marketing_items");
        const nextOrder = (maxOrder[0].maxVal || 0) + 1;

        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: `wheel_${Date.now()}_${req.file.originalname}`,
            folder: '/marketing_wheel/',
        });

        await db.execute(
            `INSERT INTO marketing_items (label, type, image_url, image_file_id, color, text_color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [label, type, uploadResponse.url, uploadResponse.fileId, color || '#ffffff', text_color || '#000000', nextOrder]
        );
        res.status(201).json({ message: "Item added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
export const getAdminData = async (req, res) => {
    try {
        // Added ORDER BY sort_order ASC
        const [items] = await db.execute("SELECT * FROM marketing_items ORDER BY sort_order ASC");
        const config = await getSettingsMap();
        res.json({ items, config });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getGeoLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        if (!lat || !lng) return res.status(400).json({ message: "Coordinates required" });

        const settings = await getSettingsMap();
        const apiKey = settings.google_maps_api_key;

        if (!apiKey) {
            return res.status(500).json({ message: "API Key not configured in Admin Panel" });
        }

        // Call Google Maps API from the Server
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        const response = await axios.get(url);

        if (response.data.status === 'OK' && response.data.results.length > 0) {
            return res.json({ address: response.data.results[0].formatted_address });
        } else {
            console.error("Google API Error:", response.data);
            return res.status(400).json({ message: "Unable to find address", details: response.data });
        }

    } catch (error) {
        console.error("Geocoding Error:", error.message);
        res.status(500).json({ message: "Server Error fetching location" });
    }
};
// UPDATED: Handle Game Active & Google Maps Key
export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, type, color, text_color } = req.body;

        // 1. Fetch existing item
        const [existing] = await db.execute("SELECT * FROM marketing_items WHERE id = ?", [id]);
        if (existing.length === 0) return res.status(404).json({ message: "Item not found" });
        
        let imageUrl = existing[0].image_url;
        let imageFileId = existing[0].image_file_id;

        // 2. Handle Image Update (If new file provided)
        if (req.file) {
            // Delete old image if exists
            if (imageFileId) await imagekit.deleteFile(imageFileId).catch(err => console.log("Old image delete failed", err));
            
            // Upload new
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `wheel_${Date.now()}_${req.file.originalname}`,
                folder: '/marketing_wheel/',
            });
            imageUrl = uploadResponse.url;
            imageFileId = uploadResponse.fileId;
        }

        // 3. Update DB
        await db.execute(
            `UPDATE marketing_items SET label=?, type=?, color=?, text_color=?, image_url=?, image_file_id=? WHERE id=?`,
            [label, type, color, text_color, imageUrl, imageFileId, id]
        );

        res.json({ message: "Item updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Update Error" });
    }
};
export const reorderItems = async (req, res) => {
    try {
        const { orderedIds } = req.body; // Expects array of IDs like [5, 2, 1, 4]
        
        if (!orderedIds || !Array.isArray(orderedIds)) {
            return res.status(400).json({ message: "Invalid data" });
        }

        // Loop through and update sort_order for each
        for (let i = 0; i < orderedIds.length; i++) {
            await db.execute("UPDATE marketing_items SET sort_order = ? WHERE id = ?", [i, orderedIds[i]]);
        }

        res.json({ message: "Order updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Reorder Error" });
    }
};


export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT image_file_id FROM marketing_items WHERE id = ?", [id]);
        if (rows.length > 0 && rows[0].image_file_id) await imagekit.deleteFile(rows[0].image_file_id);
        await db.execute("DELETE FROM marketing_items WHERE id = ?", [id]);
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM marketing_logs WHERE participant_id = ?", [id]);
        await db.execute("DELETE FROM marketing_participants WHERE id = ?", [id]);
        res.json({ message: "Participant deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting participant" });
    }
};

export const deleteAllParticipants = async (req, res) => {
    try {
        await db.execute("TRUNCATE TABLE marketing_logs"); 
        await db.execute("DELETE FROM marketing_participants");
        res.json({ message: "All campaign data cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error resetting campaign" });
    }
};

// ================= GAME CONTROLLERS =================

// NEW: Get Public Config (Status & API Key) for Frontend
export const getPublicConfig = async (req, res) => {
    try {
        const settings = await getSettingsMap();
        res.json({
            game_active: settings.game_active !== 'false', 
            // We do NOT send the API Key to frontend anymore for security
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching config" });
    }
};

export const startGame = async (req, res) => {
    try {
        const settings = await getSettingsMap();
        if (settings.game_active === 'false') {
            return res.status(503).json({ message: "The campaign is currently closed." });
        }

        const { mobile, name, place } = req.body;
        if(!mobile) return res.status(400).json({ message: "Mobile number required" });

        const [userCheck] = await db.execute("SELECT * FROM marketing_participants WHERE mobile = ?", [mobile]);
        
        if (userCheck.length > 0 && userCheck[0].has_played) {
             return res.status(403).json({ message: "You have already played!" });
        }

        if (userCheck.length === 0) {
            await db.execute("INSERT INTO marketing_participants (mobile, name, place, is_verified) VALUES (?, ?, ?, TRUE)", [mobile, name, place]);
        } else {
            await db.execute("UPDATE marketing_participants SET name = ?, place = ?, is_verified = TRUE WHERE mobile = ?", [name, place, mobile]);
        }

        const [items] = await db.execute("SELECT id, label, type, image_url, color, text_color FROM marketing_items");
        res.json({ message: "Game started", items });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error starting game" });
    }
};

export const spinWheel = async (req, res) => {
    try {
        const settings = await getSettingsMap();
        if (settings.game_active === 'false') return res.status(503).json({ message: "Campaign closed" });

        const { mobile } = req.body;
        const [user] = await db.execute("SELECT * FROM marketing_participants WHERE mobile = ? AND is_verified = TRUE", [mobile]);
        
        if (user.length === 0) return res.status(401).json({ message: "User not registered" });
        if (user[0].has_played) return res.status(403).json({ message: "Already claimed prize" });

        const winChance = parseInt(settings.win_percentage) || 10;
        const [allItems] = await db.execute("SELECT * FROM marketing_items");
        
        if (allItems.length === 0) return res.status(500).json({ message: "No prizes" });

        const prizeItems = allItems.filter(i => i.type === 'prize');
        const loseItems = allItems.filter(i => i.type === 'lose');
        const retryItems = allItems.filter(i => i.type === 'retry');

        const rng = Math.random() * 100; 
        let resultType = 'lose';
        let selectedItem = null;

        if (rng <= winChance && prizeItems.length > 0) {
            resultType = 'prize';
            selectedItem = prizeItems[Math.floor(Math.random() * prizeItems.length)];
        } else {
            if (retryItems.length > 0 && Math.random() < 0.2) { 
                 resultType = 'retry';
                 selectedItem = retryItems[Math.floor(Math.random() * retryItems.length)];
            } else {
                 selectedItem = loseItems.length > 0 
                    ? loseItems[Math.floor(Math.random() * loseItems.length)]
                    : allItems[Math.floor(Math.random() * allItems.length)];
            }
        }

        if (resultType !== 'retry') {
            await db.execute("UPDATE marketing_participants SET has_played = TRUE WHERE id = ?", [user[0].id]);
        }

        await db.execute(
            "INSERT INTO marketing_logs (participant_id, item_won_id, result_type) VALUES (?, ?, ?)",
            [user[0].id, selectedItem.id, resultType]
        );

        res.json({
            itemIndex: allItems.findIndex(i => i.id === selectedItem.id),
            result: selectedItem,
            canRetry: resultType === 'retry'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Spin Error" });
    }
};