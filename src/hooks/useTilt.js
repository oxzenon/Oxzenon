import { useEffect, useRef } from 'react';
import { useTouchOnly } from './useTouchOnly.js';

// Mouse-tilt + cursor-follow glow for a card. Ported from v1 tilt.js.
// Skips itself on touch devices so we don't apply a hover-only effect.
export function useTilt(maxTilt = 10, lift = 12) {
  const ref = useRef(null);
  const touch = useTouchOnly();

  useEffect(() => {
    if (touch) return;
    const card = ref.current;
    if (!card) return;
    let rect = null;

    const onEnter = () => {
      rect = card.getBoundingClientRect();
      card.style.transition =
        'transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.4s ease';
    };
    const onMove = (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;
      const rotY = nx * maxTilt;
      const rotX = ny * -maxTilt;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${lift}px)`;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    };
    const onLeave = () => {
      card.style.transition =
        'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease';
      card.style.transform =
        'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      rect = null;
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [maxTilt, lift, touch]);

  return ref;
}
