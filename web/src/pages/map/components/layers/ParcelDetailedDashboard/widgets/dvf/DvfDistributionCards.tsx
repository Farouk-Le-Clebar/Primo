import { useMemo } from "react";
import { Card, DonutChart, Legend, Grid, Col } from "@tremor/react";

export default function DvfDistributionCards({ transactions }: { transactions: any[] }) {
  
  // Données pour le Donut (Type de bien)
  const donutData = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach(t => {
      if (!t.type_local) return;
      counts[t.type_local] = (counts[t.type_local] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Données pour la surface (Simplifié pour l'exemple)
  const surfaceStats = useMemo(() => {
    const bins = { "< 40 m²": 0, "40-60 m²": 0, "60-90 m²": 0, "> 90 m²": 0 };
    transactions.forEach(t => {
      const s = t.surface_reelle_bati;
      if (!s) return;
      if (s < 40) bins["< 40 m²"]++;
      else if (s <= 60) bins["40-60 m²"]++;
      else if (s <= 90) bins["60-90 m²"]++;
      else bins["> 90 m²"]++;
    });
    return Object.entries(bins).filter(([, count]) => count > 0);
  }, [transactions]);

  return (
    <Grid numItems={1} numItemsSm={2} className="gap-6">
      
      {/* Carte Distribution Surface */}
      <Col>
        <Card className="border-gray-200 ring-0 shadow-sm p-6 h-full font-inter">
          <h3 className="font-semibold text-gray-900 mb-6">Distribution par surface</h3>
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">
            <span>Surface</span>
            <span>Nb. Transactions</span>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {surfaceStats.map(([label, count]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[13px] text-gray-700 w-20 shrink-0">{label}</span>
                <div className="flex-1 px-4">
                  <div className="h-5 bg-emerald-100 rounded flex items-center px-2" style={{ width: `${(count / transactions.length) * 100}%`, minWidth: '30px' }}>
                     <span className="text-[10px] font-bold text-emerald-700">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>

      {/* Carte Répartition Type */}
      <Col>
        <Card className="border-gray-200 ring-0 shadow-sm p-6 h-full font-inter">
          <h3 className="font-semibold text-gray-900 mb-6">Répartition par type de bien</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-4">
            <DonutChart
              className="w-40 h-40" // Un peu plus grand pour laisser de la place au texte interne
              data={donutData}
              category="value"
              index="name"
              colors={["indigo", "amber", "cyan", "rose"]}
              showAnimation={false} // Désactiver l'animation peut aider à fixer l'opacité initiale
              variant="pie" // Changement en pie (plein) ou donut selon votre préférence
            />
            <Legend
              categories={donutData.map(d => d.name)}
              colors={["indigo", "amber", "cyan", "rose"]}
              className="mt-4 sm:mt-0 flex flex-col gap-2 max-w-[150px]"
            />
          </div>
        </Card>
      </Col>

    </Grid>
  );
}