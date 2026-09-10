import { MapPin, Bookmark, Wallet } from 'lucide-react';
import type { StatCardData } from './types';

const stats: StatCardData[] = [
  {
    label: 'Parcelles analysées',
    value: '137',
    delta: '+18 ce mois',
    deltaColor: 'violet',
    icon: 'parcels',
  },
  {
    label: 'Parcelles sauvegardées',
    value: '48',
    delta: '+6 cette semaine',
    deltaColor: 'emerald',
    icon: 'saved',
  },
  {
    label: 'Budget engagé',
    value: '2,4 M€',
    delta: 'sur 3,1 M€',
    deltaColor: 'amber',
    icon: 'budget',
  },
];

const iconMap: Record<StatCardData['icon'], typeof MapPin> = {
  parcels: MapPin,
  saved: Bookmark,
  budget: Wallet,
};

const colorClasses: Record<StatCardData['deltaColor'], { text: string; iconBg: string; iconText: string }> = {
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
          <div
            key={stat.label}
            className="h-24 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] px-4 py-3 flex flex-col justify-between "
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
          </div>
        );
      })}
    </>
  );
}
