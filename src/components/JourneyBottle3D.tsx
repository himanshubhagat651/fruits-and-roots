import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { playPopSound } from '../utils/audio';

interface JourneyBottle3DProps {
  stageIdx: number;
  stageStep: string;
  stageTitle: string;
  liquidPercent: number; // 0 - 100
  liquidColor?: string;
}

const STAGE_COLORS = [
  '#FF9F1C', // Stage 1: Golden Harvest Turmeric
  '#2D6A4F', // Stage 2: 15,000 PSI Kale Press
  '#9D0208', // Stage 3: Non-Thermal Ruby Beet HPP
  '#E09F3E', // Stage 4: Chilled Amber Glass Sealed
];

// ---------------------------------------------------------------------------
// 1. Procedural Texture Generators
// ---------------------------------------------------------------------------

function createCondensationBump(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Scattered fine dew droplets
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * 512;
    const y = 80 + Math.random() * 380;
    const r = Math.random() * 3.5 + 1.2;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.7, '#A0A0A0');
    grad.addColorStop(1, '#808080');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

function createOrangeSliceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 246;

  ctx.fillStyle = '#FF7500';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#FF7A00';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFF8E7';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
  ctx.fill();

  const segments = 10;
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2 + 0.04;
    const a2 = ((i + 1) / segments) * Math.PI * 2 - 0.04;

    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.88, a1, a2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFA726';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.74, a1 + 0.03, a2 - 0.03);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.55, a1 + 0.05, a2 - 0.05);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = '#FFF8E7';
  ctx.lineWidth = 3.5;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * (r * 0.90), cy + Math.sin(angle) * (r * 0.90));
    ctx.stroke();
  }

  ctx.fillStyle = '#FFF8E7';
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

function createGreenAppleSliceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 246;

  ctx.fillStyle = '#6BA32D';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#6BA32D';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#F4F9EA';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E0EDC7';
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4A2A0B';
  ctx.beginPath();
  ctx.ellipse(cx - 14, cy, 6, 12, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 14, cy, 6, 12, 0.4, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

function createPomegranateHalfTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 246;

  ctx.fillStyle = '#73091B';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#8A0E23';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFF5E1';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.91, 0, Math.PI * 2);
  ctx.fill();

  const seedColors = ['#9A031E', '#C00427', '#E01E37', '#73091B', '#A71D31'];
  for (let i = 0; i < 220; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * (r * 0.82);
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const seedR = Math.random() * 11 + 7;

    ctx.fillStyle = seedColors[Math.floor(Math.random() * seedColors.length)];
    ctx.beginPath();
    ctx.arc(x, y, seedR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 230, 235, 0.75)';
    ctx.beginPath();
    ctx.arc(x - seedR * 0.3, y - seedR * 0.3, seedR * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// ---------------------------------------------------------------------------
// 2. 3D Glass & Liquid Lathe Geometries
// ---------------------------------------------------------------------------

function createHighballGlassGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];

  // Bottom base (solid thick crystal glass sham from y = 0 to 0.58)
  points.push(new THREE.Vector2(0, 0.05));
  points.push(new THREE.Vector2(0.68, 0.04));
  points.push(new THREE.Vector2(0.96, 0.02));
  points.push(new THREE.Vector2(1.06, 0.08));

  // Outer straight upward taper to 1.28 radius at rim y = 4.10
  points.push(new THREE.Vector2(1.08, 0.9));
  points.push(new THREE.Vector2(1.14, 2.0));
  points.push(new THREE.Vector2(1.21, 3.2));
  points.push(new THREE.Vector2(1.27, 4.05));

  // Polished rounded rim bead
  points.push(new THREE.Vector2(1.26, 4.10));
  points.push(new THREE.Vector2(1.22, 4.10));
  points.push(new THREE.Vector2(1.20, 4.05));

  // Inner glass cavity wall
  points.push(new THREE.Vector2(1.16, 3.2));
  points.push(new THREE.Vector2(1.08, 2.0));
  points.push(new THREE.Vector2(1.01, 0.9));
  points.push(new THREE.Vector2(0.96, 0.58)); // Heavy sham floor

  // Inner bottom sham floor
  points.push(new THREE.Vector2(0.55, 0.55));
  points.push(new THREE.Vector2(0, 0.55));

  const geo = new THREE.LatheGeometry(points, 64);
  geo.computeVertexNormals();
  geo.translate(0, -1.95, 0);
  return geo;
}

function createTumblerLiquidGeometry(fillFraction = 0.88): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const baseFloorY = 0.56;
  const maxFluidY = 3.95;
  const clampedFraction = Math.max(0.10, Math.min(0.92, fillFraction));
  const topY = baseFloorY + clampedFraction * (maxFluidY - baseFloorY);

  points.push(new THREE.Vector2(0, baseFloorY + 0.01));
  points.push(new THREE.Vector2(0.55, baseFloorY + 0.01));
  points.push(new THREE.Vector2(0.95, baseFloorY + 0.02));

  // Middle wall point
  const midY = (baseFloorY + topY) * 0.5;
  const midR = 0.96 + ((midY - 0.58) / (4.10 - 0.58)) * (1.20 - 0.96);
  points.push(new THREE.Vector2(midR - 0.008, midY));

  // Top surface radius
  const topR = 0.96 + ((topY - 0.58) / (4.10 - 0.58)) * (1.20 - 0.96);
  points.push(new THREE.Vector2(topR - 0.008, topY));

  // Natural concave meniscus curve touching glass
  points.push(new THREE.Vector2(topR * 0.88, topY - 0.015));
  points.push(new THREE.Vector2(0, topY - 0.025));

  const geo = new THREE.LatheGeometry(points, 64);
  geo.computeVertexNormals();
  geo.translate(0, -1.95, 0);
  return geo;
}

// ---------------------------------------------------------------------------
// 3. Realistic Sliced Half-Fruit Builder
// ---------------------------------------------------------------------------

function createRealisticHalfFruit(
  radius: number,
  faceTexture: THREE.CanvasTexture,
  peelColor: string,
  peelRoughness = 0.35
): THREE.Group {
  const halfGroup = new THREE.Group();

  // Curved hemisphere peel back dome
  const peelGeo = new THREE.SphereGeometry(
    radius,
    36,
    18,
    0,
    Math.PI * 2,
    Math.PI * 0.5,
    Math.PI * 0.5
  );
  const peelMat = new THREE.MeshStandardMaterial({
    color: peelColor,
    roughness: peelRoughness,
    metalness: 0.02,
  });
  const peelMesh = new THREE.Mesh(peelGeo, peelMat);
  peelMesh.castShadow = true;
  halfGroup.add(peelMesh);

  // Beveled peel rim edge
  const rimGeo = new THREE.TorusGeometry(radius * 0.985, radius * 0.032, 12, 36);
  const rimMat = new THREE.MeshStandardMaterial({
    color: peelColor,
    roughness: peelRoughness,
  });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = 0.002;
  halfGroup.add(rimMesh);

  // Flat juicy cut face
  const faceGeo = new THREE.CircleGeometry(radius * 0.98, 36);
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.22,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });
  const faceMesh = new THREE.Mesh(faceGeo, faceMat);
  faceMesh.rotation.x = -Math.PI / 2;
  faceMesh.position.y = 0.005;
  faceMesh.castShadow = true;
  halfGroup.add(faceMesh);

  return halfGroup;
}

// Stage 0: Golden Harvest (Whole Orange + Sliced Half + Turmeric Root)
function createGoldenRootsStageFruit(): THREE.Group {
  const group = new THREE.Group();

  // Whole orange
  const orangeGeo = new THREE.SphereGeometry(0.65, 32, 28);
  const orangeMat = new THREE.MeshStandardMaterial({ color: '#FF7A00', roughness: 0.36 });
  const wholeOrange = new THREE.Mesh(orangeGeo, orangeMat);
  wholeOrange.position.set(0, 0.65, 0);
  wholeOrange.castShadow = true;
  group.add(wholeOrange);

  // Curved half-orange
  const sliceTex = createOrangeSliceTexture();
  const slice = createRealisticHalfFruit(0.54, sliceTex, '#FF7500', 0.36);
  slice.position.set(0.42, 0.28, 0.48);
  slice.rotation.x = 0.55;
  slice.rotation.y = -0.22;
  slice.rotation.z = -0.32;
  group.add(slice);

  // Turmeric root
  const rootGeo = new THREE.CapsuleGeometry(0.11, 0.65, 8, 16);
  const rootMat = new THREE.MeshStandardMaterial({ color: '#C97A14', roughness: 0.6 });
  const root = new THREE.Mesh(rootGeo, rootMat);
  root.position.set(-0.15, 0.10, 0.72);
  root.rotation.set(0.3, 0.6, 1.35);
  root.castShadow = true;
  group.add(root);

  return group;
}

// Stage 1: Emerald Kale Press (Green Apple + Crisp Half + Cucumber)
function createEmeraldCanopyStageFruit(): THREE.Group {
  const group = new THREE.Group();

  const appleGeo = new THREE.SphereGeometry(0.65, 32, 28);
  const appleMat = new THREE.MeshStandardMaterial({ color: '#6BA32D', roughness: 0.24 });
  const wholeApple = new THREE.Mesh(appleGeo, appleMat);
  wholeApple.position.set(0, 0.65, 0);
  wholeApple.castShadow = true;
  group.add(wholeApple);

  const sliceTex = createGreenAppleSliceTexture();
  const slice = createRealisticHalfFruit(0.52, sliceTex, '#6BA32D', 0.26);
  slice.position.set(0.42, 0.26, 0.46);
  slice.rotation.x = 0.52;
  slice.rotation.y = -0.22;
  slice.rotation.z = -0.32;
  group.add(slice);

  return group;
}

// Stage 2: Ruby Beet Press (Pomegranate + Cracked Half)
function createRubyBeetStageFruit(): THREE.Group {
  const group = new THREE.Group();

  const pomGeo = new THREE.DodecahedronGeometry(0.68, 3);
  const pomMat = new THREE.MeshStandardMaterial({ color: '#8A0E23', roughness: 0.30 });
  const wholePom = new THREE.Mesh(pomGeo, pomMat);
  wholePom.position.set(0, 0.65, 0);
  wholePom.castShadow = true;
  group.add(wholePom);

  const halfTex = createPomegranateHalfTexture();
  const halfPom = createRealisticHalfFruit(0.55, halfTex, '#8A0E23', 0.32);
  halfPom.position.set(0.42, 0.26, 0.46);
  halfPom.rotation.x = 0.52;
  halfPom.rotation.y = -0.22;
  halfPom.rotation.z = -0.32;
  group.add(halfPom);

  return group;
}

// ---------------------------------------------------------------------------
// Main Component: 3D Juice Glass Canvas for the Cold-Press Journey
// ---------------------------------------------------------------------------

export const JourneyBottle3D: React.FC<JourneyBottle3DProps> = ({
  stageIdx,
  liquidPercent,
  liquidColor,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const stageGroupRef = useRef<THREE.Group | null>(null);

  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const iceCubesRef = useRef<THREE.Mesh[]>([]);
  const fruitGroupsRef = useRef<THREE.Group[]>([]);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Dynamic Liquid fill interpolation
  const currentFractionRef = useRef<number>(Math.max(0.15, liquidPercent / 100));
  const targetFractionRef = useRef<number>(Math.max(0.15, liquidPercent / 100));

  // Interactive Drag & Inertia
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.12, y: 0.35 });
  const rotationCurrentRef = useRef({ x: 0.12, y: 0.35 });
  const sloshVelRef = useRef({ x: 0, z: 0 });

  const activeColorHex = liquidColor || STAGE_COLORS[stageIdx % STAGE_COLORS.length] || '#FF9F1C';

  // Keep target liquid fraction in sync with prop updates
  useEffect(() => {
    targetFractionRef.current = Math.max(0.18, Math.min(0.92, liquidPercent / 100));
  }, [liquidPercent]);

  // Keep liquid material color in sync with prop updates
  useEffect(() => {
    if (liquidMaterialRef.current) {
      const color = new THREE.Color(activeColorHex);
      liquidMaterialRef.current.color = color;
      liquidMaterialRef.current.attenuationColor = color.clone().multiplyScalar(0.72);
      liquidMaterialRef.current.emissive = color.clone().multiplyScalar(0.24);
    }
    if (pointLightRef.current) {
      pointLightRef.current.color = new THREE.Color(activeColorHex);
    }
  }, [activeColorHex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const isMobile = width < 640;
    const aspect = width / height;

    // 2. Camera with responsive aspect-ratio framing
    const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    const minW = isMobile ? 3.6 : 4.2;
    const reqZ = (minW * 0.5) / (Math.tan(THREE.MathUtils.degToRad(17.5)) * Math.min(aspect, 1.35));
    const cameraZ = Math.max(5.6, Math.min(7.4, reqZ));
    camera.position.set(0, 0.32, cameraZ);
    camera.lookAt(0, 0.05, 0);

    // 3. Hardware-Optimized Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Studio PMREM Environment Map (Crystal Glass Specular & Refraction)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xfcf9f2);

    // Overhead softbox
    const envTop = new THREE.DirectionalLight(0xfff6ea, 4.0);
    envTop.position.set(0, 10, 3);
    envScene.add(envTop);

    // Left vertical strip softbox (crisp specular highlight down the glass)
    const stripBox = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    stripBox.position.set(-4.5, 0.5, 3.5);
    stripBox.lookAt(0, 0, 0);
    envScene.add(stripBox);

    // Right warm bounce softbox
    const rightBox = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 9),
      new THREE.MeshBasicMaterial({ color: 0xffeedd })
    );
    rightBox.position.set(5.0, 0.5, 3.0);
    rightBox.lookAt(0, 0, 0);
    envScene.add(rightBox);

    // Backlight rim softbox
    const rimBox = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    rimBox.position.set(0, 2.0, -6.0);
    rimBox.lookAt(0, 0, 0);
    envScene.add(rimBox);

    const envTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 5. Studio Key & Rim Lights
    const ambient = new THREE.AmbientLight(0xfff8ee, 0.85);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 3.2);
    rimLight.position.set(-4, 5, -5);
    scene.add(rimLight);

    // Internal glow point light
    const pointLight = new THREE.PointLight(activeColorHex, 2.8, 5.0);
    pointLight.position.set(0, 0.2, 0);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 6. Stage Group (Holds Glass + Fruits beside it)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(-0.22, -0.05, 0);
    scene.add(stageGroup);
    stageGroupRef.current = stageGroup;

    // Soft Studio Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(7.5, 7.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 110);
    sGrad.addColorStop(0, 'rgba(30, 20, 15, 0.42)');
    sGrad.addColorStop(0.4, 'rgba(35, 22, 18, 0.22)');
    sGrad.addColorStop(0.7, 'rgba(40, 25, 20, 0.05)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.94;
    stageGroup.add(shadowMesh);

    // 7. Photorealistic Crystal Highball Glass
    const glassGeo = createHighballGlassGeometry();
    const condensationTex = createCondensationBump();

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.012,
      transmission: 0.98,
      ior: 1.515,
      thickness: 0.95,
      specularIntensity: 2.2,
      specularColor: 0xffffff,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      attenuationColor: new THREE.Color(0xfcfaf5),
      attenuationDistance: 6.0,
      bumpMap: condensationTex,
      bumpScale: 0.005,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.castShadow = true;
    glassMesh.receiveShadow = true;
    glassMesh.renderOrder = 2;
    stageGroup.add(glassMesh);

    // 8. Cold-Pressed Luminous Juice Liquid Volume
    const initialFraction = Math.max(0.18, Math.min(0.92, liquidPercent / 100));
    const liquidGeo = createTumblerLiquidGeometry(initialFraction);

    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeColorHex),
      metalness: 0.0,
      roughness: 0.04,
      transmission: 0.62,
      ior: 1.34,
      thickness: 2.6,
      attenuationDistance: 1.5,
      attenuationColor: new THREE.Color(activeColorHex).multiplyScalar(0.72),
      emissive: new THREE.Color(activeColorHex).multiplyScalar(0.24),
      transparent: true,
      opacity: 0.96,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.renderOrder = 1;
    stageGroup.add(liquidMesh);
    liquidMeshRef.current = liquidMesh;
    liquidMaterialRef.current = liquidMat;

    // 9. Frosted Crystal Sugar / Ice Rim Band
    const rimTorusGeo = new THREE.TorusGeometry(1.23, 0.038, 16, 64);
    const rimTorusMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      opacity: 0.85,
    });
    const frostedRimMesh = new THREE.Mesh(rimTorusGeo, rimTorusMat);
    frostedRimMesh.rotation.x = Math.PI / 2;
    frostedRimMesh.position.y = 2.14;
    stageGroup.add(frostedRimMesh);

    // 10. Crystal-Clear Rounded Floating Ice Cubes
    const iceGeo = new THREE.BoxGeometry(0.44, 0.44, 0.44, 4, 4, 4);
    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.96,
      ior: 1.31,
      thickness: 0.45,
      transparent: true,
      opacity: 0.92,
    });

    const iceCubes: THREE.Mesh[] = [];
    const iceConfigs = [
      { pos: [-0.32, 1.25, 0.2], rot: [0.35, 0.4, -0.2] },
      { pos: [0.30, 1.18, -0.15], rot: [-0.2, 0.6, 0.35] },
      { pos: [0.05, 0.95, 0.25], rot: [0.5, -0.3, 0.1] },
    ];

    iceConfigs.forEach((cfg) => {
      const cube = new THREE.Mesh(iceGeo, iceMat);
      cube.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      cube.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      cube.castShadow = true;
      cube.renderOrder = 1;
      stageGroup.add(cube);
      iceCubes.push(cube);
    });
    iceCubesRef.current = iceCubes;

    // 11. Effervescent Rising Micro-bubbles
    const bubbleCount = 35;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const bubbleVelocities = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
      bubblePositions[i * 3 + 0] = (Math.random() - 0.5) * 1.4;
      bubblePositions[i * 3 + 1] = -1.4 + Math.random() * 2.6;
      bubblePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
      bubbleVelocities[i] = 0.012 + Math.random() * 0.022;
    }
    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));

    const bCanvas = document.createElement('canvas');
    bCanvas.width = 32;
    bCanvas.height = 32;
    const bCtx = bCanvas.getContext('2d')!;
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    bCtx.beginPath();
    bCtx.arc(16, 16, 14, 0, Math.PI * 2);
    bCtx.fill();
    const bubbleTex = new THREE.CanvasTexture(bCanvas);

    const bubbleMat = new THREE.PointsMaterial({
      map: bubbleTex,
      size: 0.065,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    stageGroup.add(bubbles);

    // 12. Fruit Groups (Resting beside the glass base on tabletop)
    const fruitBuilders = [
      createGoldenRootsStageFruit, // Stage 0: Golden Roots
      createEmeraldCanopyStageFruit, // Stage 1: Emerald Canopy
      createRubyBeetStageFruit, // Stage 2: Ruby Beet
      createGoldenRootsStageFruit, // Stage 3: Chilled Nectar
    ];

    const fruitGroups: THREE.Group[] = [];
    fruitBuilders.forEach((builder, idx) => {
      const fGroup = builder();
      fGroup.position.set(1.15, -1.95, 0.15);
      const initialScale = idx === (stageIdx % fruitBuilders.length) ? 1 : 0;
      fGroup.scale.set(initialScale, initialScale, initialScale);
      stageGroup.add(fGroup);
      fruitGroups.push(fGroup);
    });
    fruitGroupsRef.current = fruitGroups;

    // ---------------------------------------------------------
    // Event Handlers for Drag & Inertia
    // ---------------------------------------------------------
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      rotationTargetRef.current.y = Math.max(
        -0.85,
        Math.min(0.85, rotationTargetRef.current.y + deltaX * 0.007)
      );
      rotationTargetRef.current.x = Math.max(
        -0.15,
        Math.min(0.35, rotationTargetRef.current.x + deltaY * 0.005)
      );

      sloshVelRef.current.x += deltaX * 0.003;
      sloshVelRef.current.z += deltaY * 0.003;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      rotationTargetRef.current.y = Math.max(
        -0.85,
        Math.min(0.85, rotationTargetRef.current.y + deltaX * 0.007)
      );
      rotationTargetRef.current.x = Math.max(
        -0.15,
        Math.min(0.35, rotationTargetRef.current.x + deltaY * 0.005)
      );

      sloshVelRef.current.x += deltaX * 0.004;
      sloshVelRef.current.z += deltaY * 0.004;

      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ---------------------------------------------------------
    // Animation Loop
    // ---------------------------------------------------------
    let animationFrameId: number;
    let lastTime = performance.now();
    let isVisible = true;

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    visibilityObserver.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const time = now * 0.001;

      // 1. Damped rotation inertia
      rotationCurrentRef.current.x +=
        (rotationTargetRef.current.x - rotationCurrentRef.current.x) * 0.08;
      rotationCurrentRef.current.y +=
        (rotationTargetRef.current.y - rotationCurrentRef.current.y) * 0.08;

      if (stageGroupRef.current) {
        stageGroupRef.current.rotation.x = rotationCurrentRef.current.x;
        stageGroupRef.current.rotation.y = rotationCurrentRef.current.y;
      }

      // 2. Liquid fill interpolation on scroll scrub
      const fractionDiff = targetFractionRef.current - currentFractionRef.current;
      if (Math.abs(fractionDiff) > 0.004) {
        currentFractionRef.current += fractionDiff * 0.1;
        if (liquidMeshRef.current) {
          liquidMeshRef.current.geometry.dispose();
          liquidMeshRef.current.geometry = createTumblerLiquidGeometry(currentFractionRef.current);
        }
      }

      // 3. Slosh dynamics
      sloshVelRef.current.x *= 0.92;
      sloshVelRef.current.z *= 0.92;

      // 4. Floating ice cube oscillation
      iceCubes.forEach((cube, i) => {
        const basePos = iceConfigs[i].pos;
        cube.position.y =
          basePos[1] +
          Math.sin(time * 2.2 + i * 1.5) * 0.035 +
          sloshVelRef.current.x * 0.1;
        cube.rotation.x = iceConfigs[i].rot[0] + Math.sin(time * 1.5 + i) * 0.05;
        cube.rotation.z = iceConfigs[i].rot[2] + Math.cos(time * 1.5 + i) * 0.05;
      });

      // 5. Effervescent micro-bubbles rising
      const posAttr = bubbleGeo.attributes.position;
      for (let i = 0; i < bubbleCount; i++) {
        let y = posAttr.getY(i) + bubbleVelocities[i];
        if (y > 1.8) y = -1.4;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      // 6. Fruit transition scaling between stages
      const activeStageMod = stageIdx % fruitBuilders.length;
      fruitGroups.forEach((fGroup, idx) => {
        const isTarget = idx === activeStageMod;
        const curScale = fGroup.scale.x;
        const targetScale = isTarget ? 1 : 0;
        const newScale = curScale + (targetScale - curScale) * (delta * 5.5);
        fGroup.scale.set(newScale, newScale, newScale);
        fGroup.visible = newScale > 0.005;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ---------------------------------------------------------
    // Resize Handler
    // ---------------------------------------------------------
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const isMob = w < 640;
      const asp = w / h;
      camera.aspect = asp;
      const minW = isMob ? 3.6 : 4.2;
      const reqZ = (minW * 0.5) / (Math.tan(THREE.MathUtils.degToRad(17.5)) * Math.min(asp, 1.35));
      camera.position.z = Math.max(5.6, Math.min(7.4, reqZ));
      if (stageGroupRef.current) {
        stageGroupRef.current.position.x = isMob ? -0.15 : -0.22;
      }
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none relative"
      onClick={() => playPopSound()}
    />
  );
};

// Aliased export for flexibility
export const JourneyGlass3D = JourneyBottle3D;
