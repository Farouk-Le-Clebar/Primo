import { useEffect, useRef } from "react";
import { View, Animated, Pressable, Dimensions } from "react-native";
import { ParcellePayload } from "../../../types/map";
import ParcelleInfoCard from "./ParcelleInfoCard";

type ParcelleInfoPanelProps = {
    selectedParcelle: ParcellePayload | null;
    onClose?: () => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.75;

const ParcelInfoPanel = ({ selectedParcelle, onClose }: ParcelleInfoPanelProps) => {
    const translateY = useRef(new Animated.Value(PANEL_HEIGHT)).current;

    useEffect(() => {
        if (selectedParcelle) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: PANEL_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [selectedParcelle, translateY]);

    if (!selectedParcelle) return null;

    return (
        <>
            <Pressable
                className="absolute inset-0 bg-black/30"
                onPress={onClose}
            />

            <Animated.View
                className="absolute bottom-0 left-0 right-0 bg-[#F4F5F7] rounded-t-2xl p-4 shadow-xl"
                style={[
                    { height: PANEL_HEIGHT },
                    { transform: [{ translateY }] },
                ]}
            >
                <ParcelleInfoCard />
            </Animated.View>
        </>
    );
};

export default ParcelInfoPanel