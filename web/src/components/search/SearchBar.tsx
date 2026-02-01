import { useState, useEffect } from "react";
import { addOkRequest } from "../../requests/addok";
import { useMutation } from "@tanstack/react-query";
import { Search } from 'lucide-react';

type SearchBarProps = {
  onAdressSelect: (coords: [number, number]) => void;
}

const SearchBar = ({ onAdressSelect }: SearchBarProps) => {
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  
  const [adressList, setAdressList] = useState<any[]>([]);
  const [debouncedAddress, setDebouncedAddress] = useState(address);

  const { mutate: getAddress } = useMutation({
    mutationFn: (address: string) => addOkRequest(address),
    onSuccess: (data: any) => {
      if (data && data.features) {
        setAdressList(data.features);
      } else {
        setAdressList([]);
      }
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
    if (debouncedAddress.trim() !== "") {
      getAddress(debouncedAddress);
    } else {
      setAdressList([]);
    }
  }, [debouncedAddress, getAddress]);

  const handleAddressClick = (coords: [number, number], label: string) => {
    setSelectedAddress(label);
    setAdressList([]);
    onAdressSelect(coords);
  };

  return (
    <div className="relative flex w-full flex-col">
      <div className="relative w-full h-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4" />
        <input
          className="w-full rounded-xl h-9 pl-10 pr-2 focus:outline-none bg-[#EFEFF4] text-sm"
          type="text"
          placeholder="Rechercher une adresse..."
          value={selectedAddress ? selectedAddress : address}
          onChange={(e) => {
            setAddress(e.target.value); 
            setSelectedAddress(null);
          }}
        />
      </div>

      {adressList && adressList.length > 0 && (
        <div className="absolute top-full left-0 w-full flex flex-col border border-gray-300 rounded-xl bg-white mt-1 shadow-lg z-[2000] max-h-60 overflow-y-auto">
          {adressList.map((feature: any) => (
            <button
              key={feature.properties.id || feature.properties.label}
              className="h-10 text-left p-2 hover:bg-gray-200 rounded-xl cursor-pointer text-sm"
              onClick={() => handleAddressClick(
                [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 
                feature.properties.label
              )}
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