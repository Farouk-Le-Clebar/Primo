import { useState } from "react";

import PanelCard from "../shared/PanelCard";
import RecordPager from "../shared/RecordPager";
import { dateLabel, text, type SourceRow } from "../shared/format";

const PAGE_SIZE = 8;

export default function GeorisquesCatnat({ events }: { events: SourceRow[] | null }) {
  const [page, setPage] = useState(0);
  const total = events?.length ?? 0;
  const current = Math.min(page, Math.max(0, Math.ceil(total / PAGE_SIZE) - 1));

  return (
    <PanelCard flush title="Arrêtés de catastrophe naturelle" subtitle="Reconnaissances à l’échelle de la commune, du plus récent au plus ancien">
      <div className="mt-3 border-t border-gray-100 dark:border-white/5">
        {!events?.length ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {events === null ? "Historique indisponible." : "Aucun arrêté référencé dans la source."}
          </p>
        ) : (
          <ul key={current} className="primo-stagger">
            {events.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE).map((event, i) => (
              <li key={`${text(event.id_gaspar, "")}-${i}`} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-0 dark:border-white/5">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">{text(event.lib_risque_jo)}</span>
                  <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                    Du {dateLabel(event.date_debut)} au {dateLabel(event.date_fin)}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-xs font-medium text-gray-900 dark:text-white">{dateLabel(event.date_publication_jo)}</span>
                  <span className="block text-[10px] text-gray-500 dark:text-gray-400">Publication JO</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="px-4 pb-4">
        <RecordPager page={current} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>
    </PanelCard>
  );
}
