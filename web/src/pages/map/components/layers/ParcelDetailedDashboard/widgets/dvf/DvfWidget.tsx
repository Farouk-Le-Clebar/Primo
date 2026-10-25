import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getDvfParcelle } from "../../../../../../../requests/dvf/information";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { matchDvf, toLevelMap } from "../logement/matching";
import TargetBanner from "../logement/TargetBanner";
import { hasCriteria, type TargetingProps } from "../logement/types";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import { prepareDvf } from "./data";
import DvfEvolutionChart from "./DvfEvolutionChart";
import DvfKpis from "./DvfKpis";
import DvfPriceRange from "./DvfPriceRange";
import DvfTransactions from "./DvfTransactions";
import DvfTypes from "./DvfTypes";
import { computeDvfStats, typeLabel, typeShares } from "./stats";

export default function DvfWidget({ feature, target, onShowTarget }: ParcelWidgetProps & TargetingProps) {
  const idParcelle = String(feature?.properties?.id ?? "");
  const [type, setType] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dvf-parcelle", idParcelle],
    queryFn: () => getDvfParcelle(idParcelle),
    enabled: idParcelle.length === 14,
    staleTime: 300000,
    retry: false,
  });
  const prepared = useMemo(() => prepareDvf(data), [data]);
  const shares = useMemo(() => typeShares(prepared.records), [prepared]);
  const transactions = useMemo(
    () => prepared.records.filter((r) => !type || typeLabel(r) === type),
    [prepared, type],
  );
  const stats = useMemo(() => computeDvfStats(transactions), [transactions]);
  const matches = useMemo(() => toLevelMap(target && hasCriteria(target) ? matchDvf(prepared.records, target) : []), [prepared, target]);

  if (isLoading) return <WidgetLoading label="Analyse de l’historique DVF…" />;

  if (isError || !prepared.records.length)
    return (
      <WidgetEmpty
        message={
          isError
            ? "Le service est momentanément indisponible."
            : prepared.rejected
              ? "Les données reçues ne contiennent aucun montant positif associé à une date valide."
              : "Aucune transaction disponible pour cette parcelle."
        }
        onRetry={isError ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <DvfKpis stats={stats} />
      <ParcelAnalysisLayout
        summary={
          <div className="primo-stagger flex flex-col gap-4">
            <DvfTypes shares={shares} active={type} onSelect={setType} />
            <DvfPriceRange stats={stats} />
          </div>
        }
      >
        {target && hasCriteria(target) && <TargetBanner target={target} matches={matches.size} onShow={onShowTarget} />}
        <DvfEvolutionChart transactions={transactions} />
        <DvfTransactions transactions={transactions} type={type} onClearType={() => setType(null)} matches={matches} />
        <SourceNote>
          Source : DGFiP · Demandes de valeurs foncières. Prix nets vendeur, hors frais de notaire ;
          les lignes d’une même vente (biens et parcelles) sont regroupées avant calcul.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
