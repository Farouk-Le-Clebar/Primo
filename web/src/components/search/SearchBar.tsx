import { useState, useEffect } from "react";
import { addOkRequest } from "../../requests/addok";
import { useMutation } from "@tanstack/react-query";
import { Search } from 'lucide-react';

interface AddressFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    label: string;
  };
}

interface SearchBarProps {
  onAddressSelect?: (coords: [number, number], label: string) => void;
}

const SearchBar = ({ onAddressSelect }: SearchBarProps) => {
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<AddressFeature[]>([]);
  const [debouncedAddress, setDebouncedAddress] = useState(address);

  const { mutate: getAddress } = useMutation({
    mutationFn: (address: string) => addOkRequest(address),
    onSuccess: (data: any) => {
      setSelectedAddress(data.features || []);
    },
    onError: () => {
      setSelectedAddress([]);
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
    if (debouncedAddress.trim() !== "") {
      getAddress(debouncedAddress);
    } else {
      setSelectedAddress([]);
    }
  }, [debouncedAddress]);

  const handleAddressClick = (feature: AddressFeature) => {
    setAddress(feature.properties.label);
    setSelectedAddress([]);

    if (onAddressSelect && feature.geometry?.coordinates) {
      const [lng, lat] = feature.geometry.coordinates;
      onAddressSelect([lat, lng], feature.properties.label);
    }
  };

  return (
    <div className="flex w-full items-center">
      <div className="relative w-full h-full">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4" />

        {/* Input */}
        <input
          className="w-full rounded-lg h-9 pl-10 pr-2 focus:outline-none shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-white text-sm"
          type="text"
          placeholder="Rechercher une adresse..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          />
      </div>
      {selectedAddress.length > 0 && (
        <div className="absolute w-full flex flex-col border border-gray-300 rounded-xl bg-white mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
          {selectedAddress.map((feature, index) => (
            <button
              key={`${feature.properties.label}-${index}`}
              className="h-10 text-left p-2 hover:bg-gray-200 rounded-xl cursor-pointer"
              onClick={() => handleAddressClick(feature)}
            >
              {feature.properties.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
