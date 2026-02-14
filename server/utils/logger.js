import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Get current date for log file name
const getLogFileName = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}.log`;
};

// Format timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

// Write log to file
const writeLog = (level, category, message, data = null) => {
  const timestamp = getTimestamp();
  const logFileName = getLogFileName();
  const logFilePath = path.join(logsDir, logFileName);
  
  let logEntry = `[${timestamp}] [${level}] [${category}] ${message}`;
  
  if (data) {
    logEntry += `\nData: ${JSON.stringify(data, null, 2)}`;
  }
  
  logEntry += '\n' + '-'.repeat(80) + '\n';
  
  // Write to file
  fs.appendFileSync(logFilePath, logEntry);
  
  // Also log to console with color
  const colors = {
    INFO: '\x1b[36m',    // Cyan
    DEBUG: '\x1b[35m',   // Magenta
    WARN: '\x1b[33m',    // Yellow
    ERROR: '\x1b[31m',   // Red
    SUCCESS: '\x1b[32m'  // Green
  };
  
  const reset = '\x1b[0m';
  const color = colors[level] || reset;
  
  console.log(`${color}[${level}] [${category}]${reset} ${message}`);
  if (data) {
    console.log('Data:', data);
  }
};

// Logger functions
export const logger = {
  info: (category, message, data) => writeLog('INFO', category, message, data),
  debug: (category, message, data) => writeLog('DEBUG', category, message, data),
  warn: (category, message, data) => writeLog('WARN', category, message, data),
  error: (category, message, data) => writeLog('ERROR', category, message, data),
  success: (category, message, data) => writeLog('SUCCESS', category, message, data)
};

export default logger;
