import { BarList, Card } from "@tremor/react";

import { useRevealed } from "../../../../../../../hooks/useRevealed";
import type { UsageShare } from "./stats";

type BuildingUsagesProps = {
  usages: UsageShare[];
  total: number;
};

const formatShare = (total: number) => (value: number) =>
  `${value} · ${Math.round((value / Math.max(total, 1)) * 100)} %`;
const hideValue = () => "";

export function BuildingUsages({ usages, total }: BuildingUsagesProps) {
  const revealed = useRevealed();
  const data = usages.map((usage) => ({
    ...usage,
    value: revealed ? usage.value : 0,
  }));

  return (
    <Card className="rounded-xl border-gray-200 p-4 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Usages principaux
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {total} bâtiment{total > 1 ? "s" : ""}
        </span>
      </div>
      <BarList
        data={data}
        color="emerald"
        showAnimation
        valueFormatter={revealed ? formatShare(total) : hideValue}
        className="text-xs"
      />
    </Card>
  );
}
