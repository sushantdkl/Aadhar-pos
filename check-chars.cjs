const fs = require('fs');
const c = fs.readFileSync('app/page.js', 'utf8');
const emojis = c.match(/icon: "(.+?)"/g);
if (emojis) {
  emojis.forEach(e => {
    const chars = [...e].map(ch => 'U+' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
    console.log(e, '\n  ->', chars.join(' '));
  });
}
