import type { UserStatistic } from "../../../../../types/admin";
import DistributionCard from "../../shared/DistributionCard";

export default function UserPeakHour({ stats }: { stats: UserStatistic[] }) {
  const periods = [
    { name: "Nuit · 00–06 h", value: 0 },
    { name: "Matin · 06–12 h", value: 0 },
    { name: "Après-midi · 12–18 h", value: 0 },
    { name: "Soir · 18–24 h", value: 0 },
  ];
  let valid = 0;
  for (const stat of stats) {
    const hour = new Date(stat.connectedAt).getHours();
    if (Number.isFinite(hour)) {
      periods[Math.floor(hour / 6)].value++;
      valid++;
    }
  }
  return (
    <DistributionCard
      title="Moments d’activité"
      description="Tout l’historique · heures de votre fuseau horaire"
      data={valid ? periods : []}
    />
  );
}
