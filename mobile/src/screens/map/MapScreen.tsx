import React, { useState } from 'react';
import { View } from "react-native"
import SearchBar from './components/SearchBar';
import Map from './components/Map';
import { boundToBbox } from '../../utils/map';

const MapScreen = () => {
    const [mapCenter, setMapCenter] = useState({ lat: 46.603354, lng: 1.888334 });
    const [mapZoom, setMapZoom] = useState(6);
    const [mapBounds, setMapBounds] = useState<any>(null);

    const handleAddressSelect = (coords: [number, number]) => {
        setMapCenter({ lat: coords[0], lng: coords[1] });
        setMapZoom(18);
    }

    const handleMapMessage = (message: any) => {
        if (message.event === 'onMoveEnd' || message.event === 'onZoomEnd') {
            const bounds = message?.payload?.bounds;
            if (bounds) {
                setMapBounds(bounds);
                console.log("mapbounds:", boundToBbox(bounds));
            }
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