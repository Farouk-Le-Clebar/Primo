import React from 'react';
import { ActivityIndicator } from 'react-native';
import { LeafletView } from 'react-native-leaflet-view';
import { useMapHtml } from '../hooks/useMapHtml';

interface MapProps {
    center: { lat: number; lng: number };
    zoom: number;
    onMessageReceived: (message: any) => void;
}

const Map: React.FC<MapProps> = ({ center, zoom, onMessageReceived }) => {
    const { htmlContent, loading } = useMapHtml();

    if (loading || !htmlContent) {
        return <ActivityIndicator size="large" />
    }

    return (
        <LeafletView
            doDebug={false}
            source={{ html: htmlContent }}
            mapCenterPosition={center}
            zoom={zoom}
            zoomControl={false}
            onMessageReceived={onMessageReceived}
            mapLayers={[
                {
                    baseLayerIsChecked: true,
                    baseLayerName: 'OpenStreetMap',
                    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                },
            ]}
        />
    );
};

export default Map;
