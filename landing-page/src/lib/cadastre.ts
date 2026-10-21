// Seeded, build-time generator for a stylised cadastral map (blocks, parcels, buildings).
import { createRandom, rotator } from './random';

export type Rect = { x: number; y: number; w: number; h: number };
export type Parcel = Rect & { id: string; building?: Rect };

export function generateCadastre({
  width,
  height,
  seed = 7,
  angle = -14,
}: {
  width: number;
  height: number;
  seed?: number;
  angle?: number;
}) {
  const rnd = createRandom(seed);
  const cx = width / 2,
    cy = height / 2;
  const rot = rotator(angle, cx, cy);
  const visible = (r: Rect, m = 40) => {
    const p = [rot(r.x, r.y), rot(r.x + r.w, r.y), rot(r.x, r.y + r.h), rot(r.x + r.w, r.y + r.h)];
    const xs = p.map((q) => q[0]),
      ys = p.map((q) => q[1]);
    return (
      Math.max(...xs) > -m &&
      Math.min(...xs) < width + m &&
      Math.max(...ys) > -m &&
      Math.min(...ys) < height + m
    );
  };
  const pad = Math.max(width, height) * 0.35;
  const cols: { x: number; w: number; road: number }[] = [];
  for (let x = -pad, i = 0; x < width + pad; i++) {
    const w = Math.round(150 + rnd() * 90),
      road = i % 3 === 2 ? 30 : 18;
    cols.push({ x, w, road });
    x += w + road;
  }
  const rows: { y: number; h: number; road: number }[] = [];
  for (let y = -pad, j = 0; y < height + pad; j++) {
    const h = Math.round(110 + rnd() * 60),
      road = j % 3 === 1 ? 30 : 18;
    rows.push({ y, h, road });
    y += h + road;
  }

  const blocks = cols
    .flatMap((c) => rows.map((r) => ({ x: c.x, y: r.y, w: c.w, h: r.h })))
    .filter((b) => visible(b));
  const parks = new Set(blocks.filter(() => rnd() < 0.06));
  const parcels: Parcel[] = [];
  let n = 11;
  for (const b of blocks) {
    if (parks.has(b)) continue;
    const bands = b.h > 125 ? 2 : 1;
    for (let k = 0; k < bands; k++) {
      const bh = b.h / bands,
        by = b.y + k * bh;
      let px = b.x;
      while (px < b.x + b.w - 1) {
        let pw = 34 + rnd() * 40;
        if (b.x + b.w - (px + pw) < 30) pw = b.x + b.w - px;
        const p: Parcel = { x: px, y: by, w: pw, h: bh, id: `AB ${String(n++).padStart(4, '0')}` };
        if (rnd() < 0.8) {
          const bw = pw * (0.48 + rnd() * 0.32),
            bhh = bh * (0.34 + rnd() * 0.3),
            m = 4 + rnd() * 5;
          p.building = { x: px + (pw - bw) / 2, y: k === 0 ? by + m : by + bh - bhh - m, w: bw, h: bhh };
        }
        if (visible(p, 0)) parcels.push(p);
        px += pw;
      }
    }
  }
  const trees = [...parks].flatMap((pk) =>
    Array.from({ length: 22 }, () => ({
      x: pk.x + 12 + rnd() * (pk.w - 24),
      y: pk.y + 12 + rnd() * (pk.h - 24),
      r: 6 + rnd() * 7,
    })),
  );
  return { blocks, parks: [...parks], parcels, trees, transform: `rotate(${angle} ${cx} ${cy})` };
}
