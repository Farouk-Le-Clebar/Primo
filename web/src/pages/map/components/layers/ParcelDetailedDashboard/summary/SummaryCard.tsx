import type { ReactNode } from "react";
import { Card } from "@tremor/react";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { QueryState } from "./useSummaryQueries";

type SummaryCardProps = QueryState & {
  title: string;
  source: string;
  icon: LucideIcon;
  tone: string;
  missing: boolean;
  empty: string;
  onOpen: () => void;
  children: ReactNode;
};

export default function SummaryCard({
  title,
  source,
  icon: Icon,
  tone,
  loading,
  error,
  retry,
  missing,
  empty,
  onOpen,
  children,
}: SummaryCardProps) {
  return (
    <Card className="group flex min-w-0 flex-col rounded-xl border-gray-200 p-0 shadow-sm ring-0 transition-shadow duration-200 hover:shadow-md dark:border-white/10 dark:bg-[#171717]">
      <button
        onClick={onOpen}
        aria-label={`Voir les détails : ${title}`}
        className="flex items-center justify-between gap-3 rounded-t-xl border-b border-gray-100 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-emerald-600 dark:border-white/5"
      >
        <span className="flex items-center gap-3">
          <span className={`flex h-8 w-8 items-center justify-center rounded-md ${tone}`}>
            <Icon size={16} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              {source}
            </span>
          </span>
        </span>
        <ArrowUpRight
          size={16}
          className="text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
        />
      </button>
      <div className="flex min-h-52 flex-1 flex-col p-5" aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div role="status" className="space-y-4">
            <span className="sr-only">Chargement : {title}</span>
            <div className="h-8 w-28 animate-pulse rounded bg-gray-100 motion-reduce:animate-none dark:bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 motion-reduce:animate-none dark:bg-white/10" />
            <div className="h-14 animate-pulse rounded bg-gray-50 motion-reduce:animate-none dark:bg-white/5" />
          </div>
        ) : error ? (
          <div className="my-auto text-sm text-gray-500 dark:text-gray-400">
            Les données ne sont pas disponibles pour le moment.
            <button
              onClick={retry}
              className="mt-3 block font-medium text-emerald-700 underline dark:text-emerald-400"
            >
              Réessayer
            </button>
          </div>
        ) : missing ? (
          <div className="my-auto">
            <p className="text-2xl font-semibold text-gray-300 dark:text-gray-600">—</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{empty}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
