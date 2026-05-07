import { Card, Table, TableBody, TableRow, TableCell } from "@tremor/react";
import { Euro, Calendar, Maximize, Home } from "lucide-react";

export default function DvfTransactionsTab({ transactions }: { transactions: any[] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-sm text-[#878D96] text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        Aucune transaction historique trouvée pour cette parcelle.
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date_mutation).getTime() - new Date(a.date_mutation).getTime()
  );

  return (
    <Card className="p-0 border-gray-200 ring-0 shadow-sm overflow-hidden font-inter">
      <Table className="mt-0">
        <TableBody>
          {sortedTransactions.map((t, index) => {
            const dateStr = new Date(t.date_mutation).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            const price = Intl.NumberFormat("fr-FR").format(t.valeur_fonciere);
            const surface = t.surface_reelle_bati || t.surface_terrain || 0;
            const priceM2 = Math.round(Number(t.valeur_fonciere) / Number(surface));

            return (
              <TableRow 
                key={index} 
                className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group border-b border-gray-100 last:border-0 relative"
              >
                <TableCell className="w-min py-4 pl-5 pr-2">
                  <div className="inline-flex items-center px-2 py-0.5 rounded font-inter font-bold text-xs bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
                    <Calendar size={12} className="mr-1.5 opacity-60" />
                    {dateStr}
                  </div>
                </TableCell>

                <TableCell className="py-4 px-0">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2.5">
                      <Euro size={16} className="text-emerald-600" />
                      <span className="text-[13px] font-semibold text-gray-900 leading-none">
                        {price} €
                      </span>
                      <span className="text-[11px] text-gray-400 font-normal">
                        • {t.nature_mutation}
                      </span>
                    </div>
                    
                    <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                      <div className="flex items-center gap-4 text-[11px] text-gray-500 italic pl-6 pt-1">
                        <span className="flex items-center gap-1">
                          <Maximize size={10} /> {surface} m²
                        </span>
                        <span className="flex items-center gap-1">
                          <Home size={10} /> {t.type_local || 'Terrain'}
                        </span>
                        <span className="font-semibold text-emerald-600/80">
                          {priceM2} €/m²
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-right pr-5">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-blue-500 transition-colors">
                     DVF
                   </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}