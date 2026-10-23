import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import MapPanel from "../Navbar/MapPanel";
import BentoCard from "./BentoCard";
import StatsCards from "../../../../dashboard/components/StatsCards";
import PriceEvolutionChart from "../../../../dashboard/components/PriceEvolutionChart";
import RecentActivity from "../../../../dashboard/components/RecentActivity";
import UrbanZonesDonut from "../../../../dashboard/components/UrbanZonesDonut";
import BuildingTypologyChart from "../../../../dashboard/components/BuildingTypologyChart";
import RecentParcels from "../../../../dashboard/components/RecentParcels";

type DashboardPanelProps = {
  id: string;
  onClose: () => void;
};

const TODAY = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

export default function DashboardPanel({ id, onClose }: DashboardPanelProps) {
  return (
    <MapPanel id={id} label="Vue d'ensemble" onClose={onClose}>
      <header className="primo-page-enter mx-auto flex w-full max-w-7xl shrink-0 items-center px-6 pt-6 pb-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">Vue d'ensemble</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-black/[0.03] px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400">
            <CalendarDaysIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <time className="inline-block first-letter:uppercase">{TODAY}</time>
          </span>
        </div>
      </header>
      <div className="scrollbar-glass @container min-h-0 flex-1 overflow-y-auto px-6 pt-3 pb-6">
        <div className="primo-stagger mx-auto grid max-w-7xl grid-cols-1 gap-4 @3xl:grid-cols-12">
          <div className="primo-stagger grid gap-4 @xl:grid-cols-3 @3xl:col-span-12">
            <StatsCards />
          </div>
          <BentoCard className="@3xl:col-span-8" bodyClassName="h-80">
            <PriceEvolutionChart />
          </BentoCard>
          <BentoCard title="Activité récente" className="@3xl:col-span-4" bodyClassName="h-80 overflow-y-auto">
            <RecentActivity />
          </BentoCard>
          <BentoCard title="Répartition des zones d'urbanisme" className="@3xl:col-span-6" bodyClassName="h-60">
            <UrbanZonesDonut />
          </BentoCard>
          <BentoCard title="Typologie des bâtiments (BD TOPO)" className="@3xl:col-span-6" bodyClassName="h-60">
            <BuildingTypologyChart />
          </BentoCard>
          <BentoCard title="Dernières parcelles ajoutées" className="@3xl:col-span-12">
            <RecentParcels />
          </BentoCard>
        </div>
      </div>
    </MapPanel>
  );
}
