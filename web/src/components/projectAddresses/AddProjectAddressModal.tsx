import { useState } from "react";
import { X } from "lucide-react";
import { Button, Dialog, DialogPanel, Textarea } from "@tremor/react";
import { useAddProjectAddress } from "../../hooks/useProjectAddresses";
import type { AddressSuggestion } from "../../hooks/useAddokSuggestions";
import AddressAutocomplete from "./AddressAutocomplete";
import ProjectSelect from "./ProjectSelect";

type AddProjectAddressModalProps = {
    onClose: () => void;
    projectId?: string;
};

const LABEL_CLASS = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
const DESCRIPTION_MAX_LENGTH = 500;

const AddProjectAddressModal = ({ onClose, projectId }: AddProjectAddressModalProps) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId ?? "");
    const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
    const [description, setDescription] = useState("");
    const { mutate: addAddress, isPending } = useAddProjectAddress(onClose);
    const canSubmit = !!selectedProjectId && !!selectedAddress && !isPending;

    const handleSubmit = () => {
        if (!selectedAddress) return;
        addAddress({
            projectId: selectedProjectId,
            payload: {
                address: selectedAddress.label,
                latitude: selectedAddress.latitude,
                longitude: selectedAddress.longitude,
                description: description.trim() || undefined,
            },
        });
    };

    return (
        <Dialog open onClose={onClose} static={true} className="z-[9999]">
            <DialogPanel className="sm:max-w-md bg-white dark:bg-[#171717] border border-gray-100 dark:border-white/10 transition-colors ring-0 dark:ring-0">
                <div className="absolute right-0 top-0 pr-3 pt-3">
                    <button
                        type="button"
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-white/5 dark:hover:text-white transition-colors cursor-pointer"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" aria-hidden={true} />
                    </button>
                </div>

                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pr-6">
                    Ajouter une adresse
                </h4>

                <div className="flex flex-col gap-5">
                    {!projectId && (
                        <div>
                            <label className={LABEL_CLASS}>Projet</label>
                            <ProjectSelect value={selectedProjectId} onChange={setSelectedProjectId} />
                        </div>
                    )}
                    <div>
                        <label className={LABEL_CLASS}>Adresse</label>
                        <AddressAutocomplete selected={selectedAddress} onSelect={setSelectedAddress} />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>Description (facultative)</label>
                        <Textarea
                            value={description}
                            onValueChange={setDescription}
                            maxLength={DESCRIPTION_MAX_LENGTH}
                            rows={3}
                            placeholder="Ex. agence, client, chantier..."
                            className="dark:bg-[#0A0A0A] dark:border-white/10"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="dark:border-white/10 dark:!text-white dark:hover:bg-white/5 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            loading={isPending}
                            className="dark:bg-white dark:text-black dark:hover:bg-gray-200 border-transparent hover:border-transparent bg-black hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            Ajouter l'adresse
                        </Button>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    );
};

export default AddProjectAddressModal;
