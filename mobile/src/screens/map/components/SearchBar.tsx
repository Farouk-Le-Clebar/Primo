import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator, Keyboard } from 'react-native';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Search, X } from 'lucide-react-native';

type SearchBarProps = {
    onAddressSelect: (coords: [number, number]) => void;
    onClearSearch?: () => void;
    onFocus?: () => void;
}

const addOkRequest = (data: string) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    return axios.get(`${apiUrl}/addok/search?q=${data}`)
        .then(response => response.data)
        .catch(() => {
            throw new Error('Failed to fetch data from Addok API');
        });
}

const SearchBar = ({ onAddressSelect, onClearSearch, onFocus }: SearchBarProps) => {
    const [address, setAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [adressList, setAdressList] = useState<any[]>([]);
    const [debouncedAddress, setDebouncedAddress] = useState(address);

    const { mutate: getAddress, isPending } = useMutation({
        mutationFn: (address: string) => addOkRequest(address),
        onSuccess: (data: any) => {
            setAdressList(data.features || []);
        },
        onError: () => {
            setAdressList([]);
        },
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedAddress(address);
        }, 250);

        return () => {
            clearTimeout(handler);
        };
    }, [address]);

    useEffect(() => {
        // Ne pas faire de recherche si une adresse a été sélectionnée
        if (selectedAddress) {
            return;
        }
        
        if (debouncedAddress.trim() !== "") {
            getAddress(debouncedAddress);
        } else {
            setAdressList([]);
        }
    }, [debouncedAddress, selectedAddress]);

    const handleAddressClick = (coords: [number, number], label: string) => {
        setSelectedAddress(label);
        setAddress(label);
        setAdressList([]);
        onAddressSelect(coords);
    };

    return (
        <View className="w-full">
            <View className="relative">
                <View 
                    className="flex-row bg-white rounded-lg shadow-lg items-center border border-gray-100 pl-3 pr-2" 
                    style={{ height: 44 }}
                >
                    <Search size={18} color="#64748b" strokeWidth={2.5} />
                    
                    <TextInput
                        className="flex-1 text-[13px] ml-2 text-slate-800 font-semibold"
                        style={{ padding: 0, margin: 0 }}
                        placeholder="Rechercher une adresse..."
                        placeholderTextColor="#94a3b8"
                        value={selectedAddress || address}
                        onChangeText={(text) => {
                            setAddress(text);
                            setSelectedAddress(null);
                        }}
                        onFocus={onFocus}
                        returnKeyType="search"
                    />
                    
                    <View className="justify-center flex-row items-center ml-1">
                        {isPending ? (
                            <ActivityIndicator size="small" color="#2563eb" style={{ marginRight: 6 }} />
                        ) : address.length > 0 ? (
                            <TouchableOpacity
                                onPress={() => {
                                    setAddress("");
                                    setSelectedAddress(null);
                                    setAdressList([]);
                                    onClearSearch?.();
                                }}
                                className="p-1.5 rounded-full bg-slate-100"
                            >
                                <X size={14} color="#64748b" strokeWidth={2.5} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>

            {adressList.length > 0 && (
                <View 
                    className="absolute w-full top-[50px] border border-gray-200 rounded-xl bg-white shadow-xl overflow-hidden"
                    style={{ zIndex: 50, maxHeight: 260 }}
                >
                    <FlatList
                        data={adressList}
                        keyExtractor={(item) => item.properties.id}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="px-4 py-3.5 border-b border-gray-100 bg-white active:bg-slate-50 flex-row items-center gap-3"
                                onPress={() => {
                                    Keyboard.dismiss();
                                    handleAddressClick(
                                        [item.geometry.coordinates[1], item.geometry.coordinates[0]],
                                        item.properties.label
                                    );
                                }}
                            >
                                <Search size={14} color="#94a3b8" />
                                <Text className="text-[13px] font-semibold text-slate-700 flex-1" numberOfLines={1}>
                                    {item.properties.label}
                                </Text>
                            </TouchableOpacity>
                        )}
                        nestedScrollEnabled
                    />
                </View>
            )}
        </View>
    );
};

export default SearchBar;