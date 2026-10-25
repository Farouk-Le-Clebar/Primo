import { AreaChart } from '@tremor/react';
import { priceHistory } from './dashboardData';

const valueFormatter = (value: number) => `${new Intl.NumberFormat('fr-FR').format(value)} €`;

export default function PriceEvolutionChart() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Évolution du prix de l'immobilier (DVF)
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
          Prix médian €/m² · Île-de-France
        </p>
      </div>

      <div className="flex-1 min-h-[220px]">
        <AreaChart
          className="h-full"
          data={priceHistory}
          index="year"
          categories={['Appartements', 'Maisons']}
          colors={['violet', 'emerald']}
          valueFormatter={valueFormatter}
          showLegend={true}
          showGridLines={true}
          curveType="natural"
          yAxisWidth={56}
        />
      </div>
    </div>
  );
}
