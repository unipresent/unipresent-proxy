export default function handler(req, res) {
  const { product } = req.query; // Získáme ID produktu z query parametru
  
  if (!product) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Představme si, že máme více lokalit pro různé produkty
  let availabilityData = {};

  if (product === 'product123') {
    // Příklad pro konkrétní produkt
    availabilityData = {
      productId: product,
      status: 'in_stock', // Stav produktu
      locations: [
        { location: 'Česká republika', daysToDelivery: 2, message: 'Produkt je připraven k odeslání.' },
        { location: 'Polsko', daysToDelivery: 3, message: 'Dostupný v Polsku, do 3 dnů.' },
        { location: 'Maďarsko', daysToDelivery: 5, message: 'Produkt na cestě z Maďarska.' }
      ]
    };
  } else if (product === 'product456') {
    // Příklad pro jiný produkt
    availabilityData = {
      productId: product,
      status: 'out_of_stock', // Stav produktu
      locations: [
        { location: 'Rumunsko', daysToDelivery: 7, message: 'Produkt není skladem, očekávaný příjezd za 7 dnů.' },
        { location: 'Itálie', daysToDelivery: 5, message: 'Očekávané doručení za 5 dní z Itálie.' }
      ]
    };
  } else {
    // Pro ostatní produkty
    availabilityData = {
      productId: product,
      status: 'on_the_way', // Stav produktu
      locations: [
        { location: 'Velká Británie', daysToDelivery: 10, message: 'Produkt je na cestě z Velké Británie.' },
        { location: 'Portugalsko', daysToDelivery: 8, message: 'Na cestě z Portugalska, do 8 dnů.' },
        { location: 'Polsko', daysToDelivery: 3, message: 'Očekávané doručení za 3 dny z Polska.' }
      ]
    };
  }

  // Odeslání dat ve formátu JSON
  res.status(200).json(availabilityData);
}
