import type { UserStatistic } from "../../../../types/admin";

export const adminCardClass =
  "rounded-xl border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] ring-0 shadow-sm";
export const formatDate = (value?: string | Date | null) => {
  if (!value || !Number.isFinite(new Date(value).getTime()))
    return "Non renseignée";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export function distribution(
  stats: UserStatistic[],
  key: "browser" | "os" | "country" | "deviceType",
) {
  const counts = new Map<string, number>();
  for (const stat of stats) {
    const raw = stat[key]?.trim();
    const name =
      (key === "browser" || key === "os"
        ? raw?.replace(/\s+\d.*$/, "")
        : raw) || "Non renseigné";
    const label =
      key === "country" && /^[A-Z]{2}$/.test(name)
        ? new Intl.DisplayNames(["fr"], { type: "region" }).of(name) || name
        : name;
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  return Array.from(counts, ([name, value]) => ({ name, value })).sort(
    (a, b) => b.value - a.value,
  );
}
export function dailySeries(dates: (string | undefined)[], days: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const counts = new Map<string, number>();
  const key = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  for (const value of dates) {
    if (!value) continue;
    const date = new Date(value);
    if (Number.isFinite(date.getTime()))
      counts.set(key(date), (counts.get(key(date)) || 0) + 1);
  }
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days + index + 1);
    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      }),
      Total: counts.get(key(date)) || 0,
    };
  });
}
