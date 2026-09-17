import { BarChart, Card } from "@tremor/react";
import type { UserStatistic } from "../../../../../types/admin";
import { adminCardClass, dailySeries } from "../../shared/statistics";

export default function UserConnectionChart({
  stats,
}: {
  stats: UserStatistic[];
}) {
  const data = dailySeries(
    stats.map((stat) => stat.connectedAt),
    30,
  );
  return (
    <Card className={`${adminCardClass} h-full p-5 sm:p-6`}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        Activité de connexion
      </h2>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        30 derniers jours · {data.reduce((sum, day) => sum + day.Total, 0)}{" "}
        connexions enregistrées
      </p>
      <BarChart
        className="mt-6 h-48"
        data={data}
        index="date"
        categories={["Total"]}
        colors={["emerald"]}
        showLegend={false}
        allowDecimals={false}
        showAnimation={false}
      />
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Au maximum un enregistrement par heure. Dates dans votre fuseau horaire.
      </p>
    </Card>
  );
}
