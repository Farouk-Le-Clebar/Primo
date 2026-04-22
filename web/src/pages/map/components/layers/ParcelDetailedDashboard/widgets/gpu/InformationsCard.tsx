import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, Table, TableBody, TableRow, TableCell } from "@tremor/react";
import { Info } from "lucide-react";

// COMPONENTS
import type { ParcelWidgetProps } from "../../types";
import { extractDepartementForInformation, getInformationStyle, getInformationDescription } from "./utilsInformations";
import { getInformationsSurf, getInformationsLin, getInformationsPct } from "../../../../../../../requests/geoserver/information"; 
import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";

export default function InformationsCard({ feature }: ParcelWidgetProps) {
  const inseeCode = feature?.properties?.commune;

  const departement = useMemo(() => {
    if (!inseeCode) return extractDepartementForInformation(String(feature?.id)) || "";
    return inseeCode.startsWith('97') ? inseeCode.substring(0, 3) : inseeCode.substring(0, 2);
  }, [inseeCode, feature?.id]);

  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ geometry, dept }: { geometry: any; dept: string }) => {
      const [surf, lin, pct] = await Promise.all([
        getInformationsSurf(geometry, dept),
        getInformationsLin(geometry, dept),
        getInformationsPct(geometry, dept)
      ]);
      return [
        ...surf.map((f: any) => ({ ...f, _kind: 'surface' })),
        ...lin.map((f: any) => ({ ...f, _kind: 'lineaire' })),
        ...pct.map((f: any) => ({ ...f, _kind: 'ponctuel' }))
      ];
    }
  });

  useEffect(() => {
    if (!feature?.geometry || !departement) return;
    mutate({ geometry: feature.geometry, dept: departement });
  }, [feature, departement, mutate]);

  const uniqueInformations = useMemo(() => {
    if (!data) return [];
    const seen = new Set();
    return data.filter((item: any) => {
      const key = `${item.properties.typeinf}-${item.properties.libelle}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  const isEmpty = !data || uniqueInformations.length === 0;

  return (
    <Card className="p-0 border-gray-200 ring-0 shadow-sm overflow-hidden font-inter">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">Informations annexes</h3>
        </div>
        {!isPending && !isEmpty && (
          <span className="text-xs text-gray-500 font-medium">{uniqueInformations.length} éléments</span>
        )}
      </div>

      {isPending ? (
        <div className="flex items-center justify-center p-8">
          <LoadingPrimoLogo className="w-6 h-6 text-blue-500" />
        </div>
      ) : isEmpty ? (
        <div className="p-8 text-sm text-[#878D96] text-center bg-gray-50">
          Aucune information annexe détectée sur cette parcelle.
        </div>
      ) : (
        <Table className="mt-0">
          <TableBody>
            {uniqueInformations.map((info: any, index: number) => {
              const props = info.properties;
              const style = getInformationStyle(props.typeinf, props.libelle);
              const humanDescription = getInformationDescription(props.typeinf, props.libelle);
              const Icon = style.icon;
              const code = props.typeinf?.split('_')[0] || "INF";

              return (
                <TableRow 
                  key={index} 
                  className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group border-b border-gray-100 last:border-0 relative"
                  title={humanDescription}
                >
                  <TableCell className="w-min py-4 pl-5 pr-2">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded font-inter font-bold text-xs ${style.bg} ${style.color} ${style.border}`}>
                      Code.{code}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-0">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={`${style.color}`} />
                        <span className="text-[13px] font-semibold text-gray-900 leading-none">{props.libelle}</span>
                      </div>
                      <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                        <p className="text-[11px] text-gray-500 italic pl-6 pt-1 leading-relaxed pr-5">
                          {humanDescription}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}