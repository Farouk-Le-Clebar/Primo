import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react-native';

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColorStyle?: { bg: string; color: string };
  loading?: boolean;
  loadingText?: string;
  isEmpty?: boolean;
  emptyText?: string;
  children?: React.ReactNode;
}

export const WidgetCard = ({
  title,
  subtitle,
  icon: Icon,
  iconColorStyle = { bg: '#eff6ff', color: '#2563eb' },
  loading,
  loadingText,
  isEmpty,
  emptyText,
  children,
}: WidgetCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12, overflow: 'hidden' }}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: isExpanded ? 1 : 0, borderBottomColor: '#f1f5f9' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <View style={{ backgroundColor: iconColorStyle.bg, padding: 8, borderRadius: 8 }}>
            <Icon size={20} color={iconColorStyle.color} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {title}
            </Text>
            {subtitle && !loading && (
              <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500', marginTop: 1 }}>
                {subtitle}
              </Text>
            )}
            {loading && (
              <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500', marginTop: 1 }}>
                Chargement...
              </Text>
            )}
          </View>
        </View>
        <View>
          {isExpanded
            ? <ChevronUp size={18} color="#94a3b8" />
            : <ChevronDown size={18} color="#94a3b8" />
          }
        </View>
      </Pressable>

      {isExpanded && (
        <View style={{ padding: 14, backgroundColor: '#f8fafc' }}>
          {loading ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <ActivityIndicator size="small" color="#6366f1" />
              {loadingText && <Text style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>{loadingText}</Text>}
            </View>
          ) : isEmpty ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>{emptyText || "Aucune donnée disponible"}</Text>
            </View>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
};
