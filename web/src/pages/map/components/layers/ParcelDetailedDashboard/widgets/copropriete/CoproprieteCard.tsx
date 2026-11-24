import type { Copropriete } from "../habitat/types";
import PanelCard from "../shared/PanelCard";
import { dateLabel } from "../shared/format";
import { TONES, type Tone } from "../shared/tones";
import { distanceLabel, mandatTone, periodeLabel, socialLabel, syndicLabel, type SocialShare } from "./data";

const BADGES: Record<Copropriete["rattachement"], { tone: Tone; label: (copro: Copropriete) => string }> = {
  parcelle: { tone: "emerald", label: () => "Parcelle déclarée" },
  adresse: { tone: "amber", label: () => "Adresse à proximité" },
  parcelle_eloignee: { tone: "rose", label: (copro) => `Déclarée, adresse à ${distanceLabel(copro.distance_adresse)}` },
};

const count = (value: number | null): string => (value === null ? "—" : value.toLocaleString("fr-FR"));

export default function CoproprieteCard({ copro, social }: { copro: Copropriete; social: SocialShare }) {
  const facts = [
    { label: "Construction", value: periodeLabel(copro.periode_construction) },
    { label: "Règlement de copropriété", value: dateLabel(copro.date_reglement) },
    { label: "Lots principaux", value: count(copro.nombre_lots_principaux) },
    { label: "dont habitation", value: count(copro.nombre_lots_habitation) },
    { label: "Stationnements", value: count(copro.nombre_lots_stationnement) },
    { label: "Logements sociaux", value: socialLabel(social, copro.nombre_lots_habitation) },
    { label: "Parcelles cadastrales", value: copro.nombre_parcelles ? count(copro.nombre_parcelles) : "Non déclarées" },
    { label: "Syndic", value: syndicLabel(copro) },
    { label: "Fin du dernier mandat", value: dateLabel(copro.date_fin_mandat) },
    { label: "Immatriculée le", value: dateLabel(copro.date_immatriculation) },
    { label: "Mise à jour du registre", value: dateLabel(copro.date_derniere_maj) },
  ];

  return (
    <PanelCard
      title={copro.nom_usage ?? copro.adresse_reference ?? copro.numero_immatriculation}
      subtitle={`${copro.adresse_reference ?? "Adresse non renseignée"} · n° ${copro.numero_immatriculation}`}
      aside={
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${TONES[BADGES[copro.rattachement].tone]}`}>
          {BADGES[copro.rattachement].label(copro)}
        </span>
      }
    >
      {copro.mandat && (
        <p className={`mb-3 inline-block rounded-md px-2 py-1 text-xs font-medium ${TONES[mandatTone(copro.mandat)]}`}>{copro.mandat}</p>
      )}
      <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        {facts.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3 border-t border-gray-100 py-2 text-sm dark:border-white/5">
            <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="truncate text-right font-medium text-gray-900 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </PanelCard>
  );
}
