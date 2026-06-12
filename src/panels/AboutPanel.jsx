import { Panel } from './Panel.jsx';
import { AsciiHeader } from '../ui/AsciiHeader.jsx';
import { useSkillBar } from '../hooks/useSkillBar.js';

const SKILLS = [
  { label: 'HTML / CSS',         pct: 80 },
  { label: 'JavaScript',         pct: 70 },
  { label: 'React',              pct: 50 },
  { label: 'Responsive Design',  pct: 75 },
  { label: 'Solidity',           pct: 30 },
  { label: 'Web3 Concepts',      pct: 60 },
];

const SYSTEM_INFO = [
  ['MONTHS_LEARNING',     '< 1yr'],
  ['PROJECTS_SHIPPED',    '3+'],
  ['CURRENTLY_LEARNING',  'Solidity'],
  ['CHAIN_FOCUS',         'Solana'],
];

function SkillRow({ label, pct }) {
  const [ref, filled] = useSkillBar();
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-text">{label}</span>
        <span className="text-purple2">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-bg3/80 overflow-hidden border border-purple/15">
        <div
          className="skill-fill relative h-full bg-gradient-to-r from-purple via-purple2 to-cyan transition-[width] duration-[1500ms] ease-out"
          style={{ width: filled ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  );
}

export function AboutPanel() {
  return (
    <Panel id="usr/about.md" chrome="about.md" anchor="about">
      <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10">
        <aside className="lg:sticky lg:top-24 self-start space-y-3">
          <div className="rounded-xl border border-purple/25 overflow-hidden bg-bg2/40">
            <img
              src="/oxzenon-image.png"
              alt="Oxzenon — stylized full-body portrait"
              className="w-full h-auto block"
            />
          </div>
          <p className="font-mono text-xs text-muted">// the persona</p>
        </aside>

        <div className="space-y-10">
          <AsciiHeader
            tag="about"
            title={<>Web first.<br />Web3 next.</>}
            kicker="cat /home/oxzenon/about.md"
          />

          <div className="space-y-4 leading-relaxed text-text/90">
            <p>
              I'm a web developer focused on building clean, responsive
              interfaces with HTML, CSS, and JavaScript. This portfolio is one
              of the things I've shipped along the way — every section here,
              including the 3D background, is hand-built.
            </p>
            <p>
              Lately I've been diving into Web3 — learning Solidity, reading up
              on Solana, and figuring out how to bring the same craft I put
              into frontends into on-chain experiences. I'm early in the
              journey, and I'd rather show real progress than fake credentials.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 gap-2 font-mono text-sm">
            {SYSTEM_INFO.map(([k, v]) => (
              <li key={k} className="flex items-baseline gap-3">
                <span className="text-cyan">▸</span>
                <span className="text-muted">{k}</span>
                <span className="text-muted">:</span>
                <span className="text-text">{v}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            {SKILLS.map((s) => <SkillRow key={s.label} {...s} />)}
          </div>
        </div>
      </div>
    </Panel>
  );
}
