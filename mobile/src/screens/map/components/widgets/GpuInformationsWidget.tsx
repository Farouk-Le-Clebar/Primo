import React, { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Info } from 'lucide-react-native';
import { WidgetCard } from './WidgetCard';
import { getInformationsSurf, getInformationsLin, getInformationsPct } from '../../../../requests/geoserver/information';
import { extractDepartement } from '../../../../utils/gpu/zones';
import { getInformationDescription, getInformationColorBar } from '../../../../utils/gpu/informations';

interface GpuInformationsWidgetProps {
  feature: any;
}

const KIND_LABELS: Record<string, string> = { surface: 'Surface', lineaire: 'Linéaire', ponctuel: 'Ponctuel' };

export default function GpuInformationsWidget({ feature }: GpuInformationsWidgetProps) {
  const inseeCode = feature?.properties?.commune;

  const departement = useMemo(() => {
    if (!inseeCode) return extractDepartement(String(feature?.id)) || "";
    return inseeCode.startsWith('97') ? inseeCode.substring(0, 3) : inseeCode.substring(0, 2);
  }, [inseeCode, feature?.id]);

  const { mutate, data, isPending } = useMutation({
    mutationFn: async ({ geometry, dept }: { geometry: any; dept: string }) => {
      const [surf, lin, pct] = await Promise.all([
        getInformationsSurf(geometry, dept),
        getInformationsLin(geometry, dept),
        getInformationsPct(geometry, dept),
      ]);
      return [
        ...surf.map((f: any) => ({ ...f, _kind: 'surface' })),
        ...lin.map((f: any) => ({ ...f, _kind: 'lineaire' })),
        ...pct.map((f: any) => ({ ...f, _kind: 'ponctuel' })),
      ];
    }
  });

  useEffect(() => {
    if (!feature?.geometry || !departement) return;
    mutate({ geometry: feature.geometry, dept: departement });
  }, [feature, departement, mutate]);

  const uniqueInfos = useMemo(() => {
    if (!data) return [];
    const seen = new Set();
    return data.filter((item: any) => {
      const key = `${item.properties.typeinf}-${item.properties.libelle}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  return (
    <WidgetCard
      title="Informations"
      subtitle="Contextes & Procédures"
      icon={Info}
      iconColorStyle={{ bg: '#f0f9ff', color: '#0284c7' }}
      loading={isPending}
      loadingText="Recherche d'informations annexes..."
      isEmpty={!isPending && uniqueInfos.length === 0}
      emptyText="Aucune information annexe détectée sur cette parcelle."
    >
      {uniqueInfos.map((info: any, index: number) => {
        const props = info.properties;
        const barColor = getInformationColorBar(props.typeinf, props.libelle);
        const description = getInformationDescription(props.typeinf, props.libelle);
        return (
          <View key={index} style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#f1f5f9', padding: 12, marginBottom: 10, overflow: 'hidden' }}>
            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: barColor }} />
            <View style={{ paddingLeft: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', flex: 1, marginRight: 8 }} numberOfLines={2}>
                  {props.libelle}
                </Text>
                {props.txt && (
                  <View style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: '#64748b' }}>{props.txt}</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 11, color: '#64748b', lineHeight: 16, marginBottom: 8 }}>{description}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 6, borderTopWidth: 1, borderTopColor: '#f8fafc' }}>
                <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '500', textTransform: 'capitalize' }}>
                  {KIND_LABELS[info._kind] || info._kind}
                </Text>
                <Text style={{ fontSize: 10, color: '#cbd5e1', fontFamily: 'monospace', marginLeft: 'auto' }}>
                  Ref: {props.typeinf?.split('_')[0] || "AUTO"}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </WidgetCard>
  );
}
