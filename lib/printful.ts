const PRINTFUL_BASE = 'https://api.printful.com';
type PrintfulProduct = any;

export async function printfulFetch(path: string, init?: RequestInit) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) throw new Error('Missing PRINTFUL_API_KEY');
  const res = await fetch(`${PRINTFUL_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`Printful error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function syncPrintfulProducts() {
  const { result } = await printfulFetch('/products?limit=100');
  const list: PrintfulProduct[] = Array.isArray(result) ? result : result.result || [];
  const synced: PrintfulProduct[] = [];
  for (const p of list) {
    synced.push(p);
    // Upsert base product by printfulId
    // ...
  }
  return { synced };
}

export async function submitPrintfulOrder(order: { items: any[]; shipping: any; recipient: any; }) {
  const payload = { recipient: order.recipient, items: order.items };
  return printfulFetch('/orders', { method: 'POST', body: JSON.stringify(payload) });
}