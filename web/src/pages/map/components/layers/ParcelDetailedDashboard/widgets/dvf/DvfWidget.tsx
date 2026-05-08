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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dvf-parcelle', idParcelle],
    queryFn: () => getDvfParcelle(String(idParcelle)),
    enabled: !!idParcelle && String(idParcelle).length === 14,
    retry: false,
  });

  const transactions = data?.historique || data || [];
  const isEmpty = !transactions || transactions.length === 0;

  return (
    <div className="font-inter w-full h-full flex flex-col min-h-0">
      {isLoading ? (
        <div className="flex items-center gap-2 mb-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <LoadingPrimoLogo className="w-6 h-6 text-black" />
          <span className="text-[13px] font-medium text-[#878D96]">Analyse de l'historique DVF...</span>
        </div>
      ) : isError || isEmpty ? (
        <div className="py-8 text-sm text-[#878D96] text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          Aucune transaction immobilière publique récente trouvée sur cette parcelle.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 w-full h-full min-h-0">
          
          <div className="w-full md:w-1/3 h-auto md:h-full">
            <DvfSummaryCard transactions={transactions} />
          </div>

          <div className="w-full md:w-2/3 h-auto md:h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto flex flex-col gap-6 pb-4 pr-1 scrollbar-custom">
              <DvfEvolutionChart transactions={transactions} />
              <DvfDistributionCards transactions={transactions} />
              <DvfTransactionsTab transactions={transactions} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}