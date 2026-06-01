// ============================================================
//  scene3d.js — Three.js animated 3D background
//  Floating geometry, particle field, scroll + mouse parallax.
// ============================================================

'use strict';

(function initThreeScene() {
  if (typeof THREE === 'undefined') {
    console.warn('Three.js failed to load.');
    return;
  }

  const canvas = document.getElementById('bg3d');
  if (!canvas) return;

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: window.devicePixelRatio < 2
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ── Scene + Camera ──
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 14;

  // ── Lights ──
  scene.add(new THREE.AmbientLight(0x444466, 0.6));

  const purpleLight = new THREE.PointLight(0x6450ff, 1.4, 50);
  purpleLight.position.set(-8, 6, 6);
  scene.add(purpleLight);

  const cyanLight = new THREE.PointLight(0x00e5c8, 1.2, 50);
  cyanLight.position.set(8, -4, 6);
  scene.add(cyanLight);

  const pinkLight = new THREE.PointLight(0xff4d8d, 0.8, 40);
  pinkLight.position.set(0, 8, 4);
  scene.add(pinkLight);

  // ── Central wireframe torus knot ──
  const knotGeo = new THREE.TorusKnotGeometry(2.2, 0.55, 140, 16);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x9c7dff,
    emissive: 0x6450ff,
    emissiveIntensity: 0.35,
    metalness: 0.9,
    roughness: 0.2,
    wireframe: true
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  // ── Floating low-poly shapes (icosahedrons + octahedrons) ──
  const shapes = [];
  const palette = [0x6450ff, 0x00e5c8, 0xff4d8d, 0x9c7dff];

  for (let i = 0; i < 18; i++) {
    const isIco = Math.random() > 0.5;
    const geo = isIco
      ? new THREE.IcosahedronGeometry(0.35 + Math.random() * 0.4, 0)
      : new THREE.OctahedronGeometry(0.35 + Math.random() * 0.4, 0);

    const mat = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      emissive: palette[i % palette.length],
      emissiveIntensity: 0.4,
      metalness: 0.7,
      roughness: 0.25,
      flatShading: true,
      transparent: true,
      opacity: 0.85
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 10 - 2
    );
    mesh.userData = {
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      floatPhase: Math.random() * Math.PI * 2,
      floatAmp: 0.4 + Math.random() * 0.6,
      basePos: null
    };
    mesh.userData.basePos = mesh.position.clone();
    scene.add(mesh);
    shapes.push(mesh);
  }

  // ── Particle starfield ──
  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xaaa8ff,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Mouse + scroll state ──
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollY = 0;

  window.addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / window.innerWidth)  * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  // ── Resize ──
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ──
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t  = clock.getElapsedTime();
    const dt = clock.getDelta();

    // Smooth mouse follow
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // Knot — slow rotation + scroll-driven spin
    knot.rotation.x = t * 0.15 + scrollY * 0.001;
    knot.rotation.y = t * 0.2;
    knot.position.y = Math.sin(t * 0.4) * 0.5 - scrollY * 0.003;

    // Floating shapes — per-shape rotation + bob
    shapes.forEach(s => {
      s.rotation.x += s.userData.rotSpeed.x;
      s.rotation.y += s.userData.rotSpeed.y;
      s.rotation.z += s.userData.rotSpeed.z;
      s.position.y = s.userData.basePos.y
        + Math.sin(t * 0.6 + s.userData.floatPhase) * s.userData.floatAmp;
    });

    // Particle field — gentle drift
    particles.rotation.y = t * 0.02;
    particles.rotation.x = scrollY * 0.0003;

    // Camera parallax driven by mouse + scroll
    camera.position.x = mouse.x * 2;
    camera.position.y = -mouse.y * 1.5 - scrollY * 0.004;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
})();
