import { FileText, Hammer, TrendingUp, type LucideIcon } from "lucide-react";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import type { Tone } from "../ui/palette";
import { median, plotTitle, pricePerM2 } from "../shared/plotInsights";

export type AroundEvent = {
  id: string;
  icon: LucideIcon;
  iconTone: string;
  title: string;
  detail: string;
  tag: { label: string; tone: Tone } | null;
  date: string;
};

const euros = (value: number): string => `${value.toLocaleString("fr-FR")} €`;

export function buildAroundEvents(plots: ProjectPlotWithSummary[]): AroundEvent[] {
  const projectMedian = median(plots.map(pricePerM2).filter((value): value is number => value != null));
  const events: AroundEvent[] = [];

  plots.forEach((plot) => {
    const { dvf, permits, dpe } = plot.summary ?? {};
    if (dvf?.lastDate && dvf.lastValue) {
      const price = dvf.lastPricePerM2;
      const gap = price && projectMedian ? Math.round(((price - projectMedian) / projectMedian) * 100) : null;
      events.push({
        id: `${plot.id}-dvf`,
        icon: TrendingUp,
        iconTone: "bg-teal-500/12 text-teal-500 dark:bg-teal-500/20",
        title: `Vente sur ${plotTitle(plot)}`,
        detail: [dvf.lastLocalType, euros(dvf.lastValue), price ? `${euros(price)}/m²` : null].filter(Boolean).join(" · "),
        tag: gap != null && gap !== 0 ? { label: `${gap > 0 ? "+" : ""}${gap} % vs secteur`, tone: gap > 0 ? "emerald" : "rose" } : null,
        date: dvf.lastDate,
      });
    }
    if (permits?.lastDate) {
      events.push({
        id: `${plot.id}-permit`,
        icon: Hammer,
        iconTone: "bg-zinc-500/12 text-zinc-500 dark:bg-zinc-500/20",
        title: `${permits.lastType ?? "Autorisation"} sur ${plotTitle(plot)}`,
        detail: [permits.lastState, `${permits.count} autorisation${permits.count > 1 ? "s" : ""} Sitadel`].filter(Boolean).join(" · "),
        tag: { label: "Densification", tone: "amber" },
        date: permits.lastDate,
      });
    }
    if (dpe?.lastDate && ["F", "G"].includes(dpe.lastLabel ?? "")) {
      events.push({
        id: `${plot.id}-dpe`,
        icon: FileText,
        iconTone: "bg-amber-500/12 text-amber-500 dark:bg-amber-500/20",
        title: `DPE ${dpe.lastLabel} au ${plotTitle(plot)}`,
        detail: "Propriétaires susceptibles de vendre",
        tag: { label: "Prospection", tone: "red" },
        date: dpe.lastDate,
      });
    }
  });

  return events.sort((a, b) => b.date.localeCompare(a.date));
}

export function formatAge(date: string, now: number = Date.now()): string {
  const days = Math.max(0, Math.floor((now - new Date(date).getTime()) / 86_400_000));
  if (days < 31) return `${days} j`;
  if (days < 365) return `${Math.floor(days / 30)} mois`;
  return `${Math.floor(days / 365)} an${days >= 730 ? "s" : ""}`;
}
