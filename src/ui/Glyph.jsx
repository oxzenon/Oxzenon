// Font Awesome icon wrapper. Calling it Glyph keeps generic "icon" out
// of the codebase — every visual mark in this UI is a glyph.
export function Glyph({ name, className = '' }) {
  return <i className={`${name} ${className}`} aria-hidden="true" />;
}
