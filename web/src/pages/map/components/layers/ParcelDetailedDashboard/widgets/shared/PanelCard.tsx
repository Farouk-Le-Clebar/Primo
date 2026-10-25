import type { ReactNode } from "react";
import { Card } from "@tremor/react";

type PanelCardProps = {
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  flush?: boolean;
  className?: string;
  children: ReactNode;
};

export default function PanelCard({ title, subtitle, aside, flush = false, className = "", children }: PanelCardProps) {
  return (
    <Card
      className={`rounded-xl border-gray-200 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717] ${flush ? "overflow-hidden p-0" : "p-4"} ${className}`}
    >
      <div className={`flex items-baseline justify-between gap-3 ${flush ? "px-4 pt-4" : "mb-4"}`}>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        {aside && <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{aside}</span>}
      </div>
      {children}
    </Card>
  );
}
