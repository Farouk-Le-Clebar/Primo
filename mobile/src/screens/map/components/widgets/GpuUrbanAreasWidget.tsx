import React, { useEffect, useMemo } from 'react';
import { View, Text, Linking, Pressable } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Map } from 'lucide-react-native';
import { WidgetCard } from './WidgetCard';
import { getZonesUrbaByGeometry } from '../../../../requests/geoserver/urbanAreas';
import {
  ZONE_DESCRIPTIONS,
  getMainZoneType,
  extractDepartement,
  formatDate,
  getDocumentUrl,
} from '../../../../utils/gpu/zones';

interface GpuUrbanAreasWidgetProps {
  feature: any;
}

export default function GpuUrbanAreasWidget({ feature }: GpuUrbanAreasWidgetProps) {
  const inseeCode = feature?.properties?.commune;

  const departement = useMemo(() => {
    if (!inseeCode) return extractDepartement(String(feature?.id)) || "";
    return inseeCode.startsWith('97') ? inseeCode.substring(0, 3) : inseeCode.substring(0, 2);
  }, [inseeCode, feature?.id]);

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: async ({ geometry, dept }: { geometry: any; dept: string }) => {
      const response = await getZonesUrbaByGeometry(geometry, dept);
      return response?.features || [];
    }
  });

  useEffect(() => {
    if (!feature?.geometry || !departement) return;
    mutate({ geometry: feature.geometry, dept: departement });
  }, [feature, departement, mutate]);

  const { mainZone, zoneInfo, docAction, uniqueZones, hasMultipleZones } = useMemo(() => {
    const zones = data?.reduce((acc: any[], zone: any) => {
      const key = zone.properties.typezone;
      if (!acc.find((z: any) => z.properties.typezone === key)) acc.push(zone);
      return acc;
    }, []) || [];

    const firstZone = zones[0];
    const props = firstZone?.properties || {};
    const rawType = props.libelle;
    const info = ZONE_DESCRIPTIONS[rawType] || ZONE_DESCRIPTIONS[getMainZoneType(rawType)] || ZONE_DESCRIPTIONS.DEFAULT;
    const action = getDocumentUrl(props, inseeCode);

    return { uniqueZones: zones, mainZone: firstZone, zoneInfo: { ...info, rawType }, docAction: action, hasMultipleZones: zones.length > 1 };
  }, [data, inseeCode]);

  const props = mainZone?.properties || {};

  return (
    <WidgetCard
      title="Zonage PLU"
      subtitle="Urbanisme et constructibilité"
      icon={Map}
      iconColorStyle={{ bg: '#eef2ff', color: '#4f46e5' }}
      loading={isPending}
      loadingText="Recherche des documents d'urbanisme..."
      isEmpty={!isPending && (!data || uniqueZones.length === 0)}
      emptyText={isError ? "Service indisponible" : "Aucun zonage numérique trouvé (RNU probable)"}
    >
      <View>
        <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#1e293b' }}>{zoneInfo.rawType || "—"}</Text>
            <View style={{ backgroundColor: '#eef2ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase' }}>{zoneInfo.label}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, color: '#64748b', lineHeight: 18 }}>{zoneInfo.desc}</Text>
        </View>

        {hasMultipleZones && (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, backgroundColor: '#fffbeb', borderRadius: 8, borderWidth: 1, borderColor: '#fde68a', marginBottom: 10 }}>
            <Text style={{ fontSize: 12, color: '#92400e' }}>⚠️ Parcelle multi-zonée : {uniqueZones.map((z: any) => z.properties.typezone).join(', ')}</Text>
          </View>
        )}

        <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Libellé complet</Text>
            <Text style={{ fontSize: 12, color: '#1e293b', fontWeight: '700', flex: 1, textAlign: 'right', marginLeft: 8 }} numberOfLines={2}>{props.libelong || props.libelle || "—"}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Approuvé le</Text>
            <Text style={{ fontSize: 12, color: '#1e293b', fontWeight: '700' }}>{formatDate(props.datvalid)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Document</Text>
            <Text style={{ fontSize: 12, color: '#1e293b', fontWeight: '700' }}>{props.idurba?.split('_')[0] || "—"}</Text>
          </View>
        </View>

        {docAction ? (
          <Pressable
            onPress={() => Linking.openURL(docAction.url)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#1e293b' }}>🔗 {docAction.label}</Text>
          </Pressable>
        ) : (
          <View style={{ alignItems: 'center', padding: 12, backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Document indisponible</Text>
          </View>
        )}
      </View>
    </WidgetCard>
  );
}
