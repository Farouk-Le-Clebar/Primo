import { useMemo, useState } from "react";

import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { BuildingCard } from "./BuildingCard";
import { buildingCardId } from "./config";
import { BuildingInPlot } from "./BuildingInPlot";
import { BuildingKpis } from "./BuildingKpis";
import { BuildingUsages } from "./BuildingUsages";
import { computeBuildingStats, sortByCompleteness, toNumber } from "./stats";
import { useParcelBuildings } from "./useParcelBuildings";

export default function BuildingsWidget({ feature }: ParcelWidgetProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { buildings, isLoading, isError, refetch } = useParcelBuildings(feature);
  const sortedBuildings = useMemo(() => sortByCompleteness(buildings), [buildings]);
  const stats = useMemo(() => computeBuildingStats(sortedBuildings), [sortedBuildings]);
  const parcelArea = toNumber(feature?.properties?.contenance);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    document
      .getElementById(buildingCardId(index))
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-2 font-inter">
        <LoadingPrimoLogo className="h-6 w-6" />
        <span className="text-[11px] font-medium text-[#878D96] dark:text-gray-400">
          Récupération des données BD TOPO...
        </span>
      </div>
    );

  if (!sortedBuildings.length)
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center font-inter text-sm text-[#878D96] dark:border-[#232323] dark:bg-[#171717] dark:text-gray-400">
        {isError
          ? "Les données bâtiments sont momentanément indisponibles."
          : "Aucun bâtiment référencé sur cette parcelle par l’IGN."}
        {isError && (
          <button
            onClick={refetch}
            className="mt-3 block w-full font-medium text-emerald-700 underline dark:text-emerald-400"
          >
            Réessayer
          </button>
        )}
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <BuildingKpis stats={stats} parcelArea={parcelArea} />
      <ParcelAnalysisLayout
        summary={
          <div className="primo-stagger flex flex-col gap-4">
            <BuildingInPlot
              parcelFeature={feature}
              buildings={sortedBuildings}
              activeIndex={activeIndex}
              onHover={setActiveIndex}
              onSelect={handleSelect}
            />
            <BuildingUsages usages={stats.usages} total={stats.count} />
          </div>
        }
      >
        <div className="primo-stagger grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
          {sortedBuildings.map((building, index) => (
            <BuildingCard
              key={building.properties.id || index}
              index={index}
              building={building}
              active={activeIndex === index}
              onHover={setActiveIndex}
            />
          ))}
        </div>
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Source : IGN · BD TOPO. Surfaces calculées depuis les emprises
          géométriques ; la surface de plancher est une estimation indicative.
        </p>
      </ParcelAnalysisLayout>
    </div>
  );
}
