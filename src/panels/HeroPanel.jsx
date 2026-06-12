import { Panel } from './Panel.jsx';
import { PromptLine } from '../ui/PromptLine.jsx';
import { Typewriter } from '../ui/Typewriter.jsx';
import { Glyph } from '../ui/Glyph.jsx';
import { useSolPrice } from '../hooks/useSolPrice.js';

export function HeroPanel() {
  const sol = useSolPrice();

  const priceCell =
    sol.status === 'ok'
      ? `$${sol.price.toFixed(2)} (${sol.change >= 0 ? '▲' : '▼'} ${Math.abs(sol.change).toFixed(2)}%)`
      : sol.status === 'loading' ? 'loading…' : 'unavailable';

  return (
    <Panel id="usr/whoami.sh" chrome="whoami.sh" anchor="hero">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-1">
            <PromptLine cmd="cat /etc/identity" />
            <Typewriter
              text="Babalola Ifeoluwa"
              speed={30}
              className="block font-display text-2xl xs:text-3xl sm:text-5xl lg:text-6xl tracking-tight text-text"
            />
            <Typewriter
              text="aka Oxzenon"
              speed={26}
              className="block font-mono text-purple2 text-xs xs:text-sm sm:text-base"
            />
          </div>

          <div className="space-y-1">
            <PromptLine cmd="role" />
            <p className="font-mono text-text">
              <span className="text-cyan">▸</span> Web Developer{' '}
              <span className="text-muted">·</span> Exploring Web3
            </p>
          </div>

          <p className="text-muted max-w-xl leading-relaxed">
            I build for the open web — crafting clean, responsive interfaces
            with HTML, CSS, JavaScript and React. Currently diving into Solidity and
            Solana to bring that work on-chain.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#projects" className="term-btn-primary inline-flex items-center gap-2">
              <Glyph name="fas fa-code" />./view-work
            </a>
            <a href="#contact" className="term-btn inline-flex items-center gap-2">
              <Glyph name="fas fa-paper-plane" />./contact
            </a>
          </div>

          <div className="pt-4 border-t border-purple/15 grid sm:grid-cols-3 gap-2 font-mono text-xs sm:text-sm">
            <div>
              <span className="text-cyan">[ currently ]</span>{' '}
              <span className="text-text">learning solidity</span>
            </div>
            <div>
              <span className="text-cyan">[ chain ]</span>{' '}
              <span className="text-text">solana</span>
            </div>
            <div className="sm:col-span-1 col-span-3 truncate">
              <span className="text-cyan">[ sol/usd ]</span>{' '}
              <span className={
                sol.status === 'ok'
                  ? (sol.change >= 0 ? 'text-cyan' : 'text-pink')
                  : 'text-text'
              }>
                {priceCell}
              </span>
            </div>
          </div>
        </div>

        <div>
          <img src="/oxzenon.jpg" alt="Oxzenon" className="w-full rounded-lg" />
        </div>
      </div>
    </Panel>
  );
}
