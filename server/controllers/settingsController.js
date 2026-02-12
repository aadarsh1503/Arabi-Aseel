import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get current version
export const getVersion = async (req, res) => {
  try {
    const versionPath = path.join(__dirname, '../../client/src/config/version.js');
    const content = fs.readFileSync(versionPath, 'utf8');
    
    // Extract version from file
    const versionMatch = content.match(/APP_VERSION = ['"](.+?)['"]/);
    const nameMatch = content.match(/APP_NAME = ['"](.+?)['"]/);
    const dateMatch = content.match(/RELEASE_DATE = ['"](.+?)['"]/);
    
    res.json({
      success: true,
      version: versionMatch ? versionMatch[1] : '1.0.0',
      appName: nameMatch ? nameMatch[1] : 'Arabi Aseel Restaurant Management System',
      releaseDate: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error reading version:', error);
    res.status(500).json({ error: 'Failed to read version' });
  }
};

// Update version
export const updateVersion = async (req, res) => {
  try {
    const { version, appName, releaseDate } = req.body;
    
    if (!version) {
      return res.status(400).json({ error: 'Version is required' });
    }
    
    const versionPath = path.join(__dirname, '../../client/src/config/version.js');
    
    const content = `// Application Version Configuration
// Update this file to change the version number across the entire application

export const APP_VERSION = '${version}';
export const APP_NAME = '${appName || 'Arabi Aseel Restaurant Management System'}';
export const RELEASE_DATE = '${releaseDate || new Date().toISOString().split('T')[0]}';

// Version history (for reference)
// v${version} - ${releaseDate || new Date().toISOString().split('T')[0]} - Updated via admin panel
`;
    
    fs.writeFileSync(versionPath, content, 'utf8');
    
    res.json({
      success: true,
      message: 'Version updated successfully. Please rebuild the application for changes to take effect.'
    });
  } catch (error) {
    console.error('Error updating version:', error);
    res.status(500).json({ error: 'Failed to update version' });
  }
};
