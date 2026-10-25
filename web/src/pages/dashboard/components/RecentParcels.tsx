import { Badge } from '@tremor/react';
import { MapPin } from 'lucide-react';
import { recentParcels } from './dashboardData';

export default function RecentParcels() {
  return (
    <ul className="h-full divide-y divide-gray-200 dark:divide-white/10 overflow-y-auto">
      {recentParcels.map((parcel) => (
        <li key={parcel.id} className="flex items-center gap-3 py-3 first:pt-0">
          <div className="h-8 w-8 rounded-md bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {parcel.id}
              </span>
              <Badge size="xs" color="gray">
                {parcel.zoneCode}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{parcel.address}</p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{parcel.surface}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{parcel.updatedAt}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
