import crypto from 'crypto';

// Use a 32-byte key for AES-256
const ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY || 'default-32-byte-encryption-key!!'; // Must be 32 bytes
const IV_LENGTH = 16; // AES block size

/**
 * Decrypt data using AES-256-CBC
 * @param {string} encrypted - Encrypted data
 * @param {string} ivHex - Initialization vector in hex
 * @returns {Object} - Decrypted data
 */
export function decryptBackup(encrypted, ivHex) {
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').substring(0, 32));
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt backup data');
  }
}
