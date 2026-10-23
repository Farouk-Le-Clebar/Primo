import { useRevealed } from "../../../../../../../hooks/useRevealed";
import { dateLabel } from "../../widgets/shared/format";
import { getDpeColors } from "../../widgets/dpe/utils";
import type { summarizeDpe } from "../summaryData";

type DpeBodyProps = { dpe: ReturnType<typeof summarizeDpe> };

const MIN_BAR = 6;

export default function DpeBody({ dpe }: DpeBodyProps) {
  const revealed = useRevealed();
  const max = Math.max(1, ...dpe.distribution.map((d) => d.count));

  return (
    <>
      <div className="flex items-center gap-3">
        {dpe.dominant.map((label) => (
          <span
            key={label}
            className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl font-bold ${getDpeColors(label).bg} ${getDpeColors(label).text}`}
          >
            {label}
          </span>
        ))}
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Classe{dpe.dominant.length > 1 ? "s" : ""} la plus fréquente
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {dpe.count} diagnostic{dpe.count > 1 ? "s" : ""} · dernier le {dateLabel(dpe.lastDate)}
          </p>
        </div>
      </div>
      <div
        className="mt-auto flex h-24 items-end gap-1.5 pt-5"
        aria-label="Répartition des diagnostics par classe énergétique"
      >
        {dpe.distribution.map(({ label, count }) => (
          <div key={label} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`Classe ${label} : ${count}`}>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{count || ""}</span>
            <div
              className={`w-full rounded-t transition-[height] duration-700 ease-out motion-reduce:transition-none ${getDpeColors(label).bg} ${count ? "" : "opacity-25"}`}
              style={{ height: revealed ? `${Math.max(MIN_BAR, (count / max) * 100)}%` : "0%" }}
            />
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
