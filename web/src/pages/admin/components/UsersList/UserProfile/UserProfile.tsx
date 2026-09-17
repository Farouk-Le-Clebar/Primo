import type { UserType, UserStatistic } from "../../../../../types/admin";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import LoadingPrimoLogo from "../../../../../components/animations/LoadingPrimoLogo";
import { getUserById } from "../../../../../requests/admin";
import { getUserStatistics } from "../../../../../requests/statistics";

import UserProfileHeader from "./UserProfileHeader";
import UserHabits from "./UserHabits";
import UserConnectionChart from "./UserConnectionChart";
import UserPeakHour from "./UserPeakHour";
import UserConnectionsTable from "./UserConnectionsTable";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();

  const {
    data: user,
    isPending: isUserPending,
    isError: userError,
    refetch: retryUser,
  } = useQuery<UserType>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  const {
    data: stats = [],
    isPending: isStatsPending,
    isError: statsError,
    refetch: retryStats,
  } = useQuery<UserStatistic[]>({
    queryKey: ["userStats", id],
    queryFn: () => getUserStatistics(id as string),
    enabled: !!id,
  });

  if (userError)
    return (
      <div role="alert" className="p-6 text-sm text-gray-500">
        Impossible de charger cet utilisateur.{" "}
        <button className="underline" onClick={() => void retryUser()}>
          Réessayer
        </button>
      </div>
    );

  if (isUserPending) {
    return (
      <div className="flex items-center justify-center w-full min-h-[600px] bg-transparent dark:bg-[#0A0A0A]">
        <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full h-full bg-transparent dark:bg-[#0A0A0A] p-4 sm:p-6 font-inter overflow-y-auto scrollbar-custom">
      <main>
        <UserProfileHeader user={user} />

        {statsError ? (
          <div role="alert" className="mt-6 text-sm text-gray-500">
            L’historique est indisponible.{" "}
            <button className="underline" onClick={() => void retryStats()}>
              Réessayer
            </button>
          </div>
        ) : isStatsPending ? (
          <div className="flex justify-center py-12">
            <LoadingPrimoLogo className="h-8 w-8 dark:invert" />
          </div>
        ) : (
          <>
            <div className="mt-6">
              <UserHabits stats={stats} />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <UserConnectionChart stats={stats} />
              </div>
              <div className="md:col-span-4">
                <UserPeakHour stats={stats} />
              </div>
            </div>
            <div className="mt-6">
              <UserConnectionsTable stats={stats} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
