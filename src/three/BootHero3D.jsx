import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// NEW for v2 — wireframe cube tumbling at the center of the Hero panel
// with ~28 ASCII characters orbiting it on three offset rings.
// Each char is rendered to a tiny canvas → texture → sprite, so the
// glyphs always face the camera and never fight the lighting.
const CHARS = ['{', '}', '[', ']', '<', '>', '/', '\\', '$', '#', '~', '*',
  '0', '1', 'X', 'Z', 'N', 'O', 'x', 'z', '+', '=', '|', '&', ':', ';', '.', '_'];

function makeCharTexture(ch, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 96px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;
  ctx.fillStyle = color;
  ctx.fillText(ch, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export function BootHero3D() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const sizeRef = { w: 0, h: 0 };
    const sync = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      sizeRef.w = w; sizeRef.h = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(wrap);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const lp = new THREE.PointLight(0x9c7dff, 1.4, 30); lp.position.set(4, 4, 4); scene.add(lp);
    const lc = new THREE.PointLight(0x00e5c8, 1.0, 30); lc.position.set(-4, -3, 3); scene.add(lc);

    // Wireframe cube — built from edges of a Box so corners stay crisp.
    const box      = new THREE.BoxGeometry(2.6, 2.6, 2.6);
    const edges    = new THREE.EdgesGeometry(box);
    const cubeMat  = new THREE.LineBasicMaterial({ color: 0x9c7dff, transparent: true, opacity: 0.85 });
    const cube     = new THREE.LineSegments(edges, cubeMat);
    scene.add(cube);

    // Inner glowing core — a tiny icosahedron for visual interest
    const coreGeo = new THREE.IcosahedronGeometry(0.55, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00e5c8, emissive: 0x00e5c8, emissiveIntensity: 0.7,
      metalness: 0.6, roughness: 0.2, transparent: true, opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Orbiting ASCII sprites
    const palette = ['#9c7dff', '#00e5c8', '#ff4d8d', '#eeeef8'];
    const sprites = [];
    const textures = [];
    for (let i = 0; i < 28; i++) {
      const ch = CHARS[i % CHARS.length];
      const color = palette[i % palette.length];
      const tex = makeCharTexture(ch, color);
      textures.push(tex);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const sp = new THREE.Sprite(mat);
      const ring = i % 3;                  // 0, 1, 2 → three rings
      const radius = 3.2 + ring * 0.9;
      sp.userData = {
        radius,
        speed: 0.25 + Math.random() * 0.3 + ring * 0.05,
        phase: Math.random() * Math.PI * 2,
        yAmp:  0.4 + ring * 0.4,
        ring,
      };
      sp.scale.set(0.55, 0.55, 1);
      scene.add(sp);
      sprites.push(sp);
    }

    // Pointer lean
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      const rect = wrap.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    wrap.addEventListener('pointermove', onPointer);

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t  = clock.getElapsedTime();
      const dt = clock.getDelta();

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      // Cube tumble + pointer-driven lean
      cube.rotation.x = t * 0.35 + pointer.y * 0.4;
      cube.rotation.y = t * 0.5  + pointer.x * 0.5;
      cube.rotation.z = Math.sin(t * 0.4) * 0.1;

      core.rotation.x -= dt * 0.6;
      core.rotation.y += dt * 0.9;
      core.scale.setScalar(1 + Math.sin(t * 2.5) * 0.05);

      sprites.forEach((sp) => {
        const u = sp.userData;
        const a = t * u.speed + u.phase;
        sp.position.x = Math.cos(a) * u.radius + pointer.x * 0.35;
        sp.position.z = Math.sin(a) * u.radius;
        sp.position.y = Math.sin(t * 0.8 + u.phase) * u.yAmp - pointer.y * 0.35;
        const depth = (sp.position.z + u.radius) / (u.radius * 2);
        sp.material.opacity = 0.55 + depth * 0.45;
        sp.scale.setScalar(0.45 + depth * 0.25);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onPointer);
      box.dispose(); edges.dispose(); cubeMat.dispose();
      coreGeo.dispose(); coreMat.dispose();
      sprites.forEach((sp) => sp.material.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === wrap) {
        wrap.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full aspect-square max-w-[460px] mx-auto rounded-2xl border border-purple/25 bg-bg2/40 overflow-hidden shadow-glow-purple"
    />
  );
}
