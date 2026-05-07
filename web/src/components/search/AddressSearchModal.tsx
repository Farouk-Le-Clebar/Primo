import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// COMPONENTS
import { addOkRequest } from "../../requests/addok";
import { saveUserSearchHistory } from "../../requests/UserRequests";
import SearchInput from "./components/SearchInput";
import SearchHistoryList from "./components/SearchHistoryList";
import SearchResultsList from "./components/SearchResultsList";

type AddressSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdressSelect: (coords: [number, number]) => void;
};

export default function AddressSearchModal({ isOpen, onClose, onAdressSelect }: AddressSearchModalProps) {
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");
  const [debouncedAddress, setDebouncedAddress] = useState(address);
  const [adressList, setAdressList] = useState<any[]>([]);

  const { mutate: saveHistory } = useMutation({
    mutationFn: ({ label, lat, lng }: { label: string, lat: number, lng: number }) => saveUserSearchHistory(label, lat, lng),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["searchHistory"] })
  });

  const { mutate: getAddress, isPending } = useMutation({
    mutationFn: (search: string) => addOkRequest(search),
    onSuccess: (data: any) => setAdressList(data?.features || []),
    onError: () => setAdressList([]),
  });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedAddress(address), 250);
    return () => clearTimeout(handler);
  }, [address]);

  useEffect(() => {
    if (debouncedAddress.trim() !== "") {
      getAddress(debouncedAddress);
    } else {
      setAdressList([]);
    }
  }, [debouncedAddress, getAddress]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setAddress("");
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const handleSelect = (coords: [number, number], label: string) => {
    saveHistory({ label, lat: coords[0], lng: coords[1] });
    onAdressSelect(coords);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-150" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative w-full max-w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        
        <SearchInput address={address} setAddress={setAddress} isPending={isPending} />

        <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {address.trim() === "" ? (
            <SearchHistoryList onSelect={handleSelect} /> 
          ) : (
            <SearchResultsList adressList={adressList} addressQuery={address} isPending={isPending} onSelect={handleSelect} />
          )}
        </div>

      </div>
    </div>
  );
}