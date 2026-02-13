import React, { useState } from 'react';
import { View, Text } from "react-native"
import SearchBar from './components/SearchBar';
import Map from './components/Map';

const MapScreen = () => {
    const [mapCenter, setMapCenter] = useState({ lat: 46.603354, lng: 1.888334 });
    const [mapZoom, setMapZoom] = useState(6);
    const [mapBounds, setMapBounds] = useState<any>(null);
    const [selectedShape, setSelectedShape] = useState<any>(null);

    const handleAddressSelect = (coords: [number, number]) => {
        setMapCenter({ lat: coords[0], lng: coords[1] });
        setMapZoom(18);
    }

    const handleMapMessage = (message: any) => {
        if (message.event === 'onMoveEnd' || message.event === 'onZoomEnd') {
            const bounds = message?.payload?.bounds;
            const zoom = message?.payload?.zoom;

            if (bounds) {
                setMapBounds({
                    _southWest: bounds._southWest,
                    _northEast: bounds._northEast
                });
            }
            if (zoom !== undefined) {
                setMapZoom(zoom);
            }
        }

        if (message.event === 'onShapeClick') {
            setSelectedShape(message.payload);
        }

        if (message.event === 'onMapClick') {
            setSelectedShape(null);
        }
    };

    return (
        <View className='flex-1'>
            <View className="absolute top-12 left-3 right-3 z-10">
                <SearchBar onAddressSelect={handleAddressSelect} />
            </View>

            <Map
                center={mapCenter}
                zoom={mapZoom}
                onMessageReceived={handleMapMessage}
                bounds={mapBounds}
            />

        </View>
    )
}

export default MapScreen