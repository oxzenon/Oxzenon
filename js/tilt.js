// ============================================================
//  tilt.js — Mouse-driven 3D tilt + cursor-follow glow
//  Applies to .project-card and .stat-card.
// ============================================================

'use strict';

(function initTilt() {

  const MAX_TILT = 10;   // degrees
  const LIFT     = 12;   // px translateZ

  function bindCard(card) {
    let rect = null;

    const onEnter = () => {
      rect = card.getBoundingClientRect();
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.4s ease';
    };

    const onMove = e => {
      if (!rect) rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalize to -1 … 1
      const nx = (x / rect.width)  * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;

      const rotY = nx *  MAX_TILT;
      const rotX = ny * -MAX_TILT;

      card.style.transform =
        `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${LIFT}px)`;

      // Feed cursor position into the CSS glow overlay
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    };

    const onLeave = () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      rect = null;
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseleave', onLeave);
  }

  function bindAll() {
    document.querySelectorAll('.project-card, .stat-card').forEach(card => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';
      bindCard(card);
    });
  }

  // Initial binding
  document.addEventListener('DOMContentLoaded', bindAll);

  // Re-bind when project cards are re-rendered (filter change)
  const observer = new MutationObserver(bindAll);
  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projectsGrid');
    if (grid) observer.observe(grid, { childList: true });
  });

  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    document.removeEventListener('DOMContentLoaded', bindAll);
  }
})();
