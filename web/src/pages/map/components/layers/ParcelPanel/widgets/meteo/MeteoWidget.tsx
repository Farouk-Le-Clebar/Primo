import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Thermometer, Droplets, Sun, Snowflake } from "lucide-react";

import { getAverageMeteoForParcel } from "../../../../../../../requests/geoserver/worldClim";
import { WidgetCard, StatBlock, MetricItem, IconStat } from "../WidgetCard";
import type { ParcelWidgetProps } from "../../types";

export default function MeteoWidget({ feature }: ParcelWidgetProps) {
  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ geometry, departement }: { geometry: any; departement: string }) => {
      return await getAverageMeteoForParcel(geometry, departement);
    }
  });

  useEffect(() => {
    if (!feature?.geometry) return;

    const featureId = String(feature.id);
    const departement = featureId.split('_')[1]?.split('.')[0] || "";

    if (!('coordinates' in feature.geometry)) return;

    mutate({ geometry: feature.geometry, departement });
  }, [feature, mutate]);

  return (
    <WidgetCard
      title="Météo"
      subtitle="Moyennes climatiques sur 30 ans"
      icon={Thermometer}
      iconColorClass="bg-orange-50 text-orange-600"
      loading={isPending}
      loadingText="Chargement des données climatiques..."
      isEmpty={!data}
      emptyText="Aucune donnée climatique disponible"
    >
      <div className="space-y-4">
        <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col gap-2 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <StatBlock 
              label="Temp. annuelle" 
              value={data?.temp_moy_annuelle ? `${data.temp_moy_annuelle.toFixed(1)}°C` : "—"} 
            />
            <StatBlock 
              label="Précip. annuelles" 
              value={data?.prec_annuelles ? `${data.prec_annuelles.toFixed(0)} mm` : "—"} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          <MetricItem 
            icon={<Sun size={12} className="text-orange-500" />} 
            label="Été moy." 
            value={data?.temp_moy_ete ? `${data.temp_moy_ete.toFixed(1)}°C` : "-"} 
          />
          <MetricItem 
            icon={<Sun size={12} className="text-red-500" />} 
            label="Été max" 
            value={data?.temp_max_abs_ete ? `${data.temp_max_abs_ete.toFixed(1)}°C` : "-"} 
          />
          <MetricItem 
            icon={<Snowflake size={12} className="text-blue-500" />} 
            label="Hiver moy." 
            value={data?.temp_moy_hiver ? `${data.temp_moy_hiver.toFixed(1)}°C` : "-"} 
          />
          <MetricItem 
            icon={<Snowflake size={12} className="text-cyan-500" />} 
            label="Hiver min" 
            value={data?.temp_min_abs_hiver ? `${data.temp_min_abs_hiver.toFixed(1)}°C` : "-"} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <IconStat 
            icon={<Droplets size={12} className="text-amber-500" />} 
            label="Pluie été" 
            value={data?.prec_ete_total ? `${data.prec_ete_total.toFixed(0)} mm` : "—"} 
          />
          <IconStat 
            icon={<Droplets size={12} className="text-blue-500" />} 
            label="Pluie hiver" 
            value={data?.prec_hiver_total ? `${data.prec_hiver_total.toFixed(0)} mm` : "—"} 
          />
        </div>
      </div>
    </WidgetCard>
  );
}