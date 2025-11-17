import { useState, useEffect } from "react";
import { addOkRequest } from "../../request/addok";
import { useMutation } from "@tanstack/react-query";

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
    <div className="relative w-full">
      <input
        className="w-full rounded-xl h-10 p-2 border border-gray-400 focus:outline-none shadow-md bg-white"
        type="text"
        placeholder="Rechercher une adresse..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
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
