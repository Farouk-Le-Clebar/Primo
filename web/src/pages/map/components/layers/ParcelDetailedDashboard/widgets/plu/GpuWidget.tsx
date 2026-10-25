import ParcelAnalysisLayout from "../../ParcelAnalysisLayout";
import type { ParcelWidgetProps } from "../../types";
import { SourceNote, WidgetEmpty, WidgetLoading } from "../shared/WidgetStatus";
import PluKpis from "./PluKpis";
import PluRules from "./PluRules";
import PluZoneCard from "./PluZoneCard";
import { usePluData } from "./usePluData";

export default function GpuWidget({ feature }: ParcelWidgetProps) {
  const { zones, prescriptions, informations } = usePluData(feature);
  const zoneList = zones.data ?? [];

  if (zones.isLoading) return <WidgetLoading label="Analyse du zonage…" />;

  if (!zoneList.length)
    return (
      <WidgetEmpty
        message={
          zones.isError
            ? "Le service PLU est momentanément indisponible."
            : "Aucun zonage numérique trouvé. Le régime applicable (RNU, carte communale) reste à vérifier."
        }
        onRetry={zones.isError ? () => void zones.refetch() : undefined}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4 font-inter lg:gap-6">
      <PluKpis zones={zoneList} prescriptions={prescriptions.data} informations={informations.data} />
      <ParcelAnalysisLayout
        summary={<PluZoneCard zones={zoneList} inseeCode={feature?.properties?.commune} />}
      >
        <PluRules
          title="Prescriptions"
          subtitle="Règles graphiques du PLU qui s’appliquent à la parcelle"
          empty="Aucune servitude ou prescription spécifique détectée."
          rules={prescriptions.data}
          isLoading={prescriptions.isLoading}
          isError={prescriptions.isError}
        />
        <PluRules
          title="Informations annexes"
          subtitle="Périmètres, droits de préemption et secteurs particuliers"
          empty="Aucune information annexe détectée sur cette parcelle."
          rules={informations.data}
          isLoading={informations.isLoading}
          isError={informations.isError}
        />
        <SourceNote>
          Source : Géoportail de l’urbanisme (GPU). Codes CNIG ; seul le règlement opposable de la
          commune fait foi.
        </SourceNote>
      </ParcelAnalysisLayout>
    </div>
  );
}
