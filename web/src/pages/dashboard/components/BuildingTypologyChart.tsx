import { BarChart } from '@tremor/react';
import { buildingTypes } from './dashboardData';

export default function BuildingTypologyChart() {
  return (
    <div className="h-full flex flex-col">
      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
        Nombre de bâtiments recensés · zone d'étude
      </p>
      <div className="flex-1 min-h-[180px]">
        <BarChart
          className="h-full"
          data={buildingTypes}
          index="name"
          categories={['count']}
          colors={['emerald']}
          layout="vertical"
          showLegend={false}
          showGridLines={true}
          valueFormatter={(value) => `${value}`}
        />
      </div>
    </div>
  );
}
