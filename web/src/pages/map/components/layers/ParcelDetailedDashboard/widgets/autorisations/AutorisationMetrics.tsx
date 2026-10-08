import { quantity, type SourceRow } from "../shared/format";

export default function AutorisationMetrics({ row }: { row: SourceRow }) {
  const metrics = [
    [
      "Logements prévus",
      quantity(row.nb_lgt_tot_crees),
      "Nombre de logements nouveaux déclarés au dossier.",
    ],
    [
      "Surface d’habitation prévue",
      quantity(row.surf_hab_creee, " m²"),
      "Surface créée pour le logement, hors locaux d’activité.",
    ],
    [
      "Surface de locaux prévue",
      quantity(row.surf_loc_creee, " m²"),
      "Surface créée pour les activités : commerces, bureaux, etc.",
    ],
  ];
  return (
    <section className="mt-5" aria-label="Programme déclaré">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
        Ce que prévoit le dossier
      </h4>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Ces chiffres décrivent le projet déclaré, pas les travaux effectivement
        réalisés.
      </p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        {metrics.map(([label, value, explanation]) => (
          <div
            key={label}
            className="rounded-xl bg-gray-50 p-4 dark:bg-[#0A0A0A]"
          >
            <dt className="text-xs text-gray-600 dark:text-gray-300">
              {label}
            </dt>
            <dd className="mt-2 text-lg font-normal text-gray-900 dark:text-white">
              {value}
            </dd>
            <dd className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {explanation}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        « Non renseigné » signifie que la source ne fournit pas cette
        information ; 0 est une valeur déclarée.
      </p>
    </section>
  );
}
