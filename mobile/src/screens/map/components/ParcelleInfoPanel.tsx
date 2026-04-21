import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Pressable, Dimensions, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { ChevronLeft, MapPin } from "lucide-react-native";
import { ParcellePayload } from "../../../types/map";
import ParcelleInfoCard from "./ParcelleInfoCard";

type ParcelleInfoPanelProps = {
    selectedParcelle: ParcellePayload | null;
    onClose?: () => void;
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.85;

const ParcelInfoPanel = ({ selectedParcelle, onClose }: ParcelleInfoPanelProps) => {
    const translateY = useRef(new Animated.Value(PANEL_HEIGHT)).current;
    const progressTranslateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    const navigation = useNavigation() as any;
    
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const isLoading = isFetching > 0 || isMutating > 0;
    
    const [renderedParcelle, setRenderedParcelle] = useState<ParcellePayload | null>(selectedParcelle);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 120 || gestureState.vy > 1.2) {
                    Animated.timing(translateY, {
                        toValue: PANEL_HEIGHT,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        if (onClose) onClose();
                    });
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        tension: 65,
                        friction: 11,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (selectedParcelle) {
            setRenderedParcelle(selectedParcelle);
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else if (renderedParcelle) {
            Animated.timing(translateY, {
                toValue: PANEL_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start(() => {
                setRenderedParcelle(null);
            });
        }
    }, [selectedParcelle, translateY]);

    useEffect(() => {
        if (isLoading) {
            progressTranslateX.setValue(-SCREEN_WIDTH * 0.5);
            Animated.loop(
                Animated.timing(progressTranslateX, {
                    toValue: SCREEN_WIDTH,
                    duration: 1200,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            progressTranslateX.stopAnimation();
        }
    }, [isLoading, progressTranslateX]);

    if (!renderedParcelle) return null;

    const parcelId = renderedParcelle.properties?.id || renderedParcelle.id || "Parcelle inconnue";

    return (
        <>
            <Pressable
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}
                onPress={onClose}
            />

            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: PANEL_HEIGHT,
                        backgroundColor: '#f4f5f7',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 20,
                        overflow: 'hidden',
                    },
                    { transform: [{ translateY }] }
                ]}
            >
                <View 
                    {...panResponder.panHandlers}
                    style={{
                        backgroundColor: '#fff',
                        paddingTop: 12,
                        paddingBottom: 14,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e2e8f0',
                    }}
                >
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <View style={{ width: 36, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2 }} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 7,
                                backgroundColor: pressed ? '#f1f5f9' : '#f8fafc',
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#e2e8f0',
                            }]}
                        >
                            <ChevronLeft size={20} color="#64748b" strokeWidth={2.5} />
                        </Pressable>

                        <View style={{ alignItems: 'center', flex: 1, paddingHorizontal: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ backgroundColor: '#16a34a', padding: 5, borderRadius: 7 }}>
                                    <MapPin size={14} color="#fff" strokeWidth={2.5} />
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: '800', color: '#1e293b' }}>Détails Parcelle</Text>
                            </View>
                            <Text style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2 }} numberOfLines={1}>
                                {parcelId}
                            </Text>
                        </View>

                        <View style={{ width: 36 }} />
                    </View>
                </View>

                <View style={{ height: 2, backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                    {isLoading && (
                        <Animated.View style={{ 
                            height: '100%', 
                            width: '40%', 
                            backgroundColor: '#2563eb',
                            transform: [{ translateX: progressTranslateX }]
                        }} />
                    )}
                </View>

                <View style={{ flex: 1, padding: 14 }}>
                    <ParcelleInfoCard selectedParcelle={renderedParcelle} />
                </View>
            </Animated.View>
        </>
    );
};

export default ParcelInfoPanel;