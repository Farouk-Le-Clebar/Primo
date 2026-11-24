import { BarChart3 } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import { BarList } from "@tremor/react";
import BentoCard from "./BentoCard";

type DistributionCardProps = {
  title: string;
  description: string;
  data: { name: string; value: number }[];
  color?: "violet" | "emerald" | "amber";
  className?: string;
};

const formatValue = (value: number): string => value.toLocaleString("fr-FR");

export default function DistributionCard({ title, description, data, color = "violet", className }: DistributionCardProps) {
  const visible = data.slice(0, 5);
  const rest = data.slice(5).reduce((sum, item) => sum + item.value, 0);
  if (rest) visible.push({ name: "Autres", value: rest });

  return (
    <BentoCard title={title} className={className}>
      <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
      {visible.length ? (
        <BarList className="mt-4" data={visible} color={color} showAnimation={false} valueFormatter={formatValue} />
      ) : (
        <EmptyState icon={BarChart3} title="Aucune activité enregistrée" description="Les données apparaîtront dès les premières utilisations." size="sm" framed={false} />
      )}
    </BentoCard>
  );
}
