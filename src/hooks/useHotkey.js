import { useEffect } from 'react';

// Bind a global hotkey. `combo` is a string like 'mod+k' or 'esc'.
// mod = Cmd on Mac, Ctrl elsewhere.
export function useHotkey(combo, handler) {
  useEffect(() => {
    const parts = combo.toLowerCase().split('+').map((p) => p.trim());
    const needMod  = parts.includes('mod');
    const needAlt  = parts.includes('alt');
    const needShift = parts.includes('shift');
    const key = parts.filter((p) => !['mod', 'alt', 'shift'].includes(p))[0];

    const onKey = (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (needMod && !isMod) return;
      if (!needMod && isMod) return;
      if (needAlt !== e.altKey) return;
      if (needShift !== e.shiftKey) return;
      if (e.key.toLowerCase() !== key) return;
      e.preventDefault();
      handler(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [combo, handler]);
}
