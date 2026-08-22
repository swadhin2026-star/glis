/**
 * GLIS India - Interactive 3D Canvas Globe & Orbital Particle Engine
 * Inspired by Magic UI Globe & Dotted Map
 */

class HeroGlobeVisualizer {
  constructor(canvasId = 'heroGlobeCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.rotation = { x: 0.35, y: 0.85 };
    this.targetRotation = { x: 0.35, y: 0.85 };
    this.speed = 0.0035;
    this.radius = 220;
    this.dots = [];
    this.stars = [];
    this.satellites = [];
    this.mouse = { isDown: false, lastX: 0, lastY: 0 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate Globe Point Cloud (Fibonacci Sphere Distribution)
    const totalPoints = 1650;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < totalPoints; i++) {
      const y = 1 - (i / (totalPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Approximate landmass density check (India region highlight)
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, x) * (180 / Math.PI);
      const isIndia = (lat >= 6 && lat <= 36 && lon >= 68 && lon <= 97);

      this.dots.push({ x, y, z, isIndia, baseSize: isIndia ? 3.4 : 2.2 });
    }

    // Satellites orbiting around the globe
    this.satellites = [
      { angle: 0, speed: 0.015, dist: 1.35, tilt: 0.4, color: '#ffffff' },
      { angle: Math.PI, speed: 0.012, dist: 1.5, tilt: -0.6, color: '#ffffff' },
      { angle: Math.PI / 2, speed: 0.018, dist: 1.25, tilt: 1.1, color: '#e4e4e7' }
    ];

    this.setupInteractivity();
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.cx = this.width / 2;
    this.cy = this.height / 2 + 40;
    this.radius = Math.min(this.width * 0.28, this.height * 0.32, 250);
  }

  setupInteractivity() {

    const overlay = document.getElementById('heroIntroOverlay');

    window.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.mouse.lastX = e.clientX;
      this.mouse.lastY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.mouse.isDown) {
        const dx = e.clientX - this.mouse.lastX;
        const dy = e.clientY - this.mouse.lastY;
        this.targetRotation.y += dx * 0.005;
        this.targetRotation.x += dy * 0.005;
        this.mouse.lastX = e.clientX;
        this.mouse.lastY = e.clientY;
      }


    });



    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (this.mouse.lastX) {
          const dx = touch.clientX - this.mouse.lastX;
          this.targetRotation.y += dx * 0.006;
        }
        this.mouse.lastX = touch.clientX;


      }
    }, { passive: true });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
  }

  animate() {
    if (!this.isRunning) return;

    // Auto rotate
    this.targetRotation.y += this.speed;
    this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.08;
    this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.08;

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const cosY = Math.cos(this.rotation.y);
    const sinY = Math.sin(this.rotation.y);
    const cosX = Math.cos(this.rotation.x);
    const sinX = Math.sin(this.rotation.x);

    // 1. Draw Globe Glow Atmosphere (High Brightness & Density)
    const grad = ctx.createRadialGradient(this.cx, this.cy, this.radius * 0.45, this.cx, this.cy, this.radius * 1.35);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw Wireframe Globe Spherical Rings (Meridians)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Draw Orbit Rings (Vivid High Opacity)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(this.cx, this.cy, this.radius * 1.45, this.radius * 0.55, -0.2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.beginPath();
    ctx.ellipse(this.cx, this.cy, this.radius * 1.7, this.radius * 0.35, 0.4, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Project & Draw Globe Points
    const projectedDots = [];

    this.dots.forEach(dot => {
      // Rotate around Y axis
      let x1 = dot.x * cosY - dot.z * sinY;
      let z1 = dot.z * cosY + dot.x * sinY;
      let y1 = dot.y;

      // Rotate around X axis
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = z1 * cosX + y1 * sinX;
      let x2 = x1;

      // Projection
      const perspective = 2.5 / (2.5 + z2);
      const px = this.cx + x2 * this.radius * perspective;
      const py = this.cy + y2 * this.radius * perspective;
      const alpha = Math.max(0.35, (z2 + 1) / 2); // Ultra visible baseline

      projectedDots.push({
        px, py, z2, alpha, isIndia: dot.isIndia, baseSize: dot.baseSize * perspective
      });
    });

    // Sort by depth (back to front)
    projectedDots.sort((a, b) => a.z2 - b.z2);

    // Draw points with Maximum High Opacity
    projectedDots.forEach(p => {
      if (p.z2 < -0.2) {
        // Back of globe (Solid High Contrast)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.65})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.baseSize * 0.95, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Front of globe (Brilliant Max-Opacity & Bloom Glow)
        if (p.isIndia) {
          ctx.fillStyle = `#ffffff`;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.baseSize * 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, p.alpha * 1.5)})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.baseSize * 1.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    });

    // 5. Draw Orbiting Satellites with Bright Glow
    this.satellites.forEach(sat => {
      sat.angle += sat.speed;
      const satR = this.radius * sat.dist;
      const sx = this.cx + Math.cos(sat.angle) * satR;
      const sy = this.cy + Math.sin(sat.angle) * (satR * 0.4) * Math.cos(sat.tilt);

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Satellite pulse ring
      ctx.strokeStyle = `rgba(255, 255, 255, 0.65)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(sx, sy, 9, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}

window.HeroGlobeVisualizer = HeroGlobeVisualizer;
