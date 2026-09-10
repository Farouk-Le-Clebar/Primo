import type { ActivityItem } from './types';

const activityFeed: ActivityItem[] = [
  {
    id: '1',
    userInitials: 'JC',
    userColor: 'violet',
    message: 'Jacques a ajouté une nouvelle parcelle',
    tag: 'Maison de Campagne',
    timestamp: 'il y a 2 h',
  },
  {
    id: '2',
    userInitials: 'SM',
    userColor: 'emerald',
    message: 'Sophie a mis à jour le budget',
    tag: 'Loft Toulouse Centre',
    timestamp: 'il y a 5 h',
  },
  {
    id: '3',
    userInitials: 'FH',
    userColor: 'amber',
    message: 'Félix a validé le critère PLU',
    tag: 'Terrain Bordeaux Sud',
    timestamp: 'il y a 8 h',
  },
  {
    id: '4',
    userInitials: 'LR',
    userColor: 'sky',
    message: 'Léa a sauvegardé une recherche',
    tag: 'Zone UA — Lyon',
    timestamp: 'il y a 1 j',
  },
];

const avatarColorClasses: Record<ActivityItem['userColor'], string> = {
  violet: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  sky: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
};

export default function RecentActivity() {
  return (
    <ul className="h-full overflow-y-auto">
      {activityFeed.map((activity, index) => (
        <li key={activity.id} className="relative flex gap-3 pb-5 last:pb-0">
          {/* Ligne verticale reliant les avatars, comme sur la maquette */}
          {index !== activityFeed.length - 1 && (
            <span className="absolute left-4 top-8 -bottom-1 w-px bg-gray-200 dark:bg-white/10" />
          )}

          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 z-10 ${avatarColorClasses[activity.userColor]}`}
          >
            {activity.userInitials}
          </div>

          <div className="min-w-0">
            <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <span className="rounded-md bg-gray-100 dark:bg-white/5 px-1.5 py-0.5">{activity.tag}</span>
              <span>{activity.timestamp}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
