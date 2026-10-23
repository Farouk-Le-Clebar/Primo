import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAddressSearch } from "../../hooks/useAddressSearch";
import SearchInput from "./components/SearchInput";
import AddressSearchBody from "./components/AddressSearchBody";

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
  const state = useAddressSearch(isOpen, onAdressSelect, onClose);
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[2500]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 overflow-y-auto px-4 pt-[12vh]">
        <DialogPanel transition className="mx-auto w-full max-w-[600px] origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-[#262626] dark:bg-[#171717]">
          <DialogTitle className="sr-only">
            Rechercher une adresse ou une ville
          </DialogTitle>
          <SearchInput
            address={state.address}
            setAddress={state.setAddress}
            isPending={state.waiting && state.address.trim().length >= 3}
            onClose={onClose}
          />
          <div
            className="max-h-[min(400px,55vh)] overflow-y-auto p-2 scrollbar-custom"
            aria-live="polite"
          >
            <AddressSearchBody state={state} />
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
