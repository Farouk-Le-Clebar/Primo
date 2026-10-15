import { MapPin } from "lucide-react";
import { categories, states } from "./data";
import { text, validDate, type SourceRow } from "../shared/format";
import AutorisationBadge from "./AutorisationBadge";
import AutorisationMetrics from "./AutorisationMetrics";
import AutorisationFollowUp from "./AutorisationFollowUp";

const explanations: Record<string, string> = {
  "2": "Le dossier est indiqué comme autorisé. Cela ne confirme pas que les travaux ont été réalisés.",
  "4": "Ce dossier est indiqué comme annulé. Les chiffres ci-dessous décrivent le projet initial ; ils ne confirment aucune réalisation.",
  "5": "Un début de chantier est enregistré dans la source. L’état réel des travaux aujourd’hui n’est pas confirmé.",
  "6": "Un achèvement des travaux est enregistré dans la source.",
};

export default function AutorisationDetails({ row }: { row: SourceRow }) {
  const state = text(row.etat_autorisation, "");
  const authDate = validDate(row.date_reelle_autorisation);
  const future =
    authDate &&
    authDate >
      new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const address = [
    row.adr_num_ter,
    row.adr_libvoie_ter,
    row.adr_lieudit_ter,
    row.adr_codpost_ter,
    row.adr_localite_ter,
  ]
    .map((v) => text(v, ""))
    .filter(Boolean)
    .join(" ");
  return (
    <div className="mt-4 border-t border-gray-100 pt-5 dark:border-white/5">
      <div className="flex flex-wrap items-center gap-2">
        <AutorisationBadge tone={state === "4" ? "cancelled" : "neutral"}>
          {states[state] || "État non renseigné"}
        </AutorisationBadge>
        <AutorisationBadge>
          {categories[text(row.categorie_source)] || text(row.categorie_source)}
        </AutorisationBadge>
        {row.i_extension === true && (
          <AutorisationBadge tone="works">Extension</AutorisationBadge>
        )}
        {row.i_surelevation === true && (
          <AutorisationBadge tone="works">Surélévation</AutorisationBadge>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
        {explanations[state] ||
          "L’état d’avancement n’est pas renseigné dans la source."}
      </p>
      {(row.i_extension === true || row.i_surelevation === true) && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {row.i_extension === true &&
            "Extension : agrandissement d’un bâtiment existant. "}
          {row.i_surelevation === true &&
            "Surélévation : augmentation de la hauteur d’un bâtiment existant."}
        </p>
      )}
      <div className="mt-5 flex items-start gap-2 rounded-lg bg-gray-50 p-3 dark:bg-[#0A0A0A]">
        <MapPin
          size={16}
          className="mt-1 shrink-0 text-gray-400"
          aria-hidden="true"
        />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Adresse déclarée du projet
          </p>
          <p className="mt-1 text-sm font-normal text-gray-900 dark:text-white">
            {address || "Non renseignée"}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Adresse du dossier, qui peut différer de celle du terrain
            sélectionné.
          </p>
        </div>
      </div>
      <AutorisationMetrics row={row} />
      <AutorisationFollowUp row={row} />
      {future && (
        <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">
          Date d’autorisation future dans la source : à vérifier.
        </p>
      )}
    </div>
  );
}
