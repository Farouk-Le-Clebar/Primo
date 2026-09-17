import { DonutChart } from '@tremor/react';
import type { UrbanZone } from './types';

const urbanZones: UrbanZone[] = [
  { name: 'Urbaine dense', code: 'UA', value: 34, color: 'violet' },
  { name: 'Urbaine', code: 'UB', value: 26, color: 'blue' },
  { name: 'À urbaniser', code: 'AU', value: 18, color: 'amber' },
  { name: 'Naturelle', code: 'N', value: 14, color: 'emerald' },
  { name: 'Agricole', code: 'A', value: 8, color: 'rose' },
];

const dotColorClasses: Record<string, string> = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
};

export default function UrbanZonesDonut() {
  return (
    <div className="h-full flex items-center gap-6">
      <div className="shrink-0">
        <DonutChart
          data={urbanZones}
          category="value"
          index="name"
          colors={urbanZones.map((zone) => zone.color)}
          showLabel={true}
          label="100%"
          valueFormatter={(value) => `${value}%`}
          className="h-40 w-40 font-bold"
        />
      </div>

      <ul className="flex-1 space-y-3">
        {urbanZones.map((zone) => (
          <li key={zone.code} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColorClasses[zone.color]}`} />
              <span className="text-gray-700 dark:text-gray-300">
                {zone.code} — {zone.name}
              </span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{zone.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
