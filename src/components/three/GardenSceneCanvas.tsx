import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import {
  createBrickTextureSet,
  createContactShadowTexture,
  createLawnTextureSet,
  createPatioTextureSet,
  createTimberTextureSet,
  type PatioFinishId,
} from './gardenTextures';

type LightingMoodId = 'morning' | 'golden' | 'dusk';
type CameraPresetId = 'overview' | 'patio' | 'pergola' | 'brickwork';

interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: CameraPreset[] = [
  { id: 'overview', label: 'Garden Overview', position: [8.6, 5.2, 9.2], target: [0, 0.8, -0.2] },
  { id: 'patio', label: 'Patio & Paving', position: [3.6, 2.8, 5.6], target: [-0.4, 0.25, 0.6] },
  { id: 'pergola', label: 'Pergola & Timber', position: [-5.8, 3.3, 4.9], target: [-1.4, 1.4, -1.2] },
  { id: 'brickwork', label: 'Brickwork & Steps', position: [5.5, 2.4, -4.6], target: [1.5, 0.7, -1.5] },
];

const FINISH_OPTIONS: { id: PatioFinishId; label: string; quoteType: string }[] = [
  { id: 'sandstone', label: 'Natural Sandstone', quoteType: 'Patio or paving' },
  { id: 'porcelain-dark', label: 'Slate Porcelain', quoteType: 'Patio or paving' },
  { id: 'porcelain-cream', label: 'Cream Porcelain', quoteType: 'Patio or paving' },
  { id: 'block-herringbone', label: 'Herringbone Block', quoteType: 'Block paving or driveway' },
];

const LIGHTING_OPTIONS: { id: LightingMoodId; label: string }[] = [
  { id: 'morning', label: 'Daylight' },
  { id: 'golden', label: 'Golden Hour' },
  { id: 'dusk', label: 'Evening Uplight' },
];

// Scratch objects pre-allocated outside render loop (zero GC)
const _scratchPos = new THREE.Vector3();
const _scratchTarget = new THREE.Vector3();
const _dummyObj = new THREE.Object3D();
const _tempColor = new THREE.Color();

interface GardenSceneCanvasProps {
  onSelectFinishQuote: (projectType: string) => void;
}

export function GardenSceneCanvas({ onSelectFinishQuote }: GardenSceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [finish, setFinish] = useState<PatioFinishId>('sandstone');
  const [mood, setMood] = useState<LightingMoodId>('golden');
  const [preset, setPreset] = useState<CameraPresetId>('overview');
  const [dockOpen, setDockOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  // Mutable bridge refs so React UI updates never recreate WebGLRenderer
  const sceneControlRef = useRef<{
    applyFinish: (f: PatioFinishId) => void;
    applyMood: (m: LightingMoodId) => void;
    applyCameraPreset: (id: CameraPresetId) => void;
  } | null>(null);

  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    // Software WebGL probe
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = mountEl.clientWidth || 1024;
    const height = mountEl.clientHeight || 640;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const skyDayColor = new THREE.Color('#dce6e8');
    scene.background = skyDayColor.clone();
    scene.fog = new THREE.FogExp2(skyDayColor.getHex(), 0.022);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 140);
    camera.position.set(...CAMERA_PRESETS[0].position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS[0].target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 4.2;
    controls.maxDistance = 16.5;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.update();

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // Lighting rig: warm directional key + cool hemisphere fill + subtle rim + dusk lanterns
    const hemiLight = new THREE.HemisphereLight('#cfe3ee', '#4f4636', 0.65);
    hemiLight.position.set(0, 25, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#fff1d6', 2.2);
    keyLight.position.set(10, 11, 7);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 36;
    keyLight.shadow.camera.left = -11;
    keyLight.shadow.camera.right = 11;
    keyLight.shadow.camera.top = 11;
    keyLight.shadow.camera.bottom = -11;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#b7d5da', 0.55);
    rimLight.position.set(-8, 6, -9);
    scene.add(rimLight);

    const lanternLights: THREE.PointLight[] = [];
    const lanternBulbs: THREE.Mesh[] = [];

    // Disposable tracking
    const disposables: { dispose: () => void }[] = [envTarget];
    const track = <T extends { dispose: () => void }>(res: T): T => {
      disposables.push(res);
      return res;
    };

    // Textures
    const brickTex = createBrickTextureSet(maxAniso);
    track(brickTex.map);
    track(brickTex.bumpMap);

    const timberTex = createTimberTextureSet(maxAniso, '#8d6840');
    track(timberTex.map);
    track(timberTex.bumpMap);

    const slatTimberTex = createTimberTextureSet(maxAniso, '#5b6669');
    track(slatTimberTex.map);
    track(slatTimberTex.bumpMap);

    const lawnTex = createLawnTextureSet(maxAniso);
    track(lawnTex.map);
    track(lawnTex.bumpMap);

    const contactShadowTex = track(createContactShadowTexture());

    // 1. Extended Outdoor Lawn Ground (natural horizon fade, no floating box)
    const groundGeo = track(new THREE.PlaneGeometry(80, 80));
    const groundMat = track(
      new THREE.MeshStandardMaterial({
        map: lawnTex.map,
        bumpMap: lawnTex.bumpMap,
        bumpScale: 0.03,
        roughness: 0.92,
        metalness: 0.0,
      })
    );
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Soft radial contact shadow beneath architectural terrace
    const shadowPlaneGeo = track(new THREE.PlaneGeometry(11.5, 9.5));
    const shadowPlaneMat = track(
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.42,
      })
    );
    const contactShadow = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.008, 0);
    scene.add(contactShadow);

    // 2. COMPOSITE PATIO & TERRACE ASSEMBLY (THREE.Group — 6 distinct parts)
    const terraceGroup = new THREE.Group();
    scene.add(terraceGroup);

    const subBaseMat = track(
      new THREE.MeshStandardMaterial({ color: '#78736a', roughness: 0.94, metalness: 0.02 })
    );
    const subBaseMesh = new THREE.Mesh(track(new THREE.BoxGeometry(7.2, 0.12, 5.4)), subBaseMat);
    subBaseMesh.position.set(0, 0.06, 0.3);
    subBaseMesh.receiveShadow = true;
    subBaseMesh.castShadow = true;
    terraceGroup.add(subBaseMesh);

    const initialPatioTex = createPatioTextureSet('sandstone', maxAniso);
    track(initialPatioTex.map);
    track(initialPatioTex.bumpMap);

    const patioTopMat = track(
      new THREE.MeshStandardMaterial({
        map: initialPatioTex.map,
        bumpMap: initialPatioTex.bumpMap,
        bumpScale: 0.028,
        roughness: initialPatioTex.roughness,
        metalness: initialPatioTex.metalness,
      })
    );
    const patioSlabMesh = new THREE.Mesh(track(new THREE.BoxGeometry(6.8, 0.08, 5.0)), patioTopMat);
    patioSlabMesh.position.set(0, 0.16, 0.3);
    patioSlabMesh.receiveShadow = true;
    patioSlabMesh.castShadow = true;
    terraceGroup.add(patioSlabMesh);

    // Outer charcoal edging course
    const borderMat = track(
      new THREE.MeshStandardMaterial({ color: '#3b3f42', roughness: 0.72, metalness: 0.05 })
    );
    const frontBorder = new THREE.Mesh(track(new THREE.BoxGeometry(7.04, 0.085, 0.16)), borderMat);
    frontBorder.position.set(0, 0.16, 2.88);
    frontBorder.castShadow = true;
    frontBorder.receiveShadow = true;
    terraceGroup.add(frontBorder);

    const sideBorder = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.085, 5.16)), borderMat);
    sideBorder.position.set(3.48, 0.16, 0.3);
    sideBorder.castShadow = true;
    sideBorder.receiveShadow = true;
    terraceGroup.add(sideBorder);

    // Recessed linear slot drainage grate (galvanised steel metalness contrast)
    const grateMat = track(
      new THREE.MeshStandardMaterial({ color: '#42494d', roughness: 0.28, metalness: 0.82 })
    );
    const drainMesh = new THREE.Mesh(track(new THREE.BoxGeometry(6.6, 0.02, 0.13)), grateMat);
    drainMesh.position.set(0, 0.205, -2.05);
    terraceGroup.add(drainMesh);

    // 3. COMPOSITE BRICK RETAINING WALL, PIERS & STEPS (THREE.Group — 7 distinct parts)
    const masonryGroup = new THREE.Group();
    scene.add(masonryGroup);

    const brickMat = track(
      new THREE.MeshStandardMaterial({
        map: brickTex.map,
        bumpMap: brickTex.bumpMap,
        bumpScale: 0.035,
        roughness: 0.88,
        metalness: 0.02,
      })
    );
    const copingMat = track(
      new THREE.MeshStandardMaterial({ color: '#cdc5b5', roughness: 0.65, metalness: 0.03 })
    );

    // Main rear retaining brick wall
    const rearWall = new THREE.Mesh(track(new THREE.BoxGeometry(4.8, 0.95, 0.34)), brickMat);
    rearWall.position.set(1.2, 0.475, -2.55);
    rearWall.castShadow = true;
    rearWall.receiveShadow = true;
    masonryGroup.add(rearWall);

    // Beveled stone wall coping (ExtrudeGeometry)
    const copingShape = new THREE.Shape();
    copingShape.moveTo(-0.22, 0);
    copingShape.lineTo(0.22, 0);
    copingShape.lineTo(0.19, 0.08);
    copingShape.lineTo(-0.19, 0.08);
    copingShape.closePath();
    const copingGeo = track(
      new THREE.ExtrudeGeometry(copingShape, {
        depth: 4.86,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2,
      })
    );
    copingGeo.rotateY(Math.PI / 2);
    const rearCoping = new THREE.Mesh(copingGeo, copingMat);
    rearCoping.position.set(-1.23, 0.95, -2.55);
    rearCoping.castShadow = true;
    rearCoping.receiveShadow = true;
    masonryGroup.add(rearCoping);

    // Twin Brick Piers + Stone Pier Caps + Lantern Accents
    const pierPositions: [number, number][] = [
      [3.7, -2.55],
      [3.7, 2.88],
    ];
    pierPositions.forEach(([px, pz]) => {
      const pier = new THREE.Mesh(track(new THREE.BoxGeometry(0.48, 1.32, 0.48)), brickMat);
      pier.position.set(px, 0.66, pz);
      pier.castShadow = true;
      pier.receiveShadow = true;
      masonryGroup.add(pier);

      const pierCap = new THREE.Mesh(track(new THREE.BoxGeometry(0.58, 0.09, 0.58)), copingMat);
      pierCap.position.set(px, 1.365, pz);
      pierCap.castShadow = true;
      masonryGroup.add(pierCap);

      // Lantern finial housing (Lathe/Cylinder + glass bulb)
      const lanternBase = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.08, 0.11, 0.08, 8)),
        grateMat
      );
      lanternBase.position.set(px, 1.45, pz);
      masonryGroup.add(lanternBase);

      const bulbMat = track(
        new THREE.MeshStandardMaterial({
          color: '#fff2cf',
          emissive: '#ffbe66',
          emissiveIntensity: 0.15,
          roughness: 0.25,
        })
      );
      const bulb = new THREE.Mesh(track(new THREE.CylinderGeometry(0.065, 0.065, 0.16, 8)), bulbMat);
      bulb.position.set(px, 1.56, pz);
      masonryGroup.add(bulb);
      lanternBulbs.push(bulb);

      const lanternCap = new THREE.Mesh(track(new THREE.ConeGeometry(0.11, 0.08, 8)), grateMat);
      lanternCap.position.set(px, 1.68, pz);
      masonryGroup.add(lanternCap);

      const pLight = new THREE.PointLight('#ffbf6b', 0, 7, 1.6);
      pLight.position.set(px, 1.6, pz);
      scene.add(pLight);
      lanternLights.push(pLight);
    });

    // Two-step brick & stone garden steps rising onto rear lawn
    const step1Brick = new THREE.Mesh(track(new THREE.BoxGeometry(1.5, 0.24, 0.46)), brickMat);
    step1Brick.position.set(2.55, 0.32, -2.05);
    step1Brick.castShadow = true;
    step1Brick.receiveShadow = true;
    masonryGroup.add(step1Brick);

    const step1Tread = new THREE.Mesh(track(new THREE.BoxGeometry(1.56, 0.05, 0.5)), copingMat);
    step1Tread.position.set(2.55, 0.46, -2.05);
    step1Tread.castShadow = true;
    masonryGroup.add(step1Tread);

    const step2Brick = new THREE.Mesh(track(new THREE.BoxGeometry(1.5, 0.48, 0.46)), brickMat);
    step2Brick.position.set(2.55, 0.44, -2.52);
    step2Brick.castShadow = true;
    masonryGroup.add(step2Brick);

    const step2Tread = new THREE.Mesh(track(new THREE.BoxGeometry(1.56, 0.05, 0.5)), copingMat);
    step2Tread.position.set(2.55, 0.7, -2.52);
    step2Tread.castShadow = true;
    masonryGroup.add(step2Tread);

    // 4. COMPOSITE TIMBER PERGOLA & SLATTED SCREEN (THREE.Group + InstancedMesh slats)
    const pergolaGroup = new THREE.Group();
    scene.add(pergolaGroup);

    const timberMat = track(
      new THREE.MeshStandardMaterial({
        map: timberTex.map,
        bumpMap: timberTex.bumpMap,
        bumpScale: 0.025,
        roughness: 0.78,
        metalness: 0.02,
      })
    );
    const steelShoeMat = track(
      new THREE.MeshStandardMaterial({ color: '#8a9196', roughness: 0.28, metalness: 0.88 })
    );

    const postCoords: [number, number][] = [
      [-3.1, -1.9],
      [-0.4, -1.9],
      [-3.1, 1.3],
      [-0.4, 1.3],
    ];
    const postGeo = track(new THREE.BoxGeometry(0.14, 2.38, 0.14));
    const shoeGeo = track(new THREE.BoxGeometry(0.17, 0.14, 0.17));
    postCoords.forEach(([px, pz]) => {
      const shoe = new THREE.Mesh(shoeGeo, steelShoeMat);
      shoe.position.set(px, 0.27, pz);
      shoe.castShadow = true;
      pergolaGroup.add(shoe);

      const post = new THREE.Mesh(postGeo, timberMat);
      post.position.set(px, 1.52, pz);
      post.castShadow = true;
      post.receiveShadow = true;
      pergolaGroup.add(post);
    });

    // Twin longitudinal beams
    const beamGeo = track(new THREE.BoxGeometry(0.1, 0.18, 3.85));
    [-3.1, -0.4].forEach((bx) => {
      const beam = new THREE.Mesh(beamGeo, timberMat);
      beam.position.set(bx, 2.66, -0.3);
      beam.castShadow = true;
      pergolaGroup.add(beam);
    });

    // Shaped Pergola Rafters with angled ends (ExtrudeGeometry)
    const rafterShape = new THREE.Shape();
    rafterShape.moveTo(-1.75, 0);
    rafterShape.lineTo(1.75, 0);
    rafterShape.lineTo(1.62, 0.16);
    rafterShape.lineTo(-1.62, 0.16);
    rafterShape.closePath();
    const rafterGeo = track(
      new THREE.ExtrudeGeometry(rafterShape, {
        depth: 0.07,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
        bevelSegments: 1,
      })
    );
    for (let i = 0; i < 6; i++) {
      const rz = -1.95 + i * 0.66;
      const rafter = new THREE.Mesh(rafterGeo, timberMat);
      rafter.position.set(-1.75, 2.74, rz);
      rafter.castShadow = true;
      pergolaGroup.add(rafter);
    }

    // Slatted Privacy Fence Screen (>20 repeated slats via InstancedMesh!)
    const slatMat = track(
      new THREE.MeshStandardMaterial({
        map: slatTimberTex.map,
        bumpMap: slatTimberTex.bumpMap,
        bumpScale: 0.02,
        roughness: 0.72,
        metalness: 0.03,
      })
    );
    const slatGeo = track(new THREE.BoxGeometry(0.03, 0.055, 3.24));
    const slatCount = 22;
    const slatInstanced = new THREE.InstancedMesh(slatGeo, slatMat, slatCount);
    slatInstanced.castShadow = true;
    slatInstanced.receiveShadow = true;
    for (let i = 0; i < slatCount; i++) {
      _dummyObj.position.set(-3.45, 0.28 + i * 0.088, -0.3);
      _dummyObj.rotation.set(0, 0, 0);
      _dummyObj.scale.set(1, 1, 1);
      _dummyObj.updateMatrix();
      slatInstanced.setMatrixAt(i, _dummyObj.matrix);
    }
    slatInstanced.instanceMatrix.needsUpdate = true;
    slatInstanced.computeBoundingSphere();
    pergolaGroup.add(slatInstanced);

    // 5. SLEEPER RAISED BED, INSTANCED GRAVEL BORDER & COMPOSITE BOTANICALS
    const gardenFeatureGroup = new THREE.Group();
    scene.add(gardenFeatureGroup);

    const sleeperFront = new THREE.Mesh(track(new THREE.BoxGeometry(2.6, 0.34, 0.16)), timberMat);
    sleeperFront.position.set(-2.1, 0.17, 3.45);
    sleeperFront.castShadow = true;
    sleeperFront.receiveShadow = true;
    gardenFeatureGroup.add(sleeperFront);

    const sleeperSide = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.34, 0.75)), timberMat);
    sleeperSide.position.set(-0.88, 0.17, 3.15);
    sleeperSide.castShadow = true;
    gardenFeatureGroup.add(sleeperSide);

    const soilMat = track(new THREE.MeshStandardMaterial({ color: '#3b2e22', roughness: 0.96 }));
    const soilBed = new THREE.Mesh(track(new THREE.BoxGeometry(2.44, 0.28, 0.6)), soilMat);
    soilBed.position.set(-2.12, 0.14, 3.12);
    soilBed.receiveShadow = true;
    gardenFeatureGroup.add(soilBed);

    // InstancedMesh decorative gravel chippings (180 pebbles with scale & tint variation)
    const gravelGeo = track(new THREE.DodecahedronGeometry(0.045, 0));
    const gravelMat = track(new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0.02 }));
    const pebbleCount = 180;
    const gravelMesh = new THREE.InstancedMesh(gravelGeo, gravelMat, pebbleCount);
    const gravelPalette = ['#b8b3a6', '#8d8f94', '#c9bfa8', '#6e7278'];
    for (let i = 0; i < pebbleCount; i++) {
      const gx = -0.6 + ((i * 37) % 100) / 100 * 3.9;
      const gz = 3.0 + ((i * 53) % 100) / 100 * 0.42;
      _dummyObj.position.set(gx, 0.028, gz);
      _dummyObj.rotation.set(i * 0.7, i * 1.1, 0);
      const sc = 0.75 + ((i * 19) % 45) / 100;
      _dummyObj.scale.set(sc * 1.2, sc * 0.7, sc);
      _dummyObj.updateMatrix();
      gravelMesh.setMatrixAt(i, _dummyObj.matrix);
      _tempColor.set(gravelPalette[i % gravelPalette.length]);
      gravelMesh.setColorAt(i, _tempColor);
    }
    gravelMesh.instanceMatrix.needsUpdate = true;
    if (gravelMesh.instanceColor) gravelMesh.instanceColor.needsUpdate = true;
    gravelMesh.computeBoundingSphere();
    gardenFeatureGroup.add(gravelMesh);

    // Composite Botanical Shrubs (multi-part stem + clustered foliage mounds)
    const leafMatDark = track(new THREE.MeshStandardMaterial({ color: '#385c34', roughness: 0.85 }));
    const leafMatMid = track(new THREE.MeshStandardMaterial({ color: '#4c7541', roughness: 0.82 }));
    const leafMatSage = track(new THREE.MeshStandardMaterial({ color: '#5c8256', roughness: 0.8 }));
    const stemMat = track(new THREE.MeshStandardMaterial({ color: '#5b432c', roughness: 0.92 }));

    const buildCompositeShrub = (x: number, yBase: number, z: number, scale = 1) => {
      const shrub = new THREE.Group();
      shrub.position.set(x, yBase, z);
      shrub.scale.setScalar(scale);

      const trunk = new THREE.Mesh(track(new THREE.CylinderGeometry(0.04, 0.06, 0.3, 7)), stemMat);
      trunk.position.y = 0.15;
      trunk.castShadow = true;
      shrub.add(trunk);

      const puffs: [number, number, number, number, THREE.MeshStandardMaterial][] = [
        [0, 0.34, 0, 0.26, leafMatDark],
        [-0.14, 0.28, 0.1, 0.19, leafMatMid],
        [0.15, 0.29, -0.08, 0.2, leafMatSage],
        [0.04, 0.44, 0.08, 0.17, leafMatMid],
      ];
      puffs.forEach(([cx, cy, cz, r, m]) => {
        const lobe = new THREE.Mesh(track(new THREE.IcosahedronGeometry(r, 1)), m);
        lobe.position.set(cx, cy, cz);
        lobe.castShadow = true;
        lobe.receiveShadow = true;
        shrub.add(lobe);
      });
      return shrub;
    };

    gardenFeatureGroup.add(buildCompositeShrub(-2.9, 0.28, 3.12, 1.0));
    gardenFeatureGroup.add(buildCompositeShrub(-2.1, 0.28, 3.12, 0.85));
    gardenFeatureGroup.add(buildCompositeShrub(-1.35, 0.28, 3.12, 1.05));

    // Composite Ornamental Garden Tree behind retaining wall (trunk + 2 branches + 5 canopy clusters)
    const treeGroup = new THREE.Group();
    treeGroup.position.set(-4.3, 0, -3.5);
    const treeTrunk = new THREE.Mesh(track(new THREE.CylinderGeometry(0.11, 0.17, 1.9, 9)), stemMat);
    treeTrunk.position.y = 0.95;
    treeTrunk.castShadow = true;
    treeGroup.add(treeTrunk);

    const branch1 = new THREE.Mesh(track(new THREE.CylinderGeometry(0.05, 0.08, 1.0, 7)), stemMat);
    branch1.position.set(0.3, 1.85, 0.1);
    branch1.rotation.z = -0.55;
    branch1.castShadow = true;
    treeGroup.add(branch1);

    const branch2 = new THREE.Mesh(track(new THREE.CylinderGeometry(0.05, 0.08, 0.95, 7)), stemMat);
    branch2.position.set(-0.28, 1.9, -0.15);
    branch2.rotation.z = 0.5;
    branch2.castShadow = true;
    treeGroup.add(branch2);

    const canopyPuffs: [number, number, number, number, THREE.MeshStandardMaterial][] = [
      [0, 2.55, 0, 0.85, leafMatMid],
      [-0.55, 2.3, 0.25, 0.65, leafMatDark],
      [0.6, 2.32, -0.15, 0.68, leafMatSage],
      [0.15, 2.95, 0.2, 0.6, leafMatSage],
      [-0.2, 2.4, -0.45, 0.58, leafMatDark],
    ];
    canopyPuffs.forEach(([cx, cy, cz, r, m]) => {
      const crown = new THREE.Mesh(track(new THREE.IcosahedronGeometry(r, 1)), m);
      crown.position.set(cx, cy, cz);
      crown.castShadow = true;
      crown.receiveShadow = true;
      treeGroup.add(crown);
    });
    scene.add(treeGroup);

    // Close-board timber fence perimeter framing the rear garden
    const fenceBayMat = track(
      new THREE.MeshStandardMaterial({
        map: timberTex.map,
        bumpMap: timberTex.bumpMap,
        bumpScale: 0.02,
        color: '#8f7b5d',
        roughness: 0.88,
      })
    );
    const rearFence = new THREE.Mesh(track(new THREE.BoxGeometry(9.4, 1.65, 0.09)), fenceBayMat);
    rearFence.position.set(-1.1, 0.825, -4.45);
    rearFence.receiveShadow = true;
    rearFence.castShadow = true;
    scene.add(rearFence);

    // Pre-warm shaders when GPU present
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Smooth camera preset transition state
    let transitionActive = false;
    const cancelTransition = () => {
      transitionActive = false;
    };
    controls.addEventListener('start', cancelTransition);

    // On-demand render scheduler with Software-WebGL afterDraw pacing
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) return;
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        renderDirty = false;

        if (transitionActive) {
          const factor = isSoftwareGl ? 1 : 1 - Math.exp(-6.5 * dt);
          camera.position.lerp(_scratchPos, factor);
          controls.target.lerp(_scratchTarget, factor);
          if (
            camera.position.distanceTo(_scratchPos) < 0.02 &&
            controls.target.distanceTo(_scratchTarget) < 0.02
          ) {
            camera.position.copy(_scratchPos);
            controls.target.copy(_scratchTarget);
            transitionActive = false;
          } else {
            renderDirty = true;
          }
        }

        const changed = controls.update();
        if (changed && !isSoftwareGl) {
          renderDirty = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty && !disposed) requestRender();
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    controls.addEventListener('change', requestRender);

    // Bridge handlers
    sceneControlRef.current = {
      applyFinish: (f: PatioFinishId) => {
        const nextSet = createPatioTextureSet(f, maxAniso);
        track(nextSet.map);
        track(nextSet.bumpMap);
        patioTopMat.map = nextSet.map;
        patioTopMat.bumpMap = nextSet.bumpMap;
        patioTopMat.roughness = nextSet.roughness;
        patioTopMat.metalness = nextSet.metalness;
        patioTopMat.needsUpdate = true;
        requestRender();
      },
      applyMood: (m: LightingMoodId) => {
        if (m === 'morning') {
          scene.background = new THREE.Color('#dce6e8');
          (scene.fog as THREE.FogExp2).color.set('#dce6e8');
          keyLight.color.set('#ffffff');
          keyLight.intensity = 2.35;
          keyLight.position.set(7, 13, 8);
          hemiLight.color.set('#d5ebf5');
          hemiLight.groundColor.set('#5c5240');
          hemiLight.intensity = 0.72;
          lanternLights.forEach((l) => (l.intensity = 0));
          lanternBulbs.forEach((b) => {
            (b.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
          });
        } else if (m === 'golden') {
          scene.background = new THREE.Color('#e2ddd2');
          (scene.fog as THREE.FogExp2).color.set('#e2ddd2');
          keyLight.color.set('#ffe2b0');
          keyLight.intensity = 2.25;
          keyLight.position.set(11, 7.5, 6);
          hemiLight.color.set('#c4dae6');
          hemiLight.groundColor.set('#594934');
          hemiLight.intensity = 0.58;
          lanternLights.forEach((l) => (l.intensity = 0.35));
          lanternBulbs.forEach((b) => {
            (b.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.45;
          });
        } else {
          scene.background = new THREE.Color('#1c2628');
          (scene.fog as THREE.FogExp2).color.set('#1c2628');
          keyLight.color.set('#89a8c4');
          keyLight.intensity = 0.65;
          keyLight.position.set(-8, 10, -5);
          hemiLight.color.set('#31444d');
          hemiLight.groundColor.set('#1f1b16');
          hemiLight.intensity = 0.42;
          lanternLights.forEach((l) => (l.intensity = 2.8));
          lanternBulbs.forEach((b) => {
            (b.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.2;
          });
        }
        requestRender();
      },
      applyCameraPreset: (id: CameraPresetId) => {
        const found = CAMERA_PRESETS.find((c) => c.id === id) || CAMERA_PRESETS[0];
        _scratchPos.set(...found.position);
        _scratchTarget.set(...found.target);
        transitionActive = true;
        requestRender();
      },
    };

    // Apply initial mood & render
    sceneControlRef.current.applyMood('golden');
    requestRender();

    const handleResize = () => {
      if (!mountEl || disposed) return;
      const w = mountEl.clientWidth || 1024;
      const h = mountEl.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountEl);

    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', cancelTransition);
      controls.removeEventListener('change', requestRender);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleFinishChange = (f: PatioFinishId) => {
    setFinish(f);
    sceneControlRef.current?.applyFinish(f);
  };

  const handleMoodChange = (m: LightingMoodId) => {
    setMood(m);
    sceneControlRef.current?.applyMood(m);
  };

  const handlePresetChange = (p: CameraPresetId) => {
    setPreset(p);
    sceneControlRef.current?.applyCameraPreset(p);
  };

  const selectedFinishMeta = FINISH_OPTIONS.find((item) => item.id === finish)!;

  return (
    <section
      id="studio-3d"
      className="bg-[#141414] text-white border-b border-white/10"
      aria-label="Interactive 3D Garden & Paving Visualiser"
    >
      {/* Editorial Intro Strip Above Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#68ACAE] mb-2.5">
              Interactive 3D Materials &amp; Structure Visualiser
            </p>
            <h2 className="font-display text-white text-balance text-3xl sm:text-4xl font-semibold leading-[1.14] tracking-tight">
              Explore How Paving, Brickwork &amp; Timber Work Together.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#E2E2E2]/85 max-w-md leading-relaxed">
            Orbit the 3D garden courtyard below to compare sandstone, porcelain, and herringbone
            block finishes alongside brick steps, sleeper beds, and a timber pergola.
          </p>
        </div>
      </div>

      {/* Full-Bleed Viewport Stage */}
      <div
        ref={containerRef}
        className={
          fullscreen
            ? 'fixed inset-0 z-50 w-screen h-screen bg-[#141414]'
            : 'relative w-full h-[76vh] min-h-[520px] max-h-[820px] bg-[#141414] overflow-hidden border-t border-white/10'
        }
      >
        {/* Dedicated WebGL Canvas Container */}
        <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {webglUnavailable && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141414] text-center p-8">
            <p className="font-display text-2xl text-white mb-2">
              3D Preview Unavailable on This Browser
            </p>
            <p className="text-sm text-[#A1A1A1] max-w-md">
              Please explore our genuine completed project photography in the portfolio section
              below.
            </p>
          </div>
        )}

        {/* Top-Left Minimal Context Label & Top-Right Fullscreen Toggle */}
        <div className="pointer-events-none absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between gap-4 z-10">
          <div className="pointer-events-auto bg-[#141414]/88 border border-white/15 px-3.5 py-2 text-xs text-[#F5F5F5]">
            <span className="font-semibold text-[#68ACAE]">{selectedFinishMeta.label}</span>
            <span className="mx-2 text-white/30" aria-hidden="true">
              ·
            </span>
            <span className="text-[#E2E2E2]">Drag to orbit · Scroll to zoom</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePresetChange('overview')}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 text-xs font-medium bg-[#141414]/88 text-[#F5F5F5] border border-white/15 hover:bg-[#579091] hover:border-[#579091] transition-colors cursor-pointer"
              aria-label="Reset camera view"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Reset View</span>
            </button>
            <button
              type="button"
              onClick={() => setFullscreen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 text-xs font-medium bg-[#141414]/88 text-[#F5F5F5] border border-white/15 hover:bg-[#579091] hover:border-[#579091] transition-colors cursor-pointer"
              aria-label={fullscreen ? 'Exit fullscreen 3D view' : 'Expand fullscreen 3D view'}
            >
              {fullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Fullscreen 3D</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Unified Bottom Control Dock (solid rgba surface, no backdrop-filter over WebGL) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(940px,94vw)] z-20 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setDockOpen((prev) => !prev)}
            aria-expanded={dockOpen}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] bg-[#141414]/94 text-[#E2E2E2] border border-b-0 border-white/15 hover:text-white cursor-pointer"
          >
            {dockOpen ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Hide Controls</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Show Controls</span>
              </>
            )}
          </button>

          {dockOpen && (
            <div className="w-full bg-[#141414]/94 border border-white/15 p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Paving Surface Switcher */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1] mr-1.5">
                  Surface:
                </span>
                {FINISH_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleFinishChange(opt.id)}
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      finish === opt.id
                        ? 'bg-[#579091] text-white'
                        : 'bg-[#222222] text-[#E2E2E2] hover:bg-[#2F2F2F]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Lighting & Camera Viewpoints */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  {LIGHTING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleMoodChange(opt.id)}
                      className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        mood === opt.id
                          ? 'bg-white text-[#141414]'
                          : 'bg-[#222222] text-[#E2E2E2] hover:bg-[#2F2F2F]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-1 border-l border-white/15 pl-2">
                  {CAMERA_PRESETS.map((cam) => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => handlePresetChange(cam.id)}
                      className={`px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        preset === cam.id
                          ? 'bg-[#39A097] text-white'
                          : 'bg-[#222222] text-[#E2E2E2] hover:bg-[#2F2F2F]'
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFullscreen(false);
                    onSelectFinishQuote(selectedFinishMeta.quoteType);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#579091] text-white hover:bg-[#39A097] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Quote This Finish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
