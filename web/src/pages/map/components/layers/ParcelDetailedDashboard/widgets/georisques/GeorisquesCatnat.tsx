import { useState } from "react";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@tremor/react";
import DataCard from "../shared/DataCard";
import RecordPager from "../shared/RecordPager";
import { dateLabel, text, type SourceRow } from "../shared/format";

export default function GeorisquesCatnat({
  events,
}: {
  events: SourceRow[] | null;
}) {
  const [page, setPage] = useState(0);
  const total = events?.length || 0;
  const current = Math.min(page, Math.max(0, Math.ceil(total / 10) - 1));
  return (
    <DataCard
      title="Catastrophes naturelles"
      subtitle="Historique des reconnaissances à l’échelle de la commune, du plus récent au plus ancien."
    >
      {!events?.length ? (
        <p className="text-sm text-gray-500">
          {events === null
            ? "Historique indisponible."
            : "Aucun arrêté référencé dans la source."}
        </p>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Événement</TableHeaderCell>
                <TableHeaderCell>Période</TableHeaderCell>
                <TableHeaderCell>Publication au JO</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events
                .slice(current * 10, (current + 1) * 10)
                .map((event, i) => (
                  <TableRow key={`${text(event.id_gaspar, "")}-${i}`}>
                    <TableCell className="whitespace-normal min-w-48">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {text(event.lib_risque_jo)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {text(event.id_gaspar, "")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p>{dateLabel(event.date_debut)}</p>
                      <p className="text-xs text-gray-500">
                        au {dateLabel(event.date_fin)}
                      </p>
                    </TableCell>
                    <TableCell>
                      {dateLabel(event.date_publication_jo)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <RecordPager
            page={current}
            total={total}
            pageSize={10}
            onChange={setPage}
          />
        </>
      )}
    </DataCard>
  );
}
