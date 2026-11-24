import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { plotTitle, pricePerM2, vigilanceTags } from "../shared/plotInsights";

const BOM = String.fromCharCode(0xfeff);
const HEADERS =["Adresse", "Référence", "Surface (m²)", "Zone PLU", "Prix DVF (€/m²)", "Dernière vente", "DPE", "Lots copro", "Vigilance", "Ajoutée par"];

const escape = (value: string | number | null | undefined): string => `"${String(value ?? "").replace(/"/g, '""')}"`;

export function exportPlotsCsv(plots: ProjectPlotWithSummary[], projectName: string): void {
  const rows = plots.map((plot) => [
    plotTitle(plot),
    plot.plotId,
    plot.surfaceM2,
    plot.summary?.plu?.zones[0],
    pricePerM2(plot),
    plot.summary?.dvf?.lastDate,
    plot.summary?.dpe?.lastLabel,
    plot.summary?.coproprietes?.lots || null,
    vigilanceTags(plot).map((tag) => tag.label).join(", "),
    plot.addedByName,
  ]);
  const csv = [HEADERS, ...rows].map((row) => row.map(escape).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob([BOM + csv], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: `${projectName || "parcelles"}.csv` });
  link.click();
  URL.revokeObjectURL(url);
}
