import { useQuery } from "@tanstack/react-query";
import { AreaChart, Title, Text } from "@tremor/react";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { getUsers } from "../../../../requests/admin";

export default function UserChart() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["usersChart"],
    queryFn: () => getUsers(0, 1000),
  });

  const chartData = useMemo(() => {
    if (!users.length) return [];

    const sortedUsers = [...users].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const groupedData: Record<string, number> = {};
    let cumulative = 0;

    sortedUsers.forEach((user) => {
      if (!user.createdAt) return;
      const date = new Date(user.createdAt).toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric",
      });
      groupedData[date] = (groupedData[date] || 0) + 1;
    });

    return Object.entries(groupedData).map(([date, count]) => {
      cumulative += count;
      return {
        date,
        "Nouveaux": count,
        "Total": cumulative,
      };
    });
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center h-full p-4">
      <Title className="text-gray-900 dark:text-white font-semibold">Croissance des utilisateurs</Title>
      <Text className="text-gray-500 dark:text-[#999999] text-sm">Évolution basée sur la première interaction</Text>
      
      <AreaChart
        className="h-72 mt-4"
        data={chartData}
        index="date"
        categories={["Total", "Nouveaux"]}
        colors={["emerald", "teal"]}
        valueFormatter={(number) => Intl.NumberFormat("fr").format(number).toString()}
        yAxisWidth={40}
        showAnimation={true}
        curveType="monotone"
      />
    </div>
  );
}