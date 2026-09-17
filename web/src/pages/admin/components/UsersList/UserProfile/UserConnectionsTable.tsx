import { useState } from "react";
import type { UserStatistic } from "../../../../../types/admin";
import { formatDate } from "../../shared/statistics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Card,
} from "@tremor/react";

export default function UserConnectionsTable({
  stats,
}: {
  stats: UserStatistic[];
}) {
  const [page, setPage] = useState(0);
  const sorted = [...stats].sort(
    (a, b) =>
      new Date(b.connectedAt).getTime() - new Date(a.connectedAt).getTime(),
  );
  const pages = Math.max(1, Math.ceil(stats.length / 10));
  const currentPage = Math.min(page, pages - 1);
  return (
    <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden dark:bg-[#111111]/40">
      <div className="border-b border-gray-100 p-5 dark:border-white/5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Historique des connexions
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          {stats.length} enregistrements · du plus récent au plus ancien
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">
                Date
              </TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">
                Adresse IP
              </TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">
                Localisation
              </TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">
                Navigateur
              </TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">
                OS
              </TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold">
                Appareil
              </TableHeaderCell>
              <TableHeaderCell className="text-gray-900 dark:text-white font-semibold text-right">
                Langue
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted
              .slice(currentPage * 10, currentPage * 10 + 10)
              .map((stat, index) => (
                <TableRow
                  key={stat.id || index}
                  className="even:bg-gray-50 even:dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {formatDate(stat.connectedAt)}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {stat.ipAddress || "Inconnue"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {stat.city && stat.country
                      ? `${stat.city}, ${stat.country}`
                      : stat.country || "Inconnue"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {stat.browser || "Inconnu"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {stat.os || "Inconnu"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 capitalize">
                    {stat.deviceType || "Non renseigné"}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 text-right">
                    {stat.language || "N/A"}
                  </TableCell>
                </TableRow>
              ))}

            {stats.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500 dark:text-[#999999] italic"
                >
                  Aucun historique de connexion trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 p-4 text-sm text-gray-500 dark:border-white/5">
          <button
            className="rounded-lg px-3 py-2 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-white/5"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            Précédent
          </button>
          <span>
            Page {currentPage + 1} sur {pages}
          </span>
          <button
            className="rounded-lg px-3 py-2 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-white/5"
            disabled={currentPage === pages - 1}
            onClick={() => setPage(currentPage + 1)}
          >
            Suivant
          </button>
        </div>
      )}
    </Card>
  );
}
