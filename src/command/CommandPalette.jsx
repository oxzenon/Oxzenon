import { useEffect, useMemo, useRef, useState } from 'react';
import { fuzzyScore } from '../lib/fuzzy.js';
import { Glyph } from '../ui/Glyph.jsx';

export function CommandPalette({ open, onClose, commands }) {
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  // Focus input + reset state when opened
  useEffect(() => {
    if (open) {
      setQ('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const ranked = useMemo(() => {
    if (!q.trim()) return commands.map((c) => ({ c, s: 1 }));
    return commands
      .map((c) => ({
        c,
        s: Math.max(
          fuzzyScore(q, c.label),
          fuzzyScore(q, c.hint || ''),
          fuzzyScore(q, c.id)
        ),
      }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s);
  }, [q, commands]);

  useEffect(() => {
    if (cursor >= ranked.length) setCursor(0);
  }, [cursor, ranked.length]);

  const run = (cmd) => {
    onClose();
    setTimeout(() => cmd.run(), 50);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, ranked.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = ranked[cursor]?.c;
      if (pick) run(pick);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center bg-bg/70 backdrop-blur-sm pt-[8vh]"
      onClick={onClose}
    >
      <div
        className="w-[min(640px,92vw)] rounded-xl border border-purple/30 bg-bg2/95 shadow-glow-purple overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-2 border-b border-purple/20 font-mono text-xs text-muted">
          <span className="chrome-dot bg-pink/80" />
          <span className="chrome-dot bg-purple2/80" />
          <span className="chrome-dot bg-cyan/80" />
          <span className="ml-2">~/commands</span>
          <span className="ml-auto">ESC to close</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-b border-purple/15 font-mono">
          <span className="text-cyan">$</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setCursor(0); }}
            onKeyDown={onKeyDown}
            placeholder="type to filter — goto, toggle, open…"
            className="flex-1 bg-transparent outline-none text-text placeholder:text-muted/60 font-mono text-sm"
          />
          <span className="text-cyan animate-caret">▮</span>
        </div>

        <ul className="max-h-[55vh] overflow-y-auto py-1">
          {ranked.length === 0 && (
            <li className="px-4 py-3 font-mono text-sm text-muted">
              no match. try <span className="text-purple2">goto</span>,{' '}
              <span className="text-purple2">toggle</span>, or{' '}
              <span className="text-purple2">open</span>.
            </li>
          )}
          {ranked.map(({ c }, i) => (
            <li
              key={c.id}
              onMouseEnter={() => setCursor(i)}
              onClick={() => run(c)}
              className={`flex items-center gap-3 px-4 py-2 font-mono text-sm cursor-pointer
                ${i === cursor ? 'bg-purple/15 text-text' : 'text-muted hover:text-text'}`}
            >
              <Glyph
                name={c.glyph}
                className={i === cursor ? 'text-cyan' : 'text-purple2'}
              />
              <span className="text-text">{c.label}</span>
              <span className="ml-auto text-xs text-muted">{c.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
