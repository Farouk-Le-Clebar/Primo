import { BarChart, Card, List, ListItem, Title, Text } from '@tremor/react';

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function UserConnectionChart({ stats }: { stats: any[] }) {
  const chartData = daysOfWeek.map((day) => ({
    date: day,
    Connexions: 0,
  }));

  let totalConnexions = 0;

  stats.forEach((stat: any) => {
    const date = new Date(stat.connectedAt);
    let dayIndex = date.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6; 

    chartData[dayIndex].Connexions += 1;
    totalConnexions += 1;
  });

  return (
    <Card className="p-6 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl h-full flex flex-col ">
      <div>
        <Title className="text-gray-900 dark:text-white text-base font-semibold">
          Activité de connexion
        </Title>
        <Text className="text-gray-500 dark:text-[#999999] text-xs mt-1">
          Répartition des connexions sur la semaine.
        </Text>
      </div>

      <BarChart
        data={chartData}
        index="date"
        categories={['Connexions']}
        colors={['emerald']}
        valueFormatter={(number) => Intl.NumberFormat('fr').format(number).toString()}
        showLegend={false}
        showYAxis={false}
        className="mt-6 h-48"
      />

      <List className="mt-4">
        <ListItem className="dark:border-white/5">
          <div className="flex items-center space-x-2">
            <span
              className="bg-emerald-500 h-0.5 w-3"
              aria-hidden={true}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">Total</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {totalConnexions} <span className="text-xs font-normal text-gray-500 dark:text-[#999999]">connexions</span>
          </span>
        </ListItem>
      </List>
    </Card>
  );
}