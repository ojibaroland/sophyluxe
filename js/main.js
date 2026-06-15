// 1. Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 3. Three.js 3D Perfume Bottle
(function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const bottleGroup = new THREE.Group();

  const darkGlassMat = new THREE.MeshStandardMaterial({
    color: '#1a0a2e',
    metalness: 0.3,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  const bottleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 2, 32), darkGlassMat);
  const bottleNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.6, 0.5, 32), darkGlassMat);
  bottleNeck.position.y = 1.25;

  const goldMat = new THREE.MeshStandardMaterial({ color: '#C9A84C', metalness: 0.9, roughness: 0.1 });
  const bottleCap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32), goldMat);
  bottleCap.position.y = 1.7;

  bottleGroup.add(bottleBody, bottleNeck, bottleCap);
  bottleGroup.position.set(0, 0, 0);
  scene.add(bottleGroup);

  scene.add(new THREE.AmbientLight('#C9A84C', 0.5));

  const dirLight = new THREE.DirectionalLight('#F0D080', 1.5);
  dirLight.position.set(2, 3, 2);
  scene.add(dirLight);

  const pointLight1 = new THREE.PointLight('#C9A84C', 2, 10);
  pointLight1.position.set(-2, 1, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight('#F0D080', 1, 8);
  pointLight2.position.set(2, -1, 2);
  scene.add(pointLight2);

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      bottleGroup.rotation.y = self.progress * Math.PI * 2;
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    bottleGroup.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
})();

// 4. Gold particle system
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero');

  function resizeCanvas() {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = ['#C9A84C', '#F0D080', '#8B6914'];
  const particles = [];

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      radius: 0.5 + Math.random() * 2,
      speedX: -0.3 + Math.random() * 0.6,
      speedY: -0.3 - Math.random() * 0.9,
      opacity: 0.5 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      fadeSpeed: 0.003 + Math.random() * 0.005
    };
  }

  for (let i = 0; i < 80; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity -= p.fadeSpeed;
      if (p.opacity <= 0 || p.y < -10) {
        particles[i] = createParticle();
      }
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
})();

// 5. Nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// 6. Render product cards
(function renderProducts() {
  const grid = document.getElementById('featured-products');
  if (!grid || typeof products === 'undefined') return;

  const featured = products.slice(0, 4);
  grid.innerHTML = featured.map((product, i) => `
    <div class="product-card" data-index="${i}">
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">
      </div>
      <div class="card-body">
        <span class="card-category">${product.category}</span>
        <h3 class="card-name">${product.name}</h3>
        <p class="card-desc">${product.description}</p>
        <p class="card-price">${product.price}</p>
        <a href="https://wa.me/${product.whatsappNumber}?text=Hi%2C%20I%20want%20to%20order%20${encodeURIComponent(product.name)}" class="btn-gold" target="_blank">Buy on WhatsApp</a>
      </div>
    </div>
  `).join('');
})();

// 7. GSAP hero animations
document.addEventListener('DOMContentLoaded', () => {
  gsap.from('.hero-title', { y: 80, opacity: 0, duration: 1.4, delay: 0.3, ease: 'power4.out' });
  gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 1.2, delay: 0.6, ease: 'power3.out' });
  gsap.from('.btn-group', { y: 30, opacity: 0, duration: 1, delay: 0.9, ease: 'power3.out' });

  // 8. Featured section animations
  gsap.from('#featured .section-heading', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    scrollTrigger: { trigger: '#featured', start: 'top 80%' }
  });

  const cardAnimations = [
    { x: -80, y: 0 },
    { x: 80, y: 0 },
    { x: 0, y: 80 },
    { x: -80, y: 0 }
  ];

  document.querySelectorAll('.product-card').forEach((card, i) => {
    gsap.from(card, {
      x: cardAnimations[i] ? cardAnimations[i].x : 0,
      y: cardAnimations[i] ? cardAnimations[i].y : 80,
      opacity: 0,
      duration: 1,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#featured',
        start: 'top 70%'
      }
    });
  });

  // 9. Stats count-up
  document.querySelectorAll('.stat-number').forEach(stat => {
    const target = parseInt(stat.dataset.target);
    const suffix = stat.dataset.suffix || '+';
    gsap.to({ val: 0 }, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#stats',
        start: 'top 80%',
        once: true
      },
      onUpdate: function() {
        stat.textContent = Math.round(this.targets()[0].val) + suffix;
      }
    });
  });

  // 10. Brand story fade in
  gsap.from('#brand-story', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    scrollTrigger: { trigger: '#brand-story', start: 'top 80%' }
  });

  // 11. Footer fade in
  gsap.from('footer', {
    y: 40,
    opacity: 0,
    duration: 1,
    scrollTrigger: { trigger: 'footer', start: 'top 90%' }
  });
});
