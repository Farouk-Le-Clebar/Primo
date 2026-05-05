import { Search, Clock, MapPin } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { addOkRequest } from "../../requests/addok";

type AddressSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdressSelect: (coords: [number, number]) => void;
};

const RECENT_SEARCHES = [
  { id: 1, label: "40 boulevard de la marquette, Toulouse", coords: [43.6111, 1.4328] as [number, number] },
  { id: 2, label: "15 Rue de la Paix, Paris", coords: [48.8698, 2.3322] as [number, number] },
  { id: 3, label: "10 Place Bellecour, Lyon", coords: [45.7578, 4.8320] as [number, number] }
];

export default function AddressSearchModal({ isOpen, onClose, onAdressSelect }: AddressSearchModalProps) {
  const [address, setAddress] = useState("");
  const [debouncedAddress, setDebouncedAddress] = useState(address);
  const [adressList, setAdressList] = useState<any[]>([]);

  const { mutate: getAddress, isPending } = useMutation({
    mutationFn: (search: string) => addOkRequest(search),
    onSuccess: (data: any) => {
      if (data && data.features) {
        setAdressList(data.features);
      } else {
        setAdressList([]);
      }
    },
    onError: () => setAdressList([]),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAddress(address);
    }, 250);
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

  const handleSelect = (coords: [number, number]) => {
    onAdressSelect(coords);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-150" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative w-full max-w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 shrink-0">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            autoFocus
            type="text"
            placeholder="Rechercher une adresse, une ville..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 bg-transparent text-[15px] outline-none text-gray-900 placeholder-gray-400 font-inter"
          />
          
          {isPending && <span className="text-xs text-gray-400 mr-2 animate-pulse">Recherche...</span>}

          <div className="flex items-center gap-1.5 border border-gray-200 rounded-md px-2 py-1 bg-gray-50/50 select-none ml-2 shrink-0">
            <span className="text-[10px] font-mono font-bold text-gray-400">ESC</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          
          {address.trim() === "" ? (
            <div className="mb-2">
              <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider select-none">
                Recherches récentes
              </div>
              {RECENT_SEARCHES.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => handleSelect(item.coords)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer text-left"
                >
                  <Clock className="text-gray-300 shrink-0" size={16} />
                  <span className="text-[13.5px] font-medium truncate">{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            adressList.length > 0 ? (
              <div className="mb-2">
                <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider select-none">
                  Résultats d'adresses
                </div>
                {adressList.map((feature: any) => (
                  <button
                    key={feature.properties.id || feature.properties.label}
                    onClick={() => handleSelect([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer text-left"
                  >
                    <MapPin className="text-gray-300 shrink-0" size={16} />
                    <span className="text-[13.5px] font-medium truncate">{feature.properties.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              !isPending && (
                <div className="px-4 py-10 text-center flex flex-col items-center justify-center text-gray-400">
                  <MapPin className="mb-2 opacity-20" size={32} />
                  <span className="text-[13px] italic">Aucune adresse trouvée pour "{address}"</span>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}