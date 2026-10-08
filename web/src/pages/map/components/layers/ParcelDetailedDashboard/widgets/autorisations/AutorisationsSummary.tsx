import { List, ListItem } from "@tremor/react";
import DataCard from "../shared/DataCard";
import { dateLabel, text } from "../shared/format";
import { types, type Dossier } from "./data";

export default function AutorisationsSummary({
  dossiers,
}: {
  dossiers: Dossier[];
}) {
  const versions = [
    ...new Set(
      dossiers.flatMap((d) => d.rows.map((r) => text(r.source_millesime))),
    ),
  ];
  const distribution = [...new Set(dossiers.map((d) => d.type))].map(
    (type) => ({
      name: types[type] || type,
      value: dossiers.filter((d) => d.type === type).length,
    }),
  );
  return (
    <DataCard
      title="Dossiers retrouvés"
      subtitle="Historique des projets déclarés, y compris les dossiers annulés"
    >
      <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        {dossiers.length}
      </p>
      <p className="mt-1 mb-6 text-xs text-gray-500">
        dossiers distincts · {dossiers.reduce((n, d) => n + d.rows.length, 0)}{" "}
        lignes sources
      </p>
      <List>
        {distribution.map((item) => (
          <ListItem key={item.name}>
            <span className="text-gray-700 dark:text-gray-200">
              {item.name}
            </span>
            <span className="font-normal text-gray-900 dark:text-white">
              {item.value}
            </span>
          </ListItem>
        ))}
      </List>
      <dl className="mt-6 space-y-3 text-sm text-gray-500">
        <div>
          <dt>Autorisation la plus récente</dt>
          <dd className="font-normal text-gray-900 dark:text-white">
            {dateLabel(dossiers[0]?.date)}
          </dd>
        </div>
        <div>
          <dt>Version des données (année-mois)</dt>
          <dd className="font-normal text-gray-900 dark:text-white">
            {versions.join(", ")}
          </dd>
        </div>
      </dl>
      <p className="mt-5 border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-500 dark:border-white/5">
        Le préfixe cadastral n’est pas fourni : les correspondances par commune,
        section et numéro restent à vérifier. Une autorisation ne garantit pas
        la réalisation des travaux. Les références peuvent avoir changé depuis
        le dépôt.
      </p>
    </DataCard>
  );
}
