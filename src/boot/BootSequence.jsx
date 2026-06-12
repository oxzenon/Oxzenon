import { useEffect, useRef, useState } from 'react';
import { BOOT_LINES } from './bootLines.js';

// Streams the boot lines character-by-character, then waits for the
// user to press Enter / click / tap to dismiss.
export function BootSequence({ onDone }) {
  const [shown, setShown] = useState(['']);
  const [doneStream, setDoneStream] = useState(false);
  const indexRef = useRef({ line: 0, col: 0 });
  const boxRef = useRef(null);

  // Stream characters
  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const { line, col } = indexRef.current;
      if (line >= BOOT_LINES.length) {
        setDoneStream(true);
        return;
      }
      const target = BOOT_LINES[line];
      if (col < target.length) {
        indexRef.current.col = col + 1;
        setShown((prev) => {
          const next = prev.slice();
          next[next.length - 1] = target.slice(0, col + 1);
          return next;
        });
        setTimeout(tick, target.startsWith('[ OK ]') ? 6 : 14);
      } else {
        indexRef.current.line = line + 1;
        indexRef.current.col = 0;
        setShown((prev) => [...prev, '']);
        setTimeout(tick, target === '' ? 120 : 180);
      }
    };
    const id = setTimeout(tick, 250);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, []);

  // Auto-scroll as lines stream in
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [shown]);

  // Dismiss on Enter / click / tap
  useEffect(() => {
    if (!doneStream) return;
    const dismiss = () => onDone();
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', dismiss);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', dismiss);
    };
  }, [doneStream, onDone]);

  return (
    <div className="fixed inset-0 z-[200] bg-bg flex items-stretch justify-stretch">
      <div
        ref={boxRef}
        className="m-4 sm:m-10 flex-1 rounded-lg border border-purple/25 bg-bg2/80 p-4 sm:p-6 overflow-auto font-mono text-[0.78rem] sm:text-sm text-cyan/90 shadow-glow-purple"
      >
        <div className="text-purple2 mb-3 select-none">
          ╭───────────────────────────────────────────────╮<br />
          │  OXZENON.OS — initializing user session       │<br />
          ╰───────────────────────────────────────────────╯
        </div>
        {shown.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line.startsWith('[ OK ]') ? (
              <>
                <span className="text-cyan">[ OK ]</span>
                <span className="text-text">{line.slice(6)}</span>
              </>
            ) : (
              <span className={line.includes('ENTER') ? 'text-purple2 animate-pulse' : 'text-text'}>
                {line}
              </span>
            )}
            {i === shown.length - 1 && !doneStream && (
              <span className="text-cyan animate-caret">▮</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
