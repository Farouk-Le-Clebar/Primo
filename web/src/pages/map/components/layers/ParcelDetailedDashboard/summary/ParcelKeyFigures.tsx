import { Card } from "@tremor/react";

import type { KeyFigure } from "./useParcelSummary";

type ParcelKeyFiguresProps = { figures: KeyFigure[] };

export default function ParcelKeyFigures({ figures }: ParcelKeyFiguresProps) {
  return (
    <Card className="overflow-hidden rounded-xl border-gray-200 p-0 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
      <dl className="primo-stagger grid grid-cols-2 divide-gray-100 lg:grid-cols-4 lg:divide-x dark:divide-white/5">
        {figures.map(({ label, value, hint, loading }) => (
          <div key={label} className="min-w-0 px-5 py-4">
            <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-1.5">
              {loading ? (
                <span className="block h-7 w-20 animate-pulse rounded bg-gray-100 motion-reduce:animate-none dark:bg-white/10" />
              ) : (
                <span className="block truncate text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {value}
                </span>
              )}
              <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400">
                {hint}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
