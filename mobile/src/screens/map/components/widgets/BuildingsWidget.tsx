import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Building2 } from 'lucide-react-native';
import { WidgetCard } from './WidgetCard';
import { getBuildingsByGeometry } from '../../../../requests/geoserver/bdTopo';

interface BuildingsWidgetProps {
  feature: any;
}

const WALL_MATERIALS: Record<string, string> = {
  '01': 'Béton', '02': 'Pierre', '03': 'Brique', '04': 'Bois',
  '05': 'Métal', '06': 'Verre', '07': 'Composite', '09': 'Autre',
};
const ROOF_MATERIALS: Record<string, string> = {
  '01': 'Tuile', '02': 'Ardoise', '03': 'Zinc', '04': 'Bac acier',
  '05': 'Bitume', '06': 'Béton', '07': 'Verre', '09': 'Autre',
};
const getMaterialLabel = (code: string, dict: Record<string, string>) => dict[code] || code || "—";

const BuildingRow = ({ label, value }: { label: string; value: any }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
    <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>{label}</Text>
    <Text style={{ fontSize: 12, color: '#1e293b', fontWeight: '700' }}>{value ?? '—'}</Text>
  </View>
);

export default function BuildingsWidget({ feature }: BuildingsWidgetProps) {
  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ geometry, departement }: { geometry: any; departement: string }) =>
      getBuildingsByGeometry(geometry, departement),
  });

  useEffect(() => {
    if (!feature?.geometry) return;
    const featureId = String(feature.id || '');
    const departement = featureId.split('_')[1]?.split('.')[0] || feature.properties?.commune?.substring(0, 2) || "";
    if (!('coordinates' in feature.geometry)) return;
    mutate({ geometry: feature.geometry, departement });
  }, [feature, mutate]);

  const buildings = data?.features || [];
  const badgeText = isPending ? "Chargement..." :
    buildings.length === 0 ? "Aucune donnée" :
      `${buildings.length} détection${buildings.length > 1 ? 's' : ''}`;

  return (
    <WidgetCard
      title="Bâtiments"
      subtitle={badgeText}
      icon={Building2}
      iconColorStyle={{ bg: '#eff6ff', color: '#2563eb' }}
      loading={isPending}
      loadingText="Analyse des bâtiments..."
      isEmpty={!isPending && buildings.length === 0}
      emptyText="Aucun bâtiment détecté sur cette parcelle."
    >
      {buildings.map((building: any, i: number) => {
        const p = building.properties;
        const year = p.date_app ? new Date(p.date_app).getFullYear() : null;
        return (
          <View key={p.id || i} style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ backgroundColor: '#f1f5f9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  {p.nature || "BÂTIMENT"}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>
              {p.usage1 || "Usage non défini"}
            </Text>
            <BuildingRow label="Hauteur" value={p.hauteur ? `${p.hauteur} m` : null} />
            <BuildingRow label="Niveaux" value={p.nb_etages} />
            <BuildingRow label="Année" value={year} />
            <BuildingRow label="Murs" value={getMaterialLabel(p.mat_murs, WALL_MATERIALS)} />
            <BuildingRow label="Toiture" value={getMaterialLabel(p.mat_toits, ROOF_MATERIALS)} />
          </View>
        );
      })}
    </WidgetCard>
  );
}
