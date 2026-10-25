import { useMemo } from "react";
import type { Feature } from "geojson";
import { Home } from "lucide-react";

import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import { SourceNote, WidgetLoading } from "../shared/WidgetStatus";
import { rentalOutlook } from "./climateLaw";
import LogementBuilding from "./LogementBuilding";
import LogementKpis from "./LogementKpis";
import LogementMatches from "./LogementMatches";
import LogementTargetForm from "./LogementTargetForm";
import LogementUnits from "./LogementUnits";
import { matchDpe, matchDvf } from "./matching";
import { parseSurface } from "./normalize";
import { hasCriteria, type LogementTarget } from "./types";
import { detectUnits, targetSummary } from "./units";
import { useLogementData } from "./useLogementData";
import { estimateValue } from "./valuation";

type LogementWidgetProps = {
  feature: Feature;
  banId?: string;
  target: LogementTarget;
  onTargetChange: (target: LogementTarget) => void;
};

export default function LogementWidget({ feature, banId, target, onTargetChange }: LogementWidgetProps) {
  const { dpeEntries, dvfRecords, buildings, isLoading } = useLogementData(feature, banId);
  const units = useMemo(() => detectUnits(dpeEntries), [dpeEntries]);
  const active = hasCriteria(target);
  const dpeMatches = useMemo(() => (active ? matchDpe(dpeEntries, target) : []), [active, dpeEntries, target]);
  const dvfMatches = useMemo(() => (active ? matchDvf(dvfRecords, target) : []), [active, dvfRecords, target]);
  const bestDpe = dpeMatches[0]?.item ?? null;
  const surface = parseSurface(target.surface) ?? bestDpe?.surface ?? null;
  const valuation = useMemo(() => estimateValue(dvfRecords, surface, target.type), [dvfRecords, surface, target.type]);

  if (isLoading) return <WidgetLoading label="Rassemblement des données du logement…" />;

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      {active && <LogementKpis dpe={bestDpe} valuation={valuation} outlook={rentalOutlook(bestDpe?.label ?? "?")} />}
      <ParcelAnalysisLayout
        summary={
          <div className="primo-stagger flex flex-col gap-4">
            <LogementTargetForm target={target} onChange={onTargetChange} />
            <LogementUnits units={units} target={target} onSelect={onTargetChange} />
          </div>
        }
      >
        {active ? (
          <>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{targetSummary(target)}</p>
            <LogementMatches dpeMatches={dpeMatches} dvfMatches={dvfMatches} />
            <LogementBuilding buildings={buildings} dpeEntries={dpeMatches.map((m) => m.item)} />
            <SourceNote>
              Rapprochements automatiques à partir des DPE (ADEME), des ventes DVF et de la BD TOPO : à
              confirmer avec le titre de propriété ou le règlement de copropriété. La valeur indicative applique
              les prix au m² des ventes comparables de la parcelle ; ce n’est pas une estimation.
            </SourceNote>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-white/10 dark:bg-[#171717]">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Home size={18} />
            </span>
            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">Quel logement vous intéresse ?</p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Choisissez un logement repéré à l’adresse ou saisissez sa surface, son étage et sa porte : la fiche
              rassemble son DPE, ses ventes probables, sa valeur indicative et ses obligations Loi Climat.
            </p>
          </div>
        )}
      </ParcelAnalysisLayout>
    </div>
  );
}
