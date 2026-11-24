import { useState } from "react";

import type { EncadrementLoyer } from "../habitat/types";
import PanelCard from "../shared/PanelCard";
import { chip } from "../shared/tones";
import { MAX_PIECES, TERRITOIRE_LABELS, epoques, rentCap } from "./data";

const PIECES = Array.from({ length: MAX_PIECES }, (_, i) => i + 1);
const price = (value: number): string => value.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function EncadrementGrid({ rows }: { rows: EncadrementLoyer[] }) {
  const [meuble, setMeuble] = useState(false);
  const columns = epoques(rows);
  const first = rows[0];

  return (
    <PanelCard
      flush
      title="Plafonds de l’encadrement des loyers"
      subtitle={`${TERRITOIRE_LABELS[first.territoire] ?? first.territoire} · ${first.periode} · ${first.zone ?? ""} · €/m² hors charges`}
      aside={
        <span className="flex gap-1">
          <button className={chip(!meuble)} onClick={() => setMeuble(false)}>Vide</button>
          <button className={chip(meuble)} onClick={() => setMeuble(true)}>Meublé</button>
        </span>
      }
    >
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[480px] text-xs">
          <thead>
            <tr className="border-y border-gray-100 text-left text-gray-500 dark:border-white/5 dark:text-gray-400">
              <th className="px-4 py-2 font-medium">Pièces</th>
              {columns.map((column) => (
                <th key={column.epoque} className="px-3 py-2 text-right font-medium">{column.epoque}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PIECES.map((pieces) => (
              <tr key={pieces} className="border-b border-gray-100 last:border-0 dark:border-white/5">
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-200">{pieces === MAX_PIECES ? "4 et +" : pieces}</td>
                {columns.map((column) => {
                  const cap = rentCap(rows, { pieces, year: column.annee_min ?? column.annee_max, meuble });
                  return (
                    <td key={column.epoque} className="px-3 py-2.5 text-right tabular-nums">
                      <span className="font-semibold text-gray-900 dark:text-white">{cap ? price(cap.ceiling) : "—"}</span>
                      <span className="block text-[10px] text-gray-400">{cap ? `réf. ${price(cap.reference)}` : ""}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 pb-4 pt-2 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        En gras, le loyer de référence majoré : plafond légal hors complément de loyer justifié. Un loyer sous le loyer
        minoré peut être réévalué au renouvellement du bail.
      </p>
    </PanelCard>
  );
}
