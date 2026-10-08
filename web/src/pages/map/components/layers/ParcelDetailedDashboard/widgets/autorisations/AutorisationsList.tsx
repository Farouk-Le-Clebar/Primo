import { useState } from "react";
import DataCard from "../shared/DataCard";
import RecordPager from "../shared/RecordPager";
import AutorisationDetails from "./AutorisationDetails";
import { types, type Dossier } from "./data";

export default function AutorisationsList({
  dossiers,
}: {
  dossiers: Dossier[];
}) {
  const [type, setType] = useState("all");
  const [page, setPage] = useState(0);
  const filtered = dossiers.filter((d) => type === "all" || d.type === type);
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(filtered.length / 8) - 1),
  );
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-gray-500">
          {filtered.length} dossier(s)
        </span>
        <select
          aria-label="Type d’autorisation"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(0);
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#171717] dark:text-white"
        >
          <option value="all">Toutes les autorisations</option>
          {[...new Set(dossiers.map((d) => d.type))].map((t) => (
            <option key={t} value={t}>
              {types[t] || t}
            </option>
          ))}
        </select>
      </div>
      {filtered.slice(currentPage * 8, (currentPage + 1) * 8).map((d) => (
        <DataCard
          key={d.key}
          title={types[d.type] || d.type}
          subtitle={`Dossier ${d.numero}`}
        >
          {d.rows.length > 1 && (
            <p className="text-xs text-gray-500">
              {d.rows.length} lignes sources pour ce dossier, présentées
              séparément. Les surfaces ne sont pas additionnées.
            </p>
          )}
          {d.rows.map((row, i) => (
            <AutorisationDetails key={`${row.id ?? i}`} row={row} />
          ))}
        </DataCard>
      ))}
      <RecordPager
        page={currentPage}
        total={filtered.length}
        pageSize={8}
        onChange={setPage}
      />
    </>
  );
}
