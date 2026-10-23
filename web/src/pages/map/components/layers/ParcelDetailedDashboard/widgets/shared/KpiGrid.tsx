import type { ReactNode } from "react";
import { Card, ProgressBar } from "@tremor/react";
import type { LucideIcon } from "lucide-react";

import { useRevealed } from "../../../../../../../hooks/useRevealed";

export type Kpi = {
  label: string;
  value: ReactNode;
  hint: string;
  icon: LucideIcon;
  tone: string;
  progress?: number | null;
  progressColor?: "emerald" | "amber" | "rose";
};

export default function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  const revealed = useRevealed();

  return (
    <div className="primo-stagger grid grid-cols-2 gap-4 xl:grid-cols-4">
      {kpis.map(({ label, value, hint, icon: Icon, tone, progress, progressColor = "amber" }) => (
        <Card
          key={label}
          className="flex flex-col justify-between gap-3 rounded-xl border-gray-200 px-4 py-3 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${tone}`}>
              <Icon size={16} />
            </span>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {value}
            </div>
            {progress != null && (
              <ProgressBar
                value={revealed ? progress : 0}
                color={progressColor}
                showAnimation
                className="mt-2"
              />
            )}
            <p className="mt-1.5 truncate text-xs text-gray-500 dark:text-gray-400">{hint}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
