import { quantity, type SourceRow } from "../shared/format";

export default function AutorisationMetrics({ row }: { row: SourceRow }) {
  const metrics = [
    { label: "Logements prévus", value: quantity(row.nb_lgt_tot_crees) },
    { label: "Surface d’habitation", value: quantity(row.surf_hab_creee, " m²") },
    { label: "Surface de locaux", value: quantity(row.surf_loc_creee, " m²") },
  ];

  return (
    <section aria-label="Programme déclaré">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Programme déclaré
      </p>
      <dl className="grid grid-cols-3 divide-x divide-gray-100 rounded-lg border border-gray-100 bg-white dark:divide-white/5 dark:border-white/5 dark:bg-[#171717]">
        {metrics.map(({ label, value }) => (
          <div key={label} className="min-w-0 px-3 py-2.5">
            <dt className="truncate text-[11px] text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
        Projet déclaré, pas travaux réalisés. « Non renseigné » : absent de la source ; 0 est une valeur déclarée.
      </p>
    </section>
  );
}
