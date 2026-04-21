import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react-native';
import { WidgetCard } from './WidgetCard';
import { getDvfParcelle } from '../../../../requests/dvf';
import { formatCurrency, formatDate, getTypeLocalStyle } from '../../../../utils/dvfUtils';

interface DvfWidgetProps {
  feature: any;
}

export default function DvfWidget({ feature }: DvfWidgetProps) {
  const idParcelle = feature?.properties?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['dvf-parcelle', idParcelle],
    queryFn: () => getDvfParcelle(String(idParcelle)),
    enabled: !!idParcelle && String(idParcelle).length === 14,
    retry: false,
  });

  const isEmpty = !data || !data.historique || data.historique.length === 0;

  return (
    <WidgetCard
      title="Historique des Ventes"
      subtitle="Données DVF (5 dernières années)"
      icon={TrendingUp}
      iconColorStyle={{ bg: '#ecfdf5', color: '#059669' }}
      loading={isLoading}
      loadingText="Analyse de l'historique financier..."
      isEmpty={isEmpty}
      emptyText="Aucune transaction immobilière publique récente trouvée pour cette parcelle."
    >
      {!isEmpty && (
        <View>
          {data.stats?.prixMoyenM2 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#f0fdf4', borderRadius: 10, borderWidth: 1, borderColor: '#bbf7d0', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#059669', textTransform: 'uppercase', letterSpacing: 0.5 }}>Prix Moyen Estimé</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: '#1e293b' }}>
                  {formatCurrency(data.stats.prixMoyenM2)} <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b' }}>/ m²</Text>
                </Text>
              </View>
              <View style={{ backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#1e293b' }}>
                  {data.stats.nombreTransactions} transaction{data.stats.nombreTransactions > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          )}

          {data.historique.map((transaction: any, index: number) => {
            const style = getTypeLocalStyle(transaction.typeLocal);
            return (
              <View key={index} style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#f1f5f9', padding: 12, marginBottom: 10, overflow: 'hidden' }}>
                <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: style.barColor }} />
                <View style={{ paddingLeft: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b' }}>
                      {transaction.typeLocal || transaction.nature}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#1e293b' }}>
                      {formatCurrency(transaction.prix)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    <Text style={{ fontSize: 11, color: '#64748b' }}>📅 {formatDate(transaction.date)}</Text>
                    {transaction.surface && <Text style={{ fontSize: 11, color: '#64748b' }}>⬜ {transaction.surface} m²</Text>}
                    {transaction.prixM2 && (
                      <Text style={{ fontSize: 11, fontWeight: '700', color: style.color }}>
                        {formatCurrency(transaction.prixM2)} /m²
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </WidgetCard>
  );
}
