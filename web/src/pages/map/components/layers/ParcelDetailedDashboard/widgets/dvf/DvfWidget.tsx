import { useQuery } from "@tanstack/react-query";
import { Grid, Col } from "@tremor/react";

// COMPONENTS
import type { ParcelWidgetProps } from "../../types";
import { getDvfParcelle } from "../../../../../../../requests/dvf/information";
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";

// SOUS-COMPOSANTS (à créer)
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

  const transactions = data?.historique || data || []; // Adaptation selon la structure exacte renvoyée
  const isEmpty = !transactions || transactions.length === 0;

  return (
    <div className="font-inter w-full">
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
        <Grid numItems={1} numItemsMd={3} className="gap-6 w-full relative">
          
          {/* COLONNE GAUCHE : Synthèse (Sticky) */}
          <Col numColSpan={1}>
            <div className="sticky top-0 h-182 flex flex-col">
              <DvfSummaryCard transactions={transactions} />
            </div>
          </Col>

          {/* COLONNE DROITE : Graphiques */}
          <Col numColSpan={1} numColSpanMd={2} className="pb-10">
            <div className="flex flex-col gap-6">
              {/* Graphique d'évolution */}
              <DvfEvolutionChart transactions={transactions} />
              
              {/* Distribution Surface & Types de biens */}
              <DvfDistributionCards transactions={transactions} />
              
              <DvfTransactionsTab transactions={transactions} />
            </div>
          </Col>

        </Grid>
      )}
    </div>
  );
}