/**
 * GLIS India - ReactBits Inspired WebGL Galaxy Shader Background
 * High-performance GPU cosmic starfield with procedural star layers, flares, twinkle, and mouse repulsion.
 */

class GalaxyShaderBackground {
  constructor(canvasId = 'heroGalaxyCanvas', options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.options = Object.assign({
      focal: [0.5, 0.5],
      rotation: [1.0, 0.0],
      starSpeed: 0.45,
      density: 1.1,
      hueShift: 215.0, // Sleek cosmic teal/cyan/blue
      speed: 0.85,
      mouseInteraction: true,
      glowIntensity: 0.4,
      saturation: 0.2,
      mouseRepulsion: true,
      repulsionStrength: 2.2,
      twinkleIntensity: 0.35,
      rotationSpeed: 0.06,
      autoCenterRepulsion: 0.0,
      transparent: false
    }, options);

    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!this.gl) {
      console.warn('WebGL not supported for Galaxy Shader');
      return;
    }

    this.isRunning = false;
    this.mouse = { x: 0.5, y: 0.5 };
    this.targetMouse = { x: 0.5, y: 0.5 };
    this.mouseActive = 0.0;
    this.targetMouseActive = 0.0;

    this.init();
  }

  init() {
    const gl = this.gl;

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = (position + 1.0) * 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec2 uFocal;
      uniform vec2 uRotation;
      uniform float uStarSpeed;
      uniform float uDensity;
      uniform float uHueShift;
      uniform float uSpeed;
      uniform vec2 uMouse;
      uniform float uGlowIntensity;
      uniform float uSaturation;
      uniform bool uMouseRepulsion;
      uniform float uTwinkleIntensity;
      uniform float uRotationSpeed;
      uniform float uRepulsionStrength;
      uniform float uMouseActiveFactor;
      uniform float uAutoCenterRepulsion;
      uniform bool uTransparent;
      varying vec2 vUv;

      #define NUM_LAYER 4.0
      #define STAR_COLOR_CUTOFF 0.2
      #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
      #define PERIOD 3.0

      float Hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float tri(float x) {
        return abs(fract(x) * 2.0 - 1.0);
      }

      float tris(float x) {
        float t = fract(x);
        return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
      }

      float trisn(float x) {
        float t = fract(x);
        return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
      }

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      float Star(vec2 uv, float flare) {
        float d = length(uv);
        float m = (0.05 * uGlowIntensity) / max(d, 0.0001);
        float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * flare * uGlowIntensity;
        uv *= MAT45;
        rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * 0.3 * flare * uGlowIntensity;
        m *= smoothstep(1.0, 0.2, d);
        return m;
      }

      vec3 StarLayer(vec2 uv) {
        vec3 col = vec3(0.0);
        vec2 gv = fract(uv) - 0.5;
        vec2 id = floor(uv);
        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 si = id + vec2(float(x), float(y));
            float seed = Hash21(si);
            float size = fract(seed * 345.32);
            float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
            float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
            float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
            float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
            float grn = min(red, blu) * seed;
            vec3 base = vec3(red, grn, blu);
            float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
            hue = fract(hue + uHueShift / 360.0);
            float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
            float val = max(max(base.r, base.g), base.b);
            base = hsv2rgb(vec3(hue, sat, val));
            vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
            float star = Star(gv - offset - pad, flareSize);
            vec3 color = base;
            float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
            twinkle = mix(1.0, twinkle, uTwinkleIntensity);
            star *= twinkle;
            col += star * size * color;
          }
        }
        return col;
      }

      void main() {
        vec2 focalPx = uFocal * uResolution.xy;
        vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
        vec2 mouseNorm = uMouse - vec2(0.5);

        if (uAutoCenterRepulsion > 0.0) {
          vec2 centerUV = vec2(0.0, 0.0);
          float centerDist = length(uv - centerUV);
          vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
          uv += repulsion * 0.05;
        } else if (uMouseRepulsion) {
          vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
          float mouseDist = length(uv - mousePosUV);
          vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
          uv += repulsion * 0.05 * uMouseActiveFactor;
        } else {
          vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
          uv += mouseOffset;
        }

        float autoRotAngle = uTime * uRotationSpeed;
        mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
        uv = autoRot * uv;
        uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

        vec3 col = vec3(0.0);
        for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
          float depth = fract(i + uStarSpeed * uSpeed);
          float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
          float fade = depth * smoothstep(1.0, 0.9, depth);
          col += StarLayer(uv * scale + i * 453.32) * fade;
        }

        if (uTransparent) {
          float alpha = length(col);
          alpha = smoothstep(0.0, 0.3, alpha);
          alpha = min(alpha, 1.0);
          gl_FragColor = vec4(col, alpha);
        } else {
          gl_FragColor = vec4(col, 1.0);
        }
      }
    `;

    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    this.program = this.createProgram(gl, vertexShader, fragmentShader);

    // Quad geometry (2 triangles covering full screen)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    this.positionLocation = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations cache
    this.uniforms = {
      uTime: gl.getUniformLocation(this.program, 'uTime'),
      uResolution: gl.getUniformLocation(this.program, 'uResolution'),
      uFocal: gl.getUniformLocation(this.program, 'uFocal'),
      uRotation: gl.getUniformLocation(this.program, 'uRotation'),
      uStarSpeed: gl.getUniformLocation(this.program, 'uStarSpeed'),
      uDensity: gl.getUniformLocation(this.program, 'uDensity'),
      uHueShift: gl.getUniformLocation(this.program, 'uHueShift'),
      uSpeed: gl.getUniformLocation(this.program, 'uSpeed'),
      uMouse: gl.getUniformLocation(this.program, 'uMouse'),
      uGlowIntensity: gl.getUniformLocation(this.program, 'uGlowIntensity'),
      uSaturation: gl.getUniformLocation(this.program, 'uSaturation'),
      uMouseRepulsion: gl.getUniformLocation(this.program, 'uMouseRepulsion'),
      uTwinkleIntensity: gl.getUniformLocation(this.program, 'uTwinkleIntensity'),
      uRotationSpeed: gl.getUniformLocation(this.program, 'uRotationSpeed'),
      uRepulsionStrength: gl.getUniformLocation(this.program, 'uRepulsionStrength'),
      uMouseActiveFactor: gl.getUniformLocation(this.program, 'uMouseActiveFactor'),
      uAutoCenterRepulsion: gl.getUniformLocation(this.program, 'uAutoCenterRepulsion'),
      uTransparent: gl.getUniformLocation(this.program, 'uTransparent')
    };

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.setupMouse();
    this.start();
  }

  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Galaxy Shader Compile Error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(gl, vs, fs) {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Galaxy Program Link Error:', gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  resize() {
    if (!this.canvas || !this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = this.canvas.width = window.innerWidth * dpr;
    this.height = this.canvas.height = window.innerHeight * dpr;
    this.gl.viewport(0, 0, this.width, this.height);
  }

  setupMouse() {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = e.clientX / window.innerWidth;
      this.targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
      this.targetMouseActive = 1.0;
    });

    window.addEventListener('mouseleave', () => {
      this.targetMouseActive = 0.0;
    });
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
  }

  animate(time = 0) {
    if (!this.isRunning) return;

    const gl = this.gl;
    const t = time * 0.001;

    // Smooth mouse lerping
    const lerp = 0.06;
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * lerp;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * lerp;
    this.mouseActive += (this.targetMouseActive - this.mouseActive) * lerp;

    gl.useProgram(this.program);

    gl.uniform1f(this.uniforms.uTime, t);
    gl.uniform3f(this.uniforms.uResolution, this.width, this.height, this.width / this.height);
    gl.uniform2f(this.uniforms.uFocal, this.options.focal[0], this.options.focal[1]);
    gl.uniform2f(this.uniforms.uRotation, this.options.rotation[0], this.options.rotation[1]);
    gl.uniform1f(this.uniforms.uStarSpeed, (t * this.options.starSpeed) / 10.0);
    gl.uniform1f(this.uniforms.uDensity, this.options.density);
    gl.uniform1f(this.uniforms.uHueShift, this.options.hueShift);
    gl.uniform1f(this.uniforms.uSpeed, this.options.speed);
    gl.uniform2f(this.uniforms.uMouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.uniforms.uGlowIntensity, this.options.glowIntensity);
    gl.uniform1f(this.uniforms.uSaturation, this.options.saturation);
    gl.uniform1i(this.uniforms.uMouseRepulsion, this.options.mouseRepulsion ? 1 : 0);
    gl.uniform1f(this.uniforms.uTwinkleIntensity, this.options.twinkleIntensity);
    gl.uniform1f(this.uniforms.uRotationSpeed, this.options.rotationSpeed);
    gl.uniform1f(this.uniforms.uRepulsionStrength, this.options.repulsionStrength);
    gl.uniform1f(this.uniforms.uMouseActiveFactor, this.mouseActive);
    gl.uniform1f(this.uniforms.uAutoCenterRepulsion, this.options.autoCenterRepulsion);
    gl.uniform1i(this.uniforms.uTransparent, this.options.transparent ? 1 : 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame((ts) => this.animate(ts));
  }
}

window.GalaxyShaderBackground = GalaxyShaderBackground;
