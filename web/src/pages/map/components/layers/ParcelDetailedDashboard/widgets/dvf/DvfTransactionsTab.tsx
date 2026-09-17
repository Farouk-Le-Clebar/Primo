import { Card, Table, TableBody, TableRow, TableCell } from "@tremor/react";
import { Calendar } from "lucide-react";
import type { DvfRecord } from "./data";
import { formatCurrency, formatDate } from "./utils";

export default function DvfTransactionsTab({
  transactions,
}: {
  transactions: DvfRecord[];
}) {
  return (
    <Card className="h-fit flex-none rounded-xl p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm overflow-hidden font-inter">
      <div className="p-5 border-b border-gray-100 dark:border-white/5">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Historique DVF
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Du plus récent au plus ancien · surfaces bâties et terrains distingués
        </p>
      </div>
      {!transactions.length ? (
        <p className="p-6 text-sm text-gray-500">
          Aucun enregistrement pour ce filtre.
        </p>
      ) : (
        <Table>
          <TableBody>
            {transactions.map((t) => (
              <TableRow
                key={t.key}
                className="border-b border-gray-100 dark:border-white/5 last:border-0"
              >
                <TableCell className="py-5 pl-5 align-top">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    {formatDate(t.date_mutation)}
                  </span>
                </TableCell>
                <TableCell className="py-5 whitespace-normal min-w-56">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(t.valeur_fonciere)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t.nature_mutation}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{t.type_local || "Type non renseigné"}</span>
                    <span>
                      {t.surface_reelle_bati !== null
                        ? `${t.surface_reelle_bati.toLocaleString("fr-FR")} m² bâtis`
                        : "Surface bâtie non renseignée"}
                    </span>
                    {t.surface_terrain !== null && (
                      <span>
                        {t.surface_terrain.toLocaleString("fr-FR")} m² de
                        terrain
                      </span>
                    )}
                  </div>
                  {t.occurrences > 1 && (
                    <p className="mt-2 text-xs text-gray-500">
                      {t.occurrences} lignes aux caractéristiques identiques
                      regroupées
                    </p>
                  )}
                  {t.ambiguous && (
                    <p className="mt-1 text-xs text-gray-500">
                      Plusieurs lignes pour cette date et ce montant · ratio
                      écarté
                    </p>
                  )}
                </TableCell>
                <TableCell className="py-5 pr-5 text-right align-top">
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {t.priceM2 !== null
                      ? `${formatCurrency(t.priceM2)}/m²`
                      : "—"}
                  </span>
                  {t.priceM2 !== null && (
                    <p className="mt-1 text-[10px] text-gray-500">Indicatif</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
