import { AreaChart, BarChart } from "@tremor/react";
import BentoCard from "../../../map/components/layers/Dashboard/BentoCard";

type SeriesPoint = { date: string; Total: number };

type OverviewChartsProps = {
  days: number;
  signups: SeriesPoint[];
  activity: SeriesPoint[];
  connections: number;
};

const formatValue = (value: number): string => value.toLocaleString("fr-FR");

export default function OverviewCharts({ days, signups, activity, connections }: OverviewChartsProps) {
  return (
    <>
      <BentoCard className="@3xl:col-span-8" bodyClassName="h-80 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Évolution des inscriptions</h3>
        <p className="mt-0.5 mb-4 text-xs text-gray-500 dark:text-gray-500">Nouveaux comptes par jour · {days} derniers jours</p>
        <AreaChart
          className="min-h-0 flex-1"
          data={signups}
          index="date"
          categories={["Total"]}
          colors={["violet"]}
          showLegend={false}
          allowDecimals={false}
          curveType="natural"
          valueFormatter={formatValue}
        />
      </BentoCard>
      <BentoCard title="Activité récente" className="@3xl:col-span-4" bodyClassName="h-80 flex flex-col">
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-500">{formatValue(connections)} connexions sur la période</p>
        <BarChart
          className="min-h-0 flex-1"
          data={activity}
          index="date"
          categories={["Total"]}
          colors={["emerald"]}
          showLegend={false}
          allowDecimals={false}
          valueFormatter={formatValue}
        />
      </BentoCard>
    </>
  );
}
