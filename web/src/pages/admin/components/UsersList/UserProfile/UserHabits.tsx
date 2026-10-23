import { Globe, Laptop, Smartphone } from "lucide-react";
import type { UserStatistic } from "../../../../../types/admin";
import AdminStatCard from "../../shared/AdminStatCard";
import { distribution } from "../../shared/statistics";

const UNKNOWN = "Non renseigné";

export default function UserHabits({ stats }: { stats: UserStatistic[] }) {
  const mainBrowser = distribution(stats, "browser")[0]?.name || UNKNOWN;
  const mainOs = distribution(stats, "os")[0]?.name || UNKNOWN;
  const mainDevice = distribution(stats, "deviceType")[0]?.name || UNKNOWN;

  return (
    <div className="primo-stagger grid gap-4 @xl:grid-cols-3 @3xl:col-span-12">
      <AdminStatCard label="Navigateur principal" value={mainBrowser} detail="Le plus utilisé" icon={Globe} color="violet" />
      <AdminStatCard label="Système principal" value={mainOs} detail="Le plus utilisé" icon={Laptop} color="emerald" />
      <AdminStatCard label="Appareil principal" value={mainDevice} detail="Le plus utilisé" icon={Smartphone} color="amber" />
    </div>
  );
}
