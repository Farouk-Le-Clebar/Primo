// Seeded PRNG (mulberry32): the build-time illustrations are random-looking but identical on every build.
export function createRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rotation of (x, y) by `angle` degrees around (cx, cy).
export function rotator(angle: number, cx: number, cy: number) {
  const a = (angle * Math.PI) / 180,
    cos = Math.cos(a),
    sin = Math.sin(a);
  return (x: number, y: number): [number, number] => [
    cx + (x - cx) * cos - (y - cy) * sin,
    cy + (x - cx) * sin + (y - cy) * cos,
  ];
}

// One decimal is plenty for SVG coordinates and keeps the inlined markup small.
export const round1 = (n: number) => Math.round(n * 10) / 10;
