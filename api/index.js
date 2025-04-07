import https from 'https';

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Chybí parametr ?code=' });

  const url = 'https://www.unipresent.cz/google-merchant/1831';

  https.get(url, (response) => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      // Rozdělíme celý feed na jednotlivé bloky <item>...</item>
      const items = data.split(/<item>/g).slice(1); // první split je prázdný

      for (const rawBlock of items) {
        const block = "<item>" + rawBlock;
        if (!block.includes(`<g:id>${code}</g:id>`)) continue;

        const dostupnost = /<g:availability>(.*?)<\/g:availability>/i.exec(block)?.[1] || 'unknown';
        const obrazek = /<g:image_link>(.*?)<\/g:image_link>/i.exec(block)?.[1] || '';
        const nazev =
          /<title><!\[CDATA\[(.*?)\]\]><\/title>/i.exec(block)?.[1] ||
          /<g:title>(.*?)<\/g:title>/i.exec(block)?.[1] || '';

        return res.status(200).json({
          kod: code,
          dostupnost,
          obrazek,
          nazev
        });
      }

      return res.status(404).json({ error: `Produkt ${code} nebyl nalezen ve feedu.` });
    });

  }).on('error', err => {
    res.status(500).json({ error: 'Chyba při stahování feedu', detail: err.message });
  });
}
