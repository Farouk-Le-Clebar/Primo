import { useState } from "react";

import type { EncadrementLoyer } from "../habitat/types";
import { parseSurface } from "../logement/normalize";
import type { HousingType, LogementTarget } from "../logement/types";
import PanelCard from "../shared/PanelCard";
import { chip } from "../shared/tones";
import { MAX_PIECES, estimateRent, monthly, type MarketRent } from "./data";

type LoyerSimulatorProps = { rents: MarketRent[]; encadrement: EncadrementLoyer[]; target?: LogementTarget };

const INPUT_CLASS =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-[#0A0A0A] dark:text-white";

const PIECES = Array.from({ length: MAX_PIECES }, (_, i) => i + 1);

const Result = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
  <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 py-2.5 first:border-t-0 dark:border-white/5">
    <div className="min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="truncate text-[11px] text-gray-400">{hint}</p>
    </div>
    <p className="shrink-0 text-base font-semibold tabular-nums text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default function LoyerSimulator({ rents, encadrement, target }: LoyerSimulatorProps) {
  const [housing, setHousing] = useState<HousingType>(target?.type ?? "appartement");
  const [surface, setSurface] = useState(target?.surface ?? "");
  const [pieces, setPieces] = useState<number | null>(null);
  const [meuble, setMeuble] = useState(false);
  const [year, setYear] = useState("");
  const parsedYear = /^\d{4}$/.test(year) ? Number(year) : null;
  const estimate = estimateRent(rents, encadrement, { housing, surface: parseSurface(surface), pieces, meuble, year: parsedYear });
  const capHint = !encadrement.length
    ? "Commune non encadrée"
    : !pieces || !parsedYear
      ? "Indiquez les pièces et l’année de construction"
      : estimate.cap
        ? `Réf. majorée ${estimate.cap.epoque} · hors charges`
        : "Aucun plafond pour ces critères";

  return (
    <PanelCard title="Simuler un loyer" subtitle="Loyer de marché et plafond légal pour un logement de la parcelle">
      <div className="flex gap-1 rounded-lg bg-gray-50 p-0.5 dark:bg-white/5">
        {(["appartement", "maison"] as const).map((id) => (
          <button key={id} onClick={() => setHousing(id)} className={`${chip(housing === id)} flex-1 capitalize`}>{id}</button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="text-[11px] text-gray-500 dark:text-gray-400">
          Surface (m²)
          <input value={surface} inputMode="decimal" placeholder="45" onChange={(e) => setSurface(e.target.value)} className={INPUT_CLASS} />
        </label>
        <label className="text-[11px] text-gray-500 dark:text-gray-400">
          Année de construction
          <input value={year} inputMode="numeric" placeholder="1965" onChange={(e) => setYear(e.target.value)} className={INPUT_CLASS} />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
        Pièces
        {PIECES.map((n) => (
          <button key={n} onClick={() => setPieces(pieces === n ? null : n)} className={chip(pieces === n)}>{n === MAX_PIECES ? "4+" : n}</button>
        ))}
        <button onClick={() => setMeuble(!meuble)} className={`${chip(meuble)} ml-auto`}>Meublé</button>
      </div>
      <div className="mt-3">
        <Result
          label="Loyer de marché"
          value={monthly(estimate.monthly)}
          hint={estimate.low && estimate.high ? `${monthly(estimate.low)} – ${monthly(estimate.high)} · charges comprises` : "Surface nécessaire · charges comprises"}
        />
        <Result label="Plafond légal" value={monthly(estimate.capMonthly)} hint={capHint} />
      </div>
    </PanelCard>
  );
}
