import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_MAP_COLORS, MAP_BACKGROUNDS, MAP_COLOR_PRESETS } from "../constants/mapColorPresets.ts";
import type { MapPalette } from "../types/mapColors";
import { blendOver, colorDistance, contrastRatio, getReadabilityIssues, relativeLuminance } from "./contrast.ts";

const READABLE_PALETTE: MapPalette = {
  default: { fill: "#475569", stroke: "#475569", fillOpacity: 0.08 },
  hover: { fill: "#2563eb", stroke: "#2563eb", fillOpacity: 0.2 },
  selected: { fill: "#b91c1c", stroke: "#b91c1c", fillOpacity: 0.3 },
};

describe("contrastRatio", () => {
  it("donne les valeurs de référence WCAG", () => {
    assert.equal(relativeLuminance("#000000"), 0);
    assert.equal(relativeLuminance("#ffffff"), 1);
    assert.equal(contrastRatio("#000000", "#ffffff"), 21);
    assert.equal(contrastRatio("#777777", "#777777"), 1);
    assert.ok(Math.abs(contrastRatio("#777777", "#ffffff") - 4.48) < 0.01);
  });

  it("ne dépend pas de l'ordre des couleurs", () => {
    assert.equal(contrastRatio("#22d3ee", "#262626"), contrastRatio("#262626", "#22d3ee"));
  });
});

describe("blendOver", () => {
  it("compose une couleur sur le fond selon son opacité", () => {
    assert.equal(blendOver("#ffffff", "#000000", 0), "#000000");
    assert.equal(blendOver("#ffffff", "#000000", 1), "#ffffff");
    assert.equal(blendOver("#ffffff", "#000000", 0.5), "#808080");
  });
});

describe("colorDistance", () => {
  it("sépare deux teintes de même luminance que le ratio confond", () => {
    assert.ok(contrastRatio("#ff0000", "#00a000") < 1.2);
    assert.equal(colorDistance("#123456", "#123456"), 0);
    assert.ok(colorDistance("#ff0000", "#00a000") > 50);
  });
});

describe("getReadabilityIssues", () => {
  it("ne signale rien pour une palette lisible", () => {
    assert.deepEqual(getReadabilityIssues(READABLE_PALETTE, MAP_BACKGROUNDS.light), []);
  });

  it("signale un contour trop proche du fond", () => {
    const palette = { ...READABLE_PALETTE, hover: { ...READABLE_PALETTE.hover, stroke: "#f0f0f0" } };
    const [issue] = getReadabilityIssues(palette, MAP_BACKGROUNDS.light);
    assert.equal(issue.kind, "stroke-background");
    assert.equal(issue.kind === "stroke-background" && issue.state, "hover");
  });

  it("signale un remplissage invisible, sauf à l'état normal", () => {
    const palette: MapPalette = {
      default: { ...READABLE_PALETTE.default, fillOpacity: 0 },
      hover: { ...READABLE_PALETTE.hover, fillOpacity: 0 },
      selected: READABLE_PALETTE.selected,
    };
    assert.deepEqual(getReadabilityIssues(palette, MAP_BACKGROUNDS.light), [{ kind: "fill-background", state: "hover" }]);
  });

  it("signale deux états indiscernables", () => {
    const palette = { ...READABLE_PALETTE, selected: READABLE_PALETTE.hover };
    assert.deepEqual(getReadabilityIssues(palette, MAP_BACKGROUNDS.light), [{ kind: "states-close", states: ["hover", "selected"] }]);
  });

  it("ne confond pas deux états de même luminance et de teintes différentes", () => {
    const palette: MapPalette = {
      ...READABLE_PALETTE,
      hover: { fill: "#e11d48", stroke: "#e11d48", fillOpacity: 0.3 },
      selected: { fill: "#0f766e", stroke: "#0f766e", fillOpacity: 0.3 },
    };
    assert.deepEqual(getReadabilityIssues(palette, MAP_BACKGROUNDS.light), []);
  });

  it("signale le contour blanc par défaut sur le fond clair uniquement", () => {
    assert.ok(getReadabilityIssues(DEFAULT_MAP_COLORS.light, MAP_BACKGROUNDS.light).some((issue) => issue.kind === "stroke-background"));
    assert.deepEqual(getReadabilityIssues(DEFAULT_MAP_COLORS.dark, MAP_BACKGROUNDS.dark), []);
  });

  it("garde les préréglages lisibles dans les deux thèmes", () => {
    MAP_COLOR_PRESETS.filter((preset) => preset.id !== "primo").forEach((preset) => {
      assert.deepEqual(getReadabilityIssues(preset.colors.light, MAP_BACKGROUNDS.light), [], `${preset.id} clair`);
      assert.deepEqual(getReadabilityIssues(preset.colors.dark, MAP_BACKGROUNDS.dark), [], `${preset.id} sombre`);
    });
  });
});
