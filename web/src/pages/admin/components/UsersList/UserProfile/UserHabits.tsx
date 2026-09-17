import type { UserStatistic } from "../../../../../types/admin";
import { distribution } from "../../shared/statistics";
import { Card } from "@tremor/react";
import { Globe, Laptop, Smartphone } from "lucide-react";

export default function UserHabits({ stats }: { stats: UserStatistic[] }) {
  const mainBrowser =
    distribution(stats, "browser")[0]?.name || "Non renseigné";
  const mainOs = distribution(stats, "os")[0]?.name || "Non renseigné";
  const mainDevice =
    distribution(stats, "deviceType")[0]?.name || "Non renseigné";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-4 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden flex items-center space-x-4">
        <div className="p-2 rounded-lg text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">
            Navigateur le plus utilisé
          </p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {mainBrowser}
          </p>
        </div>
      </Card>

      <Card className="p-4 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl flex items-center space-x-4 ">
        <div className="p-2 rounded-lg text-teal-600 dark:text-teal-500 bg-teal-50 dark:bg-teal-500/10">
          <Laptop className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">
            Système le plus utilisé
          </p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {mainOs}
          </p>
        </div>
      </Card>

      <Card className="p-4 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl flex items-center space-x-4 ">
        <div className="p-2 rounded-lg text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-[#999999] font-medium">
            Appareil le plus utilisé
          </p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm capitalize">
            {mainDevice}
          </p>
        </div>
      </Card>
    </div>
  );
}
