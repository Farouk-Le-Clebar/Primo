import { useMemo } from "react";
import { Card, LineChart } from "@tremor/react";

export default function DvfEvolutionChart({ transactions }: { transactions: any[] }) {
  const chartData = useMemo(() => {
    const validTransactions = transactions.filter(
      t => t.date_mutation && t.valeur_fonciere && t.surface_reelle_bati
    );

    if (validTransactions.length === 0) return [];

    validTransactions.sort((a, b) => 
      new Date(a.date_mutation).getTime() - new Date(b.date_mutation).getTime()
    );

    // Calcul de la moyenne globale
    const totalM2 = validTransactions.reduce((acc, t) => 
      acc + (Number(t.valeur_fonciere) / Number(t.surface_reelle_bati)), 0
    );
    const averageM2 = Math.round(totalM2 / validTransactions.length);

    // Si une seule transaction, on en crée deux points identiques pour tracer une ligne droite
    const dataToMap = validTransactions.length === 1 
      ? [validTransactions[0], validTransactions[0]] 
      : validTransactions;

    return dataToMap.map((t, index) => {
      const dateObj = new Date(t.date_mutation);
      const formattedDate = dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
      });
      
      const priceM2 = Math.round(Number(t.valeur_fonciere) / Number(t.surface_reelle_bati));

      return {
        label: formattedDate,
        "Prix au m²": priceM2,
        "Moyenne": averageM2,
      };
    });
  }, [transactions]);

  return (
    <Card className="border-gray-200 ring-0 shadow-sm p-6 font-inter">
      <h3 className="font-semibold text-gray-900 mb-6 font-inter">Évolution du prix au m²</h3>
      
      <LineChart
        className="h-72 mt-4"
        data={chartData}
        index="label"
        categories={["Prix au m²", "Moyenne"]}
        colors={["emerald", "slate"]}
        valueFormatter={(number: number) => `${Intl.NumberFormat("fr-FR").format(number)} €`}
        yAxisWidth={65}
        showAnimation={false}
        autoMinValue={true}
        showXAxis={true}
        showYAxis={true}
        showGridLines={true}
        curveType="linear"
        connectNulls={true}
        // Customisation pour différencier la moyenne
        showLegend={true}
      />
    </Card>
  );
}