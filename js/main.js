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
gsap.registerPlugin(ScrollTrigger);

// =============================================
// Render product cards — runs on DOMContentLoaded
// =============================================
document.addEventListener('DOMContentLoaded', () => {
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
});

// Nav scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
});

// =============================================
// Helper: get canvas dimensions reliably
// =============================================
function canvasSize(canvas, fallbackW, fallbackH) {
  const rect = canvas.getBoundingClientRect();
  const W = rect.width  > 10 ? rect.width  : (canvas.offsetWidth  || fallbackW);
  const H = rect.height > 10 ? rect.height : (canvas.offsetHeight || fallbackH);
  return [Math.max(W, fallbackW * 0.5), Math.max(H, fallbackH * 0.5)];
}

// =============================================
// PERFUME BOTTLE — rectangular flat-panel design
// =============================================
function initPerfumeBottle() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  let [W, H] = canvasSize(canvas, 560, 680);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 50);
  camera.position.set(0, 0.3, 5.5);
  camera.lookAt(0, 0.1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);

  const glassMat = new THREE.MeshPhongMaterial({
    color: 0x0a031c, specular: 0xffffff, shininess: 260,
    transparent: true, opacity: 0.80, side: THREE.DoubleSide,
  });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 1.0, roughness: 0.10 });
  const liquidMat = new THREE.MeshPhongMaterial({
    color: 0x45108a, specular: 0x9966ff, shininess: 100, transparent: true, opacity: 0.60,
  });
  const edgeGold = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.75 });
  const edgeGoldL = new THREE.LineBasicMaterial({ color: 0xF0D080, transparent: true, opacity: 0.55 });

  // Glass body
  const bodyGeom = new THREE.BoxGeometry(1.18, 2.72, 0.50);
  group.add(new THREE.Mesh(bodyGeom, glassMat));
  group.add(Object.assign(
    new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.19, 2.73, 0.51)), edgeGold)
  ));

  // Dark liquid inside
  const liq = new THREE.Mesh(new THREE.BoxGeometry(0.86, 2.32, 0.22), liquidMat);
  liq.position.z = 0.02; group.add(liq);

  // Gold corner pillars
  [[-0.59,0,0.25],[0.59,0,0.25],[-0.59,0,-0.25],[0.59,0,-0.25]].forEach(([x,y,z]) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.045, 2.72, 0.045), goldMat);
    p.position.set(x,y,z); group.add(p);
  });

  // Base plate
  const bp = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.10, 0.60), goldMat);
  bp.position.y = -1.41; group.add(bp);

  // Neck
  const nk = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.30, 0.28), glassMat);
  nk.position.y = 1.51; group.add(nk);
  const nkE = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.47,0.31,0.29)), edgeGold);
  nkE.position.y = 1.51; group.add(nkE);

  // Neck ring
  const nr = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.055,40), goldMat);
  nr.position.y = 1.38; group.add(nr);

  // Atomizer platform
  const ap = new THREE.Mesh(new THREE.CylinderGeometry(0.195,0.215,0.11,40), goldMat);
  ap.position.y = 1.725; group.add(ap);

  // Spray nozzle
  const nz = new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.56,12), goldMat);
  nz.rotation.z = Math.PI/2; nz.position.set(0.34,1.725,0); group.add(nz);
  const nt = new THREE.Mesh(new THREE.SphereGeometry(0.048,12,10), goldMat);
  nt.position.set(0.63,1.725,0); group.add(nt);

  // Cap
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.50,0.90,0.35), goldMat);
  cap.position.y = 2.265; group.add(cap);
  const capE = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.51,0.91,0.36)), edgeGoldL);
  capE.position.y = 2.265; group.add(capE);

  // Label
  const lgeo = new THREE.PlaneGeometry(0.75, 0.62);
  const lbl = new THREE.Mesh(lgeo, new THREE.MeshStandardMaterial({
    color: 0xC9A84C, metalness: 0.4, roughness: 0.35, transparent: true, opacity: 0.18
  }));
  lbl.position.set(0,-0.12,0.26); group.add(lbl);
  const lblE = new THREE.LineSegments(new THREE.EdgesGeometry(lgeo),
    new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.65 }));
  lblE.position.set(0,-0.12,0.261); group.add(lblE);

  // Ground glow
  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(1.4,64),
    new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.065, side: THREE.DoubleSide })
  );
  glow.rotation.x = -Math.PI/2; glow.position.y = -1.47; scene.add(glow);

  // Lighting
  scene.add(new THREE.AmbientLight(0x1a0840, 5));
  const key = new THREE.DirectionalLight(0xF5E0A0, 5.5); key.position.set(4,6,4); scene.add(key);
  const sL = new THREE.PointLight(0xF0D080,5,14); sL.position.set(-4,0.5,1.5); scene.add(sL);
  const sR = new THREE.PointLight(0xF0D080,4.5,14); sR.position.set(4,0.5,1.5); scene.add(sR);
  const fill = new THREE.PointLight(0x2808a0,3.5,18); fill.position.set(-3,-1,-1); scene.add(fill);
  const rim = new THREE.PointLight(0xC9A84C,6,14); rim.position.set(0,2,-5); scene.add(rim);
  const orbit = new THREE.PointLight(0xF0D080,4.5,12); scene.add(orbit);

  let autoY=0, scrollY=0, mTX=0, mTY=0, mCX=0, mCY=0, clk=0;
  document.addEventListener('mousemove', e => {
    mTY = (e.clientX/innerWidth - 0.5) * 0.45;
    mTX = (e.clientY/innerHeight - 0.5) * 0.22;
  });
  ScrollTrigger.create({
    trigger:'body', start:'top top', end:'bottom bottom', scrub:1.5,
    onUpdate: s => { scrollY = s.progress * Math.PI * 3.5; }
  });
  group.position.y = -0.15;

  (function loop() {
    requestAnimationFrame(loop); clk+=0.012; autoY+=0.0035;
    mCX+=(mTX-mCX)*0.04; mCY+=(mTY-mCY)*0.04;
    group.rotation.y = autoY+scrollY+mCY;
    group.rotation.x = mCX;
    group.position.y = -0.15+Math.sin(clk*0.7)*0.09;
    orbit.position.x = Math.cos(clk*0.55)*5;
    orbit.position.z = Math.sin(clk*0.55)*5;
    orbit.position.y = 1.8+Math.sin(clk*0.3)*1.2;
    glow.material.opacity = 0.045+Math.sin(clk*0.4)*0.02;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    [W,H] = canvasSize(canvas,560,680);
    camera.aspect = W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H);
  });
}

// =============================================
// WIG DISPLAY — bone straight full wig, neutral lighting, true black hair
// =============================================
function initWigDisplay() {
  const canvas = document.getElementById('wig-canvas');
  if (!canvas) return;

  let [W, H] = canvasSize(canvas, 500, 620);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 50);
  camera.position.set(0, 0.5, 5.8);
  camera.lookAt(0, -0.2, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const group = new THREE.Group();
  scene.add(group);

  const RX = 0.704, RY = 0.896, RZ = 0.672, CY = 0.4;

  // === MANNEQUIN HEAD — neutral skin, not gold ===
  const headMat = new THREE.MeshPhongMaterial({
    color: 0xc8a882, specular: 0x111111, shininess: 18
  });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.8, 44, 32), headMat);
  head.scale.set(0.88, 1.13, 0.84);
  head.position.y = CY;
  group.add(head);

  // === HAIR CAP — jet black dome ===
  const hairCapMat = new THREE.MeshPhongMaterial({
    color: 0x030303, specular: 0x1a1a1a, shininess: 55, side: THREE.FrontSide
  });
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.83, 44, 26, 0, Math.PI * 2, 0, Math.PI * 0.52),
    hairCapMat
  );
  hairCap.scale.set(0.88, 1.13, 0.84);
  hairCap.position.y = CY;
  group.add(hairCap);

  // === BONE STRAIGHT HAIR ===
  const hairMat = new THREE.MeshPhongMaterial({
    color: 0x060606,
    specular: 0x2a2a2a,
    shininess: 100,
    side: THREE.DoubleSide,
  });

  // SOLID HAIR CURTAINS — flat planes arranged radially, completely hide neck/gaps
  // Three layers: inner hugs head, mid, outer gives volume
  const curtainLayers = [
    { pr: 0.905, count: 72, len: 4.0 },
    { pr: 0.960, count: 80, len: 4.15 },
    { pr: 1.020, count: 88, len: 4.25 },
  ];

  curtainLayers.forEach(({ pr, count, len }, li) => {
    const circum = 2 * Math.PI * pr * RX;
    const curtainW = (circum / count) * 1.45; // 45% overlap = no gaps

    for (let i = 0; i < count; i++) {
      const angleOffset = (li * Math.PI) / count; // stagger layers
      const angle = (i / count) * Math.PI * 2 + angleOffset;

      const px = Math.cos(angle) * pr * RX;
      const pz = Math.sin(angle) * pr * RZ;

      // Start Y: where this strand exits the cap (surface of ellipsoid at this radius)
      const underRoot = Math.max(0, 1 - pr * pr);
      const startY = CY + Math.sqrt(underRoot) * RY + 0.01;

      const lenVar = Math.random() * 0.3;
      const centerY = startY - (len + lenVar) / 2;

      const geom = new THREE.PlaneGeometry(curtainW, len + lenVar, 1, 1);
      const mesh = new THREE.Mesh(geom, hairMat);
      mesh.position.set(px, centerY, pz);
      // Face the plane outward (away from center axis)
      mesh.lookAt(new THREE.Vector3(0, centerY, 0));
      group.add(mesh);
    }
  });

  // Fine tube strands layered ON TOP of curtains — adds realistic strand texture
  const strandMat = new THREE.MeshPhongMaterial({
    color: 0x060606, specular: 0x282828, shininess: 95, side: THREE.DoubleSide
  });
  for (let i = 0; i < 160; i++) {
    const angle = (i / 160) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
    const pr = 0.88 + Math.random() * 0.18;
    const sx = Math.cos(angle) * pr * RX;
    const sz = Math.sin(angle) * pr * RZ;
    const underRoot = Math.max(0, 1 - pr * pr);
    const sy = CY + Math.sqrt(underRoot) * RY + 0.005;
    const hairLen = 3.9 + Math.random() * 0.4;
    const ey = sy - hairLen;

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sx, sy, sz),
      new THREE.Vector3(sx, sy - hairLen * 0.5, sz),
      new THREE.Vector3(sx, ey, sz),
    ]);
    const r = 0.003 + Math.random() * 0.002;
    group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 4, r, 4, false), strandMat));
  }

  // === NECK + BUST ===
  const skinMat = new THREE.MeshPhongMaterial({ color: 0xc8a882, specular: 0x0a0a0a, shininess: 12 });
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.30, 0.52, 20), skinMat);
  neck.position.y = -0.60; group.add(neck);
  const bust = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.26, 20), skinMat);
  bust.position.y = -0.90; group.add(bust);

  // === GROUND GLOW ===
  const wigGlow = new THREE.Mesh(
    new THREE.CircleGeometry(1.5, 64),
    new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
  );
  wigGlow.rotation.x = -Math.PI / 2; wigGlow.position.y = -1.05; scene.add(wigGlow);

  // === LIGHTING — bright studio, reveals black hair sheen ===
  scene.add(new THREE.AmbientLight(0x222222, 12));

  // Strong key light from upper-right — main highlight on hair
  const wKey = new THREE.DirectionalLight(0xffffff, 7.0);
  wKey.position.set(3.5, 6, 3); scene.add(wKey);

  // Front fill — stops face going fully black
  const wFront = new THREE.PointLight(0xffffff, 4.0, 14);
  wFront.position.set(0, 2, 5); scene.add(wFront);

  // Top light — crown sheen
  const wTop = new THREE.PointLight(0xffffff, 4.5, 12);
  wTop.position.set(0, 6, 1); scene.add(wTop);

  // Left fill — reveals left side hair shape
  const wFill = new THREE.PointLight(0xaabbee, 3.5, 18);
  wFill.position.set(-4, 1, 2); scene.add(wFill);

  // Gold rim from behind — silhouette glow on hair edges
  const wRim = new THREE.PointLight(0xC9A84C, 3.5, 12);
  wRim.position.set(0, 3.5, -5); scene.add(wRim);

  // Orbiting white highlight
  const wOrbit = new THREE.PointLight(0xffffff, 3.0, 10);
  scene.add(wOrbit);

  // === DRAG / TOUCH ROTATION WITH MOMENTUM ===
  let isDragging = false, prevDragX = 0, dragVel = 0, manualRotY = 0;

  canvas.addEventListener('mousedown', e => { isDragging = true; prevDragX = e.clientX; dragVel = 0; });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevDragX; dragVel = dx * 0.012; manualRotY += dragVel; prevDragX = e.clientX;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('touchstart', e => {
    isDragging = true; prevDragX = e.touches[0].clientX; dragVel = 0; e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - prevDragX; dragVel = dx * 0.012;
    manualRotY += dragVel; prevDragX = e.touches[0].clientX; e.preventDefault();
  }, { passive: false });
  canvas.addEventListener('touchend', () => { isDragging = false; });

  // === SCROLL ROTATION ===
  let scrollRotY = 0;
  ScrollTrigger.create({
    trigger: '#wig-showcase', start: 'top bottom', end: 'bottom top', scrub: 1.5,
    onUpdate: s => { scrollRotY = s.progress * Math.PI * 3; }
  });

  let autoY = 0, clk = 0;
  (function loop() {
    requestAnimationFrame(loop); clk += 0.011;
    if (!isDragging) { autoY += 0.003; manualRotY += dragVel; dragVel *= 0.91; }
    group.rotation.y = autoY + scrollRotY + manualRotY;
    group.position.y = Math.sin(clk * 0.55) * 0.05;
    wOrbit.position.x = Math.cos(clk * 0.45) * 4;
    wOrbit.position.z = Math.sin(clk * 0.45) * 4;
    wOrbit.position.y = 2.5;
    wigGlow.material.opacity = 0.038 + Math.sin(clk * 0.4) * 0.012;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    [W, H] = canvasSize(canvas, 500, 620);
    camera.aspect = W / H; camera.updateProjectionMatrix(); renderer.setSize(W, H);
  });
}

// =============================================
// GOLD PARTICLE SYSTEM
// =============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  if (!hero) return;

  function resize() { canvas.width=hero.offsetWidth; canvas.height=hero.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const colors=['#C9A84C','#F0D080','#8B6914','#d4b86a'];
  const particles=[];
  function mkP() {
    return { x:Math.random()*canvas.width, y:canvas.height+5, r:0.4+Math.random()*1.8,
      vx:(Math.random()-0.5)*0.4, vy:-0.28-Math.random()*0.85,
      a:0.35+Math.random()*0.65, color:colors[Math.floor(Math.random()*colors.length)],
      fade:0.002+Math.random()*0.004 };
  }
  for(let i=0;i<90;i++){ const p=mkP(); p.y=Math.random()*canvas.height; particles.push(p); }
  (function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach((p,i)=>{
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color; ctx.globalAlpha=p.a; ctx.fill(); ctx.globalAlpha=1;
      p.x+=p.vx; p.y+=p.vy; p.a-=p.fade;
      if(p.a<=0||p.y<-8) particles[i]=mkP();
    });
    requestAnimationFrame(loop);
  })();
}

// =============================================
// GSAP ANIMATIONS
// =============================================
function initGSAP() {
  gsap.from('.hero-title',    { y:90, opacity:0, duration:1.5, delay:0.3,  ease:'power4.out' });
  gsap.from('.hero-subtitle', { y:50, opacity:0, duration:1.2, delay:0.65, ease:'power3.out' });
  gsap.from('.btn-group',     { y:35, opacity:0, duration:1.0, delay:0.95, ease:'power3.out' });

  gsap.from('.wig-content',     { x:-80, opacity:0, duration:1.3, scrollTrigger:{trigger:'#wig-showcase',start:'top 75%'} });
  gsap.from('.wig-canvas-wrap', { x:80,  opacity:0, duration:1.3, delay:0.15, scrollTrigger:{trigger:'#wig-showcase',start:'top 75%'} });

  gsap.from('#featured .section-heading',    { y:60, opacity:0, duration:1.3, scrollTrigger:{trigger:'#featured',start:'top 80%'} });
  gsap.from('#featured .section-subheading', { y:30, opacity:0, duration:1.0, delay:0.2, scrollTrigger:{trigger:'#featured',start:'top 80%'} });

  const dirs=[{x:-100,y:0},{x:100,y:0},{x:0,y:80},{x:-80,y:0}];
  document.querySelectorAll('.product-card').forEach((card,i)=>{
    const d=dirs[i]||{x:0,y:80};
    gsap.from(card,{ x:d.x, y:d.y, opacity:0, duration:1.1, delay:i*0.18, ease:'power3.out',
      scrollTrigger:{trigger:'#featured-products',start:'top 80%'} });
  });

  document.querySelectorAll('.stat-number').forEach(el=>{
    const target=parseInt(el.dataset.target), suffix=el.dataset.suffix||'+', obj={val:0};
    gsap.to(obj,{ val:target, duration:2.5, ease:'power2.out',
      scrollTrigger:{trigger:'#stats',start:'top 80%',once:true},
      onUpdate(){ el.textContent=Math.round(obj.val)+suffix; } });
  });

  gsap.from('#about .section-heading', { y:60, opacity:0, duration:1.3, scrollTrigger:{trigger:'#about',start:'top 80%'} });
  gsap.from('.about-lead',             { y:40, opacity:0, duration:1.1, delay:0.2, scrollTrigger:{trigger:'#about',start:'top 80%'} });
  gsap.from('.about-pillars .pillar',  { y:50, opacity:0, stagger:0.18, duration:1.0, delay:0.3, scrollTrigger:{trigger:'.about-pillars',start:'top 85%'} });
  gsap.from('.about-story',            { y:40, opacity:0, duration:1.1, delay:0.1, scrollTrigger:{trigger:'.about-story',start:'top 85%'} });
  gsap.from('footer',                  { y:40, opacity:0, duration:1.0, scrollTrigger:{trigger:'footer',start:'top 90%'} });
}

// =============================================
// BOOT — wait for full load + one rAF so layout is computed
// =============================================
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    initPerfumeBottle();
    initWigDisplay();
    initParticles();
    initGSAP();
  });
});
