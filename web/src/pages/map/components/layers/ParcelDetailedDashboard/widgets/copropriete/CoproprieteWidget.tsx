import { useMemo } from "react";
import type { Feature } from "geojson";

import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import { useCoproprietes, useLogementsSociaux } from "../habitat/useHabitat";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import CoproprieteAlerts from "./CoproprieteAlerts";
import CoproprieteCard from "./CoproprieteCard";
import CoproprieteKpis from "./CoproprieteKpis";
import { socialShare } from "./data";

export default function CoproprieteWidget({ feature }: { feature: Feature }) {
  const { data, isLoading, isError, refetch } = useCoproprietes(feature);
  const logements = useLogementsSociaux(feature).data;
  const social = useMemo(
    () => Object.fromEntries((data ?? []).map((copro) => [copro.numero_immatriculation, socialShare(copro, logements ?? [])])),
    [data, logements],
  );

  if (isLoading) return <WidgetLoading label="Consultation du registre des copropriétés…" />;
  if (isError || !data?.length)
    return (
      <WidgetEmpty
        message={
          isError
            ? "Le registre des copropriétés est momentanément indisponible."
            : "Aucune copropriété immatriculée sur cette parcelle : monopropriété, maison individuelle ou syndicat non déclaré."
        }
        onRetry={isError ? () => void refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <CoproprieteKpis coproprietes={data} />
      <ParcelAnalysisLayout summary={<CoproprieteAlerts coproprietes={data} social={social} />}>
        {data.map((copro) => (
          <CoproprieteCard key={copro.numero_immatriculation} copro={copro} social={social[copro.numero_immatriculation]} />
        ))}
        <SourceNote>
          Source : registre national d’immatriculation des copropriétés (ANAH), déclaré par les syndics. « Parcelle
          déclarée » : la parcelle figure dans le règlement enregistré ; « adresse à proximité » : rattachement par la
          géolocalisation de l’adresse, faute de référence cadastrale. Une parcelle déclarée alors que l’adresse est à
          plus de 200 m est signalée comme douteuse. Logements sociaux : répertoire RPLS, rapproché par l’adresse de référence.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
