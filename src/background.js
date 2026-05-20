import * as THREE from "three";

export function initPaintedBackground(container) {
  if (!container) {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uScroll: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uScroll;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p *= 2.02;
          amplitude *= 0.52;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        vec2 aspectUv = uv;
        aspectUv.x *= uResolution.x / max(uResolution.y, 1.0);

        vec2 mouse = uMouse;
        mouse.x *= uResolution.x / max(uResolution.y, 1.0);

        float cursorDistance = distance(aspectUv, mouse);
        float cursor = smoothstep(0.38, 0.05, cursorDistance);
        float cursorCore = smoothstep(0.055, 0.0, cursorDistance);
        float cursorRing = smoothstep(0.15, 0.075, cursorDistance) - smoothstep(0.055, 0.0, cursorDistance);
        float slow = uTime * 0.045;
        float scrollWave = uScroll * 3.2;

        float paintA = fbm(uv * 3.0 + vec2(slow, scrollWave));
        float paintB = fbm(uv * 7.0 - vec2(scrollWave * 0.35, slow * 1.8));
        float grain = noise(uv * uResolution.xy * 0.55 + uTime);

        vec3 ink = vec3(0.006, 0.016, 0.045);
        vec3 navy = vec3(0.010, 0.082, 0.215);
        vec3 blue = vec3(0.012, 0.245, 0.600);
        vec3 cyan = vec3(0.150, 0.470, 0.760);
        vec3 warm = vec3(0.620, 0.540, 0.430);

        vec3 color = mix(ink, navy, smoothstep(0.05, 0.95, uv.x + paintA * 0.24));
        color = mix(color, blue, smoothstep(0.14, 0.9, paintA + uScroll * 0.18) * 0.6);
        color = mix(color, cyan, cursor * 0.065);
        color = mix(color, warm, smoothstep(0.72, 1.0, paintB) * 0.085);

        float vignette = smoothstep(1.18, 0.25, distance(uv, vec2(0.5)));
        color *= 0.58 + vignette * 0.46;
        color += cyan * cursorCore * 0.035;
        color += vec3(0.72, 0.76, 0.64) * cursorRing * 0.018;
        color += (grain - 0.5) * 0.032;
        color *= 0.9;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    depthWrite: false,
    depthTest: false,
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function pointerMove(event) {
    uniforms.uMouse.value.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
  }

  function animate(time) {
    uniforms.uTime.value = time * 0.001;
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", pointerMove, { passive: true });
  renderer.setAnimationLoop(animate);

  return {
    setScroll(progress) {
      uniforms.uScroll.value = progress;
    },
    destroy() {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMove);
      material.dispose();
      renderer.dispose();
      container.replaceChildren();
    },
  };
}
