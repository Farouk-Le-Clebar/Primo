import { Card } from "@tremor/react";
import { Globe, Laptop, Smartphone } from "lucide-react";

export default function UserHabits({ stats }: { stats: any[] }) {
  const getMostFrequent = (arr: any[], key: string) => {
    if (!arr.length) return 'Inconnu';
    const counts = arr.reduce((acc, item) => {
      const val = item[key];
      if (val) acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'Inconnu';
  };

  const mainBrowser = getMostFrequent(stats, 'browser');
  const mainOs = getMostFrequent(stats, 'os');
  const mainDevice = getMostFrequent(stats, 'deviceType');
// dark:bg-[#111111]/20
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-4 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden flex items-center space-x-4">
        <div className="p-2 rounded-lg text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">Navigateur</p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{mainBrowser}</p>
        </div>
      </Card>
      
      <Card className="p-4 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl flex items-center space-x-4 ">
        <div className="p-2 rounded-lg text-teal-600 dark:text-teal-500 bg-teal-50 dark:bg-teal-500/10">
          <Laptop className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">Système (OS)</p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{mainOs}</p>
        </div>
      </Card>

      <Card className="p-4 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl flex items-center space-x-4 ">
        <div className="p-2 rounded-lg text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">Appareil</p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm capitalize">{mainDevice}</p>
        </div>
      </Card>
    </div>
  );
}