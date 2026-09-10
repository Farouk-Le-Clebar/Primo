import { AreaChart } from '@tremor/react';
import type { PricePoint } from './types';

const priceHistory: PricePoint[] = [
  { year: '2019', Appartements: 4350, Maisons: 2980 },
  { year: '2020', Appartements: 4420, Maisons: 3080 },
  { year: '2021', Appartements: 4780, Maisons: 3320 },
  { year: '2022', Appartements: 5020, Maisons: 3560 },
  { year: '2023', Appartements: 4880, Maisons: 3610 },
  { year: '2024', Appartements: 5150, Maisons: 3780 },
  { year: '2025', Appartements: 5420, Maisons: 3950 },
];

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
