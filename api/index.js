export default async function handler(req, res) {
  try {
    const feedUrl = "https://www.unipresent.cz/google-merchant/1831";
    const response = await fetch(feedUrl);
    const text = await response.text();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(text);
  } catch (error) {
    console.error("❌ Chyba proxy:", error);
    res.status(500).send("Chyba proxy.");
  }
}
