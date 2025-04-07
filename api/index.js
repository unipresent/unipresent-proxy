
import { readFileSync } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  const filePath = path.resolve('/tmp/feed.xml');
  let xml;
  try {
    xml = readFileSync(filePath, 'utf8');
  } catch (e) {
    return res.status(500).json({ error: 'Feed not available yet' });
  }

  const blockRegex = new RegExp(
    `<g:id>${code}</g:id>[\s\S]*?<g:availability>(.*?)</g:availability>[\s\S]*?<g:image_link>(.*?)</g:image_link>[\s\S]*?<title><\!\[CDATA\[(.*?)\]\]></title>`,
    "i"
  );

  const match = xml.match(blockRegex);
  if (!match) return res.status(404).json({ error: 'Product not found' });

  const dostupnost = match[1];
  const obrazek = match[2];
  const nazev = match[3];

  return res.status(200).json({
    kod: code,
    dostupnost,
    obrazek,
    nazev
  });
}
