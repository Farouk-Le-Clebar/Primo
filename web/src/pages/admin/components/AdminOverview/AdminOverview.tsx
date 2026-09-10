import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Card } from "@tremor/react";
import { Users, UserPlus, Activity } from "lucide-react";
import { getAllAdminUsers } from "../../../../requests/admin";
import { getAllStatistics } from "../../../../requests/statistics";
import type { UserStatistic } from "../../../../types/admin";
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";
import UserChart from "./UserChart";
import DistributionCard from "../shared/DistributionCard";
import {
  adminCardClass,
  dailySeries,
  distribution,
} from "../shared/statistics";

export default function AdminOverview() {
  const [days, setDays] = useState(30);
  const usersQuery = useQuery({
    queryKey: ["usersChart"],
    queryFn: getAllAdminUsers,
  });
  const statsQuery = useQuery<UserStatistic[]>({
    queryKey: ["adminStatistics"],
    queryFn: getAllStatistics,
  });
  const users = usersQuery.data || [];
  const stats = statsQuery.data || [];
  const recent = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - days + 1);
    const now = Date.now();
    return stats.filter(
      (stat) =>
        new Date(stat.connectedAt).getTime() >= start.getTime() &&
        new Date(stat.connectedAt).getTime() <= now,
    );
  }, [stats, days]);
  const latest = useMemo(() => {
    const byUser = new Map<string, UserStatistic>();
    for (const stat of recent) {
      const previous = byUser.get(stat.userId);
      if (
        !previous ||
        new Date(stat.connectedAt) > new Date(previous.connectedAt)
      )
        byUser.set(stat.userId, stat);
    }
    return [...byUser.values()];
  }, [recent]);
  if (usersQuery.isError || statsQuery.isError)
    return (
      <div role="alert" className="p-6 text-sm text-gray-500">
        Impossible de charger les statistiques.{" "}
        <button
          className="underline"
          onClick={() => {
            void usersQuery.refetch();
            void statsQuery.refetch();
          }}
        >
          Réessayer
        </button>
      </div>
    );
  if (usersQuery.isPending || statsQuery.isPending)
    return (
      <div className="flex justify-center py-24">
        <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
      </div>
    );
  const newUsers = dailySeries(
    users.map((user) => user.createdAt),
    days,
  ).reduce((sum, day) => sum + day.Total, 0);
  const metrics = [
    {
      label: "Utilisateurs inscrits",
      value: users.length,
      detail: "Tous les comptes de la plateforme",
      icon: Users,
    },
    {
      label: "Nouveaux utilisateurs",
      value: newUsers,
      detail: `Sur les ${days} derniers jours`,
      icon: UserPlus,
    },
    {
      label: "Utilisateurs actifs",
      value: latest.length,
      detail: "Au moins une activité enregistrée sur la période",
      icon: Activity,
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Une vue d’ensemble de votre communauté.
        </p>
        <select
          aria-label="Période des statistiques"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#171717] dark:text-white"
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
        >
          <option value={7}>7 derniers jours</option>
          <option value={30}>30 derniers jours</option>
          <option value={90}>90 derniers jours</option>
        </select>
      </div>
      <Card className={`${adminCardClass} overflow-hidden p-0`}>
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="divide-y divide-gray-100 border-b border-gray-100 dark:divide-white/5 dark:border-white/5 md:col-span-4 md:border-b-0 md:border-r">
            {metrics.map(({ label, value, detail, icon: Icon }) => (
              <div
                key={label}
                className="flex items-start justify-between gap-3 p-5 sm:px-6"
              >
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {value.toLocaleString("fr-FR")}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {detail}
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Icon size={18} />
                </span>
              </div>
            ))}
          </div>
          <div className="min-w-0 md:col-span-8">
            <UserChart users={users} days={days} />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DistributionCard
          title="Navigateurs"
          description="Utilisateurs actifs · dernier navigateur observé"
          data={distribution(latest, "browser")}
        />
        <DistributionCard
          title="Systèmes d’exploitation"
          description="Utilisateurs actifs · dernier système observé"
          data={distribution(latest, "os")}
        />
        <DistributionCard
          title="Localisation des utilisateurs"
          description="Dernier pays observé · localisation approximative par IP"
          data={distribution(latest, "country")}
        />
        <Card className={`${adminCardClass} p-5 sm:p-6`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Activité récente
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {recent.length.toLocaleString("fr-FR")} connexions enregistrées sur
            la période
          </p>
          <BarChart
            className="mt-5 h-48"
            data={dailySeries(
              recent.map((stat) => stat.connectedAt),
              days,
            )}
            index="date"
            categories={["Total"]}
            colors={["emerald"]}
            showLegend={false}
            allowDecimals={false}
            showAnimation={false}
          />
        </Card>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Activité : au maximum un enregistrement par heure et par utilisateur.
        Dates affichées dans votre fuseau horaire.
      </p>
    </div>
  );
}
