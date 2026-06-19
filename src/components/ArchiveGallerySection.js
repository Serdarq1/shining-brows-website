'use client';
import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import { getDictionary } from '@/lib/i18n';

/* ---------------------------------------------------------------------------
 * Spiral 3D archive — built to the reference brief's spec:
 *   - 75 tiles (15 per revolution × 5 revolutions)
 *   - Each tile is a CURVED BufferGeometry (not flat) — the strip wraps
 *     smoothly around the y-axis with no flat-card faceting.
 *   - ShaderMaterial per tile with a custom vertex + fragment shader:
 *     edge vignette per tile, depth fade based on distance to camera,
 *     subtle desaturation at the back of the helix.
 *   - Spin is driven by scroll VELOCITY (with rotation decay), not scroll
 *     position — fast scrolls produce momentum that smoothly settles.
 *   - Camera drifts slightly in y as scroll progresses.
 *   - Mouse parallax tilts the rig on x / z.
 *
 * Excluded per earlier brief: opened box, transparent remover bottle,
 * transparent remover package.
 * ------------------------------------------------------------------------- */

const CONFIG = {
  totalImages: 10,
  tilesPerRevolution: 15,
  revolutions: 7, // was 5 — more revolutions so the spiral feels visually longer
  startRadius: 5,
  endRadius: 3.5,
  tileHeightRatio: 1.1,
  tileSegments: 24,
  spiralGap: 0.35,
  tileOverlap: 0.005,
  cameraZ: 12,
  cameraSmoothing: 0.075,
  baseRotationSpeed: 0.0025, // was 0.001 — ambient spin readable from frame 1
  scrollRotationMultiplier: 0.0045, // was 0.0035 — scroll bites harder
  rotationDecay: 0.92, // was 0.9 — momentum lasts a touch longer
  scrollMultiplier: 1.25,
  cameraYMultiplier: 0.28, // was 0.2 — camera covers more vertical span
  parallaxStrength: 0.1,
  spiralOffsetY: -2.0,
};

const productImages = [
  '/images/Remover_with_bg.png',
  '/images/care%20cream.png',
  '/images/home%20serum.png',
  '/images/elixir.png',
  '/images/vitamin.png',
  '/images/dark.png',
  '/images/medium.png',
  '/images/light.png',
];

const TOTAL_TILES = CONFIG.tilesPerRevolution * CONFIG.revolutions; // 75
const ANGLE_STEP = (Math.PI * 2) / CONFIG.tilesPerRevolution;
const ARC_ANGLE = ANGLE_STEP + CONFIG.tileOverlap;
const CHORD = 2 * CONFIG.startRadius * Math.sin(ANGLE_STEP / 2);
const TILE_HEIGHT = CHORD * CONFIG.tileHeightRatio;
const START_Y = ((TOTAL_TILES - 1) * CONFIG.spiralGap) / 2;

// Distribute the 8 unique product images across the 75 tiles.
const galleryImages = Array.from({ length: TOTAL_TILES }, (_, i) =>
  productImages[i % productImages.length]
);

/* ── Shaders ───────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uCameraPosition;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vec4 tex = texture2D(uMap, vUv);

  // Edge vignette per tile — soft falloff toward the corners.
  vec2 centered = vUv - 0.5;
  float edge = 1.0 - smoothstep(0.34, 0.86, length(centered));
  edge = mix(0.78, 1.0, edge);

  // Depth fade based on distance from camera.
  float dist = distance(vWorldPosition, uCameraPosition);
  float depth = 1.0 - smoothstep(8.0, 22.0, dist);
  depth = mix(0.5, 1.0, depth);

  // Slight desaturation for far tiles — cinematic recession.
  vec3 color = tex.rgb;
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luma), color, depth);

  color = color * edge * depth;
  gl_FragColor = vec4(color, tex.a);
}
`;

/* ── Curved tile geometry ──────────────────────────────────────────────── */

function createCurvedTileGeometry(radius, arcAngle, tileHeight, segments) {
  const geometry = new BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Arc swept symmetrically around theta = 0 so tile.rotation.y places it
    const theta = -arcAngle / 2 + t * arcAngle;
    const x = Math.sin(theta) * radius;
    const z = Math.cos(theta) * radius;

    positions.push(x, tileHeight / 2, z);
    positions.push(x, -tileHeight / 2, z);

    uvs.push(t, 1);
    uvs.push(t, 0);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;
    indices.push(a, b, d);
    indices.push(a, d, c);
  }

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/* ── Spiral scene ──────────────────────────────────────────────────────── */

function SpiralScene({ progressRef, velocityRef, pointerRef, stateRef }) {
  const textures = useLoader(TextureLoader, galleryImages);
  const spiralRef = useRef(null);
  const { camera, gl } = useThree();

  // One-time texture tuning.
  useMemo(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.minFilter = LinearMipmapLinearFilter;
      texture.magFilter = LinearFilter;
      texture.anisotropy = maxAniso;
      texture.needsUpdate = true;
    });
  }, [textures, gl]);

  // Build all 75 tiles (geometry + material + transform) once. Materials
  // share a reference to the live camera.position via the uCameraPosition
  // uniform — when the camera moves each frame, the uniform updates with no
  // explicit per-frame work.
  const tiles = useMemo(() => {
    return textures.map((texture, index) => {
      const t = index / (TOTAL_TILES - 1);
      const radius = MathUtils.lerp(
        CONFIG.startRadius,
        CONFIG.endRadius,
        t
      );

      const geometry = createCurvedTileGeometry(
        radius,
        ARC_ANGLE,
        TILE_HEIGHT,
        CONFIG.tileSegments
      );

      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uMap: { value: texture },
          uCameraPosition: { value: camera.position },
        },
        side: DoubleSide,
        transparent: true,
      });

      const positionY = START_Y - index * CONFIG.spiralGap;
      const rotationY = index * ANGLE_STEP;

      return { geometry, material, positionY, rotationY };
    });
  }, [textures, camera]);

  useFrame(() => {
    const spiral = spiralRef.current;
    if (!spiral) return;
    const s = stateRef.current;

    // Spin: base ambient rotation + accumulated scroll-driven spin velocity.
    spiral.rotation.y += CONFIG.baseRotationSpeed + s.spinVelocity;
    s.spinVelocity *= CONFIG.rotationDecay;

    // Mouse-driven rig tilt (desktop only).
    if (!s.isMobile) {
      s.currentTiltX += (s.targetTiltX - s.currentTiltX) * CONFIG.cameraSmoothing;
      s.currentTiltZ += (s.targetTiltZ - s.currentTiltZ) * CONFIG.cameraSmoothing;
      spiral.rotation.x = s.currentTiltX;
      spiral.rotation.z = s.currentTiltZ;
    }

    // Camera vertical drift driven by scroll progress.
    s.targetCameraY = -progressRef.current * CONFIG.cameraYMultiplier * 10;
    s.currentCameraY += (s.targetCameraY - s.currentCameraY) * CONFIG.cameraSmoothing;
    camera.position.y = s.currentCameraY;
    camera.lookAt(0, s.currentCameraY * 0.4, 0);
  });

  return (
    <group ref={spiralRef} position={[0, CONFIG.spiralOffsetY, 0]}>
      {tiles.map((tile, i) => (
        <mesh
          key={i}
          geometry={tile.geometry}
          material={tile.material}
          position={[0, tile.positionY, 0]}
          rotation={[0, tile.rotationY, 0]}
        />
      ))}
    </group>
  );
}

/* ── Section component ────────────────────────────────────────────────── */

export default function ArchiveGallerySection({ locale = 'tr', centered = false }) {
  const dict = getDictionary(locale).gallery;
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Mutable per-frame state — every field used in useFrame above.
  const stateRef = useRef({
    isMobile: false,
    spinVelocity: 0,
    targetCameraY: 0,
    currentCameraY: 0,
    targetTiltX: 0,
    targetTiltZ: 0,
    currentTiltX: 0,
    currentTiltZ: 0,
  });

  useEffect(() => {
    const checkMobile = () => {
      stateRef.current.isMobile = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updatePointer = (event) => {
      if (stateRef.current.isMobile) return;
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current.x = mouseX;
      pointerRef.current.y = mouseY;
      stateRef.current.targetTiltX = mouseY * CONFIG.parallaxStrength;
      stateRef.current.targetTiltZ = mouseX * CONFIG.parallaxStrength * -0.5;
    };

    let ctx;
    let cancelled = false;

    (async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            // ScrollTrigger velocity (px/s, signed). Scaled into the spin
            // velocity accumulator each update — fast scrolls build up
            // momentum that the rotation-decay then bleeds off smoothly.
            const v = self.getVelocity();
            velocityRef.current = v;
            stateRef.current.spinVelocity +=
              v *
              CONFIG.scrollRotationMultiplier *
              CONFIG.scrollMultiplier *
              0.001; // ScrollTrigger velocity is px/s; scale to per-frame
          },
        });
      }, sectionRef);
    })();

    window.addEventListener('pointermove', updatePointer, { passive: true });

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[150vh] bg-[#121110] text-ivory"
      aria-label={dict.ariaLabel}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, CONFIG.cameraZ], fov: 45, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <SpiralScene
            progressRef={progressRef}
            velocityRef={velocityRef}
            pointerRef={pointerRef}
            stateRef={stateRef}
          />
        </Canvas>

        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(8,7,5,0.55) 75%, rgba(8,7,5,0.85) 100%)',
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-[#121110] via-[#121110]/60 to-transparent" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
          style={{
            height: '18vh',
            background:
              'linear-gradient(to top, #121110 0%, rgba(18,17,16,0.85) 40%, transparent 100%)',
          }}
        />

        <div
          className={
            centered
              ? 'pointer-events-none absolute inset-x-0 top-48 md:top-56 z-20 mx-auto max-w-[1100px] px-7 md:px-10 text-center'
              : 'pointer-events-none absolute left-7 top-20 z-20 max-w-[920px] md:left-[13vw] md:top-16'
          }
        >
          <h2
            className="font-logo text-ivory"
            style={{
              fontSize: 'clamp(54px, 7vw, 136px)',
              lineHeight: 0.95,
              fontWeight: 500,
            }}
          >
            <span className="block">{dict.headline.line1}</span>
            <span className="block italic">{dict.headline.line2}</span>
          </h2>

          <p
            className={
              centered
                ? 'mt-12 md:mt-14 mx-auto max-w-[60ch] font-nav font-light text-ivory/86'
                : 'mt-14 max-w-[42ch] font-nav font-light text-ivory/86 md:ml-[8vw]'
            }
            style={{ fontSize: 'clamp(18px, 1.45vw, 28px)', lineHeight: 1.78 }}
          >
            {dict.body}
          </p>
        </div>
      </div>
    </section>
  );
}
