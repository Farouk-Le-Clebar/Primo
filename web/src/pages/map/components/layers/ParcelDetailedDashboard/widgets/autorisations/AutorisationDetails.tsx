import { text, validDate, type SourceRow } from "../shared/format";
import { TONES } from "../shared/tones";
import AutorisationFollowUp from "./AutorisationFollowUp";
import AutorisationMetrics from "./AutorisationMetrics";
import { categories } from "./data";

const EXPLANATIONS: Record<string, string> = {
  "2": "Le dossier est indiqué comme autorisé. Cela ne confirme pas que les travaux ont été réalisés.",
  "4": "Dossier annulé : les chiffres décrivent le projet initial et ne confirment aucune réalisation.",
  "5": "Un début de chantier est enregistré. L’état réel des travaux aujourd’hui n’est pas confirmé.",
  "6": "Un achèvement des travaux est enregistré dans la source.",
};

const today = (): string => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });

export default function AutorisationDetails({ row }: { row: SourceRow }) {
  const state = text(row.etat_autorisation, "");
  const authDate = validDate(row.date_reelle_autorisation);
  const tags = [
    categories[text(row.categorie_source, "")] || text(row.categorie_source, ""),
    row.i_extension === true ? "Extension" : "",
    row.i_surelevation === true ? "Surélévation" : "",
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${tag === tags[0] ? TONES.gray : TONES.violet}`}>
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
          {EXPLANATIONS[state] || "L’état d’avancement n’est pas renseigné dans la source."}
        </p>
        {authDate && authDate > today() && (
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
            Date d’autorisation future dans la source : à vérifier.
          </p>
        )}
      </div>
      <AutorisationMetrics row={row} />
      <AutorisationFollowUp row={row} />
    </div>
  );
}
