import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { Play, Plus, RotateCcw, Zap, Thermometer, Gauge, Activity, ShieldCheck, Check } from 'lucide-react';
import { playPopSound, playChimeSound, startPourSound, stopPourSound, playCapSnapSound, playGlassClinkSound } from '../utils/audio';

// 1. Closed double-walled Boston Round glass lathe geometry
function createDoubleWalledBottleGeometry(): THREE.BufferGeometry {
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
      3 * (1 - t) * Math.pow(t, 2) * p2.x +
      Math.pow(t, 3) * p3.x;
    const y =
      Math.pow(1 - t, 3) * ip0.y +
      3 * Math.pow(1 - t, 2) * t * ip1.y +
      3 * (1 - t) * Math.pow(t, 2) * p2.y +
      Math.pow(t, 3) * p3.y;
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

// 2. Volumetric fluid geometry adapting smoothly to fill percentage
function createFluidGeometry(fillFraction: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const innerRadius = 0.915;

  points.push(new THREE.Vector2(0, 0.15));
  points.push(new THREE.Vector2(0.35, 0.13));
  points.push(new THREE.Vector2(0.84, 0.11));
  points.push(new THREE.Vector2(innerRadius, 0.18));

  const maxFluidY = 3.52;
  const minFluidY = 0.35;
  const safeFraction = Math.max(0.01, Math.min(0.96, fillFraction));
  const currentTopY = minFluidY + safeFraction * (maxFluidY - minFluidY);

  if (currentTopY <= 2.65) {
    points.push(new THREE.Vector2(innerRadius, currentTopY));
    points.push(new THREE.Vector2(innerRadius * 0.82, currentTopY - 0.012));
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

// 3. Liquid Top Meniscus Disc Geometry (Rises dynamically with fluid level)
function createLiquidMeniscusGeometry(topRadius: number): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(topRadius, topRadius, 0.035, 64, 4);
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

  const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
  grad.addColorStop(0, deep.getStyle());
  grad.addColorStop(0.3, base.getStyle());
  grad.addColorStop(0.85, base.getStyle());
  grad.addColorStop(1, bright.getStyle());

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Suspended botanical pulp particles
  ctx.fillStyle = bright.getStyle();
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 2.2 + 0.6;
    ctx.globalAlpha = Math.random() * 0.45 + 0.15;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Heavy pulp sediment near bottom
  ctx.fillStyle = deep.getStyle();
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * canvas.width;
    const y = canvas.height * (0.6 + Math.random() * 0.4);
    const r = Math.random() * 3.2 + 0.8;
    ctx.globalAlpha = Math.random() * 0.5 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

// 5. Procedural Condensation Droplet Bump Texture
function createCondensationBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 280; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 4.2 + 1.2;

    const beadGrad = ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      radius * 0.1,
      x,
      y,
      radius
    );
    beadGrad.addColorStop(0, '#ffffff');
    beadGrad.addColorStop(0.7, '#a0a0a0');
    beadGrad.addColorStop(1, '#606060');

    ctx.fillStyle = beadGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
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

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(24, 22, 5, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

export const BottleLiquidSimulator: React.FC = () => {
  const { addToCart, showToast } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [fillLevel, setFillLevel] = useState(92); // 0 to 100%
  const [isPressing, setIsPressing] = useState(false);
  const [pressureReadout, setPressureReadout] = useState('15,000 PSI');
  const [chamberTemp, setChamberTemp] = useState('2.2°C');
  const [streamVelocity, setStreamVelocity] = useState('0 mL/s');

  // WebGL Canvas and Mesh References
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const meniscusMeshRef = useRef<THREE.Mesh | null>(null);
  const innerGlowMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const frontLabelMeshRef = useRef<THREE.Mesh | null>(null);
  const bubblesGroupRef = useRef<THREE.Points | null>(null);
  const pourStreamMeshRef = useRef<THREE.Mesh | null>(null);
  const splashRingMeshRef = useRef<THREE.Mesh | null>(null);
  const capGroupRef = useRef<THREE.Group | null>(null);

  // Interaction State
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.04, y: 0.08 });
  const rotationCurrentRef = useRef({ x: 0.04, y: 0.08 });

  // Animation State Refs
  const currentLiquidFractionRef = useRef(0.92);
  const targetLiquidFractionRef = useRef(0.92);
  const targetColorRef = useRef(new THREE.Color(PRODUCTS[0].colorHex));
  const currentColorRef = useRef(new THREE.Color(PRODUCTS[0].colorHex));

  // Pour Machine State: 'idle' | 'unsealing' | 'pouring' | 'sealing'
  const pourStateRef = useRef<'idle' | 'unsealing' | 'pouring' | 'sealing'>('idle');
  const pourStartTimeRef = useRef(0);
  const capTargetYRef = useRef(2.00); // 2.00 = sealed, 3.35 = raised into dispenser
  const capCurrentYRef = useRef(2.00);
  const bottleBounceRef = useRef(1.0);
  const effervescenceRef = useRef(1.0);

  // Change product formula
  const handleSelectProduct = (p: Product) => {
    if (isPressing) return;
    setSelectedProduct(p);
    playPopSound();
    targetColorRef.current.set(p.colorHex);

    if (liquidMaterialRef.current) {
      liquidMaterialRef.current.map = createPulpTexture(p.colorHex);
      liquidMaterialRef.current.needsUpdate = true;
    }
  };

  // Trigger Complete 15,000 PSI Cold Press Pour Simulation
  const handleSimulatePress = () => {
    if (isPressing) return;
    setIsPressing(true);
    playPopSound();

    // Align bottle directly under dispenser spout
    rotationTargetRef.current = { x: 0.02, y: 0.0 };

    // 1. Unseal Cap & Instantly Flush / Reset Fluid to 0% Empty
    pourStateRef.current = 'unsealing';
    pourStartTimeRef.current = performance.now();
    capTargetYRef.current = 3.35; // Lift cap up into dispenser dock
    setPressureReadout('VALVE OPENING...');
    setStreamVelocity('0 mL/s');
    setChamberTemp('2.2°C');

    // Rapid drain to empty
    currentLiquidFractionRef.current = 0.01;
    setFillLevel(0);
    if (liquidMeshRef.current) {
      liquidMeshRef.current.geometry.dispose();
      liquidMeshRef.current.geometry = createFluidGeometry(0.01);
    }
    if (meniscusMeshRef.current) {
      meniscusMeshRef.current.position.y = -2.18 + 0.35;
    }

    // 2. Start Active Hydraulic Pour Stream after 350ms unseal
    setTimeout(() => {
      pourStateRef.current = 'pouring';
      pourStartTimeRef.current = performance.now();
      startPourSound();
      setPressureReadout('15,240 PSI ACTIVE');
      setChamberTemp('2.0°C');
      setStreamVelocity('182 mL/s');
      effervescenceRef.current = 4.5;
    }, 350);
  };

  // Generate Front Paper Label Texture
  const createLabelTexture = (productName: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(12, 10, 9, 0.035)';
    for (let i = 0; i < 600; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    ctx.strokeStyle = '#171412';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

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
    ctx.fillText('MUMBAI, INDIA • EST. 2024', 512, 100);

    ctx.fillStyle = '#0C0A09';
    ctx.font = '900 66px "Sink", "Changa One", Impact, sans-serif';
    ctx.fillText('FRUITS & ROOTS', 512, 175);

    ctx.font = 'italic 700 28px "Fraunces", Georgia, serif';
    ctx.fillStyle = '#C8741B';
    ctx.fillText('Raw Cold-Pressed Living Botanicals', 512, 222);

    ctx.fillStyle = '#171412';
    ctx.fillRect(160, 255, 704, 52);
    ctx.fillStyle = '#FAF6EE';
    ctx.font = '800 21px "Space Grotesk", monospace';
    ctx.fillText(productName.toUpperCase(), 512, 290);

    ctx.fillStyle = '#0C0A09';
    ctx.font = '700 21px "Space Grotesk", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('• 15,000 PSI HYDRAULIC PRESSURE', 180, 360);
    ctx.fillText('• 0.0°C THERMAL HEAT DESTRUCTION', 180, 400);
    ctx.fillText('• 1.8 KG CERTIFIED ORGANIC BOTANY', 180, 440);
    ctx.fillText('• 100% UNPASTEURISED LIVING ENZYMES', 180, 480);

    ctx.textAlign = 'center';
    ctx.font = '800 28px "Space Grotesk", monospace';
    ctx.fillStyle = '#0C0A09';
    ctx.fillText('473 ML (16 FL OZ)', 512, 560);

    ctx.font = '700 16px "Space Grotesk", monospace';
    ctx.fillStyle = '#5E544D';
    ctx.fillText('BOROSILICATE GLASS • ₹25 CIRCULAR BOTTLE RETURN', 512, 595);

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
  };

  // Initialize WebGL Scene
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xf5eedf);

    const envLightTop = new THREE.DirectionalLight(0xfff8ee, 3.5);
    envLightTop.position.set(0, 8, 2);
    envScene.add(envLightTop);

    const stripBox = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    stripBox.position.set(-4.2, 0.5, 3.2);
    stripBox.lookAt(0, 0, 0);
    envScene.add(stripBox);

    const rightBox = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 8),
      new THREE.MeshBasicMaterial({ color: 0xfff0db })
    );
    rightBox.position.set(4.6, 0.8, 2.8);
    rightBox.lookAt(0, 0, 0);
    envScene.add(rightBox);

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

    // Studio Lights
    const keyLight = new THREE.DirectionalLight(0xfff6ec, 2.8);
    keyLight.position.set(3.5, 5, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf7ebe0, 1.4);
    fillLight.position.set(-4, -0.5, 3.5);
    scene.add(fillLight);

    const backRimLight = new THREE.DirectionalLight(0xffedd5, 3.2);
    backRimLight.position.set(0, 2.5, -4.5);
    scene.add(backRimLight);

    // Floor Shadow
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

    // Stainless Steel Hydraulic Dispenser Head (Fixed in place above bottle)
    const dispenserGroup = new THREE.Group();
    dispenserGroup.position.set(0, 2.70, 0);

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xdde2ea,
      metalness: 0.95,
      roughness: 0.16,
    });

    const dispenserHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.45, 32),
      steelMat
    );
    dispenserGroup.add(dispenserHead);

    const spout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.13, 0.35, 32),
      steelMat
    );
    spout.position.y = -0.38;
    dispenserGroup.add(spout);

    const nozzleRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.37, 0.035, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.98, roughness: 0.08 })
    );
    nozzleRing.rotation.x = Math.PI / 2;
    dispenserGroup.add(nozzleRing);

    scene.add(dispenserGroup);

    // Master Bottle Group
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // ----------------------------------------------------
    // REALISTIC JUICE ENGINE (Volumetric Depth, Pulp & Meniscus)
    // ----------------------------------------------------
    const pulpTexture = createPulpTexture(selectedProduct.colorHex);

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

    let fluidGeo = createFluidGeometry(currentLiquidFractionRef.current);
    const fluidMesh = new THREE.Mesh(fluidGeo, liquidMat);
    fluidMesh.renderOrder = 1;
    bottleGroup.add(fluidMesh);
    liquidMeshRef.current = fluidMesh;

    // Glowing Inner Subsurface Core
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

    // Top Liquid Meniscus Disc
    const minFluidY = 0.35;
    const maxFluidY = 3.52;
    const initialSurfaceY = (minFluidY + currentLiquidFractionRef.current * (maxFluidY - minFluidY)) - 2.18;
    const meniscusGeo = createLiquidMeniscusGeometry(0.88);
    const meniscusMat = new THREE.MeshPhysicalMaterial({
      color: currentColorRef.current.clone().lerp(new THREE.Color(0xffffff), 0.15),
      roughness: 0.08,
      clearcoat: 1.0,
      emissive: currentColorRef.current.clone().multiplyScalar(0.22),
    });
    const meniscusMesh = new THREE.Mesh(meniscusGeo, meniscusMat);
    meniscusMesh.position.y = initialSurfaceY;
    meniscusMesh.renderOrder = 2;
    meniscusMeshRef.current = meniscusMesh;
    bottleGroup.add(meniscusMesh);

    // ----------------------------------------------------
    // DYNAMIC POUR STREAM & IMPACT SPLASH RING
    // ----------------------------------------------------
    const streamGeo = new THREE.CylinderGeometry(0.09, 0.11, 2.8, 24);
    const streamMat = new THREE.MeshStandardMaterial({
      color: currentColorRef.current,
      emissive: currentColorRef.current.clone().multiplyScalar(0.35),
      roughness: 0.12,
      metalness: 0.0,
    });
    const pourStreamMesh = new THREE.Mesh(streamGeo, streamMat);
    pourStreamMesh.visible = false;
    pourStreamMesh.renderOrder = 2;
    scene.add(pourStreamMesh); // Add to scene directly so stream stays vertically aligned with dispenser
    pourStreamMeshRef.current = pourStreamMesh;

    // Splash Foam Ring on the liquid surface
    const splashGeo = new THREE.RingGeometry(0.12, 0.42, 32);
    const splashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const splashRingMesh = new THREE.Mesh(splashGeo, splashMat);
    splashRingMesh.rotation.x = -Math.PI / 2;
    splashRingMesh.visible = false;
    splashRingMesh.renderOrder = 3;
    bottleGroup.add(splashRingMesh);
    splashRingMeshRef.current = splashRingMesh;

    // ----------------------------------------------------
    // BRUSHED BRONZE HERMETIC CAP (Animated during press)
    // ----------------------------------------------------
    const capGroup = new THREE.Group();
    capGroupRef.current = capGroup;
    capGroup.position.y = 2.00;

    const capMat = new THREE.MeshStandardMaterial({
      color: 0xc49646,
      metalness: 0.92,
      roughness: 0.22,
    });

    const capMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.368, 0.368, 0.34, 48),
      capMat
    );
    capGroup.add(capMesh);

    const capTopMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.383, 0.383, 0.06, 48),
      capMat
    );
    capTopMesh.position.y = 0.17 + 0.03;
    capGroup.add(capTopMesh);

    const ringMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.368, 0.368, 0.08, 48),
      new THREE.MeshStandardMaterial({ color: 0xa97830, metalness: 0.88, roughness: 0.32 })
    );
    ringMesh.position.y = -0.17 - 0.05;
    capGroup.add(ringMesh);

    bottleGroup.add(capGroup);

    // ----------------------------------------------------
    // ACTIVE ENZYME & PULP BUBBLES
    // ----------------------------------------------------
    const bubbleCount = 140;
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const bubbleVelocities = new Float32Array(bubbleCount);
    const bubbleAngles = new Float32Array(bubbleCount);
    const bubbleRadii = new Float32Array(bubbleCount);
    const bubbleSprite = createBubbleSpriteTexture();

    for (let i = 0; i < bubbleCount; i++) {
      const r = Math.sqrt(Math.random()) * 0.78;
      const angle = Math.random() * Math.PI * 2;
      bubbleRadii[i] = r;
      bubbleAngles[i] = angle;
      bubblePositions[i * 3 + 0] = Math.cos(angle) * r;
      bubblePositions[i * 3 + 1] = -1.9 + Math.random() * 2.2;
      bubblePositions[i * 3 + 2] = Math.sin(angle) * r;
      bubbleVelocities[i] = 0.004 + Math.random() * 0.008;
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
    const bubblePoints = new THREE.Points(bubbleGeo, bubbleMat);
    bubblePoints.renderOrder = 2;
    bottleGroup.add(bubblePoints);
    bubblesGroupRef.current = bubblePoints;

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

    const glassGeo = createDoubleWalledBottleGeometry();
    const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
    glassMesh.renderOrder = 4;
    bottleGroup.add(glassMesh);

    // Front Die-Cut Label
    const frontLabelTexture = createLabelTexture(selectedProduct.name);
    if (frontLabelTexture) {
      const frontLabelGeo = new THREE.CylinderGeometry(
        1.008,
        1.008,
        1.45,
        48,
        1,
        true,
        Math.PI * 0.75,
        Math.PI * 0.50
      );
      const frontLabelMat = new THREE.MeshStandardMaterial({
        map: frontLabelTexture,
        roughness: 0.72,
        metalness: 0.02,
        side: THREE.FrontSide,
      });
      const frontLabelMesh = new THREE.Mesh(frontLabelGeo, frontLabelMat);
      frontLabelMesh.position.y = -0.58;
      frontLabelMesh.renderOrder = 5;
      bottleGroup.add(frontLabelMesh);
      frontLabelMeshRef.current = frontLabelMesh;
    }

    bottleGroup.position.set(0, 0, 0);

    // Pointer Handlers
    const handlePointerDown = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current || pourStateRef.current === 'pouring') return;
      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      rotationTargetRef.current.y += deltaX * 0.012;
      rotationTargetRef.current.x = Math.max(
        -0.25,
        Math.min(0.25, rotationTargetRef.current.x + deltaY * 0.006)
      );

      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
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
    // RENDER & DYNAMIC FLUID POUR ANIMATION LOOP
    // ----------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const now = performance.now();
      const elapsedTime = clock.getElapsedTime();

      // Fluid State Machine
      if (pourStateRef.current === 'unsealing') {
        // Cap rises smoothly into dispenser
        const capDiff = capTargetYRef.current - capCurrentYRef.current;
        capCurrentYRef.current += capDiff * 0.16;
        if (capGroupRef.current) {
          capGroupRef.current.position.y = capCurrentYRef.current;
        }

        // Auto align bottle under nozzle
        rotationTargetRef.current.x += (0.02 - rotationTargetRef.current.x) * 0.12;
        rotationTargetRef.current.y += (0.0 - rotationTargetRef.current.y) * 0.12;
      } else if (pourStateRef.current === 'pouring') {
        const pourElapsed = (now - pourStartTimeRef.current) / 1000;
        const totalDuration = 2.6; // 2.6s organic pour duration
        const progress = Math.min(1.0, pourElapsed / totalDuration);

        // Natural hydraulic fluid filling curve: starts fast, eases gently at top
        const easeFill = progress < 0.65
          ? (progress / 0.65) * 0.70
          : 0.70 + (1 - Math.pow(1 - (progress - 0.65) / 0.35, 2)) * 0.22;

        currentLiquidFractionRef.current = 0.01 + easeFill;
        const currentPct = Math.min(92, Math.round(currentLiquidFractionRef.current * 100));
        setFillLevel(currentPct);

        // Recreate fluid geometry with rising fill fraction
        if (liquidMeshRef.current) {
          liquidMeshRef.current.geometry.dispose();
          liquidMeshRef.current.geometry = createFluidGeometry(currentLiquidFractionRef.current);
        }

        // Calculate exact real-time surface height
        const currentSurfaceY = (minFluidY + currentLiquidFractionRef.current * (maxFluidY - minFluidY)) - 2.18;

        // Position Meniscus Surface Cap
        if (meniscusMeshRef.current) {
          meniscusMeshRef.current.position.y = currentSurfaceY;
        }

        // Position & Scale Pour Stream from Dispenser Spout (y = 2.32) down to fluid surface
        const spoutTipY = 2.32;
        if (pourStreamMeshRef.current) {
          pourStreamMeshRef.current.visible = true;
          const streamLen = Math.max(0.12, spoutTipY - currentSurfaceY);
          pourStreamMeshRef.current.scale.set(
            1.0 + Math.sin(now * 0.035) * 0.12,
            streamLen / 2.8,
            1.0 + Math.cos(now * 0.035) * 0.12
          );
          pourStreamMeshRef.current.position.set(0, currentSurfaceY + streamLen / 2, 0);
        }

        // Position Splash Foam Ring on rising surface
        if (splashRingMeshRef.current) {
          splashRingMeshRef.current.visible = true;
          splashRingMeshRef.current.position.y = currentSurfaceY + 0.02;
          const splashPulse = 0.85 + Math.sin(now * 0.04) * 0.3;
          splashRingMeshRef.current.scale.set(splashPulse, splashPulse, 1);
        }

        // 15,000 PSI Hydraulic Compression Rumble
        if (bottleGroup) {
          bottleGroup.position.x = Math.sin(now * 0.08) * 0.005;
          bottleGroup.position.z = Math.cos(now * 0.09) * 0.005;
        }

        // Flow rate telemetry pulse
        const liveRate = Math.round(175 + Math.sin(now * 0.02) * 15);
        setStreamVelocity(`${liveRate} mL/s`);

        // Pour Completed?
        if (progress >= 1.0) {
          pourStateRef.current = 'sealing';
          pourStartTimeRef.current = now;
          stopPourSound();
          if (pourStreamMeshRef.current) pourStreamMeshRef.current.visible = false;
          if (splashRingMeshRef.current) splashRingMeshRef.current.visible = false;
          capTargetYRef.current = 2.00; // Cap moves down to seal
          setStreamVelocity('0 mL/s');
          setPressureReadout('15,000 PSI (HYDRAULIC SEALED)');
          setChamberTemp('2.2°C');
        }
      } else if (pourStateRef.current === 'sealing') {
        // Cap descends into place
        const capDiff = capTargetYRef.current - capCurrentYRef.current;
        capCurrentYRef.current += capDiff * 0.20;
        if (capGroupRef.current) {
          capGroupRef.current.position.y = capCurrentYRef.current;
        }

        if (Math.abs(capDiff) < 0.02) {
          capCurrentYRef.current = 2.00;
          if (capGroupRef.current) capGroupRef.current.position.y = 2.00;
          pourStateRef.current = 'idle';
          setIsPressing(false);
          bottleBounceRef.current = 1.06; // Elastic seal snap bounce
          playCapSnapSound();
          playGlassClinkSound();
          playChimeSound();
          showToast(`Bottled fresh! 473 ml of living ${selectedProduct.name} extracted under 15,000 PSI.`);
        }
      } else {
        // Idle State
        const capDiff = capTargetYRef.current - capCurrentYRef.current;
        if (Math.abs(capDiff) > 0.005) {
          capCurrentYRef.current += capDiff * 0.12;
          if (capGroupRef.current) {
            capGroupRef.current.position.y = capCurrentYRef.current;
          }
        }

        // Gentle ambient rotation
        if (!isDraggingRef.current) {
          rotationTargetRef.current.y += 0.0022;
        }
      }

      // Smooth inertia damping for bottle rotation
      rotationCurrentRef.current.x += (rotationTargetRef.current.x - rotationCurrentRef.current.x) * 0.08;
      rotationCurrentRef.current.y += (rotationTargetRef.current.y - rotationCurrentRef.current.y) * 0.08;

      // Elastic bounce decay
      bottleBounceRef.current += (1.0 - bottleBounceRef.current) * 0.12;
      effervescenceRef.current += (1.0 - effervescenceRef.current) * 0.04;

      if (bottleGroup) {
        bottleGroup.rotation.x = rotationCurrentRef.current.x;
        bottleGroup.rotation.y = rotationCurrentRef.current.y;
        if (pourStateRef.current === 'idle') {
          bottleGroup.position.set(0, Math.sin(elapsedTime * 1.5) * 0.03, 0);
        }
        const b = bottleBounceRef.current;
        bottleGroup.scale.set(1 / Math.sqrt(b), b, 1 / Math.sqrt(b));
      }

      // Animate active bubbles rising inside liquid
      if (bubblesGroupRef.current) {
        const positions = bubblesGroupRef.current.geometry.attributes.position.array as Float32Array;
        const currentSurfaceY = (minFluidY + currentLiquidFractionRef.current * (maxFluidY - minFluidY)) - 2.18;
        const eff = effervescenceRef.current;
        const swirlSpeed = 0.015 * eff;

        for (let i = 0; i < bubbleCount; i++) {
          bubbleAngles[i] += swirlSpeed;
          positions[i * 3 + 0] = Math.cos(bubbleAngles[i]) * bubbleRadii[i];
          positions[i * 3 + 2] = Math.sin(bubbleAngles[i]) * bubbleRadii[i];

          positions[i * 3 + 1] += bubbleVelocities[i] * eff;
          if (positions[i * 3 + 1] > currentSurfaceY) {
            positions[i * 3 + 1] = -1.95 + Math.random() * 0.1;
          }
        }
        bubblesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth color transitions
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

      if (streamMat) {
        streamMat.color.copy(currentColorRef.current);
        streamMat.emissive.copy(currentColorRef.current).multiplyScalar(0.35);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

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
  }, []);

  // Update Label when selected product changes
  useEffect(() => {
    if (frontLabelMeshRef.current) {
      const newTexture = createLabelTexture(selectedProduct.name);
      if (newTexture) {
        const mat = frontLabelMeshRef.current.material as THREE.MeshStandardMaterial;
        mat.map = newTexture;
        mat.needsUpdate = true;
      }
    }
  }, [selectedProduct]);

  return (
    <section id="our-process" className="py-20 sm:py-32 bg-brand-cream text-brand-950 relative overflow-hidden border-t border-b border-brand-950/10 select-none">
      <span id="alchemy-journey" className="sr-only" />
      {/* Background Archival Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.09] overflow-hidden select-none z-0">
        <span className="font-display text-[18vw] font-black uppercase tracking-tighter whitespace-nowrap text-[#C8741B] leading-none drop-shadow-xs">
          COLD PRESS LAB
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-brand-950/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 text-brand-cream text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Zap className="w-3.5 h-3.5 text-brand-amber" />
              <span>OUR PROCESS • 3D BOTTLE LAB &amp; SLOW COLD PRESS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-brand-950 uppercase tracking-tight leading-[0.9]">
              3D Bottle Lab: Gentle Cold Pressing
            </h2>
          </div>

          <p className="max-w-md text-sm text-brand-700 font-sans leading-relaxed">
            Explore our interactive 3D Bottle Lab. See how our slow, cold-press method extracts every drop of fresh, living juice at a chilled 2.2°C—bottled in pure reusable glass with zero heat and zero chemicals.
          </p>
        </div>

        {/* Top Formula Selector Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRODUCTS.slice(0, 5).map((p, idx) => {
            const isSelected = selectedProduct.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProduct(p)}
                className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-950 text-brand-cream border-brand-950 shadow-xl scale-[1.02]'
                    : 'bg-white text-brand-950 border-brand-950/15 hover:border-brand-950/30 hover:bg-brand-parchment'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[11px] font-mono font-black ${isSelected ? 'text-brand-amber' : 'text-brand-500'}`}>
                    /0{idx + 1}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: p.colorHex }}
                  />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm sm:text-base leading-snug uppercase tracking-tight">
                    {p.name}
                  </h4>
                  <span className={`text-[10px] font-mono block mt-1 uppercase tracking-wider ${isSelected ? 'text-brand-300' : 'text-brand-600'}`}>
                    {p.benefits[0] || 'Immunity'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Extraction Chamber Showcase */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-10 border border-brand-950/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Real Three.js WebGL 3D Glass Bottle Chamber */}
          <div className="lg:col-span-6 bg-brand-parchment/60 rounded-3xl p-6 border border-brand-950/10 shadow-inner relative overflow-hidden flex flex-col items-center justify-between min-h-[520px]">
            
            {/* Dynamic Ambient Juice Halo Glow */}
            <div
              className="absolute w-72 h-72 rounded-full blur-[120px] opacity-25 transition-all duration-1000 pointer-events-none"
              style={{ backgroundColor: selectedProduct.colorHex }}
            />

            {/* Chamber Status Bar */}
            <div className="w-full flex items-center justify-between text-xs font-mono pb-3 border-b border-brand-950/10 relative z-10">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPressing ? 'bg-red-500 animate-ping' : 'bg-brand-amber animate-pulse'}`} />
                <span className="font-bold text-brand-950 uppercase tracking-wider">
                  BAY 02 • {selectedProduct.name.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isPressing && (
                  <span className="font-mono text-[11px] text-brand-amber animate-pulse font-bold">
                    {streamVelocity}
                  </span>
                )}
                <span className="font-black px-2.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber border border-brand-amber/30 text-[11px]">
                  {fillLevel}% FILLED ({Math.round((fillLevel / 100) * 473)} mL)
                </span>
              </div>
            </div>

            {/* The Real Three.js WebGL 3D Bottle Canvas */}
            <div className="w-full h-[380px] sm:h-[420px] relative z-10 my-auto cursor-grab active:cursor-grabbing">
              <div
                ref={canvasMountRef}
                className="w-full h-full rounded-2xl overflow-hidden"
              />
            </div>

            {/* Bottom 3D Interactive Drag Hint */}
            <div className="w-full pt-3 border-t border-brand-950/10 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-brand-700 relative z-10">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-brand-amber" />
                <span>DRAG TO ROTATE 360°</span>
              </span>
              <span className="text-[11px] text-brand-500 font-bold">REUSABLE GLASS BOTTLE</span>
            </div>
          </div>

          {/* Right Column: Live Extraction Diagnostics & Sensory Profile */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Readout */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-brand-amber">
                <Activity className="w-4 h-4" />
                <span>LIVE COLD-PRESS DETAILS</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-brand-950 uppercase tracking-tight leading-[0.92]">
                {selectedProduct.name}
              </h3>
              <p className="text-sm text-brand-700 leading-relaxed font-sans pt-1">
                {selectedProduct.description}
              </p>
            </div>

            {/* 3 Real-Time Extraction Diagnostic Bento Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-4 rounded-2xl bg-brand-parchment/60 border border-brand-950/10">
                <div className="flex items-center gap-1.5 text-brand-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Gauge className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Pressing Method</span>
                </div>
                <span className="font-display text-2xl font-black text-brand-950 block">
                  Cold Press
                </span>
                <span className="text-[10px] text-brand-forest font-semibold block mt-0.5">
                  Zero friction heat
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-brand-parchment/60 border border-brand-950/10">
                <div className="flex items-center gap-1.5 text-brand-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Chamber Temp</span>
                </div>
                <span className="font-display text-2xl font-black text-brand-950 block">
                  {chamberTemp}
                </span>
                <span className="text-[10px] text-brand-forest font-semibold block mt-0.5">
                  Fresh chilled seal
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-brand-parchment/60 border border-brand-950/10">
                <div className="flex items-center gap-1.5 text-brand-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Enzyme Alive</span>
                </div>
                <span className="font-display text-2xl font-black text-brand-amber block">
                  100%
                </span>
                <span className="text-[10px] text-brand-700 font-semibold block mt-0.5">
                  Unpasteurized HPP
                </span>
              </div>
            </div>

            {/* Sensory Flavor Radar Bars */}
            <div className="p-5 rounded-2xl bg-brand-parchment/40 border border-brand-950/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-brand-950 uppercase tracking-wider">
                <span>ORGANIC SENSORY PROFILE</span>
                <span className="text-brand-amber">1.8 KG RAW HARVEST</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-brand-700">Tartness &amp; Citrus Snap</span>
                    <span className="font-black text-brand-950">{selectedProduct.tasteProfile.tartness * 20}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-brand-950/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-amber transition-all duration-500"
                      style={{ width: `${selectedProduct.tasteProfile.tartness * 20}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-brand-700">Crisp Botanical Clarity</span>
                    <span className="font-black text-brand-950">{selectedProduct.tasteProfile.crispness * 20}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-brand-950/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-forest transition-all duration-500"
                      style={{ width: `${selectedProduct.tasteProfile.crispness * 20}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-brand-700">Natural Fructose (Zero Added Sugar)</span>
                    <span className="font-black text-brand-950">{selectedProduct.tasteProfile.sweetness * 18}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-brand-950/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold transition-all duration-500"
                      style={{ width: `${selectedProduct.tasteProfile.sweetness * 18}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Whole Farm Produce Ingredients in this Bottle */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-950 block">
                WHOLE PRODUCE HARVEST IN THIS BOTTLE:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProduct.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-brand-parchment border border-brand-950/10 text-xs font-mono text-brand-800"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Action Deck */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleSimulatePress}
                disabled={isPressing}
                className="w-full sm:flex-1 px-6 py-4 rounded-2xl bg-brand-amber text-brand-950 font-mono font-black text-xs uppercase tracking-widest hover:bg-brand-gold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                <Play className={`w-4 h-4 fill-brand-950 ${isPressing ? 'animate-spin' : ''}`} />
                <span>{isPressing ? 'HYDRAULIC PRESSING...' : 'SIMULATE COLD PRESS POUR'}</span>
              </button>

              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  playPopSound();
                }}
                className="w-full sm:flex-1 px-6 py-4 rounded-2xl bg-brand-950 text-brand-cream font-mono font-bold text-xs uppercase tracking-widest hover:bg-brand-900 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 border border-brand-950"
              >
                <Plus className="w-4 h-4 text-brand-amber" />
                <span>ADD FRESH BOTTLE • ₹{selectedProduct.price}</span>
              </button>
            </div>

            {/* Circular Deposit Note */}
            <p className="text-[11px] font-mono text-brand-500 text-center sm:text-left">
              * Includes ₹25 refundable borosilicate glass bottle deposit. Hand 6 clean bottles to your delivery rider for ₹150 instant UPI cashback.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
