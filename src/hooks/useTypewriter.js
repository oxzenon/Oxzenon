import { useEffect, useState } from 'react';

// Streams a string character-by-character. Returns the current rendered
// substring plus a `done` flag so callers can chain effects.
export function useTypewriter(source, speed = 24, startDelay = 0) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setText('');
    setDone(false);
    let i = 0;
    let timer = null;
    let raf = null;

    const start = () => {
      timer = setInterval(() => {
        i += 1;
        setText(source.slice(0, i));
        if (i >= source.length) {
          clearInterval(timer);
          setDone(true);
        }
      }, speed);
    };

    if (startDelay > 0) {
      raf = window.setTimeout(start, startDelay);
    } else {
      start();
    }

    return () => {
      if (timer) clearInterval(timer);
      if (raf) clearTimeout(raf);
    };
  }, [source, speed, startDelay]);

  return { text, done };
}
