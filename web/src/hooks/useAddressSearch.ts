import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addOkRequest } from "../requests/addok";
import { saveUserSearchHistory } from "../requests/UserRequests";

type SearchHistoryEntry = {
  label: string;
  lat: number;
  lng: number;
};

export function useAddressSearch(
  isOpen: boolean,
  onAdressSelect: (coords: [number, number]) => void,
  onClose: () => void,
) {
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");
  const [debouncedAddress, setDebouncedAddress] = useState("");
  const { mutate: saveHistory } = useMutation({
    mutationFn: ({ label, lat, lng }: SearchHistoryEntry) =>
      saveUserSearchHistory(label, lat, lng),
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
  return { address, setAddress, search, waiting, handleSelect };
}

export type AddressSearchState = ReturnType<typeof useAddressSearch>;
