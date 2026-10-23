import { BarList, Card } from "@tremor/react";

import { useRevealed } from "../../../../../../../hooks/useRevealed";
import type { DpeStats } from "./data";
import { getDpeColors } from "./utils";

const MAX_HEATING = 5;
const hideValue = () => "";

export default function DpeInsights({ stats }: { stats: DpeStats }) {
  const revealed = useRevealed();
  const heating = stats.heating
    .slice(0, MAX_HEATING)
    .map((share) => ({ ...share, value: revealed ? share.value : 0 }));

  return (
    <Card className="flex flex-col gap-5 rounded-xl border-gray-200 p-4 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
      <section>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Émissions GES</h3>
        <div className="grid grid-cols-7 gap-1">
          {stats.gesDistribution.map(({ label, count }) => (
            <div key={label} className="text-center" title={`Classe GES ${label} : ${count}`}>
              <div className={`rounded py-1 text-xs font-bold ${getDpeColors(label).bg} ${getDpeColors(label).text} ${count ? "" : "opacity-25"}`}>
                {label}
              </div>
              <span className="mt-1 block text-[11px] text-gray-500 dark:text-gray-400">{count || "·"}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Énergie de chauffage</h3>
        <BarList
          data={heating}
          color="amber"
          showAnimation
          valueFormatter={revealed ? String : hideValue}
          className="text-xs"
        />
      </section>
      <section className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-4 dark:border-white/5">
        {stats.buildingTypes.map(({ name, value }) => (
          <span key={name} className="rounded-md bg-gray-50 px-2 py-1 text-xs capitalize text-gray-600 dark:bg-white/5 dark:text-gray-300">
            {name} · <span className="font-medium text-gray-900 dark:text-white">{value}</span>
          </span>
        ))}
        {stats.expired > 0 && (
          <span className="rounded-md bg-rose-50 px-2 py-1 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
            {stats.expired} diagnostic{stats.expired > 1 ? "s" : ""} expiré{stats.expired > 1 ? "s" : ""}
          </span>
        )}
      </section>
    </Card>
  );
}
