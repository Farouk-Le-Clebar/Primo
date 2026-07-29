import { Card, Title, Text } from "@tremor/react";
import { Clock, Sunrise, Sun, Sunset, Moon } from "lucide-react";

export default function UserPeakHour({ stats }: { stats: any[] }) {
  const periods = {
    'Matin': { count: 0, label: '06h00 - 12h00', icon: Sunrise, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    'Après-midi': { count: 0, label: '12h00 - 18h00', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    'Soir': { count: 0, label: '18h00 - 00h00', icon: Sunset, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    'Nuit': { count: 0, label: '00h00 - 06h00', icon: Moon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  };

  stats.forEach((stat: any) => {
    const hour = new Date(stat.connectedAt).getHours();
    
    if (hour >= 6 && hour < 12) periods['Matin'].count++;
    else if (hour >= 12 && hour < 18) periods['Après-midi'].count++;
    else if (hour >= 18) periods['Soir'].count++;
    else periods['Nuit'].count++; // 0h à 5h
  });

  let maxCount = 0;
  let peakPeriodName = '';

  for (const [name, data] of Object.entries(periods)) {
    if (data.count > maxCount) {
      maxCount = data.count;
      peakPeriodName = name;
    }
  }

  const isTie = Object.values(periods).filter(p => p.count === maxCount).length > 1;
  
  let TitleText = 'Aléatoire';
  let SubtitleText = 'Connexions trop dispersées pour définir une tendance.';
  let ActiveIcon = Clock;
  let iconColor = 'text-gray-500';
  let iconBg = 'bg-gray-100 dark:bg-white/10';

  if (maxCount > 0 && (!isTie || maxCount > 1)) {
    const period = periods[peakPeriodName as keyof typeof periods];
    TitleText = `Le ${peakPeriodName.toLowerCase()}`.replace('le après-midi', "l'après-midi").replace('le nuit', 'la nuit');
    SubtitleText = `Habitude de connexion entre ${period.label}.`;
    ActiveIcon = period.icon;
    iconColor = period.color;
    iconBg = period.bg;
  } else if (maxCount === 0) {
    TitleText = 'Aucune';
    SubtitleText = "L'utilisateur ne s'est pas encore connecté.";
  }

  return (
    <Card className="p-6 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl h-full flex flex-col items-center justify-center text-center ">
      <div className={`p-4 rounded-full ${iconBg} mb-4`}>
        <ActiveIcon className={`w-8 h-8 ${iconColor}`} />
      </div>
      
      <Title className="text-gray-900 dark:text-white text-base font-semibold">
        Moment de prédilection
      </Title>
      
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3 capitalize">
        {TitleText}
      </p>
      
      <Text className="text-gray-500 dark:text-[#999999] text-xs mt-2">
        {SubtitleText}
      </Text>
    </Card>
  );
}