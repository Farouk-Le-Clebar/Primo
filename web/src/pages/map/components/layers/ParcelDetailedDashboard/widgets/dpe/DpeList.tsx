import { Card, Table, TableBody, TableRow, TableCell } from "@tremor/react";
import { Calendar, Maximize, Euro, Flame, Thermometer, Droplets, ShieldCheck, Info } from "lucide-react";
import { getDpeColors, formatEuro } from "./utils";

export default function DpeList({ dpeList }: { dpeList: any[] }) {
  if (!dpeList || dpeList.length === 0) {
    return (
      <div className="p-8 text-sm text-[#878D96] text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        Aucun DPE historique trouvé pour cette parcelle.
      </div>
    );
  }

  const sortedDpes = [...dpeList].sort((a, b) => 
    new Date(b.date_etablissement_dpe).getTime() - new Date(a.date_etablissement_dpe).getTime()
  );

  return (
    <Card className="p-0 border-gray-200 ring-0 shadow-sm overflow-hidden font-inter flex flex-col">
      <div className="bg-gray-50 border-b border-gray-100 px-5 py-2.5 flex items-center gap-4 text-[10px] text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-custom">
        <div className="flex items-center gap-1.5 font-semibold text-gray-700">
          <Info size={12} className="text-blue-500" />
          Légende :
        </div>
        <div className="flex items-center gap-1"><Maximize size={10} /> Surface</div>
        <div className="flex items-center gap-1"><Thermometer size={10} /> Chauffage</div>
        <div className="flex items-center gap-1"><Droplets size={10} /> Eau chaude (ECS)</div>
        <div className="flex items-center gap-1"><ShieldCheck size={10} /> Isolation</div>
        <div className="flex items-center gap-1"><Flame size={10} /> Conso. EP</div>
        <div className="flex items-center gap-1"><Euro size={10} /> Coût estimé/an</div>
      </div>

      <Table className="mt-0">
        <TableBody>
          {sortedDpes.map((dpe, index) => {
            const dateStr = new Date(dpe.date_etablissement_dpe).toLocaleDateString('fr-FR', {
              day: '2-digit', month: '2-digit', year: 'numeric'
            });
            
            const surface = dpe.surface_habitable_logement ? parseFloat(dpe.surface_habitable_logement) : 0;
            const conso = dpe.conso_5_usages_ep_m2_an ? parseFloat(dpe.conso_5_usages_ep_m2_an) : 0;
            
            const dpeStyle = getDpeColors(dpe.etiquette_dpe);
            const gesStyle = getDpeColors(dpe.etiquette_ges);

            return (
              <TableRow 
                key={dpe.numero_dpe || index} 
                className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group border-b border-gray-100 last:border-0 relative"
              >
                <TableCell className="w-min py-4 pl-5 pr-2 align-top">
                  <div className="inline-flex items-center px-2 py-0.5 rounded font-inter font-bold text-xs bg-gray-100 text-gray-700 border border-gray-200 shrink-0 mt-0.5">
                    <Calendar size={12} className="mr-1.5 opacity-60" />
                    {dateStr}
                  </div>
                </TableCell>

                <TableCell className="py-4 px-0">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DPE</span>
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-sm text-[11px] font-black text-white ${dpeStyle.bg}`}>
                          {dpe.etiquette_dpe || "?"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">GES</span>
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-sm text-[11px] font-black text-white opacity-90 ${gesStyle.bg}`}>
                          {dpe.etiquette_ges || "?"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 ml-1">
                        <span className="text-[13px] font-semibold text-gray-900 leading-none capitalize">
                          {dpe.type_batiment || 'Logement'}
                        </span>
                        {dpe.annee_construction && (
                          <span className="text-[11px] text-gray-400 mt-0.5">
                            • Construit en {dpe.annee_construction}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pl-1 pt-2 w-full pr-4 gap-y-2">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          {surface > 0 && (
                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                              <Maximize size={10} /> {surface} m²
                            </span>
                          )}
                          
                          {dpe.type_energie_principale_chauffage && (
                            <span className="flex items-center gap-1" title="Chauffage">
                              <Thermometer size={10} /> 
                              {dpe.type_energie_principale_chauffage}
                              {dpe.type_installation_chauffage ? ` (${dpe.type_installation_chauffage})` : ''}
                            </span>
                          )}

                          {dpe.type_energie_principale_ecs && (
                            <span className="flex items-center gap-1" title="Eau Chaude Sanitaire">
                              <Droplets size={10} /> 
                              {dpe.type_energie_principale_ecs}
                            </span>
                          )}

                          {(dpe.qualite_isolation_enveloppe || dpe.qualite_isolation_menuiseries) && (
                            <span className="flex items-center gap-1" title="Qualité de l'isolation">
                              <ShieldCheck size={10} /> 
                              Murs: {dpe.qualite_isolation_enveloppe || '?'} • Fenêtres: {dpe.qualite_isolation_menuiseries || '?'}
                            </span>
                          )}

                          {conso > 0 && (
                            <span className="flex items-center gap-1 text-orange-600/80 font-semibold" title="Consommation Énergie Primaire">
                              <Flame size={10} /> {Math.round(conso)} kWh/m²
                            </span>
                          )}

                          {dpe.cout_total_5_usages && (
                            <span className="flex items-center gap-1 text-emerald-600/80 font-semibold" title="Coût annuel estimé">
                              <Euro size={10} /> {formatEuro(dpe.cout_total_5_usages)}/an
                            </span>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>
                </TableCell>

                <TableCell className="py-4 text-right pr-5 align-top">
                  <div className="flex flex-col items-end gap-1 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-blue-500 transition-colors">
                      DPE
                    </span>
                    {dpe.numero_dpe && (
                      <span className="text-[9px] text-gray-300 font-mono group-hover:text-gray-400 transition-colors">
                        {dpe.numero_dpe.substring(0, 8)}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}