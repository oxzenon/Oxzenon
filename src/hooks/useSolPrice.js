import { useEffect, useState } from 'react';
import { fetchSolPrice } from '../lib/solana.js';

// Single source of truth for SOL/USD across the site (status bar, hero,
// stats panel). Polls every 60s — same cadence as v1.
export function useSolPrice() {
  const [state, setState] = useState({
    status: 'loading',
    price:  null,
    change: null,
  });

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const { price, change } = await fetchSolPrice();
        if (alive) setState({ status: 'ok', price, change });
      } catch {
        if (alive) setState((s) => ({ ...s, status: 'error' }));
      }
    };

    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return state;
}
