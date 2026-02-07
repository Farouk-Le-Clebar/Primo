import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type SearchBarProps = {
    onAddressSelect: (coords: [number, number]) => void;
}

const addOkRequest = (data: string) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    return axios.get(`${apiUrl}/addok/search?q=${data}`)
        .then(response => response.data)
        .catch(() => {
            throw new Error('Failed to fetch data from Addok API');
        });
}

const SearchBar = ({ onAddressSelect }: SearchBarProps) => {
    const [address, setAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [adressList, setAdressList] = useState<any[]>([]);
    const [debouncedAddress, setDebouncedAddress] = useState(address);

    const { mutate: getAddress, isPending } = useMutation({
        mutationFn: (address: string) => addOkRequest(address),
        onSuccess: (data: any) => {
            setAdressList(data.features || []);
            console.log('Fetched addresses:', data.features || []);
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
                <View className="flex-row bg-white rounded-lg shadow-lg items-center">
                    <Text className="absolute left-3 text-gray-700 text-base z-10">🔍</Text>
                    <TextInput
                        className="flex-1 text-sm pl-10 pr-3 py-2.5 rounded-lg"
                        placeholder="Rechercher une adresse..."
                        value={selectedAddress || address}
                        onChangeText={(text) => {
                            setAddress(text);
                            setSelectedAddress(null);
                        }}
                        returnKeyType="search"
                    />
                    {isPending && (
                        <ActivityIndicator size="small" color="#666" className="mr-3" />
                    )}
                </View>
            </View>

            {adressList.length > 0 && (
                <View className="w-full border border-gray-300 rounded-xl bg-white mt-1 shadow-lg max-h-60 overflow-hidden">
                    <FlatList
                        data={adressList}
                        keyExtractor={(item) => item.properties.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-3 border-b border-gray-100 active:bg-gray-200"
                                onPress={() => handleAddressClick(
                                    [item.geometry.coordinates[1], item.geometry.coordinates[0]],
                                    item.properties.label
                                )}
                            >
                                <Text className="text-sm text-gray-800">{item.properties.label}</Text>
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