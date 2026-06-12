import { useEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter.js';

// Types `text` once, optionally fires `onDone`. If `start === false`
// nothing is typed until the parent flips it true (handy for scroll-in).
export function Typewriter({ text, speed = 22, start = true, onDone, className = '' }) {
  const { text: out, done } = useTypewriter(start ? text : '', speed);

  useEffect(() => {
    if (done && onDone) onDone();
  }, [done, onDone]);

  return (
    <span className={className}>
      {out}
      {!done && start && <span className="text-cyan animate-caret">▮</span>}
    </span>
  );
}
