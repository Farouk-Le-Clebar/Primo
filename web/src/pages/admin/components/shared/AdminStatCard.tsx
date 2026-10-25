import { Card } from "@tremor/react";
import type { LucideIcon } from "lucide-react";
import { colorClasses } from "../../../dashboard/components/StatsCards";

type AdminStatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  color: keyof typeof colorClasses;
};

export default function AdminStatCard({ label, value, detail, icon: Icon, color }: AdminStatCardProps) {
  const colors = colorClasses[color];

  return (
    <Card className="flex h-24 flex-col justify-between rounded-xl border-gray-200 px-4 py-3 shadow-sm ring-0 dark:border-white/10">
      <div className="flex items-start justify-between gap-3">
        <span className="truncate text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${colors.iconBg}`}>
          <Icon className={`h-4 w-4 ${colors.iconText}`} strokeWidth={2} />
        </div>
      </div>
      <div className="min-w-0">
        <span className="block truncate text-2xl font-semibold text-gray-900 tabular-nums dark:text-white">{value}</span>
        <p className={`truncate text-xs font-medium ${colors.text}`}>{detail}</p>
      </div>
    </Card>
  );
}
