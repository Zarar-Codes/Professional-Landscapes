import * as THREE from 'three';

export type PatioFinishId =
  | 'sandstone'
  | 'porcelain-dark'
  | 'porcelain-cream'
  | 'block-herringbone';

export interface ProceduralTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughness: number;
  metalness: number;
}

function makeCanvas(size = 512): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function configureTexture(
  canvas: HTMLCanvasElement,
  isColor: boolean,
  anisotropy: number,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = anisotropy;
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function seededRand(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function createPatioTextureSet(
  finish: PatioFinishId,
  anisotropy: number
): ProceduralTextureSet {
  const size = 512;
  const [albedoCanvas, actx] = makeCanvas(size);
  const [bumpCanvas, bctx] = makeCanvas(size);
  const rand = seededRand(finish.length * 9173 + 41);

  if (finish === 'sandstone') {
    // Mortar background
    actx.fillStyle = '#9c927e';
    actx.fillRect(0, 0, size, size);
    bctx.fillStyle = '#383838';
    bctx.fillRect(0, 0, size, size);

    // Coursed natural Indian sandstone slabs
    const slabs = [
      [4, 4, 248, 164],
      [260, 4, 248, 248],
      [4, 176, 120, 164],
      [132, 176, 120, 164],
      [260, 260, 164, 248],
      [432, 260, 76, 248],
      [4, 348, 248, 160],
    ];
    const tones = ['#c8b08a', '#bda277', '#cfb894', '#b4956b', '#c3ab86', '#aa8d68', '#cbb591'];

    slabs.forEach(([x, y, w, h], idx) => {
      actx.fillStyle = tones[idx % tones.length];
      actx.fillRect(x, y, w, h);

      bctx.fillStyle = '#c8c8c8';
      bctx.fillRect(x, y, w, h);

      // Natural sedimentary grain & riven texture
      for (let i = 0; i < 160; i++) {
        const gx = x + rand() * w;
        const gy = y + rand() * h;
        const gw = 12 + rand() * 34;
        const gh = 2 + rand() * 5;
        const shade = rand() > 0.5 ? 'rgba(255,248,230,0.08)' : 'rgba(92,70,42,0.09)';
        actx.fillStyle = shade;
        actx.fillRect(gx, gy, Math.min(gw, x + w - gx), Math.min(gh, y + h - gy));

        const bVal = Math.floor(165 + (rand() - 0.5) * 65);
        bctx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
        bctx.fillRect(gx, gy, Math.min(gw, x + w - gx), Math.min(gh, y + h - gy));
      }
    });

    return {
      map: configureTexture(albedoCanvas, true, anisotropy, 2.2, 2.2),
      bumpMap: configureTexture(bumpCanvas, false, anisotropy, 2.2, 2.2),
      roughness: 0.86,
      metalness: 0.02,
    };
  }

  if (finish === 'porcelain-dark' || finish === 'porcelain-cream') {
    const isDark = finish === 'porcelain-dark';
    actx.fillStyle = isDark ? '#252a2e' : '#cbc4b6';
    actx.fillRect(0, 0, size, size);
    bctx.fillStyle = '#404040';
    bctx.fillRect(0, 0, size, size);

    const cols = 2;
    const rows = 3;
    const cw = size / cols;
    const ch = size / rows;
    const joint = 4;

    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (cw * 0.5);
      for (let c = -1; c <= cols; c++) {
        const x = c * cw + offset + joint * 0.5;
        const y = r * ch + joint * 0.5;
        const w = cw - joint;
        const h = ch - joint;
        const v = (rand() - 0.5) * 10;
        if (isDark) {
          actx.fillStyle = `rgb(${46 + v},${52 + v},${57 + v})`;
        } else {
          actx.fillStyle = `rgb(${225 + v},${219 + v},${206 + v})`;
        }
        actx.fillRect(x, y, w, h);

        bctx.fillStyle = '#dadada';
        bctx.fillRect(x, y, w, h);

        // Subtle stone-effect porcelain veining
        for (let k = 0; k < 28; k++) {
          const vx = x + rand() * w;
          const vy = y + rand() * h;
          actx.strokeStyle = isDark ? 'rgba(220,230,238,0.06)' : 'rgba(130,120,104,0.06)';
          actx.lineWidth = 1.5;
          actx.beginPath();
          actx.moveTo(vx, vy);
          actx.lineTo(vx + (rand() - 0.5) * 60, vy + (rand() - 0.5) * 24);
          actx.stroke();
        }
      }
    }

    return {
      map: configureTexture(albedoCanvas, true, anisotropy, 2.5, 2.5),
      bumpMap: configureTexture(bumpCanvas, false, anisotropy, 2.5, 2.5),
      roughness: isDark ? 0.36 : 0.42,
      metalness: 0.04,
    };
  }

  // Herringbone block paving
  actx.fillStyle = '#a39579';
  actx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#323232';
  bctx.fillRect(0, 0, size, size);

  const unit = 32;
  const palette = ['#4b4d52', '#585a60', '#414348', '#68645d', '#4f5156'];
  for (let gy = -4; gy < size / unit + 4; gy++) {
    for (let gx = -4; gx < size / unit + 4; gx++) {
      const idx = Math.abs(gx + gy);
      const horizontal = idx % 2 === 0;
      const bx = gx * unit;
      const by = gy * unit;
      actx.fillStyle = palette[Math.floor(rand() * palette.length)];
      bctx.fillStyle = '#cfcfcf';
      if (horizontal) {
        actx.fillRect(bx + 2, by + 2, unit * 2 - 4, unit - 4);
        bctx.fillRect(bx + 2, by + 2, unit * 2 - 4, unit - 4);
      } else {
        actx.fillRect(bx + 2, by + 2, unit - 4, unit * 2 - 4);
        bctx.fillRect(bx + 2, by + 2, unit - 4, unit * 2 - 4);
      }
    }
  }

  return {
    map: configureTexture(albedoCanvas, true, anisotropy, 3, 3),
    bumpMap: configureTexture(bumpCanvas, false, anisotropy, 3, 3),
    roughness: 0.78,
    metalness: 0.02,
  };
}

export function createBrickTextureSet(anisotropy: number): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 512;
  const [albedoCanvas, actx] = makeCanvas(size);
  const [bumpCanvas, bctx] = makeCanvas(size);
  const rand = seededRand(8821);

  actx.fillStyle = '#c4baa8';
  actx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#404040';
  bctx.fillRect(0, 0, size, size);

  const rows = 16;
  const rowH = size / rows;
  const brickW = 96;
  const mortar = 5;
  const tones = ['#944736', '#a45440', '#7e3c2e', '#8c493a', '#6d392f', '#a95c46'];

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (brickW * 0.5);
    for (let x = -brickW; x < size + brickW; x += brickW) {
      const bx = x + offset + mortar * 0.5;
      const by = r * rowH + mortar * 0.5;
      const bw = brickW - mortar;
      const bh = rowH - mortar;
      actx.fillStyle = tones[Math.floor(rand() * tones.length)];
      actx.fillRect(bx, by, bw, bh);

      bctx.fillStyle = '#d4d4d4';
      bctx.fillRect(bx, by, bw, bh);

      for (let s = 0; s < 14; s++) {
        actx.fillStyle = rand() > 0.5 ? 'rgba(255,220,190,0.08)' : 'rgba(30,15,10,0.12)';
        actx.fillRect(bx + rand() * (bw - 8), by + rand() * (bh - 4), 8, 4);
      }
    }
  }

  return {
    map: configureTexture(albedoCanvas, true, anisotropy, 2.2, 1.1),
    bumpMap: configureTexture(bumpCanvas, false, anisotropy, 2.2, 1.1),
  };
}

export function createTimberTextureSet(
  anisotropy: number,
  baseHex = '#8d6840'
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 256;
  const [albedoCanvas, actx] = makeCanvas(size);
  const [bumpCanvas, bctx] = makeCanvas(size);
  const rand = seededRand(4391);

  actx.fillStyle = baseHex;
  actx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#999999';
  bctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 2) {
    const alpha = 0.04 + rand() * 0.09;
    actx.fillStyle = rand() > 0.5 ? `rgba(45,28,12,${alpha})` : `rgba(235,205,160,${alpha * 0.6})`;
    actx.fillRect(0, y, size, 1 + rand() * 2);

    const b = Math.floor(135 + (rand() - 0.5) * 45);
    bctx.fillStyle = `rgb(${b},${b},${b})`;
    bctx.fillRect(0, y, size, 2);
  }

  return {
    map: configureTexture(albedoCanvas, true, anisotropy, 1, 1),
    bumpMap: configureTexture(bumpCanvas, false, anisotropy, 1, 1),
  };
}

export function createLawnTextureSet(anisotropy: number): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 512;
  const [albedoCanvas, actx] = makeCanvas(size);
  const [bumpCanvas, bctx] = makeCanvas(size);
  const rand = seededRand(3127);

  actx.fillStyle = '#4f7337';
  actx.fillRect(0, 0, size, size);
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Subtle mowed lawn stripes + blade noise
  for (let stripe = 0; stripe < 4; stripe++) {
    actx.fillStyle = stripe % 2 === 0 ? 'rgba(115, 152, 74, 0.16)' : 'rgba(54, 86, 36, 0.14)';
    actx.fillRect((stripe * size) / 4, 0, size / 4, size);
  }

  for (let i = 0; i < 4000; i++) {
    const x = rand() * size;
    const y = rand() * size;
    actx.fillStyle = rand() > 0.5 ? 'rgba(130, 168, 82, 0.25)' : 'rgba(42, 68, 28, 0.25)';
    actx.fillRect(x, y, 2, 4);

    const g = Math.floor(100 + rand() * 110);
    bctx.fillStyle = `rgb(${g},${g},${g})`;
    bctx.fillRect(x, y, 2, 4);
  }

  return {
    map: configureTexture(albedoCanvas, true, anisotropy, 5, 5),
    bumpMap: configureTexture(bumpCanvas, false, anisotropy, 5, 5),
  };
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size);
  const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(10, 14, 12, 0.45)');
  grad.addColorStop(0.55, 'rgba(10, 14, 12, 0.18)');
  grad.addColorStop(1, 'rgba(10, 14, 12, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
