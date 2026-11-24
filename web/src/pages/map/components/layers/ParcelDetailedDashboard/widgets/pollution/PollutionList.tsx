import { ExternalLink } from "lucide-react";

import PanelCard from "../shared/PanelCard";
import type { PollutionRow } from "./pollutionFormat";

type PollutionListProps = {
  title: string;
  subtitle: string;
  aside: string;
  rows: PollutionRow[];
  emptyText: string;
};

export default function PollutionList({ title, subtitle, aside, rows, emptyText }: PollutionListProps) {
  return (
    <PanelCard title={title} subtitle={subtitle} aside={aside}>
      {rows.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-gray-900 dark:text-white">{row.title}</p>
                {row.subtitle && <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">{row.subtitle}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs font-semibold tabular-nums text-gray-900 dark:text-white">{row.distance}</span>
                {row.link && (
                  <a href={row.link} target="_blank" rel="noreferrer" aria-label={`Fiche ${row.title}`} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PanelCard>
  );
}
