import { Accordion, AccordionBody, AccordionHeader } from "@tremor/react";
import { dateLabel, quantity, text, type SourceRow } from "../shared/format";

export default function AutorisationFollowUp({ row }: { row: SourceRow }) {
  const dates = [
    [
      "Autorisation initiale",
      row.date_reelle_autorisation,
      "Date d’autorisation enregistrée, même si le dossier a ensuite été annulé.",
    ],
    [
      "Début des travaux déclaré",
      row.date_reelle_doc,
      "Date d’ouverture du chantier communiquée dans la source.",
    ],
    [
      "Fin des travaux déclarée",
      row.date_reelle_daact,
      "Date de déclaration d’achèvement disponible dans la source.",
    ],
  ];
  const parcelles = [1, 2, 3].flatMap((i) =>
    row[`sec_cadastre${i}`] && row[`num_cadastre${i}`]
      ? [
          `Section ${text(row[`sec_cadastre${i}`])} · parcelle ${text(row[`num_cadastre${i}`])}`,
        ]
      : [],
  );
  return (
    <div className="mt-5 space-y-2">
      <Accordion className="rounded-xl border-gray-200 shadow-none dark:border-white/10">
        <AccordionHeader className="text-sm font-normal text-gray-900 dark:text-white">
          Dates et suivi du dossier
        </AccordionHeader>
        <AccordionBody>
          <ol className="space-y-4">
            {dates.map(([label, value, explanation]) => (
              <li
                key={String(label)}
                className="border-l-2 border-gray-200 pl-4 dark:border-white/10"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {String(label)}
                </p>
                <p className="mt-1 text-sm font-normal text-gray-900 dark:text-white">
                  {dateLabel(value)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {String(explanation)}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Une date manquante ne permet pas de conclure que les travaux n’ont
            pas commencé ou ne sont pas terminés.
          </p>
        </AccordionBody>
      </Accordion>
      <Accordion className="rounded-xl border-gray-200 shadow-none dark:border-white/10">
        <AccordionHeader className="text-sm font-normal text-gray-900 dark:text-white">
          Terrain et références cadastrales
        </AccordionHeader>
        <AccordionBody>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">
                Surface du terrain déclarée au dossier
              </dt>
              <dd className="mt-1 font-normal text-gray-900 dark:text-white">
                {quantity(row.superficie_terrain, " m²")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400">
                Parcelles mentionnées dans le dossier
              </dt>
              <dd className="mt-1 font-normal text-gray-900 dark:text-white">
                {parcelles.join(" ; ") || "Non renseignées"}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Le terrain du dossier peut couvrir plusieurs parcelles. Sa surface
            n’est donc pas nécessairement celle de la parcelle sélectionnée. Le
            préfixe cadastral manque dans la source : le rattachement reste à
            vérifier.
          </p>
        </AccordionBody>
      </Accordion>
    </div>
  );
}
