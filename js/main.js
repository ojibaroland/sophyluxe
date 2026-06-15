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

// =============================================
// 3. LUXURY PERFUME BOTTLE — rectangular flat-panel design
// =============================================
(function initPerfumeBottle() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  let W = canvas.offsetWidth || 560;
  let H = canvas.offsetHeight || 680;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 50);
  camera.position.set(0, 0.3, 5.5);
  camera.lookAt(0, 0.1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);

  // --- Materials ---
  const glassMat = new THREE.MeshPhongMaterial({
    color: 0x0a031c,
    specular: 0xffffff,
    shininess: 260,
    transparent: true,
    opacity: 0.80,
    side: THREE.DoubleSide,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xC9A84C,
    metalness: 1.0,
    roughness: 0.10,
  });

  const liquidMat = new THREE.MeshPhongMaterial({
    color: 0x45108a,
    specular: 0x9966ff,
    shininess: 100,
    transparent: true,
    opacity: 0.60,
  });

  const edgeLineMat = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.75 });
  const edgeLineGold = new THREE.LineBasicMaterial({ color: 0xF0D080, transparent: true, opacity: 0.55 });

  // --- Helper: add edge lines ---
  function addEdges(geom, mat, parent, offsetY) {
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geom), mat);
    if (offsetY !== undefined) lines.position.y = offsetY;
    parent.add(lines);
  }

  // === GLASS BODY — flat rectangular panel like luxury perfume ===
  const bodyGeom = new THREE.BoxGeometry(1.18, 2.72, 0.50);
  const bodyMesh = new THREE.Mesh(bodyGeom, glassMat);
  group.add(bodyMesh);
  addEdges(new THREE.BoxGeometry(1.19, 2.73, 0.51), edgeLineMat, group);

  // === DARK LIQUID VISIBLE THROUGH GLASS ===
  const liquidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.86, 2.32, 0.22), liquidMat);
  liquidMesh.position.z = 0.02;
  group.add(liquidMesh);

  // === GOLD CORNER PILLARS (thin vertical strips on edges) ===
  const pillarGeom = new THREE.BoxGeometry(0.045, 2.72, 0.045);
  const pillarPositions = [
    [-0.59, 0, 0.25], [0.59, 0, 0.25],
    [-0.59, 0, -0.25], [0.59, 0, -0.25]
  ];
  pillarPositions.forEach(([x, y, z]) => {
    const p = new THREE.Mesh(pillarGeom, goldMat);
    p.position.set(x, y, z);
    group.add(p);
  });

  // === GOLD BASE PLATE ===
  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.10, 0.60), goldMat);
  basePlate.position.y = -1.41;
  group.add(basePlate);

  // === NECK — narrow rectangular connector ===
  const neckMesh = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.30, 0.28), glassMat);
  neckMesh.position.y = 1.51;
  group.add(neckMesh);
  addEdges(new THREE.BoxGeometry(0.47, 0.31, 0.29), edgeLineMat, group);
  // (workaround: add manually at neck position)
  const neckEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.47, 0.31, 0.29)),
    edgeLineMat
  );
  neckEdge.position.y = 1.51;
  group.add(neckEdge);

  // === GOLD NECK RING ===
  const neckRing = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.055, 40), goldMat);
  neckRing.position.y = 1.38;
  group.add(neckRing);

  // === ATOMIZER PUMP PLATFORM (circular, sits on neck) ===
  const atomizerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.215, 0.11, 40), goldMat);
  atomizerBase.position.y = 1.725;
  group.add(atomizerBase);

  // === SPRAY NOZZLE (horizontal gold tube pointing right) ===
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.56, 12), goldMat);
  nozzle.rotation.z = Math.PI / 2;
  nozzle.position.set(0.34, 1.725, 0);
  group.add(nozzle);

  // Nozzle tip sphere
  const nozzleTip = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 10), goldMat);
  nozzleTip.position.set(0.63, 1.725, 0);
  group.add(nozzleTip);

  // === GOLD CAP — elegant tall rectangular ===
  const capMesh = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.90, 0.35), goldMat);
  capMesh.position.y = 2.265;
  group.add(capMesh);

  const capEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.51, 0.91, 0.36)),
    edgeLineGold
  );
  capEdge.position.y = 2.265;
  group.add(capEdge);

  // === LABEL PLATE (subtle gold engraving on front) ===
  const labelGeom = new THREE.PlaneGeometry(0.75, 0.62);
  const label = new THREE.Mesh(labelGeom, new THREE.MeshStandardMaterial({
    color: 0xC9A84C, metalness: 0.4, roughness: 0.35, transparent: true, opacity: 0.18
  }));
  label.position.set(0, -0.12, 0.26);
  group.add(label);

  const labelEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(labelGeom),
    new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.65 })
  );
  labelEdge.position.copy(label.position);
  labelEdge.position.z += 0.001;
  group.add(labelEdge);

  // === GROUND GLOW ===
  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 64),
    new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.065, side: THREE.DoubleSide })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -1.47;
  scene.add(glow);

  // === LIGHTING ===
  scene.add(new THREE.AmbientLight(0x1a0840, 5));

  const key = new THREE.DirectionalLight(0xF5E0A0, 5.5);
  key.position.set(4, 6, 4);
  scene.add(key);

  // Side lights to hit flat glass panels dramatically
  const sideL = new THREE.PointLight(0xF0D080, 5, 14);
  sideL.position.set(-4, 0.5, 1.5);
  scene.add(sideL);

  const sideR = new THREE.PointLight(0xF0D080, 4.5, 14);
  sideR.position.set(4, 0.5, 1.5);
  scene.add(sideR);

  const fill = new THREE.PointLight(0x2808a0, 3.5, 18);
  fill.position.set(-3, -1, -1);
  scene.add(fill);

  const rim = new THREE.PointLight(0xC9A84C, 6, 14);
  rim.position.set(0, 2, -5);
  scene.add(rim);

  const orbit = new THREE.PointLight(0xF0D080, 4.5, 12);
  scene.add(orbit);

  // === SCROLL + MOUSE ===
  let autoY = 0, scrollY = 0;
  let mTX = 0, mTY = 0, mCX = 0, mCY = 0, clk = 0;

  document.addEventListener('mousemove', e => {
    mTY = (e.clientX / innerWidth - 0.5) * 0.45;
    mTX = (e.clientY / innerHeight - 0.5) * 0.22;
  });

  ScrollTrigger.create({
    trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5,
    onUpdate: s => { scrollY = s.progress * Math.PI * 3.5; }
  });

  group.position.y = -0.15;

  (function loop() {
    requestAnimationFrame(loop);
    clk += 0.012;
    autoY += 0.0035;
    mCX += (mTX - mCX) * 0.04;
    mCY += (mTY - mCY) * 0.04;

    group.rotation.y = autoY + scrollY + mCY;
    group.rotation.x = mCX;
    group.position.y = -0.15 + Math.sin(clk * 0.7) * 0.09;

    orbit.position.x = Math.cos(clk * 0.55) * 5;
    orbit.position.z = Math.sin(clk * 0.55) * 5;
    orbit.position.y = 1.8 + Math.sin(clk * 0.3) * 1.2;

    glow.material.opacity = 0.045 + Math.sin(clk * 0.4) * 0.02;

    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    if (!W || !H) return;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });
})();

// =============================================
// 4. WIG DISPLAY — bone straight full wig, drag + scroll rotation
// =============================================
(function initWigDisplay() {
  const canvas = document.getElementById('wig-canvas');
  if (!canvas) return;

  let W = canvas.offsetWidth || 500;
  let H = canvas.offsetHeight || 620;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 50);
  camera.position.set(0, 0.4, 5.5);
  camera.lookAt(0, -0.5, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const group = new THREE.Group();
  scene.add(group);

  // Head ellipsoid radii (sphere r=0.8, scaled 0.88, 1.12, 0.84)
  const RX = 0.8 * 0.88;  // 0.704
  const RY = 0.8 * 1.12;  // 0.896
  const RZ = 0.8 * 0.84;  // 0.672
  const HEAD_CY = 0.4;    // head center y

  // === MANNEQUIN HEAD ===
  const headMat = new THREE.MeshStandardMaterial({ color: 0xd4c4b0, roughness: 0.68, metalness: 0 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.8, 40, 30), headMat);
  head.scale.set(0.88, 1.12, 0.84);
  head.position.y = HEAD_CY;
  group.add(head);

  // === HAIR CAP ===
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x070707,
    metalness: 0.07,
    roughness: 0.28,
    side: THREE.FrontSide,
  });
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.82, 40, 22, 0, Math.PI * 2, 0, Math.PI * 0.54),
    hairMat
  );
  cap.scale.set(0.88, 1.12, 0.84);
  cap.position.y = HEAD_CY;
  group.add(cap);

  // === BONE STRAIGHT HAIR — multi-ring dense coverage ===
  // Each ring: [normalized radius 0-1, strand count]
  const rings = [
    [0.18, 6 ],
    [0.34, 14],
    [0.52, 22],
    [0.68, 30],
    [0.82, 40],
    [0.94, 52],
  ];

  rings.forEach(([rNorm, count]) => {
    for (let i = 0; i < count; i++) {
      const jitter = (Math.random() - 0.5) * (Math.PI * 2 / count) * 0.6;
      const angle = (i / count) * Math.PI * 2 + jitter;

      // Start position on ellipsoid surface
      const sx = Math.cos(angle) * rNorm * RX;
      const sz = Math.sin(angle) * rNorm * RZ;

      // Find y on ellipsoid surface (upper hemisphere)
      const underRoot = Math.max(0, 1 - (sx / RX) ** 2 - (sz / RZ) ** 2);
      const sy = HEAD_CY + Math.sqrt(underRoot) * RY + 0.005;

      // Skip strands that would start below ear level
      if (sy < HEAD_CY - 0.05) continue;

      // BONE STRAIGHT: fall perfectly vertically
      // x and z stay constant — only y changes
      const hairLen = 3.4 + Math.random() * 0.4;
      const ey = sy - hairLen;

      // Microscopic natural variation (not visible but prevents z-fighting)
      const v = 0.006;
      const ex = sx + (Math.random() - 0.5) * v;
      const ez = sz + (Math.random() - 0.5) * v;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sx, sy, sz),
        new THREE.Vector3(sx, sy - hairLen * 0.5, sz),
        new THREE.Vector3(ex, ey, ez),
      ]);

      const r = 0.006 + Math.random() * 0.005;
      group.add(new THREE.Mesh(
        new THREE.TubeGeometry(curve, 6, r, 4, false),
        hairMat
      ));
    }
  });

  // === NECK ===
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4c4b0, roughness: 0.7, metalness: 0 });
  group.add(Object.assign(
    new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.30, 0.5, 20), skinMat),
    { position: new THREE.Vector3(0, -0.58, 0) }
  ));

  // === BUST ===
  group.add(Object.assign(
    new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.26, 20), skinMat),
    { position: new THREE.Vector3(0, -0.88, 0) }
  ));

  // === GROUND GLOW ===
  const wigGlow = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 64),
    new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.055, side: THREE.DoubleSide })
  );
  wigGlow.rotation.x = -Math.PI / 2;
  wigGlow.position.y = -1.02;
  scene.add(wigGlow);

  // === LIGHTING ===
  scene.add(new THREE.AmbientLight(0x1a0840, 5));

  const key = new THREE.DirectionalLight(0xF5E0A0, 5.5);
  key.position.set(3, 6, 4);
  scene.add(key);

  // Side lights to reveal hair gloss
  const sideL = new THREE.PointLight(0xF0D080, 4, 14);
  sideL.position.set(-3.5, 1, 1);
  scene.add(sideL);

  const sideR = new THREE.PointLight(0xF0D080, 4, 14);
  sideR.position.set(3.5, 1, 1);
  scene.add(sideR);

  const rim = new THREE.PointLight(0xC9A84C, 5.5, 12);
  rim.position.set(0, 3, -4.5);
  scene.add(rim);

  const wigOrbit = new THREE.PointLight(0xF0D080, 4, 11);
  scene.add(wigOrbit);

  // === DRAG / TOUCH ROTATION WITH MOMENTUM ===
  let isDragging = false;
  let prevDragX = 0;
  let dragVel = 0;      // momentum velocity
  let manualRotY = 0;   // accumulated drag rotation

  // Mouse
  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    prevDragX = e.clientX;
    dragVel = 0;
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevDragX;
    dragVel = dx * 0.012;
    manualRotY += dragVel;
    prevDragX = e.clientX;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch / swipe
  canvas.addEventListener('touchstart', e => {
    isDragging = true;
    prevDragX = e.touches[0].clientX;
    dragVel = 0;
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - prevDragX;
    dragVel = dx * 0.012;
    manualRotY += dragVel;
    prevDragX = e.touches[0].clientX;
    e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { isDragging = false; });

  // === SCROLL ROTATION ===
  let scrollRotY = 0;
  ScrollTrigger.create({
    trigger: '#wig-showcase',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,
    onUpdate: s => { scrollRotY = s.progress * Math.PI * 3; }
  });

  let autoY = 0, clk = 0;

  (function loop() {
    requestAnimationFrame(loop);
    clk += 0.011;

    // Slow auto-spin (pauses feel when user drags)
    if (!isDragging) {
      autoY += 0.003;
      // Apply momentum and decay
      manualRotY += dragVel;
      dragVel *= 0.91;
    }

    group.rotation.y = autoY + scrollRotY + manualRotY;
    group.position.y = Math.sin(clk * 0.6) * 0.055;

    wigOrbit.position.x = Math.cos(clk * 0.5) * 4.5;
    wigOrbit.position.z = Math.sin(clk * 0.5) * 4.5;
    wigOrbit.position.y = 2 + Math.sin(clk * 0.28) * 1.2;

    wigGlow.material.opacity = 0.04 + Math.sin(clk * 0.4) * 0.015;

    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    if (!W || !H) return;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });
})();

// =============================================
// 5. Gold particle system
// =============================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#C9A84C', '#F0D080', '#8B6914', '#d4b86a'];
  const particles = [];

  function mkP() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 5,
      r: 0.4 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.28 - Math.random() * 0.85,
      a: 0.35 + Math.random() * 0.65,
      color: colors[Math.floor(Math.random() * colors.length)],
      fade: 0.002 + Math.random() * 0.004
    };
  }

  for (let i = 0; i < 90; i++) {
    const p = mkP(); p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx; p.y += p.vy; p.a -= p.fade;
      if (p.a <= 0 || p.y < -8) particles[i] = mkP();
    });
    requestAnimationFrame(loop);
  })();
})();

// =============================================
// 6. Nav scroll effect
// =============================================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
});

// =============================================
// 7. Render product cards
// =============================================
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

// =============================================
// 8. GSAP Animations
// =============================================
window.addEventListener('load', () => {

  // Hero entrance
  gsap.from('.hero-title',    { y: 90, opacity: 0, duration: 1.5, delay: 0.3, ease: 'power4.out' });
  gsap.from('.hero-subtitle', { y: 50, opacity: 0, duration: 1.2, delay: 0.65, ease: 'power3.out' });
  gsap.from('.btn-group',     { y: 35, opacity: 0, duration: 1.0, delay: 0.95, ease: 'power3.out' });

  // Wig showcase entrance
  gsap.from('.wig-content', {
    x: -80, opacity: 0, duration: 1.3,
    scrollTrigger: { trigger: '#wig-showcase', start: 'top 75%' }
  });
  gsap.from('.wig-canvas-wrap', {
    x: 80, opacity: 0, duration: 1.3, delay: 0.15,
    scrollTrigger: { trigger: '#wig-showcase', start: 'top 75%' }
  });

  // Featured section
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
    { x: -100, y: 0 }, { x: 100, y: 0 },
    { x: 0, y: 80 },   { x: -80, y: 0 },
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

  // About section
  gsap.from('#about .section-heading', {
    y: 60, opacity: 0, duration: 1.3,
    scrollTrigger: { trigger: '#about', start: 'top 80%' }
  });
  gsap.from('.about-lead', {
    y: 40, opacity: 0, duration: 1.1, delay: 0.2,
    scrollTrigger: { trigger: '#about', start: 'top 80%' }
  });
  gsap.from('.about-pillars .pillar', {
    y: 50, opacity: 0, stagger: 0.18, duration: 1.0, delay: 0.3,
    scrollTrigger: { trigger: '.about-pillars', start: 'top 85%' }
  });
  gsap.from('.about-story', {
    y: 40, opacity: 0, duration: 1.1, delay: 0.1,
    scrollTrigger: { trigger: '.about-story', start: 'top 85%' }
  });

  // Footer
  gsap.from('footer', {
    y: 40, opacity: 0, duration: 1.0,
    scrollTrigger: { trigger: 'footer', start: 'top 90%' }
  });
});
