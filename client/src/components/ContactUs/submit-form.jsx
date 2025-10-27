// api/submit-form.js
import { google } from 'googleapis';
import formidable from 'formidable-serverless';
import fs from 'fs';

// This config is required by Vercel to correctly parse file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    // --- 1. AUTHENTICATE WITH GOOGLE ---
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Important for Vercel
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });
    
    // --- 2. PARSE THE INCOMING FORM DATA (WITH FILE) ---
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { name, phone, email, message } = fields;
    const uploadedFile = files.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }

    // --- 3. UPLOAD THE FILE TO GOOGLE DRIVE ---
    const fileMetadata = {
      name: uploadedFile.name,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };
    const media = {
      mimeType: uploadedFile.type,
      body: fs.createReadStream(uploadedFile.path),
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink', // Get the file ID and a viewable link
    });
    
    const fileUrl = driveResponse.data.webViewLink;

    // --- 4. APPEND DATA TO GOOGLE SHEETS ---
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A:F'; // Adjust if your sheet has a different name
    
    const newRow = [
        new Date().toLocaleString(), // Timestamp
        name,
        phone,
        email,
        message,
        fileUrl, // Link to the uploaded file in Drive
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [newRow],
      },
    });

    // --- 5. SEND SUCCESS RESPONSE ---
    return res.status(200).json({ message: 'Form submitted successfully!' });

  } catch (error) {
    console.error('ERROR:', error);
    return res.status(500).json({ error: 'An error occurred while submitting the form.' });
  }
}