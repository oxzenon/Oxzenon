import { useEffect, useRef, useState } from 'react';

// Skill bar reveal uses threshold 0.5 like v1 — the bar only fills
// once the row is solidly in view, which feels more deliberate.
export function useSkillBar() {
  const ref = useRef(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setFilled(true);
            obs.unobserve(node);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return [ref, filled];
}
