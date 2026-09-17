import { BarList, Card } from "@tremor/react";
import { adminCardClass } from "./statistics";

export default function DistributionCard({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: { name: string; value: number }[];
}) {
  const visible = data.slice(0, 5);
  const rest = data.slice(5).reduce((sum, item) => sum + item.value, 0);
  if (rest) visible.push({ name: "Autres", value: rest });
  return (
    <Card className={`${adminCardClass} p-5 sm:p-6`}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {visible.length ? (
        <BarList
          className="mt-6"
          data={visible}
          color="emerald"
          showAnimation={false}
          valueFormatter={(value: number) => value.toLocaleString("fr-FR")}
        />
      ) : (
        <p className="flex h-44 items-center justify-center text-sm text-gray-500">
          Aucune activité enregistrée.
        </p>
      )}
    </Card>
  );
}
