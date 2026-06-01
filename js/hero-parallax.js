// ============================================================
//  hero-parallax.js — Mouse-driven 3D parallax on the hero
//  Avatar tilts toward cursor + float cards drift at depth.
// ============================================================

'use strict';

(function initHeroParallax() {

  // Skip on touch-only devices
  if (window.matchMedia('(hover: none)').matches) return;

  document.addEventListener('DOMContentLoaded', () => {
    const hero      = document.querySelector('.hero');
    const heroRight = document.querySelector('.hero-right');
    const avatar    = document.getElementById('avatarTilt');
    const floats    = document.querySelectorAll('.float-card');

    if (!hero || !heroRight || !avatar) return;

    // Per-card depth — different translateZ to create real parallax
    const depths = [60, 90, 75];

    let mx = 0, my = 0;        // smoothed
    let tx = 0, ty = 0;        // target (-1 … 1)
    let rect = null;

    const updateRect = () => { rect = hero.getBoundingClientRect(); };
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });

    hero.addEventListener('mousemove', e => {
      if (!rect) return;
      tx = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      ty = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
    });

    hero.addEventListener('mouseleave', () => {
      tx = 0;
      ty = 0;
    });

    const start = performance.now();

    function loop(now) {
      const t = (now - start) / 1000;

      // Smooth follow
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;

      // Avatar — tilt up to 18° toward cursor, slight lift
      const rotY =  mx * 18;
      const rotX = -my * 18;
      avatar.style.transform =
        `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(20px)`;

      // Float cards — each gets a different depth, parallax, and gentle bob
      floats.forEach((card, i) => {
        const depth = depths[i] || 60;
        const moveX = mx * (12 + i * 4);
        const moveY = my * (12 + i * 4);
        const bob   = Math.sin(t * 1.2 + i * 2) * 6;
        card.style.transform =
          `translate3d(${-moveX}px, ${-moveY + bob}px, ${depth}px)`;
      });

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  });
})();
