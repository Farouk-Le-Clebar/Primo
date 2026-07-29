import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

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

  const { data: user, isPending: isUserPending } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id as string),
    enabled: !!id,
  });

  const { data: stats = [], isPending: isStatsPending } = useQuery({
    queryKey: ["userStats", id],
    queryFn: () => getUserStatistics(id as string),
    enabled: !!id,
  });

  if (isUserPending || isStatsPending) {
    return (
      <div className="flex items-center justify-center w-full min-h-[600px] bg-transparent dark:bg-[#0A0A0A]">
        <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-transparent dark:bg-[#0A0A0A] pr-10 pl-10 pt-3 font-inter overflow-y-auto scrollbar-custom">
      <main>
        <UserProfileHeader user={user} />
        
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
      </main>
    </div>
  );
}