// =============================================
// SOPHY LUXE — main.js
// =============================================

// 1. Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 3. Three.js Luxury Perfume Bottle
(function initBottle() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  let W = canvas.clientWidth || canvas.offsetWidth || 600;
  let H = canvas.clientHeight || canvas.offsetHeight || 700;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0.2, 6.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ---- BOTTLE GROUP ----
  const bottleGroup = new THREE.Group();
  scene.add(bottleGroup);

  // --- Glass Material (dark luxury tinted glass) ---
  const glassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x0e0420),
    metalness: 0.15,
    roughness: 0.04,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    envMapIntensity: 1.8,
  });

  // --- Gold Material ---
  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xC9A84C),
    metalness: 1.0,
    roughness: 0.12,
    envMapIntensity: 2.0,
  });

  // --- Dark Gold for details ---
  const goldDarkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x8B6914),
    metalness: 1.0,
    roughness: 0.2,
    envMapIntensity: 1.5,
  });

  // ---- BOTTLE BODY (LatheGeometry — luxury perfume silhouette) ----
  // Profile points: Vector2(radius, height) from bottom to top
  const bodyPoints = [
    new THREE.Vector2(0.00, -2.10),
    new THREE.Vector2(0.50, -2.10),
    new THREE.Vector2(0.58, -1.98),
    new THREE.Vector2(0.65, -1.75),
    new THREE.Vector2(0.70, -1.30),
    new THREE.Vector2(0.72, -0.70),
    new THREE.Vector2(0.72,  0.10),
    new THREE.Vector2(0.68,  0.65),
    new THREE.Vector2(0.58,  1.10),
    new THREE.Vector2(0.38,  1.40),
    new THREE.Vector2(0.26,  1.62),
    new THREE.Vector2(0.24,  1.90),
    new THREE.Vector2(0.22,  2.00),
  ];
  const bodyGeom = new THREE.LatheGeometry(bodyPoints, 128);
  const bodyMesh = new THREE.Mesh(bodyGeom, glassMat);
  bodyMesh.castShadow = true;
  bottleGroup.add(bodyMesh);

  // ---- BOTTLE BOTTOM DISC ----
  const bottomGeom = new THREE.CircleGeometry(0.50, 64);
  const bottomMesh = new THREE.Mesh(bottomGeom, glassMat);
  bottomMesh.rotation.x = Math.PI / 2;
  bottomMesh.position.y = -2.10;
  bottleGroup.add(bottomMesh);

  // ---- GOLD BASE RING ----
  const baseRingGeom = new THREE.TorusGeometry(0.52, 0.05, 16, 64);
  const baseRing = new THREE.Mesh(baseRingGeom, goldMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = -2.10;
  bottleGroup.add(baseRing);

  // ---- GOLD SHOULDER RING ----
  const shoulderRingGeom = new THREE.TorusGeometry(0.27, 0.03, 12, 64);
  const shoulderRing = new THREE.Mesh(shoulderRingGeom, goldMat);
  shoulderRing.rotation.x = Math.PI / 2;
  shoulderRing.position.y = 1.62;
  bottleGroup.add(shoulderRing);

  // ---- CAP (LatheGeometry — tall elegant cap) ----
  const capPoints = [
    new THREE.Vector2(0.00, 2.00),
    new THREE.Vector2(0.24, 2.00),
    new THREE.Vector2(0.27, 2.08),
    new THREE.Vector2(0.28, 2.20),
    new THREE.Vector2(0.28, 2.90),
    new THREE.Vector2(0.22, 3.10),
    new THREE.Vector2(0.10, 3.18),
    new THREE.Vector2(0.00, 3.18),
  ];
  const capGeom = new THREE.LatheGeometry(capPoints, 128);
  const capMesh = new THREE.Mesh(capGeom, goldMat);
  capMesh.castShadow = true;
  bottleGroup.add(capMesh);

  // ---- CAP TOP DISC ----
  const capTopGeom = new THREE.CircleGeometry(0.10, 32);
  const capTopMesh = new THREE.Mesh(capTopGeom, goldMat);
  capTopMesh.rotation.x = -Math.PI / 2;
  capTopMesh.position.y = 3.18;
  bottleGroup.add(capTopMesh);

  // ---- LABEL PLATE (front of bottle) ----
  const labelGeom = new THREE.PlaneGeometry(0.95, 0.85);
  const labelMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xC9A84C),
    metalness: 0.6,
    roughness: 0.25,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  });
  const labelMesh = new THREE.Mesh(labelGeom, labelMat);
  labelMesh.position.set(0, -0.35, 0.73);
  bottleGroup.add(labelMesh);

  // ---- LABEL BORDER (thin gold frame) ----
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xC9A84C });
  const labelEdge = new THREE.EdgesGeometry(labelGeom);
  const labelFrame = new THREE.LineSegments(labelEdge, edgeMat);
  labelFrame.position.copy(labelMesh.position);
  labelFrame.position.z += 0.001;
  bottleGroup.add(labelFrame);

  // ---- REFLECTION DISC (ground glow) ----
  const reflGeom = new THREE.CircleGeometry(1.4, 64);
  const reflMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xC9A84C),
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
  });
  const reflMesh = new THREE.Mesh(reflGeom, reflMat);
  reflMesh.rotation.x = -Math.PI / 2;
  reflMesh.position.y = -2.14;
  scene.add(reflMesh);

  // ---- LIGHTING ----
  // Deep ambient
  const ambient = new THREE.AmbientLight(0x1a0840, 3.0);
  scene.add(ambient);

  // Key light — warm gold from upper right
  const keyLight = new THREE.DirectionalLight(0xF0D080, 4.0);
  keyLight.position.set(4, 5, 3);
  keyLight.castShadow = true;
  scene.add(keyLight);

  // Fill light — cool deep purple from left
  const fillLight = new THREE.PointLight(0x3010a0, 3.5, 18);
  fillLight.position.set(-4, 1, 2);
  scene.add(fillLight);

  // Rim light — gold from behind (creates silhouette glow)
  const rimLight = new THREE.PointLight(0xC9A84C, 5.0, 12);
  rimLight.position.set(0, 2, -4);
  scene.add(rimLight);

  // Under light — warm gold lift from below
  const underLight = new THREE.PointLight(0x8B6914, 2.0, 8);
  underLight.position.set(0, -4, 1);
  scene.add(underLight);

  // Orbiting light — circles the bottle
  const orbitLight = new THREE.PointLight(0xF0D080, 3.5, 10);
  scene.add(orbitLight);

  // ---- STARTING POSITION ----
  bottleGroup.position.y = -0.3;
  bottleGroup.rotation.y = -0.3;

  // ---- SCROLL + MOUSE STATE ----
  let autoRotY = -0.3;
  let scrollRotY = 0;
  let mouseTargetX = 0, mouseTargetY = 0;
  let mouseCurrX = 0, mouseCurrY = 0;
  let clock = 0;

  document.addEventListener('mousemove', (e) => {
    mouseTargetY = (e.clientX / window.innerWidth - 0.5) * 0.45;
    mouseTargetX = (e.clientY / window.innerHeight - 0.5) * 0.25;
  });

  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    onUpdate: (self) => {
      scrollRotY = self.progress * Math.PI * 3.5;
    }
  });

  // ---- ANIMATION LOOP ----
  function animate() {
    requestAnimationFrame(animate);
    clock += 0.012;

    // Auto slow spin
    autoRotY += 0.004;

    // Smooth mouse follow
    mouseCurrX += (mouseTargetX - mouseCurrX) * 0.04;
    mouseCurrY += (mouseTargetY - mouseCurrY) * 0.04;

    // Apply rotations
    bottleGroup.rotation.y = autoRotY + scrollRotY + mouseCurrY;
    bottleGroup.rotation.x = mouseCurrX;

    // Floating bob
    bottleGroup.position.y = -0.3 + Math.sin(clock * 0.75) * 0.09;

    // Orbit light circles the bottle
    orbitLight.position.x = Math.cos(clock * 0.6) * 4;
    orbitLight.position.z = Math.sin(clock * 0.6) * 4;
    orbitLight.position.y = 1.5 + Math.sin(clock * 0.3) * 0.8;

    // Pulse the reflection glow subtly
    reflMesh.material.opacity = 0.04 + Math.sin(clock * 0.5) * 0.02;

    renderer.render(scene, camera);
  }
  animate();

  // ---- RESIZE ----
  window.addEventListener('resize', () => {
    W = canvas.clientWidth || canvas.offsetWidth;
    H = canvas.clientHeight || canvas.offsetHeight;
    if (!W || !H) return;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });
})();

// 4. Gold particle system
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero');

  function resize() {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#C9A84C', '#F0D080', '#8B6914', '#d4b96a'];
  const particles = [];

  function mkParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      r: 0.4 + Math.random() * 1.8,
      vx: -0.25 + Math.random() * 0.5,
      vy: -0.25 - Math.random() * 0.85,
      a: 0.4 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      fade: 0.002 + Math.random() * 0.004
    };
  }

  for (let i = 0; i < 90; i++) {
    const p = mkParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx;
      p.y += p.vy;
      p.a -= p.fade;
      if (p.a <= 0 || p.y < -10) particles[i] = mkParticle();
    }
    requestAnimationFrame(loop);
  })();
})();

// 5. Nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// 6. Render product cards
(function renderProducts() {
  const grid = document.getElementById('featured-products');
  if (!grid || typeof products === 'undefined') return;

  grid.innerHTML = products.slice(0, 4).map((p, i) => `
    <div class="product-card" data-index="${i}">
      <div class="card-image">
        <img src="${p.image}" alt="${p.name}"
          onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">
      </div>
      <div class="card-body">
        <span class="card-category">${p.category}</span>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-desc">${p.description}</p>
        <p class="card-price">${p.price}</p>
        <a href="https://wa.me/${p.whatsappNumber}?text=Hi%2C%20I%20want%20to%20order%20${encodeURIComponent(p.name)}"
           class="btn-gold" target="_blank">Buy on WhatsApp</a>
      </div>
    </div>
  `).join('');
})();

// 7. GSAP animations (run after DOM + products rendered)
window.addEventListener('load', () => {
  // Hero entrance
  gsap.from('.hero-title',    { y: 90, opacity: 0, duration: 1.5, delay: 0.3, ease: 'power4.out' });
  gsap.from('.hero-subtitle', { y: 50, opacity: 0, duration: 1.2, delay: 0.6, ease: 'power3.out' });
  gsap.from('.btn-group',     { y: 35, opacity: 0, duration: 1.0, delay: 0.9, ease: 'power3.out' });

  // Section heading shimmer
  gsap.from('#featured .section-heading', {
    y: 60, opacity: 0, duration: 1.3,
    scrollTrigger: { trigger: '#featured', start: 'top 80%' }
  });
  gsap.from('#featured .section-subheading', {
    y: 30, opacity: 0, duration: 1.0, delay: 0.2,
    scrollTrigger: { trigger: '#featured', start: 'top 80%' }
  });

  // Product cards — alternating directions
  const dirs = [
    { x: -100, y: 0 },
    { x: 100,  y: 0 },
    { x: 0,    y: 80 },
    { x: -80,  y: 0 },
  ];
  document.querySelectorAll('.product-card').forEach((card, i) => {
    const d = dirs[i] || { x: 0, y: 80 };
    gsap.from(card, {
      x: d.x, y: d.y, opacity: 0,
      duration: 1.1, delay: i * 0.18, ease: 'power3.out',
      scrollTrigger: { trigger: '#featured-products', start: 'top 80%' }
    });
  });

  // Stats count-up
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '+';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2.5, ease: 'power2.out',
      scrollTrigger: { trigger: '#stats', start: 'top 80%', once: true },
      onUpdate() { el.textContent = Math.round(obj.val) + suffix; }
    });
  });

  // Brand story
  gsap.from('#brand-story .section-heading', {
    y: 50, opacity: 0, duration: 1.2,
    scrollTrigger: { trigger: '#brand-story', start: 'top 80%' }
  });
  gsap.from('.brand-story-text', {
    y: 40, opacity: 0, duration: 1.0, delay: 0.2,
    scrollTrigger: { trigger: '#brand-story', start: 'top 80%' }
  });
  gsap.from('#brand-story .btn-gold', {
    y: 30, opacity: 0, duration: 0.9, delay: 0.4,
    scrollTrigger: { trigger: '#brand-story', start: 'top 80%' }
  });

  // Footer
  gsap.from('footer', {
    y: 40, opacity: 0, duration: 1.0,
    scrollTrigger: { trigger: 'footer', start: 'top 90%' }
  });
});
