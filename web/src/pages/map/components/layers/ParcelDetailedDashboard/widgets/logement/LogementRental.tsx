import type { Feature } from "geojson";
import { KeyRound } from "lucide-react";

import { useLogementsSociaux, useLoyers } from "../habitat/useHabitat";
import { estimateRent, marketRents, monthly, percent } from "../loyers/data";
import PanelCard from "../shared/PanelCard";
import { TONES } from "../shared/tones";
import { matchSocial } from "./socialMatch";
import type { LogementTarget } from "./types";

type LogementRentalProps = {
  feature: Feature;
  target: LogementTarget;
  surface: number | null;
  pieces: number | null;
  year: number | null;
  value: number | null;
};

const Fact = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
  <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 py-2.5 first:border-t-0 dark:border-white/5">
    <div className="min-w-0">
      <p className="text-sm text-gray-700 dark:text-gray-200">{label}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400">{hint}</p>
    </div>
    <p className="shrink-0 text-base font-semibold tabular-nums text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default function LogementRental({ feature, target, surface, pieces, year, value }: LogementRentalProps) {
  const loyers = useLoyers(feature);
  const social = useLogementsSociaux(feature);
  const encadrement = loyers.data?.encadrement ?? [];
  const estimate = estimateRent(marketRents(loyers.data?.commune ?? []), encadrement, {
    housing: target.type, surface, pieces, meuble: false, year,
  });
  const yieldRate = estimate.monthly && value ? ((estimate.monthly * 12) / value) * 100 : null;
  const socialMatches = matchSocial(social.data ?? [], target, surface);
  const capHint = !encadrement.length
    ? "Commune non soumise à l’encadrement"
    : estimate.cap
      ? `Loyer de référence majoré · ${pieces} pièce${pieces && pieces > 1 ? "s" : ""} · ${estimate.cap.epoque}`
      : "Pièces ou année de construction inconnues";

  if (!estimate.market && !socialMatches.length) return null;

  return (
    <PanelCard title="Mise en location" subtitle="Loyer de marché de la commune appliqué à la surface du logement">
      {socialMatches.length > 0 && (
        <p className={`mb-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${TONES.violet}`}>
          <KeyRound size={14} className="mt-0.5 shrink-0" />
          {socialMatches.length === 1 ? "Un logement social" : `${socialMatches.length} logements sociaux`} de cet étage et de
          cette surface figure{socialMatches.length > 1 ? "nt" : ""} au répertoire RPLS : ce logement appartient probablement à un bailleur social.
        </p>
      )}
      <Fact label="Loyer de marché" value={monthly(estimate.monthly)} hint={estimate.low && estimate.high ? `${monthly(estimate.low)} – ${monthly(estimate.high)} · charges comprises` : "Surface nécessaire"} />
      {encadrement.length > 0 && <Fact label="Plafond légal" value={monthly(estimate.capMonthly)} hint={capHint} />}
      <Fact label="Rendement brut" value={percent(yieldRate)} hint={value ? "Loyer annuel / valeur indicative" : "Valeur indicative indisponible"} />
    </PanelCard>
  );
}
