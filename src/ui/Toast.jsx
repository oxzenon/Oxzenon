import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Glyph } from './Glyph.jsx';

const ToastContext = createContext({ toast: () => {} });

export function ToastProvider({ children }) {
  const [t, setT] = useState(null);

  const toast = useCallback((message, type = 'success') => {
    setT({ message, type, id: Math.random() });
  }, []);

  useEffect(() => {
    if (!t) return;
    const id = setTimeout(() => setT(null), 3800);
    return () => clearTimeout(id);
  }, [t]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className={`fixed top-6 right-6 z-[120] pointer-events-none transition-all duration-300
          ${t ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}
      >
        {t && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-mono text-sm shadow-panel
              ${t.type === 'success'
                ? 'border-cyan/40 bg-bg2/90 text-text shadow-glow-cyan'
                : 'border-pink/40 bg-bg2/90 text-text shadow-glow-pink'}`}
          >
            <Glyph
              name={`fas fa-${t.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}
              className={t.type === 'success' ? 'text-cyan' : 'text-pink'}
            />
            <span>{t.message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext).toast;
}
