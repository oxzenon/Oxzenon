import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { BootSequence }    from './boot/BootSequence.jsx';
import { CommandPalette }  from './command/CommandPalette.jsx';
import { buildCommands }   from './command/commands.js';

import { AmbientScene }    from './three/AmbientScene.jsx';

import { HeroPanel }       from './panels/HeroPanel.jsx';
import { AboutPanel }      from './panels/AboutPanel.jsx';
import { ProjectsPanel }   from './panels/ProjectsPanel.jsx';
import { StatsPanel }      from './panels/StatsPanel.jsx';
import { GamePanel }       from './panels/GamePanel.jsx';
import { ContactPanel }    from './panels/ContactPanel.jsx';

import { ScanLines }       from './ui/ScanLines.jsx';
import { StatusBar }       from './ui/StatusBar.jsx';
import { ToastProvider }   from './ui/Toast.jsx';
import { Glyph }           from './ui/Glyph.jsx';
import { PromptLine }      from './ui/PromptLine.jsx';

import { useHotkey }       from './hooks/useHotkey.js';

const NAV = [
  { id: 'hero',     label: '~/whoami'  },
  { id: 'about',    label: '/about'    },
  { id: 'projects', label: '/projects' },
  { id: 'stats',    label: '/stat'     },
  { id: 'game',     label: '/game'     },
  { id: 'contact',  label: '/mail'     },
];

function bootShouldRun() {
  const url = new URLSearchParams(window.location.search);
  if (url.get('boot') === '1') return true;
  return !localStorage.getItem('oxzenonBooted');
}

export default function Terminal() {
  const [booted, setBooted]       = useState(() => !bootShouldRun());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scanOn, setScanOn]       = useState(true);
  const [menuOpen, setMenuOpen]   = useState(false);

  const finishBoot = useCallback(() => {
    localStorage.setItem('oxzenonBooted', '1');
    setBooted(true);
  }, []);

  // Cmd/Ctrl+K opens the palette
  useHotkey('mod+k', () => setPaletteOpen((v) => !v));

  const scrollTo = useCallback((anchor) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const commands = useMemo(
    () => buildCommands({ scrollTo, toggleScan: () => setScanOn((v) => !v) }),
    [scrollTo]
  );

  // Cosmetic title flash on boot
  useEffect(() => {
    if (!booted) return;
    document.title = 'oxzenon@portfolio:~';
  }, [booted]);

  if (!booted) {
    return <BootSequence onDone={finishBoot} />;
  }

  return (
    <ToastProvider>
      <AmbientScene />
      <ScanLines enabled={scanOn} />

      {/* ── Top nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-[50] backdrop-blur-md bg-bg/70 border-b border-purple/15">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <button
            onClick={() => scrollTo('hero')}
            className="font-mono text-sm"
            aria-label="Go to top"
          >
            <PromptLine cmd="oxzenon --start" blink />
          </button>

          <ul className="hidden lg:flex items-center gap-1 font-mono text-sm">
            {NAV.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => scrollTo(n.id)}
                  className="px-3 py-1.5 rounded text-muted hover:text-cyan hover:bg-purple/10 transition"
                >
                  {n.label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => setPaletteOpen(true)}
                className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded border border-purple/30 text-purple2 hover:text-cyan hover:border-cyan/60 transition"
                title="Open command palette (⌘K)"
              >
                <Glyph name="fas fa-terminal" /> ⌘K
              </button>
            </li>
          </ul>

          <button
            className="lg:hidden p-2 rounded border border-purple/30 text-text"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Glyph name={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>

        {/* mobile drawer */}
        {menuOpen && (
          <ul className="lg:hidden flex flex-col px-4 pb-3 font-mono text-sm bg-bg2/95 border-t border-purple/15">
            {NAV.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => { setMenuOpen(false); scrollTo(n.id); }}
                  className="block w-full text-left px-3 py-2 rounded text-text hover:text-cyan hover:bg-purple/10 transition"
                >
                  $ goto {n.label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setMenuOpen(false); setPaletteOpen(true); }}
                className="block w-full text-left px-3 py-2 rounded text-purple2 hover:text-cyan hover:bg-purple/10 transition"
              >
                $ palette ⌘K
              </button>
            </li>
          </ul>
        )}
      </nav>

      {/* ── Main scrollable content. AnimatePresence wraps each panel
            with a clip-path mask reveal so panel transitions feel
            like a terminal redraw, not a generic React route. ── */}
      <main className="relative z-10 pt-16 pb-16">
        <AnimatePresence>
          {[HeroPanel, AboutPanel, ProjectsPanel, StatsPanel, GamePanel, ContactPanel].map(
            (PanelComponent, i) => (
              <motion.div
                key={i}
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0 0% 0)',   opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay: i * 0.04 }}
              >
                <PanelComponent />
              </motion.div>
            )
          )}
        </AnimatePresence>

        <footer className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-center font-mono text-xs text-muted space-y-2">
          <p>
            <span className="text-purple2">$</span> echo "&copy; 2026 Oxzenon — built on the open web."
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => scrollTo('hero')} className="hover:text-cyan transition">
              top ↑
            </button>
            <span className="text-purple/40">|</span>
            <a href="https://github.com/oxzenon/Oxzenon" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition">
              repo ↗
            </a>
            <span className="text-purple/40">|</span>
            <a href="https://github.com/oxzenon/Oxzenon/tree/v1-vanilla" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition">
              v1-vanilla ↗
            </a>
          </div>
        </footer>
      </main>

      <StatusBar onOpenPalette={() => setPaletteOpen(true)} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={commands}
      />
    </ToastProvider>
  );
}
