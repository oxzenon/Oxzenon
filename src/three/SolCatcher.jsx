import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Glyph } from '../ui/Glyph.jsx';

// Ported from v1 js/sol-catcher.js — coins drift, raycast on click,
// particle bursts, dynamic spawn cadence, localStorage high score.
// Wrapped in React state so the HUD lives in JSX, not innerHTML.
export function SolCatcher() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest]   = useState(
    () => parseInt(localStorage.getItem('solCatcherBest') || '0', 10)
  );
  const stateRef = useRef({ reset: () => {} });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const k = new THREE.PointLight(0x9c7dff, 1.4, 50); k.position.set(6, 8, 6);   scene.add(k);
    const r = new THREE.PointLight(0x00e5c8, 1.0, 50); r.position.set(-6, -4, 4); scene.add(r);

    // Coin geometry — flat cylinder so it faces the camera
    const coinGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.14, 36);
    coinGeom.rotateX(Math.PI / 2);

    const coinPalette = [0x9c7dff, 0x6450ff, 0x00e5c8, 0xff4d8d];
    const coins  = [];
    const bursts = [];

    const liveScore = { value: 0 };
    const setLive = (v) => {
      liveScore.value = v;
      setScore(v);
      if (v > parseInt(localStorage.getItem('solCatcherBest') || '0', 10)) {
        localStorage.setItem('solCatcherBest', String(v));
        setBest(v);
      }
    };

    const spawnCoin = () => {
      const color = coinPalette[Math.floor(Math.random() * coinPalette.length)];
      const mat = new THREE.MeshStandardMaterial({
        color, metalness: 0.85, roughness: 0.25,
        emissive: color, emissiveIntensity: 0.35,
      });
      const coin = new THREE.Mesh(coinGeom, mat);
      coin.position.set(-10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2);
      coin.userData.vx   = 0.025 + Math.random() * 0.04;
      coin.userData.vy   = (Math.random() - 0.5) * 0.01;
      coin.userData.spin = (Math.random() - 0.5) * 0.05 + 0.02;
      scene.add(coin);
      coins.push(coin);
    };

    const burst = (position, color) => {
      const count = 30;
      const positions  = new Float32Array(count * 3);
      const velocities = [];
      for (let i = 0; i < count; i++) {
        positions[i * 3]     = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;
        velocities.push({
          x: (Math.random() - 0.5) * 0.25,
          y: (Math.random() - 0.5) * 0.25,
          z: (Math.random() - 0.5) * 0.25,
        });
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color, size: 0.12, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const pts = new THREE.Points(geom, mat);
      pts.userData = { velocities, life: 0 };
      scene.add(pts);
      bursts.push(pts);
    };

    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(coins);
      if (hits.length > 0) {
        const hit = hits[0].object;
        burst(hit.position.clone(), hit.material.color.getHex());
        scene.remove(hit);
        hit.material.dispose();
        coins.splice(coins.indexOf(hit), 1);
        setLive(liveScore.value + 1);
      }
    };
    canvas.addEventListener('pointerdown', onClick);

    stateRef.current.reset = () => {
      setLive(0);
      coins.forEach((c) => { scene.remove(c); c.material.dispose(); });
      coins.length = 0;
    };

    let lastSpawn = 0;
    let raf = 0;
    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      const spawnInterval = Math.max(450, 1100 - liveScore.value * 18);
      if (now - lastSpawn > spawnInterval) {
        spawnCoin();
        lastSpawn = now;
      }

      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.position.x += c.userData.vx;
        c.position.y += c.userData.vy;
        c.rotation.z += c.userData.spin;
        if (c.position.x > 11) {
          scene.remove(c);
          c.material.dispose();
          coins.splice(i, 1);
        }
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        const positions = b.geometry.attributes.position.array;
        const vels      = b.userData.velocities;
        b.userData.life += 1;
        for (let j = 0; j < vels.length; j++) {
          positions[j * 3]     += vels[j].x;
          positions[j * 3 + 1] += vels[j].y;
          positions[j * 3 + 2] += vels[j].z;
        }
        b.geometry.attributes.position.needsUpdate = true;
        b.material.opacity = Math.max(0, 1 - b.userData.life / 35);
        if (b.userData.life > 35) {
          scene.remove(b);
          b.geometry.dispose();
          b.material.dispose();
          bursts.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onClick);
      coins.forEach((c)  => { c.material.dispose(); });
      bursts.forEach((b) => { b.geometry.dispose(); b.material.dispose(); });
      coinGeom.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="terminal-panel overflow-hidden">
      <div className="terminal-chrome">
        <span className="chrome-dot bg-pink/80" />
        <span className="chrome-dot bg-purple2/80" />
        <span className="chrome-dot bg-cyan/80" />
        <span className="ml-2">catch-sol.exe</span>
      </div>

      <div ref={wrapRef} className="relative w-full aspect-[16/9] sm:aspect-[16/8] bg-bg/60">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-purple/15 font-mono text-sm">
        <div className="flex items-center gap-5">
          <span><span className="text-muted">score</span> <span className="text-cyan">{score}</span></span>
          <span><span className="text-muted">best</span>  <span className="text-purple2">{best}</span></span>
        </div>
        <button
          onClick={() => stateRef.current.reset()}
          className="term-btn flex items-center gap-2"
        >
          <Glyph name="fas fa-rotate-right" /> reset
        </button>
      </div>
    </div>
  );
}
