import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAdminUsers } from "../requests/admin";
import { getAllStatistics } from "../requests/statistics";
import type { UserStatistic, UserType } from "../types/admin";
import { dailySeries } from "../pages/admin/components/shared/statistics";

const startOfPeriod = (days: number): number => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days + 1);
  return start.getTime();
};

const latestByUser = (stats: UserStatistic[]): UserStatistic[] => {
  const byUser = new Map<string, UserStatistic>();
  for (const stat of stats) {
    const previous = byUser.get(stat.userId);
    if (!previous || new Date(stat.connectedAt) > new Date(previous.connectedAt)) byUser.set(stat.userId, stat);
  }
  return [...byUser.values()];
};

export function useAdminOverview() {
  const [days, setDays] = useState(30);
  const usersQuery = useQuery<UserType[]>({ queryKey: ["usersChart"], queryFn: getAllAdminUsers });
  const statsQuery = useQuery<UserStatistic[]>({ queryKey: ["adminStatistics"], queryFn: getAllStatistics });

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const recent = useMemo(() => {
    const start = startOfPeriod(days);
    const now = Date.now();
    return (statsQuery.data ?? []).filter((stat) => {
      const time = new Date(stat.connectedAt).getTime();
      return time >= start && time <= now;
    });
  }, [statsQuery.data, days]);
  const latest = useMemo(() => latestByUser(recent), [recent]);
  const signups = useMemo(() => dailySeries(users.map((user) => user.createdAt), days), [users, days]);
  const activity = useMemo(() => dailySeries(recent.map((stat) => stat.connectedAt), days), [recent, days]);

  const retry = () => {
    void usersQuery.refetch();
    void statsQuery.refetch();
  };

  return {
    days,
    setDays,
    users,
    recent,
    latest,
    signups,
    activity,
    newUsers: signups.reduce((sum, day) => sum + day.Total, 0),
    isPending: usersQuery.isPending || statsQuery.isPending,
    isError: usersQuery.isError || statsQuery.isError,
    retry,
  };
}
