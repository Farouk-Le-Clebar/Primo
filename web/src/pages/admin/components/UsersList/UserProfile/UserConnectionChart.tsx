import { BarChart } from "@tremor/react";
import type { UserStatistic } from "../../../../../types/admin";
import BentoCard from "../../../../map/components/layers/Dashboard/BentoCard";
import { dailySeries } from "../../shared/statistics";

export default function UserConnectionChart({ stats }: { stats: UserStatistic[] }) {
  const data = dailySeries(stats.map((stat) => stat.connectedAt), 30);
  const total = data.reduce((sum, day) => sum + day.Total, 0);

  return (
    <BentoCard title="Activité de connexion" className="@3xl:col-span-8" bodyClassName="h-80 flex flex-col">
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-500">30 derniers jours · {total} connexions enregistrées</p>
      <BarChart
        className="min-h-0 flex-1"
        data={data}
        index="date"
        categories={["Total"]}
        colors={["emerald"]}
        showLegend={false}
        allowDecimals={false}
      />
    </BentoCard>
  );
}
