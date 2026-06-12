import { useEffect, useState } from 'react';
import { hitVisitor, readVisitorCount } from '../lib/visitors.js';

// Hit once per browser session so refreshes don't inflate the number.
// Poll every 30s so the status bar reflects fresh-ish global activity.
const SESSION_KEY = 'oxzenonHit';

export function useVisitorCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        const fn =
          sessionStorage.getItem(SESSION_KEY) === '1'
            ? readVisitorCount
            : hitVisitor;
        const value = await fn();
        sessionStorage.setItem(SESSION_KEY, '1');
        if (alive) setCount(value);
      } catch {
        if (alive) setCount(null);
      }
    };

    run();
    const id = setInterval(async () => {
      try {
        const value = await readVisitorCount();
        if (alive) setCount(value);
      } catch { /* keep last known value */ }
    }, 30_000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return count;
}
