// Compact ASCII section headers. Each section feeds a label like
// "ABOUT", "WORK", "STAT" and we render it as box-drawing block letters
// using a tiny inline font of glyph rows. We keep this lightweight
// (a single ╭── // <LABEL> ──╮ banner with a sweep underline) so
// every section has the same scannable signature without ballooning
// the bundle with figlet-style fonts.
export function AsciiHeader({ tag, title, kicker }) {
  return (
    <header className="space-y-2">
      <div className="font-mono text-xs text-cyan tracking-[0.3em]">
        ╭── // {tag.toUpperCase()} ──╮
      </div>
      <h2 className="font-display text-xl xs:text-2xl sm:text-3xl md:text-5xl leading-tight tracking-tight text-text">
        {title}
      </h2>
      {kicker && (
        <p className="font-mono text-sm text-muted">
          <span className="text-purple2">$</span> {kicker}
        </p>
      )}
    </header>
  );
}
