import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { playPopSound, playGlassClinkSound } from '../utils/audio';

interface ThreeBottleCanvasProps {
  colorHex: string;
  fillLevel?: number;
  isSpinning?: boolean;
}

// 1. Boston Round glass lathe geometry (Double-walled borosilicate profile)
function createBostonRoundGlassGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];

  // Outer base concave punt
  points.push(new THREE.Vector2(0, 0.08));
  points.push(new THREE.Vector2(0.35, 0.06));
  points.push(new THREE.Vector2(0.75, 0.02));
  points.push(new THREE.Vector2(0.88, 0.00));
  points.push(new THREE.Vector2(0.96, 0.04));
  points.push(new THREE.Vector2(1.00, 0.14));

  // Outer cylinder
  points.push(new THREE.Vector2(1.00, 2.65));

  // Outer shoulder dome via smooth cubic bezier
  const shoulderSteps = 18;
  const p0 = { x: 1.00, y: 2.65 };
  const p1 = { x: 1.00, y: 3.20 };
  const p2 = { x: 0.52, y: 3.52 };
  const p3 = { x: 0.35, y: 3.65 };

  for (let i = 1; i <= shoulderSteps; i++) {
    const t = i / shoulderSteps;
    const x =
      Math.pow(1 - t, 3) * p0.x +
      3 * Math.pow(1 - t, 2) * t * p1.x +
      3 * (1 - t) * Math.pow(t, 2) * p2.x +
      Math.pow(t, 3) * p3.x;
    const y =
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * p1.y +
      3 * (1 - t) * Math.pow(t, 2) * p2.y +
      Math.pow(t, 3) * p3.y;
    points.push(new THREE.Vector2(x, y));
  }

  // Outer neck
  points.push(new THREE.Vector2(0.35, 4.05));

  // Glass thread collar / bead ring
  points.push(new THREE.Vector2(0.39, 4.10));
  points.push(new THREE.Vector2(0.39, 4.16));
  points.push(new THREE.Vector2(0.35, 4.20));

  // Outer top rim finish
  points.push(new THREE.Vector2(0.35, 4.32));
  points.push(new THREE.Vector2(0.32, 4.35));
  points.push(new THREE.Vector2(0.28, 4.35));
  points.push(new THREE.Vector2(0.28, 4.05));

  // Inner shoulder wall
  const ip0 = { x: 0.28, y: 3.65 };
  const ip1 = { x: 0.46, y: 3.48 };
  const ip2 = { x: 0.92, y: 3.16 };
  const ip3 = { x: 0.92, y: 2.65 };

  for (let i = 1; i <= shoulderSteps; i++) {
    const t = i / shoulderSteps;
    const x =
      Math.pow(1 - t, 3) * ip0.x +
      3 * Math.pow(1 - t, 2) * t * ip1.x +
      3 * (1 - t) * Math.pow(t, 2) * ip2.x +
      Math.pow(t, 3) * ip3.x;
    const y =
      Math.pow(1 - t, 3) * ip0.y +
      3 * Math.pow(1 - t, 2) * t * ip1.y +
      3 * (1 - t) * Math.pow(t, 2) * p2.y +
      Math.pow(t, 3) * ip3.y;
    points.push(new THREE.Vector2(x, y));
  }

  // Inner cylindrical wall
  points.push(new THREE.Vector2(0.92, 0.16));
  points.push(new THREE.Vector2(0.85, 0.10));
  points.push(new THREE.Vector2(0.35, 0.12));
  points.push(new THREE.Vector2(0.00, 0.14));

  const geometry = new THREE.LatheGeometry(points, 72);
  geometry.computeVertexNormals();
  geometry.translate(0, -2.18, 0);
  return geometry;
}

// 2. Liquid Volume Lathe Geometry (Hugs inner glass wall)
function createBostonRoundLiquidGeometry(fillFraction: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const innerRadius = 0.915;

  points.push(new THREE.Vector2(0, 0.15));
  points.push(new THREE.Vector2(0.35, 0.13));
  points.push(new THREE.Vector2(0.84, 0.11));
  points.push(new THREE.Vector2(innerRadius, 0.18));

  const maxFluidY = 3.52;
  const minFluidY = 0.55;
  const currentTopY = minFluidY + fillFraction * (maxFluidY - minFluidY);

  if (currentTopY <= 2.65) {
    points.push(new THREE.Vector2(innerRadius, currentTopY));
    // Soft meniscus bevel towards center
    points.push(new THREE.Vector2(innerRadius * 0.85, currentTopY - 0.012));
    points.push(new THREE.Vector2(0, currentTopY - 0.018));
  } else {
    points.push(new THREE.Vector2(innerRadius, 2.65));

    const shoulderT = Math.min(1, (currentTopY - 2.65) / (maxFluidY - 2.65));
    const shoulderSteps = Math.max(3, Math.floor(shoulderT * 14));

    const p0 = { x: 0.915, y: 2.65 };
    const p1 = { x: 0.915, y: 3.16 };
    const p2 = { x: 0.46, y: 3.48 };
    const p3 = { x: 0.28, y: 3.65 };

    let topRadius = innerRadius;
    for (let i = 1; i <= shoulderSteps; i++) {
      const t = (i / 14) * shoulderT;
      const x =
        Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * p1.x +
        3 * (1 - t) * Math.pow(t, 2) * p2.x +
        Math.pow(t, 3) * p3.x;
      const y =
        Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * p1.y +
        3 * (1 - t) * Math.pow(t, 2) * p2.y +
        Math.pow(t, 3) * p3.y;
      points.push(new THREE.Vector2(x, y));
      topRadius = x;
    }

    points.push(new THREE.Vector2(topRadius * 0.82, currentTopY - 0.012));
    points.push(new THREE.Vector2(0, currentTopY - 0.018));
  }

  const geometry = new THREE.LatheGeometry(points, 72);
  geometry.computeVertexNormals();
  geometry.translate(0, -2.18, 0);
  return geometry;
}

// 3. Liquid Top Meniscus Disc Geometry (Curved surface that tilts during sloshing)
function createLiquidMeniscusGeometry(topRadius: number): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(topRadius, topRadius, 0.04, 64, 4);
  geo.computeVertexNormals();
  return geo;
}

// 4. Procedural Cold-Pressed Pulp & Sedimentation Canvas Texture
function createPulpTexture(colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const base = new THREE.Color(colorHex);
  const deep = base.clone().multiplyScalar(0.72);
  const bright = base.clone().lerp(new THREE.Color(0xffffff), 0.28);

  // Vertical sedimentation gradient: denser & deeper at the bottom
  const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
  grad.addColorStop(0, deep.getStyle());
  grad.addColorStop(0.3, base.getStyle());
  grad.addColorStop(0.85, base.getStyle());
  grad.addColorStop(1, bright.getStyle());

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Organic suspended botanical pulp fibers & flecks
  ctx.fillStyle = bright.getStyle();
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 2.2 + 0.6;
    ctx.globalAlpha = Math.random() * 0.45 + 0.15;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Deeper organic pulp sediment clusters near bottom
  ctx.fillStyle = deep.getStyle();
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * canvas.width;
    const y = canvas.height * (0.6 + Math.random() * 0.4);
    const r = Math.random() * 3.2 + 0.8;
    ctx.globalAlpha = Math.random() * 0.5 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft fibrous swirls
  ctx.strokeStyle = bright.getStyle();
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 40; i++) {
    ctx.globalAlpha = Math.random() * 0.25 + 0.08;
    const sx = Math.random() * canvas.width;
    const sy = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(
      sx + (Math.random() - 0.5) * 40,
      sy + (Math.random() - 0.5) * 30,
      sx + (Math.random() - 0.5) * 60,
      sy + (Math.random() - 0.5) * 40,
      sx + (Math.random() - 0.5) * 70,
      sy + (Math.random() - 0.5) * 50
    );
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

// 5. Procedural Dew / Condensation Droplets Bump Map on 2.2°C Cold Glass
function createCondensationBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Neutral grey background (zero bump)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Crisp dewy condensation beads
  for (let i = 0; i < 320; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 4.5 + 1.2;

    const beadGrad = ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      radius * 0.1,
      x,
      y,
      radius
    );
    beadGrad.addColorStop(0, '#ffffff'); // Peak droplet height
    beadGrad.addColorStop(0.7, '#a0a0a0');
    beadGrad.addColorStop(1, '#606060'); // Droplet contact edge shadow

    ctx.fillStyle = beadGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle runnel streak
  for (let i = 0; i < 6; i++) {
    const sx = Math.random() * canvas.width;
    const sy = Math.random() * 200 + 100;
    const len = Math.random() * 120 + 60;

    const runnelGrad = ctx.createLinearGradient(sx, sy, sx, sy + len);
    runnelGrad.addColorStop(0, '#a0a0a0');
    runnelGrad.addColorStop(0.5, '#d0d0d0');
    runnelGrad.addColorStop(1, '#707070');

    ctx.strokeStyle = runnelGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + (Math.random() - 0.5) * 8, sy + len * 0.5, sx + (Math.random() - 0.5) * 4, sy + len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 6. Micro-bubble sprite texture
function createBubbleSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(28, 28, 4, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.4, 'rgba(255, 255, 240, 0.7)');
  grad.addColorStop(0.85, 'rgba(255, 230, 180, 0.35)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  // Highlight specular glint
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(24, 22, 5, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// 7. Crisp High-Resolution Die-Cut Botanical Label Texture
function createHeroLabelTexture(): THREE.CanvasTexture | null {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 760;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Warm cream parchment backing
  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle organic paper texture
  ctx.fillStyle = 'rgba(12, 10, 9, 0.03)';
  for (let i = 0; i < 700; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }

  // Double border
  ctx.strokeStyle = '#171412';
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

  // Gold foil corner diamonds
  const drawDiamond = (x: number, y: number) => {
    ctx.fillStyle = '#C8741B';
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x + 8, y);
    ctx.lineTo(x, y + 8);
    ctx.lineTo(x - 8, y);
    ctx.closePath();
    ctx.fill();
  };
  drawDiamond(56, 56);
  drawDiamond(canvas.width - 56, 56);
  drawDiamond(56, canvas.height - 56);
  drawDiamond(canvas.width - 56, canvas.height - 56);

  ctx.fillStyle = '#5E544D';
  ctx.font = '700 20px "Space Grotesk", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MUMBAI, INDIA • BATCH #0849', 512, 100);

  ctx.fillStyle = '#0C0A09';
  ctx.font = '900 66px "Sink", "Changa One", Impact, sans-serif';
  ctx.fillText('FRUITS & ROOTS', 512, 175);

  ctx.font = 'italic 700 28px "Fraunces", Georgia, serif';
  ctx.fillStyle = '#C8741B';
  ctx.fillText('Raw Cold-Pressed Living Botanicals', 512, 222);

  // Dark banner band
  ctx.fillStyle = '#171412';
  ctx.fillRect(160, 255, 704, 52);
  ctx.fillStyle = '#FAF6EE';
  ctx.font = '800 20px "Space Grotesk", monospace';
  ctx.fillText('15,000 PSI COLD HYDRAULIC EXTRACTION', 512, 288);

  ctx.fillStyle = '#0C0A09';
  ctx.font = '700 21px "Space Grotesk", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('• 100% UNPASTEURISED LIVING ENZYMES', 180, 360);
  ctx.fillText('• 0.0°C THERMAL FRICTION HEAT', 180, 400);
  ctx.fillText('• 1.8 KG CERTIFIED ORGANIC BOTANY', 180, 440);
  ctx.fillText('• ZERO ADDED SUGARS OR PRESERVATIVES', 180, 480);

  ctx.textAlign = 'center';
  ctx.font = '800 28px "Space Grotesk", monospace';
  ctx.fillStyle = '#0C0A09';
  ctx.fillText('473 ML (16 FL OZ)', 512, 560);

  ctx.font = '700 16px "Space Grotesk", monospace';
  ctx.fillStyle = '#5E544D';
  ctx.fillText('BOROSILICATE GLASS • ₹25 CIRCULAR BOTTLE RETURN', 512, 595);

  // Barcode
  ctx.fillStyle = '#0C0A09';
  for (let x = 240; x < 784; x += 8) {
    const w = x % 16 === 0 ? 5 : x % 24 === 0 ? 6 : 3;
    ctx.fillRect(x, 622, w, 44);
  }
  ctx.font = '600 13px monospace';
  ctx.fillText('8   4 9 2 0 1   0 8 4 9 0   2', 512, 690);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

export const ThreeBottleCanvas: React.FC<ThreeBottleCanvasProps> = ({
  colorHex,
  fillLevel = 0.88,
  isSpinning = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const meniscusMeshRef = useRef<THREE.Mesh | null>(null);
  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const innerGlowMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const bubblesPointsRef = useRef<THREE.Points | null>(null);

  // Color transition refs
  const targetColorRef = useRef(new THREE.Color(colorHex));
  const currentColorRef = useRef(new THREE.Color(colorHex));

  // Fluid Slosh Physics Simulation Refs
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.04, y: 0.12 });
  const rotationCurrentRef = useRef({ x: 0.04, y: 0.12 });

  // Slosh momentum angles & velocities
  const sloshAngleRef = useRef({ x: 0, z: 0 });
  const sloshVelRef = useRef({ x: 0, z: 0 });
  const effervescenceRef = useRef(1.0); // Spikes on tap/click or drag
  const bottleBounceRef = useRef(1.0); // Squash and stretch on tap

  useEffect(() => {
    targetColorRef.current.set(colorHex);
  }, [colorHex]);

  // Main Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // High-End Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xf5eedf);

    // Warm top ambient ceiling
    const envCeiling = new THREE.DirectionalLight(0xfff8ee, 3.5);
    envCeiling.position.set(0, 8, 2);
    envScene.add(envCeiling);

    // Left Studio Strip Light (Creates crisp long highlight on glass)
    const leftStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    leftStrip.position.set(-4.2, 0.5, 3.2);
    leftStrip.lookAt(0, 0, 0);
    envScene.add(leftStrip);

    // Right Studio Strip Light (Warm champagne highlight)
    const rightStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 8),
      new THREE.MeshBasicMaterial({ color: 0xfff0db })
    );
    rightStrip.position.set(4.6, 0.8, 2.8);
    rightStrip.lookAt(0, 0, 0);
    envScene.add(rightStrip);

    // Backstage Dark Flag (Provides edge contrast for clear glass)
    const darkFlag = new THREE.Mesh(
      new THREE.PlaneGeometry(4.0, 8),
      new THREE.MeshBasicMaterial({ color: 0x3d3025 })
    );
    darkFlag.position.set(0, 0, -6.5);
    darkFlag.lookAt(0, 0, 0);
    envScene.add(darkFlag);

    const envTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Direct Directional & Rim Lights
    const keyLight = new THREE.DirectionalLight(0xfff6ec, 2.8);
    keyLight.position.set(3.5, 5, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf7ebe0, 1.4);
    fillLight.position.set(-4, -0.5, 3.5);
    scene.add(fillLight);

    // Backlight for subsurface juice luminescence
    const backlight = new THREE.DirectionalLight(0xffedd5, 3.2);
    backlight.position.set(0, 2.5, -4.5);
    scene.add(backlight);

    // Contact Floor Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 12, 128, 128, 115);
    grad.addColorStop(0, 'rgba(12, 10, 9, 0.42)');
    grad.addColorStop(0.35, 'rgba(12, 10, 9, 0.18)');
    grad.addColorStop(0.7, 'rgba(12, 10, 9, 0.05)');
    grad.addColorStop(1, 'rgba(12, 10, 9, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.20;
    scene.add(shadowMesh);

    // Master Bottle & Fluid Pivot Group
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // ----------------------------------------------------
    // REALISTIC JUICE ENGINE (Volumetric Depth, Pulp & Meniscus)
    // ----------------------------------------------------
    const pulpTexture = createPulpTexture(colorHex);

    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: currentColorRef.current,
      map: pulpTexture,
      roughness: 0.18,
      metalness: 0.0,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      sheen: 0.65,
      sheenColor: new THREE.Color(0xfff0db),
      emissive: currentColorRef.current.clone().multiplyScalar(0.18),
      depthWrite: true,
      transparent: false,
    });
    liquidMaterialRef.current = liquidMat;

    const liquidGeo = createBostonRoundLiquidGeometry(fillLevel);
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.renderOrder = 1;
    liquidMeshRef.current = liquidMesh;
    bottleGroup.add(liquidMesh);

    // Inner Glowing Core (Subsurface Scattering Effect)
    const coreGeo = new THREE.CylinderGeometry(0.76, 0.76, 2.1, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: currentColorRef.current.clone().lerp(new THREE.Color(0xffffff), 0.35),
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    innerGlowMatRef.current = coreMat;
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = -0.55;
    coreMesh.renderOrder = 2;
    bottleGroup.add(coreMesh);

    // Liquid Top Meniscus (Curved disc at fluid fill line)
    const topFluidY = -2.18 + 0.55 + fillLevel * (3.52 - 0.55);
    const meniscusGeo = createLiquidMeniscusGeometry(0.88);
    const meniscusMat = new THREE.MeshPhysicalMaterial({
      color: currentColorRef.current.clone().lerp(new THREE.Color(0xffffff), 0.15),
      roughness: 0.08,
      clearcoat: 1.0,
      emissive: currentColorRef.current.clone().multiplyScalar(0.22),
    });
    const meniscusMesh = new THREE.Mesh(meniscusGeo, meniscusMat);
    meniscusMesh.position.y = topFluidY;
    meniscusMesh.renderOrder = 2;
    meniscusMeshRef.current = meniscusMesh;
    bottleGroup.add(meniscusMesh);

    // ----------------------------------------------------
    // ACTIVE ENZYME & PULP BUBBLES (Suspended Particle Cloud)
    // ----------------------------------------------------
    const bubbleCount = 160;
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const bubbleVelocities = new Float32Array(bubbleCount);
    const bubbleAngles = new Float32Array(bubbleCount);
    const bubbleRadii = new Float32Array(bubbleCount);

    const bubbleSprite = createBubbleSpriteTexture();
    const bottomY = -2.0;
    const topY = topFluidY - 0.05;

    for (let i = 0; i < bubbleCount; i++) {
      const radius = Math.sqrt(Math.random()) * 0.78;
      const angle = Math.random() * Math.PI * 2;
      const y = bottomY + Math.random() * (topY - bottomY);

      bubbleRadii[i] = radius;
      bubbleAngles[i] = angle;
      bubbleVelocities[i] = 0.003 + Math.random() * 0.007;

      bubblePositions[i * 3 + 0] = Math.cos(angle) * radius;
      bubblePositions[i * 3 + 1] = y;
      bubblePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));

    const bubbleMat = new THREE.PointsMaterial({
      map: bubbleSprite,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    });

    const bubblesPoints = new THREE.Points(bubbleGeo, bubbleMat);
    bubblesPoints.renderOrder = 2;
    bubblesPointsRef.current = bubblesPoints;
    bottleGroup.add(bubblesPoints);

    // ----------------------------------------------------
    // CRYSTAL BOROSILICATE GLASS BOTTLE & CONDENSATION
    // ----------------------------------------------------
    const condensationBump = createCondensationBumpTexture();

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.98,
      opacity: 1.0,
      transparent: true,
      roughness: 0.012,
      bumpMap: condensationBump,
      bumpScale: 0.015,
      ior: 1.52,
      thickness: 0.42,
      specularIntensity: 2.5,
      specularColor: 0xffffff,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      depthWrite: false,
    });

    const glassGeo = createBostonRoundGlassGeometry();
    const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
    glassMesh.renderOrder = 4;
    bottleGroup.add(glassMesh);

    // Brushed Brass / Gold Hermetic Crown Cap
    const capHeight = 0.34;
    const capRadius = 0.368;
    const capGeo = new THREE.CylinderGeometry(capRadius, capRadius, capHeight, 48);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xc49646,
      metalness: 0.92,
      roughness: 0.22,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 4.18 - 2.18;
    capMesh.renderOrder = 5;
    bottleGroup.add(capMesh);

    const capTopGeo = new THREE.CylinderGeometry(capRadius + 0.015, capRadius + 0.015, 0.06, 48);
    const capTopMesh = new THREE.Mesh(capTopGeo, capMat);
    capTopMesh.position.y = 4.18 - 2.18 + capHeight / 2 + 0.03;
    capTopMesh.renderOrder = 5;
    bottleGroup.add(capTopMesh);

    const ringGeo = new THREE.CylinderGeometry(capRadius, capRadius, 0.08, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xa97830,
      metalness: 0.88,
      roughness: 0.32,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 4.18 - 2.18 - capHeight / 2 - 0.06;
    ringMesh.renderOrder = 5;
    bottleGroup.add(ringMesh);

    // Front Die-Cut Label
    const frontLabelTexture = createHeroLabelTexture();
    if (frontLabelTexture) {
      const frontLabelGeo = new THREE.CylinderGeometry(
        1.008,
        1.008,
        1.55,
        48,
        1,
        true,
        Math.PI * 0.64,
        Math.PI * 0.72
      );
      const frontLabelMat = new THREE.MeshStandardMaterial({
        map: frontLabelTexture,
        roughness: 0.72,
        metalness: 0.02,
        side: THREE.FrontSide,
      });
      const frontLabelMesh = new THREE.Mesh(frontLabelGeo, frontLabelMat);
      frontLabelMesh.position.y = -0.58;
      frontLabelMesh.renderOrder = 6;
      bottleGroup.add(frontLabelMesh);
    }

    bottleGroup.position.set(0, 0, 0);

    // ----------------------------------------------------
    // INTERACTIVE POINTER & TAP-TO-SWIRL JUICE HANDLERS
    // ----------------------------------------------------
    let dragDistance = 0;

    const handlePointerDown = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      dragDistance = 0;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return;
      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;
      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

      // Rotate bottle
      rotationTargetRef.current.y += deltaX * 0.012;
      rotationTargetRef.current.x = Math.max(
        -0.25,
        Math.min(0.25, rotationTargetRef.current.x + deltaY * 0.006)
      );

      // Fluid Slosh Reaction: drag momentum drives fluid tilt
      sloshVelRef.current.x -= deltaX * 0.008;
      sloshVelRef.current.z += deltaY * 0.005;
      effervescenceRef.current = Math.min(3.5, effervescenceRef.current + 0.15);

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      // If tap/click with minimal drag distance, trigger celebratory fluid swirl & pop!
      if (dragDistance < 8) {
        triggerTapSwirl();
      }
      isDraggingRef.current = false;
    };

    const triggerTapSwirl = () => {
      playGlassClinkSound();
      playPopSound();

      // Slosh wave impulse
      sloshVelRef.current.x += (Math.random() - 0.5) * 0.45;
      sloshVelRef.current.z += (Math.random() - 0.5) * 0.35;
      effervescenceRef.current = 4.2; // Rapid bubble rise
      bottleBounceRef.current = 1.05; // Elastic bounce
    };

    const onMouseDown = (e: MouseEvent) => handlePointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => handlePointerUp();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handlePointerUp();

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ----------------------------------------------------
    // REAL-TIME RENDER & FLUID SLOSH PHYSICS LOOP
    // ----------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let prevRotY = rotationTargetRef.current.y;
    let prevRotX = rotationTargetRef.current.x;

    const render = () => {
      const elapsedTime = clock.getElapsedTime();

      // Gentle ambient idle rotation when not dragging
      if (!isDraggingRef.current) {
        rotationTargetRef.current.y += isSpinning ? 0.015 : 0.0022;
      }

      // Smooth inertia damping for bottle rotation
      rotationCurrentRef.current.x += (rotationTargetRef.current.x - rotationCurrentRef.current.x) * 0.08;
      rotationCurrentRef.current.y += (rotationTargetRef.current.y - rotationCurrentRef.current.y) * 0.08;

      // Calculate angular velocity
      const dRotY = rotationCurrentRef.current.y - prevRotY;
      const dRotX = rotationCurrentRef.current.x - prevRotX;
      prevRotY = rotationCurrentRef.current.y;
      prevRotX = rotationCurrentRef.current.x;

      // Slosh physics: Centrifugal force & inertia tilts fluid surface
      const targetSloshX = -dRotY * 3.2;
      const targetSloshZ = dRotX * 3.2;

      sloshVelRef.current.x += (targetSloshX - sloshAngleRef.current.x) * 0.14 - sloshVelRef.current.x * 0.08;
      sloshAngleRef.current.x += sloshVelRef.current.x;

      sloshVelRef.current.z += (targetSloshZ - sloshAngleRef.current.z) * 0.14 - sloshVelRef.current.z * 0.08;
      sloshAngleRef.current.z += sloshVelRef.current.z;

      // Decay effervescence & bounce
      effervescenceRef.current += (1.0 - effervescenceRef.current) * 0.04;
      bottleBounceRef.current += (1.0 - bottleBounceRef.current) * 0.12;

      // Update bottle position & rotation
      if (bottleGroup) {
        bottleGroup.rotation.x = rotationCurrentRef.current.x;
        bottleGroup.rotation.y = rotationCurrentRef.current.y;
        bottleGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.035;

        // Apply interactive elastic bounce
        const b = bottleBounceRef.current;
        bottleGroup.scale.set(1 / Math.sqrt(b), b, 1 / Math.sqrt(b));
      }

      // Slosh Meniscus Surface
      if (meniscusMeshRef.current) {
        meniscusMeshRef.current.rotation.z = sloshAngleRef.current.x;
        meniscusMeshRef.current.rotation.x = sloshAngleRef.current.z;
        // Subtle slosh wave height modulation
        const wave = Math.sin(elapsedTime * 8) * 0.015 * Math.hypot(sloshAngleRef.current.x, sloshAngleRef.current.z);
        meniscusMeshRef.current.position.y = topFluidY + wave;
      }

      // Animate Active Enzyme & Pulp Bubbles
      if (bubblesPointsRef.current) {
        const positions = bubblesPointsRef.current.geometry.attributes.position.array as Float32Array;
        const currentEff = effervescenceRef.current;
        const swirlSpeed = 0.018 * currentEff + Math.abs(sloshVelRef.current.x) * 0.12;

        for (let i = 0; i < bubbleCount; i++) {
          // Vortex swirl in X-Z circle
          bubbleAngles[i] += swirlSpeed * (i % 2 === 0 ? 1 : 0.8);
          const r = bubbleRadii[i] + Math.sin(elapsedTime * 2 + i) * 0.02;
          positions[i * 3 + 0] = Math.cos(bubbleAngles[i]) * r;
          positions[i * 3 + 2] = Math.sin(bubbleAngles[i]) * r;

          // Float upward
          positions[i * 3 + 1] += bubbleVelocities[i] * currentEff;
          if (positions[i * 3 + 1] > topY) {
            positions[i * 3 + 1] = bottomY + Math.random() * 0.15;
          }
        }
        bubblesPointsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth color interpolation across flavours
      currentColorRef.current.lerp(targetColorRef.current, 0.08);

      if (liquidMaterialRef.current) {
        liquidMaterialRef.current.color.copy(currentColorRef.current);
        liquidMaterialRef.current.emissive.copy(currentColorRef.current).multiplyScalar(0.18);
      }

      if (innerGlowMatRef.current) {
        innerGlowMatRef.current.color.copy(currentColorRef.current).lerp(new THREE.Color(0xffffff), 0.35);
      }

      if (meniscusMeshRef.current && meniscusMeshRef.current.material) {
        const mMat = meniscusMeshRef.current.material as THREE.MeshPhysicalMaterial;
        mMat.color.copy(currentColorRef.current).lerp(new THREE.Color(0xffffff), 0.15);
        mMat.emissive.copy(currentColorRef.current).multiplyScalar(0.22);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [fillLevel, isSpinning]);

  // Update pulp texture when color changes
  useEffect(() => {
    if (liquidMaterialRef.current) {
      const newTex = createPulpTexture(colorHex);
      liquidMaterialRef.current.map = newTex;
      liquidMaterialRef.current.needsUpdate = true;
    }
  }, [colorHex]);

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none cursor-grab active:cursor-grabbing group">
      <div
        ref={mountRef}
        className="w-full h-[380px] sm:h-[480px] max-w-[400px]"
        title="Drag to rotate 3D bottle • Tap to swirl & effervesce juice"
      />
    </div>
  );
};
