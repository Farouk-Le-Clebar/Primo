import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import SearchBar from "./components/SearchBar";
import Map from "./components/Map";

const MapScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation() as any;

  const [mapCenter, setMapCenter] = useState({ lat: 46.603354, lng: 1.888334 });
  const [mapZoom, setMapZoom] = useState(6);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [selectedShape, setSelectedShape] = useState<any>(null);
  const [searchMarker, setSearchMarker] = useState<[number, number] | null>(
    null,
  );
  const [clearTrigger, setClearTrigger] = useState(0);

  const handleAddressSelect = (coords: [number, number]) => {
    setMapCenter({ lat: coords[0], lng: coords[1] });
    setMapZoom(18);
    setSearchMarker(coords);
  };

  const handleClearSearch = () => {
    setSearchMarker(null);
  };

  const handleMapMessage = (message: any) => {
    if (message.event === "onMoveEnd" || message.event === "onZoomEnd") {
      const bounds = message?.payload?.bounds;
      const zoom = message?.payload?.zoom;

      if (bounds) {
        setMapBounds({
          _southWest: bounds._southWest,
          _northEast: bounds._northEast,
        });
      }
      if (zoom !== undefined) {
        setMapZoom(zoom);
      }
    }

    if (message.event === "onShapeClick") {
      setSelectedShape(message.payload);
    }

    if (message.event === "onMapClick") {
      setSelectedShape(null);
    }
  };

  return (
    <View className="flex-1">
      <View
        className="absolute left-3 right-3 z-10 flex-row items-start gap-2"
        style={{ top: Math.max(insets.top + 8, 12) }}
      >
        <View className="flex-1" style={{ zIndex: 20 }}>
          <SearchBar
            onAddressSelect={handleAddressSelect}
            onClearSearch={handleClearSearch}
            onFocus={() => {
              setSelectedShape(null);
              setClearTrigger((c) => c + 1);
            }}
          />
        </View>

        <Pressable
          onPress={() => navigation.navigate("Dashboard")}
          className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 justify-center items-center"
          style={{ height: 44, width: 44 }}
        >
          <ChevronRight size={20} color="#64748b" strokeWidth={2.5} />
        </Pressable>
      </View>

      <Map
        center={mapCenter}
        zoom={mapZoom}
        onMessageReceived={handleMapMessage}
        bounds={mapBounds}
        searchMarker={searchMarker}
        externalClearTrigger={clearTrigger}
      />
    </View>
  );
};

export default MapScreen;
