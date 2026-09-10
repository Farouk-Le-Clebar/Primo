import { useQuery } from "@tanstack/react-query";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";

// COMPOENENTS
import { getDpeBan } from "../../../../../../../requests/dpe/information";
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import DpeSummaryCard from "./DpeSummaryCard";
import DpeDistributionCard from "./DpeDistributionCard";
import DpeList from "./DpeList";

export default function DpeWidget({
  selectedParcelle,
}: {
  selectedParcelle: any;
}) {
  const addokFeatures = selectedParcelle?.addokData?.features;
  const identifiantBan =
    addokFeatures?.length > 0 ? addokFeatures[0].properties.id : null;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dpe-ban", identifiantBan],
    queryFn: () => getDpeBan(String(identifiantBan)),
    enabled: !!identifiantBan,
    staleTime: 300000,
    retry: false,
  });

  const dpeList: any[] = Array.isArray(data) ? data : (data?.historique ?? []);
  const isEmpty = !dpeList || dpeList.length === 0;

  return (
    <div className="font-inter w-full">
      {isLoading ? (
        <div className="flex items-center gap-2 mb-4 bg-white dark:bg-[#171717] p-6 rounded-xl border border-gray-100 shadow-sm">
          <LoadingPrimoLogo className="w-6 h-6 text-emerald-500" />
          <span className="text-[13px] font-medium text-[#878D96]">
            Analyse énergétique en cours…
          </span>
        </div>
      ) : isError || isEmpty ? (
        <div className="py-8 text-sm text-[#878D96] text-center bg-gray-50 dark:bg-[#171717] rounded-xl border border-dashed border-gray-200 dark:border-white/10">
          {isError
            ? "Le service est momentanément indisponible."
            : "Aucun diagnostic disponible pour cette adresse."}
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
        <ParcelAnalysisLayout summary={<DpeSummaryCard dpeList={dpeList} />}>
          <DpeDistributionCard dpeList={dpeList} />
          <DpeList dpeList={dpeList} />
        </ParcelAnalysisLayout>
      )}
    </div>
  );
}
