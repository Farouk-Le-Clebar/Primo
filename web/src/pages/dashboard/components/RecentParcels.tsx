import { Badge } from '@tremor/react';
import { MapPin } from 'lucide-react';
import type { ParcelItem } from './types';

const recentParcels: ParcelItem[] = [
  {
    id: '75001000AC0023',
    zoneCode: 'UA3',
    address: '14 Rue des Lilas, 75020 Paris',
    surface: '420 m²',
    updatedAt: 'il y a 2 h',
  },
  {
    id: '31555000BH0114',
    zoneCode: 'UB1',
    address: 'Bd de la Marquette, Toulouse',
    surface: '1 240 m²',
    updatedAt: 'il y a 5 h',
  },
  {
    id: '69123000CD0042',
    zoneCode: 'AU2',
    address: 'Chemin des Vignes, Lyon',
    surface: '860 m²',
    updatedAt: 'il y a 1 j',
  },
  {
    id: '33063000EF0087',
    zoneCode: 'UA1',
    address: 'Cours Victor Hugo, Bordeaux',
    surface: '310 m²',
    updatedAt: 'il y a 2 j',
  },
];

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
