// Submit all sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver).
// Run: node scripts/indexnow-submit.js
const fs = require('fs');
const path = require('path');

const HOST = 'klima-al.com';
const KEY  = '145e7ad715f4c2eaa5a62fa72b3cf9f9';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const sitemap = fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

console.log(`Submitting ${urls.length} URLs to IndexNow…`);

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls });

fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body
}).then(async res => {
  const text = await res.text();
  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
  if (text) console.log(text);
  if (res.status === 200 || res.status === 202) {
    console.log('✓ IndexNow accepted. Bing/Yandex will crawl within hours.');
  } else {
    console.error('✗ IndexNow rejected. Check key file is reachable at', KEY_LOCATION);
  }
}).catch(err => console.error('Network error:', err.message));
