import { BarList } from "@tremor/react";

import { useRevealed } from "../../../../../../../hooks/useRevealed";
import { dateLabel } from "../../widgets/shared/format";
import type { summarizePermits } from "../summaryData";

type PermitsBodyProps = { permits: ReturnType<typeof summarizePermits> };

const hideValue = () => "";

export default function PermitsBody({ permits }: PermitsBodyProps) {
  const revealed = useRevealed();
  const data = permits.types.map((type) => ({ ...type, value: revealed ? type.value : 0 }));

  return (
    <>
      <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {permits.count}
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          dossier{permits.count > 1 ? "s" : ""} d’urbanisme
        </span>
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Dernier : {permits.latestType} · {dateLabel(permits.latestDate)}
      </p>
      <BarList
        data={data}
        color="indigo"
        showAnimation
        valueFormatter={revealed ? String : hideValue}
        className="mt-auto pt-4 text-xs"
      />
    </>
  );
}
