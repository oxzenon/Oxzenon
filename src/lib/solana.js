// CoinGecko price fetch — kept thin so hooks can decide cadence + state.
const ENDPOINT =
  'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true';

export async function fetchSolPrice() {
  const res = await fetch(ENDPOINT);
  if (!res.ok) throw new Error('coingecko ' + res.status);
  const data = await res.json();
  return {
    price:  data.solana.usd,
    change: data.solana.usd_24h_change,
  };
}
