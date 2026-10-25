import type { LucideIcon } from "lucide-react";

export type GpuProperties = Record<string, string | undefined>;

export type GpuFeature = { properties: GpuProperties };

export type GpuKind = "surface" | "lineaire" | "ponctuel";

export type PluRule = {
  key: string;
  code: string;
  label: string;
  description: string;
  kind: GpuKind;
  icon: LucideIcon;
  tone: string;
};

export type RuleStyle = { icon: LucideIcon; tone: string };
