import db from '../db.js';
import ImageKit from 'imagekit';
import { fileTypeFromBuffer } from 'file-type';

// Initialize ImageKit (Reusing your existing config)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// --- HELPER: Send SMS (Mock Function) ---

// ================= ADMIN CONTROLLERS =================

// 1. Add Campaign Item
export const addItem = async (req, res) => {
    try {
        const { label, type, color, text_color } = req.body;
        
        if (!req.file || !label || !type) {
            return res.status(400).json({ message: "Image, Label and Type are required" });
        }

        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: `wheel_${Date.now()}_${req.file.originalname}`,
            folder: '/marketing_wheel/',
        });

        await db.execute(
            `INSERT INTO marketing_items (label, type, image_url, image_file_id, color, text_color) VALUES (?, ?, ?, ?, ?, ?)`,
            [label, type, uploadResponse.url, uploadResponse.fileId, color || '#ffffff', text_color || '#000000']
        );

        res.status(201).json({ message: "Item added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. Get Admin Data (Items + Settings)
export const getAdminData = async (req, res) => {
    try {
        const [items] = await db.execute("SELECT * FROM marketing_items");
        const [settings] = await db.execute("SELECT * FROM marketing_settings");
        
        const config = settings.reduce((acc, curr) => ({ ...acc, [curr.setting_key]: curr.setting_value }), {});
        res.json({ items, config });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 3. Update Settings
export const updateSettings = async (req, res) => {
    try {
        const { win_percentage, lose_percentage } = req.body;
        
        if(win_percentage !== undefined) 
            await db.execute("INSERT INTO marketing_settings (setting_key, setting_value) VALUES ('win_percentage', ?) ON DUPLICATE KEY UPDATE setting_value = ?", [win_percentage, win_percentage]);
        
        if(lose_percentage !== undefined) 
            await db.execute("INSERT INTO marketing_settings (setting_key, setting_value) VALUES ('lose_percentage', ?) ON DUPLICATE KEY UPDATE setting_value = ?", [lose_percentage, lose_percentage]);

        res.json({ message: "Settings updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 4. Delete Item
export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT image_file_id FROM marketing_items WHERE id = ?", [id]);
        
        if (rows.length > 0 && rows[0].image_file_id) {
            await imagekit.deleteFile(rows[0].image_file_id);
        }
        
        await db.execute("DELETE FROM marketing_items WHERE id = ?", [id]);
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ================= PUBLIC / GAME CONTROLLERS =================

// 1. Send OTP
export const startGame = async (req, res) => {
    try {
        const { mobile, name, place } = req.body;

        if(!mobile) return res.status(400).json({ message: "Mobile number required" });

        // Check if already played
        const [userCheck] = await db.execute("SELECT * FROM marketing_participants WHERE mobile = ?", [mobile]);
        
        if (userCheck.length > 0 && userCheck[0].has_played) {
            return res.status(403).json({ message: "This mobile number has already participated." });
        }

        // Insert User or Update User (mark as verified immediately since no OTP)
        if (userCheck.length === 0) {
            // New User - is_verified = TRUE
            await db.execute(
                "INSERT INTO marketing_participants (mobile, name, place, is_verified) VALUES (?, ?, ?, TRUE)",
                [mobile, name, place]
            );
        } else {
            // Update details if they exist but haven't played
            await db.execute(
                "UPDATE marketing_participants SET name = ?, place = ?, is_verified = TRUE WHERE mobile = ?",
                [name, place, mobile]
            );
        }

        // Fetch Game Items
        const [items] = await db.execute("SELECT id, label, type, image_url, color, text_color FROM marketing_items");
        
        res.json({ message: "Game started", items });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error starting game" });
    }
};
// 3. SPIN THE WHEEL (Core Logic)
export const spinWheel = async (req, res) => {
    try {
        const { mobile } = req.body;

        // 1. Verify User Eligibility
        // Note: We check is_verified, which startGame sets to TRUE
        const [user] = await db.execute("SELECT * FROM marketing_participants WHERE mobile = ? AND is_verified = TRUE", [mobile]);
        if (user.length === 0) return res.status(401).json({ message: "User not registered" });
        if (user[0].has_played) return res.status(403).json({ message: "Already played" });

        // 2. Get Settings & Items
        const [settingsRows] = await db.execute("SELECT * FROM marketing_settings");
        const settings = settingsRows.reduce((acc, curr) => ({ ...acc, [curr.setting_key]: curr.setting_value }), {});
        
        const winChance = parseInt(settings.win_percentage) || 10;
        
        // Fetch Items
        const [allItems] = await db.execute("SELECT * FROM marketing_items");
        
        // --- Safety Check for White Screen ---
        if (allItems.length === 0) {
            return res.status(500).json({ message: "No prizes configured in database" });
        }

        const prizeItems = allItems.filter(i => i.type === 'prize');
        const loseItems = allItems.filter(i => i.type === 'lose');
        const retryItems = allItems.filter(i => i.type === 'retry');

        // 3. Determine Outcome
        const rng = Math.random() * 100; 
        let resultType = '';
        let selectedItem = null;

        if (rng <= winChance && prizeItems.length > 0) {
            resultType = 'prize';
            selectedItem = prizeItems[Math.floor(Math.random() * prizeItems.length)];
        } else {
            if (retryItems.length > 0 && Math.random() < 0.2) { 
                 resultType = 'retry';
                 selectedItem = retryItems[Math.floor(Math.random() * retryItems.length)];
            } else {
                 resultType = 'lose';
                 selectedItem = loseItems.length > 0 
                    ? loseItems[Math.floor(Math.random() * loseItems.length)]
                    : allItems[Math.floor(Math.random() * allItems.length)];
            }
        }

        // 4. Update DB
        if (resultType !== 'retry') {
            await db.execute("UPDATE marketing_participants SET has_played = TRUE WHERE id = ?", [user[0].id]);
        }

        await db.execute(
            "INSERT INTO marketing_logs (participant_id, item_won_id, result_type) VALUES (?, ?, ?)",
            [user[0].id, selectedItem.id, resultType]
        );

        const itemIndex = allItems.findIndex(i => i.id === selectedItem.id);

        res.json({
            itemIndex,
            result: selectedItem,
            canRetry: resultType === 'retry'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Spin Error" });
    }
};