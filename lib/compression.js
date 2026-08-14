import pako from 'pako';

/**
 * Decompress gzip data
 * @param {string} compressedBase64 - Base64 encoded compressed data
 * @returns {Object} - Decompressed data
 */
export function decompressData(compressedBase64) {
  try {
    const compressed = Buffer.from(compressedBase64, 'base64');
    const decompressed = pako.ungzip(compressed, { to: 'string' });
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Decompression error:', error);
    throw new Error('Failed to decompress data');
  }
}
