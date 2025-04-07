import https from 'https';
import fs from 'fs';

export default function handler(req, res) {
  const url = 'https://www.unipresent.cz/google-merchant/1831';
  const dest = '/tmp/feed.xml';

  https.get(url, (response) => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        fs.writeFileSync(dest, data);
        const info = {
          status: 'Feed uložen',
          length: data.length,
          path: dest,
          sample: data.slice(0, 300) // prvních 300 znaků feedu
        };
        res.status(200).json(info);
      } catch (e) {
        res.status(500).json({ error: 'Chyba při zápisu feedu', detail: e.message });
      }
    });

  }).on('error', (err) => {
    res.status(500).json({ error: 'Chyba při stahování feedu', detail: err.message });
  });
}
