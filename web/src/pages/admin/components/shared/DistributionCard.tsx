import { BarList } from "@tremor/react";
import BentoCard from "../../../map/components/layers/Dashboard/BentoCard";

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
        <p className="flex h-40 items-center justify-center text-sm text-gray-500">Aucune activité enregistrée.</p>
      )}
    </BentoCard>
  );
}
