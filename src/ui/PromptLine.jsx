// Reusable shell prompt. Used in the boot screen, hero, and section tags.
export function PromptLine({ user = 'oxzenon', host = 'portfolio', path = '~', cmd, blink = false }) {
  return (
    <span className="font-mono text-sm">
      <span className="text-cyan">{user}</span>
      <span className="text-muted">@</span>
      <span className="text-purple2">{host}</span>
      <span className="text-muted">:{path}</span>
      <span className="text-muted">$ </span>
      {cmd && <span className="text-text">{cmd}</span>}
      {blink && <span className="text-cyan animate-caret">▮</span>}
    </span>
  );
}
