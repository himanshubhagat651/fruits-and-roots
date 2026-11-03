import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

// Closed, double-walled Boston Round glass bottle lathe geometry
function createDoubleWalledBottleGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];

  // Outer base concave punt
  points.push(new THREE.Vector2(0, 0.08));
  points.push(new THREE.Vector2(0.35, 0.06));
  points.push(new THREE.Vector2(0.75, 0.02));
  points.push(new THREE.Vector2(0.88, 0.00)); // Base resting ring
  points.push(new THREE.Vector2(0.96, 0.04));
  points.push(new THREE.Vector2(1.00, 0.14)); // Bottom corner fillet

  // Outer cylindrical body
  points.push(new THREE.Vector2(1.00, 2.65));

  // Outer shoulder dome via smooth cubic bezier
  const shoulderSteps = 16;
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
  points.push(new THREE.Vector2(0.32, 4.35)); // Top crown rounded
  points.push(new THREE.Vector2(0.28, 4.35)); // Inner crown rounded
  points.push(new THREE.Vector2(0.28, 4.05)); // Inner neck wall (glass thickness = 0.07)

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
      3 * (1 - t) * Math.pow(t, 2) * ip2.y +
      Math.pow(t, 3) * ip3.y;
    points.push(new THREE.Vector2(x, y));
  }

  // Inner cylindrical wall
  points.push(new THREE.Vector2(0.92, 0.16));
  points.push(new THREE.Vector2(0.85, 0.10));
  points.push(new THREE.Vector2(0.35, 0.12));
  points.push(new THREE.Vector2(0.00, 0.14)); // Inner base center

  const geometry = new THREE.LatheGeometry(points, 48);
  geometry.computeVertexNormals();
  // Center bottle vertically
  geometry.translate(0, -2.18, 0);
  return geometry;
}

// Inner fluid geometry that fills dynamically according to percentage
function createFluidGeometry(fillFraction: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const innerRadius = 0.915;

  // Fluid bottom adhering to inner glass base
  points.push(new THREE.Vector2(0, 0.15));
  points.push(new THREE.Vector2(0.35, 0.13));
  points.push(new THREE.Vector2(0.84, 0.11));
  points.push(new THREE.Vector2(innerRadius, 0.18));

  // Determine top height of fluid based on fill fraction
  const maxFluidY = 3.52; // Near top of shoulder
  const minFluidY = 0.55;
  const currentTopY = minFluidY + fillFraction * (maxFluidY - minFluidY);

  if (currentTopY <= 2.65) {
    // Within cylindrical body
    points.push(new THREE.Vector2(innerRadius, currentTopY));
    // Fluid meniscus top surface (slight dip at center)
    points.push(new THREE.Vector2(innerRadius * 0.7, currentTopY - 0.015));
    points.push(new THREE.Vector2(0, currentTopY - 0.02));
  } else {
    // Reaches into the shoulder dome
    points.push(new THREE.Vector2(innerRadius, 2.65));

    const shoulderT = Math.min(1, (currentTopY - 2.65) / (maxFluidY - 2.65));
    const shoulderSteps = Math.max(3, Math.floor(shoulderT * 12));

    const p0 = { x: 0.915, y: 2.65 };
    const p1 = { x: 0.915, y: 3.16 };
    const p2 = { x: 0.46, y: 3.48 };
    const p3 = { x: 0.28, y: 3.65 };

    let topRadius = innerRadius;
    for (let i = 1; i <= shoulderSteps; i++) {
      const t = (i / 12) * shoulderT;
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

    points.push(new THREE.Vector2(topRadius * 0.7, currentTopY - 0.012));
    points.push(new THREE.Vector2(0, currentTopY - 0.018));
  }

  const geometry = new THREE.LatheGeometry(points, 48);
  geometry.computeVertexNormals();
  geometry.translate(0, -2.18, 0);
  return geometry;
}

export const JourneyBottle3D: React.FC<JourneyBottle3DProps> = ({
  stageIdx,
  stageStep,
  stageTitle,
  liquidPercent,
  liquidColor,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const bubblesGroupRef = useRef<THREE.Points | null>(null);

  // Interaction State
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.04, y: 0 });
  const rotationCurrentRef = useRef({ x: 0.04, y: 0 });
  const targetLiquidFractionRef = useRef(liquidPercent / 100);
  const currentLiquidFractionRef = useRef(liquidPercent / 100);
  const targetColorRef = useRef(new THREE.Color(STAGE_COLORS[stageIdx] || '#FF9F1C'));
  const currentColorRef = useRef(new THREE.Color(STAGE_COLORS[stageIdx] || '#FF9F1C'));

  // Update target liquid fraction and color
  useEffect(() => {
    targetLiquidFractionRef.current = Math.max(0.18, Math.min(0.96, liquidPercent / 100));
    const newColorHex = liquidColor || STAGE_COLORS[stageIdx] || '#FF9F1C';
    targetColorRef.current.set(newColorHex);
  }, [liquidPercent, stageIdx, liquidColor]);

  // Create High-DPI Front Die-Cut Label Canvas Texture
  const createFrontLabelTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Warm artisanal cream paper
    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper texture speckles
    ctx.fillStyle = 'rgba(12, 10, 9, 0.035)';
    for (let i = 0; i < 600; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Outer and inner debossed hairline border
    ctx.strokeStyle = '#171412';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

    // Corner decorative diamond accents
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

    // Header Dispatch
    ctx.fillStyle = '#5E544D';
    ctx.font = '700 20px "Space Grotesk", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MUMBAI, INDIA • EST. 2024', 512, 100);

    // Brand Headline
    ctx.fillStyle = '#0C0A09';
    ctx.font = '900 66px "Syne", sans-serif';
    ctx.fillText('FRUITS & ROOTS', 512, 175);

    // Subtitle
    ctx.font = 'italic 700 28px "Fraunces", Georgia, serif';
    ctx.fillStyle = '#C8741B';
    ctx.fillText('Raw Cold-Pressed Living Botanicals', 512, 222);

    // Stage Pill Banner
    ctx.fillStyle = '#171412';
    ctx.fillRect(160, 255, 704, 54);
    ctx.fillStyle = '#FAF6EE';
    ctx.font = '800 21px "Space Grotesk", monospace';
    ctx.fillText(`STAGE ${stageStep} • ${stageTitle.toUpperCase()}`, 512, 290);

    // Extraction Telemetry Bullet List
    ctx.fillStyle = '#0C0A09';
    ctx.font = '600 21px "Space Grotesk", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('• 15,000 PSI HYDRAULIC PRESSURE', 180, 360);
    ctx.fillText('• 0.0°C THERMAL HEAT DESTRUCTION', 180, 400);
    ctx.fillText('• 1.8 KG CERTIFIED ORGANIC BOTANY', 180, 440);
    ctx.fillText('• 100% UNPASTEURISED ACTIVE ENZYMES', 180, 480);

    // Net Volume & Glass Credential
    ctx.textAlign = 'center';
    ctx.font = '800 28px "Space Grotesk", monospace';
    ctx.fillStyle = '#0C0A09';
    ctx.fillText('473 ML (16 FL OZ)', 512, 560);

    ctx.font = '600 16px "Space Grotesk", monospace';
    ctx.fillStyle = '#5E544D';
    ctx.fillText('BOROSILICATE GLASS • ₹25 CIRCULAR BOTTLE RETURN', 512, 595);

    // Barcode Strip
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

  // Create Back Label (Nutrition Facts & Circular Deposit Stamp)
  const createBackLabelTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 680;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#FAF6EE';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#171412';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = '#0C0A09';
    ctx.font = '900 28px "Space Grotesk", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NUTRITIONAL TRANSPARENCY', 340, 70);

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 85);
    ctx.lineTo(640, 85);
    ctx.stroke();

    ctx.font = '600 18px "Space Grotesk", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Serving Size: 1 Bottle (473 ml)', 50, 125);
    ctx.fillText('Servings Per Container: 1', 50, 160);

    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(40, 175);
    ctx.lineTo(640, 175);
    ctx.stroke();

    ctx.font = '800 24px "Space Grotesk", monospace';
    ctx.fillText('Calories: 140', 50, 215);

    ctx.font = '600 17px "Space Grotesk", monospace';
    ctx.fillText('Total Sugars: 24g (0g Added)', 50, 260);
    ctx.fillText('Raw Vitamin C: 180% Daily Value', 50, 295);
    ctx.fillText('Vitamin A: 45% Daily Value', 50, 330);
    ctx.fillText('Active Live Enzymes: 100% Intact', 50, 365);
    ctx.fillText('Water Added / Dilution: 0.0%', 50, 400);

    // Circular Seal
    ctx.strokeStyle = '#C8741B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(340, 520, 68, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '800 15px "Space Grotesk", monospace';
    ctx.fillStyle = '#C8741B';
    ctx.fillText('ZERO PLASTIC', 340, 492);
    ctx.font = '900 28px "Space Grotesk", monospace';
    ctx.fillText('₹25', 340, 526);
    ctx.font = '700 13px "Space Grotesk", monospace';
    ctx.fillText('BOTTLE RETURN', 340, 550);

    ctx.fillStyle = '#5E544D';
    ctx.font = '600 15px "Space Grotesk", monospace';
    ctx.fillText('Keep Chilled At 2.2°C • Shake Gently', 340, 645);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 540;

    // 1. Scene with warm studio backdrop for realistic transmission refraction
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf6ee);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 7.8);

    // 3. Renderer with ACES Tone Mapping & Hardware Optimization
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Map for Glass Refraction & Specular Highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xfcf9f2);

    // Overhead diffuse softbox
    const envLightTop = new THREE.DirectionalLight(0xfff6ea, 4.5);
    envLightTop.position.set(0, 10, 4);
    envScene.add(envLightTop);

    // Left vertical strip softbox (creates the crisp vertical specular line down glass)
    const stripBox = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    stripBox.position.set(-4.5, 0, 3.5);
    stripBox.lookAt(0, 0, 0);
    envScene.add(stripBox);

    // Right softbox
    const rightBox = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 8),
      new THREE.MeshBasicMaterial({ color: 0xffeedd })
    );
    rightBox.position.set(5.0, 0.5, 3.0);
    rightBox.lookAt(0, 0, 0);
    envScene.add(rightBox);

    // Back rim light box
    const rimBox = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    rimBox.position.set(0, 2, -6);
    rimBox.lookAt(0, 0, 0);
    envScene.add(rimBox);

    const envTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Direct Studio Spot & Directional Lights
    const keyLight = new THREE.DirectionalLight(0xfff4e6, 3.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf2e4d2, 1.6);
    fillLight.position.set(-5, -0.5, 4);
    scene.add(fillLight);

    const backRimLight = new THREE.DirectionalLight(0xffffff, 3.8);
    backRimLight.position.set(0, 4, -5);
    scene.add(backRimLight);

    // Soft Radial Contact Floor Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 115);
    grad.addColorStop(0, 'rgba(12, 10, 9, 0.38)');
    grad.addColorStop(0.35, 'rgba(12, 10, 9, 0.16)');
    grad.addColorStop(0.7, 'rgba(12, 10, 9, 0.04)');
    grad.addColorStop(1, 'rgba(12, 10, 9, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowGeo = new THREE.PlaneGeometry(3.8, 3.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.20;
    scene.add(shadowMesh);

    // 5. Master Bottle Group
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // Physical Glass Material (Authentic Borosilicate)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1.0,
      transparent: true,
      roughness: 0.015,
      ior: 1.52, // Refraction index of borosilicate crown glass
      thickness: 0.8,
      specularIntensity: 2.4,
      specularColor: 0xffffff,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      attenuationColor: new THREE.Color(0xfcf8f2),
      attenuationDistance: 6.0,
    });

    const glassGeo = createDoubleWalledBottleGeometry();
    const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
    glassMesh.renderOrder = 3;
    bottleGroup.add(glassMesh);

    // Brushed Bronze / Brass Cap
    const capHeight = 0.34;
    const capRadius = 0.368;
    const capGeo = new THREE.CylinderGeometry(capRadius, capRadius, capHeight, 48);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xc49646,
      metalness: 0.90,
      roughness: 0.24,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 4.18 - 2.18;
    bottleGroup.add(capMesh);

    // Top Cap Crown Emboss Disc
    const capTopGeo = new THREE.CylinderGeometry(capRadius + 0.015, capRadius + 0.015, 0.06, 48);
    const capTopMesh = new THREE.Mesh(capTopGeo, capMat);
    capTopMesh.position.y = 4.18 - 2.18 + capHeight / 2 + 0.03;
    bottleGroup.add(capTopMesh);

    // Tamper-Evident Safety Ring below cap
    const ringGeo = new THREE.CylinderGeometry(capRadius, capRadius, 0.08, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xa97830,
      metalness: 0.85,
      roughness: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 4.18 - 2.18 - capHeight / 2 - 0.06;
    bottleGroup.add(ringMesh);

    // 6. Volumetric Liquid Mesh inside the bottle
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: currentColorRef.current,
      roughness: 0.12,
      metalness: 0.02,
      transmission: 0.32,
      opacity: 0.97,
      transparent: true,
      thickness: 1.4,
      ior: 1.34, // Water / Juice IOR
      emissive: new THREE.Color(STAGE_COLORS[stageIdx]).multiplyScalar(0.25),
      clearcoat: 0.6,
    });
    liquidMaterialRef.current = liquidMat;

    let fluidGeo = createFluidGeometry(currentLiquidFractionRef.current);
    const fluidMesh = new THREE.Mesh(fluidGeo, liquidMat);
    fluidMesh.renderOrder = 1;
    bottleGroup.add(fluidMesh);
    liquidMeshRef.current = fluidMesh;

    // Rising Micro-Enzyme Bubbles
    const bubbleCount = 60;
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const bubbleVelocities = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
      const r = Math.random() * 0.75;
      const angle = Math.random() * Math.PI * 2;
      bubblePositions[i * 3] = Math.cos(angle) * r;
      bubblePositions[i * 3 + 1] = -1.9 + Math.random() * 1.5;
      bubblePositions[i * 3 + 2] = Math.sin(angle) * r;
      bubbleVelocities[i] = 0.004 + Math.random() * 0.006;
    }

    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
    const bubbleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const bubblePoints = new THREE.Points(bubbleGeo, bubbleMat);
    bubblePoints.renderOrder = 2;
    bottleGroup.add(bubblePoints);
    bubblesGroupRef.current = bubblePoints;

    // 7. Die-Cut Front Label (Facing directly towards +Z, perfectly upright and readable!)
    const frontLabelTexture = createFrontLabelTexture();
    if (frontLabelTexture) {
      // Cylinder with thetaStart = Math.PI * 0.64 and thetaLength = Math.PI * 0.72
      // Centers at theta = PI, which points directly at +Z (the viewer!)
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
        roughness: 0.75,
        metalness: 0.02,
        side: THREE.FrontSide,
      });
      const frontLabelMesh = new THREE.Mesh(frontLabelGeo, frontLabelMat);
      frontLabelMesh.position.y = -0.58;
      frontLabelMesh.renderOrder = 4;
      bottleGroup.add(frontLabelMesh);
    }

    // 8. Back Label (Nutrition Facts & Bottle Deposit Stamp, revealed when rotating 180 deg)
    const backLabelTexture = createBackLabelTexture();
    if (backLabelTexture) {
      // Centers at theta = 0, which points directly at -Z (the rear)
      const backLabelGeo = new THREE.CylinderGeometry(
        1.008,
        1.008,
        1.45,
        48,
        1,
        true,
        -Math.PI * 0.30,
        Math.PI * 0.60
      );
      const backLabelMat = new THREE.MeshStandardMaterial({
        map: backLabelTexture,
        roughness: 0.75,
        metalness: 0.02,
        side: THREE.FrontSide,
      });
      const backLabelMesh = new THREE.Mesh(backLabelGeo, backLabelMat);
      backLabelMesh.position.y = -0.58;
      backLabelMesh.renderOrder = 4;
      bottleGroup.add(backLabelMesh);
    }

    bottleGroup.position.set(0, 0, 0);

    // Mouse / Touch Horizontal Orbit Handlers
    const handlePointerDown = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return;
      const deltaX = clientX - previousMousePositionRef.current.x;
      const deltaY = clientY - previousMousePositionRef.current.y;

      // Orbit around Y axis
      rotationTargetRef.current.y += deltaX * 0.012;
      // Subtle tilt limit on X axis
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

    // 9. Render & Animation Loop with Visibility Culling
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;
    let lastGeometryFraction = currentLiquidFractionRef.current;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return; // Completely pause 3D draw calls when offscreen

      const elapsedTime = clock.getElapsedTime();

      // Gentle idle sway when user is not dragging
      if (!isDraggingRef.current) {
        rotationTargetRef.current.y += 0.0025;
      }

      // Smooth inertia damping
      rotationCurrentRef.current.x += (rotationTargetRef.current.x - rotationCurrentRef.current.x) * 0.08;
      rotationCurrentRef.current.y += (rotationTargetRef.current.y - rotationCurrentRef.current.y) * 0.08;

      if (bottleGroup) {
        bottleGroup.rotation.x = rotationCurrentRef.current.x;
        bottleGroup.rotation.y = rotationCurrentRef.current.y;
        // Subtle organic breathing float
        bottleGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.03;
      }

      // Animate enzyme bubbles rising inside the liquid
      if (bubblesGroupRef.current) {
        const positions = bubblesGroupRef.current.geometry.attributes.position.array as Float32Array;
        const topLimit = -2.18 + 0.55 + currentLiquidFractionRef.current * (3.52 - 0.55);

        for (let i = 0; i < bubbleCount; i++) {
          positions[i * 3 + 1] += bubbleVelocities[i];
          if (positions[i * 3 + 1] > topLimit) {
            positions[i * 3 + 1] = -1.95;
          }
        }
        bubblesGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smoothly interpolate fluid fill level with quantized geometry regeneration
      const liquidDiff = targetLiquidFractionRef.current - currentLiquidFractionRef.current;
      if (Math.abs(liquidDiff) > 0.002) {
        currentLiquidFractionRef.current += liquidDiff * 0.08;
        // Only regenerate buffer geometry when change delta exceeds threshold (prevents 60fps buffer GC thrash)
        if (
          Math.abs(currentLiquidFractionRef.current - lastGeometryFraction) > 0.025 ||
          Math.abs(liquidDiff) <= 0.003
        ) {
          lastGeometryFraction = currentLiquidFractionRef.current;
          if (liquidMeshRef.current) {
            liquidMeshRef.current.geometry.dispose();
            liquidMeshRef.current.geometry = createFluidGeometry(currentLiquidFractionRef.current);
          }
        }
      }

      // Smoothly interpolate liquid color
      currentColorRef.current.lerp(targetColorRef.current, 0.08);
      if (liquidMaterialRef.current) {
        liquidMaterialRef.current.color.copy(currentColorRef.current);
        liquidMaterialRef.current.emissive.copy(currentColorRef.current).multiplyScalar(0.25);
      }

      renderer.render(scene, camera);
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
      visibilityObserver.disconnect();
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
  }, [stageIdx, stageStep, stageTitle]);

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      <div
        ref={mountRef}
        className="w-full h-[400px] sm:h-[460px] max-w-[420px] rounded-2xl overflow-hidden"
      />
    </div>
  );
};