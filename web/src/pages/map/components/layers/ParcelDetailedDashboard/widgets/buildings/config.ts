import type { BuildingColor } from "./types";

export const BUILDING_COLORS: BuildingColor[] = [
  { fill: "fill-[#F5AB2F]", stroke: "stroke-[#F5AB2F]", bg: "bg-[#F5AB2F]/10", dot: "bg-[#F5AB2F]" },
  { fill: "fill-[#35C2B2]", stroke: "stroke-[#35C2B2]", bg: "bg-[#35C2B2]/10", dot: "bg-[#35C2B2]" },
  { fill: "fill-[#6C66E8]", stroke: "stroke-[#6C66E8]", bg: "bg-[#6C66E8]/10", dot: "bg-[#6C66E8]" },
  { fill: "fill-[#F46977]", stroke: "stroke-[#F46977]", bg: "bg-[#F46977]/10", dot: "bg-[#F46977]" },
  { fill: "fill-[#48A6ED]", stroke: "stroke-[#48A6ED]", bg: "bg-[#48A6ED]/10", dot: "bg-[#48A6ED]" },
  { fill: "fill-[#7DCE68]", stroke: "stroke-[#7DCE68]", bg: "bg-[#7DCE68]/10", dot: "bg-[#7DCE68]" },
  { fill: "fill-[#D866BA]", stroke: "stroke-[#D866BA]", bg: "bg-[#D866BA]/10", dot: "bg-[#D866BA]" },
  { fill: "fill-[#A06CD5]", stroke: "stroke-[#A06CD5]", bg: "bg-[#A06CD5]/10", dot: "bg-[#A06CD5]" },
];

export const buildingColor = (index: number): BuildingColor =>
  BUILDING_COLORS[index % BUILDING_COLORS.length];

export const buildingCardId = (index: number): string =>
  `building-card-${index}`;
