import { useEffect, useState } from 'react';
import { useSolPrice } from '../hooks/useSolPrice.js';
import { useVisitorCount } from '../hooks/useVisitorCount.js';

function fmtClock(d) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function StatusBar({ onOpenPalette }) {
  const sol = useSolPrice();
  const visitors = useVisitorCount();
  const [clock, setClock] = useState(() => fmtClock(new Date()));

  useEffect(() => {
    const id = setInterval(() => setClock(fmtClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  const priceStr =
    sol.status === 'ok'
      ? `$${sol.price.toFixed(2)}`
      : sol.status === 'loading' ? '…' : '—';

  const changeStr =
    sol.status === 'ok'
      ? `${sol.change >= 0 ? '▲' : '▼'} ${Math.abs(sol.change).toFixed(2)}%`
      : '';

  const changeColor =
    sol.status === 'ok' ? (sol.change >= 0 ? 'text-cyan' : 'text-pink') : 'text-muted';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-purple/20 bg-bg/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-2 font-mono text-[0.72rem] sm:text-xs">
        <div className="flex items-center gap-3 text-muted">
          <span className="text-cyan">$</span>
          <span className="hidden sm:inline">oxzenon@portfolio:~</span>
          <span className="sm:hidden">ox@:~</span>
          <span className="text-cyan animate-caret">▮</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <span className="text-purple2 hidden sm:inline">SOL/USD</span>
          <span className="text-text">{priceStr}</span>
          <span className={changeColor}>{changeStr}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-muted">
          <button
            onClick={onOpenPalette}
            className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 border border-purple/30 rounded hover:border-cyan/60 hover:text-cyan transition"
            title="Open command palette"
          >
            <span>⌘</span>
            <span>K</span>
          </button>
          <span>
            <span className="text-purple2">visitors</span>{' '}
            <span className="text-text">
              {visitors == null ? '—' : visitors.toLocaleString()}
            </span>
          </span>
          <span className="text-cyan">{clock}</span>
        </div>
      </div>
    </div>
  );
}
