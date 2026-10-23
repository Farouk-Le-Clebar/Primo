import type { Feature } from "geojson";
import { Building2, FileSignature, FileText, Landmark, ShieldAlert, Zap } from "lucide-react";

import BuildingsBody from "./summary/cards/BuildingsBody";
import DpeBody from "./summary/cards/DpeBody";
import DvfBody from "./summary/cards/DvfBody";
import PermitsBody from "./summary/cards/PermitsBody";
import PluBody from "./summary/cards/PluBody";
import RisksBody from "./summary/cards/RisksBody";
import ParcelKeyFigures from "./summary/ParcelKeyFigures";
import SummaryCard from "./summary/SummaryCard";
import { useParcelSummary } from "./summary/useParcelSummary";

type ParcelSummaryProps = {
  feature: Feature;
  banId?: string;
  onNavigate: (tab: string) => void;
};

export default function ParcelSummary({ feature, banId, onNavigate }: ParcelSummaryProps) {
  const summary = useParcelSummary(feature, banId);
  const { buildings, plu, dpe, dvf, risks, permits } = summary;

  return (
    <div className="primo-dashboard-reveal space-y-6 pb-6 font-inter">
      <ParcelKeyFigures figures={summary.figures} />
      <div className="primo-stagger grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        <SummaryCard
          title="Bâtiments"
          source="IGN · BD TOPO"
          icon={Building2}
          tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          {...buildings.state}
          missing={!buildings.stats.count}
          empty="Aucun bâtiment référencé sur cette parcelle."
          onOpen={() => onNavigate("batiments")}
        >
          <BuildingsBody stats={buildings.stats} parcelArea={summary.parcelArea} />
        </SummaryCard>
        <SummaryCard
          title="Urbanisme · PLU"
          source="Géoportail de l’urbanisme"
          icon={FileText}
          tone="bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
          {...plu.state}
          missing={!plu.data.labels.length}
          empty="Aucun zonage numérique retourné. Le régime applicable reste à vérifier."
          onOpen={() => onNavigate("plu")}
        >
          <PluBody plu={plu.data} />
        </SummaryCard>
        <SummaryCard
          title="Transactions · DVF"
          source="Demandes de valeurs foncières"
          icon={Landmark}
          tone="bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
          {...dvf.state}
          missing={!dvf.data.count}
          empty="Aucune transaction disponible pour cette parcelle."
          onOpen={() => onNavigate("dvf")}
        >
          <DvfBody dvf={dvf.data} />
        </SummaryCard>
        <SummaryCard
          title="Performance énergétique"
          source="ADEME · DPE à l’adresse BAN"
          icon={Zap}
          tone="bg-lime-100 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400"
          {...dpe.state}
          missing={!dpe.data.count}
          empty={banId ? "Aucun diagnostic disponible pour cette adresse." : "L’adresse BAN est nécessaire pour retrouver les diagnostics."}
          onOpen={() => onNavigate("dpe")}
        >
          <DpeBody dpe={dpe.data} />
        </SummaryCard>
        <SummaryCard
          title="Risques"
          source="Géorisques · données communales"
          icon={ShieldAlert}
          tone="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
          {...risks.state}
          missing={!risks.data}
          empty="Aucune donnée Géorisques disponible pour cette commune."
          onOpen={() => onNavigate("georisques")}
        >
          {risks.data && <RisksBody risks={risks.data} />}
        </SummaryCard>
        <SummaryCard
          title="Autorisations d’urbanisme"
          source="Permis et déclarations préalables"
          icon={FileSignature}
          tone="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
          {...permits.state}
          missing={!permits.data.count}
          empty="Aucune autorisation référencée pour cette parcelle."
          onOpen={() => onNavigate("autorisations")}
        >
          <PermitsBody permits={permits.data} />
        </SummaryCard>
      </div>
    </div>
  );
}
