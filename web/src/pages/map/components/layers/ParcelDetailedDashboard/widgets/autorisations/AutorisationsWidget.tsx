import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAutorisationsParcelle } from "../../../../../../../requests/autorisations/information";
import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import AutorisationsExplorer from "./AutorisationsExplorer";
import AutorisationsKpis from "./AutorisationsKpis";
import AutorisationsOverview from "./AutorisationsOverview";
import { prepareAutorisations } from "./data";

const PARCEL_ID_PATTERN = /^[0-9AB]{5}[0-9]{3}[0-9A-Z]{2}[0-9]{4}$/;

export default function AutorisationsWidget({ feature }: ParcelWidgetProps) {
  const idParcelle = String(feature?.properties?.id || "").trim().toUpperCase();
  const isValidParcelle = PARCEL_ID_PATTERN.test(idParcelle);
  const [type, setType] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["autorisations-parcelle", idParcelle],
    queryFn: () => getAutorisationsParcelle(idParcelle),
    enabled: isValidParcelle,
    staleTime: 300000,
    retry: false,
  });
  const dossiers = useMemo(() => prepareAutorisations(data || []), [data]);
  const filtered = useMemo(() => dossiers.filter((d) => !type || d.type === type), [dossiers, type]);

  if (isLoading) return <WidgetLoading label="Récupération des autorisations d’urbanisme…" />;

  if (!isValidParcelle || isError || !dossiers.length)
    return (
      <WidgetEmpty
        message={
          !isValidParcelle
            ? "La référence cadastrale de cette parcelle est indisponible."
            : isError
              ? "Les autorisations d’urbanisme sont momentanément indisponibles."
              : "Aucune autorisation référencée pour cette parcelle dans les données disponibles."
        }
        onRetry={isValidParcelle && isError ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <AutorisationsKpis dossiers={dossiers} />
      <ParcelAnalysisLayout
        summary={
          <div className="primo-stagger flex flex-col gap-4">
            <AutorisationsOverview dossiers={dossiers} activeType={type} onSelectType={setType} />
          </div>
        }
      >
        <AutorisationsExplorer key={`${idParcelle}-${type}`} dossiers={filtered} type={type} onClearType={() => setType(null)} />
        <SourceNote>
          Source : SDES · base Sitadel des autorisations d’urbanisme. Historique des projets déclarés,
          dossiers annulés compris ; les références cadastrales peuvent avoir changé depuis le dépôt.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
