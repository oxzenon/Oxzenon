import { useEffect, useState } from 'react';

// Detects a coarse-input / no-hover device.
export function useTouchOnly() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(hover: none)');
    const sync = () => setTouch(mql.matches);
    sync();
    mql.addEventListener?.('change', sync);
    return () => mql.removeEventListener?.('change', sync);
  }, []);
  return touch;
}
