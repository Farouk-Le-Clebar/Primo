import { AreaChart } from "@tremor/react";
import type { UserType } from "../../../../types/admin";
import { dailySeries } from "../shared/statistics";

export default function UserChart({
  users,
  days,
}: {
  users: UserType[];
  days: number;
}) {
  return (
    <div className="min-w-0 p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Évolution des inscriptions
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Nouveaux comptes par jour · {days} derniers jours
      </p>
      <AreaChart
        className="mt-6 h-64"
        data={dailySeries(
          users.map((user) => user.createdAt),
          days,
        )}
        index="date"
        categories={["Total"]}
        colors={["emerald"]}
        showLegend={false}
        allowDecimals={false}
        showAnimation={false}
        valueFormatter={(value) => value.toLocaleString("fr-FR")}
      />
    </div>
  );
}
