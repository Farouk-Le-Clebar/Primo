import React, { useState } from 'react';
import { View } from "react-native"
import SearchBar from './components/SearchBar';
import Map from './components/Map';

const MapScreen = () => {
    const [mapCenter, setMapCenter] = useState({ lat: 46.603354, lng: 1.888334 });
    const [mapZoom, setMapZoom] = useState(6);
    const [mapBounds, setMapBounds] = useState<any>(null);

    const handleAddressSelect = (coords: [number, number]) => {
        console.log('Moving to:', coords);
        setMapCenter({ lat: coords[0], lng: coords[1] });
        setMapZoom(18);
    }

    const handleMapMessage = (message: any) => {
        console.log('Message from map:', message);

        if (message.event === 'onMoveEnd' || message.event === 'onZoomEnd') {
            const bounds = message.payload?.mapBounds;
            if (bounds) {
                setMapBounds(bounds);
                console.log('Map bounds:', bounds);
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
            />
        </View>
    )
}

export default MapScreen