export type SourceRow = Record<string, unknown>;

export function text(value: unknown, fallback = "Non renseigné"): string {
  return typeof value === "string" && value.trim() && value !== "na"
    ? value
    : typeof value === "number"
      ? String(value)
      : fallback;
}

export function validDate(value: unknown): string | null {
  const raw = text(value, "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const date = new Date(`${raw}T12:00:00Z`);
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === raw
    ? raw
    : null;
}

export function dateLabel(value: unknown): string {
  const raw = validDate(value);
  if (!raw) return text(value, "") ? "Date à vérifier" : "Non renseignée";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${raw}T12:00:00Z`));
}

export function quantity(value: unknown, unit = ""): string {
  if (value === null || value === undefined || value === "")
    return "Non renseigné";
  const n =
    typeof value === "number" || typeof value === "string"
      ? Number(value)
      : NaN;
  if (!Number.isFinite(n)) return "Non renseigné";
  if (n < 0) return "Valeur à vérifier";
  return `${n.toLocaleString("fr-FR")}${unit}`;
}

export function jsonRows(value: unknown): SourceRow[] | null {
  try {
    const parsed: unknown =
      typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) &&
      parsed.every((r) => r && typeof r === "object" && !Array.isArray(r))
      ? (parsed as SourceRow[])
      : null;
  } catch {
    return null;
  }
}
