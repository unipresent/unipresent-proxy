import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { code } = req.query;
  const feedPath = '/tmp/feed.xml';

  try {
    await fs.promises.access(feedPath, fs.constants.F_OK);
  } catch {
    return res.status(404).json({ error: 'Feed not available yet (access failed)' });
  }

  const xml = await fs.promises.readFile(feedPath, 'utf8');

  const blockRegex = new RegExp(`<item>([\\s\\S]*?<g:id>${code}</g:id>[\\s\\S]*?)</item>`, 'i');
  const match = xml.match(blockRegex);

  if (!match) {
    return res.status(404).json({ error: `Produkt ${code} nebyl nalezen ve feedu.` });
  }

  const block = match[1];

  const dostupnost = /<g:availability>(.*?)<\/g:availability>/i.exec(block)?.[1] || 'unknown';
  const obrazek = /<g:image_link>(.*?)<\/g:image_link>/i.exec(block)?.[1] || '';
  const nazev = /<title><!\[CDATA\[(.*?)\]\]><\/title>/i.exec(block)?.[1]
              || /<g:title>(.*?)<\/g:title>/i.exec(block)?.[1]
              || '';

  return res.status(200).json({
    kod: code,
    dostupnost,
    obrazek,
    nazev
  });
}
