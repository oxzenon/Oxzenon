import { useScrollReveal } from '../hooks/useScrollReveal.js';

// Every section is wrapped in this terminal-window frame.
// It owns: id (for scrolling), the chrome bar with traffic lights + filename,
// the box-drawing border, and the scroll-reveal animation.
export function Panel({ id, chrome, children, anchor }) {
  const [ref, visible] = useScrollReveal(0.08);

  return (
    <section
      id={anchor}
      ref={ref}
      className={`scroll-mt-24 sm:scroll-mt-28 transition-all duration-700
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
        <div className="terminal-panel overflow-hidden">
          <header className="terminal-chrome">
            <span className="chrome-dot bg-pink/80" />
            <span className="chrome-dot bg-purple2/80" />
            <span className="chrome-dot bg-cyan/80" />
            <span className="ml-2">{chrome}</span>
            <span className="ml-auto text-purple2/60">{id}</span>
          </header>
          <div className="p-5 sm:p-8 lg:p-12">{children}</div>
        </div>
      </div>
    </section>
  );
}
