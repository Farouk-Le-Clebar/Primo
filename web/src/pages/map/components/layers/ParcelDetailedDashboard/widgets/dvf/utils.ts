import { Building, CarFront, Euro, Home, Store, type LucideIcon } from "lucide-react";

import { TONES } from "../shared/tones";

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export type TypeLocalStyle = { icon: LucideIcon; tone: string };

export function getTypeLocalStyle(typeLocal: string | null): TypeLocalStyle {
  const type = typeLocal?.toLowerCase() || "";
  if (type.includes("maison")) return { icon: Home, tone: TONES.emerald };
  if (type.includes("appartement")) return { icon: Building, tone: TONES.violet };
  if (type.includes("dépendance") || type.includes("dependance")) return { icon: CarFront, tone: TONES.gray };
  if (type.includes("commercial") || type.includes("industriel")) return { icon: Store, tone: TONES.amber };
  return { icon: Euro, tone: TONES.sky };
}
