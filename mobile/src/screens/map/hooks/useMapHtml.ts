import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";

export const useMapHtml = () => {
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadHtml = async () => {
            try {
                const path = require("../../../../assets/leaflet-custom.html");
                const asset = Asset.fromModule(path);
                await asset.downloadAsync();
                const content = await FileSystem.readAsStringAsync(asset.localUri!);

                if (isMounted) {
                    setHtmlContent(content);
                    setLoading(false);
                }
            } catch (error) {
                Alert.alert('Error loading HTML', JSON.stringify(error));
                console.error('Error loading HTML:', error);
                setLoading(false);
            }
        };

        loadHtml();

        return () => {
            isMounted = false;
        };
    }, []);

    return { htmlContent, loading };
};