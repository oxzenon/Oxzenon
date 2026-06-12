// Full-screen CRT overlay. Z-index sits above background canvases
// but below content; pointer events disabled.
export function ScanLines({ enabled = true }) {
  if (!enabled) return null;
  return <div className="scanline" aria-hidden="true" />;
}
