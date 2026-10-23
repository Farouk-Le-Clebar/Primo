import { Activity, UserPlus, Users } from "lucide-react";
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";
import { useAdminOverview } from "../../../../hooks/useAdminOverview";
import AdminStatCard from "../shared/AdminStatCard";
import DistributionCard from "../shared/DistributionCard";
import { distribution } from "../shared/statistics";
import OverviewCharts from "./OverviewCharts";

const PERIODS = [7, 30, 90];

export default function AdminOverview() {
  const overview = useAdminOverview();
  const formatCount = (value: number): string => value.toLocaleString("fr-FR");

  if (overview.isError)
    return (
      <div role="alert" className="text-sm text-gray-500">
        Impossible de charger les statistiques.{" "}
        <button className="underline cursor-pointer" onClick={overview.retry}>Réessayer</button>
      </div>
    );

  if (overview.isPending)
    return (
      <div className="flex justify-center py-24">
        <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="primo-page-enter flex justify-end">
        <select
          aria-label="Période des statistiques"
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm dark:border-white/10 dark:bg-[#171717] dark:text-white"
          value={overview.days}
          onChange={(event) => overview.setDays(Number(event.target.value))}
        >
          {PERIODS.map((period) => (
            <option key={period} value={period}>{period} derniers jours</option>
          ))}
        </select>
      </div>
      <div className="primo-stagger grid grid-cols-1 gap-4 @3xl:grid-cols-12">
        <div className="primo-stagger grid gap-4 @xl:grid-cols-3 @3xl:col-span-12">
          <AdminStatCard label="Utilisateurs inscrits" value={formatCount(overview.users.length)} detail="Tous les comptes" icon={Users} color="violet" />
          <AdminStatCard label="Nouveaux utilisateurs" value={formatCount(overview.newUsers)} detail={`Sur ${overview.days} jours`} icon={UserPlus} color="emerald" />
          <AdminStatCard label="Utilisateurs actifs" value={formatCount(overview.latest.length)} detail="Au moins une connexion" icon={Activity} color="amber" />
        </div>
        <OverviewCharts days={overview.days} signups={overview.signups} activity={overview.activity} connections={overview.recent.length} />
        <DistributionCard className="@3xl:col-span-4" title="Navigateurs" description="Dernier navigateur observé" data={distribution(overview.latest, "browser")} color="violet" />
        <DistributionCard className="@3xl:col-span-4" title="Systèmes d'exploitation" description="Dernier système observé" data={distribution(overview.latest, "os")} color="emerald" />
        <DistributionCard className="@3xl:col-span-4" title="Localisation" description="Dernier pays observé · approximatif par IP" data={distribution(overview.latest, "country")} color="amber" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Activité : au maximum un enregistrement par heure et par utilisateur. Dates affichées dans votre fuseau horaire.
      </p>
    </div>
  );
}
