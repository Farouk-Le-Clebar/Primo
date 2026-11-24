import { useMemo } from "react";
import type { Feature } from "geojson";
import { Building, Coins, KeyRound } from "lucide-react";

import { useCoproprietes, useLogementsSociaux, useLoyers } from "../widgets/habitat/useHabitat";
import { socialStats } from "../widgets/logementsSociaux/data";
import { grossYield, marketRentFor, marketRents } from "../widgets/loyers/data";
import { useParcelPriceM2 } from "../widgets/loyers/useParcelPriceM2";
import { CoproprieteBody, LogementsSociauxBody, LoyersBody } from "./cards/HabitatBodies";
import SummaryCard from "./SummaryCard";
import { queryState } from "./useSummaryQueries";

type HabitatSummaryCardsProps = { feature: Feature; onNavigate: (tab: string) => void };

export default function HabitatSummaryCards({ feature, onNavigate }: HabitatSummaryCardsProps) {
  const coproprietes = useCoproprietes(feature);
  const logements = useLogementsSociaux(feature);
  const loyers = useLoyers(feature);
  const priceM2 = useParcelPriceM2(feature, "appartement");
  const stats = useMemo(() => socialStats(logements.data ?? []), [logements.data]);
  const rents = useMemo(() => marketRents(loyers.data?.commune ?? []), [loyers.data]);

  return (
    <>
      <SummaryCard
        title="Copropriété"
        source="Registre national des copropriétés"
        icon={Building}
        tone="bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-400"
        {...queryState(coproprietes)}
        missing={!coproprietes.data?.length}
        empty="Aucune copropriété immatriculée sur cette parcelle."
        onOpen={() => onNavigate("copropriete")}
      >
        {coproprietes.data?.length ? <CoproprieteBody coproprietes={coproprietes.data} /> : null}
      </SummaryCard>
      <SummaryCard
        title="Logements sociaux"
        source="SDES · répertoire RPLS"
        icon={KeyRound}
        tone="bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
        {...queryState(logements)}
        missing={!stats.count}
        empty="Aucun logement social recensé sur cette parcelle."
        onOpen={() => onNavigate("logements-sociaux")}
      >
        <LogementsSociauxBody stats={stats} />
      </SummaryCard>
      <SummaryCard
        title="Loyers"
        source="Carte des loyers · encadrement"
        icon={Coins}
        tone="bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
        {...queryState(loyers)}
        missing={!rents.length}
        empty="Aucun indicateur de loyer publié pour cette commune."
        onOpen={() => onNavigate("loyers")}
      >
        <LoyersBody
          rents={rents}
          territoire={loyers.data?.encadrement[0]?.territoire ?? null}
          yieldRate={grossYield(marketRentFor(rents, "appartement")?.m2 ?? null, priceM2)}
        />
      </SummaryCard>
    </>
  );
}
