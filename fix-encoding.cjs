const fs = require('fs');
const path = require('path');

const files = [
  'components/marketing/contact.jsx',
  'components/marketing/cta.jsx',
  'components/marketing/features.jsx',
  'components/marketing/industries.jsx',
  'components/marketing/testimonials.jsx',
  'components/marketing/hero.jsx',
  'components/marketing/how-it-works.jsx',
  'components/marketing/footer.jsx',
  'app/page.js',
  'app/features/page.js',
  'app/get-started/page.js',
  'app/docs/page.js',
  'app/login/page.js'
];

const root = __dirname;

for (const file of files) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    console.log('SKIP:', file);
    continue;
  }

  // Read as buffer to check BOM
  const buf = fs.readFileSync(fullPath);
  let content;
  
  // Strip BOM if present
  if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    content = buf.slice(3).toString('utf8');
    console.log('BOM removed:', file);
  } else {
    content = buf.toString('utf8');
  }

  // Check for mojibake (UTF-8 bytes misread as latin1/cp1252)
  // Try to detect and fix double-encoded UTF-8
  let fixed = content;
  let changed = false;

  // Method: Try to detect mojibake by looking for common patterns
  // \xC3\xA2\xE2\x80\x99 etc are signs of double-encoding
  
  // Simple approach: look for known corrupted patterns and replace
  const replacements = [
    ['\u00e2\u0080\u0099', '\u2019'], // '
    ['\u00e2\u0080\u009c', '\u201c'], // "
    ['\u00e2\u0080\u009d', '\u201d'], // "
    ['\u00e2\u0080\u0093', '\u2013'], // –
    ['\u00e2\u0080\u0094', '\u2014'], // —
    ['\u00e2\u0080\u00a2', '\u2022'], // •
    ['\u00c2\u00a9', '\u00a9'],       // ©
    ['\u00e2\u0086\u0092', '\u2192'], // →
    ['\u00e2\u0096\u00bc', '\u25bc'], // ▼
    ['\u00e2\u0098\u0085', '\u2605'], // ★
    ['\u00e2\u009c\u0093', '\u2713'], // ✓
    ['\u00e2\u009a\u00a1', '\u26a1'], // ⚡
    ['\u00e2\u009a\u00bd', '\u26bd'], // ⚽
  ];

  for (const [bad, good] of replacements) {
    if (fixed.includes(bad)) {
      fixed = fixed.split(bad).join(good);
      changed = true;
    }
  }

  // For 4-byte emoji that got double-encoded, try a general fix:
  // Double-encoded UTF-8 4-byte chars appear as sequences like \xC3\xB0\xC5\xB8... 
  // Let's try to fix by re-encoding
  try {
    // Convert string to latin1 buffer, then read as utf8
    const latin1Buf = Buffer.from(fixed, 'latin1');
    const attempt = latin1Buf.toString('utf8');
    
    // Check if this produced valid content (no replacement chars)
    if (!attempt.includes('\ufffd') && attempt.length < fixed.length) {
      // Verify it still looks like code
      if (attempt.includes('export') || attempt.includes('import') || attempt.includes('function')) {
        fixed = attempt;
        changed = true;
        console.log('De-doubled encoding:', file);
      }
    }
  } catch (e) {
    // Ignore - latin1 re-encode didn't work
  }

  // Write back without BOM
  fs.writeFileSync(fullPath, fixed, 'utf8');
  
  if (changed) {
    console.log('FIXED:', file);
  } else {
    console.log('OK:', file);
  }
}

console.log('\nDone!');
