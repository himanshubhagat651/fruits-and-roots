import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { playPopSound, playGlassClinkSound } from '../utils/audio';

interface ThreeJuiceGlassCanvasProps {
  colorHex: string;
  flavorIndex: number;
}

// ---------------------------------------------------------
// 1. Procedural Texture Generators
// ---------------------------------------------------------

// Cold condensation bump map on outer glass
function createCondensationBump(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 280; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 4.2 + 1.0;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.7, '#a0a0a0');
    grad.addColorStop(1, '#808080');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // A few subtle vertical drip trails
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * 200 + 100;
    const len = Math.random() * 80 + 40;
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y + len);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

// Cold-pressed juice pulp & sedimentation texture
function createJuicePulpTexture(colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const base = new THREE.Color(colorHex);
  const deep = base.clone().multiplyScalar(0.7);
  const bright = base.clone().lerp(new THREE.Color(0xffffff), 0.3);

  const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
  grad.addColorStop(0, deep.getStyle());
  grad.addColorStop(0.35, base.getStyle());
  grad.addColorStop(0.85, base.getStyle());
  grad.addColorStop(1, bright.getStyle());
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro pulp particles
  ctx.fillStyle = bright.getStyle();
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 2.2 + 0.6;
    ctx.globalAlpha = Math.random() * 0.4 + 0.15;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Heavier sediment near bottom
  ctx.fillStyle = deep.getStyle();
  for (let i = 0; i < 280; i++) {
    const x = Math.random() * canvas.width;
    const y = canvas.height * (0.65 + Math.random() * 0.35);
    const r = Math.random() * 3.5 + 0.8;
    ctx.globalAlpha = Math.random() * 0.5 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

// Cut Orange slice texture (pulp triangles, white pith, orange peel)
function createOrangeSliceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 240;

  // Outer orange rind
  ctx.fillStyle = '#FF7A00';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // White pith ring
  ctx.fillStyle = '#FFF8E7';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
  ctx.fill();

  // Pulp segments (10 triangular wedges)
  const segments = 10;
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2 + 0.05;
    const a2 = ((i + 1) / segments) * Math.PI * 2 - 0.05;

    ctx.fillStyle = '#FFA726';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.86, a1, a2);
    ctx.closePath();
    ctx.fill();

    // Juicy highlights inside segment
    ctx.fillStyle = '#FFB74D';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.72, a1 + 0.04, a2 - 0.04);
    ctx.closePath();
    ctx.fill();
  }

  // Center white star core
  ctx.fillStyle = '#FFF8E7';
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Cut Pomegranate half / seed texture
function createPomegranateHalfTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 240;

  // Deep crimson outer leather rind
  ctx.fillStyle = '#73091B';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Creamy white spongy membrane
  ctx.fillStyle = '#FFF5E1';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.91, 0, Math.PI * 2);
  ctx.fill();

  // Packed ruby seed chambers
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

    // Faceted ruby glint highlight
    ctx.fillStyle = 'rgba(255, 230, 235, 0.75)';
    ctx.beginPath();
    ctx.arc(x - seedR * 0.3, y - seedR * 0.3, seedR * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// Cut Dragonfruit texture (speckled black seeds on white/pink flesh)
function createDragonfruitSliceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 240;

  // Bright pink / magenta rind
  ctx.fillStyle = '#E61C5D';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Thin pale inner line
  ctx.fillStyle = '#FFE6EE';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
  ctx.fill();

  // Juicy flesh interior
  ctx.fillStyle = '#FFF0F5';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // Scattered tiny black seeds
  ctx.fillStyle = '#1A1819';
  for (let i = 0; i < 280; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * (r * 0.82);
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const seedW = Math.random() * 2.5 + 2.0;
    const seedH = seedW * 1.6;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.beginPath();
    ctx.ellipse(0, 0, seedW, seedH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  return new THREE.CanvasTexture(canvas);
}

// Cut Green Apple slice texture
function createGreenAppleSliceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 240;

  // Granny Smith green peel
  ctx.fillStyle = '#6BA32D';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Pale juicy apple flesh
  ctx.fillStyle = '#F4F9EA';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2);
  ctx.fill();

  // Star core
  ctx.fillStyle = '#E0EDC7';
  ctx.beginPath();
  ctx.arc(cx, cy, 38, 0, Math.PI * 2);
  ctx.fill();

  // Apple seeds
  ctx.fillStyle = '#4A2A0B';
  ctx.beginPath();
  ctx.ellipse(cx - 14, cy, 6, 12, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 14, cy, 6, 12, 0.4, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Cut Coconut texture (green/brown fibrous husk + white coconut meat)
function createCoconutSliceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 240;

  // Greenish-brown husk
  ctx.fillStyle = '#5A6836';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Hard brown shell
  ctx.fillStyle = '#4E2F1D';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
  ctx.fill();

  // Thick white tender coconut meat
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // Clear coconut water hollow center
  ctx.fillStyle = '#E8F4F8';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Cucumber slice texture
function createCucumberSliceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const cx = 256;
  const cy = 256;
  const r = 240;

  // Dark green skin
  ctx.fillStyle = '#204E24';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Pale green crisp flesh
  ctx.fillStyle = '#E8F5E9';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
  ctx.fill();

  // Translucent watery seed core
  ctx.fillStyle = '#D3EBCD';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
  ctx.fill();

  // Triangular seed pattern
  ctx.fillStyle = '#A3D299';
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const dist = r * 0.42;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    ctx.beginPath();
    ctx.ellipse(x, y, 4, 10, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// ---------------------------------------------------------
// 2. 3D Glass & Liquid Lathe Geometries
// ---------------------------------------------------------

// Premium heavy-base highball drinking tumbler
function createHighballGlassGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];

  // Bottom base (solid thick glass from y = 0 to 0.45)
  points.push(new THREE.Vector2(0, 0.05));
  points.push(new THREE.Vector2(0.55, 0.03));
  points.push(new THREE.Vector2(0.78, 0.0));
  points.push(new THREE.Vector2(0.85, 0.06));

  // Outer straight upward taper
  points.push(new THREE.Vector2(0.88, 0.8));
  points.push(new THREE.Vector2(0.92, 1.8));
  points.push(new THREE.Vector2(0.96, 2.8));
  points.push(new THREE.Vector2(0.98, 3.25));

  // Polished rim bead
  points.push(new THREE.Vector2(0.97, 3.28));
  points.push(new THREE.Vector2(0.94, 3.28));
  points.push(new THREE.Vector2(0.93, 3.25));

  // Inner glass cavity wall
  points.push(new THREE.Vector2(0.91, 2.8));
  points.push(new THREE.Vector2(0.87, 1.8));
  points.push(new THREE.Vector2(0.83, 0.8));
  points.push(new THREE.Vector2(0.79, 0.42)); // Heavy sham floor

  // Inner bottom sham floor
  points.push(new THREE.Vector2(0.45, 0.40));
  points.push(new THREE.Vector2(0, 0.40));

  const geo = new THREE.LatheGeometry(points, 64);
  geo.computeVertexNormals();
  geo.translate(0, -1.6, 0);
  return geo;
}

// Liquid volume inside tumbler
function createTumblerLiquidGeometry(fillFraction = 0.85): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const baseFloorY = 0.41;
  const maxFluidY = 3.0;
  const topY = baseFloorY + fillFraction * (maxFluidY - baseFloorY);

  points.push(new THREE.Vector2(0, baseFloorY + 0.01));
  points.push(new THREE.Vector2(0.45, baseFloorY + 0.01));
  points.push(new THREE.Vector2(0.78, baseFloorY + 0.02));

  // Interpolate side wall radius at current topY
  const t = (topY - 0.41) / (3.25 - 0.41);
  const wallRadiusAtTop = 0.79 + t * (0.93 - 0.79);

  // Middle wall points
  points.push(new THREE.Vector2(0.82, 0.8));
  if (topY > 1.8) {
    points.push(new THREE.Vector2(0.86, 1.8));
  }
  points.push(new THREE.Vector2(wallRadiusAtTop - 0.015, topY));

  // Soft meniscus curve
  points.push(new THREE.Vector2(wallRadiusAtTop * 0.85, topY - 0.01));
  points.push(new THREE.Vector2(0, topY - 0.015));

  const geo = new THREE.LatheGeometry(points, 64);
  geo.computeVertexNormals();
  geo.translate(0, -1.6, 0);
  return geo;
}

// ---------------------------------------------------------
// 3. 3D Fruit Builders (Beside the glass!)
// ---------------------------------------------------------

// Helper to make a smooth faceted 3D Pomegranate
function createPomegranateModel(): THREE.Group {
  const group = new THREE.Group();

  // 1. Whole ripe pomegranate
  const bodyGeo = new THREE.DodecahedronGeometry(0.72, 3);
  // Deform slightly to give natural irregular fruit shape
  const pos = bodyGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.sqrt(x * x + z * z);
    // Slight squish at top & bottom
    pos.setY(i, y * 0.94);
    // Natural slight asymmetry
    pos.setX(i, x * (1 + 0.05 * Math.sin(y * 4)));
    pos.setZ(i, z * (1 + 0.05 * Math.cos(r * 4)));
  }
  bodyGeo.computeVertexNormals();

  const pomMat = new THREE.MeshStandardMaterial({
    color: '#8A0E23',
    roughness: 0.32,
    metalness: 0.05,
  });
  const wholePom = new THREE.Mesh(bodyGeo, pomMat);
  wholePom.position.set(0, 0.65, 0);
  wholePom.castShadow = true;
  group.add(wholePom);

  // Calyx crown (5 pointed star crown on top of pomegranate)
  const calyxMat = new THREE.MeshStandardMaterial({ color: '#5A0A16', roughness: 0.6 });
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const coneGeo = new THREE.ConeGeometry(0.08, 0.22, 4);
    coneGeo.translate(0, 0.11, 0);
    const petal = new THREE.Mesh(coneGeo, calyxMat);
    petal.position.set(Math.cos(angle) * 0.15, 1.30, Math.sin(angle) * 0.15);
    petal.rotation.z = Math.cos(angle) * 0.45;
    petal.rotation.x = -Math.sin(angle) * 0.45;
    group.add(petal);
  }

  // 2. Cracked Open Pomegranate Half / Wedge beside it!
  const halfGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.22, 32);
  const halfTex = createPomegranateHalfTexture();
  const halfMaterials = [
    new THREE.MeshStandardMaterial({ color: '#73091B', roughness: 0.4 }), // rim
    new THREE.MeshStandardMaterial({ map: halfTex, roughness: 0.25 }), // top face (juicy seeds!)
    new THREE.MeshStandardMaterial({ color: '#73091B', roughness: 0.4 }), // bottom
  ];
  const halfPom = new THREE.Mesh(halfGeo, halfMaterials);
  halfPom.position.set(0.95, 0.28, 0.45);
  halfPom.rotation.x = 0.55;
  halfPom.rotation.z = -0.35;
  halfPom.castShadow = true;
  group.add(halfPom);

  // 3. Scattered individual glistening ruby seeds on the counter
  const seedGeo = new THREE.SphereGeometry(0.065, 8, 8);
  seedGeo.scale(1, 1.4, 0.85);
  const seedMat = new THREE.MeshPhysicalMaterial({
    color: '#D90429',
    roughness: 0.12,
    transmission: 0.75,
    ior: 1.42,
    clearcoat: 1.0,
  });

  const seedPositions = [
    [0.4, 0.05, 0.85],
    [0.6, 0.05, 0.95],
    [0.75, 0.05, 0.75],
    [0.9, 0.05, 1.1],
    [1.15, 0.05, 0.85],
    [1.3, 0.05, 0.65],
    [0.25, 0.05, 1.05],
    [0.55, 0.05, 1.25],
    [0.85, 0.05, 0.55],
    [1.4, 0.05, 0.95],
  ];

  seedPositions.forEach(([x, y, z]) => {
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set(x, y, z);
    seed.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    seed.castShadow = true;
    group.add(seed);
  });

  return group;
}

// Whole Orange & Slices Builder
function createOrangeModel(): THREE.Group {
  const group = new THREE.Group();

  // Whole orange
  const orangeGeo = new THREE.SphereGeometry(0.68, 32, 28);
  orangeGeo.scale(1.02, 0.96, 1.02);
  const orangeMat = new THREE.MeshStandardMaterial({
    color: '#FF7A00',
    roughness: 0.38,
    metalness: 0.02,
  });
  const wholeOrange = new THREE.Mesh(orangeGeo, orangeMat);
  wholeOrange.position.set(0, 0.65, 0);
  wholeOrange.castShadow = true;
  group.add(wholeOrange);

  // Tiny green stem button
  const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: '#2D5A27', roughness: 0.7 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 1.30, 0);
  group.add(stem);

  // Cut Orange Half resting tilted
  const sliceGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.18, 32);
  const sliceTex = createOrangeSliceTexture();
  const sliceMaterials = [
    new THREE.MeshStandardMaterial({ color: '#FF7A00', roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: sliceTex, roughness: 0.25 }),
    new THREE.MeshStandardMaterial({ color: '#FF7A00', roughness: 0.4 }),
  ];
  const slice = new THREE.Mesh(sliceGeo, sliceMaterials);
  slice.position.set(0.92, 0.32, 0.42);
  slice.rotation.x = 0.6;
  slice.rotation.z = -0.4;
  slice.castShadow = true;
  group.add(slice);

  // Knobby Lakadong turmeric root resting in front
  const rootGeo = new THREE.CapsuleGeometry(0.12, 0.75, 8, 16);
  const rootMat = new THREE.MeshStandardMaterial({ color: '#C97A14', roughness: 0.6 });
  const root = new THREE.Mesh(rootGeo, rootMat);
  root.position.set(0.45, 0.12, 0.95);
  root.rotation.set(0.3, 0.8, 1.4);
  root.castShadow = true;
  group.add(root);

  return group;
}

// Green Apple & Cucumber Builder
function createGreenAppleModel(): THREE.Group {
  const group = new THREE.Group();

  // Whole Granny Smith apple
  const appleGeo = new THREE.SphereGeometry(0.68, 32, 28);
  const pos = appleGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const x = pos.getX(i);
    const z = pos.getZ(i);
    // Indent top & bottom stem wells
    if (y > 0.4) {
      pos.setY(i, y - 0.08 * (y / 0.68));
    } else if (y < -0.4) {
      pos.setY(i, y + 0.06 * Math.abs(y / 0.68));
    }
    // Apple taper towards base
    if (y < 0) {
      pos.setX(i, x * (1 + y * 0.2));
      pos.setZ(i, z * (1 + y * 0.2));
    }
  }
  appleGeo.computeVertexNormals();

  const appleMat = new THREE.MeshStandardMaterial({
    color: '#6BA32D',
    roughness: 0.24,
    metalness: 0.04,
  });
  const wholeApple = new THREE.Mesh(appleGeo, appleMat);
  wholeApple.position.set(0, 0.65, 0);
  wholeApple.castShadow = true;
  group.add(wholeApple);

  // Apple wooden brown stem
  const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.24, 8);
  const stemMat = new THREE.MeshStandardMaterial({ color: '#3E2723', roughness: 0.8 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0.02, 1.30, 0);
  stem.rotation.z = 0.25;
  group.add(stem);

  // Cut Apple slice
  const sliceGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.16, 32);
  const sliceTex = createGreenAppleSliceTexture();
  const sliceMaterials = [
    new THREE.MeshStandardMaterial({ color: '#6BA32D', roughness: 0.35 }),
    new THREE.MeshStandardMaterial({ map: sliceTex, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: '#6BA32D', roughness: 0.35 }),
  ];
  const slice = new THREE.Mesh(sliceGeo, sliceMaterials);
  slice.position.set(0.9, 0.3, 0.4);
  slice.rotation.x = 0.6;
  slice.rotation.z = -0.38;
  slice.castShadow = true;
  group.add(slice);

  // Sliced Cucumber wheels
  const cucGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24);
  const cucTex = createCucumberSliceTexture();
  const cucMaterials = [
    new THREE.MeshStandardMaterial({ color: '#204E24', roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: cucTex, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: '#204E24', roughness: 0.4 }),
  ];

  const cuc1 = new THREE.Mesh(cucGeo, cucMaterials);
  cuc1.position.set(0.35, 0.06, 0.95);
  cuc1.rotation.set(0.2, 0.3, 0.4);
  group.add(cuc1);

  const cuc2 = new THREE.Mesh(cucGeo, cucMaterials);
  cuc2.position.set(0.75, 0.07, 0.85);
  cuc2.rotation.set(-0.2, 0.6, -0.3);
  group.add(cuc2);

  return group;
}

// Pink Dragonfruit & Mango Builder
function createDragonfruitModel(): THREE.Group {
  const group = new THREE.Group();

  // Dragon fruit oval body with bright magenta skin
  const dfGeo = new THREE.SphereGeometry(0.65, 32, 28);
  dfGeo.scale(0.85, 1.25, 0.85);
  const dfMat = new THREE.MeshStandardMaterial({
    color: '#D81159',
    roughness: 0.35,
    metalness: 0.02,
  });
  const wholeDf = new THREE.Mesh(dfGeo, dfMat);
  wholeDf.position.set(0, 0.72, 0);
  wholeDf.rotation.z = -0.25;
  wholeDf.castShadow = true;
  group.add(wholeDf);

  // Green tipped leaf bracts on the skin
  const bractGeo = new THREE.ConeGeometry(0.12, 0.32, 4);
  const bractMat = new THREE.MeshStandardMaterial({ color: '#52B788', roughness: 0.5 });
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const y = 0.3 + (i % 3) * 0.35;
    const bract = new THREE.Mesh(bractGeo, bractMat);
    bract.position.set(Math.cos(angle) * 0.52, y, Math.sin(angle) * 0.52);
    bract.rotation.z = Math.cos(angle) * 0.8;
    bract.rotation.x = -Math.sin(angle) * 0.8;
    group.add(bract);
  }

  // Cut Dragonfruit slice
  const sliceGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.18, 32);
  const sliceTex = createDragonfruitSliceTexture();
  const sliceMaterials = [
    new THREE.MeshStandardMaterial({ color: '#D81159', roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: sliceTex, roughness: 0.25 }),
    new THREE.MeshStandardMaterial({ color: '#D81159', roughness: 0.4 }),
  ];
  const slice = new THREE.Mesh(sliceGeo, sliceMaterials);
  slice.position.set(0.95, 0.32, 0.45);
  slice.rotation.x = 0.55;
  slice.rotation.z = -0.35;
  slice.castShadow = true;
  group.add(slice);

  // Golden Alphonso mango wedge
  const mangoGeo = new THREE.CapsuleGeometry(0.25, 0.6, 12, 24);
  mangoGeo.scale(1.2, 1.0, 0.75);
  const mangoMat = new THREE.MeshStandardMaterial({ color: '#FFB703', roughness: 0.28 });
  const mango = new THREE.Mesh(mangoGeo, mangoMat);
  mango.position.set(0.45, 0.2, 0.95);
  mango.rotation.set(0.4, 0.6, 1.2);
  mango.castShadow = true;
  group.add(mango);

  return group;
}

// Cracked Coconut & Pineapple Wedge Builder
function createCoconutModel(): THREE.Group {
  const group = new THREE.Group();

  // Cracked Tender Coconut Half
  const cocoGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.26, 32);
  const cocoTex = createCoconutSliceTexture();
  const cocoMaterials = [
    new THREE.MeshStandardMaterial({ color: '#5A6836', roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ map: cocoTex, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: '#4E2F1D', roughness: 0.6 }),
  ];
  const coco = new THREE.Mesh(cocoGeo, cocoMaterials);
  coco.position.set(0, 0.38, 0);
  coco.rotation.x = 0.5;
  coco.rotation.z = -0.2;
  coco.castShadow = true;
  group.add(coco);

  // Golden Pineapple Wedge
  const pineGeo = new THREE.ConeGeometry(0.48, 0.85, 3);
  pineGeo.scale(1, 0.8, 0.4);
  const pineMat = new THREE.MeshStandardMaterial({ color: '#FFB703', roughness: 0.3 });
  const pine = new THREE.Mesh(pineGeo, pineMat);
  pine.position.set(0.95, 0.4, 0.35);
  pine.rotation.set(0.3, 0.5, -0.6);
  pine.castShadow = true;
  group.add(pine);

  // Mint leaf sprig
  const leafGeo = new THREE.CircleGeometry(0.18, 16);
  leafGeo.scale(0.65, 1.2, 1);
  const leafMat = new THREE.MeshStandardMaterial({
    color: '#2D6A4F',
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  const leaf1 = new THREE.Mesh(leafGeo, leafMat);
  leaf1.position.set(0.35, 0.12, 0.85);
  leaf1.rotation.set(0.4, 0.2, 0.6);
  group.add(leaf1);

  return group;
}

// ---------------------------------------------------------
// 4. Main Component
// ---------------------------------------------------------

export const ThreeJuiceGlassCanvas: React.FC<ThreeJuiceGlassCanvasProps> = ({
  colorHex,
  flavorIndex,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const stageGroupRef = useRef<THREE.Group | null>(null);

  // Glass & Liquid Refs
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const liquidMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const iceCubesRef = useRef<THREE.Mesh[]>([]);
  const rimGarnishRef = useRef<THREE.Mesh | null>(null);
  const bubblesPointsRef = useRef<THREE.Points | null>(null);

  // Fruit Groups Refs (5 flavours)
  const fruitGroupsRef = useRef<THREE.Group[]>([]);
  const activeFruitIdxRef = useRef(flavorIndex);
  const fruitScalesRef = useRef<number[]>([1, 0, 0, 0, 0]);

  // Color transition
  const targetColorRef = useRef(new THREE.Color(colorHex));
  const currentColorRef = useRef(new THREE.Color(colorHex));

  // Drag & Swirl Physics
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.12, y: -0.2 });
  const rotationCurrentRef = useRef({ x: 0.12, y: -0.2 });
  const sloshAngleRef = useRef({ x: 0, z: 0 });
  const sloshVelRef = useRef({ x: 0, z: 0 });
  const effervescenceRef = useRef(1.0);

  // Update target color & active fruit group when props change
  useEffect(() => {
    targetColorRef.current.set(colorHex);
    activeFruitIdxRef.current = flavorIndex;

    // Update rim garnish slice texture
    if (rimGarnishRef.current) {
      let garnishTex: THREE.CanvasTexture;
      if (flavorIndex === 0) garnishTex = createOrangeSliceTexture();
      else if (flavorIndex === 1) garnishTex = createGreenAppleSliceTexture();
      else if (flavorIndex === 2) garnishTex = createPomegranateHalfTexture();
      else if (flavorIndex === 3) garnishTex = createDragonfruitSliceTexture();
      else garnishTex = createCoconutSliceTexture();

      (rimGarnishRef.current.material as THREE.MeshStandardMaterial).map = garnishTex;
      (rimGarnishRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
    }
  }, [colorHex, flavorIndex]);

  // Trigger swirl physics on click/tap
  const handleSwirl = () => {
    playGlassClinkSound();
    playPopSound();
    // Kick slosh velocity and effervescence
    sloshVelRef.current.x += (Math.random() - 0.5) * 0.45;
    sloshVelRef.current.z += (Math.random() - 0.5) * 0.45;
    effervescenceRef.current = 4.0;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const isMobile = width < 640;
    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.5, isMobile ? 8.6 : 7.4);
    camera.lookAt(0, 0.1, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambient = new THREE.AmbientLight(0xfff8ee, 0.95);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.6);
    rimLight.position.set(-4, 5, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffe5cc, 0.7);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    // Internal colored glow point light
    const pointLight = new THREE.PointLight(colorHex, 2.5, 4.5);
    pointLight.position.set(0, 0.2, 0);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 5. Stage Group (Holds Glass + Fruits beside it)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(-0.35, -0.1, 0); // slight left offset for magnificent balance with fruits on right!
    scene.add(stageGroup);
    stageGroupRef.current = stageGroup;

    // Ground Contact Shadow Disc
    const shadowGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 15, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(30, 20, 15, 0.38)');
    sGrad.addColorStop(0.45, 'rgba(40, 25, 20, 0.18)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.62;
    stageGroup.add(shadowMesh);

    // 6. Build Highball Juice Glass
    const glassGeo = createHighballGlassGeometry();
    const condensationTex = createCondensationBump();

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.04,
      transmission: 0.95,
      ior: 1.52,
      thickness: 0.45,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      bumpMap: condensationTex,
      bumpScale: 0.008,
      transparent: true,
      opacity: 1.0,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.castShadow = true;
    glassMesh.receiveShadow = true;
    stageGroup.add(glassMesh);

    // 7. Cold-Pressed Juice Liquid Mesh
    const liquidGeo = createTumblerLiquidGeometry(0.85);
    const pulpTex = createJuicePulpTexture(colorHex);

    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.02,
      roughness: 0.22,
      transmission: 0.44,
      ior: 1.34,
      thickness: 1.8,
      attenuationDistance: 1.1,
      attenuationColor: new THREE.Color(colorHex).multiplyScalar(0.7),
      map: pulpTex,
      bumpMap: pulpTex,
      bumpScale: 0.02,
      transparent: true,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0;
    stageGroup.add(liquidMesh);
    liquidMeshRef.current = liquidMesh;
    liquidMaterialRef.current = liquidMat;

    // 8. Floating Ice Cubes Inside Juice
    const iceGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42, 4, 4, 4);
    // Smooth ice cube edges
    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.08,
      transmission: 0.96,
      ior: 1.31, // true ice index
      thickness: 0.35,
      transparent: true,
      opacity: 0.9,
    });

    const iceCubes: THREE.Mesh[] = [];
    const iceConfigs = [
      { pos: [-0.28, 0.92, 0.15], rot: [0.35, 0.4, -0.2] },
      { pos: [0.26, 0.85, -0.1], rot: [-0.2, 0.6, 0.35] },
      { pos: [0.02, 0.65, 0.2], rot: [0.5, -0.3, 0.1] },
    ];

    iceConfigs.forEach((cfg) => {
      const cube = new THREE.Mesh(iceGeo, iceMat);
      cube.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      cube.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      cube.castShadow = true;
      stageGroup.add(cube);
      iceCubes.push(cube);
    });
    iceCubesRef.current = iceCubes;

    // 9. Rim Fruit Garnish Slice
    const garnishGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.06, 32);
    const garnishTex = createOrangeSliceTexture();
    const garnishMat = new THREE.MeshStandardMaterial({
      map: garnishTex,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const garnishMesh = new THREE.Mesh(garnishGeo, garnishMat);
    // Slotted over the glass rim
    garnishMesh.position.set(0.92, 1.62, 0);
    garnishMesh.rotation.set(0.2, 0.3, 1.35);
    garnishMesh.castShadow = true;
    stageGroup.add(garnishMesh);
    rimGarnishRef.current = garnishMesh;

    // 10. Effervescent Rising Micro-bubbles
    const bubbleCount = 45;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const bubbleVelocities = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
      bubblePositions[i * 3 + 0] = (Math.random() - 0.5) * 1.3;
      bubblePositions[i * 3 + 1] = -1.1 + Math.random() * 2.1;
      bubblePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.3;
      bubbleVelocities[i] = 0.015 + Math.random() * 0.025;
    }
    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));

    // Particle disc texture
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
      size: 0.07,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    stageGroup.add(bubbles);
    bubblesPointsRef.current = bubbles;

    // 11. Build 5 Fruit Groups (Beside the glass to the right!)
    const fruitBuilders = [
      createOrangeModel, // 0: Golden Roots
      createGreenAppleModel, // 1: Emerald Canopy
      createPomegranateModel, // 2: Ruby Beet (Matches user's reference photo!)
      createDragonfruitModel, // 3: Dragon Fruit Sunrise
      createCoconutModel, // 4: Blue Majik
    ];

    const fruitGroups: THREE.Group[] = [];
    fruitBuilders.forEach((builder, idx) => {
      const fGroup = builder();
      fGroup.position.set(1.55, -1.6, 0.4); // Sitting right beside the glass!
      const initialScale = idx === flavorIndex ? 1 : 0;
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

      rotationTargetRef.current.y += deltaX * 0.007;
      rotationTargetRef.current.x = Math.max(
        -0.2,
        Math.min(0.4, rotationTargetRef.current.x + deltaY * 0.005)
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

      rotationTargetRef.current.y += deltaX * 0.008;
      rotationTargetRef.current.x = Math.max(
        -0.2,
        Math.min(0.4, rotationTargetRef.current.x + deltaY * 0.006)
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
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Smooth color lerping
      currentColorRef.current.lerp(targetColorRef.current, delta * 3.5);
      if (liquidMaterialRef.current) {
        liquidMaterialRef.current.color.copy(currentColorRef.current);
        liquidMaterialRef.current.attenuationColor
          .copy(currentColorRef.current)
          .multiplyScalar(0.7);
      }
      if (pointLightRef.current) {
        pointLightRef.current.color.copy(currentColorRef.current);
      }

      // Smooth rotation with spring inertia
      rotationCurrentRef.current.x +=
        (rotationTargetRef.current.x - rotationCurrentRef.current.x) * (delta * 6.0);
      rotationCurrentRef.current.y +=
        (rotationTargetRef.current.y - rotationCurrentRef.current.y) * (delta * 6.0);

      if (stageGroupRef.current) {
        stageGroupRef.current.rotation.x = rotationCurrentRef.current.x;
        stageGroupRef.current.rotation.y = rotationCurrentRef.current.y;
      }

      // Slosh physics simulation
      const springK = 24.0;
      const damping = 4.5;
      sloshVelRef.current.x +=
        (-springK * sloshAngleRef.current.x - damping * sloshVelRef.current.x) * delta;
      sloshVelRef.current.z +=
        (-springK * sloshAngleRef.current.z - damping * sloshVelRef.current.z) * delta;
      sloshAngleRef.current.x += sloshVelRef.current.x * delta;
      sloshAngleRef.current.z += sloshVelRef.current.z * delta;

      if (liquidMeshRef.current) {
        liquidMeshRef.current.rotation.z = sloshAngleRef.current.x * 0.35;
        liquidMeshRef.current.rotation.x = sloshAngleRef.current.z * 0.35;
      }

      // Bobbing ice cubes synchronized with slosh & time
      iceCubesRef.current.forEach((ice, i) => {
        const baseCfg = iceConfigs[i];
        ice.position.y =
          baseCfg.pos[1] +
          Math.sin(time * 2.2 + i * 1.5) * 0.035 +
          sloshAngleRef.current.z * 0.2;
        ice.rotation.y += delta * (0.3 + i * 0.1);
        ice.rotation.z = baseCfg.rot[2] + sloshAngleRef.current.x * 0.5;
      });

      // Effervescent Rising Micro-bubbles
      if (bubblesPointsRef.current) {
        const posAttr = bubblesPointsRef.current.geometry.attributes
          .position as THREE.BufferAttribute;
        const pArr = posAttr.array as Float32Array;

        for (let i = 0; i < bubbleCount; i++) {
          pArr[i * 3 + 1] += bubbleVelocities[i] * effervescenceRef.current;
          pArr[i * 3 + 0] += Math.sin(time * 3 + i) * 0.002;

          // Pop at liquid surface
          if (pArr[i * 3 + 1] > 1.05) {
            pArr[i * 3 + 1] = -1.1;
            pArr[i * 3 + 0] = (Math.random() - 0.5) * 1.2;
            pArr[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
          }
        }
        posAttr.needsUpdate = true;
      }

      // Effervescence decay
      effervescenceRef.current = Math.max(
        1.0,
        effervescenceRef.current - delta * 2.2
      );

      // Smooth Fruit Groups Scale Transitions
      const activeIdx = activeFruitIdxRef.current;
      fruitGroupsRef.current.forEach((fGroup, idx) => {
        const targetScale = idx === activeIdx ? 1.0 : 0.0;
        const currentScale = fruitScalesRef.current[idx] ?? 0;
        const newScale = currentScale + (targetScale - currentScale) * (delta * 5.5);
        fruitScalesRef.current[idx] = newScale;

        fGroup.scale.set(newScale, newScale, newScale);
        fGroup.visible = newScale > 0.005;

        // Subtle organic breathing & levitation of fruits
        if (newScale > 0.01) {
          fGroup.position.y = -1.6 + Math.sin(time * 1.8 + idx) * 0.025;
        }
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
      camera.aspect = w / h;
      camera.position.z = isMob ? 8.6 : 7.4;
      if (stageGroupRef.current) {
        stageGroupRef.current.position.x = isMob ? -0.2 : -0.35;
      }
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
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
      onClick={handleSwirl}
      className="w-full h-full min-h-[460px] sm:min-h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
    />
  );
};
