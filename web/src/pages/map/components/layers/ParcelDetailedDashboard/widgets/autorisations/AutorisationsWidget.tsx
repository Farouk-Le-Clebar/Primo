import { useMemo } from "react";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import AutorisationsSummary from "./AutorisationsSummary";
import AutorisationsList from "./AutorisationsList";
import { prepareAutorisations } from "./data";
import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import type { ParcelWidgetProps } from "../../types";
import { getAutorisationsParcelle } from "../../../../../../../requests/autorisations/information";

export default function AutorisationsWidget({ feature }: ParcelWidgetProps) {
  const idParcelle = String(feature?.properties?.id || "")
    .trim()
    .toUpperCase();
  const isValidParcelle = /^[0-9AB]{5}[0-9]{3}[0-9A-Z]{2}[0-9]{4}$/.test(
    idParcelle,
  );

  const {
    data,
    isLoading: isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["autorisations-parcelle", idParcelle],
    queryFn: () => getAutorisationsParcelle(idParcelle),
    enabled: isValidParcelle,
    staleTime: 300000,
    retry: false,
  });

  const autorisations = useMemo(() => prepareAutorisations(data || []), [data]);

  return (
    <div className="font-inter w-full">
      {isPending && (
        <div className="flex items-center gap-2 mb-4">
          <LoadingPrimoLogo className="w-6 h-6 text-black-500" />
          <span className="text-[11px] font-medium text-[#878D96] dark:text-gray-400">
            Récupération des autorisations d’urbanisme...
          </span>
        </div>
      )}

      {!isPending &&
        (!isValidParcelle || isError || autorisations.length === 0) && (
          <div className="py-8 text-sm text-[#878D96] dark:text-gray-400 text-center bg-gray-50 dark:bg-[#171717] rounded-xl border border-dashed border-gray-200 dark:border-[#232323]">
            {!isValidParcelle
              ? "La référence cadastrale de cette parcelle est indisponible."
              : isError
                ? "Les autorisations d’urbanisme sont momentanément indisponibles."
                : "Aucune autorisation référencée pour cette parcelle dans les données disponibles."}
            {isValidParcelle && isError && (
              <button
                onClick={() => void refetch()}
                className="mt-3 block w-full font-medium text-emerald-700 underline dark:text-emerald-400"
              >
                Réessayer
              </button>
            )}
          </div>
        )}

      {!isPending &&
        !isError &&
        isValidParcelle &&
        autorisations.length > 0 && (
          <ParcelAnalysisLayout
            summary={<AutorisationsSummary dossiers={autorisations} />}
          >
            <AutorisationsList key={idParcelle} dossiers={autorisations} />
          </ParcelAnalysisLayout>
        )}
    </div>
  );
}
