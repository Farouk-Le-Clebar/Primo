import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import GeorisquesSummary from "./GeorisquesSummary";
import GeorisquesRisks from "./GeorisquesRisks";
import GeorisquesCatnat from "./GeorisquesCatnat";
import { prepareGeorisques } from "./data";
import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import { getGeorisquesByInsee } from "../../../../../../../requests/georisques/information";

export default function GeorisquesWidget({
  selectedParcelle,
}: {
  selectedParcelle: {
    id?: string;
    feature?: { properties?: { commune?: string } | null };
  };
}) {
  const insee = String(selectedParcelle?.feature?.properties?.commune || "");
  const validInsee = /^[0-9AB]{5}$/.test(insee);
  const departement = insee
    ? insee.slice(0, insee.startsWith("97") ? 3 : 2)
    : String(selectedParcelle?.id).split("_")[1]?.split(".")[0] || "";

  const {
    data,
    isLoading: isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["georisques-summary", insee, departement],
    queryFn: () => getGeorisquesByInsee(insee, departement),
    enabled: validInsee && !!departement,
    staleTime: 300000,
    retry: false,
  });

  const properties = data?.features?.[0]?.properties;
  const prepared = properties ? prepareGeorisques(properties) : null;

  return (
    <div className="font-inter w-full">
      {isPending && (
        <div className="flex items-center gap-2 mb-4">
          <LoadingPrimoLogo className="w-6 h-6 text-black-500" />
          <span className="text-[11px] font-medium text-[#878D96] dark:text-gray-400">
            Récupération des données Géorisques...
          </span>
        </div>
      )}

      {!isPending && (!prepared || isError || !validInsee) && (
        <div className="py-8 text-sm text-[#878D96] dark:text-gray-400 text-center bg-gray-50 dark:bg-[#171717] rounded-xl border border-dashed border-gray-200 dark:border-[#232323]">
          {!validInsee
            ? "Le code commune de cette parcelle est indisponible."
            : isError
              ? "Les données Géorisques sont momentanément indisponibles."
              : "Aucune donnée Géorisques disponible pour cette commune."}
          {isError && (
            <button
              onClick={() => void refetch()}
              className="mt-3 block w-full font-medium text-emerald-700 underline dark:text-emerald-400"
            >
              Réessayer
            </button>
          )}
        </div>
      )}

      {!isPending && !isError && validInsee && prepared && (
        <ParcelAnalysisLayout summary={<GeorisquesSummary data={prepared} />}>
          <GeorisquesRisks data={prepared} />
          <GeorisquesCatnat key={insee} events={prepared.catnat} />
        </ParcelAnalysisLayout>
      )}
    </div>
  );
}
