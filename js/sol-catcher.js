// ============================================================
//  sol-catcher.js — "Catch the SOL" mini-game (Three.js)
//  Floating 3D SOL coins drift across the canvas.
//  Click a coin to catch it (+1 score, particle burst).
//  High score saved to localStorage.
// ============================================================

'use strict';

(function initSolCatcher() {

  document.addEventListener('DOMContentLoaded', () => {

    const canvas    = document.getElementById('solGameCanvas');
    const scoreEl   = document.getElementById('solGameScore');
    const bestEl    = document.getElementById('solGameBest');
    const resetBtn  = document.getElementById('solGameReset');

    if (!canvas || typeof THREE === 'undefined') return;

    // ── Scene / camera / renderer ────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha:     true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Lights ───────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const keyLight = new THREE.PointLight(0x9c7dff, 1.4, 50);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x00e5c8, 1.0, 50);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    // ── Score state ──────────────────────────────────────────
    let score = 0;
    let best  = parseInt(localStorage.getItem('solCatcherBest') || '0', 10);
    bestEl.textContent = best;

    function setScore(n) {
      score = n;
      scoreEl.textContent = score;
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        localStorage.setItem('solCatcherBest', best);
      }
    }

    // ── Coin factory ─────────────────────────────────────────
    // A SOL coin = a thin cylinder with a glowing gradient material.
    const coinGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.14, 36);
    coinGeom.rotateX(Math.PI / 2); // face the camera

    const coinPalette = [0x9c7dff, 0x6450ff, 0x00e5c8, 0xff4d8d];

    const coins = [];

    function spawnCoin() {
      const color = coinPalette[Math.floor(Math.random() * coinPalette.length)];
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.85,
        roughness: 0.25,
        emissive:  color,
        emissiveIntensity: 0.35
      });

      const coin = new THREE.Mesh(coinGeom, mat);

      // Spawn from the left edge, random Y, random Z depth
      coin.position.set(
        -10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 2
      );

      // Velocity: drift rightward, with slight vertical wobble
      coin.userData.vx     = 0.025 + Math.random() * 0.04;
      coin.userData.vy     = (Math.random() - 0.5) * 0.01;
      coin.userData.spin   = (Math.random() - 0.5) * 0.05 + 0.02;
      coin.userData.bornAt = performance.now();

      scene.add(coin);
      coins.push(coin);
    }

    // ── Particle burst on catch ──────────────────────────────
    const bursts = [];

    function burst(position, color) {
      const count = 30;
      const positions = new Float32Array(count * 3);
      const velocities = [];

      for (let i = 0; i < count; i++) {
        positions[i * 3]     = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;

        velocities.push({
          x: (Math.random() - 0.5) * 0.25,
          y: (Math.random() - 0.5) * 0.25,
          z: (Math.random() - 0.5) * 0.25
        });
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.PointsMaterial({
        color,
        size: 0.12,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const points = new THREE.Points(geom, mat);
      points.userData.velocities = velocities;
      points.userData.life       = 0;
      scene.add(points);
      bursts.push(points);
    }

    // ── Click → raycast → catch ──────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(coins);

      if (hits.length > 0) {
        const hit = hits[0].object;
        burst(hit.position.clone(), hit.material.color.getHex());
        scene.remove(hit);
        hit.material.dispose();
        coins.splice(coins.indexOf(hit), 1);
        setScore(score + 1);
      }
    });

    // ── Reset button ─────────────────────────────────────────
    resetBtn.addEventListener('click', () => {
      setScore(0);
      // Clear any leftover coins
      coins.forEach(c => {
        scene.remove(c);
        c.material.dispose();
      });
      coins.length = 0;
    });

    // ── Animation loop ───────────────────────────────────────
    let lastSpawn = 0;

    function animate(now) {
      // Spawn cadence — gets a touch faster as score climbs
      const spawnInterval = Math.max(450, 1100 - score * 18);
      if (now - lastSpawn > spawnInterval) {
        spawnCoin();
        lastSpawn = now;
      }

      // Update coins
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.position.x += c.userData.vx;
        c.position.y += c.userData.vy;
        c.rotation.z += c.userData.spin;

        // Despawn if it drifts off the right edge
        if (c.position.x > 11) {
          scene.remove(c);
          c.material.dispose();
          coins.splice(i, 1);
        }
      }

      // Update particle bursts
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
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });
})();
