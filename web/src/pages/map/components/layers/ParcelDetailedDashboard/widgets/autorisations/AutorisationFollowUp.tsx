import { dateLabel, quantity, text, type SourceRow } from "../shared/format";

type Detail = { label: string; value: string };

const addressOf = (row: SourceRow): string =>
  [row.adr_num_ter, row.adr_libvoie_ter, row.adr_lieudit_ter, row.adr_codpost_ter, row.adr_localite_ter]
    .map((v) => text(v, ""))
    .filter(Boolean)
    .join(" ") || "Non renseignée";

const parcelsOf = (row: SourceRow): string =>
  [1, 2, 3]
    .flatMap((i) =>
      row[`sec_cadastre${i}`] && row[`num_cadastre${i}`]
        ? [`${text(row[`sec_cadastre${i}`])} ${text(row[`num_cadastre${i}`])}`]
        : [],
    )
    .join(" · ") || "Non renseignées";

export default function AutorisationFollowUp({ row }: { row: SourceRow }) {
  const groups: { title: string; details: Detail[] }[] = [
    {
      title: "Suivi du dossier",
      details: [
        { label: "Autorisation", value: dateLabel(row.date_reelle_autorisation) },
        { label: "Ouverture de chantier", value: dateLabel(row.date_reelle_doc) },
        { label: "Achèvement déclaré", value: dateLabel(row.date_reelle_daact) },
      ],
    },
    {
      title: "Terrain",
      details: [
        { label: "Surface déclarée", value: quantity(row.superficie_terrain, " m²") },
        { label: "Parcelles du dossier", value: parcelsOf(row) },
      ],
    },
    {
      title: "Adresse du projet",
      details: [{ label: "Peut différer du terrain sélectionné", value: addressOf(row) }],
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {groups.map(({ title, details }) => (
        <dl key={title} className="min-w-0">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</p>
          {details.map(({ label, value }) => (
            <div key={label} className="py-1">
              <dt className="text-[11px] text-gray-500 dark:text-gray-400">{label}</dt>
              <dd className="text-xs font-medium text-gray-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>
      ))}
      <p className="text-[11px] text-gray-500 sm:col-span-3 dark:text-gray-400">
        Une date manquante ne permet pas de conclure que les travaux n’ont pas commencé ou ne sont pas terminés.
      </p>
    </div>
  );
}
