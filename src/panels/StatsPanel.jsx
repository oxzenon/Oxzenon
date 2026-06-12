import { Panel } from './Panel.jsx';
import { AsciiHeader } from '../ui/AsciiHeader.jsx';
import { Glyph } from '../ui/Glyph.jsx';
import { useSolPrice } from '../hooks/useSolPrice.js';

export function StatsPanel() {
  const sol = useSolPrice();

  const big = sol.status === 'ok' ? `$${sol.price.toLocaleString()}` : '—';
  const change =
    sol.status === 'ok'
      ? `${sol.change >= 0 ? '▲' : '▼'} ${Math.abs(sol.change).toFixed(2)}%`
      : 'loading…';
  const changeColor =
    sol.status === 'ok' ? (sol.change >= 0 ? 'text-cyan' : 'text-pink') : 'text-muted';

  return (
    <Panel id="usr/stat-sol" chrome="stat sol" anchor="stats">
      <div className="space-y-8">
        <AsciiHeader
          tag="live"
          title="Solana Stats"
          kicker="curl coingecko.com — real-time data from the chain I'm learning on"
        />

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="terminal-panel p-6 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <Glyph name="fas fa-bolt" className="text-cyan" /> SOL_PRICE
            </div>
            <div className="font-mono text-4xl text-text">{big}</div>
            <div className={`font-mono text-sm ${changeColor}`}>{change}</div>
          </div>

          <div className="terminal-panel p-6 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <Glyph name="fas fa-globe" className="text-purple2" /> NETWORK
            </div>
            <div className="font-mono text-2xl text-text">Solana</div>
            <div className="font-mono text-sm text-muted">Mainnet Beta</div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
