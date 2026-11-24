import { useState } from "react";

import { getDpeColors } from "../dpe/utils";
import { toNumber } from "../habitat/types";
import PanelCard from "../shared/PanelCard";
import { TONES } from "../shared/tones";
import { floorShort, piecesLabel, type SocialAddress } from "./data";

const PREVIEW = 12;
const HEADERS = ["Étage", "Type", "Surface", "Construit", "DPE", "Financement"];

export default function SocialAddressTable({ group }: { group: SocialAddress }) {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? group.logements : group.logements.slice(0, PREVIEW);

  return (
    <PanelCard
      flush
      title={group.adresse}
      subtitle={group.programme ?? "Programme non nommé"}
      aside={
        <span className="flex items-center gap-2">
          {group.selected && <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${TONES.emerald}`}>Adresse sélectionnée</span>}
          {`${group.logements.length} logement${group.logements.length > 1 ? "s" : ""}`}
        </span>
      }
    >
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-xs">
          <thead>
            <tr className="border-y border-gray-100 text-left text-gray-500 dark:border-white/5 dark:text-gray-400">
              {HEADERS.map((header) => (
                <th key={header} className="px-4 py-2 font-medium">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums text-gray-700 dark:text-gray-200">
            {rows.map((logement) => {
              const colors = getDpeColors(logement.dpe_energie ?? undefined);
              const surface = toNumber(logement.surface_habitable);
              return (
                <tr key={logement.id} className="border-b border-gray-100 last:border-0 dark:border-white/5">
                  <td className="px-4 py-2">{floorShort(logement.etage)}</td>
                  <td className="px-4 py-2">{piecesLabel(logement.nombre_pieces)}</td>
                  <td className="px-4 py-2">{surface ? `${surface.toLocaleString("fr-FR")} m²` : "—"}</td>
                  <td className="px-4 py-2">{logement.annee_construction ?? "—"}</td>
                  <td className="px-4 py-2">
                    {logement.dpe_energie ? (
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded font-bold ${colors.bg} ${colors.text}`}>{logement.dpe_energie}</span>
                    ) : "—"}
                  </td>
                  <td className="max-w-40 truncate px-4 py-2" title={logement.financement ?? undefined}>{logement.financement ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {group.logements.length > PREVIEW && (
        <button onClick={() => setExpanded(!expanded)} className="w-full border-t border-gray-100 py-2.5 text-xs font-medium text-emerald-700 dark:border-white/5 dark:text-emerald-400">
          {expanded ? "Réduire" : `Voir les ${group.logements.length} logements`}
        </button>
      )}
    </PanelCard>
  );
}
