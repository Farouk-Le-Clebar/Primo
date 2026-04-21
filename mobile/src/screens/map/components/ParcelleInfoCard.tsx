import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { MapPin, Maximize2, Landmark, FileText, Calendar, type LucideIcon } from "lucide-react-native";
import { ParcellePayload } from "../../../types/map";
import BuildingsWidget from "./widgets/BuildingsWidget";
import DvfWidget from "./widgets/DvfWidget";
import MeteoWidget from "./widgets/MeteoWidget";
import GpuUrbanAreasWidget from "./widgets/GpuUrbanAreasWidget";
import GpuPrescriptionsWidget from "./widgets/GpuPrescriptionsWidget";
import GpuInformationsWidget from "./widgets/GpuInformationsWidget";

type ParcelleInfoCardProps = {
  selectedParcelle: ParcellePayload;
};

const formatSurface = (m2: number) => {
  if (!m2) return "—";
  if (m2 >= 10000) return `${(m2 / 10000).toFixed(2)} ha`;
  return `${m2.toLocaleString("fr-FR")} m²`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/C";
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

const buildFeatureForWidgets = (payload: ParcellePayload) => ({
  type: "Feature" as const,
  id: payload.featureId || payload.id,
  geometry: payload.rawGeometry || payload.geometry,
  properties: payload.properties || {},
});

const LABEL_STYLE = {
  fontSize: 9 as const,
  fontWeight: "700" as const,
  color: "#94a3b8",
  textTransform: "uppercase" as const,
  letterSpacing: 0.8,
};

const StatCell = ({
  icon: Icon,
  label,
  value,
  bordered,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  bordered?: boolean;
}) => (
  <View style={{ flex: 1, padding: 12, ...(bordered ? { borderRightWidth: 1, borderRightColor: "#f1f5f9" } : {}) }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 }}>
      <Icon size={11} color="#94a3b8" />
      <Text style={LABEL_STYLE}>{label}</Text>
    </View>
    <Text style={{ fontSize: 14, fontWeight: "700", color: "#1e293b" }}>{value}</Text>
  </View>
);

const ParcelleInfoCard = ({ selectedParcelle }: ParcelleInfoCardProps) => {
  const properties = selectedParcelle.properties || {};
  const feature = useMemo(() => buildFeatureForWidgets(selectedParcelle), [selectedParcelle]);

  const code_dep = properties.commune?.substring(0, 2) || "—";
  const section = properties.section || "—";
  const numero = properties.numero || "—";
  const contenance = properties.contenance;
  const idParcelle = properties.id || selectedParcelle.id;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#e2e8f0", overflow: "hidden", marginBottom: 12 }}>
        <View style={{ padding: 14, backgroundColor: "#f8fafc", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <MapPin size={14} color="#16a34a" strokeWidth={2.5} />
              <Text style={{ fontSize: 10, fontWeight: "800", color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.8 }}>
                Localisation
              </Text>
            </View>
            <View style={{ backgroundColor: "#1e293b", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#fff", letterSpacing: 0.5 }}>
                SECTION {section}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#64748b", fontWeight: "500" }}>
            Parcelle n°{" "}
            <Text style={{ color: "#1e293b", fontWeight: "700" }}>{numero}</Text>
          </Text>
        </View>

        <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" }}>
          <StatCell icon={Maximize2} label="Surface" value={formatSurface(contenance)} bordered />
          <StatCell
            icon={Landmark}
            label="Département"
            value={code_dep !== "—" ? `INSEE ${properties.commune} (${code_dep})` : "—"}
          />
        </View>

        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <FileText size={11} color="#94a3b8" />
              <Text style={LABEL_STYLE}>Référence Cadastrale</Text>
            </View>
            <View style={{ backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontFamily: "monospace", color: "#475569", fontWeight: "600" }}>
                {idParcelle}
              </Text>
            </View>
          </View>
          {properties.updated && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#f1f5f9" }}>
              <Calendar size={11} color="#94a3b8" />
              <Text style={{ fontSize: 10, color: "#94a3b8" }}>
                Mis à jour le :{" "}
                <Text style={{ fontWeight: "600" }}>{formatDate(properties.updated)}</Text>
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Text style={{ fontSize: 9, fontWeight: "800", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: 1.5 }}>
          Catégories d'informations
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
      </View>

      <BuildingsWidget feature={feature} />
      <DvfWidget feature={feature} />
      <MeteoWidget feature={feature} />
      <GpuUrbanAreasWidget feature={feature} />
      <GpuPrescriptionsWidget feature={feature} />
      <GpuInformationsWidget feature={feature} />
    </ScrollView>
  );
};

export default ParcelleInfoCard;
