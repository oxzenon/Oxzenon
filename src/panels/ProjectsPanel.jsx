import { useMemo, useState } from 'react';
import { Panel } from './Panel.jsx';
import { AsciiHeader } from '../ui/AsciiHeader.jsx';
import { Glyph } from '../ui/Glyph.jsx';
import { PROJECTS, BUCKETS } from '../lib/projects.js';
import { useTilt } from '../hooks/useTilt.js';

function ProjectCard({ project }) {
  const tiltRef = useTilt(8, 8);
  return (
    <article
      ref={tiltRef}
      className="relative terminal-panel overflow-hidden transition will-change-transform"
      style={{
        background: 'linear-gradient(180deg, rgba(20,18,40,0.7), rgba(10,10,24,0.7))',
      }}
    >
      <header className="terminal-chrome">
        <span className="chrome-dot bg-pink/80" />
        <span className="chrome-dot bg-purple2/80" />
        <span className="chrome-dot bg-cyan/80" />
        <span className="ml-2">{project.chrome}</span>
      </header>

      <div
        className="relative flex items-center justify-center h-36"
        style={{ background: project.bg }}
      >
        <Glyph name={project.glyph} className="text-5xl text-text drop-shadow" />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition"
          style={{
            background:
              'radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.18), transparent 60%)',
          }}
        />
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-display text-xl text-text">{project.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{project.blurb}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="tag-chip">--{s.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2 font-mono text-sm">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-purple2 hover:text-cyan transition"
            >
              <Glyph name="fab fa-github" /> ./code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan hover:text-text transition"
            >
              <Glyph name="fas fa-up-right-from-square" /> ./live ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectsPanel() {
  const [active, setActive] = useState('all');

  const visible = useMemo(
    () => (active === 'all' ? PROJECTS : PROJECTS.filter((p) => p.bucket === active)),
    [active]
  );

  return (
    <Panel id="usr/projects.json" chrome="ls projects/" anchor="projects">
      <div className="space-y-8">
        <AsciiHeader
          tag="work"
          title="Projects & Builds"
          kicker="ls -la ~/projects/ — real things I've shipped while learning"
        />

        <div className="flex flex-wrap gap-2 font-mono text-sm">
          {BUCKETS.map((b) => (
            <button
              key={b.id}
              onClick={() => setActive(b.id)}
              className={`px-3 py-1.5 rounded-md border transition
                ${active === b.id
                  ? 'border-cyan/60 text-cyan bg-cyan/10'
                  : 'border-purple/25 text-muted hover:text-text hover:border-purple/60'}`}
            >
              [ {b.label} ]
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="font-mono text-sm text-muted">
            <span className="text-cyan">$</span> no projects in this bucket yet.
          </p>
        )}
      </div>
    </Panel>
  );
}
