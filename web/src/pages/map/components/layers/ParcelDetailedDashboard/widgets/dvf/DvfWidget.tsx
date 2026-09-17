import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import { useMemo, useState } from "react";
import { prepareDvf } from "./data";
import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import type { ParcelWidgetProps } from "../../types";
import { getDvfParcelle } from "../../../../../../../requests/dvf/information";
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import DvfSummaryCard from "./DvfSummaryCard.tsx";
import DvfEvolutionChart from "./DvfEvolutionChart.tsx";
import DvfDistributionCards from "./DvfDistributionCards.tsx";
import DvfTransactionsTab from "./DvfTransactionsTab.tsx";

export default function DvfWidget({ feature }: ParcelWidgetProps) {
  const idParcelle = feature?.properties?.id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dvf-parcelle", idParcelle],
    queryFn: () => getDvfParcelle(String(idParcelle)),
    enabled: !!idParcelle && String(idParcelle).length === 14,
    staleTime: 300000,
    retry: false,
  });

  const [type, setType] = useState("all");
  const prepared = useMemo(() => prepareDvf(data), [data]);
  const types = [
    ...new Set(prepared.records.map((t) => t.type_local || "Non renseigné")),
  ];
  const selectedType = types.includes(type) ? type : "all";
  const transactions = prepared.records.filter(
    (t) =>
      selectedType === "all" ||
      (t.type_local || "Non renseigné") === selectedType,
  );
  const isEmpty = prepared.records.length === 0;

  return (
    <div className="font-inter w-full">
      {isLoading ? (
        <div className="flex items-center gap-2 mb-4 bg-white dark:bg-[#171717] p-6 rounded-xl border border-gray-100 shadow-sm">
          <LoadingPrimoLogo className="w-6 h-6 text-black" />
          <span className="text-[13px] font-medium text-[#878D96]">
            Analyse de l'historique DVF...
          </span>
        </div>
      ) : isError || isEmpty ? (
        <div className="py-8 text-sm text-[#878D96] text-center bg-gray-50 dark:bg-[#171717] rounded-xl border border-dashed border-gray-200 dark:border-white/10">
          {isError
            ? "Le service est momentanément indisponible."
            : prepared.rejected
              ? "Les données reçues ne contiennent aucun montant positif associé à une date valide."
              : "Aucune transaction disponible pour cette parcelle."}
          {isError && (
            <button
              onClick={() => void refetch()}
              className="mt-3 block w-full font-medium text-emerald-700 underline dark:text-emerald-400"
            >
              Réessayer
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-end">
            <select
              aria-label="Type de bien DVF"
              value={selectedType}
              onChange={(e) => setType(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#171717] dark:text-white"
            >
              <option value="all">Tous les types de biens</option>
              {types.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <ParcelAnalysisLayout
            summary={<DvfSummaryCard transactions={transactions} />}
          >
            <DvfEvolutionChart transactions={transactions} />
            <DvfDistributionCards transactions={transactions} />
            <DvfTransactionsTab transactions={transactions} />
          </ParcelAnalysisLayout>
        </>
      )}
    </div>
  );
}
