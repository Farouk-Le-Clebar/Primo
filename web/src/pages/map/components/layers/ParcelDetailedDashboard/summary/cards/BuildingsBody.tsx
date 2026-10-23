import { ProgressBar } from "@tremor/react";

import { useRevealed } from "../../../../../../../hooks/useRevealed";
import { coverageRatio, squareMeters, type BuildingStats } from "../../widgets/buildings/stats";
import SummaryFact from "../SummaryFact";

type BuildingsBodyProps = {
  stats: BuildingStats;
  parcelArea: number | null;
};

export default function BuildingsBody({ stats, parcelArea }: BuildingsBodyProps) {
  const revealed = useRevealed();
  const coverage = coverageRatio(stats.footprint, parcelArea);
  const facts = [
    { label: "Surface de plancher estimée", value: squareMeters(stats.floorArea) },
    { label: "Hauteur maximale", value: stats.maxHeight ? `${stats.maxHeight.toLocaleString("fr-FR")} m` : "—" },
    { label: "Plus ancien", value: stats.oldestYear ? String(stats.oldestYear) : "—" },
  ];

  return (
    <>
      <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {stats.count}
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          bâtiment{stats.count > 1 ? "s" : ""} · {stats.usages[0]?.name ?? "usage inconnu"}
        </span>
      </p>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Emprise au sol {squareMeters(stats.footprint)}</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {coverage != null ? `${coverage} %` : "—"}
          </span>
        </div>
        <ProgressBar value={revealed ? (coverage ?? 0) : 0} color="emerald" showAnimation />
      </div>
      <dl className="mt-auto pt-4">
        {facts.map((fact) => (
          <SummaryFact key={fact.label} {...fact} />
        ))}
      </dl>
    </>
  );
}
