import { Card } from '@tremor/react';
import { MapPin, Bookmark, Wallet } from 'lucide-react';
import type { StatCardData } from './types';
import { stats } from './dashboardData';

const iconMap: Record<StatCardData['icon'], typeof MapPin> = {
  parcels: MapPin,
  saved: Bookmark,
  budget: Wallet,
};

export const colorClasses: Record<StatCardData['deltaColor'], { text: string; iconBg: string; iconText: string }> = {
  violet: {
    text: 'text-violet-500 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-500/10',
    iconText: 'text-violet-600 dark:text-violet-400',
  },
  emerald: {
    text: 'text-emerald-500 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/10',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    text: 'text-amber-500 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-500/10',
    iconText: 'text-amber-600 dark:text-amber-400',
  },
};

export default function StatsCards() {
  return (
    <>
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        const colors = colorClasses[stat.deltaColor];

        return (
          <Card
            key={stat.label}
            className="flex h-24 flex-col justify-between rounded-xl border-gray-200 px-4 py-3 shadow-sm ring-0 dark:border-white/10"
          >
            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
              <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                <Icon className={`h-4 w-4 ${colors.iconText}`} strokeWidth={2} />
              </div>
            </div>

              <div>
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</span>
                <p className={`text-xs font-medium ${colors.text}`}>{stat.delta}</p>
              </div>
          </Card>
        );
      })}
    </>
  );
}
