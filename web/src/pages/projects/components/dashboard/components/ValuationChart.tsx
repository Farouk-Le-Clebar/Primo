import { AreaChart, Title, Text } from "@tremor/react";

const chartDataDVF = [
  { mois: "Jan", "Prix m²": 3200, "Tendance": 3150 },
  { mois: "Fév", "Prix m²": 3250, "Tendance": 3180 },
  { mois: "Mar", "Prix m²": 3400, "Tendance": 3200 },
  { mois: "Avr", "Prix m²": 3380, "Tendance": 3250 },
  { mois: "Mai", "Prix m²": 3520, "Tendance": 3300 },
  { mois: "Juin", "Prix m²": 3650, "Tendance": 3350 },
];

export default function ValuationChart() {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-1">
          <Title className="text-gray-900 dark:text-white text-base font-semibold">
            Valorisation DVF
          </Title>
        </div>
        <Text className="text-gray-500 dark:text-[#999999] text-xs">
          Évolution croisée des prix au m² sur le secteur d'étude.
        </Text>
      </div>

      <AreaChart
        className="h-56 mt-4"
        data={chartDataDVF}
        index="mois"
        categories={["Prix m²", "Tendance"]}
        colors={["emerald", "teal"]}
        valueFormatter={(number) => `${Intl.NumberFormat("fr-FR").format(number)} €`}
        yAxisWidth={45}
        showAnimation={true}
        curveType="monotone"
        showGridLines={false}
      />
    </>
  );
}