import { coproTotals, periodeLabel, syndicLabel } from "../../widgets/copropriete/data";
import type { Copropriete } from "../../widgets/habitat/types";
import { TERRITOIRE_LABELS, euroM2, marketRentFor, percent, type MarketRent } from "../../widgets/loyers/data";
import type { SocialStats } from "../../widgets/logementsSociaux/data";
import SummaryFact from "../SummaryFact";

const Headline = ({ value, unit, note }: { value: string; unit: string; note: string }) => (
  <>
    <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
      {value}
      <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">{unit}</span>
    </p>
    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{note}</p>
  </>
);

const Facts = ({ facts }: { facts: { label: string; value: string }[] }) => (
  <dl className="mt-auto pt-4">
    {facts.map((fact) => (
      <SummaryFact key={fact.label} {...fact} />
    ))}
  </dl>
);

export function CoproprieteBody({ coproprietes }: { coproprietes: Copropriete[] }) {
  const totals = coproTotals(coproprietes);
  const main = coproprietes[0];
  return (
    <>
      <Headline value={totals.lots.toLocaleString("fr-FR")} unit="lots" note={`dont ${totals.habitation.toLocaleString("fr-FR")} à usage d’habitation`} />
      <Facts
        facts={[
          { label: "Syndic", value: syndicLabel(main) },
          { label: "Mandat", value: main.mandat ?? "Non déclaré" },
          { label: "Construction", value: periodeLabel(main.periode_construction) },
        ]}
      />
    </>
  );
}

export function LogementsSociauxBody({ stats }: { stats: SocialStats }) {
  return (
    <>
      <Headline value={stats.count.toLocaleString("fr-FR")} unit={`logement${stats.count > 1 ? "s" : ""} sociaux`} note="Répertoire des bailleurs sociaux au 1er janvier" />
      <Facts
        facts={[
          { label: "Typologie dominante", value: stats.topPieces ?? "—" },
          { label: "Surface médiane", value: stats.medianSurface ? `${Math.round(stats.medianSurface)} m²` : "—" },
          { label: "DPE F ou G", value: stats.poorShare === null ? "—" : `${stats.poorShare} %` },
        ]}
      />
    </>
  );
}

type LoyersBodyProps = { rents: MarketRent[]; territoire: string | null; yieldRate: number | null };

export function LoyersBody({ rents, territoire, yieldRate }: LoyersBodyProps) {
  const flat = marketRentFor(rents, "appartement");
  const house = rents.find((rent) => rent.type === "maison");
  return (
    <>
      <Headline value={euroM2(flat?.m2 ?? null)} unit="appartement" note="Loyer de marché de la commune, charges comprises" />
      <Facts
        facts={[
          { label: "Maison", value: euroM2(house?.m2 ?? null) },
          { label: "Encadrement", value: territoire ? TERRITOIRE_LABELS[territoire] ?? territoire : "Non concerné" },
          { label: "Rendement brut", value: percent(yieldRate) },
        ]}
      />
    </>
  );
}
