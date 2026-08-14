const fs = require('fs');
const path = require('path');

const files = [
  'components/marketing/contact.jsx',
  'components/marketing/features.jsx',
  'components/marketing/industries.jsx',
  'components/marketing/testimonials.jsx',
  'components/marketing/hero.jsx',
  'components/marketing/how-it-works.jsx',
  'app/page.js',
  'app/features/page.js',
  'app/get-started/page.js',
  'app/docs/page.js',
];

const root = __dirname;

// These files have the mojibake pattern where UTF-8 bytes were read as cp1252, then written as UTF-8
// We need to: read -> convert chars back to their cp1252 byte values -> reinterpret as UTF-8

// CP1252 to byte mapping for chars 0x80-0x9F that differ from latin1
const cp1252map = {
  0x20AC: 0x80, // €
  0x201A: 0x82, // ‚
  0x0192: 0x83, // ƒ
  0x201E: 0x84, // „
  0x2026: 0x85, // …
  0x2020: 0x86, // †
  0x2021: 0x87, // ‡
  0x02C6: 0x88, // ˆ
  0x2030: 0x89, // ‰
  0x0160: 0x8A, // Š
  0x2039: 0x8B, // ‹
  0x0152: 0x8C, // Œ
  0x017D: 0x8E, // Ž
  0x2018: 0x91, // '
  0x2019: 0x92, // '
  0x201C: 0x93, // "
  0x201D: 0x94, // "
  0x2022: 0x95, // •
  0x2013: 0x96, // –
  0x2014: 0x97, // —
  0x02DC: 0x98, // ˜
  0x2122: 0x99, // ™
  0x0161: 0x9A, // š
  0x203A: 0x9B, // ›
  0x0153: 0x9C, // œ
  0x017E: 0x9E, // ž
  0x0178: 0x9F, // Ÿ
};

function charToByte(ch) {
  const code = ch.charCodeAt(0);
  if (code < 0x100) return code;
  if (cp1252map[code] !== undefined) return cp1252map[code];
  return null; // Not a cp1252 char
}

function fixMojibake(str) {
  // Try to convert back: each char -> cp1252 byte -> reinterpret sequence as UTF-8
  const bytes = [];
  let allConvertible = true;
  
  for (let i = 0; i < str.length; i++) {
    const b = charToByte(str[i]);
    if (b === null) {
      allConvertible = false;
      break;
    }
    bytes.push(b);
  }
  
  if (!allConvertible) return null;
  
  try {
    const buf = Buffer.from(bytes);
    const decoded = buf.toString('utf8');
    // Check for replacement char
    if (decoded.includes('\ufffd')) return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

for (const file of files) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    console.log('SKIP:', file);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  // Strip BOM
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  
  let result = '';
  let i = 0;
  let changed = false;
  
  while (i < content.length) {
    const ch = content[i];
    const code = ch.charCodeAt(0);
    
    // Look for sequences starting with high bytes (Ã, Ã°, etc.) that indicate mojibake
    if (code >= 0xC0 && code <= 0xFF) {
      // Try different lengths of mojibake sequences (2-8 chars can encode 1-4 byte UTF8)
      let found = false;
      for (let len = 8; len >= 2; len--) {
        if (i + len > content.length) continue;
        const candidate = content.slice(i, i + len);
        const fixed = fixMojibake(candidate);
        if (fixed && fixed.length < candidate.length) {
          result += fixed;
          i += len;
          found = true;
          changed = true;
          break;
        }
      }
      if (!found) {
        result += ch;
        i++;
      }
    } else {
      result += ch;
      i++;
    }
  }
  
  fs.writeFileSync(fullPath, result, 'utf8');
  console.log(changed ? 'FIXED:' : 'OK:', file);
}

console.log('\nDone!');
