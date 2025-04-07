export const config = {
  runtime: "nodejs"
};

import https from 'https';
import fs from 'fs';

export default async function handler(req, res) {
  const url = 'https://www.unipresent.cz/google-merchant/1831';

  https.get(url, response => {
    let data = '';
    response.on('data', chunk => { data += chunk; });
    response.on('end', () => {
      fs.writeFileSync('/tmp/feed.xml', data);
      res.status(200).json({ status: 'Feed uložen' });
    });
  }).on('error', err => {
    res.status(500).json({ error: err.message });
  });
}
