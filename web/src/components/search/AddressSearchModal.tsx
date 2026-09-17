import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export default function AddressSearchModal({
  isOpen,
  onClose,
  onAdressSelect,
}: AddressSearchModalProps) {
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");
  const [debouncedAddress, setDebouncedAddress] = useState("");
  const { mutate: saveHistory } = useMutation({
    mutationFn: ({
      label,
      lat,
      lng,
    }: {
      label: string;
      lat: number;
      lng: number;
    }) => saveUserSearchHistory(label, lat, lng),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] }),
  });
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedAddress(address.trim()), 250);
    return () => clearTimeout(timeout);
  }, [address]);
  useEffect(() => {
    if (!isOpen) {
      setAddress("");
      setDebouncedAddress("");
    }
  }, [isOpen]);
  const search = useQuery({
    queryKey: ["address-search", debouncedAddress],
    queryFn: () => addOkRequest(debouncedAddress),
    enabled: isOpen && debouncedAddress.length >= 3,
    staleTime: 60000,
    retry: false,
  });
  const waiting = address.trim() !== debouncedAddress || search.isFetching;
  const handleSelect = (coords: [number, number], label: string) => {
    saveHistory({ label, lat: coords[0], lng: coords[1] });
    onAdressSelect(coords);
    onClose();
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[2500]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 overflow-y-auto px-4 pt-[12vh]">
        <DialogPanel className="mx-auto w-full max-w-[600px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-[#262626] dark:bg-[#171717]">
          <DialogTitle className="sr-only">
            Rechercher une adresse ou une ville
          </DialogTitle>
          <SearchInput
            address={address}
            setAddress={setAddress}
            isPending={waiting && address.trim().length >= 3}
            onClose={onClose}
          />
          <div
            className="max-h-[min(400px,55vh)] overflow-y-auto p-2 scrollbar-custom"
            aria-live="polite"
          >
            {!address.trim() ? (
              <SearchHistoryList onSelect={handleSelect} />
            ) : address.trim().length < 3 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                Saisissez au moins 3 caractères pour rechercher.
              </p>
            ) : waiting ? (
              <p
                role="status"
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                Recherche des adresses…
              </p>
            ) : search.isError ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                <p>La recherche est momentanément indisponible.</p>
                <button
                  onClick={() => void search.refetch()}
                  className="mt-3 font-medium text-emerald-700 underline dark:text-emerald-400"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <SearchResultsList
                adressList={search.data?.features || []}
                addressQuery={address}
                isPending={false}
                onSelect={handleSelect}
              />
            )}
          </div>
          <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400 dark:border-white/5">
            Adresse, code postal ou ville · Sélectionnez un résultat pour le
            voir sur la carte.
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
