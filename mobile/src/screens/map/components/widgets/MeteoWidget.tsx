import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Thermometer } from 'lucide-react-native';
import { WidgetCard } from './WidgetCard';
import { getAverageMeteoForParcel, type MeteoData } from '../../../../requests/geoserver/worldClim';

interface MeteoWidgetProps {
  feature: any;
}

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
    <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>{label}</Text>
    <Text style={{ fontSize: 12, color: '#1e293b', fontWeight: '700' }}>{value}</Text>
  </View>
);

export default function MeteoWidget({ feature }: MeteoWidgetProps) {
  const { mutate, data, isPending } = useMutation<MeteoData | null, Error, { geometry: any; departement: string }>({
    mutationFn: async ({ geometry, departement }) => getAverageMeteoForParcel(geometry, departement),
  });

  useEffect(() => {
    if (!feature?.geometry) return;
    const featureId = String(feature.id || '');
    const departement = featureId.split('_')[1]?.split('.')[0] || feature.properties?.commune?.substring(0, 2) || "";
    if (!('coordinates' in feature.geometry)) return;
    mutate({ geometry: feature.geometry, departement });
  }, [feature, mutate]);

  return (
    <WidgetCard
      title="Météo"
      subtitle="Moyennes climatiques sur 30 ans"
      icon={Thermometer}
      iconColorStyle={{ bg: '#fff7ed', color: '#ea580c' }}
      loading={isPending}
      loadingText="Chargement des données climatiques..."
      isEmpty={!isPending && !data}
      emptyText="Aucune donnée climatique disponible"
    >
      {data && (
        <View>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, marginBottom: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
              Températures 🌡️
            </Text>
            <StatRow label="Temp. annuelle moy." value={data.temp_moy_annuelle != null ? `${data.temp_moy_annuelle.toFixed(1)} °C` : "—"} />
            <StatRow label="Été – moy." value={data.temp_moy_ete != null ? `${data.temp_moy_ete.toFixed(1)} °C` : "—"} />
            <StatRow label="Été – max absolu" value={data.temp_max_abs_ete != null ? `${data.temp_max_abs_ete.toFixed(1)} °C` : "—"} />
            <StatRow label="Hiver – moy." value={data.temp_moy_hiver != null ? `${data.temp_moy_hiver.toFixed(1)} °C` : "—"} />
            <StatRow label="Hiver – min absolu" value={data.temp_min_abs_hiver != null ? `${data.temp_min_abs_hiver.toFixed(1)} °C` : "—"} />
          </View>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
              Précipitations 🌧️
            </Text>
            <StatRow label="Annuelles" value={data.prec_annuelles != null ? `${data.prec_annuelles.toFixed(0)} mm` : "—"} />
            <StatRow label="Été total" value={data.prec_ete_total != null ? `${data.prec_ete_total.toFixed(0)} mm` : "—"} />
            <StatRow label="Hiver total" value={data.prec_hiver_total != null ? `${data.prec_hiver_total.toFixed(0)} mm` : "—"} />
          </View>
        </View>
      )}
    </WidgetCard>
  );
}
