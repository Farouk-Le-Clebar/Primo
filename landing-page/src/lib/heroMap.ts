// Build-time SVG for the hero's map screen: city blocks, a canal, a park, parcels drawn around a
// target parcel (each with a --d delay for the "drawing" animation), street names and points of interest.
// Seeded, so the markup is identical on every build.
import { createRandom, rotator, round1 as r1 } from './random';

type Box = { x: number; y: number; w: number; h: number };

export const HERO_MAP = { width: 1100, height: 620, toolbar: 52 } as const;

const POI_COLORS = ['#e2589b', '#8b5cf6', '#14b87a', '#3b82f6', '#f59e0b', '#14b87a'];

export function buildHeroMap() {
  const W = HERO_MAP.width,
    MH = HERO_MAP.height - HERO_MAP.toolbar;
  const ANGLE = -16,
    cx = W / 2,
    cy = MH / 2;
  const rnd = createRandom(11);
  const rot = rotator(ANGLE, cx, cy);
  const onScreen = (x: number, y: number, w: number, h: number) => {
    const p = [rot(x, y), rot(x + w, y), rot(x, y + h), rot(x + w, y + h)];
    const xs = p.map((q) => q[0]),
      ys = p.map((q) => q[1]);
    return (
      Math.max(...xs) > -280 &&
      Math.min(...xs) < W + 280 &&
      Math.max(...ys) > -170 &&
      Math.min(...ys) < MH + 170
    );
  };
  const nearest = <T>(items: T[], score: (t: T) => number) =>
    items.reduce((a, b) => (score(b) < score(a) ? b : a));

  const cols: { x: number; w: number; road: number }[] = [];
  for (let x = -420, i = 0; x < W + 420; i++) {
    const w = Math.round(125 + rnd() * 80),
      road = i % 3 === 2 ? 26 : 15;
    cols.push({ x, w, road });
    x += w + road;
  }
  const rows: { y: number; h: number; road: number }[] = [];
  for (let y = -380, j = 0; y < MH + 380; j++) {
    const h = Math.round(96 + rnd() * 56),
      road = j % 3 === 1 ? 26 : 15;
    rows.push({ y, h, road });
    y += h + road;
  }

  const waterRow = rows.indexOf(nearest(rows, (r) => Math.abs(rot(cx, r.y + r.h / 2)[1] - 70)));
  const blocks = cols
    .flatMap((c, i) => rows.map((r, j) => ({ i, j, x: c.x, y: r.y, w: c.w, h: r.h })))
    .filter((b) => b.j !== waterRow && onScreen(b.x, b.y, b.w, b.h));
  const park = nearest(blocks, (b) => {
    const [x, y] = rot(b.x + b.w / 2, b.y + b.h / 2);
    return Math.hypot(x - 900, y - 400);
  });

  const parcels: Box[] = [],
    buildings: Box[] = [];
  for (const b of blocks) {
    if (b === park) continue;
    const bands = b.h > 112 ? 2 : 1;
    for (let k = 0; k < bands; k++) {
      const bh = b.h / bands,
        by = b.y + k * bh;
      let px = b.x;
      while (px < b.x + b.w - 1) {
        let pw = 30 + rnd() * 34;
        if (b.x + b.w - (px + pw) < 26) pw = b.x + b.w - px;
        parcels.push({ x: px, y: by, w: pw, h: bh });
        if (rnd() < 0.78) {
          const bw = pw * (0.5 + rnd() * 0.32),
            bhh = bh * (0.36 + rnd() * 0.3),
            m = 3 + rnd() * 4;
          buildings.push({ x: px + (pw - bw) / 2, y: k === 0 ? by + m : by + bh - bhh - m, w: bw, h: bhh });
        }
        px += pw;
      }
    }
  }
  const target = nearest(
    parcels.filter((p) => p.w > 40 && p.h > 46),
    (p) => {
      const [x, y] = rot(p.x + p.w / 2, p.y + p.h / 2);
      return Math.hypot(x - 455, y - 300);
    },
  );
  const [tcx, tcy] = rot(target.x + target.w / 2, target.y + target.h / 2);

  const rect = (b: Box, attrs: string) =>
    `<rect x="${r1(b.x)}" y="${r1(b.y)}" width="${r1(b.w)}" height="${r1(b.h)}" ${attrs}/>`;
  const parts: string[] = [`<rect x="-700" y="-700" width="2500" height="2000" fill="var(--hp-road)"/>`];
  for (const b of blocks)
    parts.push(rect(b, `rx="2" fill="var(${b === park ? '--hp-park' : '--hp-block'})"`));
  const wr = rows[waterRow];
  parts.push(`<rect x="-700" y="${wr.y + 10}" width="2500" height="${wr.h - 20}" fill="var(--hp-water)"/>`);
  for (let x = -420; x < W + 420; x += 17)
    for (const yy of [wr.y + 5, wr.y + wr.h - 5])
      if (onScreen(x, yy, 1, 1))
        parts.push(
          `<circle cx="${x + rnd() * 6}" cy="${yy}" r="${r1(5 + rnd() * 3)}" fill="var(--hp-tree)"/>`,
        );
  for (let n = 0; n < 26; n++)
    parts.push(
      `<circle cx="${r1(park.x + 10 + rnd() * (park.w - 20))}" cy="${r1(park.y + 10 + rnd() * (park.h - 20))}" r="${r1(6 + rnd() * 6)}" fill="var(--hp-tree)"/>`,
    );
  for (const b of buildings) parts.push(rect(b, `class="hp-bd" rx="1.5"`));
  for (const p of parcels) {
    const [x, y] = rot(p.x + p.w / 2, p.y + p.h / 2);
    const d = Math.round(Math.hypot(x - tcx, y - tcy) * 0.9); // draw outwards from the target
    parts.push(
      `<rect class="hp-pl" pathLength="1" style="--d:${d}ms" x="${r1(p.x)}" y="${r1(p.y)}" width="${r1(p.w)}" height="${r1(p.h)}"/>`,
    );
  }
  parts.push(rect(target, `class="hp-target"`));

  // street names on the closest main roads
  const mainRow = nearest(
    rows.filter((r) => r.road > 20),
    (r) => Math.abs(r.y + r.h + r.road / 2 - (target.y + target.h + 60)),
  );
  const mainCol = nearest(
    cols.filter((c) => c.road > 20),
    (c) => Math.abs(c.x + c.w + c.road / 2 - (target.x + 230)),
  );
  parts.push(
    `<text class="hp-street" x="${r1(target.x - 250)}" y="${r1(mainRow.y + mainRow.h + mainRow.road / 2 + 3)}">Boulevard de la Prairie</text>`,
  );
  parts.push(
    `<text class="hp-street" transform="translate(${r1(mainCol.x + mainCol.w + mainCol.road / 2 + 3)} ${r1(target.y - 40)}) rotate(90)">Rue des Lilas</text>`,
  );
  parts.push(
    `<text class="hp-street hp-water-label" x="${r1(target.x + 40)}" y="${r1(wr.y + wr.h / 2 + 3)}">Canal du Midi</text>`,
  );

  // points of interest, away from the target
  const tx0 = target.x + target.w / 2,
    ty0 = target.y + target.h / 2;
  blocks
    .filter((b) => b !== park && Math.hypot(b.x + b.w / 2 - tx0, b.y + b.h / 2 - ty0) > 140)
    .filter((_, n) => n % 8 === 3)
    .slice(0, 7)
    .forEach((b, n) => {
      const x = r1(b.x + b.w * (0.3 + rnd() * 0.4)),
        y = r1(b.y + b.h * (0.3 + rnd() * 0.4));
      parts.push(
        `<g class="hp-poi" style="--d:${600 + n * 90}ms"><circle cx="${x}" cy="${y}" r="8.5" fill="${POI_COLORS[n % POI_COLORS.length]}" stroke="#fff" stroke-width="2"/><circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/></g>`,
      );
    });

  return {
    svg: `<g transform="rotate(${ANGLE} ${cx} ${cy})">${parts.join('')}</g>`,
    viewBox: `0 0 ${W} ${MH}`,
    width: W,
    height: MH,
    /** Target parcel centre, in map pixels (the zoom origin). */
    target: { x: r1(tcx), y: r1(tcy) },
  };
}
