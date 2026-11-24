import type { ConnexionFixe } from "../../../../../../../types/environnement";
import { useRevealed } from "../../../../../../../hooks/useRevealed";
import PanelCard from "../shared/PanelCard";

type CoverageLine = { label: string; value: number };

export default function FixedCoverageCard({ fixe }: { fixe: ConnexionFixe }) {
  const revealed = useRevealed();
  const lines: CoverageLine[] = [
    { label: "Fibre optique (FttH)", value: fixe.partFibre },
    { label: "Câble", value: fixe.partCable },
    { label: "ADSL / VDSL (cuivre)", value: fixe.partCuivre },
    { label: "4G fixe (box 4G)", value: fixe.part4gFixe },
    { label: "Satellite", value: fixe.partSatellite },
    { label: "Débit ≥ 30 Mbit/s", value: fixe.partTresHautDebit },
    { label: "Débit ≥ 1 Gbit/s", value: fixe.partGigabit },
  ];
  const updatedAt = new Date(fixe.miseAJour).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <PanelCard
      title="Internet fixe dans la commune"
      subtitle={`${fixe.commune} · ${fixe.locaux.toLocaleString("fr-FR")} locaux`}
      aside={`Arcep, ${updatedAt}`}
    >
      <ul className="flex flex-col gap-1.5">
        {lines.map(({ label, value }) => (
          <li key={label} className="relative flex items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-xs">
            <span
              className="absolute inset-y-0 left-0 rounded-md bg-emerald-500/15 transition-[width] duration-500 ease-out dark:bg-emerald-500/20"
              style={{ width: revealed ? `${value}%` : "0%" }}
            />
            <span className="relative min-w-0 flex-1 truncate text-gray-700 dark:text-gray-200">{label}</span>
            <span className="relative shrink-0 font-semibold tabular-nums text-gray-900 dark:text-white">{value.toLocaleString("fr-FR")} %</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        Part des logements et locaux professionnels de la commune éligibles à chaque technologie.
      </p>
    </PanelCard>
  );
}
